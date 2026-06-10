/**
 * @jest-environment jsdom
 *
 * authService.test.ts — TDD (restaurant)
 * El docblock @jest-environment debe ir en el primer comentario del archivo.
 * Usamos jsdom para los tests de localStorage (guardarSesion, cerrarSesion, estaAutenticado).
 */

import {
  validarCredenciales,
  getMensajeErrorCredenciales,
  guardarSesion,
  cerrarSesion,
  estaAutenticado,
  DEMO_CREDENTIALS,
} from '@/lib/services/authService'

// ─── validarCredenciales ──────────────────────────────────────────────────────

describe('validarCredenciales', () => {
  it('debe retornar true con las credenciales demo correctas', () => {
    expect(
      validarCredenciales(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password)
    ).toBe(true)
  })

  it('debe retornar false con email incorrecto', () => {
    expect(validarCredenciales('otro@email.com', DEMO_CREDENTIALS.password)).toBe(false)
  })

  it('debe retornar false con contraseña incorrecta', () => {
    expect(validarCredenciales(DEMO_CREDENTIALS.email, 'wrongpass')).toBe(false)
  })

  it('debe retornar false con ambos campos incorrectos', () => {
    expect(validarCredenciales('otro@email.com', 'wrongpass')).toBe(false)
  })

  it('debe retornar false con campos vacíos', () => {
    expect(validarCredenciales('', '')).toBe(false)
  })

  it('debe ser sensible a mayúsculas en el email', () => {
    expect(
      validarCredenciales(DEMO_CREDENTIALS.email.toUpperCase(), DEMO_CREDENTIALS.password)
    ).toBe(false)
  })

  it('debe ser sensible a mayúsculas en la contraseña', () => {
    expect(
      validarCredenciales(DEMO_CREDENTIALS.email, DEMO_CREDENTIALS.password.toUpperCase())
    ).toBe(false)
  })
})

// ─── getMensajeErrorCredenciales ──────────────────────────────────────────────

describe('getMensajeErrorCredenciales', () => {
  it('debe retornar un mensaje no vacío', () => {
    expect(getMensajeErrorCredenciales().length).toBeGreaterThan(0)
  })

  it('debe retornar un string', () => {
    expect(typeof getMensajeErrorCredenciales()).toBe('string')
  })

  it('debe ser consistente en múltiples llamadas', () => {
    expect(getMensajeErrorCredenciales()).toBe(getMensajeErrorCredenciales())
  })
})

// ─── DEMO_CREDENTIALS ─────────────────────────────────────────────────────────

describe('DEMO_CREDENTIALS', () => {
  it('debe tener un email válido', () => {
    expect(DEMO_CREDENTIALS.email).toMatch(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)
  })

  it('debe tener una contraseña no vacía', () => {
    expect(DEMO_CREDENTIALS.password.length).toBeGreaterThan(0)
  })
})

// ─── Gestión de sesión (requiere DOM/localStorage) ────────────────────────────

describe('guardarSesion / cerrarSesion / estaAutenticado', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('estaAutenticado debe retornar false si no hay sesión guardada', () => {
    expect(estaAutenticado()).toBe(false)
  })

  it('guardarSesion debe activar la sesión', () => {
    guardarSesion()
    expect(estaAutenticado()).toBe(true)
  })

  it('cerrarSesion debe desactivar la sesión', () => {
    guardarSesion()
    cerrarSesion()
    expect(estaAutenticado()).toBe(false)
  })

  it('cerrarSesion sin sesión previa no debe lanzar error', () => {
    expect(() => cerrarSesion()).not.toThrow()
  })

  it('múltiples llamadas a guardarSesion no deben romper el estado', () => {
    guardarSesion()
    guardarSesion()
    expect(estaAutenticado()).toBe(true)
  })

  it('después de cerrar sesión, guardar de nuevo debe funcionar', () => {
    guardarSesion()
    cerrarSesion()
    guardarSesion()
    expect(estaAutenticado()).toBe(true)
  })
})
