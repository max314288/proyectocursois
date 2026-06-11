const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'

export interface UsuarioDTO {
  id: string
  nombre: string
  apellido: string
  email: string
  rol: 'cliente' | 'admin' | 'restaurante' | 'repartidor'
  activo: boolean
  createdAt: string
}

export interface LoginResponse {
  token: string
  expiresIn: number
  usuario: UsuarioDTO
}

export async function loginApi(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? 'LOGIN_FAILED')
  }

  return res.json() as Promise<LoginResponse>
}

export async function registerApi(data: {
  nombre: string
  apellido: string
  email: string
  password: string
}): Promise<LoginResponse> {
  const res = await fetch(`${API}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? 'REGISTER_FAILED')
  }

  return res.json() as Promise<LoginResponse>
}

export async function fetchMe(token: string): Promise<UsuarioDTO> {
  const res = await fetch(`${API}/me`, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!res.ok) throw new Error('UNAUTHORIZED')
  return res.json() as Promise<UsuarioDTO>
}
