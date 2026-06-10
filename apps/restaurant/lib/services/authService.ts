/**
 * authService.ts — CONTROLLER layer (restaurant)
 *
 * SOLID:
 *  S — cada función tiene una única responsabilidad
 *  O — agregar nuevos métodos de auth sin modificar los existentes
 *  D — los componentes dependen de estas abstracciones, no de localStorage directamente
 */

const STORAGE_KEY = 'restaurant_auth' as const

export const DEMO_CREDENTIALS = {
  email: 'cocina@comidaalpaso.com',
  password: 'cocina123',
} as const

// ─── Validación de credenciales ───────────────────────────────────────────────

/**
 * Valida las credenciales del usuario contra las credenciales demo
 * S: función pura — solo valida, sin efectos secundarios (100% testeable)
 */
export function validarCredenciales(email: string, password: string): boolean {
  return email === DEMO_CREDENTIALS.email && password === DEMO_CREDENTIALS.password
}

/**
 * Genera el mensaje de error para credenciales incorrectas
 * S: centraliza el mensaje para que sea consistente en toda la app
 */
export function getMensajeErrorCredenciales(): string {
  return 'Credenciales incorrectas. Usa las credenciales de demo.'
}

// ─── Gestión de sesión ────────────────────────────────────────────────────────

/**
 * Persiste la sesión autenticada en localStorage
 * S: responsabilidad única — solo guarda la sesión
 * Protegido con typeof window para compatibilidad SSR
 */
export function guardarSesion(): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(STORAGE_KEY, 'true')
  }
}

/**
 * Elimina la sesión del localStorage (cierra sesión)
 * S: responsabilidad única — solo elimina la sesión
 */
export function cerrarSesion(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(STORAGE_KEY)
  }
}

/**
 * Verifica si el usuario tiene una sesión activa
 * S: responsabilidad única — solo verifica el estado de auth
 * Retorna false en entorno servidor (SSR)
 */
export function estaAutenticado(): boolean {
  if (typeof window === 'undefined') return false
  return localStorage.getItem(STORAGE_KEY) === 'true'
}
