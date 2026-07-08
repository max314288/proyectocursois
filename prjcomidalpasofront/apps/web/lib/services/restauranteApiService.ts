const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'

// ─── Types espejo del backend ─────────────────────────────────────────────────

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

// ─── Llamadas al API ──────────────────────────────────────────────────────────

export async function listarRestaurantesApi(token?: string | null): Promise<RestauranteDTO[]> {
  const res = await fetch(`${API}/restaurantes?soloActivos=true`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? 'LISTAR_RESTAURANTES_FAILED')
  }

  return res.json() as Promise<RestauranteDTO[]>
}

export async function elegirRestauranteApi(id: string, token?: string | null): Promise<ElegirResponse> {
  const res = await fetch(`${API}/restaurantes/${id}/elegir`, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? 'ELEGIR_RESTAURANTE_FAILED')
  }

  return res.json() as Promise<ElegirResponse>
}
