/**
 * menuService.ts — CONTROLLER layer
 *
 * SOLID:
 *  S — cada función tiene una única responsabilidad
 *  O — fácil de extender: agregar nuevos filtros sin tocar lógica existente
 *  I — recibe solo los datos que necesita (no el store completo)
 */

import type { MenuItem } from '@/lib/data'

// ─── Filtrado de menús ────────────────────────────────────────────────────────

/**
 * Filtra una lista de menús por el nombre que contiene el filtro
 * Retorna la referencia original si el filtro es "Todos" (optimización)
 * S: responsabilidad única — solo filtra
 */
export function filtrarMenus(menus: MenuItem[], filtro: string): MenuItem[] {
  if (filtro === 'Todos') return menus
  return menus.filter((m) => m.name.includes(filtro))
}

// ─── Lógica de presentación ───────────────────────────────────────────────────

/**
 * Determina si un menú debe mostrarse como "destacado" en la grilla
 * S: encapsula la regla de negocio visual: solo el primero en vista "Todos"
 */
export function esMenuDestacado(index: number, filtro: string): boolean {
  return index === 0 && filtro === 'Todos'
}
