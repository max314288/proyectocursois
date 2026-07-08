// Tipos espejo del backend (resource/pedido, resource/pago, resource/mesa).
// LocalDate del backend serializa como ISO string ("YYYY-MM-DD"); BigDecimal como number.

export interface ItemPedidoRequest {
  itemMenuId: string
  cantidad: number
  notasItem?: string
}

export interface CrearPedidoRequest {
  restauranteId: string
  modo: 'recojo' | 'delivery' | 'salon'
  items: ItemPedidoRequest[]
  notas?: string
  direccion?: string
  referencia?: string
  latitud?: number
  longitud?: number
  mesaId?: string
  numComensales?: number
}

export type EstadoPedido = 'recibido' | 'en_preparacion' | 'listo' | 'entregado' | 'cancelado'

export interface PedidoResumenDTO {
  id: string
  contraparte: string
  modo: string
  estado: EstadoPedido
  total: number
  codigoQr: string | null
  createdAt: string
}

export interface ItemDetallePedidoDTO {
  itemNombre: string
  cantidad: number
  precioUnitario: number
  notasItem: string | null
}

export interface PedidoDetalleDTO {
  pedidoId: string
  cliente: string
  restaurante: string
  modo: string
  estado: EstadoPedido
  subtotal: number
  costoDelivery: number
  total: number
  codigoQr: string | null
  notas: string | null
  createdAt: string
  items: ItemDetallePedidoDTO[]
}

export interface HistorialEstadoDTO {
  estado: string
  cambiadoPor: string
  createdAt: string
}

export interface RegistrarPagoRequest {
  pedidoId: string
  metodo: 'tarjeta' | 'transferencia' | 'efectivo'
  referenciaExterna?: string
}

export interface PagoDTO {
  id: string
  pedidoId: string
  monto: number
  metodo: string
  estado: 'pendiente' | 'completado' | 'fallido'
  referenciaExterna: string | null
  createdAt: string
}

export interface MesaDTO {
  id: string
  numero: string
  capacidad: number
  estado: 'disponible' | 'ocupada' | 'reservada'
}
