'use client'

import { useEffect, useState } from 'react'
import { Plus, Pencil, Trash2, Tag, X, RefreshCw } from 'lucide-react'
import { useRestauranteStore } from '@/store/restauranteStore'
import { cargarCatalogo, crearItem, actualizarItem, toggleItem, eliminarItem, asignarEtiqueta, quitarEtiqueta } from '@/lib/services/adminApiService'
import type { ItemCartaDTO, ElegirResponse } from '@/lib/services/types'

const CATEGORIAS = [
  { codigo: 'menu', label: 'Menú del día' },
  { codigo: 'a_la_carta', label: 'A la carta' },
  { codigo: 'entradas', label: 'Entradas' },
  { codigo: 'postres', label: 'Postres' },
  { codigo: 'bebidas', label: 'Bebidas' },
  { codigo: 'arma_plato', label: 'Arma tu plato' },
]

interface FormState {
  categoriaCodigo: string
  nombre: string
  descripcion: string
  precio: string
  imagenUrl: string
  pesoGramos: string
  esMenuCompuesto: boolean
  esArmaPlato: boolean
}

const FORM_INICIAL: FormState = {
  categoriaCodigo: 'a_la_carta',
  nombre: '',
  descripcion: '',
  precio: '',
  imagenUrl: '',
  pesoGramos: '',
  esMenuCompuesto: false,
  esArmaPlato: false,
}

export default function ProductosPage() {
  const restaurante = useRestauranteStore((s) => s.restaurante)
  const [data, setData] = useState<ElegirResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [modalAbierto, setModalAbierto] = useState(false)
  const [editando, setEditando] = useState<ItemCartaDTO | null>(null)
  const [form, setForm] = useState<FormState>(FORM_INICIAL)
  const [guardando, setGuardando] = useState(false)
  const [etiquetaInput, setEtiquetaInput] = useState('')

  async function cargar() {
    if (!restaurante) return
    setLoading(true)
    setError(false)
    try {
      setData(await cargarCatalogo(restaurante.id))
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

  function abrirCrear() {
    setEditando(null)
    setForm(FORM_INICIAL)
    setModalAbierto(true)
  }

  function abrirEditar(item: ItemCartaDTO) {
    setEditando(item)
    setForm({
      categoriaCodigo: data?.categorias.find((c) => c.nombre === item.categoria)?.codigo ?? 'a_la_carta',
      nombre: item.nombre,
      descripcion: item.descripcion ?? '',
      precio: String(item.precio),
      imagenUrl: item.imagenUrl ?? '',
      pesoGramos: item.pesoGramos != null ? String(item.pesoGramos) : '',
      esMenuCompuesto: item.esMenuCompuesto,
      esArmaPlato: item.esArmaPlato,
    })
    setModalAbierto(true)
  }

  async function guardar() {
    if (!restaurante) return
    setGuardando(true)
    try {
      const base = {
        categoriaCodigo: form.categoriaCodigo,
        nombre: form.nombre,
        descripcion: form.descripcion || undefined,
        precio: Number(form.precio),
        imagenUrl: form.imagenUrl || undefined,
        pesoGramos: form.pesoGramos ? Number(form.pesoGramos) : undefined,
      }
      if (editando) {
        await actualizarItem(editando.id, base)
      } else {
        await crearItem({ ...base, restauranteId: restaurante.id, esMenuCompuesto: form.esMenuCompuesto, esArmaPlato: form.esArmaPlato })
      }
      setModalAbierto(false)
      await cargar()
    } catch {
      // el error se refleja al reintentar guardar
    } finally {
      setGuardando(false)
    }
  }

  async function handleToggle(item: ItemCartaDTO) {
    await toggleItem(item.id, !item.disponible)
    cargar()
  }

  async function handleEliminar(item: ItemCartaDTO) {
    if (!confirm(`¿Eliminar "${item.nombre}"?`)) return
    await eliminarItem(item.id)
    cargar()
  }

  async function handleAgregarEtiqueta(item: ItemCartaDTO) {
    if (!etiquetaInput.trim()) return
    await asignarEtiqueta(item.id, etiquetaInput.trim())
    setEtiquetaInput('')
    cargar()
  }

  async function handleQuitarEtiqueta(item: ItemCartaDTO, codigo: string) {
    await quitarEtiqueta(item.id, codigo)
    cargar()
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Productos</h1>
          <p className="text-[var(--color-muted)] mt-1">
            {restaurante ? `Catálogo de ${restaurante.nombre}` : 'Selecciona un restaurante'}
          </p>
        </div>
        <button
          onClick={abrirCrear}
          disabled={!restaurante}
          className="flex items-center gap-2 rounded-xl bg-[var(--color-primary)] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[var(--color-primary-light)] transition-colors disabled:opacity-50"
        >
          <Plus size={16} />
          Nuevo producto
        </button>
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

      {!loading && !error && data && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-muted)]">
                <th className="px-5 py-3 font-medium">Nombre</th>
                <th className="px-5 py-3 font-medium">Categoría</th>
                <th className="px-5 py-3 font-medium">Precio</th>
                <th className="px-5 py-3 font-medium">Etiquetas</th>
                <th className="px-5 py-3 font-medium">Estado</th>
                <th className="px-5 py-3 font-medium text-right">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item) => (
                <tr key={item.id} className="border-b border-[var(--color-border)] last:border-0">
                  <td className="px-5 py-3 font-medium text-[var(--color-on-surface)]">{item.nombre}</td>
                  <td className="px-5 py-3 text-[var(--color-muted)]">{item.categoria}</td>
                  <td className="px-5 py-3">S/{item.precio.toLocaleString('es-PE')}</td>
                  <td className="px-5 py-3">
                    <div className="flex flex-wrap gap-1 items-center">
                      {item.etiquetas.map((e) => (
                        <span
                          key={e.codigo}
                          onClick={() => handleQuitarEtiqueta(item, e.codigo)}
                          className="cursor-pointer text-[11px] px-2 py-0.5 rounded-full bg-[var(--color-border)] text-[var(--color-on-surface)] hover:opacity-70"
                          aria-label="Quitar etiqueta"
                          data-tooltip="Quitar etiqueta"
                        >
                          {e.nombre} ×
                        </span>
                      ))}
                      <input
                        placeholder="+ etiqueta"
                        value={etiquetaInput}
                        onFocus={() => setEtiquetaInput('')}
                        onChange={(e) => setEtiquetaInput(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleAgregarEtiqueta(item)}
                        className="w-20 text-[11px] px-1.5 py-0.5 rounded bg-transparent border border-dashed border-[var(--color-border)]"
                      />
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <button
                      onClick={() => handleToggle(item)}
                      className={`text-[11px] font-semibold px-2.5 py-1 rounded-full btn-toggle-interactive ${item.disponible ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}
                    >
                      {item.disponible ? 'Disponible' : 'No disponible'}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <button onClick={() => abrirEditar(item)} className="p-1.5 mr-1 btn-icon-interactive" data-tooltip="Editar" aria-label="Editar producto">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleEliminar(item)} className="p-1.5 text-red-600 btn-icon-interactive hover:bg-red-500/10" data-tooltip="Eliminar" aria-label="Eliminar producto">
                      <Trash2 size={14} />
                    </button>
                  </td>
                </tr>
              ))}
              {data.items.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-5 py-8 text-center text-[var(--color-muted)]">
                    Sin productos todavía.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ── Modal crear/editar ── */}
      {modalAbierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 animate-overlay-in" onClick={() => setModalAbierto(false)}>
          <div className="w-full max-w-lg rounded-2xl p-6 bg-white max-h-[85vh] overflow-y-auto animate-panel-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-bold">{editando ? 'Editar producto' : 'Nuevo producto'}</h2>
              <button onClick={() => setModalAbierto(false)} className="p-1 text-[var(--color-muted)] btn-icon-interactive" data-tooltip="Cerrar" aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>

            <div className="flex flex-col gap-3">
              <div>
                <label className="block text-xs font-medium mb-1">Categoría</label>
                <select
                  value={form.categoriaCodigo}
                  onChange={(e) => setForm({ ...form, categoriaCodigo: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
                >
                  {CATEGORIAS.map((c) => (
                    <option key={c.codigo} value={c.codigo}>
                      {c.label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Nombre</label>
                <input
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">Descripción</label>
                <textarea
                  value={form.descripcion}
                  onChange={(e) => setForm({ ...form, descripcion: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium mb-1">Precio (S/)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={form.precio}
                    onChange={(e) => setForm({ ...form, precio: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium mb-1">Peso (g)</label>
                  <input
                    type="number"
                    value={form.pesoGramos}
                    onChange={(e) => setForm({ ...form, pesoGramos: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium mb-1">URL de imagen (opcional)</label>
                <input
                  value={form.imagenUrl}
                  onChange={(e) => setForm({ ...form, imagenUrl: e.target.value })}
                  className="w-full px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm"
                />
              </div>

              {!editando && (
                <div className="flex gap-4 text-sm">
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.esMenuCompuesto} onChange={(e) => setForm({ ...form, esMenuCompuesto: e.target.checked })} />
                    Menú compuesto
                  </label>
                  <label className="flex items-center gap-2">
                    <input type="checkbox" checked={form.esArmaPlato} onChange={(e) => setForm({ ...form, esArmaPlato: e.target.checked })} />
                    Arma tu plato
                  </label>
                </div>
              )}

              {editando && (
                <p className="text-xs text-[var(--color-muted)] flex items-center gap-1.5">
                  <Tag size={11} /> Gestiona componentes/opciones desde la pestaña Menús.
                </p>
              )}

              <button
                onClick={guardar}
                disabled={guardando || !form.nombre || !form.precio}
                className="mt-2 w-full py-2.5 rounded-xl bg-[var(--color-primary)] text-white text-sm font-semibold btn-interactive disabled:opacity-50"
              >
                {guardando ? 'Guardando…' : editando ? 'Guardar cambios' : 'Crear producto'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
