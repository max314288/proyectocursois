'use client'

import Image from 'next/image'
import { useState } from 'react'
import {
  bases,
  proteinas,
  toppingsItems,
  bebidas,
  BOWL_BASE_PRICE,
  type BuilderItem,
} from '@/lib/data'
import { useCart } from '@/store/cartStore'
import { Minus, Plus, Trash2, ShoppingBag, Check, ChevronRight } from 'lucide-react'

const STEPS = [
  { label: 'Base', items: bases, multi: false },
  { label: 'Proteína', items: proteinas, multi: false },
  { label: 'Toppings', items: toppingsItems, multi: true },
  { label: 'Bebida', items: bebidas, multi: false },
]

interface Selection {
  base: BuilderItem | null
  proteina: BuilderItem | null
  toppings: BuilderItem[]
  bebida: BuilderItem | null
}

function bowlTotal(sel: Selection) {
  const toppingSum = sel.toppings.reduce((s, t) => s + t.price, 0)
  const baseExtra = sel.base?.price ?? 0
  const protPrice = sel.proteina?.price ?? 0
  const bebPrice = sel.bebida?.price ?? 0
  return BOWL_BASE_PRICE + baseExtra + protPrice + toppingSum + bebPrice
}

export default function PedidoPage() {
  const [step, setStep] = useState(0)
  const [sel, setSel] = useState<Selection>({
    base: null,
    proteina: null,
    toppings: [],
    bebida: null,
  })
  const [bowlAdded, setBowlAdded] = useState(false)
  const { items, add, remove, updateQty, total, count, clear } = useCart()

  function selectSingle(key: 'base' | 'proteina' | 'bebida', item: BuilderItem) {
    setSel((prev) => ({ ...prev, [key]: item }))
  }

  function toggleTopping(item: BuilderItem) {
    setSel((prev) => {
      const has = prev.toppings.find((t) => t.id === item.id)
      return {
        ...prev,
        toppings: has
          ? prev.toppings.filter((t) => t.id !== item.id)
          : [...prev.toppings, item],
      }
    })
  }

  function canProceed() {
    if (step === 0) return !!sel.base
    if (step === 1) return !!sel.proteina
    if (step === 2) return true
    if (step === 3) return !!sel.bebida
    return false
  }

  function addBowlToCart() {
    if (!sel.base || !sel.proteina || !sel.bebida) return
    const name = `Bowl: ${sel.base.name} + ${sel.proteina.name}`
    add({
      id: `bowl-${Date.now()}`,
      name,
      price: bowlTotal(sel),
      image: sel.proteina.image,
      category: 'bowl',
    })
    setSel({ base: null, proteina: null, toppings: [], bebida: null })
    setStep(0)
    setBowlAdded(true)
    setTimeout(() => setBowlAdded(false), 2000)
  }

  const currentStep = STEPS[step]

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-16">
      <div className="text-center mb-12">
        <p
          className="text-sm uppercase tracking-[0.2em] font-medium mb-3"
          style={{ color: 'var(--color-secondary)' }}
        >
          Personaliza tu plato
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-newsreader)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 600,
          }}
        >
          Arma tu Pedido
        </h1>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Builder */}
        <div className="flex-1 min-w-0">
          {/* Step progress */}
          <div className="flex items-center gap-2 mb-8">
            {STEPS.map((s, i) => (
              <div key={s.label} className="flex items-center gap-2 flex-1">
                <button
                  onClick={() => i < step && setStep(i)}
                  className="flex items-center gap-2 group"
                >
                  <span
                    className="w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center shrink-0 transition-colors"
                    style={
                      i === step
                        ? {
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-on-primary)',
                          }
                        : i < step
                        ? {
                            backgroundColor: 'var(--color-secondary)',
                            color: 'var(--color-on-secondary)',
                          }
                        : {
                            backgroundColor: 'var(--color-surface-container-high)',
                            color: 'var(--color-on-surface-variant)',
                          }
                    }
                  >
                    {i < step ? <Check size={14} /> : i + 1}
                  </span>
                  <span
                    className="text-sm font-medium hidden sm:block"
                    style={{
                      color:
                        i === step
                          ? 'var(--color-on-surface)'
                          : 'var(--color-on-surface-variant)',
                    }}
                  >
                    {s.label}
                  </span>
                </button>
                {i < STEPS.length - 1 && (
                  <div
                    className="flex-1 h-px"
                    style={{
                      backgroundColor:
                        i < step
                          ? 'var(--color-secondary)'
                          : 'var(--color-outline-variant)',
                    }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step content */}
          <div
            className="rounded-2xl p-6 shadow-ambient"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <h2
              className="mb-1"
              style={{
                fontFamily: 'var(--font-newsreader)',
                fontSize: '1.5rem',
                fontWeight: 500,
              }}
            >
              Paso {step + 1}: Elige tu {currentStep.label}
            </h2>
            {currentStep.multi && (
              <p
                className="text-sm mb-6"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                Puedes elegir uno o varios.
              </p>
            )}
            <div
              className={`grid gap-4 mt-6 ${
                currentStep.items.length <= 3
                  ? 'grid-cols-1 sm:grid-cols-3'
                  : 'grid-cols-2 sm:grid-cols-4'
              }`}
            >
              {currentStep.items.map((item) => {
                const isSelected =
                  step === 0
                    ? sel.base?.id === item.id
                    : step === 1
                    ? sel.proteina?.id === item.id
                    : step === 2
                    ? !!sel.toppings.find((t) => t.id === item.id)
                    : sel.bebida?.id === item.id

                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      if (step === 0) selectSingle('base', item)
                      else if (step === 1) selectSingle('proteina', item)
                      else if (step === 2) toggleTopping(item)
                      else selectSingle('bebida', item)
                    }}
                    className="rounded-xl overflow-hidden text-left transition-all duration-200 focus:outline-none"
                    style={{
                      border: isSelected
                        ? '2px solid var(--color-primary)'
                        : '2px solid var(--color-outline-variant)',
                      boxShadow: isSelected ? '0 0 0 3px rgba(130,59,24,0.12)' : 'none',
                    }}
                  >
                    <div className="relative h-32">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                      {isSelected && (
                        <div
                          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{
                            backgroundColor: 'var(--color-primary)',
                            color: 'var(--color-on-primary)',
                          }}
                        >
                          <Check size={13} />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium leading-tight">{item.name}</p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: 'var(--color-on-surface-variant)' }}
                      >
                        {item.price === 0 ? 'Incluido' : `+$${item.price.toLocaleString('es-CO')}`}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid var(--color-outline-variant)' }}>
              {step > 0 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-sm font-medium px-5 py-2 rounded-full transition-colors"
                  style={{
                    backgroundColor: 'var(--color-surface-container)',
                    color: 'var(--color-on-surface)',
                  }}
                >
                  ← Anterior
                </button>
              ) : (
                <div />
              )}

              {step < STEPS.length - 1 ? (
                <button
                  onClick={() => canProceed() && setStep(step + 1)}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 text-sm font-semibold px-6 py-2 rounded-full transition-all"
                  style={
                    canProceed()
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
                  Siguiente <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  onClick={addBowlToCart}
                  disabled={!canProceed()}
                  className="flex items-center gap-2 text-sm font-semibold px-6 py-2 rounded-full transition-all"
                  style={
                    canProceed()
                      ? {
                          backgroundColor: 'var(--color-secondary)',
                          color: 'var(--color-on-secondary)',
                        }
                      : {
                          backgroundColor: 'var(--color-surface-container-high)',
                          color: 'var(--color-on-surface-variant)',
                          cursor: 'not-allowed',
                        }
                  }
                >
                  {bowlAdded ? (
                    <>
                      <Check size={15} /> ¡Agregado!
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={15} /> Agregar al carrito
                    </>
                  )}
                </button>
              )}
            </div>
          </div>

          {/* Bowl summary preview */}
          {(sel.base || sel.proteina || sel.toppings.length > 0 || sel.bebida) && (
            <div
              className="mt-4 rounded-xl p-4 text-sm"
              style={{ backgroundColor: 'var(--color-surface-container-low)' }}
            >
              <p className="font-medium mb-2" style={{ color: 'var(--color-on-surface)' }}>
                Tu bowl en progreso:
              </p>
              <div className="flex flex-wrap gap-2">
                {sel.base && (
                  <span
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: 'var(--color-primary-container)',
                      color: 'var(--color-on-primary-container)',
                    }}
                  >
                    Base: {sel.base.name}
                  </span>
                )}
                {sel.proteina && (
                  <span
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: 'var(--color-primary-container)',
                      color: 'var(--color-on-primary-container)',
                    }}
                  >
                    {sel.proteina.name}
                  </span>
                )}
                {sel.toppings.map((t) => (
                  <span
                    key={t.id}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: 'var(--color-secondary-container)',
                      color: 'var(--color-on-secondary-container)',
                    }}
                  >
                    {t.name}
                  </span>
                ))}
                {sel.bebida && (
                  <span
                    className="px-3 py-1 rounded-full text-xs"
                    style={{
                      backgroundColor: 'var(--color-surface-container-high)',
                      color: 'var(--color-on-surface)',
                    }}
                  >
                    {sel.bebida.name}
                  </span>
                )}
              </div>
              <p className="mt-3 font-bold" style={{ color: 'var(--color-primary)' }}>
                Subtotal bowl: ${bowlTotal(sel).toLocaleString('es-CO')}
              </p>
            </div>
          )}
        </div>

        {/* Cart sidebar */}
        <aside
          className="lg:w-80 w-full rounded-2xl p-5 shadow-ambient lg:sticky lg:top-24"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <div className="flex items-center justify-between mb-4">
            <h2
              style={{
                fontFamily: 'var(--font-newsreader)',
                fontSize: '1.25rem',
                fontWeight: 500,
              }}
            >
              Tu carrito
            </h2>
            {items.length > 0 && (
              <button
                onClick={clear}
                className="text-xs flex items-center gap-1 hover:opacity-70 transition-opacity"
                style={{ color: 'var(--color-error)' }}
              >
                <Trash2 size={12} /> Vaciar
              </button>
            )}
          </div>

          {items.length === 0 ? (
            <div
              className="text-center py-10 text-sm"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              <ShoppingBag
                size={36}
                className="mx-auto mb-3 opacity-30"
                style={{ color: 'var(--color-on-surface-variant)' }}
              />
              <p>Tu carrito está vacío.</p>
              <p className="mt-1 text-xs">Agrega menús, platos o arma tu bowl.</p>
            </div>
          ) : (
            <>
              <ul className="flex flex-col gap-3 mb-4">
                {items.map((item) => (
                  <li key={item.id} className="flex gap-3 items-start">
                    <div className="relative w-14 h-14 rounded-lg overflow-hidden shrink-0">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium leading-snug truncate">{item.name}</p>
                      <p
                        className="text-xs mt-0.5"
                        style={{ color: 'var(--color-primary)', fontWeight: 600 }}
                      >
                        ${(item.price * item.quantity).toLocaleString('es-CO')}
                      </p>
                      <div className="flex items-center gap-2 mt-1.5">
                        <button
                          onClick={() => updateQty(item.id, item.quantity - 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                          style={{ backgroundColor: 'var(--color-surface-container)' }}
                        >
                          <Minus size={11} />
                        </button>
                        <span className="text-sm font-medium w-4 text-center">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQty(item.id, item.quantity + 1)}
                          className="w-6 h-6 rounded-full flex items-center justify-center transition-colors"
                          style={{ backgroundColor: 'var(--color-surface-container)' }}
                        >
                          <Plus size={11} />
                        </button>
                        <button
                          onClick={() => remove(item.id)}
                          className="ml-auto hover:opacity-70 transition-opacity"
                          style={{ color: 'var(--color-on-surface-variant)' }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <div
                className="pt-4 mt-2"
                style={{ borderTop: '1px solid var(--color-outline-variant)' }}
              >
                <div className="flex justify-between items-center mb-4">
                  <span
                    className="text-sm"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                  >
                    Total ({count()} ítem{count() !== 1 ? 's' : ''})
                  </span>
                  <span
                    className="text-lg font-bold"
                    style={{ color: 'var(--color-primary)' }}
                  >
                    ${total().toLocaleString('es-CO')}
                  </span>
                </div>
                <button
                  className="w-full py-3 rounded-full text-sm font-semibold transition-opacity hover:opacity-90"
                  style={{
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                  }}
                >
                  Proceder al pago
                </button>
              </div>
            </>
          )}
        </aside>
      </div>
    </div>
  )
}
