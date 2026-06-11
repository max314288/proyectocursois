/**
 * @jest-environment jsdom
 */

import {
  validarCredenciales,
  registrar,
  getMensajeErrorCredenciales,
  getMensajeErrorRegistro,
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

const USUARIO_CLIENTE: UsuarioDTO = {
  id: '3',
  nombre: 'Ana',
  apellido: 'García',
  email: 'cliente@comidaalpaso.com',
  rol: 'cliente',
  activo: true,
  createdAt: '2024-01-01T00:00:00Z',
}

const USUARIO_ADMIN: UsuarioDTO = {
  ...USUARIO_CLIENTE,
  email: 'admin@comidaalpaso.com',
  rol: 'admin',
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

  it('retorna true y guarda sesión con credenciales cliente correctas', async () => {
    mockFetchOk(USUARIO_CLIENTE)
    const ok = await validarCredenciales('cliente@comidaalpaso.com', 'cliente123')
    expect(ok).toBe(true)
    expect(estaAutenticado()).toBe(true)
  })

  it('retorna false cuando el API devuelve 400 (INVALID_CREDENTIALS)', async () => {
    mockFetchError(400, 'INVALID_CREDENTIALS')
    const ok = await validarCredenciales('cliente@comidaalpaso.com', 'wrongpass')
    expect(ok).toBe(false)
    expect(estaAutenticado()).toBe(false)
  })

  it('retorna false cuando las credenciales son de rol admin (no cliente)', async () => {
    mockFetchOk(USUARIO_ADMIN)
    const ok = await validarCredenciales('admin@comidaalpaso.com', 'admin123')
    expect(ok).toBe(false)
    expect(estaAutenticado()).toBe(false)
  })

  it('retorna false cuando fetch lanza un error de red', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'))
    const ok = await validarCredenciales('cliente@comidaalpaso.com', 'cliente123')
    expect(ok).toBe(false)
  })

  it('no guarda sesión si el rol es incorrecto', async () => {
    mockFetchOk(USUARIO_ADMIN)
    await validarCredenciales('admin@comidaalpaso.com', 'admin123')
    expect(localStorage.getItem('web_auth')).toBeNull()
  })
})

// ─── registrar ────────────────────────────────────────────────────────────────

describe('registrar', () => {
  beforeEach(() => {
    localStorage.clear()
    jest.restoreAllMocks()
  })

  it('retorna true y guarda sesión cuando el registro es exitoso', async () => {
    mockFetchOk(USUARIO_CLIENTE)
    const ok = await registrar({
      nombre: 'Ana',
      apellido: 'García',
      email: 'nueva@correo.com',
      password: 'pass1234',
    })
    expect(ok).toBe(true)
    expect(estaAutenticado()).toBe(true)
  })

  it('retorna false cuando el email ya está registrado (409)', async () => {
    mockFetchError(409, 'EMAIL_ALREADY_EXISTS')
    const ok = await registrar({
      nombre: 'Ana',
      apellido: 'García',
      email: 'cliente@comidaalpaso.com',
      password: 'pass1234',
    })
    expect(ok).toBe(false)
    expect(estaAutenticado()).toBe(false)
  })

  it('retorna false cuando fetch lanza un error de red', async () => {
    global.fetch = jest.fn().mockRejectedValueOnce(new Error('Network error'))
    const ok = await registrar({
      nombre: 'Ana',
      apellido: 'García',
      email: 'nueva@correo.com',
      password: 'pass1234',
    })
    expect(ok).toBe(false)
  })
})

// ─── getMensajes ──────────────────────────────────────────────────────────────

describe('getMensajeErrorCredenciales', () => {
  it('retorna un string no vacío', () => {
    expect(getMensajeErrorCredenciales().length).toBeGreaterThan(0)
  })

  it('es consistente en múltiples llamadas', () => {
    expect(getMensajeErrorCredenciales()).toBe(getMensajeErrorCredenciales())
  })
})

describe('getMensajeErrorRegistro', () => {
  it('retorna un string no vacío', () => {
    expect(getMensajeErrorRegistro().length).toBeGreaterThan(0)
  })

  it('es consistente en múltiples llamadas', () => {
    expect(getMensajeErrorRegistro()).toBe(getMensajeErrorRegistro())
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
    guardarSesion(token, USUARIO_CLIENTE)
    expect(estaAutenticado()).toBe(true)
  })

  it('estaAutenticado retorna false con token expirado', () => {
    const token = makeJwt(Math.floor(Date.now() / 1000) - 1)
    guardarSesion(token, USUARIO_CLIENTE)
    expect(estaAutenticado()).toBe(false)
  })

  it('cerrarSesion desactiva la sesión', () => {
    const token = makeJwt(Math.floor(Date.now() / 1000) + 3600)
    guardarSesion(token, USUARIO_CLIENTE)
    cerrarSesion()
    expect(estaAutenticado()).toBe(false)
  })

  it('cerrarSesion sin sesión previa no lanza error', () => {
    expect(() => cerrarSesion()).not.toThrow()
  })

  it('múltiples guardarSesion no rompen el estado', () => {
    const token = makeJwt(Math.floor(Date.now() / 1000) + 3600)
    guardarSesion(token, USUARIO_CLIENTE)
    guardarSesion(token, USUARIO_CLIENTE)
    expect(estaAutenticado()).toBe(true)
  })

  it('después de cerrar sesión, guardar de nuevo funciona', () => {
    const token = makeJwt(Math.floor(Date.now() / 1000) + 3600)
    guardarSesion(token, USUARIO_CLIENTE)
    cerrarSesion()
    guardarSesion(token, USUARIO_CLIENTE)
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
    guardarSesion(token, USUARIO_CLIENTE)
    expect(getUsuario()).toEqual(USUARIO_CLIENTE)
  })
})
