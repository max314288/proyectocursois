/**
 * kitchenService.ts — CONTROLLER layer (restaurant)
 *
 * SOLID:
 *  S — define únicamente la configuración del tablero kanban
 *  O — agregar nuevas columnas o estados sin modificar las existentes
 *  I — KanbanColumn es una interfaz mínima y específica
 */

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface KanbanColumn {
  id: 'pending' | 'progress' | 'done'
  label: string
  colorVar: string
}

export interface Order {
  id: string
  items: number
  mesa?: string
  createdAt: string
}

// ─── Configuración del tablero ────────────────────────────────────────────────

/**
 * Define las columnas del tablero kanban de la cocina
 * S: centraliza la config del tablero — no repetir en el componente
 * O: agregar nuevos estados no requiere modificar los existentes
 */
export const KANBAN_COLUMNS: KanbanColumn[] = [
  {
    id: 'pending',
    label: 'Nuevos',
    colorVar: 'var(--color-pending)',
  },
  {
    id: 'progress',
    label: 'En preparación',
    colorVar: 'var(--color-progress)',
  },
  {
    id: 'done',
    label: 'Listos',
    colorVar: 'var(--color-done)',
  },
]

// ─── Funciones de negocio ─────────────────────────────────────────────────────

/**
 * Retorna el número de pedidos en una columna
 * S: responsabilidad única — solo cuenta pedidos
 */
export function contarPedidosPorColumna(
  orders: Order[],
  columnId: KanbanColumn['id']
): number {
  return orders.filter((o) => {
    if (columnId === 'pending') return true // placeholder: todos son nuevos
    return false
  }).length
}

/**
 * Determina el color de fondo de la badge de una columna (con opacidad)
 * S: encapsula el cálculo del color para no repetirlo en el JSX
 */
export function getBadgeColor(colorVar: string): string {
  return `${colorVar}25`
}
