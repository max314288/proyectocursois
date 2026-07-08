/**
 * checkoutService.ts — CONTROLLER layer
 *
 * Funciones puras de formateo/validación del formulario de tarjeta.
 * El pedido, el pago y el QR ahora los genera el backend (ver pedidoApiService.ts).
 */

// ─── Formateo de campos de tarjeta ────────────────────────────────────────────

export function formatearNumeroTarjeta(value: string): string {
  return value
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}

export function formatearExpiry(value: string): string {
  const d = value.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}

/**
 * Valida si todos los campos de tarjeta están completos para procesar
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
