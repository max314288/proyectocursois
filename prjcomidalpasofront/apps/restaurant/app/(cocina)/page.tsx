'use client'

import { useCallback, useEffect, useRef, useState } from 'react'
import { Clock, ChefHat, CheckCircle, LogOut, User, X, Banknote, History } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { cerrarSesion } from '@/lib/services/authService'
import { KANBAN_COLUMNS, getBadgeColor, pedidosPorColumna, siguienteEstado, type KanbanColumn } from '@/lib/services/kitchenService'
import { getMiRestaurante, listarPedidos, cambiarEstado, detallePedido, pagoDePedido, confirmarPago } from '@/lib/services/kitchenApiService'
import { ApiError } from '@/lib/services/apiClient'
import type { PedidoResumenDTO, PedidoDetalleDTO, PagoDTO } from '@/lib/services/types'

const COLUMN_ICONS = {
  pending: Clock,
  progress: ChefHat,
  done: CheckCircle,
} as const

const POLL_MS = 10000

export default function KitchenPage() {
  const router = useRouter()
  const [restauranteId, setRestauranteId] = useState<string | null>(null)
  const [sinRestaurante, setSinRestaurante] = useState(false)
  const [pedidos, setPedidos] = useState<PedidoResumenDTO[]>([])
  const [cargandoInicial, setCargandoInicial] = useState(true)

  // modal de detalle
  const [seleccionado, setSeleccionado] = useState<string | null>(null)
  const [detalle, setDetalle] = useState<PedidoDetalleDTO | null>(null)
  const [pago, setPago] = useState<PagoDTO | null>(null)
  const [confirmando, setConfirmando] = useState(false)

  function handleLogout() {
    cerrarSesion()
    router.replace('/login')
  }

  useEffect(() => {
    getMiRestaurante()
      .then((r) => setRestauranteId(r.id))
      .catch(() => setSinRestaurante(true))
  }, [])

  const cargarPedidos = useCallback(async () => {
    if (!restauranteId) return
    try {
      const data = await listarPedidos(restauranteId)
      setPedidos(data)
    } catch {
      // próximo tick reintenta
    } finally {
      setCargandoInicial(false)
    }
  }, [restauranteId])

  useEffect(() => {
    if (!restauranteId) return
    cargarPedidos()
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') cargarPedidos()
    }, POLL_MS)
    return () => clearInterval(interval)
  }, [restauranteId, cargarPedidos])

  async function avanzarEstado(pedido: PedidoResumenDTO, columnId: KanbanColumn['id']) {
    const nuevoEstado = siguienteEstado(columnId)
    const anteriores = pedidos
    // optimista
    setPedidos((prev) => prev.map((p) => (p.id === pedido.id ? { ...p, estado: nuevoEstado } : p)))
    try {
      await cambiarEstado(pedido.id, nuevoEstado)
      cargarPedidos()
    } catch {
      setPedidos(anteriores) // revert
    }
  }

  async function abrirDetalle(id: string) {
    setSeleccionado(id)
    setDetalle(null)
    setPago(null)
    const [d, p] = await Promise.allSettled([detallePedido(id), pagoDePedido(id)])
    if (d.status === 'fulfilled') setDetalle(d.value)
    if (p.status === 'fulfilled') setPago(p.value)
  }

  async function handleConfirmarPago() {
    if (!pago) return
    setConfirmando(true)
    try {
      await confirmarPago(pago.id)
      setPago({ ...pago, estado: 'completado' })
    } catch (err) {
      // el error se ve reflejado al reintentar — no bloquea el modal
      console.error(err instanceof ApiError ? err.message : err)
    } finally {
      setConfirmando(false)
    }
  }

  if (sinRestaurante) {
    return (
      <div className="min-h-screen flex items-center justify-center px-8 text-center">
        <div>
          <h1 className="text-xl font-bold mb-2">Sin restaurante asignado</h1>
          <p className="text-sm text-[var(--color-muted)]">Contacta al administrador para vincular tu cuenta a un restaurante.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-8 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">Comida al Paso</p>
          <h1 className="text-2xl font-bold mt-0.5">Vista Cocina</h1>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-[var(--color-muted)]">
            <span className="h-2 w-2 rounded-full bg-[var(--color-done)] inline-block" />
            En línea
          </div>
          <Link href="/historial" className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--color-surface-alt)]" style={{ color: 'var(--color-muted)' }}>
            <History size={15} />
            Historial
          </Link>
          <Link href="/perfil" className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--color-surface-alt)]" style={{ color: 'var(--color-muted)' }}>
            <User size={15} />
            Mi Perfil
          </Link>
          <button onClick={handleLogout} className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--color-surface-alt)]" style={{ color: 'var(--color-muted)' }}>
            <LogOut size={15} />
            Salir
          </button>
        </div>
      </header>

      <div className="flex-1 grid grid-cols-3 gap-px bg-[var(--color-border)]">
        {KANBAN_COLUMNS.map(({ id, label, colorVar }) => {
          const Icon = COLUMN_ICONS[id]
          const items = pedidosPorColumna(pedidos, id)
          return (
            <div key={id} className="bg-[var(--color-surface-card)] p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <Icon size={18} style={{ color: colorVar }} />
                <span className="font-semibold text-sm uppercase tracking-wide">{label}</span>
                <span className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: getBadgeColor(colorVar), color: colorVar }}>
                  {items.length}
                </span>
              </div>

              {cargandoInicial ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xs text-[var(--color-muted)]">Cargando…</p>
                </div>
              ) : items.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xs text-[var(--color-muted)]">Sin pedidos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {items.map((p) => (
                    <div
                      key={p.id}
                      className="rounded-xl p-4 cursor-pointer border border-[var(--color-border)] hover:border-[var(--color-muted)] transition-colors"
                      onClick={() => abrirDetalle(p.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <p className="font-mono text-sm font-semibold">#{p.id.slice(0, 8).toUpperCase()}</p>
                        <span className="text-xs text-[var(--color-muted)]">{p.modo}</span>
                      </div>
                      <p className="text-xs text-[var(--color-muted)] mb-3">{p.contraparte}</p>
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-sm">S/{p.total.toLocaleString('es-PE')}</span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            avanzarEstado(p, id)
                          }}
                          className="text-xs font-semibold px-3 py-1.5 rounded-full btn-interactive"
                          style={{ backgroundColor: colorVar, color: 'white' }}
                        >
                          {id === 'pending' ? 'Preparar' : id === 'progress' ? 'Listo' : 'Entregar'}
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* ── Modal detalle ── */}
      {seleccionado && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 animate-overlay-in" onClick={() => setSeleccionado(null)}>
          <div className="w-full max-w-md max-h-[85vh] overflow-y-auto rounded-2xl p-6 bg-[var(--color-surface-card)] animate-panel-in" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h2 className="text-lg font-bold">Pedido #{seleccionado.slice(0, 8).toUpperCase()}</h2>
              <button onClick={() => setSeleccionado(null)} className="p-1 text-[var(--color-muted)] btn-icon-interactive" data-tooltip="Cerrar" aria-label="Cerrar">
                <X size={18} />
              </button>
            </div>

            {!detalle ? (
              <p className="text-sm text-[var(--color-muted)]">Cargando…</p>
            ) : (
              <>
                <ul className="flex flex-col gap-2 mb-4">
                  {detalle.items.map((it, i) => (
                    <li key={i} className="text-sm">
                      <div className="flex justify-between">
                        <span>
                          {it.cantidad}× {it.itemNombre}
                        </span>
                        <span>S/{(it.precioUnitario * it.cantidad).toLocaleString('es-PE')}</span>
                      </div>
                      {it.notasItem && <p className="text-xs text-[var(--color-muted)]">{it.notasItem}</p>}
                    </li>
                  ))}
                </ul>

                {detalle.notas && <p className="text-xs text-[var(--color-muted)] mb-4">Notas: {detalle.notas}</p>}

                <div className="flex justify-between font-bold text-sm pt-3 border-t border-[var(--color-border)] mb-4">
                  <span>Total</span>
                  <span>S/{detalle.total.toLocaleString('es-PE')}</span>
                </div>

                {pago && (
                  <div className="rounded-xl p-4 bg-[var(--color-surface-alt)]">
                    <div className="flex items-center gap-2 mb-1">
                      <Banknote size={14} />
                      <p className="text-sm font-semibold">Pago: {pago.metodo}</p>
                      <span
                        className="ml-auto text-[11px] font-semibold px-2 py-0.5 rounded-full"
                        style={{
                          backgroundColor: pago.estado === 'completado' ? 'var(--color-done)25' : 'var(--color-pending)25',
                          color: pago.estado === 'completado' ? 'var(--color-done)' : 'var(--color-pending)',
                        }}
                      >
                        {pago.estado}
                      </span>
                    </div>
                    {pago.estado === 'pendiente' && pago.metodo === 'efectivo' && (
                      <button
                        onClick={handleConfirmarPago}
                        disabled={confirmando}
                        className="mt-2 text-xs font-semibold px-4 py-2 rounded-full text-white btn-interactive disabled:opacity-50"
                        style={{ backgroundColor: 'var(--color-done)' }}
                      >
                        {confirmando ? 'Confirmando…' : 'Confirmar pago recibido'}
                      </button>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
