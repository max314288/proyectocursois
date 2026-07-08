'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { LayoutGrid, LogOut, User, RefreshCw } from 'lucide-react'
import { cerrarSesion } from '@/lib/services/authService'
import { getMiRestaurante, listarPedidosPorFecha } from '@/lib/services/kitchenApiService'
import { ESTADO_LABEL, fechaHoyISO, ingresosDelDia } from '@/lib/services/kitchenService'
import type { PedidoResumenDTO } from '@/lib/services/types'

const ESTADO_COLOR: Record<string, string> = {
  recibido: 'var(--color-pending)',
  en_preparacion: 'var(--color-progress)',
  listo: 'var(--color-done)',
  entregado: 'var(--color-muted)',
  cancelado: '#c0392b',
}

export default function HistorialPage() {
  const router = useRouter()
  const [restauranteId, setRestauranteId] = useState<string | null>(null)
  const [sinRestaurante, setSinRestaurante] = useState(false)
  const [fecha, setFecha] = useState(fechaHoyISO())
  const [pedidos, setPedidos] = useState<PedidoResumenDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  function handleLogout() {
    cerrarSesion()
    router.replace('/login')
  }

  useEffect(() => {
    getMiRestaurante()
      .then((r) => setRestauranteId(r.id))
      .catch(() => setSinRestaurante(true))
  }, [])

  const cargar = useCallback(async () => {
    if (!restauranteId) return
    setLoading(true)
    setError(false)
    try {
      setPedidos(await listarPedidosPorFecha(restauranteId, fecha))
    } catch {
      setError(true)
    } finally {
      setLoading(false)
    }
  }, [restauranteId, fecha])

  // Al montar (y al cambiar restaurante/fecha) carga automáticamente — fecha=hoy por defecto.
  useEffect(() => {
    cargar()
  }, [cargar])

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

  const ingresos = ingresosDelDia(pedidos)

  return (
    <div className="min-h-screen flex flex-col">
      <header className="px-8 py-5 border-b border-[var(--color-border)] flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">Comida al Paso</p>
          <h1 className="text-2xl font-bold mt-0.5">Historial de pedidos</h1>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/" className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--color-surface-alt)]" style={{ color: 'var(--color-muted)' }}>
            <LayoutGrid size={15} />
            Tablero
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

      <div className="p-8 flex-1">
        <div className="flex items-center gap-3 mb-6">
          <label className="text-sm text-[var(--color-muted)]">Fecha</label>
          <input
            type="date"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            className="px-3 py-2 rounded-lg text-sm bg-[var(--color-surface-alt)] border border-[var(--color-border)]"
          />
          <button onClick={cargar} className="flex items-center gap-1.5 text-sm px-3 py-2 rounded-lg hover:bg-[var(--color-surface-alt)]" style={{ color: 'var(--color-muted)' }}>
            <RefreshCw size={14} />
            Actualizar
          </button>
        </div>

        {/* Resumen — base del reporte */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-6 max-w-xl">
          <div className="rounded-xl p-4 border border-[var(--color-border)]">
            <p className="text-2xl font-bold">{loading ? '—' : pedidos.length}</p>
            <p className="text-xs text-[var(--color-muted)]">Pedidos</p>
          </div>
          <div className="rounded-xl p-4 border border-[var(--color-border)]">
            <p className="text-2xl font-bold">{loading ? '—' : pedidos.filter((p) => p.estado === 'cancelado').length}</p>
            <p className="text-xs text-[var(--color-muted)]">Cancelados</p>
          </div>
          <div className="rounded-xl p-4 border border-[var(--color-border)]">
            <p className="text-2xl font-bold">{loading ? '—' : `S/${ingresos.toLocaleString('es-PE')}`}</p>
            <p className="text-xs text-[var(--color-muted)]">Ingresos (sin cancelados)</p>
          </div>
        </div>

        {loading && <p className="text-sm text-[var(--color-muted)]">Cargando…</p>}

        {!loading && error && (
          <div className="rounded-xl p-6 border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-muted)] mb-3">No se pudo cargar el historial.</p>
            <button onClick={cargar} className="text-sm font-semibold" style={{ color: 'var(--color-primary)' }}>
              Reintentar
            </button>
          </div>
        )}

        {!loading && !error && pedidos.length === 0 && (
          <div className="rounded-xl p-6 border border-[var(--color-border)]">
            <p className="text-sm text-[var(--color-muted)]">Sin pedidos en esta fecha.</p>
          </div>
        )}

        {!loading && !error && pedidos.length > 0 && (
          <div className="rounded-xl border border-[var(--color-border)] overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] text-left text-[var(--color-muted)]">
                  <th className="px-4 py-3 font-medium">Pedido</th>
                  <th className="px-4 py-3 font-medium">Cliente</th>
                  <th className="px-4 py-3 font-medium">Modo</th>
                  <th className="px-4 py-3 font-medium">Estado</th>
                  <th className="px-4 py-3 font-medium">Hora</th>
                  <th className="px-4 py-3 font-medium text-right">Total</th>
                </tr>
              </thead>
              <tbody>
                {pedidos.map((p) => (
                  <tr key={p.id} className="border-b border-[var(--color-border)] last:border-0">
                    <td className="px-4 py-3 font-mono">#{p.id.slice(0, 8).toUpperCase()}</td>
                    <td className="px-4 py-3">{p.contraparte}</td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">{p.modo}</td>
                    <td className="px-4 py-3">
                      <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full" style={{ color: ESTADO_COLOR[p.estado], backgroundColor: `${ESTADO_COLOR[p.estado]}20` }}>
                        {ESTADO_LABEL[p.estado]}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-[var(--color-muted)]">{new Date(p.createdAt).toLocaleTimeString('es-PE', { hour: '2-digit', minute: '2-digit' })}</td>
                    <td className="px-4 py-3 text-right font-semibold">S/{p.total.toLocaleString('es-PE')}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
