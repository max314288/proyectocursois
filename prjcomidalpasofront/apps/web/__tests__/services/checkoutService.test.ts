/**
 * checkoutService.test.ts — TDD
 *
 * Especifica el comportamiento esperado de cada función del servicio.
 */

import { formatearNumeroTarjeta, formatearExpiry, tarjetaCompleta } from '@/lib/services/checkoutService'

// ─── formatearNumeroTarjeta ───────────────────────────────────────────────────

describe('formatearNumeroTarjeta', () => {
  it('debe formatear 16 dígitos continuos con espacios cada 4', () => {
    expect(formatearNumeroTarjeta('1234567890123456')).toBe('1234 5678 9012 3456')
  })

  it('debe ignorar guiones en la entrada', () => {
    expect(formatearNumeroTarjeta('1234-5678-9012-3456')).toBe('1234 5678 9012 3456')
  })

  it('debe ignorar espacios existentes en la entrada', () => {
    expect(formatearNumeroTarjeta('1234 5678 9012 3456')).toBe('1234 5678 9012 3456')
  })

  it('debe truncar a máximo 16 dígitos', () => {
    expect(formatearNumeroTarjeta('12345678901234567890')).toBe('1234 5678 9012 3456')
  })

  it('debe retornar vacío para entrada vacía', () => {
    expect(formatearNumeroTarjeta('')).toBe('')
  })

  it('debe ignorar letras y caracteres especiales', () => {
    expect(formatearNumeroTarjeta('1234abc5678')).toBe('1234 5678')
  })
})

// ─── formatearExpiry ──────────────────────────────────────────────────────────

describe('formatearExpiry', () => {
  it('debe formatear 4 dígitos como MM/AA', () => {
    expect(formatearExpiry('1225')).toBe('12/25')
  })

  it('debe mantener solo 2 dígitos si son menos de 3', () => {
    expect(formatearExpiry('12')).toBe('12')
  })

  it('debe manejar la barra ya existente sin duplicar', () => {
    expect(formatearExpiry('12/2')).toBe('12/2')
  })

  it('debe retornar vacío para entrada vacía', () => {
    expect(formatearExpiry('')).toBe('')
  })

  it('debe ignorar caracteres no numéricos', () => {
    expect(formatearExpiry('ab1225cd')).toBe('12/25')
  })
})

// ─── tarjetaCompleta ──────────────────────────────────────────────────────────

describe('tarjetaCompleta', () => {
  const numValido = '1234 5678 9012 3456' // 19 chars (16 dígitos + 3 espacios)

  it('debe retornar true con todos los campos válidos', () => {
    expect(tarjetaCompleta(numValido, 'JUAN PEREZ', '12/25', '123')).toBe(true)
  })

  it('debe aceptar CVV de 4 dígitos (AMEX)', () => {
    expect(tarjetaCompleta(numValido, 'JUAN PEREZ', '12/25', '1234')).toBe(true)
  })

  it('debe retornar false si el número tiene menos de 19 chars', () => {
    expect(tarjetaCompleta('1234 5678', 'JUAN PEREZ', '12/25', '123')).toBe(false)
  })

  it('debe retornar false si el nombre está vacío', () => {
    expect(tarjetaCompleta(numValido, '', '12/25', '123')).toBe(false)
  })

  it('debe retornar false si el nombre es solo espacios', () => {
    expect(tarjetaCompleta(numValido, '   ', '12/25', '123')).toBe(false)
  })

  it('debe retornar false si el expiry tiene menos de 5 chars', () => {
    expect(tarjetaCompleta(numValido, 'JUAN PEREZ', '12', '123')).toBe(false)
  })

  it('debe retornar false si el CVV tiene menos de 3 dígitos', () => {
    expect(tarjetaCompleta(numValido, 'JUAN PEREZ', '12/25', '12')).toBe(false)
  })
})
