/**
 * cartService.test.ts — TDD
 */

import {
  calcularSubtotalItem,
  calcularTotalCarrito,
  contarItems,
  formatearPrecio,
} from '@/lib/services/cartService'
import type { CartItem } from '@/store/cartStore'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockItems: CartItem[] = [
  {
    id: '1',
    itemMenuId: 'item-1',
    restauranteId: 'rest-1',
    name: 'Menú Campesino',
    price: 16900,
    quantity: 2,
    image: '/images/menu1.jpg',
    category: 'menu',
  },
  {
    id: '2',
    itemMenuId: 'item-2',
    restauranteId: 'rest-1',
    name: 'Bowl de Pollo',
    price: 25000,
    quantity: 1,
    image: '/images/bowl.jpg',
    category: 'bowl',
  },
]

// ─── calcularSubtotalItem ─────────────────────────────────────────────────────

describe('calcularSubtotalItem', () => {
  it('debe multiplicar precio por cantidad correctamente', () => {
    expect(calcularSubtotalItem(16900, 2)).toBe(33800)
  })

  it('debe retornar el mismo precio si la cantidad es 1', () => {
    expect(calcularSubtotalItem(16900, 1)).toBe(16900)
  })

  it('debe retornar 0 si la cantidad es 0', () => {
    expect(calcularSubtotalItem(16900, 0)).toBe(0)
  })

  it('debe manejar precios con decimales', () => {
    expect(calcularSubtotalItem(10.5, 3)).toBeCloseTo(31.5)
  })
})

// ─── calcularTotalCarrito ─────────────────────────────────────────────────────

describe('calcularTotalCarrito', () => {
  it('debe sumar correctamente el total de todos los ítems', () => {
    // 16900 * 2 + 25000 * 1 = 33800 + 25000 = 58800
    expect(calcularTotalCarrito(mockItems)).toBe(58800)
  })

  it('debe retornar 0 para un carrito vacío', () => {
    expect(calcularTotalCarrito([])).toBe(0)
  })

  it('debe calcular correctamente con un solo ítem', () => {
    expect(calcularTotalCarrito([mockItems[0]])).toBe(33800)
  })

  it('no debe mutar el array original', () => {
    const copia = [...mockItems]
    calcularTotalCarrito(mockItems)
    expect(mockItems).toEqual(copia)
  })
})

// ─── contarItems ──────────────────────────────────────────────────────────────

describe('contarItems', () => {
  it('debe contar la cantidad total de unidades (no ítems únicos)', () => {
    expect(contarItems(mockItems)).toBe(3) // 2 + 1
  })

  it('debe retornar 0 para carrito vacío', () => {
    expect(contarItems([])).toBe(0)
  })

  it('debe contar correctamente con un solo ítem', () => {
    expect(contarItems([mockItems[1]])).toBe(1)
  })

  it('debe sumar múltiples cantidades', () => {
    const items: CartItem[] = [
      { ...mockItems[0], quantity: 5 },
      { ...mockItems[1], quantity: 3 },
    ]
    expect(contarItems(items)).toBe(8)
  })
})

// ─── formatearPrecio ──────────────────────────────────────────────────────────

describe('formatearPrecio', () => {
  it('debe incluir el prefijo S/', () => {
    expect(formatearPrecio(16900)).toContain('S/')
  })

  it('debe incluir los dígitos del precio', () => {
    const resultado = formatearPrecio(16900)
    // toLocaleString('es-PE') puede formatear como "16.900" o "16,900" dependiendo del entorno
    expect(resultado).toMatch(/16[.,]?9/)
  })

  it('debe manejar precio 0', () => {
    const resultado = formatearPrecio(0)
    expect(resultado).toContain('S/')
    expect(resultado).toContain('0')
  })

  it('debe retornar un string', () => {
    expect(typeof formatearPrecio(5000)).toBe('string')
  })
})
