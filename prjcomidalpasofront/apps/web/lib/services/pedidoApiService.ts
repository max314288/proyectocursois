import { apiFetch } from './apiClient'
import { getToken } from './authService'
import type {
  CrearPedidoRequest,
  PedidoResumenDTO,
  PedidoDetalleDTO,
  HistorialEstadoDTO,
  RegistrarPagoRequest,
  MesaDTO,
} from './types'

export async function crearPedido(req: CrearPedidoRequest): Promise<{ id: string }> {
  return apiFetch('/pedidos', { method: 'POST', body: req, token: getToken() })
}

export async function registrarPago(req: RegistrarPagoRequest): Promise<{ id: string }> {
  return apiFetch('/pagos', { method: 'POST', body: req, token: getToken() })
}

export async function obtenerPedido(id: string): Promise<PedidoDetalleDTO> {
  return apiFetch(`/pedidos/${id}`, { token: getToken() })
}

export async function listarMisPedidos(): Promise<PedidoResumenDTO[]> {
  return apiFetch('/pedidos/cliente', { token: getToken() })
}

export async function historialPedido(id: string): Promise<HistorialEstadoDTO[]> {
  return apiFetch(`/pedidos/${id}/historial`, { token: getToken() })
}

export async function cancelarPedido(id: string): Promise<void> {
  return apiFetch(`/pedidos/${id}/cancelar`, { method: 'POST', token: getToken() })
}

export async function listarMesas(restauranteId: string): Promise<MesaDTO[]> {
  return apiFetch(`/mesas?restauranteId=${restauranteId}&estado=disponible`, { token: getToken() })
}
