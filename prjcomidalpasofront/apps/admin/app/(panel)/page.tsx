'use client'

import { useEffect, useState } from 'react'
import { ShoppingBag, UtensilsCrossed, Clock, TrendingUp } from 'lucide-react'
import { useRestauranteStore } from '@/store/restauranteStore'
import { listarPedidosRestaurante, cargarCatalogo } from '@/lib/services/adminApiService'
import type { PedidoResumenDTO, ElegirResponse } from '@/lib/services/types'

function esHoy(iso: string): boolean {
  const d = new Date(iso)
  const hoy = new Date()
  return d.getFullYear() === hoy.getFullYear() && d.getMonth() === hoy.getMonth() && d.getDate() === hoy.getDate()
}

export default function DashboardPage() {
  const restaurante = useRestauranteStore((s) => s.restaurante)
  const [pedidos, setPedidos] = useState<PedidoResumenDTO[]>([])
  const [catalogo, setCatalogo] = useState<ElegirResponse | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!restaurante) return
    setLoading(true)
    Promise.all([listarPedidosRestaurante(restaurante.id), cargarCatalogo(restaurante.id)])
      .then(([p, c]) => {
        setPedidos(p)
        setCatalogo(c)
      })
      .finally(() => setLoading(false))
  }, [restaurante])

  const pedidosHoy = pedidos.filter((p) => esHoy(p.createdAt))
  const enCurso = pedidos.filter((p) => p.estado === 'recibido' || p.estado === 'en_preparacion' || p.estado === 'listo')
  const ingresosHoy = pedidosHoy.filter((p) => p.estado !== 'cancelado').reduce((sum, p) => sum + p.total, 0)

  const stats = [
    { label: 'Pedidos hoy', value: loading ? '—' : String(pedidosHoy.length), icon: ShoppingBag, color: '#823b18' },
    { label: 'En curso', value: loading ? '—' : String(enCurso.length), icon: Clock, color: '#b45309' },
    { label: 'Productos', value: loading ? '—' : String(catalogo?.items.length ?? 0), icon: UtensilsCrossed, color: '#54651e' },
    { label: 'Ingresos hoy', value: loading ? '—' : `S/${ingresosHoy.toLocaleString('es-PE')}`, icon: TrendingUp, color: '#0369a1' },
  ]

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-[var(--color-on-surface)]">Dashboard</h1>
        <p className="text-[var(--color-muted)] mt-1">{restaurante ? `Resumen de ${restaurante.nombre}` : 'Selecciona un restaurante'}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
            <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-xl" style={{ backgroundColor: color + '18' }}>
              <Icon size={20} style={{ color }} />
            </div>
            <p className="text-2xl font-bold text-[var(--color-on-surface)]">{value}</p>
            <p className="text-sm text-[var(--color-muted)] mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-[var(--color-border)] bg-white p-6">
        <h2 className="font-semibold text-[var(--color-on-surface)] mb-3">Pedidos recientes</h2>
        {loading ? (
          <p className="text-sm text-[var(--color-muted)]">Cargando…</p>
        ) : pedidos.length === 0 ? (
          <p className="text-sm text-[var(--color-muted)]">Sin pedidos todavía.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {pedidos.slice(0, 5).map((p) => (
              <div key={p.id} className="flex items-center justify-between text-sm py-1.5 border-b border-[var(--color-border)] last:border-0">
                <span className="font-mono">#{p.id.slice(0, 8).toUpperCase()}</span>
                <span className="text-[var(--color-muted)]">{p.contraparte}</span>
                <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--color-border)]">{p.estado}</span>
                <span className="font-semibold">S/{p.total.toLocaleString('es-PE')}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
