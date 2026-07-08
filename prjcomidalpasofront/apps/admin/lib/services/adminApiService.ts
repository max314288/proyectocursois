import { apiFetch } from './apiClient'
import { getToken } from './authService'
import type { UsuarioDTO } from './authApiService'
import type {
  RestauranteDTO,
  CreateRestauranteRequest,
  UpdateRestauranteRequest,
  ElegirResponse,
  CreateItemMenuRequest,
  UpdateItemMenuRequest,
  MesaDTO,
  CreateMesaRequest,
  PedidoResumenDTO,
  PedidoDetalleDTO,
  HistorialEstadoDTO,
  PagoDTO,
} from './types'

// ─── Restaurantes ─────────────────────────────────────────────────────────────

export async function listarRestaurantes(): Promise<RestauranteDTO[]> {
  return apiFetch('/restaurantes?soloActivos=false', { token: getToken() })
}

export async function crearRestaurante(req: CreateRestauranteRequest): Promise<{ id: string }> {
  return apiFetch('/restaurantes', { method: 'POST', body: req, token: getToken() })
}

export async function actualizarRestaurante(id: string, req: UpdateRestauranteRequest): Promise<void> {
  return apiFetch(`/restaurantes/${id}`, { method: 'PUT', body: req, token: getToken() })
}

export async function toggleRestaurante(id: string, activo: boolean): Promise<void> {
  return apiFetch(`/restaurantes/${id}/toggle`, { method: 'PATCH', body: { activo }, token: getToken() })
}

/** Carta completa (items + categorías + etiquetas) — misma agregación que usa el cliente. */
export async function cargarCatalogo(restauranteId: string): Promise<ElegirResponse> {
  return apiFetch(`/restaurantes/${restauranteId}/elegir`, { token: getToken() })
}

// ─── Ítems de menú ────────────────────────────────────────────────────────────

export async function crearItem(req: CreateItemMenuRequest): Promise<{ id: string }> {
  return apiFetch('/menu/items', { method: 'POST', body: req, token: getToken() })
}

export async function actualizarItem(id: string, req: UpdateItemMenuRequest): Promise<void> {
  return apiFetch(`/menu/items/${id}`, { method: 'PUT', body: req, token: getToken() })
}

export async function toggleItem(id: string, disponible: boolean): Promise<void> {
  return apiFetch(`/menu/items/${id}/toggle`, { method: 'PATCH', body: { disponible }, token: getToken() })
}

export async function eliminarItem(id: string): Promise<void> {
  return apiFetch(`/menu/items/${id}`, { method: 'DELETE', token: getToken() })
}

// ─── Componentes de menú compuesto ─────────────────────────────────────────────

export async function agregarComponenteMenu(menuId: string, itemId: string, rol: string, obligatorio = true, orden = 0): Promise<{ id: string }> {
  return apiFetch(`/menu/items/${menuId}/componentes`, { method: 'POST', body: { itemId, rol, obligatorio, orden }, token: getToken() })
}

export async function quitarComponenteMenu(menuId: string, itemId: string): Promise<void> {
  return apiFetch(`/menu/items/${menuId}/componentes/${itemId}`, { method: 'DELETE', token: getToken() })
}

// ─── Opciones arma-plato ────────────────────────────────────────────────────────

export async function agregarOpcionArmaPlato(armaPlatoId: string, itemId: string, tipo: string, precioExtra: number): Promise<{ id: string }> {
  return apiFetch(`/menu/items/${armaPlatoId}/arma-plato`, { method: 'POST', body: { itemId, tipo, precioExtra }, token: getToken() })
}

// ─── Etiquetas ────────────────────────────────────────────────────────────────

export async function asignarEtiqueta(itemId: string, codigo: string): Promise<void> {
  return apiFetch(`/items/${itemId}/etiquetas`, { method: 'POST', body: { codigo }, token: getToken() })
}

export async function quitarEtiqueta(itemId: string, codigo: string): Promise<void> {
  return apiFetch(`/items/${itemId}/etiquetas/${codigo}`, { method: 'DELETE', token: getToken() })
}

// ─── Mesas ────────────────────────────────────────────────────────────────────

export async function listarMesas(restauranteId: string): Promise<MesaDTO[]> {
  return apiFetch(`/mesas?restauranteId=${restauranteId}`, { token: getToken() })
}

export async function crearMesa(req: CreateMesaRequest): Promise<{ id: string }> {
  return apiFetch('/mesas', { method: 'POST', body: req, token: getToken() })
}

export async function eliminarMesa(id: string): Promise<void> {
  return apiFetch(`/mesas/${id}`, { method: 'DELETE', token: getToken() })
}

// ─── Pedidos (solo lectura) ─────────────────────────────────────────────────────

export async function listarPedidosRestaurante(restauranteId: string, estado?: string, modo?: string): Promise<PedidoResumenDTO[]> {
  const params = new URLSearchParams()
  if (estado) params.set('estado', estado)
  if (modo) params.set('modo', modo)
  const qs = params.toString()
  return apiFetch(`/pedidos/restaurante/${restauranteId}${qs ? `?${qs}` : ''}`, { token: getToken() })
}

export async function obtenerPedido(id: string): Promise<PedidoDetalleDTO> {
  return apiFetch(`/pedidos/${id}`, { token: getToken() })
}

export async function historialPedido(id: string): Promise<HistorialEstadoDTO[]> {
  return apiFetch(`/pedidos/${id}/historial`, { token: getToken() })
}

// ─── Pagos (solo consulta) ──────────────────────────────────────────────────────

export async function pagoDePedido(pedidoId: string): Promise<PagoDTO> {
  return apiFetch(`/pagos/pedido/${pedidoId}`, { token: getToken() })
}

// ─── Usuarios ─────────────────────────────────────────────────────────────────

export async function listarUsuarios(rol?: string): Promise<UsuarioDTO[]> {
  return apiFetch(`/usuarios${rol ? `?rol=${rol}` : ''}`, { token: getToken() })
}
