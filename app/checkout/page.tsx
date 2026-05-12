'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/store/cartStore'
import { useOrderStore, type ConsumptionMode, type PaymentMethod } from '@/store/orderStore'
import {
  Check,
  ChevronRight,
  Building2,
  ShoppingBag,
  CreditCard,
  Lock,
  MapPin,
  QrCode,
  Loader2,
  ArrowLeft,
} from 'lucide-react'

/* ─── types ─── */
type Step = 'mode' | 'payment' | 'card' | 'done'

const STEP_LABELS = ['Modalidad', 'Pago', 'Confirmación']
const stepIndex: Record<Step, number> = { mode: 0, payment: 1, card: 1, done: 2 }

/* ─── helpers ─── */
function fmtCard(v: string) {
  return v
    .replace(/\D/g, '')
    .slice(0, 16)
    .replace(/(.{4})/g, '$1 ')
    .trim()
}
function fmtExpiry(v: string) {
  const d = v.replace(/\D/g, '').slice(0, 4)
  return d.length > 2 ? `${d.slice(0, 2)}/${d.slice(2)}` : d
}
function genOrderId() {
  return `CAP-${Math.random().toString(36).slice(2, 7).toUpperCase()}`
}

/* ─── Component ─── */
export default function CheckoutPage() {
  const router = useRouter()
  const { items, total, count, clear } = useCart()
  const setOrder = useOrderStore((s) => s.set)

  const [step, setStep] = useState<Step>('mode')
  const [mode, setMode] = useState<ConsumptionMode | null>(null)
  const [payment, setPayment] = useState<PaymentMethod | null>(null)
  const [processing, setProcessing] = useState(false)
  const [qrDataUrl, setQrDataUrl] = useState('')
  const [orderId, setOrderId] = useState('')

  // Card form
  const [cardNum, setCardNum] = useState('')
  const [cardName, setCardName] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvv, setCvv] = useState('')

  // Redirect if cart is empty (and not on done step)
  useEffect(() => {
    if (items.length === 0 && step !== 'done') {
      router.replace('/pedido')
    }
  }, [items, step, router])

  /* ── confirm: handle presencial (salon) ── */
  function handlePresencial() {
    const id = genOrderId()
    setOrderId(id)
    const order = {
      id,
      items: [...items],
      total: total(),
      mode: 'salon' as ConsumptionMode,
      payment: 'presencial' as PaymentMethod,
      createdAt: new Date().toISOString(),
    }
    setOrder(order)
    clear()
    setStep('done')
  }

  /* ── confirm: handle web payment ── */
  async function handleWebPayment() {
    setProcessing(true)

    // Simulate gateway processing
    await new Promise((r) => setTimeout(r, 2200))

    const id = genOrderId()
    setOrderId(id)

    let qrUrl = ''

    // QR only for Takeaway
    if (mode === 'takeaway') {
      try {
        const QRCode = await import('qrcode')
        const payload = JSON.stringify({
          pedido: id,
          items: items.length,
          total: total(),
          modo: 'takeaway',
          expira: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
        })
        qrUrl = await QRCode.toDataURL(payload, {
          width: 280,
          margin: 2,
          color: { dark: '#1e1b18', light: '#fff8f5' },
          errorCorrectionLevel: 'M',
        })
        setQrDataUrl(qrUrl)
      } catch {
        // fallback: no QR
      }
    }

    const order = {
      id,
      items: [...items],
      total: total(),
      mode: mode!,
      payment: 'gateway' as PaymentMethod,
      createdAt: new Date().toISOString(),
      qrDataUrl: qrUrl || undefined,
    }
    setOrder(order)
    clear()
    setProcessing(false)
    setStep('done')
  }

  const cartTotal = total()
  const cartCount = count()

  /* ────────────────────────────── RENDER ────────────────────────────── */
  return (
    <div
      className="min-h-[calc(100vh-4rem)] py-10 px-6"
      style={{ backgroundColor: 'var(--color-surface-container-low)' }}
    >
      <div className="max-w-4xl mx-auto">

        {/* Back link (hidden on done) */}
        {step !== 'done' && (
          <Link
            href="/pedido"
            className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            <ArrowLeft size={15} /> Volver al carrito
          </Link>
        )}

        {/* Progress stepper */}
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
                      style={{
                        color: active
                          ? 'var(--color-on-surface)'
                          : done
                          ? 'var(--color-secondary)'
                          : 'var(--color-on-surface-variant)',
                      }}
                    >
                      {label}
                    </span>
                  </div>
                  {i < STEP_LABELS.length - 1 && (
                    <div
                      className="flex-1 h-px ml-2"
                      style={{
                        backgroundColor: done
                          ? 'var(--color-secondary)'
                          : 'var(--color-outline-variant)',
                      }}
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* ── Main panel ── */}
          <div className="flex-1 min-w-0">

            {/* ════ STEP: MODALIDAD ════ */}
            {step === 'mode' && (
              <div
                className="rounded-2xl p-6 shadow-ambient"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <h2
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--font-newsreader)',
                    fontSize: '1.5rem',
                    fontWeight: 600,
                  }}
                >
                  ¿Cómo vas a consumir?
                </h2>
                <p
                  className="text-sm mb-7"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  Elige la modalidad de consumo para continuar.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Salón */}
                  <button
                    onClick={() => setMode('salon')}
                    className="rounded-2xl p-6 text-left transition-all duration-200 focus:outline-none"
                    style={{
                      border:
                        mode === 'salon'
                          ? '2px solid var(--color-primary)'
                          : '2px solid var(--color-outline-variant)',
                      backgroundColor:
                        mode === 'salon'
                          ? 'var(--color-primary-container)'
                          : 'var(--color-surface-container-low)',
                      boxShadow: mode === 'salon' ? '0 0 0 3px rgba(130,59,24,0.10)' : 'none',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        backgroundColor:
                          mode === 'salon'
                            ? 'var(--color-primary)'
                            : 'var(--color-surface-container-high)',
                        color:
                          mode === 'salon'
                            ? 'var(--color-on-primary)'
                            : 'var(--color-on-surface-variant)',
                      }}
                    >
                      <Building2 size={22} />
                    </div>
                    <p
                      className="font-semibold mb-1"
                      style={{
                        color:
                          mode === 'salon'
                            ? 'var(--color-on-primary-container)'
                            : 'var(--color-on-surface)',
                      }}
                    >
                      Consumir en Salón
                    </p>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: 'var(--color-on-surface-variant)' }}
                    >
                      Disfruta tu pedido en nuestras mesas. Pago en pasarela o en caja.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {['Pasarela web', 'Pago en caja'].map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor: 'var(--color-secondary-container)',
                            color: 'var(--color-on-secondary-container)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>

                  {/* Takeaway */}
                  <button
                    onClick={() => setMode('takeaway')}
                    className="rounded-2xl p-6 text-left transition-all duration-200 focus:outline-none"
                    style={{
                      border:
                        mode === 'takeaway'
                          ? '2px solid var(--color-primary)'
                          : '2px solid var(--color-outline-variant)',
                      backgroundColor:
                        mode === 'takeaway'
                          ? 'var(--color-primary-container)'
                          : 'var(--color-surface-container-low)',
                      boxShadow: mode === 'takeaway' ? '0 0 0 3px rgba(130,59,24,0.10)' : 'none',
                    }}
                  >
                    <div
                      className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                      style={{
                        backgroundColor:
                          mode === 'takeaway'
                            ? 'var(--color-primary)'
                            : 'var(--color-surface-container-high)',
                        color:
                          mode === 'takeaway'
                            ? 'var(--color-on-primary)'
                            : 'var(--color-on-surface-variant)',
                      }}
                    >
                      <ShoppingBag size={22} />
                    </div>
                    <p
                      className="font-semibold mb-1"
                      style={{
                        color:
                          mode === 'takeaway'
                            ? 'var(--color-on-primary-container)'
                            : 'var(--color-on-surface)',
                      }}
                    >
                      Para Recoger
                    </p>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: 'var(--color-on-surface-variant)' }}
                    >
                      Retira tu pedido en el mostrador. Recibirás un código QR para validar la entrega.
                    </p>
                    <div className="mt-4 flex flex-wrap gap-1.5">
                      {['Solo pasarela web', 'Genera QR'].map((tag) => (
                        <span
                          key={tag}
                          className="text-[11px] px-2 py-0.5 rounded-full font-medium"
                          style={{
                            backgroundColor:
                              tag === 'Genera QR'
                                ? 'var(--color-primary-container)'
                                : 'var(--color-secondary-container)',
                            color:
                              tag === 'Genera QR'
                                ? 'var(--color-on-primary-container)'
                                : 'var(--color-on-secondary-container)',
                          }}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </button>
                </div>

                <div className="mt-8 flex justify-end">
                  <button
                    disabled={!mode}
                    onClick={() => setStep('payment')}
                    className="flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold transition-all"
                    style={
                      mode
                        ? {
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-on-primary)',
                          }
                        : {
                            backgroundColor: 'var(--color-surface-container-high)',
                            color: 'var(--color-on-surface-variant)',
                            cursor: 'not-allowed',
                          }
                    }
                  >
                    Continuar <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* ════ STEP: MÉTODO DE PAGO ════ */}
            {step === 'payment' && (
              <div
                className="rounded-2xl p-6 shadow-ambient"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <div className="flex items-center gap-3 mb-1">
                  <button
                    onClick={() => setStep('mode')}
                    className="p-1.5 rounded-full hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <h2
                    style={{
                      fontFamily: 'var(--font-newsreader)',
                      fontSize: '1.5rem',
                      fontWeight: 600,
                    }}
                  >
                    Método de pago
                  </h2>
                </div>

                <p
                  className="text-sm mb-7 pl-9"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  Modalidad:{' '}
                  <strong style={{ color: 'var(--color-on-surface)' }}>
                    {mode === 'salon' ? 'Consumir en Salón' : 'Para Recoger (Takeaway)'}
                  </strong>
                </p>

                <div className="flex flex-col gap-4">
                  {/* Pasarela web */}
                  <button
                    onClick={() => {
                      setPayment('gateway')
                      setStep('card')
                    }}
                    className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-200 group"
                    style={{
                      border: '2px solid var(--color-outline-variant)',
                      backgroundColor: 'var(--color-surface-container-low)',
                    }}
                    onMouseEnter={(e) =>
                      (e.currentTarget.style.borderColor = 'var(--color-primary)')
                    }
                    onMouseLeave={(e) =>
                      (e.currentTarget.style.borderColor = 'var(--color-outline-variant)')
                    }
                  >
                    <div
                      className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: 'var(--color-primary-container)',
                        color: 'var(--color-primary)',
                      }}
                    >
                      <CreditCard size={20} />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-sm mb-0.5">Pasarela de pagos</p>
                      <p
                        className="text-xs"
                        style={{ color: 'var(--color-on-surface-variant)' }}
                      >
                        Tarjeta de crédito o débito — pago seguro en línea
                      </p>
                    </div>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {['visa', 'mc', 'amex'].map((b) => (
                        <div
                          key={b}
                          className="w-9 h-6 rounded flex items-center justify-center text-[9px] font-bold"
                          style={{
                            backgroundColor: 'var(--color-surface-container-high)',
                            color: 'var(--color-on-surface-variant)',
                          }}
                        >
                          {b === 'visa' ? 'VISA' : b === 'mc' ? 'MC' : 'AMEX'}
                        </div>
                      ))}
                    </div>
                  </button>

                  {/* Pago presencial */}
                  {mode === 'salon' ? (
                    <button
                      onClick={() => {
                        setPayment('presencial')
                        handlePresencial()
                      }}
                      className="flex items-center gap-4 p-5 rounded-2xl text-left transition-all duration-200"
                      style={{
                        border: '2px solid var(--color-outline-variant)',
                        backgroundColor: 'var(--color-surface-container-low)',
                      }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.borderColor = 'var(--color-secondary)')
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.borderColor = 'var(--color-outline-variant)')
                      }
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: 'var(--color-secondary-container)',
                          color: 'var(--color-secondary)',
                        }}
                      >
                        <MapPin size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-0.5">Pago presencial en el local</p>
                        <p
                          className="text-xs"
                          style={{ color: 'var(--color-on-surface-variant)' }}
                        >
                          Paga en caja al momento de retirar tu pedido
                        </p>
                      </div>
                    </button>
                  ) : (
                    /* Deshabilitado para Takeaway */
                    <div
                      className="flex items-center gap-4 p-5 rounded-2xl select-none"
                      style={{
                        border: '2px dashed var(--color-outline-variant)',
                        backgroundColor: 'var(--color-surface-container-lowest)',
                        opacity: 0.45,
                        cursor: 'not-allowed',
                      }}
                    >
                      <div
                        className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: 'var(--color-surface-container-high)',
                          color: 'var(--color-on-surface-variant)',
                        }}
                      >
                        <MapPin size={20} />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm mb-0.5 flex items-center gap-2">
                          Pago presencial en el local
                          <span
                            className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
                            style={{
                              backgroundColor: 'var(--color-error-container)',
                              color: 'var(--color-on-error-container)',
                            }}
                          >
                            No disponible para Takeaway
                          </span>
                        </p>
                        <p
                          className="text-xs"
                          style={{ color: 'var(--color-on-surface-variant)' }}
                        >
                          El pago presencial solo aplica para consumo en salón
                        </p>
                      </div>
                    </div>
                  )}
                </div>

                {/* Security note */}
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
              <div
                className="rounded-2xl p-6 shadow-ambient"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <div className="flex items-center gap-3 mb-6">
                  <button
                    onClick={() => setStep('payment')}
                    className="p-1.5 rounded-full hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <h2
                    style={{
                      fontFamily: 'var(--font-newsreader)',
                      fontSize: '1.5rem',
                      fontWeight: 600,
                    }}
                  >
                    Datos de pago
                  </h2>
                </div>

                {/* Card preview */}
                <div
                  className="relative rounded-2xl p-6 mb-8 overflow-hidden"
                  style={{
                    background:
                      'linear-gradient(135deg, var(--color-primary) 0%, #5c2910 100%)',
                    minHeight: 160,
                  }}
                >
                  <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10 -translate-y-1/2 translate-x-1/2"
                    style={{ backgroundColor: 'white' }} />
                  <div className="absolute bottom-0 left-0 w-32 h-32 rounded-full opacity-10 translate-y-1/2 -translate-x-1/2"
                    style={{ backgroundColor: 'white' }} />
                  <p className="text-[10px] uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.60)' }}>
                    Comida al Paso · Pasarela Segura
                  </p>
                  <p
                    className="text-xl font-mono tracking-widest mb-4"
                    style={{ color: cardNum ? 'white' : 'rgba(255,255,255,0.35)' }}
                  >
                    {cardNum
                      ? cardNum.padEnd(19, ' ').replace(/ /g, ' ')
                      : '•••• •••• •••• ••••'}
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

                {/* Form */}
                <div className="flex flex-col gap-4">
                  {/* Card number */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: 'var(--color-on-surface)' }}
                    >
                      Número de tarjeta
                    </label>
                    <input
                      type="text"
                      inputMode="numeric"
                      placeholder="1234 5678 9012 3456"
                      value={cardNum}
                      onChange={(e) => setCardNum(fmtCard(e.target.value))}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono tracking-wider"
                      style={{
                        backgroundColor: 'var(--color-surface-container-low)',
                        color: 'var(--color-on-surface)',
                        border: '1.5px solid var(--color-outline-variant)',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
                    />
                  </div>

                  {/* Cardholder */}
                  <div>
                    <label
                      className="block text-sm font-medium mb-1.5"
                      style={{ color: 'var(--color-on-surface)' }}
                    >
                      Nombre del titular
                    </label>
                    <input
                      type="text"
                      placeholder="Como aparece en la tarjeta"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value.toUpperCase())}
                      className="w-full px-4 py-3 rounded-xl text-sm outline-none uppercase tracking-wide"
                      style={{
                        backgroundColor: 'var(--color-surface-container-low)',
                        color: 'var(--color-on-surface)',
                        border: '1.5px solid var(--color-outline-variant)',
                      }}
                      onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                      onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
                    />
                  </div>

                  {/* Expiry + CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: 'var(--color-on-surface)' }}
                      >
                        Vencimiento
                      </label>
                      <input
                        type="text"
                        inputMode="numeric"
                        placeholder="MM/AA"
                        value={expiry}
                        onChange={(e) => setExpiry(fmtExpiry(e.target.value))}
                        className="w-full px-4 py-3 rounded-xl text-sm outline-none font-mono"
                        style={{
                          backgroundColor: 'var(--color-surface-container-low)',
                          color: 'var(--color-on-surface)',
                          border: '1.5px solid var(--color-outline-variant)',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
                      />
                    </div>
                    <div>
                      <label
                        className="block text-sm font-medium mb-1.5"
                        style={{ color: 'var(--color-on-surface)' }}
                      >
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
                        style={{
                          backgroundColor: 'var(--color-surface-container-low)',
                          color: 'var(--color-on-surface)',
                          border: '1.5px solid var(--color-outline-variant)',
                        }}
                        onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                        onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
                      />
                    </div>
                  </div>

                  {/* Pay button */}
                  <button
                    onClick={handleWebPayment}
                    disabled={processing || cardNum.length < 19 || !cardName || expiry.length < 5 || cvv.length < 3}
                    className="w-full py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 mt-2 transition-opacity"
                    style={
                      processing || cardNum.length < 19 || !cardName || expiry.length < 5 || cvv.length < 3
                        ? {
                            backgroundColor: 'var(--color-surface-container-high)',
                            color: 'var(--color-on-surface-variant)',
                            cursor: 'not-allowed',
                          }
                        : {
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-on-primary)',
                          }
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

                  <p className="text-center text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                    <Lock size={11} className="inline mr-1" />
                    Pago procesado por pasarela segura · TLS 256-bit
                  </p>
                </div>
              </div>
            )}

            {/* ════ STEP: CONFIRMACIÓN ════ */}
            {step === 'done' && (
              <div
                className="rounded-2xl p-8 shadow-ambient text-center"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                {/* Success icon */}
                <div
                  className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{
                    backgroundColor: 'var(--color-secondary-container)',
                    color: 'var(--color-secondary)',
                  }}
                >
                  <Check size={32} />
                </div>

                <h2
                  className="mb-1"
                  style={{
                    fontFamily: 'var(--font-newsreader)',
                    fontSize: '1.75rem',
                    fontWeight: 600,
                  }}
                >
                  {payment === 'presencial'
                    ? '¡Pedido registrado!'
                    : '¡Pago confirmado!'}
                </h2>

                <p
                  className="text-sm mb-2"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  {payment === 'presencial'
                    ? 'Dirígete a la caja para realizar el pago y retirar tu pedido.'
                    : mode === 'takeaway'
                    ? 'Muestra el código QR en el mostrador para retirar tu pedido.'
                    : 'Tu pago fue procesado exitosamente. Espera tu pedido en mesa.'}
                </p>

                {/* Order ID badge */}
                <div
                  className="inline-block px-5 py-2 rounded-full text-sm font-mono font-semibold mt-4 mb-8"
                  style={{
                    backgroundColor: 'var(--color-primary-container)',
                    color: 'var(--color-on-primary-container)',
                  }}
                >
                  Pedido # {orderId}
                </div>

                {/* QR Code — solo para Takeaway + web */}
                {mode === 'takeaway' && payment === 'gateway' && qrDataUrl && (
                  <div className="mb-8">
                    <div
                      className="inline-block p-4 rounded-2xl shadow-ambient"
                      style={{ backgroundColor: 'var(--color-surface-container-low)' }}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={qrDataUrl}
                        alt={`QR Pedido ${orderId}`}
                        width={240}
                        height={240}
                        className="rounded-xl"
                      />
                    </div>
                    <p
                      className="text-xs mt-3"
                      style={{ color: 'var(--color-on-surface-variant)' }}
                    >
                      Válido por 1 hora · Muéstralo al retirar tu pedido
                    </p>
                  </div>
                )}

                {/* Mode info */}
                <div
                  className="rounded-xl p-4 mb-8 text-sm text-left mx-auto max-w-xs"
                  style={{ backgroundColor: 'var(--color-surface-container-low)' }}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                      style={{
                        backgroundColor: 'var(--color-secondary-container)',
                        color: 'var(--color-secondary)',
                      }}
                    >
                      {mode === 'salon' ? <Building2 size={16} /> : <ShoppingBag size={16} />}
                    </div>
                    <div>
                      <p className="font-semibold mb-0.5" style={{ color: 'var(--color-on-surface)' }}>
                        {mode === 'salon' ? 'Consumo en salón' : 'Para recoger (Takeaway)'}
                      </p>
                      <p style={{ color: 'var(--color-on-surface-variant)' }}>
                        {mode === 'salon'
                          ? payment === 'presencial'
                            ? 'Pago: en caja al retirar'
                            : 'Pago: procesado en línea'
                          : 'Pago: procesado en línea'}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link
                    href="/"
                    className="px-7 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-on-primary)',
                    }}
                  >
                    Volver al inicio
                  </Link>
                  <Link
                    href="/menus"
                    className="px-7 py-3 rounded-full text-sm font-medium border-2 hover:bg-[var(--color-surface-container)] transition-colors"
                    style={{
                      borderColor: 'var(--color-outline-variant)',
                      color: 'var(--color-on-surface)',
                    }}
                  >
                    Ver más menús
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* ── Order summary sidebar ── */}
          {step !== 'done' && (
            <aside
              className="lg:w-72 w-full rounded-2xl p-5 shadow-ambient lg:sticky lg:top-24"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <h3
                className="mb-4"
                style={{
                  fontFamily: 'var(--font-newsreader)',
                  fontSize: '1.15rem',
                  fontWeight: 500,
                }}
              >
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
                      <p
                        className="text-xs"
                        style={{ color: 'var(--color-on-surface-variant)' }}
                      >
                        ×{item.quantity}
                      </p>
                    </div>
                    <p
                      className="text-sm font-semibold shrink-0"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      S/{(item.price * item.quantity).toLocaleString('es-PE')}
                    </p>
                  </li>
                ))}
              </ul>

              <div
                className="pt-4"
                style={{ borderTop: '1px solid var(--color-outline-variant)' }}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Subtotal ({cartCount} ítem{cartCount !== 1 ? 's' : ''})
                  </span>
                  <span className="text-sm font-semibold">S/{cartTotal.toLocaleString('es-PE')}</span>
                </div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                    Servicio
                  </span>
                  <span
                    className="text-xs font-medium px-2 py-0.5 rounded-full"
                    style={{
                      backgroundColor: 'var(--color-secondary-container)',
                      color: 'var(--color-on-secondary-container)',
                    }}
                  >
                    Gratis
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total</span>
                  <span
                    className="text-xl font-bold"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    S/{cartTotal.toLocaleString('es-PE')}
                  </span>
                </div>
              </div>

              {mode && (
                <div
                  className="mt-4 pt-4 flex items-center gap-2 text-xs"
                  style={{
                    borderTop: '1px solid var(--color-outline-variant)',
                    color: 'var(--color-on-surface-variant)',
                  }}
                >
                  {mode === 'salon' ? <Building2 size={13} /> : <ShoppingBag size={13} />}
                  <span>
                    {mode === 'salon' ? 'Consumir en salón' : 'Para recoger'}
                  </span>
                </div>
              )}
            </aside>
          )}
        </div>
      </div>
    </div>
  )
}
