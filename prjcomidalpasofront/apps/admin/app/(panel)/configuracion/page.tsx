'use client'

import { useEffect, useState } from 'react'
import { Plus, Trash2, RefreshCw } from 'lucide-react'
import { useRestauranteStore } from '@/store/restauranteStore'
import {
  listarRestaurantes,
  actualizarRestaurante,
  toggleRestaurante,
  crearRestaurante,
  listarMesas,
  crearMesa,
  eliminarMesa,
  listarUsuarios,
} from '@/lib/services/adminApiService'
import type { RestauranteDTO, MesaDTO } from '@/lib/services/types'
import type { UsuarioDTO } from '@/lib/services/authApiService'

export default function ConfiguracionPage() {
  const restaurante = useRestauranteStore((s) => s.restaurante)
  const seleccionar = useRestauranteStore((s) => s.seleccionar)

  const [actual, setActual] = useState<RestauranteDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [guardando, setGuardando] = useState(false)
  const [mesas, setMesas] = useState<MesaDTO[]>([])
  const [nuevaMesa, setNuevaMesa] = useState({ numero: '', capacidad: '4' })

  // alta de restaurante nuevo
  const [mostrarAlta, setMostrarAlta] = useState(false)
  const [usuariosRestaurante, setUsuariosRestaurante] = useState<UsuarioDTO[]>([])
  const [altaForm, setAltaForm] = useState({ usuarioId: '', nombre: '', direccion: '', telefono: '' })
  const [creando, setCreando] = useState(false)

  async function cargar() {
    if (!restaurante) return
    setLoading(true)
    try {
      const [lista, mesasData] = await Promise.all([listarRestaurantes(), listarMesas(restaurante.id)])
      setActual(lista.find((r) => r.id === restaurante.id) ?? null)
      setMesas(mesasData)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (restaurante) cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurante])

  async function guardarDatos() {
    if (!restaurante || !actual) return
    setGuardando(true)
    try {
      await actualizarRestaurante(restaurante.id, {
        nombre: actual.nombre,
        direccion: actual.direccion,
        telefono: actual.telefono ?? undefined,
        aceptaRecojo: actual.aceptaRecojo,
        aceptaDelivery: actual.aceptaDelivery,
        aceptaSalon: actual.aceptaSalon,
      })
      seleccionar({ id: restaurante.id, nombre: actual.nombre })
    } finally {
      setGuardando(false)
    }
  }

  async function handleToggleActivo() {
    if (!restaurante || !actual) return
    await toggleRestaurante(restaurante.id, !actual.activo)
    cargar()
  }

  async function handleAgregarMesa() {
    if (!restaurante || !nuevaMesa.numero) return
    await crearMesa({ restauranteId: restaurante.id, numero: nuevaMesa.numero, capacidad: Number(nuevaMesa.capacidad) })
    setNuevaMesa({ numero: '', capacidad: '4' })
    cargar()
  }

  async function handleEliminarMesa(id: string) {
    await eliminarMesa(id)
    cargar()
  }

  async function abrirAlta() {
    setMostrarAlta(true)
    setUsuariosRestaurante(await listarUsuarios('restaurante'))
  }

  async function handleCrearRestaurante() {
    if (!altaForm.usuarioId || !altaForm.nombre || !altaForm.direccion) return
    setCreando(true)
    try {
      const { id } = await crearRestaurante({
        usuarioId: altaForm.usuarioId,
        nombre: altaForm.nombre,
        direccion: altaForm.direccion,
        telefono: altaForm.telefono || undefined,
        aceptaRecojo: true,
        aceptaDelivery: false,
        aceptaSalon: false,
      })
      seleccionar({ id, nombre: altaForm.nombre })
      setMostrarAlta(false)
      setAltaForm({ usuarioId: '', nombre: '', direccion: '', telefono: '' })
    } finally {
      setCreando(false)
    }
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Configuración</h1>
          <p className="text-[var(--color-muted)] mt-1">Datos del restaurante y mesas</p>
        </div>
        <button onClick={abrirAlta} className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white btn-interactive">
          <Plus size={16} /> Nuevo restaurante
        </button>
      </div>

      {loading && <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 text-sm text-[var(--color-muted)]">Cargando…</div>}

      {!loading && actual && (
        <>
          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-[var(--color-on-surface)]">Datos del restaurante</h2>
              <button
                onClick={handleToggleActivo}
                className={`text-[11px] font-semibold px-2.5 py-1 rounded-full btn-toggle-interactive ${actual.activo ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
              >
                {actual.activo ? 'Activo' : 'Inactivo'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-xs font-medium mb-1">Nombre</label>
                <input
                  value={actual.nombre}
                  onChange={(e) => setActual({ ...actual, nombre: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-medium mb-1">Teléfono</label>
                <input
                  value={actual.telefono ?? ''}
                  onChange={(e) => setActual({ ...actual, telefono: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-xs font-medium mb-1">Dirección</label>
              <input
                value={actual.direccion}
                onChange={(e) => setActual({ ...actual, direccion: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
              />
            </div>
            <div className="flex gap-4 text-sm mb-5">
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={actual.aceptaRecojo} onChange={(e) => setActual({ ...actual, aceptaRecojo: e.target.checked })} />
                Recojo
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={actual.aceptaDelivery} onChange={(e) => setActual({ ...actual, aceptaDelivery: e.target.checked })} />
                Delivery
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={actual.aceptaSalon} onChange={(e) => setActual({ ...actual, aceptaSalon: e.target.checked })} />
                Salón
              </label>
            </div>
            <button onClick={guardarDatos} disabled={guardando} className="px-6 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold btn-interactive disabled:opacity-50">
              {guardando ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </div>

          <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
            <h2 className="font-semibold text-[var(--color-on-surface)] mb-4">Mesas</h2>
            <div className="flex flex-wrap gap-2 mb-4">
              {mesas.map((m) => (
                <div key={m.id} className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[var(--color-surface-alt)] text-sm">
                  Mesa {m.numero} · {m.capacidad}p
                  <button onClick={() => handleEliminarMesa(m.id)} className="text-red-600 btn-icon-interactive hover:bg-red-500/10" data-tooltip="Eliminar mesa" aria-label="Eliminar mesa">
                    <Trash2 size={12} />
                  </button>
                </div>
              ))}
              {mesas.length === 0 && <p className="text-sm text-[var(--color-muted)]">Sin mesas registradas.</p>}
            </div>
            <div className="flex gap-2">
              <input
                placeholder="Número"
                value={nuevaMesa.numero}
                onChange={(e) => setNuevaMesa({ ...nuevaMesa, numero: e.target.value })}
                className="w-28 px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
              />
              <input
                type="number"
                placeholder="Capacidad"
                value={nuevaMesa.capacidad}
                onChange={(e) => setNuevaMesa({ ...nuevaMesa, capacidad: e.target.value })}
                className="w-28 px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
              />
              <button onClick={handleAgregarMesa} className="flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold btn-interactive">
                <Plus size={14} /> Agregar
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Modal alta restaurante ── */}
      {mostrarAlta && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-overlay-in" onClick={() => setMostrarAlta(false)}>
          <div className="w-full max-w-md rounded-2xl p-6 bg-white animate-panel-in" onClick={(e) => e.stopPropagation()}>
            <h2 className="text-lg font-bold mb-4">Nuevo restaurante</h2>
            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Usuario dueño (rol restaurante)</label>
                <select
                  value={altaForm.usuarioId}
                  onChange={(e) => setAltaForm({ ...altaForm, usuarioId: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
                >
                  <option value="">Elige un usuario…</option>
                  {usuariosRestaurante.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.nombre} {u.apellido} ({u.email})
                    </option>
                  ))}
                </select>
                {usuariosRestaurante.length === 0 && (
                  <p className="text-xs text-[var(--color-muted)] mt-1">
                    No hay usuarios con rol restaurante todavía — deben registrarse primero desde la app restaurant.
                  </p>
                )}
              </div>
              <input
                placeholder="Nombre del restaurante"
                value={altaForm.nombre}
                onChange={(e) => setAltaForm({ ...altaForm, nombre: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
              />
              <input
                placeholder="Dirección"
                value={altaForm.direccion}
                onChange={(e) => setAltaForm({ ...altaForm, direccion: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
              />
              <input
                placeholder="Teléfono (opcional)"
                value={altaForm.telefono}
                onChange={(e) => setAltaForm({ ...altaForm, telefono: e.target.value })}
                className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
              />
              <button
                onClick={handleCrearRestaurante}
                disabled={creando || !altaForm.usuarioId || !altaForm.nombre || !altaForm.direccion}
                className="mt-1 py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold btn-interactive disabled:opacity-50"
              >
                {creando ? 'Creando…' : 'Crear restaurante'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
