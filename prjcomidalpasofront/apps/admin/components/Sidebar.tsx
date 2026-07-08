'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  ShoppingBag,
  Settings,
  User,
  LogOut,
  Store,
} from "lucide-react";
import { cerrarSesion } from "@/lib/services/authService";
import { SIDEBAR_LINKS, esRutaActiva } from "@/lib/services/navigationService";
import { listarRestaurantes } from "@/lib/services/adminApiService";
import { useRestauranteStore } from "@/store/restauranteStore";
import type { RestauranteDTO } from "@/lib/services/types";

// Mapa de iconos por iconName (VIEW — solo presentación)
const ICON_MAP = {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  ShoppingBag,
  Settings,
  User,
} as const

type IconName = keyof typeof ICON_MAP

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const restaurante = useRestauranteStore((s) => s.restaurante)
  const seleccionar = useRestauranteStore((s) => s.seleccionar)
  const [restaurantes, setRestaurantes] = useState<RestauranteDTO[]>([])

  useEffect(() => {
    listarRestaurantes()
      .then((data) => {
        setRestaurantes(data)
        if (!restaurante && data.length > 0) {
          seleccionar({ id: data[0].id, nombre: data[0].nombre })
        }
      })
      .catch(() => {})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // CONTROLLER delegado a authService (MVC + SOLID-S)
  function handleLogout() {
    cerrarSesion()
    router.replace('/login')
  }

  return (
    <aside className="fixed left-0 top-0 h-screen w-64 bg-[var(--color-surface-alt)] border-r border-[var(--color-border)] flex flex-col">
      <div className="px-6 py-5 border-b border-[var(--color-border)]">
        <p className="text-xs font-semibold uppercase tracking-widest text-[var(--color-muted)]">Comida al Paso</p>
        <p className="text-lg font-bold text-[var(--color-primary)] mt-0.5">Admin</p>
      </div>

      {/* Selector de restaurante — el admin mantiene el que elija aquí */}
      <div className="px-4 py-3 border-b border-[var(--color-border)]">
        <label className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-widest text-[var(--color-muted)] mb-1.5">
          <Store size={11} /> Restaurante
        </label>
        <select
          value={restaurante?.id ?? ''}
          onChange={(e) => {
            const r = restaurantes.find((x) => x.id === e.target.value)
            if (r) seleccionar({ id: r.id, nombre: r.nombre })
          }}
          className="w-full text-sm px-2.5 py-2 rounded-lg bg-white border border-[var(--color-border)] text-[var(--color-on-surface)]"
        >
          {restaurantes.length === 0 && <option value="">Cargando…</option>}
          {restaurantes.map((r) => (
            <option key={r.id} value={r.id}>
              {r.nombre}
            </option>
          ))}
        </select>
      </div>

      {/* Links delegados a navigationService (MVC + SOLID-S) */}
      <nav className="flex-1 px-3 py-4 space-y-1">
        {SIDEBAR_LINKS.map(({ href, label, iconName }) => {
          const Icon = ICON_MAP[iconName as IconName]
          // Detección de ruta activa delegada a navigationService
          const active = esRutaActiva(pathname, href)
          return (
            <Link
              key={href}
              href={href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                active
                  ? "bg-[var(--color-primary)] text-white"
                  : "text-[var(--color-on-surface)] hover:bg-[var(--color-border)]"
              }`}
            >
              <Icon size={18} />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 py-4 border-t border-[var(--color-border)]">
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium w-full transition-colors hover:bg-[var(--color-border)]"
          style={{ color: 'var(--color-muted)' }}
        >
          <LogOut size={18} />
          Cerrar sesión
        </button>
      </div>
    </aside>
  );
}
