import { getToken } from './authService'
import { getImagenItem } from './imagenService'
import {
  listarRestaurantesApi,
  elegirRestauranteApi,
  type RestauranteDTO,
  type ElegirResponse,
  type ItemCartaDTO,
  type OpcionArmaPlatoDTO,
} from './restauranteApiService'
import type { CartItem } from '@/store/cartStore'

// ─── Carga de datos (controller) ─────────────────────────────────────────────

export async function cargarRestaurantes(): Promise<RestauranteDTO[] | null> {
  try {
    return await listarRestaurantesApi(getToken())
  } catch {
    return null
  }
}

export async function cargarCarta(id: string): Promise<ElegirResponse | null> {
  try {
    return await elegirRestauranteApi(id, getToken())
  } catch {
    return null
  }
}

// ─── Funciones puras de presentación ─────────────────────────────────────────

export function getServicios(r: RestauranteDTO): string[] {
  const servicios: string[] = []
  if (r.aceptaRecojo) servicios.push('Recojo')
  if (r.aceptaDelivery) servicios.push('Delivery')
  if (r.aceptaSalon) servicios.push('Salón')
  return servicios
}

export function filtrarItemsPorCategoria(
  items: ItemCartaDTO[],
  categoriaNombre: string,
): ItemCartaDTO[] {
  if (categoriaNombre === 'Todos') return items
  return items.filter((i) => i.categoria === categoriaNombre)
}

export function formatearPrecioSoles(precio: number): string {
  return `S/ ${precio.toLocaleString('es-PE', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`
}

// ─── Carrito ──────────────────────────────────────────────────────────────────

export function itemACartItem(
  item: ItemCartaDTO,
  restauranteId: string,
): Omit<CartItem, 'quantity'> {
  return {
    id: `rest-${restauranteId}-item-${item.id}`,
    itemMenuId: item.id,
    restauranteId,
    name: item.nombre,
    price: item.precio,
    image: item.imagenUrl ?? getImagenItem(item.nombre, item.categoria, item.id),
    category: item.categoria,
  }
}

export function calcularPrecioArmaPlato(
  item: ItemCartaDTO,
  seleccion: OpcionArmaPlatoDTO[],
): number {
  return seleccion.reduce((sum, o) => sum + o.precioExtra, item.precio)
}

export function armaPlatoACartItem(
  item: ItemCartaDTO,
  restauranteId: string,
  seleccion: OpcionArmaPlatoDTO[],
): Omit<CartItem, 'quantity'> {
  const detalle = seleccion.map((o) => o.nombre).join(', ')
  return {
    id: `rest-${restauranteId}-item-${item.id}-${Date.now()}`,
    itemMenuId: item.id,
    restauranteId,
    name: detalle ? `${item.nombre} (${detalle})` : item.nombre,
    price: calcularPrecioArmaPlato(item, seleccion),
    image: item.imagenUrl ?? getImagenItem(item.nombre, item.categoria, item.id),
    category: item.categoria,
    notasItem: detalle || undefined,
  }
}
