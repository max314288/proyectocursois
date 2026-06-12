import type { UsuarioDTO } from './authApiService'

const API = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:8080/api'

export async function actualizarUsuarioApi(
  token: string,
  id: string,
  data: { nombre: string; apellido: string; email: string },
): Promise<UsuarioDTO> {
  const res = await fetch(`${API}/usuarios/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? 'UPDATE_FAILED')
  }

  return res.json() as Promise<UsuarioDTO>
}

export async function cambiarPasswordApi(
  token: string,
  id: string,
  data: { passwordActual: string; passwordNuevo: string },
): Promise<{ ok: boolean }> {
  const res = await fetch(`${API}/usuarios/${id}/password`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    const body = await res.json().catch(() => ({})) as { error?: string }
    throw new Error(body.error ?? 'PASSWORD_FAILED')
  }

  return res.json() as Promise<{ ok: boolean }>
}
