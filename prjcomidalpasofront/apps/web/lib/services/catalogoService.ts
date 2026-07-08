import { cargarCarta } from './restauranteService'
import type { ElegirResponse, ItemCartaDTO } from './restauranteApiService'

export type { ElegirResponse, ItemCartaDTO }

/** Carga la carta completa (items + categorías + etiquetas) del restaurante elegido. */
export async function cargarCatalogo(restauranteId: string): Promise<ElegirResponse | null> {
  return cargarCarta(restauranteId)
}

/**
 * Filtra los ítems del catálogo por el código fijo de categoría
 * ('menu' | 'a_la_carta' | 'entradas' | 'postres' | 'bebidas' | 'arma_plato'),
 * no por el nombre (que es editable por restaurante).
 */
export function itemsPorCategoriaCodigo(data: ElegirResponse, codigo: string): ItemCartaDTO[] {
  const categoria = data.categorias.find((c) => c.codigo === codigo)
  if (!categoria) return []
  return data.items.filter((i) => i.categoria === categoria.nombre)
}
