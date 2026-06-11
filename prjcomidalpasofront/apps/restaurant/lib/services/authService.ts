import { jwtDecode } from 'jwt-decode'
import { loginApi, type UsuarioDTO } from './authApiService'

const STORAGE_KEY = 'restaurant_auth' as const

interface SessionData {
  token: string
  usuario: UsuarioDTO
}

// ─── Validación de credenciales ───────────────────────────────────────────────

export async function validarCredenciales(email: string, password: string): Promise<boolean> {
  try {
    const { token, usuario } = await loginApi(email, password)
    if (usuario.rol !== 'restaurante') return false
    guardarSesion(token, usuario)
    return true
  } catch {
    return false
  }
}

export function getMensajeErrorCredenciales(): string {
  return 'Credenciales incorrectas. Verifica tu email y contraseña.'
}

// ─── Gestión de sesión ────────────────────────────────────────────────────────

export function guardarSesion(token: string, usuario: UsuarioDTO): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token, usuario }))
  }
}

export function cerrarSesion(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}

export function estaAutenticado(): boolean {
  if (typeof window === 'undefined') return false
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return false
  try {
    const { token } = JSON.parse(raw) as SessionData
    const { exp } = jwtDecode<{ exp: number }>(token)
    return Date.now() / 1000 < exp
  } catch {
    return false
  }
}

export function getUsuario(): UsuarioDTO | null {
  if (typeof window === 'undefined') return null
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return (JSON.parse(raw) as SessionData).usuario
  } catch {
    return null
  }
}
