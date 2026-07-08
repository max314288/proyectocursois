import { apiFetch } from './apiClient'
import { getToken } from './authService'
import type { PedidoResumenDTO, PedidoDetalleDTO, RestauranteDTO, PagoDTO } from './types'

export async function getMiRestaurante(): Promise<RestauranteDTO> {
  return apiFetch('/restaurantes/mio', { token: getToken() })
}

export async function listarPedidos(restauranteId: string): Promise<PedidoResumenDTO[]> {
  return apiFetch(`/pedidos/restaurante/${restauranteId}`, { token: getToken() })
}

/** Historial de pedidos de una fecha (YYYY-MM-DD) — todos los estados, base para reportes. */
export async function listarPedidosPorFecha(restauranteId: string, fecha: string): Promise<PedidoResumenDTO[]> {
  return apiFetch(`/pedidos/restaurante/${restauranteId}?fecha=${fecha}`, { token: getToken() })
}

export async function detallePedido(id: string): Promise<PedidoDetalleDTO> {
  return apiFetch(`/pedidos/${id}`, { token: getToken() })
}

export async function cambiarEstado(pedidoId: string, estado: string): Promise<void> {
  return apiFetch(`/pedidos/${pedidoId}/estado`, { method: 'PATCH', body: { estado }, token: getToken() })
}

export async function pagoDePedido(pedidoId: string): Promise<PagoDTO> {
  return apiFetch(`/pagos/pedido/${pedidoId}`, { token: getToken() })
}

export async function confirmarPago(pagoId: string): Promise<void> {
  return apiFetch(`/pagos/${pagoId}/confirmar`, { method: 'PATCH', token: getToken() })
}
