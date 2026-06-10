'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import {
  bases,
  proteinas,
  toppingsItems,
  bebidas,
  type BuilderItem,
} from '@/lib/data'
import { useCart } from '@/store/cartStore'
import {
  calcularPrecioBowl,
  puedeAvanzarPaso,
  toggleTopping as serviceToggleTopping,
  seleccionACartItem,
  obtenerSeleccionActual,
  BOWL_SELECTION_INICIAL,
  type BowlSelection,
} from '@/lib/services/pedidoService'
import { Check, ChevronRight, ShoppingBag } from 'lucide-react'

const STEPS = [
  { label: 'Base', items: bases, multi: false },
  { label: 'Proteína', items: proteinas, multi: false },
  { label: 'Toppings', items: toppingsItems, multi: true },
  { label: 'Bebida', items: bebidas, multi: false },
]

export default function PedidoPage() {
  const [step, setStep] = useState(0)
  // MODEL: estado del bowl, tipo importado del servicio (MVC + SOLID-I)
  const [sel, setSel] = useState<BowlSelection>(BOWL_SELECTION_INICIAL)
  const [bowlAdded, setBowlAdded] = useState(false)

  const { add, count } = useCart()
  const cartCount = count()

  // VIEW helper: actualiza un campo único de la selección (estado local de UI)
  function selectSingle(key: 'base' | 'proteina' | 'bebida', item: BuilderItem) {
    setSel((prev) => ({ ...prev, [key]: item }))
  }

  // CONTROLLER delegado a pedidoService (MVC + SOLID-S)
  function handleToggleTopping(item: BuilderItem) {
    setSel((prev) => ({
      ...prev,
      toppings: serviceToggleTopping(prev.toppings, item),
    }))
  }

  // CONTROLLER delegado a pedidoService (MVC + SOLID-S)
  function addBowlToCart() {
    const cartItem = seleccionACartItem(sel)
    if (!cartItem) return
    add(cartItem)
    setSel(BOWL_SELECTION_INICIAL)
    setStep(0)
    setBowlAdded(true)
    setTimeout(() => setBowlAdded(false), 3000)
  }

  const currentStep = STEPS[step]

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p
            className="text-xs uppercase tracking-[0.22em] font-semibold mb-2"
            style={{ color: 'var(--color-secondary)' }}
          >
            Personaliza tu plato
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-newsreader)',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 600,
            }}
          >
            Arma tu Pedido
          </h1>
        </div>

        {/* Cart shortcut */}
        <Link
          href="/carrito"
          className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors hover:opacity-90"
          style={{
            backgroundColor: 'var(--color-surface-container)',
            color: 'var(--color-on-surface)',
          }}
        >
          <ShoppingBag size={16} />
          Ver carrito
          {cartCount > 0 && (
            <span
              className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
              }}
            >
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* Bowl added toast */}
      {bowlAdded && (
        <div
          className="mb-6 rounded-2xl p-4 flex items-center justify-between"
          style={{ backgroundColor: 'var(--color-secondary-container)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center"
              style={{
                backgroundColor: 'var(--color-secondary)',
                color: 'var(--color-on-secondary)',
              }}
            >
              <Check size={16} />
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-on-secondary-container)' }}>
              ¡Bowl agregado al carrito!
            </p>
          </div>
          <Link
            href="/carrito"
            className="text-sm font-semibold underline underline-offset-2"
            style={{ color: 'var(--color-on-secondary-container)' }}
          >
            Ver carrito →
          </Link>
        </div>
      )}

      {/* Step progress */}
      <div className="flex items-center gap-2 mb-8">
        {STEPS.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2 flex-1">
            <button
              onClick={() => i < step && setStep(i)}
              className="flex items-center gap-2"
            >
              <span
                className="w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center shrink-0 transition-colors"
                style={
                  i === step
                    ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }
                    : i < step
                    ? { backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }
                    : { backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)' }
                }
              >
                {i < step ? <Check size={14} /> : i + 1}
              </span>
              <span
                className="text-sm font-medium hidden sm:block"
                style={{
                  color: i === step ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)',
                }}
              >
                {s.label}
              </span>
            </button>
            {i < STEPS.length - 1 && (
              <div
                className="flex-1 h-px"
                style={{
                  backgroundColor: i < step ? 'var(--color-secondary)' : 'var(--color-outline-variant)',
                }}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step card */}
      <div
        className="rounded-2xl p-6 shadow-ambient"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <h2
          className="mb-1"
          style={{ fontFamily: 'var(--font-newsreader)', fontSize: '1.4rem', fontWeight: 500 }}
        >
          Paso {step + 1}: Elige tu {currentStep.label}
        </h2>
        {currentStep.multi && (
          <p className="text-sm mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
            Puedes elegir uno o varios.
          </p>
        )}

        <div
          className={`grid gap-4 mt-5 ${
            currentStep.items.length <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
          }`}
        >
          {currentStep.items.map((item) => {
            // CONTROLLER delegado a pedidoService (MVC + SOLID-S)
            const isSelected = obtenerSeleccionActual(step, sel, item.id)

            return (
              <button
                key={item.id}
                onClick={() => {
                  if (step === 0) selectSingle('base', item)
                  else if (step === 1) selectSingle('proteina', item)
                  else if (step === 2) handleToggleTopping(item)
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
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
                    >
                      <Check size={13} />
                    </div>
                  )}
                </div>
                <div className="p-3">
                  <p className="text-sm font-medium leading-tight">{item.name}</p>
                  <p className="text-xs mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {item.price === 0 ? 'Incluido' : `+S/${item.price.toLocaleString('es-PE')}`}
                  </p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Nav buttons */}
        <div
          className="flex items-center justify-between mt-8 pt-6"
          style={{ borderTop: '1px solid var(--color-outline-variant)' }}
        >
          {step > 0 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="text-sm font-medium px-5 py-2 rounded-full transition-colors"
              style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}
            >
              ← Anterior
            </button>
          ) : (
            <div />
          )}

          {step < STEPS.length - 1 ? (
            <button
              onClick={() => puedeAvanzarPaso(step, sel) && setStep(step + 1)}
              disabled={!puedeAvanzarPaso(step, sel)}
              className="flex items-center gap-2 text-sm font-semibold px-6 py-2 rounded-full transition-all"
              style={
                puedeAvanzarPaso(step, sel)
                  ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }
                  : { backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)', cursor: 'not-allowed' }
              }
            >
              Siguiente <ChevronRight size={15} />
            </button>
          ) : (
            <button
              onClick={addBowlToCart}
              disabled={!puedeAvanzarPaso(step, sel)}
              className="flex items-center gap-2 text-sm font-semibold px-6 py-2 rounded-full transition-all"
              style={
                puedeAvanzarPaso(step, sel)
                  ? { backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }
                  : { backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)', cursor: 'not-allowed' }
              }
            >
              <ShoppingBag size={15} /> Agregar al carrito
            </button>
          )}
        </div>
      </div>

      {/* Bowl in-progress summary */}
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
                style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
              >
                Base: {sel.base.name}
              </span>
            )}
            {sel.proteina && (
              <span
                className="px-3 py-1 rounded-full text-xs"
                style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
              >
                {sel.proteina.name}
              </span>
            )}
            {sel.toppings.map((t) => (
              <span
                key={t.id}
                className="px-3 py-1 rounded-full text-xs"
                style={{ backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' }}
              >
                {t.name}
              </span>
            ))}
            {sel.bebida && (
              <span
                className="px-3 py-1 rounded-full text-xs"
                style={{ backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface)' }}
              >
                {sel.bebida.name}
              </span>
            )}
          </div>
          <p className="mt-3 font-bold" style={{ color: 'var(--color-primary)' }}>
            Precio bowl: S/{calcularPrecioBowl(sel).toLocaleString('es-PE')}
          </p>
        </div>
      )}
    </div>
  )
}
