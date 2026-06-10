/**
 * menuService.test.ts — TDD
 */

import { filtrarMenus, esMenuDestacado } from '@/lib/services/menuService'
import { menus } from '@/lib/data'

// ─── filtrarMenus ─────────────────────────────────────────────────────────────

describe('filtrarMenus', () => {
  it('debe retornar todos los menús cuando el filtro es "Todos"', () => {
    expect(filtrarMenus(menus, 'Todos')).toHaveLength(menus.length)
  })

  it('debe retornar la misma referencia para "Todos" (optimización)', () => {
    expect(filtrarMenus(menus, 'Todos')).toBe(menus)
  })

  it('debe filtrar menús que contienen "Campesino" en el nombre', () => {
    const resultado = filtrarMenus(menus, 'Campesino')
    expect(resultado.length).toBeGreaterThan(0)
    expect(resultado.every((m) => m.name.includes('Campesino'))).toBe(true)
  })

  it('debe filtrar menús que contienen "Express" en el nombre', () => {
    const resultado = filtrarMenus(menus, 'Express')
    expect(resultado.every((m) => m.name.includes('Express'))).toBe(true)
  })

  it('debe retornar arreglo vacío si no hay coincidencias', () => {
    expect(filtrarMenus(menus, 'PlatoQueNoExiste')).toHaveLength(0)
  })

  it('no debe mutar el array original', () => {
    const copia = [...menus]
    filtrarMenus(menus, 'Verde')
    expect(menus).toEqual(copia)
  })

  it('debe ser sensible a mayúsculas (por diseño)', () => {
    // La app usa filtros con mayúsculas consistentes, este test documenta ese comportamiento
    expect(filtrarMenus(menus, 'campesino')).toHaveLength(0)
    expect(filtrarMenus(menus, 'Campesino').length).toBeGreaterThan(0)
  })
})

// ─── esMenuDestacado ──────────────────────────────────────────────────────────

describe('esMenuDestacado', () => {
  it('debe ser destacado el primer elemento con filtro "Todos"', () => {
    expect(esMenuDestacado(0, 'Todos')).toBe(true)
  })

  it('no debe ser destacado si el índice no es 0', () => {
    expect(esMenuDestacado(1, 'Todos')).toBe(false)
    expect(esMenuDestacado(2, 'Todos')).toBe(false)
  })

  it('no debe ser destacado si el filtro no es "Todos"', () => {
    expect(esMenuDestacado(0, 'Campesino')).toBe(false)
    expect(esMenuDestacado(0, 'Express')).toBe(false)
  })

  it('solo es destacado cuando índice es 0 Y filtro es "Todos"', () => {
    expect(esMenuDestacado(0, 'Todos')).toBe(true)
    expect(esMenuDestacado(1, 'Todos')).toBe(false)
    expect(esMenuDestacado(0, 'Verde')).toBe(false)
    expect(esMenuDestacado(1, 'Verde')).toBe(false)
  })
})
