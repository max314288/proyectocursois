/**
 * navigationService.test.ts — TDD (admin)
 */

import {
  esRutaActiva,
  getLabelRutaActiva,
  esRutaConocida,
  SIDEBAR_LINKS,
} from '@/lib/services/navigationService'

// ─── esRutaActiva ─────────────────────────────────────────────────────────────

describe('esRutaActiva', () => {
  it('debe retornar true cuando pathname coincide exactamente con href', () => {
    expect(esRutaActiva('/', '/')).toBe(true)
  })

  it('debe retornar true para rutas de nivel 1', () => {
    expect(esRutaActiva('/productos', '/productos')).toBe(true)
  })

  it('debe retornar false cuando no coincide', () => {
    expect(esRutaActiva('/productos', '/menus')).toBe(false)
  })

  it('debe retornar false para comparación parcial', () => {
    expect(esRutaActiva('/productos/nuevo', '/productos')).toBe(false)
  })

  it('debe retornar false si uno es vacío', () => {
    expect(esRutaActiva('', '/productos')).toBe(false)
  })

  it('debe ser sensible a mayúsculas', () => {
    expect(esRutaActiva('/Productos', '/productos')).toBe(false)
  })
})

// ─── getLabelRutaActiva ───────────────────────────────────────────────────────

describe('getLabelRutaActiva', () => {
  it('debe retornar "Dashboard" para la ruta raíz', () => {
    expect(getLabelRutaActiva('/')).toBe('Dashboard')
  })

  it('debe retornar "Productos" para /productos', () => {
    expect(getLabelRutaActiva('/productos')).toBe('Productos')
  })

  it('debe retornar "Menús" para /menus', () => {
    expect(getLabelRutaActiva('/menus')).toBe('Menús')
  })

  it('debe retornar "Pedidos" para /pedidos', () => {
    expect(getLabelRutaActiva('/pedidos')).toBe('Pedidos')
  })

  it('debe retornar "Configuración" para /configuracion', () => {
    expect(getLabelRutaActiva('/configuracion')).toBe('Configuración')
  })

  it('debe retornar cadena vacía para ruta desconocida', () => {
    expect(getLabelRutaActiva('/ruta-desconocida')).toBe('')
  })
})

// ─── esRutaConocida ───────────────────────────────────────────────────────────

describe('esRutaConocida', () => {
  it('debe reconocer la ruta raíz', () => {
    expect(esRutaConocida('/')).toBe(true)
  })

  it('debe reconocer todas las rutas del sidebar', () => {
    SIDEBAR_LINKS.forEach((link) => {
      expect(esRutaConocida(link.href)).toBe(true)
    })
  })

  it('debe retornar false para ruta desconocida', () => {
    expect(esRutaConocida('/ruta-que-no-existe')).toBe(false)
  })

  it('debe retornar false para string vacío', () => {
    expect(esRutaConocida('')).toBe(false)
  })
})

// ─── SIDEBAR_LINKS ────────────────────────────────────────────────────────────

describe('SIDEBAR_LINKS', () => {
  it('debe contener al menos un link', () => {
    expect(SIDEBAR_LINKS.length).toBeGreaterThan(0)
  })

  it('cada link debe tener href, label e iconName', () => {
    SIDEBAR_LINKS.forEach((link) => {
      expect(link.href).toBeTruthy()
      expect(link.label).toBeTruthy()
      expect(link.iconName).toBeTruthy()
    })
  })

  it('todos los hrefs deben comenzar con /', () => {
    SIDEBAR_LINKS.forEach((link) => {
      expect(link.href.startsWith('/')).toBe(true)
    })
  })

  it('los hrefs deben ser únicos', () => {
    const hrefs = SIDEBAR_LINKS.map((l) => l.href)
    expect(new Set(hrefs).size).toBe(hrefs.length)
  })

  it('los labels deben ser únicos', () => {
    const labels = SIDEBAR_LINKS.map((l) => l.label)
    expect(new Set(labels).size).toBe(labels.length)
  })

  it('debe incluir la ruta del dashboard (/)', () => {
    expect(SIDEBAR_LINKS.some((l) => l.href === '/')).toBe(true)
  })
})
