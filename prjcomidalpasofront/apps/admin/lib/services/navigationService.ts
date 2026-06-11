/**
 * navigationService.ts — CONTROLLER layer (admin)
 *
 * SOLID:
 *  S — define únicamente la lógica de navegación del sidebar
 *  O — agregar nuevos links sin modificar la lógica de detección de ruta activa
 *  I — SidebarLink es una interfaz mínima y específica
 *  D — el Sidebar depende de esta abstracción, no de rutas hardcodeadas
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface SidebarLink {
  href: string
  label: string
  iconName: string
}

// ─── Configuración de navegación ─────────────────────────────────────────────

/**
 * Define los links del sidebar
 * S: centraliza la config de navegación — un solo lugar para mantener
 * O: agregar links sin modificar la lógica de renderizado
 */
export const SIDEBAR_LINKS: SidebarLink[] = [
  { href: '/',              label: 'Dashboard',    iconName: 'LayoutDashboard'  },
  { href: '/productos',     label: 'Productos',    iconName: 'UtensilsCrossed'  },
  { href: '/menus',         label: 'Menús',        iconName: 'BookOpen'         },
  { href: '/pedidos',       label: 'Pedidos',      iconName: 'ShoppingBag'      },
  { href: '/configuracion', label: 'Configuración',iconName: 'Settings'         },
]

// ─── Lógica de navegación ─────────────────────────────────────────────────────

/**
 * Determina si una ruta está activa comparando con el pathname actual
 * S: responsabilidad única — solo detecta si la ruta está activa
 * Función pura — 100% testeable
 */
export function esRutaActiva(pathname: string, href: string): boolean {
  return pathname === href
}

/**
 * Obtiene el label de la ruta activa dado un pathname
 * S: responsabilidad única — busca el label de la ruta actual
 */
export function getLabelRutaActiva(pathname: string): string {
  const link = SIDEBAR_LINKS.find((l) => esRutaActiva(pathname, l.href))
  return link?.label ?? ''
}

/**
 * Verifica si un pathname corresponde a algún link del sidebar
 * S: responsabilidad única — valida si el path es una ruta conocida
 */
export function esRutaConocida(pathname: string): boolean {
  return SIDEBAR_LINKS.some((l) => l.href === pathname)
}
