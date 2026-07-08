/**
 * pedidoService.ts — CONTROLLER layer para el bowl builder ("Arma tu plato")
 *
 * Opera sobre las opciones reales del backend (OpcionArmaPlatoDTO), agrupadas
 * por tipo ('base' | 'proteina' | 'topping' | 'bebida' — únicos valores que
 * acepta arma_plato_componentes.tipo en la BD).
 */

import { getImagenItem } from './imagenService'
import type { ItemCartaDTO, OpcionArmaPlatoDTO } from './restauranteApiService'
import type { CartItem } from '@/store/cartStore'

export interface BowlSelection {
  base: OpcionArmaPlatoDTO | null
  proteina: OpcionArmaPlatoDTO | null
  toppings: OpcionArmaPlatoDTO[]
  bebida: OpcionArmaPlatoDTO | null
}

export const BOWL_SELECTION_INICIAL: BowlSelection = {
  base: null,
  proteina: null,
  toppings: [],
  bebida: null,
}

export const ORDEN_TIPOS = ['base', 'proteina', 'topping', 'bebida'] as const

export const LABEL_TIPO: Record<string, string> = {
  base: 'Base',
  proteina: 'Proteína',
  topping: 'Toppings',
  bebida: 'Bebida',
}

export function esTipoMultiple(tipo: string): boolean {
  return tipo === 'topping'
}

export function agruparOpcionesPorTipo(
  opciones: OpcionArmaPlatoDTO[]
): Record<string, OpcionArmaPlatoDTO[]> {
  return opciones.reduce<Record<string, OpcionArmaPlatoDTO[]>>((acc, o) => {
    ;(acc[o.tipo] ??= []).push(o)
    return acc
  }, {})
}

export function calcularPrecioBowl(item: ItemCartaDTO, sel: BowlSelection): number {
  return (
    item.precio +
    (sel.base?.precioExtra ?? 0) +
    (sel.proteina?.precioExtra ?? 0) +
    sel.toppings.reduce((s, t) => s + t.precioExtra, 0) +
    (sel.bebida?.precioExtra ?? 0)
  )
}

export function puedeAvanzarPaso(tipo: string, sel: BowlSelection): boolean {
  if (tipo === 'base') return !!sel.base
  if (tipo === 'proteina') return !!sel.proteina
  if (tipo === 'topping') return true // opcional
  if (tipo === 'bebida') return !!sel.bebida
  return true
}

export function toggleOpcion(
  sel: BowlSelection,
  tipo: string,
  opcion: OpcionArmaPlatoDTO
): BowlSelection {
  if (tipo === 'topping') {
    const existe = sel.toppings.find((t) => t.itemId === opcion.itemId)
    return {
      ...sel,
      toppings: existe
        ? sel.toppings.filter((t) => t.itemId !== opcion.itemId)
        : [...sel.toppings, opcion],
    }
  }
  if (tipo === 'base') return { ...sel, base: opcion }
  if (tipo === 'proteina') return { ...sel, proteina: opcion }
  if (tipo === 'bebida') return { ...sel, bebida: opcion }
  return sel
}

export function estaSeleccionado(sel: BowlSelection, tipo: string, itemId: string): boolean {
  if (tipo === 'base') return sel.base?.itemId === itemId
  if (tipo === 'proteina') return sel.proteina?.itemId === itemId
  if (tipo === 'topping') return sel.toppings.some((t) => t.itemId === itemId)
  if (tipo === 'bebida') return sel.bebida?.itemId === itemId
  return false
}

export function imagenOpcion(o: OpcionArmaPlatoDTO): string {
  return getImagenItem(o.nombre, o.tipo, o.itemId)
}

export function construirNombreBowl(item: ItemCartaDTO, sel: BowlSelection): string {
  if (!sel.base || !sel.proteina) return item.nombre
  return `${item.nombre}: ${sel.base.nombre} + ${sel.proteina.nombre}`
}

function construirNotasBowl(sel: BowlSelection): string {
  const partes: string[] = []
  if (sel.base) partes.push(`Base: ${sel.base.nombre}`)
  if (sel.proteina) partes.push(`Proteína: ${sel.proteina.nombre}`)
  if (sel.toppings.length) partes.push(`Toppings: ${sel.toppings.map((t) => t.nombre).join(', ')}`)
  if (sel.bebida) partes.push(`Bebida: ${sel.bebida.nombre}`)
  return partes.join(' · ')
}

/**
 * Convierte la selección en un CartItem. `tiposObligatorios` son los tipos
 * presentes en la carta de este restaurante (excluyendo 'topping', que es
 * siempre opcional) — si un tipo no tiene opciones, no se exige.
 */
export function seleccionACartItem(
  item: ItemCartaDTO,
  restauranteId: string,
  sel: BowlSelection,
  tiposObligatorios: string[]
): Omit<CartItem, 'quantity'> | null {
  if (tiposObligatorios.includes('base') && !sel.base) return null
  if (tiposObligatorios.includes('proteina') && !sel.proteina) return null
  if (tiposObligatorios.includes('bebida') && !sel.bebida) return null

  return {
    id: `bowl-${item.id}-${Date.now()}`,
    itemMenuId: item.id,
    restauranteId,
    name: construirNombreBowl(item, sel),
    price: calcularPrecioBowl(item, sel),
    image: item.imagenUrl ?? getImagenItem(item.nombre, item.categoria, item.id),
    category: item.categoria,
    notasItem: construirNotasBowl(sel),
  }
}
