'use client'

import { useEffect, useState } from 'react'
import { ChevronDown, ChevronUp, RefreshCw } from 'lucide-react'
import { useRestauranteStore } from '@/store/restauranteStore'
import { listarPedidosRestaurante, obtenerPedido, historialPedido } from '@/lib/services/adminApiService'
import type { PedidoResumenDTO, PedidoDetalleDTO, HistorialEstadoDTO } from '@/lib/services/types'

const ESTADOS = ['', 'recibido', 'en_preparacion', 'listo', 'entregado', 'cancelado']
const MODOS = ['', 'recojo', 'delivery', 'salon']

export default function PedidosAdminPage() {
  const restaurante = useRestauranteStore((s) => s.restaurante)
  const [pedidos, setPedidos] = useState<PedidoResumenDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [estadoFiltro, setEstadoFiltro] = useState('')
  const [modoFiltro, setModoFiltro] = useState('')
  const [expandido, setExpandido] = useState<string | null>(null)
  const [detalle, setDetalle] = useState<PedidoDetalleDTO | null>(null)
  const [historial, setHistorial] = useState<HistorialEstadoDTO[]>([])

  async function cargar() {
    if (!restaurante) return
    setLoading(true)
    setError(false)
    try {
      setPedidos(await listarPedidosRestaurante(restaurante.id, estadoFiltro || undefined, modoFiltro || undefined))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (restaurante) cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurante, estadoFiltro, modoFiltro])

  async function toggleExpandir(id: string) {
    if (expandido === id) {
      setExpandido(null)
      return
    }
    setExpandido(id)
    setDetalle(null)
    const [d, h] = await Promise.all([obtenerPedido(id), historialPedido(id)])
    setDetalle(d)
    setHistorial(h)
  }

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Pedidos</h1>
        <p className="text-[var(--color-muted)] mt-1">
          {restaurante ? `Historial de ${restaurante.nombre} (solo lectura)` : 'Selecciona un restaurante'}
        </p>
      </div>

      <div className="flex gap-3 mb-5">
        <select value={estadoFiltro} onChange={(e) => setEstadoFiltro(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm bg-white">
          {ESTADOS.map((e) => (
            <option key={e} value={e}>
              {e || 'Todos los estados'}
            </option>
          ))}
        </select>
        <select value={modoFiltro} onChange={(e) => setModoFiltro(e.target.value)} className="px-3 py-2 rounded-lg border border-[var(--color-border)] text-sm bg-white">
          {MODOS.map((m) => (
            <option key={m} value={m}>
              {m || 'Todas las modalidades'}
            </option>
          ))}
        </select>
      </div>

      {loading && <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 text-sm text-[var(--color-muted)]">Cargando…</div>}

      {!loading && error && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6">
          <p className="text-sm text-[var(--color-muted)] mb-3">No se pudo cargar el historial.</p>
          <button onClick={cargar} className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-primary)]">
            <RefreshCw size={14} /> Reintentar
          </button>
        </div>
      )}

      {!loading && !error && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white overflow-hidden">
          {pedidos.length === 0 ? (
            <p className="p-6 text-sm text-[var(--color-muted)]">Sin pedidos con estos filtros.</p>
          ) : (
            pedidos.map((p) => (
              <div key={p.id} className="border-b border-[var(--color-border)] last:border-0">
                <button onClick={() => toggleExpandir(p.id)} className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-[var(--color-surface-alt)]">
                  <div>
                    <p className="font-mono text-sm font-semibold">#{p.id.slice(0, 8).toUpperCase()}</p>
                    <p className="text-xs text-[var(--color-muted)]">
                      {p.contraparte} · {p.modo} · {new Date(p.createdAt).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[var(--color-border)]">{p.estado}</span>
                    <span className="font-bold text-sm">S/{p.total.toLocaleString('es-PE')}</span>
                    {expandido === p.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </div>
                </button>
                {expandido === p.id && (
                  <div className="px-5 pb-4">
                    {!detalle ? (
                      <p className="text-sm text-[var(--color-muted)]">Cargando…</p>
                    ) : (
                      <>
                        <ul className="flex flex-col gap-1 mb-3 text-sm">
                          {detalle.items.map((it, i) => (
                            <li key={i} className="flex justify-between">
                              <span>
                                {it.cantidad}× {it.itemNombre}
                              </span>
                              <span>S/{(it.precioUnitario * it.cantidad).toLocaleString('es-PE')}</span>
                            </li>
                          ))}
                        </ul>
                        <div className="flex flex-col gap-1">
                          {historial.map((h, i) => (
                            <p key={i} className="text-xs text-[var(--color-muted)]">
                              {h.estado} · {new Date(h.createdAt).toLocaleString('es-PE')}
                            </p>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}
    </div>
  )
}
