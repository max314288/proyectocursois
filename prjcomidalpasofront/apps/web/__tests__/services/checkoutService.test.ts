/**
 * checkoutService.test.ts — TDD
 *
 * Especifica el comportamiento esperado de cada función del servicio.
 * Red → Green → Refactor
 */

import {
  generarOrderId,
  formatearNumeroTarjeta,
  formatearExpiry,
  esPresencialDisponible,
  tarjetaCompleta,
  construirQRPayload,
  requiereQR,
} from '@/lib/services/checkoutService'

// ─── generarOrderId ───────────────────────────────────────────────────────────

describe('generarOrderId', () => {
  it('debe generar un ID con formato CAP-XXXXX', () => {
    const id = generarOrderId()
    expect(id).toMatch(/^CAP-[A-Z0-9]{5}$/)
  })

  it('debe generar IDs únicos en múltiples llamadas', () => {
    const ids = new Set(Array.from({ length: 100 }, () => generarOrderId()))
    // Al menos 90% únicos (el 10% de tolerancia cubre colisiones aleatorias)
    expect(ids.size).toBeGreaterThan(90)
  })

  it('debe comenzar siempre con "CAP-"', () => {
    for (let i = 0; i < 10; i++) {
      expect(generarOrderId().startsWith('CAP-')).toBe(true)
    }
  })

  it('debe tener exactamente 9 caracteres (CAP- + 5)', () => {
    expect(generarOrderId()).toHaveLength(9)
  })
})

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
    // El usuario escribe "12/2" → input llega como "12/2"
    expect(formatearExpiry('12/2')).toBe('12/2')
  })

  it('debe retornar vacío para entrada vacía', () => {
    expect(formatearExpiry('')).toBe('')
  })

  it('debe ignorar caracteres no numéricos', () => {
    expect(formatearExpiry('ab1225cd')).toBe('12/25')
  })
})

// ─── esPresencialDisponible ───────────────────────────────────────────────────

describe('esPresencialDisponible', () => {
  it('debe estar disponible para consumo en salón', () => {
    expect(esPresencialDisponible('salon')).toBe(true)
  })

  it('no debe estar disponible para takeaway', () => {
    expect(esPresencialDisponible('takeaway')).toBe(false)
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

// ─── construirQRPayload ───────────────────────────────────────────────────────

describe('construirQRPayload', () => {
  it('debe retornar un JSON válido', () => {
    expect(() => JSON.parse(construirQRPayload('CAP-12345', 3, 45900))).not.toThrow()
  })

  it('debe incluir el ID del pedido', () => {
    const payload = JSON.parse(construirQRPayload('CAP-12345', 3, 45900))
    expect(payload.pedido).toBe('CAP-12345')
  })

  it('debe incluir la cantidad de ítems', () => {
    const payload = JSON.parse(construirQRPayload('CAP-12345', 3, 45900))
    expect(payload.items).toBe(3)
  })

  it('debe incluir el total', () => {
    const payload = JSON.parse(construirQRPayload('CAP-12345', 3, 45900))
    expect(payload.total).toBe(45900)
  })

  it('debe incluir modo takeaway', () => {
    const payload = JSON.parse(construirQRPayload('CAP-12345', 3, 45900))
    expect(payload.modo).toBe('takeaway')
  })

  it('debe incluir una fecha de expiración en el futuro', () => {
    const ahora = Date.now()
    const payload = JSON.parse(construirQRPayload('CAP-12345', 1, 10000))
    expect(new Date(payload.expira).getTime()).toBeGreaterThan(ahora)
  })

  it('debe respetar el parámetro expiryMs personalizado', () => {
    const expiryMs = 5 * 60 * 1000 // 5 minutos
    const antes = Date.now()
    const payload = JSON.parse(construirQRPayload('CAP-12345', 1, 10000, expiryMs))
    const expiryTimestamp = new Date(payload.expira).getTime()
    // La expiración debe ser aproximadamente ahora + 5 minutos
    expect(expiryTimestamp).toBeGreaterThanOrEqual(antes + expiryMs - 100)
    expect(expiryTimestamp).toBeLessThanOrEqual(antes + expiryMs + 1000)
  })
})

// ─── requiereQR ───────────────────────────────────────────────────────────────

describe('requiereQR', () => {
  it('debe requerir QR para takeaway + gateway', () => {
    expect(requiereQR('takeaway', 'gateway')).toBe(true)
  })

  it('no debe requerir QR para salón + gateway', () => {
    expect(requiereQR('salon', 'gateway')).toBe(false)
  })

  it('no debe requerir QR para salón + presencial', () => {
    expect(requiereQR('salon', 'presencial')).toBe(false)
  })

  it('no debe requerir QR para takeaway + presencial (no existe, pero cubre la combinación)', () => {
    expect(requiereQR('takeaway', 'presencial')).toBe(false)
  })
})
