'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Clock, MapPin, ShoppingBag, RefreshCw, XCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { estaAutenticado } from '@/lib/services/authService'
import { listarMisPedidos, obtenerPedido, historialPedido, cancelarPedido } from '@/lib/services/pedidoApiService'
import { ApiError } from '@/lib/services/apiClient'
import type { PedidoResumenDTO, PedidoDetalleDTO, HistorialEstadoDTO, EstadoPedido } from '@/lib/services/types'

const ESTADO_LABEL: Record<EstadoPedido, string> = {
  recibido: 'Recibido',
  en_preparacion: 'En preparación',
  listo: 'Listo para recoger',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

const ESTADO_COLOR: Record<EstadoPedido, { bg: string; fg: string }> = {
  recibido: { bg: 'var(--color-secondary-container)', fg: 'var(--color-on-secondary-container)' },
  en_preparacion: { bg: 'var(--color-primary-container)', fg: 'var(--color-on-primary-container)' },
  listo: { bg: 'var(--color-primary)', fg: 'var(--color-on-primary)' },
  entregado: { bg: 'var(--color-surface-container-high)', fg: 'var(--color-on-surface-variant)' },
  cancelado: { bg: 'var(--color-error-container)', fg: 'var(--color-on-error-container)' },
}

function puedeCancelar(estado: EstadoPedido): boolean {
  return estado === 'recibido' || estado === 'en_preparacion'
}

export default function MisPedidosPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)
  const [pedidos, setPedidos] = useState<PedidoResumenDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [expandido, setExpandido] = useState<string | null>(null)
  const [detalle, setDetalle] = useState<PedidoDetalleDTO | null>(null)
  const [historial, setHistorial] = useState<HistorialEstadoDTO[]>([])
  const [cancelando, setCancelando] = useState(false)
  const [cancelError, setCancelError] = useState<string | null>(null)

  useEffect(() => {
    if (!estaAutenticado()) {
      router.replace('/acceso')
      return
    }
    setReady(true)
  }, [router])

  async function cargar() {
    setLoading(true)
    setError(false)
    try {
      setPedidos(await listarMisPedidos())
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (ready) cargar()
  }, [ready])

  async function toggleExpandir(id: string) {
    if (expandido === id) {
      setExpandido(null)
      setDetalle(null)
      setHistorial([])
      return
    }
    setExpandido(id)
    setCancelError(null)
    const [d, h] = await Promise.all([obtenerPedido(id), historialPedido(id)])
    setDetalle(d)
    setHistorial(h)
  }

  async function handleCancelar(id: string) {
    setCancelando(true)
    setCancelError(null)
    try {
      await cancelarPedido(id)
      await cargar()
      setExpandido(null)
    } catch (err) {
      setCancelError(err instanceof ApiError ? err.message : 'No se pudo cancelar el pedido.')
    } finally {
      setCancelando(false)
    }
  }

  if (!ready) return null

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <Link href="/perfil" className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-opacity" style={{ color: 'var(--color-on-surface-variant)' }}>
        <ArrowLeft size={15} /> Volver a mi perfil
      </Link>

      <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: 'var(--color-secondary)' }}>
        Tu historial
      </p>
      <h1 className="text-4xl font-semibold mb-10" style={{ fontFamily: 'var(--font-newsreader)', color: 'var(--color-on-surface)' }}>
        Mis Pedidos
      </h1>

      {loading && (
        <div className="flex flex-col gap-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl h-20 animate-pulse" style={{ backgroundColor: 'var(--color-surface-container)' }} />
          ))}
        </div>
      )}

      {!loading && error && (
        <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: 'var(--color-surface-container)' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
            No pudimos cargar tus pedidos.
          </p>
          <button
            onClick={cargar}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
          >
            <RefreshCw size={14} /> Reintentar
          </button>
        </div>
      )}

      {!loading && !error && pedidos.length === 0 && (
        <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: 'var(--color-surface-container)' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
            Aún no tienes pedidos.
          </p>
          <Link
            href="/restaurantes"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
          >
            Hacer mi primer pedido
          </Link>
        </div>
      )}

      {!loading && !error && pedidos.length > 0 && (
        <div className="flex flex-col gap-3">
          {pedidos.map((p) => {
            const abierto = expandido === p.id
            const colores = ESTADO_COLOR[p.estado]
            return (
              <div key={p.id} className="rounded-2xl shadow-ambient overflow-hidden" style={{ backgroundColor: 'var(--color-surface)' }}>
                <button onClick={() => toggleExpandir(p.id)} className="w-full flex items-center justify-between p-5 text-left">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-mono text-sm font-semibold">#{p.id.slice(0, 8).toUpperCase()}</p>
                      <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full" style={{ backgroundColor: colores.bg, color: colores.fg }}>
                        {ESTADO_LABEL[p.estado]}
                      </span>
                    </div>
                    <p className="text-xs flex items-center gap-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                      <Clock size={11} /> {new Date(p.createdAt).toLocaleDateString('es-PE')} · {p.contraparte} · {p.modo}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-bold" style={{ color: 'var(--color-primary)' }}>
                      S/{p.total.toLocaleString('es-PE')}
                    </span>
                    {abierto ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                  </div>
                </button>

                {abierto && (
                  <div className="px-5 pb-5" style={{ borderTop: '1px solid var(--color-outline-variant)' }}>
                    {!detalle ? (
                      <p className="text-sm py-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                        Cargando detalle…
                      </p>
                    ) : (
                      <>
                        <ul className="flex flex-col gap-2 py-4">
                          {detalle.items.map((it, i) => (
                            <li key={i} className="flex justify-between text-sm">
                              <span>
                                {it.cantidad}× {it.itemNombre}
                                {it.notasItem && <span className="block text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>{it.notasItem}</span>}
                              </span>
                              <span className="shrink-0 ml-3">S/{(it.precioUnitario * it.cantidad).toLocaleString('es-PE')}</span>
                            </li>
                          ))}
                        </ul>

                        {/* Timeline */}
                        <div className="flex flex-col gap-2 mb-4">
                          {historial.map((h, i) => (
                            <div key={i} className="flex items-center gap-2 text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                              <MapPin size={11} />
                              {ESTADO_LABEL[h.estado as EstadoPedido] ?? h.estado} · {new Date(h.createdAt).toLocaleString('es-PE')}
                            </div>
                          ))}
                        </div>

                        {detalle.codigoQr && p.estado !== 'entregado' && p.estado !== 'cancelado' && (
                          <p className="text-xs mb-3 flex items-center gap-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                            <ShoppingBag size={11} /> Código: {detalle.codigoQr.slice(0, 12)}…
                          </p>
                        )}

                        {cancelError && (
                          <p className="text-xs mb-3" style={{ color: 'var(--color-error)' }}>
                            {cancelError}
                          </p>
                        )}

                        {puedeCancelar(p.estado) && (
                          <button
                            onClick={() => handleCancelar(p.id)}
                            disabled={cancelando}
                            className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-opacity disabled:opacity-50"
                            style={{ backgroundColor: 'var(--color-error-container)', color: 'var(--color-on-error-container)' }}
                          >
                            <XCircle size={14} /> {cancelando ? 'Cancelando…' : 'Cancelar pedido'}
                          </button>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
