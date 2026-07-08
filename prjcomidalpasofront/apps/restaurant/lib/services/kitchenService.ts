/**
 * kitchenService.ts — CONTROLLER layer (restaurant)
 *
 * Mapea los estados reales del pedido (backend) a las 3 columnas del tablero
 * kanban y define las transiciones válidas por botón.
 */

import type { PedidoResumenDTO, EstadoPedido } from './types'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface KanbanColumn {
  id: 'pending' | 'progress' | 'done'
  label: string
  colorVar: string
}

// ─── Configuración del tablero ────────────────────────────────────────────────

export const KANBAN_COLUMNS: KanbanColumn[] = [
  { id: 'pending', label: 'Nuevos', colorVar: 'var(--color-pending)' },
  { id: 'progress', label: 'En preparación', colorVar: 'var(--color-progress)' },
  { id: 'done', label: 'Listos', colorVar: 'var(--color-done)' },
]

const ESTADO_A_COLUMNA: Partial<Record<EstadoPedido, KanbanColumn['id']>> = {
  recibido: 'pending',
  en_preparacion: 'progress',
  listo: 'done',
}

const SIGUIENTE_ESTADO: Record<KanbanColumn['id'], EstadoPedido> = {
  pending: 'en_preparacion',
  progress: 'listo',
  done: 'entregado',
}

// ─── Funciones de negocio ─────────────────────────────────────────────────────

/** Pedidos activos (recibido/en_preparacion/listo) de una columna — entregado/cancelado salen del tablero. */
export function pedidosPorColumna(pedidos: PedidoResumenDTO[], columnId: KanbanColumn['id']): PedidoResumenDTO[] {
  return pedidos.filter((p) => ESTADO_A_COLUMNA[p.estado] === columnId)
}

export function contarPedidosPorColumna(pedidos: PedidoResumenDTO[], columnId: KanbanColumn['id']): number {
  return pedidosPorColumna(pedidos, columnId).length
}

/** Estado destino al pulsar el botón de avance de una columna. */
export function siguienteEstado(columnId: KanbanColumn['id']): EstadoPedido {
  return SIGUIENTE_ESTADO[columnId]
}

export function getBadgeColor(colorVar: string): string {
  return `${colorVar}25`
}

export const ESTADO_LABEL: Record<EstadoPedido, string> = {
  recibido: 'Recibido',
  en_preparacion: 'En preparación',
  listo: 'Listo',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
}

/** Fecha local de hoy en formato YYYY-MM-DD (para el filtro por fecha del backend). */
export function fechaHoyISO(): string {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

/** Suma de totales de pedidos que no están cancelados — base del reporte de ingresos del día. */
export function ingresosDelDia(pedidos: PedidoResumenDTO[]): number {
  return pedidos.filter((p) => p.estado !== 'cancelado').reduce((sum, p) => sum + p.total, 0)
}
