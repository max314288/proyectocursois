/**
 * checkoutService.ts — CONTROLLER layer
 *
 * SOLID:
 *  S — cada función tiene una única responsabilidad
 *  O — funciones puras, extensibles sin modificarlas
 *  D — el componente depende de estas abstracciones, no de lógica inline
 */

import type { ConsumptionMode, PaymentMethod } from '@/store/orderStore'

// ─── Tipos ────────────────────────────────────────────────────────────────────

export type CheckoutStep = 'mode' | 'payment' | 'card' | 'done'

export interface QRPayload {
  pedido: string
  items: number
  total: number
  modo: string
  expira: string
}

// ─── Generación de IDs ────────────────────────────────────────────────────────

/**
 * Genera un ID único de pedido con formato CAP-XXXXX
 * S: responsabilidad única — solo genera IDs
 */
export function generarOrderId(): string {
  return `CAP-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

// ─── Formateo de campos de tarjeta ────────────────────────────────────────────

/**
 * Formatea un número de tarjeta con espacios cada 4 dígitos
 * S: responsabilidad única — solo formatea el número
 */
export function formatearNumeroTarjeta(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

/**
 * Formatea una fecha de expiración como MM/AA
 * S: responsabilidad única — solo formatea la fecha
 */
export function formatearExpiry(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

// ─── Reglas de negocio del checkout ──────────────────────────────────────────

/**
 * Determina si el pago presencial está disponible para el modo seleccionado
 * S: encapsula la regla: presencial solo aplica para salón
 */
export function esPresencialDisponible(mode: ConsumptionMode): boolean {
  return mode === 'salon'
}

/**
 * Valida si todos los campos de tarjeta están completos para procesar
 * S: responsabilidad única — solo valida completitud del formulario
 */
export function tarjetaCompleta(
  cardNum: string,
  cardName: string,
  expiry: string,
  cvv: string
): boolean {
  return (
    cardNum.length >= 19 &&
    cardName.trim().length > 0 &&
    expiry.length >= 5 &&
    cvv.length >= 3
  )
}

/**
 * Determina si se debe generar un código QR para el pedido
 * S: encapsula la regla: QR solo para takeaway + gateway
 */
export function requiereQR(mode: ConsumptionMode, payment: PaymentMethod): boolean {
  return mode === 'takeaway' && payment === 'gateway'
}

// ─── QR ──────────────────────────────────────────────────────────────────────

/**
 * Construye el payload JSON para el código QR
 * S: responsabilidad única — solo construye el payload
 * Recibe expiryMs como parámetro para facilitar el testing (TDD)
 */
export function construirQRPayload(
  id: string,
  itemCount: number,
  total: number,
  expiryMs: number = 60 * 60 * 1000
): string {
  const payload: QRPayload = {
    pedido: id,
    items: itemCount,
    total,
    modo: 'takeaway',
    expira: new Date(Date.now() + expiryMs).toISOString(),
  }
  return JSON.stringify(payload)
}

/**
 * Opciones de configuración del QR — extraídas para evitar magic numbers
 */
export const QR_CONFIG = {
  width: 280,
  margin: 2,
  color: { dark: '#1e1b18', light: '#fff8f5' },
  errorCorrectionLevel: 'M',
} as const
