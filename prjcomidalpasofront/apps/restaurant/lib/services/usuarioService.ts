import { getToken, getUsuario, actualizarUsuarioSesion } from './authService'
import { actualizarUsuarioApi, cambiarPasswordApi } from './usuarioApiService'

export async function actualizarPerfil(data: {
  nombre: string
  apellido: string
  email: string
}): Promise<boolean> {
  const token = getToken()
  const usuario = getUsuario()
  if (!token || !usuario) return false
  try {
    const actualizado = await actualizarUsuarioApi(token, usuario.id, data)
    actualizarUsuarioSesion(actualizado)
    return true
  } catch {
    return false
  }
}

export async function cambiarPassword(
  passwordActual: string,
  passwordNuevo: string,
): Promise<boolean> {
  const token = getToken()
  const usuario = getUsuario()
  if (!token || !usuario) return false
  try {
    await cambiarPasswordApi(token, usuario.id, { passwordActual, passwordNuevo })
    return true
  } catch {
    return false
  }
}

export function validarPasswordNuevo(pwd: string): boolean {
  return pwd.length >= 8
}

export function getMensajeErrorPerfil(): string {
  return 'No se pudo actualizar el perfil. Intenta de nuevo.'
}

export function getMensajeErrorPassword(): string {
  return 'No se pudo cambiar la contraseña. Verifica tu contraseña actual.'
}
