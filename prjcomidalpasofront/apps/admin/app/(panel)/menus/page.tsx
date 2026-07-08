'use client'

import { useEffect, useState } from 'react'
import { X, Trash2, Plus, RefreshCw } from 'lucide-react'
import { useRestauranteStore } from '@/store/restauranteStore'
import { cargarCatalogo, agregarComponenteMenu, quitarComponenteMenu, agregarOpcionArmaPlato } from '@/lib/services/adminApiService'
import type { ItemCartaDTO, ElegirResponse } from '@/lib/services/types'

const TIPOS_ARMA_PLATO = ['base', 'proteina', 'topping', 'bebida']

export default function MenusPage() {
  const restaurante = useRestauranteStore((s) => s.restaurante)
  const [data, setData] = useState<ElegirResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [gestionando, setGestionando] = useState<ItemCartaDTO | null>(null)

  // formulario agregar componente/opción
  const [itemSeleccionado, setItemSeleccionado] = useState('')
  const [rolOTipo, setRolOTipo] = useState('')
  const [precioExtra, setPrecioExtra] = useState('0')

  async function cargar() {
    if (!restaurante) return
    setLoading(true)
    setError(false)
    try {
      const d = await cargarCatalogo(restaurante.id)
      setData(d)
      if (gestionando) setGestionando(d.items.find((i) => i.id === gestionando.id) ?? null)
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (restaurante) cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurante])

  const especiales = data ? data.items.filter((i) => i.esMenuCompuesto || i.esArmaPlato) : []

  function abrirGestion(item: ItemCartaDTO) {
    setGestionando(item)
    setItemSeleccionado('')
    setRolOTipo(item.esArmaPlato ? 'base' : '')
    setPrecioExtra('0')
  }

  async function handleAgregar() {
    if (!gestionando || !itemSeleccionado) return
    if (gestionando.esMenuCompuesto) {
      await agregarComponenteMenu(gestionando.id, itemSeleccionado, rolOTipo || 'componente')
    } else if (gestionando.esArmaPlato) {
      await agregarOpcionArmaPlato(gestionando.id, itemSeleccionado, rolOTipo, Number(precioExtra) || 0)
    }
    setItemSeleccionado('')
    await cargar()
  }

  async function handleQuitarComponente(menuId: string, itemId: string) {
    await quitarComponenteMenu(menuId, itemId)
    cargar()
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Menús y Arma tu Plato</h1>
        <p className="text-[var(--color-muted)] mt-1">
          {restaurante ? `Composición de menús de ${restaurante.nombre}` : 'Selecciona un restaurante'}
        </p>
      </div>

      {loading && <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 text-sm text-[var(--color-muted)]">Cargando…</div>}

      {!loading && error && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <p className="text-sm text-[var(--color-muted)] mb-3">No se pudo cargar el catálogo.</p>
          <button onClick={cargar} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
            <RefreshCw size={14} /> Reintentar
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {especiales.map((item) => (
            <div key={item.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-5">
              <div className="flex items-center justify-between mb-2">
                <p className="font-semibold text-[var(--color-on-surface)]">{item.nombre}</p>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-border)]">
                  {item.esMenuCompuesto ? 'Menú compuesto' : 'Arma tu plato'}
                </span>
              </div>

              <div className="text-sm text-[var(--color-muted)] mb-3">
                {item.esMenuCompuesto
                  ? item.componentes.length === 0
                    ? 'Sin componentes'
                    : item.componentes.map((c) => c.nombre).join(' · ')
                  : item.opcionesArmaPlato.length === 0
                  ? 'Sin opciones'
                  : `${item.opcionesArmaPlato.length} opciones configuradas`}
              </div>

              <button onClick={() => abrirGestion(item)} className="text-sm font-semibold text-[var(--color-primary)]">
                Gestionar →
              </button>
            </div>
          ))}
          {especiales.length === 0 && (
            <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 text-sm text-[var(--color-muted)] md:col-span-2">
              No hay menús compuestos ni ítems de "Arma tu plato". Márcalos al crear un producto en la pestaña Productos.
            </div>
          )}
        </div>
      )}

      {/* ── Modal de gestión ── */}
      {gestionando && data && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-overlay-in" onClick={() => setGestionando(null)}>
          <div className="w-full max-w-lg rounded-2xl p-6 bg-white max-h-[85vh] overflow-y-auto animate-panel-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{gestionando.nombre}</h2>
              <button onClick={() => setGestionando(null)} className="p-1 text-[var(--color-muted)] btn-icon-interactive" data-tooltip="Cerrar" aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>

            {/* Lista actual */}
            <div className="flex flex-col gap-2 mb-5">
              {gestionando.esMenuCompuesto
                ? gestionando.componentes.map((c) => (
                    <div key={c.itemId} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--color-surface-alt)] text-sm">
                      <span>
                        {c.nombre} <span className="text-[var(--color-muted)]">· {c.rol}</span>
                      </span>
                      <button onClick={() => handleQuitarComponente(gestionando.id, c.itemId)} className="text-red-600 btn-icon-interactive hover:bg-red-500/10" data-tooltip="Quitar componente" aria-label="Quitar componente">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))
                : gestionando.opcionesArmaPlato.map((o) => (
                    <div key={`${o.tipo}-${o.itemId}`} className="flex items-center justify-between px-3 py-2 rounded-lg bg-[var(--color-surface-alt)] text-sm">
                      <span>
                        {o.nombre} <span className="text-[var(--color-muted)]">· {o.tipo}</span>
                      </span>
                      <span className="font-semibold">{o.precioExtra > 0 ? `+S/${o.precioExtra}` : 'Incluido'}</span>
                    </div>
                  ))}
              {gestionando.esMenuCompuesto && gestionando.componentes.length === 0 && (
                <p className="text-sm text-[var(--color-muted)]">Sin componentes aún.</p>
              )}
              {gestionando.esArmaPlato && gestionando.opcionesArmaPlato.length === 0 && (
                <p className="text-sm text-[var(--color-muted)]">Sin opciones aún.</p>
              )}
            </div>

            {/* Formulario agregar */}
            <div className="pt-4 border-t border-[var(--color-border)]">
              <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-2">
                {gestionando.esMenuCompuesto ? 'Agregar componente' : 'Agregar opción'}
              </p>
              <div className="flex flex-col gap-2">
                <select
                  value={itemSeleccionado}
                  onChange={(e) => setItemSeleccionado(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
                >
                  <option value="">Elige un producto…</option>
                  {data.items
                    .filter((i) => i.id !== gestionando.id)
                    .map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.nombre}
                      </option>
                    ))}
                </select>

                {gestionando.esMenuCompuesto ? (
                  <input
                    placeholder="Rol (ej. entrada, fondo, bebida)"
                    value={rolOTipo}
                    onChange={(e) => setRolOTipo(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
                  />
                ) : (
                  <div className="flex gap-2">
                    <select
                      value={rolOTipo}
                      onChange={(e) => setRolOTipo(e.target.value)}
                      className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
                    >
                      {TIPOS_ARMA_PLATO.map((t) => (
                        <option key={t} value={t}>
                          {t}
                        </option>
                      ))}
                    </select>
                    <input
                      type="number"
                      step="0.01"
                      placeholder="Precio extra"
                      value={precioExtra}
                      onChange={(e) => setPrecioExtra(e.target.value)}
                      className="w-32 px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
                    />
                  </div>
                )}

                <button
                  onClick={handleAgregar}
                  disabled={!itemSeleccionado}
                  className="mt-1 flex items-center justify-center gap-2 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-semibold btn-interactive disabled:opacity-50"
                >
                  <Plus size={14} /> Agregar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
