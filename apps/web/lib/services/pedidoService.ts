/**
 * pedidoService.ts — CONTROLLER layer
 *
 * SOLID:
 *  S — cada función tiene una única responsabilidad
 *  O — se pueden agregar nuevos pasos/validaciones sin modificar los existentes
 *  I — BowlSelection es una interfaz mínima y específica
 *  D — el componente depende de estas abstracciones, no de lógica inline
 */

import { BOWL_BASE_PRICE } from '@/lib/data'
import type { BuilderItem } from '@/lib/data'
import type { CartItem } from '@/store/cartStore'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export interface BowlSelection {
  base: BuilderItem | null
  proteina: BuilderItem | null
  toppings: BuilderItem[]
  bebida: BuilderItem | null
}

/**
 * Estado inicial del bowl — exportado para que el componente no repita el objeto
 */
export const BOWL_SELECTION_INICIAL: BowlSelection = {
  base: null,
  proteina: null,
  toppings: [],
  bebida: null,
}

// ─── Cálculo de precio ────────────────────────────────────────────────────────

/**
 * Calcula el precio total del bowl sumando todos los componentes seleccionados
 * S: responsabilidad única — solo calcula el precio
 */
export function calcularPrecioBowl(sel: BowlSelection): number {
  return (
    BOWL_BASE_PRICE +
    (sel.base?.price ?? 0) +
    (sel.proteina?.price ?? 0) +
    sel.toppings.reduce((s, t) => s + t.price, 0) +
    (sel.bebida?.price ?? 0)
  )
}

// ─── Navegación entre pasos ───────────────────────────────────────────────────

/**
 * Determina si se puede avanzar al siguiente paso del wizard
 * S: encapsula las reglas de validación por paso
 */
export function puedeAvanzarPaso(paso: number, sel: BowlSelection): boolean {
  if (paso === 0) return !!sel.base
  if (paso === 1) return !!sel.proteina
  if (paso === 2) return true // toppings son opcionales
  if (paso === 3) return !!sel.bebida
  return false
}

// ─── Selección de toppings ────────────────────────────────────────────────────

/**
 * Alterna un topping: lo agrega si no existe, lo quita si ya existe
 * S: responsabilidad única — solo alterna la selección
 * No muta el array original (inmutabilidad)
 */
export function toggleTopping(
  toppings: BuilderItem[],
  item: BuilderItem
): BuilderItem[] {
  const existe = toppings.find((t) => t.id === item.id)
  return existe
    ? toppings.filter((t) => t.id !== item.id)
    : [...toppings, item]
}

// ─── Construcción del CartItem ────────────────────────────────────────────────

/**
 * Construye el nombre descriptivo del bowl
 * S: responsabilidad única — solo genera el nombre
 */
export function construirNombreBowl(sel: BowlSelection): string {
  if (!sel.base || !sel.proteina) return 'Bowl personalizado'
  return `Bowl: ${sel.base.name} + ${sel.proteina.name}`
}

/**
 * Convierte la selección del bowl en un CartItem listo para agregar al carrito
 * Retorna null si faltan componentes obligatorios
 * S: responsabilidad única — solo convierte la selección
 */
export function seleccionACartItem(
  sel: BowlSelection
): Omit<CartItem, 'quantity'> | null {
  if (!sel.base || !sel.proteina || !sel.bebida) return null
  return {
    id: `bowl-${Date.now()}`,
    name: construirNombreBowl(sel),
    price: calcularPrecioBowl(sel),
    image: sel.proteina.image,
    category: 'bowl',
  }
}

// ─── Estado de selección visual ───────────────────────────────────────────────

/**
 * Determina si un ítem está seleccionado en el paso actual del wizard
 * S: encapsula la lógica de selección por paso
 */
export function obtenerSeleccionActual(
  paso: number,
  sel: BowlSelection,
  itemId: string
): boolean {
  if (paso === 0) return sel.base?.id === itemId
  if (paso === 1) return sel.proteina?.id === itemId
  if (paso === 2) return !!sel.toppings.find((t) => t.id === itemId)
  return sel.bebida?.id === itemId
}
