'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  ShoppingBag,
  Settings,
  LogOut,
} from "lucide-react";
import { cerrarSesion } from "@/lib/services/authService";
import { SIDEBAR_LINKS, esRutaActiva } from "@/lib/services/navigationService";

// Mapa de iconos por iconName (VIEW — solo presentación)
const ICON_MAP = {
  LayoutDashboard,
  UtensilsCrossed,
  BookOpen,
  ShoppingBag,
  Settings,
} as const

type IconName = keyof typeof ICON_MAP

export default function Sidebar() {
  const pathname = usePathname()
  const router = useRouter()

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
