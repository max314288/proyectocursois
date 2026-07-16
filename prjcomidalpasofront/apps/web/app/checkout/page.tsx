'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/store/cartStore'
import { useOrderStore, type ConsumptionMode, type PaymentMethod } from '@/store/orderStore'
import { estaAutenticado } from '@/lib/services/authService'
import { crearPedido, registrarPago, obtenerPedido, listarMesas, enviarComprobantePorCorreo } from '@/lib/services/pedidoApiService'
import { ApiError } from '@/lib/services/apiClient'
import { formatearNumeroTarjeta, formatearExpiry, tarjetaCompleta } from '@/lib/services/checkoutService'
import type { MesaDTO } from '@/lib/services/types'
import {
  Check,
  ChevronRight,
  Building2,
  ShoppingBag,
  CreditCard,
  Lock,
  Banknote,
  QrCode,
  Loader2,
  ArrowLeft,
  Printer,
  AlertTriangle,
  Mail,
  Send,
} from 'lucide-react'

type Step = 'mode' | 'payment' | 'card' | 'done'

const STEP_LABELS = ['Modalidad', 'Pago', 'Confirmación']
const stepIndex: Record<Step, number> = { mode: 0, payment: 1, card: 1, done: 2 }

export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, count, clear } = useCart()
  const setOrder = useOrderStore((s) => s.set)
  const order = useOrderStore((s) => s.order)

  const [step, setStep] = useState<Step>('mode')
  const [mode, setMode] = useState<ConsumptionMode | null>(null)
  const [payment, setPayment] = useState<PaymentMethod | null>(null)
  const [processing, setProcessing] = useState(false)
  const [errorMsg, setErrorMsg] = useState<string | null>(null)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [totalDifiere, setTotalDifiere] = useState(false)

  // Enviar comprobante por correo
  const [mostrarFormCorreo, setMostrarFormCorreo] = useState(false)
  const [emailComprobante, setEmailComprobante] = useState('')
  const [enviandoCorreo, setEnviandoCorreo] = useState(false)
  const [correoEnviado, setCorreoEnviado] = useState(false)
  const [errorCorreo, setErrorCorreo] = useState<string | null>(null)

  // Salón: mesa
  const [mesas, setMesas] = useState<MesaDTO[]>([])
  const [mesaId, setMesaId] = useState<string | null>(null)
  const [numComensales, setNumComensales] = useState(1)
  const [cargandoMesas, setCargandoMesas] = useState(false)

  // Card form
  const [cardNum, setCardNum] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  const restauranteId = items[0]?.restauranteId

  // Guard: sesión requerida
  useEffect(() => {
    if (!estaAutenticado()) {
      router.replace('/acceso?next=/checkout')
    }
  }, [router])

  // Guard: carrito vacío
  useEffect(() => {
    if (items.length === 0 && step !== 'done') {
      router.replace('/pedido')
    }
  }, [items, step, router])

  // Cargar mesas al elegir salón
  useEffect(() => {
    if (mode !== 'salon' || !restauranteId) return
    setCargandoMesas(true)
    listarMesas(restauranteId)
      .then((data) => setMesas(data))
      .catch(() => setMesas([]))
      .finally(() => setCargandoMesas(false))
  }, [mode, restauranteId])

  async function finalizarPedido(metodo: PaymentMethod, referenciaExterna?: string) {
    if (!restauranteId || !mode) return
    setProcessing(true)
    setErrorMsg(null)
    try {
      const { id: pedidoId } = await crearPedido({
        restauranteId,
        modo: mode === 'recojo' ? 'recojo' : 'salon',
        items: items.map((i) => ({ itemMenuId: i.itemMenuId, cantidad: i.quantity, notasItem: i.notasItem })),
        mesaId: mode === 'salon' ? mesaId ?? undefined : undefined,
        numComensales: mode === 'salon' ? numComensales : undefined,
      })

      await registrarPago({ pedidoId, metodo, referenciaExterna })
      const detalle = await obtenerPedido(pedidoId)

      setTotalDifiere(Math.abs(detalle.total - total()) > 0.01)

      if (metodo === 'efectivo' && detalle.codigoQr) {
        try {
          const QRCode = await import('qrcode')
          const payload = JSON.stringify({
            pedido: pedidoId,
            codigo: detalle.codigoQr,
            items: items.length,
            total: detalle.total,
            modo: mode,
          })
          setQrDataUrl(
            await QRCode.toDataURL(payload, {
              width: 280,
              margin: 2,
              color: { dark: '#1e1b18', light: '#fff8f5' },
              errorCorrectionLevel: 'M',
            })
          )
        } catch {
          // sin QR si falla la generación — el pedido ya quedó registrado
        }
      }

      setOrder({
        id: pedidoId,
        items: [...items],
        total: detalle.total,
        modo: mode,
        metodo,
        codigoQr: detalle.codigoQr,
        referenciaExterna,
        createdAt: new Date().toISOString(),
      })
      clear()
      setStep('done')
    } catch (err) {
      setErrorMsg(err instanceof ApiError ? err.message : 'No se pudo procesar el pedido. Intenta de nuevo.')
    } finally {
      setProcessing(false)
    }
  }

  async function handlePagoTarjeta() {
    setProcessing(true)
    await new Promise((r) => setTimeout(r, 1800)) // simulación de pasarela
    await finalizarPedido('tarjeta', cardNum.replace(/\s/g, '').slice(-4))
  }

  async function handleEnviarComprobante() {
    if (!order) return
    setEnviandoCorreo(true)
    setErrorCorreo(null)
    try {
      await enviarComprobantePorCorreo(order.id, emailComprobante)
      setCorreoEnviado(true)
      setMostrarFormCorreo(false)
    } catch (err) {
      setErrorCorreo(err instanceof ApiError ? err.message : 'No se pudo enviar el correo. Intenta de nuevo.')
    } finally {
      setEnviandoCorreo(false)
    }
  }

  const cartTotal = total()
  const cartCount = count()

  return (
    <div className="min-h-[calc(100vh-4rem)] py-10 px-6 print:py-0 print:px-0" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
      <div className="max-w-4xl mx-auto">
        {step !== 'done' && (
          <Link
            href="/pedido"
            className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            <ArrowLeft size={15} /> Volver al carrito
          </Link>
        )}

        {step !== 'done' && (
          <div className="flex items-center gap-2 mb-10">
            {STEP_LABELS.map((label, i) => {
              const current = stepIndex[step]
              const done = i < current
              const active = i === current
              return (
                <div key={label} className="flex items-center gap-2 flex-1">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center shrink-0"
                      style={
                        done
                          ? { backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }
                          : active
                          ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }
                          : { backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)' }
                      }
                    >
                      {done ? <Check size={13} /> : i + 1}
                    </span>
                    <span
                      className="text-sm font-medium hidden sm:block"
                      style={{ color: active ? 'var(--color-on-surface)' : done ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)' }}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div className="flex-1 h-px ml-2" style={{ backgroundColor: done ? 'var(--color-secondary)' : 'var(--color-outline-variant)' }} />
                  )}
                </div>
              )
            })}
          </div>
        )}

        {errorMsg && (
          <div
            className="mb-6 rounded-xl p-4 flex items-start gap-3 text-sm"
            style={{ backgroundColor: 'var(--color-error-container)', color: 'var(--color-on-error-container)' }}
          >
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            {errorMsg}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="flex-1 min-w-0 print:w-full">
            {/* ════ STEP: MODALIDAD ════ */}
            {step === 'mode' && (
              <div className="rounded-2xl p-6 shadow-ambient" style={{ backgroundColor: 'var(--color-surface)' }}>
                <h2 className="mb-1" style={{ fontFamily: 'var(--font-newsreader)', fontSize: '1.5rem', fontWeight: 600 }}>
                  ¿Cómo vas a consumir?
                </h2>
                <p className="text-sm mb-7" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Elige la modalidad de consumo para continuar.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <button
                    onClick={() => setMode('salon')}
                    className="rounded-2xl p-6 text-left transition-all duration-200 focus:outline-none"
                    style={{
                      border: mode === 'salon' ? '2px solid var(--color-primary)' : '2px solid var(--color-outline-variant)',
                      backgroundColor: mode === 'salon' ? 'var(--color-primary-container)' : 'var(--color-surface-container-low)',
                      boxShadow: mode === 'salon' ? '0 0 0 3px rgba(130,59,24,0.10)' : 'none',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        backgroundColor: mode === 'salon' ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                        color: mode === 'salon' ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                      }}
                    >
                      <Building2 size={22} />
                    </div>
                    <p className="font-semibold mb-1" style={{ color: mode === 'salon' ? 'var(--color-on-primary-container)' : 'var(--color-on-surface)' }}>
                      Consumir en Salón
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                      Elige tu mesa y disfruta tu pedido en el restaurante.
                    </p>
                  </button>

                  <button
                    onClick={() => setMode('recojo')}
                    className="rounded-2xl p-6 text-left transition-all duration-200 focus:outline-none"
                    style={{
                      border: mode === 'recojo' ? '2px solid var(--color-primary)' : '2px solid var(--color-outline-variant)',
                      backgroundColor: mode === 'recojo' ? 'var(--color-primary-container)' : 'var(--color-surface-container-low)',
                      boxShadow: mode === 'recojo' ? '0 0 0 3px rgba(130,59,24,0.10)' : 'none',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        backgroundColor: mode === 'recojo' ? 'var(--color-primary)' : 'var(--color-surface-container-high)',
                        color: mode === 'recojo' ? 'var(--color-on-primary)' : 'var(--color-on-surface-variant)',
                      }}
                    >
                      <ShoppingBag size={22} />
                    </div>
                    <p className="font-semibold mb-1" style={{ color: mode === 'recojo' ? 'var(--color-on-primary-container)' : 'var(--color-on-surface)' }}>
                      Para Recoger
                    </p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                      Retira tu pedido en el mostrador.
                    </p>
                  </button>
                </div>

                {/* Selector de mesa (salón) */}
                {mode === 'salon' && (
                  <div className="mt-6 rounded-xl p-5" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                    <p className="text-sm font-medium mb-3" style={{ color: 'var(--color-on-surface)' }}>
                      Elige tu mesa
                    </p>
                    {cargandoMesas ? (
                      <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                        Cargando mesas disponibles…
                      </p>
                    ) : mesas.length === 0 ? (
                      <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                        No hay mesas disponibles en este momento.
                      </p>
                    ) : (
                      <div className="flex flex-wrap gap-2 mb-4">
                        {mesas.map((m) => (
                          <button
                            key={m.id}
                            onClick={() => setMesaId(m.id)}
                            className="px-4 py-2 rounded-full text-sm font-medium transition-all"
                            style={
                              mesaId === m.id
                                ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }
                                : { backgroundColor: 'var(--color-surface)', color: 'var(--color-on-surface-variant)', border: '1.5px solid var(--color-outline-variant)' }
                            }
                          >
                            Mesa {m.numero} · {m.capacidad}p
                          </button>
                        ))}
                      </div>
                    )}
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-on-surface)' }}>
                      Número de comensales
                    </label>
                    <input
                      type="number"
                      min={1}
                      value={numComensales}
                      onChange={(e) => setNumComensales(Math.max(1, Number(e.target.value)))}
                      className="w-24 px-4 py-2 rounded-xl text-sm outline-none"
                      style={{ backgroundColor: 'var(--color-surface)', border: '1.5px solid var(--color-outline-variant)', color: 'var(--color-on-surface)' }}
                    />
                  </div>
                )}

                <div className="mt-8 flex justify-end">
                  <button
                    disabled={!mode || (mode === 'salon' && !mesaId)}
                    onClick={() => setStep('payment')}
                    className="flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all"
                    style={
                      mode && !(mode === 'salon' && !mesaId)
                        ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }
                        : { backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)', cursor: 'not-allowed' }
                    }
                  >
                    Continuar <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ════ STEP: MÉTODO DE PAGO ════ */}
            {step === 'payment' && (
              <div className="rounded-2xl p-6 shadow-ambient" style={{ backgroundColor: 'var(--color-surface)' }}>
                <div className="flex items-center gap-3 mb-1">
                  <button onClick={() => setStep('mode')} className="p-1.5 rounded-full hover:opacity-70 transition-opacity" style={{ color: 'var(--color-on-surface-variant)' }}>
                    <ArrowLeft size={18} />
                  </button>
                  <h2 style={{ fontFamily: 'var(--font-newsreader)', fontSize: '1.5rem', fontWeight: 600 }}>Método de pago</h2>
                </div>

                <p className="text-sm mb-7 pl-9" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Modalidad:{' '}
                  <strong style={{ color: 'var(--color-on-surface)' }}>{mode === 'salon' ? 'Consumir en Salón' : 'Para Recoger'}</strong>
                </p>

                <div className="flex flex-col gap-4">
                  <button
                    onClick={() => {
                      setPayment('tarjeta')
                      setStep('card')
                    }}
                    disabled={processing}
                    className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-200"
                    style={{ border: '2px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-primary)' }}>
                      <CreditCard size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-0.5">Pagar en línea</p>
                      <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                        Tarjeta de crédito o débito — recibirás un comprobante
                      </p>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setPayment('efectivo')
                      finalizarPedido('efectivo')
                    }}
                    disabled={processing}
                    className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-200"
                    style={{ border: '2px solid var(--color-outline-variant)', backgroundColor: 'var(--color-surface-container-low)' }}
                  >
                    <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-secondary)' }}>
                      {processing && payment === 'efectivo' ? <Loader2 size={20} className="animate-spin" /> : <Banknote size={20} />}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-0.5">Pago en local</p>
                      <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                        Genera un código QR y paga al recoger o en tu mesa
                      </p>
                    </div>
                  </button>
                </div>

                <div className="mt-6 flex items-center gap-2">
                  <Lock size={13} style={{ color: 'var(--color-secondary)' }} />
                  <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Tus datos de pago son cifrados con TLS 256-bit. No almacenamos información de tarjetas.
                  </p>
                </div>
              </div>
            )}

            {/* ════ STEP: PASARELA (formulario de tarjeta) ════ */}
            {step === 'card' && (
              <div className="rounded-2xl p-6 shadow-ambient" style={{ backgroundColor: 'var(--color-surface)' }}>
                <div className="flex items-center gap-3 mb-6">
                  <button onClick={() => setStep('payment')} className="p-1.5 rounded-full hover:opacity-70 transition-opacity" style={{ color: 'var(--color-on-surface-variant)' }}>
                    <ArrowLeft size={18} />
                  </button>
                  <h2 style={{ fontFamily: 'var(--font-newsreader)', fontSize: '1.5rem', fontWeight: 600 }}>Datos de pago</h2>
                </div>

                <div
                  className="relative rounded-2xl p-6 mb-8 overflow-hidden"
                  style={{ background: 'linear-gradient(135deg, var(--color-primary) 0%, #5c2910 100%)', minHeight: 160 }}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2" style={{ backgroundColor: 'white' }} />
                  <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 translate-y-1/2 -translate-x-1/2" style={{ backgroundColor: 'white' }} />
                  <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.60)' }}>
                    Comida al Paso · Pasarela Segura
                  </p>
                  <p className="text-xl font-mono tracking-widest mb-4" style={{ color: cardNum ? 'white' : 'rgba(255,255,255,0.35)' }}>
                    {cardNum || '•••• •••• •••• ••••'}
                  </p>
                  <div className="flex justify-between items-end">
                    <div>
                      <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        Titular
                      </p>
                      <p className="text-sm font-medium uppercase" style={{ color: cardName ? 'white' : 'rgba(255,255,255,0.35)' }}>
                        {cardName || 'NOMBRE APELLIDO'}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-[9px] uppercase tracking-widest mb-0.5" style={{ color: 'rgba(255,255,255,0.55)' }}>
                        Vence
                      </p>
                      <p className="text-sm font-mono" style={{ color: expiry ? 'white' : 'rgba(255,255,255,0.35)' }}>
                        {expiry || 'MM/AA'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-on-surface)' }}>
                      Número de tarjeta
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardNum}
                      onChange={(e) => setCardNum(formatearNumeroTarjeta(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono tracking-wider"
                      style={{ backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)', border: '1.5px solid var(--color-outline-variant)' }}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-on-surface)' }}>
                      Nombre del titular
                    </label>
                    <input
                      type="text"
                      placeholder="Como aparece en la tarjeta"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none uppercase tracking-wide"
                      style={{ backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)', border: '1.5px solid var(--color-outline-variant)' }}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-on-surface)' }}>
                        Vencimiento
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/AA"
                        value={expiry}
                        onChange={(e) => setExpiry(formatearExpiry(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono"
                        style={{ backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)', border: '1.5px solid var(--color-outline-variant)' }}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-on-surface)' }}>
                        CVV
                      </label>
                      <input
                        type="password"
                        inputMode="numeric"
                        placeholder="•••"
                        maxLength={4}
                        value={cvv}
                        onChange={(e) => setCvv(e.target.value.replace(/\D/g, '').slice(0, 4))}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono"
                        style={{ backgroundColor: 'var(--color-surface-container-low)', color: 'var(--color-on-surface)', border: '1.5px solid var(--color-outline-variant)' }}
                      />
                    </div>
                  </div>

                  <button
                    onClick={handlePagoTarjeta}
                    disabled={processing || !tarjetaCompleta(cardNum, cardName, expiry, cvv)}
                    className="w-full py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 mt-2 btn-interactive"
                    style={
                      processing || !tarjetaCompleta(cardNum, cardName, expiry, cvv)
                        ? { backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)', cursor: 'not-allowed' }
                        : { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }
                    }
                  >
                    {processing ? (
                      <>
                        <Loader2 size={16} className="animate-spin" /> Procesando pago…
                      </>
                    ) : (
                      <>
                        <Lock size={15} /> Pagar S/{cartTotal.toLocaleString('es-PE')}
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* ════ STEP: CONFIRMACIÓN ════ */}
            {step === 'done' && order && (
              <div className="rounded-2xl p-8 shadow-ambient text-center print:shadow-none" style={{ backgroundColor: 'var(--color-surface)' }} id="comprobante">
                <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 print:hidden" style={{ backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-secondary)' }}>
                  <Check size={32} />
                </div>

                <h2 className="mb-1" style={{ fontFamily: 'var(--font-newsreader)', fontSize: '1.75rem', fontWeight: 600 }}>
                  {order.metodo === 'efectivo' ? '¡Pedido registrado!' : '¡Pago confirmado!'}
                </h2>

                <p className="text-sm mb-2" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {order.metodo === 'efectivo'
                    ? 'Muestra el código QR para pagar y recoger tu pedido.'
                    : 'Tu pago fue procesado. Guarda tu comprobante.'}
                </p>

                {totalDifiere && (
                  <p className="text-xs mt-2 mb-2" style={{ color: 'var(--color-error)' }}>
                    El total puede variar respecto al carrito según los complementos elegidos — el monto mostrado es el confirmado.
                  </p>
                )}

                <div
                  className="inline-block px-5 py-2 rounded-full text-sm font-mono font-semibold mt-4 mb-8"
                  style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
                >
                  Pedido #{order.id.slice(0, 8).toUpperCase()}
                </div>

                {order.metodo === 'efectivo' && qrDataUrl && (
                  <div className="mb-8">
                    <div className="inline-block p-4 rounded-2xl shadow-ambient" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={qrDataUrl} alt={`QR Pedido ${order.id}`} width={240} height={240} className="rounded-xl" />
                    </div>
                    <p className="text-xs mt-3 flex items-center justify-center gap-1.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                      <QrCode size={12} /> Muéstralo al pagar y retirar tu pedido
                    </p>
                  </div>
                )}

                {order.metodo === 'tarjeta' && (
                  <div className="rounded-xl p-5 mb-8 text-left mx-auto max-w-sm text-sm" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                    <p className="font-semibold mb-3" style={{ color: 'var(--color-on-surface)' }}>
                      Comprobante de pago
                    </p>
                    <div className="flex justify-between py-1">
                      <span style={{ color: 'var(--color-on-surface-variant)' }}>Fecha</span>
                      <span>{new Date(order.createdAt).toLocaleString('es-PE')}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span style={{ color: 'var(--color-on-surface-variant)' }}>Método</span>
                      <span>Tarjeta •••• {order.referenciaExterna}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span style={{ color: 'var(--color-on-surface-variant)' }}>Ítems</span>
                      <span>{order.items.length}</span>
                    </div>
                    <div className="flex justify-between py-2 mt-1 font-bold" style={{ borderTop: '1px solid var(--color-outline-variant)', color: 'var(--color-primary)' }}>
                      <span>Total</span>
                      <span>S/{order.total.toLocaleString('es-PE')}</span>
                    </div>
                  </div>
                )}

                <div className="rounded-xl p-4 mb-8 text-sm text-left mx-auto max-w-xs" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-secondary)' }}>
                      {order.modo === 'salon' ? <Building2 size={16} /> : <ShoppingBag size={16} />}
                    </div>
                    <div>
                      <p className="font-semibold mb-0.5" style={{ color: 'var(--color-on-surface)' }}>
                        {order.modo === 'salon' ? 'Consumo en salón' : 'Para recoger'}
                      </p>
                      <p style={{ color: 'var(--color-on-surface-variant)' }}>Total: S/{order.total.toLocaleString('es-PE')}</p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center print:hidden">
                  {order.metodo === 'tarjeta' && (
                    <button
                      onClick={() => window.print()}
                      className="px-7 py-3 rounded-full text-sm font-semibold border-2 hover:bg-[var(--color-surface-container)] transition-colors inline-flex items-center gap-2 justify-center"
                      style={{ borderColor: 'var(--color-outline-variant)', color: 'var(--color-on-surface)' }}
                    >
                      <Printer size={15} /> Imprimir / Guardar
                    </button>
                  )}
                  <button
                    onClick={() => setMostrarFormCorreo((v) => !v)}
                    className="px-7 py-3 rounded-full text-sm font-semibold border-2 hover:bg-[var(--color-surface-container)] transition-colors inline-flex items-center gap-2 justify-center"
                    style={{ borderColor: 'var(--color-outline-variant)', color: 'var(--color-on-surface)' }}
                  >
                    <Mail size={15} /> Enviar por correo
                  </button>
                  <Link href="/perfil/pedidos" className="px-7 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity" style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}>
                    Ver mis pedidos
                  </Link>
                  <Link
                    href="/menus"
                    className="px-7 py-3 rounded-full text-sm font-medium border-2 hover:bg-[var(--color-surface-container)] transition-colors"
                    style={{ borderColor: 'var(--color-outline-variant)', color: 'var(--color-on-surface)' }}
                  >
                    Ver más menús
                  </Link>
                </div>

                {mostrarFormCorreo && (
                  <div className="mt-4 mx-auto max-w-sm print:hidden">
                    <div className="rounded-xl p-4 text-left" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
                      <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-on-surface)' }}>
                        Correo de destino
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="email"
                          value={emailComprobante}
                          onChange={(e) => setEmailComprobante(e.target.value)}
                          placeholder="tu@correo.com"
                          required
                          disabled={enviandoCorreo}
                          className="flex-1 px-4 py-2.5 rounded-xl text-sm outline-none"
                          style={{ backgroundColor: 'var(--color-surface)', border: '1.5px solid var(--color-outline-variant)', color: 'var(--color-on-surface)' }}
                        />
                        <button
                          onClick={handleEnviarComprobante}
                          disabled={enviandoCorreo || !emailComprobante.includes('@')}
                          className="px-5 py-2.5 rounded-full text-sm font-semibold inline-flex items-center gap-2 shrink-0"
                          style={
                            enviandoCorreo || !emailComprobante.includes('@')
                              ? { backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)', cursor: 'not-allowed' }
                              : { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }
                          }
                        >
                          {enviandoCorreo ? <Loader2 size={15} className="animate-spin" /> : <Send size={15} />}
                          Enviar
                        </button>
                      </div>
                      {errorCorreo && (
                        <p className="text-xs mt-2" style={{ color: 'var(--color-error)' }}>{errorCorreo}</p>
                      )}
                    </div>
                  </div>
                )}

                {correoEnviado && (
                  <p className="text-xs mt-3 flex items-center justify-center gap-1.5 print:hidden" style={{ color: 'var(--color-secondary)' }}>
                    <Check size={12} /> Comprobante enviado a {emailComprobante}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* ── Order summary sidebar ── */}
          {step !== 'done' && (
            <aside className="lg:w-72 w-full rounded-2xl p-5 shadow-ambient lg:sticky lg:top-24" style={{ backgroundColor: 'var(--color-surface)' }}>
              <h3 className="mb-4" style={{ fontFamily: 'var(--font-newsreader)', fontSize: '1.15rem', fontWeight: 500 }}>
                Resumen del pedido
              </h3>

              <ul className="flex flex-col gap-3 mb-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 items-center">
                    <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug truncate">{item.name}</p>
                      <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                        ×{item.quantity}
                      </p>
                    </div>
                    <p className="text-sm font-semibold shrink-0" style={{ color: 'var(--color-primary)' }}>
                      S/{(item.price * item.quantity).toLocaleString('es-PE')}
                    </p>
                  </li>
                ))}
              </ul>

              <div className="pt-4" style={{ borderTop: '1px solid var(--color-outline-variant)' }}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Subtotal ({cartCount} ítem{cartCount !== 1 ? 's' : ''})
                  </span>
                  <span className="text-sm font-semibold">S/{cartTotal.toLocaleString('es-PE')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                    S/{cartTotal.toLocaleString('es-PE')}
                  </span>
                </div>
              </div>

              {mode && (
                <div className="mt-4 pt-4 flex items-center gap-2 text-xs" style={{ borderTop: '1px solid var(--color-outline-variant)', color: 'var(--color-on-surface-variant)' }}>
                  {mode === 'salon' ? <Building2 size={13} /> : <ShoppingBag size={13} />}
                  <span>{mode === 'salon' ? 'Consumir en salón' : 'Para recoger'}</span>
                </div>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
