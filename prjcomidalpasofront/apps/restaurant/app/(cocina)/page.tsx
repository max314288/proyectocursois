'use client'

import { Clock, ChefHat, CheckCircle, LogOut, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { cerrarSesion } from "@/lib/services/authService";
import { KANBAN_COLUMNS, getBadgeColor } from "@/lib/services/kitchenService";

// Mapa de iconos por id de columna (VIEW — solo presentación)
const COLUMN_ICONS = {
  pending:  Clock,
  progress: ChefHat,
  done:     CheckCircle,
} as const

// Pedidos vacíos — se conectarán al backend
const orders: never[] = []

export default function KitchenPage() {
  const router = useRouter()

  // CONTROLLER delegado a authService (MVC + SOLID-S)
  function handleLogout() {
    cerrarSesion()
    router.replace('/login')
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
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
          <Link
            href="/perfil"
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--color-surface-alt)]"
            style={{ color: 'var(--color-muted)' }}
          >
            <User size={15} />
            Mi Perfil
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-sm px-3 py-1.5 rounded-lg transition-colors hover:bg-[var(--color-surface-alt)]"
            style={{ color: 'var(--color-muted)' }}
          >
            <LogOut size={15} />
            Salir
          </button>
        </div>
      </header>

      {/* Kanban columns — configuración delegada a kitchenService (MVC + SOLID-S) */}
      <div className="flex-1 grid grid-cols-3 gap-px bg-[var(--color-border)]">
        {KANBAN_COLUMNS.map(({ id, label, colorVar }) => {
          const Icon = COLUMN_ICONS[id]
          return (
            <div key={id} className="bg-[var(--color-surface-card)] p-5 flex flex-col">
              <div className="flex items-center gap-2 mb-5">
                <Icon size={18} style={{ color: colorVar }} />
                <span className="font-semibold text-sm uppercase tracking-wide">{label}</span>
                <span
                  className="ml-auto text-xs font-bold px-2 py-0.5 rounded-full"
                  style={{ backgroundColor: getBadgeColor(colorVar), color: colorVar }}
                >
                  {orders.length}
                </span>
              </div>

              {orders.length === 0 ? (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-xs text-[var(--color-muted)]">Sin pedidos</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {/* Order cards se conectarán al backend */}
                </div>
              )}
            </div>
          )
        })}
      </div>
    </div>
  );
}
