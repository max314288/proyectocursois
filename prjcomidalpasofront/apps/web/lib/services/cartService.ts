/**
 * cartService.ts — CONTROLLER layer
 *
 * SOLID:
 *  S — cada función tiene una única responsabilidad
 *  O — funciones puras, extensibles sin modificación
 *  I — interfaz mínima: solo recibe lo que necesita
 *  D — el componente depende de esta abstracción, no de cálculos inline
 */

import type { CartItem } from '@/store/cartStore'

// ─── Cálculos de precios ──────────────────────────────────────────────────────

/**
 * Calcula el subtotal de un ítem (precio × cantidad)
 * S: responsabilidad única — solo multiplica precio por cantidad
 */
export function calcularSubtotalItem(price: number, quantity: number): number {
  return price * quantity
}

/**
 * Calcula el total sumando todos los ítems del carrito
 * S: responsabilidad única — solo suma los subtotales
 */
export function calcularTotalCarrito(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
}

/**
 * Cuenta la cantidad total de ítems en el carrito
 * S: responsabilidad única — solo cuenta unidades
 */
export function contarItems(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.quantity, 0)
}

// ─── Formateo ─────────────────────────────────────────────────────────────────

/**
 * Formatea un precio en soles peruanos
 * S: responsabilidad única — solo formatea el precio
 */
export function formatearPrecio(precio: number): string {
  return `S/${precio.toLocaleString('es-PE')}`
}
