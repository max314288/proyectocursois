/**
 * pedidoService.test.ts — TDD
 */

import {
  calcularPrecioBowl,
  puedeAvanzarPaso,
  toggleTopping,
  construirNombreBowl,
  seleccionACartItem,
  obtenerSeleccionActual,
  BOWL_SELECTION_INICIAL,
  type BowlSelection,
} from '@/lib/services/pedidoService'
import { BOWL_BASE_PRICE } from '@/lib/data'
import type { BuilderItem } from '@/lib/data'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const mockBase: BuilderItem = {
  id: 'base-1',
  name: 'Arroz Integral',
  image: '/images/base1.jpg',
  price: 0,
}

const mockBaseExtra: BuilderItem = {
  id: 'base-2',
  name: 'Quinoa',
  image: '/images/base2.jpg',
  price: 1000,
}

const mockProteina: BuilderItem = {
  id: 'prot-1',
  name: 'Pollo a la Plancha',
  image: '/images/proteina1.jpg',
  price: 4500,
}

const mockTopping1: BuilderItem = {
  id: 'top-1',
  name: 'Aguacate + Tomates Cherry',
  image: '/images/topping1.jpg',
  price: 2000,
}

const mockTopping2: BuilderItem = {
  id: 'top-2',
  name: 'Mix de Quesos',
  image: '/images/topping2.jpg',
  price: 1500,
}

const mockBebida: BuilderItem = {
  id: 'beb-1',
  name: 'Limonada Natural',
  image: '/images/bebida1.jpg',
  price: 3500,
}

const selCompleta: BowlSelection = {
  base: mockBase,
  proteina: mockProteina,
  toppings: [mockTopping1],
  bebida: mockBebida,
}

// ─── calcularPrecioBowl ───────────────────────────────────────────────────────

describe('calcularPrecioBowl', () => {
  it('debe retornar solo el precio base con selección vacía', () => {
    expect(calcularPrecioBowl(BOWL_SELECTION_INICIAL)).toBe(BOWL_BASE_PRICE)
  })

  it('debe sumar todos los componentes seleccionados', () => {
    // BOWL_BASE_PRICE(10900) + base(0) + proteina(4500) + topping1(2000) + bebida(3500) = 20900
    expect(calcularPrecioBowl(selCompleta)).toBe(BOWL_BASE_PRICE + 0 + 4500 + 2000 + 3500)
  })

  it('debe incluir el precio extra de una base con costo', () => {
    const sel = { ...BOWL_SELECTION_INICIAL, base: mockBaseExtra }
    expect(calcularPrecioBowl(sel)).toBe(BOWL_BASE_PRICE + 1000)
  })

  it('debe sumar múltiples toppings', () => {
    const sel = { ...BOWL_SELECTION_INICIAL, toppings: [mockTopping1, mockTopping2] }
    expect(calcularPrecioBowl(sel)).toBe(BOWL_BASE_PRICE + 2000 + 1500)
  })

  it('debe manejar toppings vacíos correctamente', () => {
    const sel = { ...BOWL_SELECTION_INICIAL, base: mockBase, proteina: mockProteina, toppings: [], bebida: mockBebida }
    expect(calcularPrecioBowl(sel)).toBe(BOWL_BASE_PRICE + 4500 + 3500)
  })
})

// ─── puedeAvanzarPaso ─────────────────────────────────────────────────────────

describe('puedeAvanzarPaso', () => {
  it('paso 0: no puede avanzar sin base', () => {
    expect(puedeAvanzarPaso(0, BOWL_SELECTION_INICIAL)).toBe(false)
  })

  it('paso 0: puede avanzar con base seleccionada', () => {
    expect(puedeAvanzarPaso(0, { ...BOWL_SELECTION_INICIAL, base: mockBase })).toBe(true)
  })

  it('paso 1: no puede avanzar sin proteína', () => {
    expect(puedeAvanzarPaso(1, BOWL_SELECTION_INICIAL)).toBe(false)
  })

  it('paso 1: puede avanzar con proteína seleccionada', () => {
    expect(puedeAvanzarPaso(1, { ...BOWL_SELECTION_INICIAL, proteina: mockProteina })).toBe(true)
  })

  it('paso 2: siempre puede avanzar (toppings opcionales)', () => {
    expect(puedeAvanzarPaso(2, BOWL_SELECTION_INICIAL)).toBe(true)
    expect(puedeAvanzarPaso(2, selCompleta)).toBe(true)
  })

  it('paso 3: no puede avanzar sin bebida', () => {
    expect(puedeAvanzarPaso(3, BOWL_SELECTION_INICIAL)).toBe(false)
  })

  it('paso 3: puede avanzar con bebida seleccionada', () => {
    expect(puedeAvanzarPaso(3, { ...BOWL_SELECTION_INICIAL, bebida: mockBebida })).toBe(true)
  })
})

// ─── toggleTopping ────────────────────────────────────────────────────────────

describe('toggleTopping', () => {
  it('debe agregar el topping si no existe en la lista', () => {
    const result = toggleTopping([], mockTopping1)
    expect(result).toHaveLength(1)
    expect(result[0]).toBe(mockTopping1)
  })

  it('debe quitar el topping si ya existe', () => {
    const result = toggleTopping([mockTopping1], mockTopping1)
    expect(result).toHaveLength(0)
  })

  it('debe agregar sin afectar los toppings existentes', () => {
    const result = toggleTopping([mockTopping1], mockTopping2)
    expect(result).toHaveLength(2)
    expect(result).toContain(mockTopping1)
    expect(result).toContain(mockTopping2)
  })

  it('no debe mutar el array original', () => {
    const original = [mockTopping1]
    const originalLength = original.length
    toggleTopping(original, mockTopping2)
    expect(original).toHaveLength(originalLength) // no mutado
  })
})

// ─── construirNombreBowl ──────────────────────────────────────────────────────

describe('construirNombreBowl', () => {
  it('debe construir el nombre con base + proteína', () => {
    expect(construirNombreBowl(selCompleta)).toBe(
      'Bowl: Arroz Integral + Pollo a la Plancha'
    )
  })

  it('debe retornar nombre genérico si no hay base', () => {
    expect(construirNombreBowl({ ...selCompleta, base: null })).toBe('Bowl personalizado')
  })

  it('debe retornar nombre genérico si no hay proteína', () => {
    expect(construirNombreBowl({ ...selCompleta, proteina: null })).toBe('Bowl personalizado')
  })

  it('debe retornar nombre genérico con selección vacía', () => {
    expect(construirNombreBowl(BOWL_SELECTION_INICIAL)).toBe('Bowl personalizado')
  })
})

// ─── seleccionACartItem ───────────────────────────────────────────────────────

describe('seleccionACartItem', () => {
  it('debe crear un CartItem válido con selección completa', () => {
    const item = seleccionACartItem(selCompleta)
    expect(item).not.toBeNull()
  })

  it('debe usar el nombre construido del bowl', () => {
    const item = seleccionACartItem(selCompleta)!
    expect(item.name).toBe(construirNombreBowl(selCompleta))
  })

  it('debe calcular el precio correcto del bowl', () => {
    const item = seleccionACartItem(selCompleta)!
    expect(item.price).toBe(calcularPrecioBowl(selCompleta))
  })

  it('debe usar la imagen de la proteína', () => {
    const item = seleccionACartItem(selCompleta)!
    expect(item.image).toBe(mockProteina.image)
  })

  it('debe asignar la categoría "bowl"', () => {
    const item = seleccionACartItem(selCompleta)!
    expect(item.category).toBe('bowl')
  })

  it('el ID debe comenzar con "bowl-"', () => {
    const item = seleccionACartItem(selCompleta)!
    expect(item.id.startsWith('bowl-')).toBe(true)
  })

  it('debe retornar null si falta la base', () => {
    expect(seleccionACartItem({ ...selCompleta, base: null })).toBeNull()
  })

  it('debe retornar null si falta la proteína', () => {
    expect(seleccionACartItem({ ...selCompleta, proteina: null })).toBeNull()
  })

  it('debe retornar null si falta la bebida', () => {
    expect(seleccionACartItem({ ...selCompleta, bebida: null })).toBeNull()
  })
})

// ─── obtenerSeleccionActual ───────────────────────────────────────────────────

describe('obtenerSeleccionActual', () => {
  it('paso 0: detecta la base seleccionada', () => {
    expect(obtenerSeleccionActual(0, selCompleta, 'base-1')).toBe(true)
  })

  it('paso 0: retorna false para base no seleccionada', () => {
    expect(obtenerSeleccionActual(0, selCompleta, 'base-2')).toBe(false)
  })

  it('paso 1: detecta la proteína seleccionada', () => {
    expect(obtenerSeleccionActual(1, selCompleta, 'prot-1')).toBe(true)
  })

  it('paso 1: retorna false para proteína no seleccionada', () => {
    expect(obtenerSeleccionActual(1, selCompleta, 'prot-2')).toBe(false)
  })

  it('paso 2: detecta el topping seleccionado', () => {
    expect(obtenerSeleccionActual(2, selCompleta, 'top-1')).toBe(true)
  })

  it('paso 2: retorna false para topping no seleccionado', () => {
    expect(obtenerSeleccionActual(2, selCompleta, 'top-2')).toBe(false)
  })

  it('paso 3: detecta la bebida seleccionada', () => {
    expect(obtenerSeleccionActual(3, selCompleta, 'beb-1')).toBe(true)
  })

  it('paso 3: retorna false para bebida no seleccionada', () => {
    expect(obtenerSeleccionActual(3, selCompleta, 'beb-2')).toBe(false)
  })
})

// ─── BOWL_SELECTION_INICIAL ───────────────────────────────────────────────────

describe('BOWL_SELECTION_INICIAL', () => {
  it('debe tener base null', () => {
    expect(BOWL_SELECTION_INICIAL.base).toBeNull()
  })

  it('debe tener proteína null', () => {
    expect(BOWL_SELECTION_INICIAL.proteina).toBeNull()
  })

  it('debe tener toppings vacío', () => {
    expect(BOWL_SELECTION_INICIAL.toppings).toHaveLength(0)
  })

  it('debe tener bebida null', () => {
    expect(BOWL_SELECTION_INICIAL.bebida).toBeNull()
  })
})
