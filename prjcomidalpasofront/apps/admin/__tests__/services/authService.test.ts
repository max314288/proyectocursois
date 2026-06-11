/**
 * @jest-environment jsdom
 */

import {
  validarCredenciales,
  getMensajeErrorCredenciales,
  guardarSesion,
  cerrarSesion,
  estaAutenticado,
  getUsuario,
} from '@/lib/services/authService'
import type { UsuarioDTO } from '@/lib/services/authApiService'

// ─── helpers ─────────────────────────────────────────────────────────────────

function makeJwt(exp: number): string {
  const payload = Buffer.from(JSON.stringify({ sub: '1', exp }))
    .toString('base64url')
  return `eyJhbGciOiJIUzI1NiJ9.${payload}.fakesig`
}

const USUARIO_ADMIN: UsuarioDTO = {
  id: '1',
  nombre: 'Admin',
  apellido: 'Test',
  email: 'admin@comidaalpaso.com',
  rol: 'admin',
  activo: true,
  createdAt: '2024-01-01T00:00:00Z',
}

const USUARIO_CLIENTE: UsuarioDTO = {
  ...USUARIO_ADMIN,
  email: 'cliente@comidaalpaso.com',
  rol: 'cliente',
}

function mockFetchOk(usuario: UsuarioDTO, expiresIn = 3600) {
  const token = makeJwt(Math.floor(Date.now() / 1000) + expiresIn)
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: true,
    json: async () => ({ token, expiresIn, usuario }),
  } as unknown as Response)
  return token
}

function mockFetchError(status = 400, error = 'INVALID_CREDENTIALS') {
  global.fetch = jest.fn().mockResolvedValueOnce({
    ok: false,
    json: async () => ({ error }),
    status,
  } as unknown as Response)
}

// ─── validarCredenciales ──────────────────────────────────────────────────────

describe('validarCredenciales', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.restoreAllMocks()
  })

  it('retorna true y guarda sesión con credenciales admin correctas', async () => {
    mockFetchOk(USUARIO_ADMIN)
    const ok = await validarCredenciales('admin@comidaalpaso.com', 'admin123')
    expect(ok).toBe(true)
    expect(estaAutenticado()).toBe(true)
  })

  it('retorna false cuando el API devuelve 400 (INVALID_CREDENTIALS)', async () => {
    mockFetchError(400, 'INVALID_CREDENTIALS')
    const ok = await validarCredenciales('admin@comidaalpaso.com', 'wrongpass')
    expect(ok).toBe(false)
    expect(estaAutenticado()).toBe(false)
  })

  it('retorna false cuando las credenciales son de un rol diferente (cliente)', async () => {
    mockFetchOk(USUARIO_CLIENTE)
    const ok = await validarCredenciales('cliente@comidaalpaso.com', 'cliente123')
    expect(ok).toBe(false)
    expect(estaAutenticado()).toBe(false)
  })

  it('retorna false cuando fetch lanza un error de red', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'))
    const ok = await validarCredenciales('admin@comidaalpaso.com', 'admin123')
    expect(ok).toBe(false)
  })

  it('no guarda sesión si el rol es incorrecto', async () => {
    mockFetchOk(USUARIO_CLIENTE)
    await validarCredenciales('cliente@comidaalpaso.com', 'cliente123')
    expect(localStorage.getItem('admin_auth')).toBeNull()
  })
})

// ─── getMensajeErrorCredenciales ──────────────────────────────────────────────

describe('getMensajeErrorCredenciales', () => {
  it('retorna un mensaje no vacío', () => {
    expect(getMensajeErrorCredenciales().length).toBeGreaterThan(0)
  })

  it('retorna un string', () => {
    expect(typeof getMensajeErrorCredenciales()).toBe('string')
  })

  it('es consistente en múltiples llamadas', () => {
    expect(getMensajeErrorCredenciales()).toBe(getMensajeErrorCredenciales())
  })
})

// ─── guardarSesion / cerrarSesion / estaAutenticado ───────────────────────────

describe('guardarSesion / cerrarSesion / estaAutenticado', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('estaAutenticado retorna false si no hay sesión', () => {
    expect(estaAutenticado()).toBe(false)
  })

  it('guardarSesion con token válido activa la sesión', () => {
    const token = makeJwt(Math.floor(Date.now() / 1000) + 3600)
    guardarSesion(token, USUARIO_ADMIN)
    expect(estaAutenticado()).toBe(true)
  })

  it('estaAutenticado retorna false con token expirado', () => {
    const token = makeJwt(Math.floor(Date.now() / 1000) - 1)
    guardarSesion(token, USUARIO_ADMIN)
    expect(estaAutenticado()).toBe(false)
  })

  it('cerrarSesion desactiva la sesión', () => {
    const token = makeJwt(Math.floor(Date.now() / 1000) + 3600)
    guardarSesion(token, USUARIO_ADMIN)
    cerrarSesion()
    expect(estaAutenticado()).toBe(false)
  })

  it('cerrarSesion sin sesión previa no lanza error', () => {
    expect(() => cerrarSesion()).not.toThrow()
  })

  it('múltiples guardarSesion no rompen el estado', () => {
    const token = makeJwt(Math.floor(Date.now() / 1000) + 3600)
    guardarSesion(token, USUARIO_ADMIN)
    guardarSesion(token, USUARIO_ADMIN)
    expect(estaAutenticado()).toBe(true)
  })

  it('después de cerrar sesión, guardar de nuevo funciona', () => {
    const token = makeJwt(Math.floor(Date.now() / 1000) + 3600)
    guardarSesion(token, USUARIO_ADMIN)
    cerrarSesion()
    guardarSesion(token, USUARIO_ADMIN)
    expect(estaAutenticado()).toBe(true)
  })
})

// ─── getUsuario ───────────────────────────────────────────────────────────────

describe('getUsuario', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('retorna null si no hay sesión', () => {
    expect(getUsuario()).toBeNull()
  })

  it('retorna el usuario guardado', () => {
    const token = makeJwt(Math.floor(Date.now() / 1000) + 3600)
    guardarSesion(token, USUARIO_ADMIN)
    expect(getUsuario()).toEqual(USUARIO_ADMIN)
  })
})
