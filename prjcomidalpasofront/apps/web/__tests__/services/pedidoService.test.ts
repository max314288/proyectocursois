/**
 * pedidoService.test.ts — TDD
 */

import {
  calcularPrecioBowl,
  puedeAvanzarPaso,
  toggleOpcion,
  construirNombreBowl,
  seleccionACartItem,
  estaSeleccionado,
  BOWL_SELECTION_INICIAL,
  type BowlSelection,
} from '@/lib/services/pedidoService'
import type { ItemCartaDTO, OpcionArmaPlatoDTO } from '@/lib/services/restauranteApiService'

// ─── Fixtures ─────────────────────────────────────────────────────────────────

const armaPlatoItem: ItemCartaDTO = {
  id: 'arma-1',
  nombre: 'Arma tu plato',
  categoria: 'Arma tu plato',
  descripcion: null,
  precio: 10900,
  pesoGramos: null,
  informacionNutricional: null,
  esMenuCompuesto: false,
  esArmaPlato: true,
  disponible: true,
  imagenUrl: null,
  etiquetas: [],
  componentes: [],
  opcionesArmaPlato: [],
}

const mockBase: OpcionArmaPlatoDTO = { tipo: 'base', itemId: 'base-1', nombre: 'Arroz Integral', precioExtra: 0, disponible: true }
const mockBaseExtra: OpcionArmaPlatoDTO = { tipo: 'base', itemId: 'base-2', nombre: 'Quinoa', precioExtra: 1000, disponible: true }
const mockProteina: OpcionArmaPlatoDTO = { tipo: 'proteina', itemId: 'prot-1', nombre: 'Pollo a la Plancha', precioExtra: 4500, disponible: true }
const mockTopping1: OpcionArmaPlatoDTO = { tipo: 'topping', itemId: 'top-1', nombre: 'Aguacate + Tomates Cherry', precioExtra: 2000, disponible: true }
const mockTopping2: OpcionArmaPlatoDTO = { tipo: 'topping', itemId: 'top-2', nombre: 'Mix de Quesos', precioExtra: 1500, disponible: true }
const mockBebida: OpcionArmaPlatoDTO = { tipo: 'bebida', itemId: 'beb-1', nombre: 'Limonada Natural', precioExtra: 3500, disponible: true }

const selCompleta: BowlSelection = {
  base: mockBase,
  proteina: mockProteina,
  toppings: [mockTopping1],
  bebida: mockBebida,
}

const TIPOS_OBLIGATORIOS = ['base', 'proteina', 'bebida']

// ─── calcularPrecioBowl ───────────────────────────────────────────────────────

describe('calcularPrecioBowl', () => {
  it('debe retornar solo el precio base con selección vacía', () => {
    expect(calcularPrecioBowl(armaPlatoItem, BOWL_SELECTION_INICIAL)).toBe(armaPlatoItem.precio)
  })

  it('debe sumar todos los componentes seleccionados', () => {
    expect(calcularPrecioBowl(armaPlatoItem, selCompleta)).toBe(armaPlatoItem.precio + 0 + 4500 + 2000 + 3500)
  })

  it('debe incluir el precio extra de una base con costo', () => {
    const sel = { ...BOWL_SELECTION_INICIAL, base: mockBaseExtra }
    expect(calcularPrecioBowl(armaPlatoItem, sel)).toBe(armaPlatoItem.precio + 1000)
  })

  it('debe sumar múltiples toppings', () => {
    const sel = { ...BOWL_SELECTION_INICIAL, toppings: [mockTopping1, mockTopping2] }
    expect(calcularPrecioBowl(armaPlatoItem, sel)).toBe(armaPlatoItem.precio + 2000 + 1500)
  })

  it('debe manejar toppings vacíos correctamente', () => {
    const sel = { ...BOWL_SELECTION_INICIAL, base: mockBase, proteina: mockProteina, toppings: [], bebida: mockBebida }
    expect(calcularPrecioBowl(armaPlatoItem, sel)).toBe(armaPlatoItem.precio + 4500 + 3500)
  })
})

// ─── puedeAvanzarPaso ─────────────────────────────────────────────────────────

describe('puedeAvanzarPaso', () => {
  it('base: no puede avanzar sin base', () => {
    expect(puedeAvanzarPaso('base', BOWL_SELECTION_INICIAL)).toBe(false)
  })

  it('base: puede avanzar con base seleccionada', () => {
    expect(puedeAvanzarPaso('base', { ...BOWL_SELECTION_INICIAL, base: mockBase })).toBe(true)
  })

  it('proteina: no puede avanzar sin proteína', () => {
    expect(puedeAvanzarPaso('proteina', BOWL_SELECTION_INICIAL)).toBe(false)
  })

  it('proteina: puede avanzar con proteína seleccionada', () => {
    expect(puedeAvanzarPaso('proteina', { ...BOWL_SELECTION_INICIAL, proteina: mockProteina })).toBe(true)
  })

  it('topping: siempre puede avanzar (opcional)', () => {
    expect(puedeAvanzarPaso('topping', BOWL_SELECTION_INICIAL)).toBe(true)
    expect(puedeAvanzarPaso('topping', selCompleta)).toBe(true)
  })

  it('bebida: no puede avanzar sin bebida', () => {
    expect(puedeAvanzarPaso('bebida', BOWL_SELECTION_INICIAL)).toBe(false)
  })

  it('bebida: puede avanzar con bebida seleccionada', () => {
    expect(puedeAvanzarPaso('bebida', { ...BOWL_SELECTION_INICIAL, bebida: mockBebida })).toBe(true)
  })
})

// ─── toggleOpcion ─────────────────────────────────────────────────────────────

describe('toggleOpcion', () => {
  it('topping: debe agregar el topping si no existe en la lista', () => {
    const result = toggleOpcion(BOWL_SELECTION_INICIAL, 'topping', mockTopping1)
    expect(result.toppings).toHaveLength(1)
    expect(result.toppings[0]).toBe(mockTopping1)
  })

  it('topping: debe quitar el topping si ya existe', () => {
    const sel = { ...BOWL_SELECTION_INICIAL, toppings: [mockTopping1] }
    const result = toggleOpcion(sel, 'topping', mockTopping1)
    expect(result.toppings).toHaveLength(0)
  })

  it('topping: no debe mutar la selección original', () => {
    const sel = { ...BOWL_SELECTION_INICIAL, toppings: [mockTopping1] }
    toggleOpcion(sel, 'topping', mockTopping2)
    expect(sel.toppings).toHaveLength(1)
  })

  it('base: reemplaza la selección única', () => {
    const sel = toggleOpcion(BOWL_SELECTION_INICIAL, 'base', mockBase)
    const result = toggleOpcion(sel, 'base', mockBaseExtra)
    expect(result.base).toBe(mockBaseExtra)
  })
})

// ─── construirNombreBowl ──────────────────────────────────────────────────────

describe('construirNombreBowl', () => {
  it('debe construir el nombre con base + proteína', () => {
    expect(construirNombreBowl(armaPlatoItem, selCompleta)).toBe(
      `${armaPlatoItem.nombre}: Arroz Integral + Pollo a la Plancha`
    )
  })

  it('debe retornar el nombre del item si no hay base', () => {
    expect(construirNombreBowl(armaPlatoItem, { ...selCompleta, base: null })).toBe(armaPlatoItem.nombre)
  })

  it('debe retornar el nombre del item si no hay proteína', () => {
    expect(construirNombreBowl(armaPlatoItem, { ...selCompleta, proteina: null })).toBe(armaPlatoItem.nombre)
  })
})

// ─── seleccionACartItem ───────────────────────────────────────────────────────

describe('seleccionACartItem', () => {
  const restauranteId = 'rest-1'

  it('debe crear un CartItem válido con selección completa', () => {
    const item = seleccionACartItem(armaPlatoItem, restauranteId, selCompleta, TIPOS_OBLIGATORIOS)
    expect(item).not.toBeNull()
  })

  it('debe calcular el precio correcto del bowl', () => {
    const item = seleccionACartItem(armaPlatoItem, restauranteId, selCompleta, TIPOS_OBLIGATORIOS)!
    expect(item.price).toBe(calcularPrecioBowl(armaPlatoItem, selCompleta))
  })

  it('debe referenciar el itemMenuId y restauranteId', () => {
    const item = seleccionACartItem(armaPlatoItem, restauranteId, selCompleta, TIPOS_OBLIGATORIOS)!
    expect(item.itemMenuId).toBe(armaPlatoItem.id)
    expect(item.restauranteId).toBe(restauranteId)
  })

  it('el ID debe comenzar con "bowl-"', () => {
    const item = seleccionACartItem(armaPlatoItem, restauranteId, selCompleta, TIPOS_OBLIGATORIOS)!
    expect(item.id.startsWith('bowl-')).toBe(true)
  })

  it('debe retornar null si falta la base obligatoria', () => {
    expect(seleccionACartItem(armaPlatoItem, restauranteId, { ...selCompleta, base: null }, TIPOS_OBLIGATORIOS)).toBeNull()
  })

  it('debe retornar null si falta la proteína obligatoria', () => {
    expect(seleccionACartItem(armaPlatoItem, restauranteId, { ...selCompleta, proteina: null }, TIPOS_OBLIGATORIOS)).toBeNull()
  })

  it('debe retornar null si falta la bebida obligatoria', () => {
    expect(seleccionACartItem(armaPlatoItem, restauranteId, { ...selCompleta, bebida: null }, TIPOS_OBLIGATORIOS)).toBeNull()
  })

  it('no debe exigir un tipo que no está en la lista de obligatorios', () => {
    const item = seleccionACartItem(armaPlatoItem, restauranteId, { ...selCompleta, bebida: null }, ['base', 'proteina'])
    expect(item).not.toBeNull()
  })
})

// ─── estaSeleccionado ─────────────────────────────────────────────────────────

describe('estaSeleccionado', () => {
  it('base: detecta la base seleccionada', () => {
    expect(estaSeleccionado(selCompleta, 'base', 'base-1')).toBe(true)
    expect(estaSeleccionado(selCompleta, 'base', 'base-2')).toBe(false)
  })

  it('proteina: detecta la proteína seleccionada', () => {
    expect(estaSeleccionado(selCompleta, 'proteina', 'prot-1')).toBe(true)
    expect(estaSeleccionado(selCompleta, 'proteina', 'prot-2')).toBe(false)
  })

  it('topping: detecta el topping seleccionado', () => {
    expect(estaSeleccionado(selCompleta, 'topping', 'top-1')).toBe(true)
    expect(estaSeleccionado(selCompleta, 'topping', 'top-2')).toBe(false)
  })

  it('bebida: detecta la bebida seleccionada', () => {
    expect(estaSeleccionado(selCompleta, 'bebida', 'beb-1')).toBe(true)
    expect(estaSeleccionado(selCompleta, 'bebida', 'beb-2')).toBe(false)
  })
})

// ─── BOWL_SELECTION_INICIAL ───────────────────────────────────────────────────

describe('BOWL_SELECTION_INICIAL', () => {
  it('debe tener base, proteína y bebida null, y toppings vacío', () => {
    expect(BOWL_SELECTION_INICIAL.base).toBeNull()
    expect(BOWL_SELECTION_INICIAL.proteina).toBeNull()
    expect(BOWL_SELECTION_INICIAL.toppings).toHaveLength(0)
    expect(BOWL_SELECTION_INICIAL.bebida).toBeNull()
  })
})
