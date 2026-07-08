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

export interface CreateMesaRequest {
  restauranteId: string
  numero: string
  capacidad: number
}

export interface RestauranteDTO {
  id: string
  nombre: string
  direccion: string
  telefono: string | null
  aceptaRecojo: boolean
  aceptaDelivery: boolean
  aceptaSalon: boolean
  activo: boolean
}

export interface CreateRestauranteRequest {
  usuarioId: string
  nombre: string
  direccion: string
  telefono?: string
  logoUrl?: string
  aceptaRecojo: boolean
  aceptaDelivery: boolean
  aceptaSalon: boolean
}

export interface UpdateRestauranteRequest {
  nombre: string
  direccion: string
  telefono?: string
  logoUrl?: string
  aceptaRecojo: boolean
  aceptaDelivery: boolean
  aceptaSalon: boolean
}

export interface CategoriaDTO {
  id: string
  codigo: string
  nombre: string
  descripcion: string | null
  orden: number
}

export interface EtiquetaDTO {
  codigo: string
  nombre: string
  color: string | null
}

export interface ComponenteDTO {
  itemId: string
  nombre: string
  categoria: string
  rol: string
  obligatorio: boolean
  precio: number
  orden: number
}

export interface OpcionArmaPlatoDTO {
  tipo: string
  itemId: string
  nombre: string
  precioExtra: number
  disponible: boolean
}

export interface ItemCartaDTO {
  id: string
  nombre: string
  categoria: string
  descripcion: string | null
  precio: number
  pesoGramos: number | null
  informacionNutricional: string | null
  esMenuCompuesto: boolean
  esArmaPlato: boolean
  disponible: boolean
  imagenUrl: string | null
  etiquetas: EtiquetaDTO[]
  componentes: ComponenteDTO[]
  opcionesArmaPlato: OpcionArmaPlatoDTO[]
}

export interface ElegirResponse {
  restaurante: RestauranteDTO
  categorias: CategoriaDTO[]
  etiquetas: EtiquetaDTO[]
  items: ItemCartaDTO[]
}

export interface CreateItemMenuRequest {
  restauranteId: string
  categoriaCodigo: string
  nombre: string
  descripcion?: string
  precio: number
  imagenUrl?: string
  pesoGramos?: number
  porciones?: number
  tiempoPreparacion?: number
  informacionNutricional?: string
  esMenuCompuesto?: boolean
  esArmaPlato?: boolean
}

export interface UpdateItemMenuRequest {
  categoriaCodigo: string
  nombre: string
  descripcion?: string
  precio: number
  imagenUrl?: string
  pesoGramos?: number
  porciones?: number
  tiempoPreparacion?: number
  informacionNutricional?: string
}
