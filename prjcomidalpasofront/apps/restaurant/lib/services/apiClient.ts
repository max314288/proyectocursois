const API = process.env.NEXT_PUBLIC_API_URL ?? 'https://packing-copied-sms-acting.trycloudflare.com/api' //'http://localhost:8080/api'

export class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.name = 'ApiError'
    this.status = status
  }
}

let onUnauthorized: (() => void) | null = null

/** Registra el handler que se dispara cuando el backend responde 401 (token ausente/inválido/expirado). */
export function setOnUnauthorized(handler: () => void): void {
  onUnauthorized = handler
}

interface ApiFetchOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
  body?: unknown
  token?: string | null
}

interface BackendErrorBody {
  error?: string
  message?: string
}

/** Cliente HTTP común: agrega Bearer, parsea errores del backend y dispara onUnauthorized en 401. */
export async function apiFetch<T>(path: string, options: ApiFetchOptions = {}): Promise<T> {
  const { method = 'GET', body, token } = options

  const headers: Record<string, string> = {}
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Bearer ${token}`

  const res = await fetch(`${API}${path}`, {
    method,
    headers,
    body: body !== undefined ? JSON.stringify(body) : undefined,
  })

  if (res.status === 401) {
    onUnauthorized?.()
  }

  if (!res.ok) {
    const errBody = (await res.json().catch(() => ({}))) as BackendErrorBody
    throw new ApiError(res.status, errBody.message ?? errBody.error ?? `HTTP_${res.status}`)
  }

  if (res.status === 202 || res.status === 204) {
    return undefined as T
  }

  return res.json() as Promise<T>
}
