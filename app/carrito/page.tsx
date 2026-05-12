'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useCart } from '@/store/cartStore'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'

const CATEGORY_LABEL: Record<string, string> = {
  menu: 'Menú del día',
  carta: 'A la carta',
  postre: 'Postre',
  bowl: 'Bowl armado',
}

export default function CarritoPage() {
  const { items, remove, updateQty, total, count, clear } = useCart()
  const cartTotal = total()
  const cartCount = count()

  if (items.length === 0) {
    return (
      <div className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-6 text-center">
        <div
          className="w-20 h-20 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: 'var(--color-surface-container)' }}
        >
          <ShoppingBag size={36} style={{ color: 'var(--color-on-surface-variant)' }} />
        </div>
        <h1
          className="mb-2"
          style={{
            fontFamily: 'var(--font-newsreader)',
            fontSize: '1.75rem',
            fontWeight: 600,
          }}
        >
          Tu carrito está vacío
        </h1>
        <p className="text-sm mb-8 max-w-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
          Agrega menús, platos a la carta, postres o arma tu bowl personalizado.
        </p>
        <div className="flex flex-wrap gap-3 justify-center">
          <Link
            href="/menus"
            className="px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
          >
            Ver Menús
          </Link>
          <Link
            href="/pedido"
            className="px-6 py-2.5 rounded-full text-sm font-medium border-2 hover:bg-surface-container transition-colors"
            style={{ borderColor: 'var(--color-outline-variant)', color: 'var(--color-on-surface)' }}
          >
            Armar un Bowl
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-14">
      {/* Header */}
      <div className="flex items-end justify-between mb-10">
        <div>
          <p
            className="text-xs uppercase tracking-[0.2em] font-semibold mb-2"
            style={{ color: 'var(--color-secondary)' }}
          >
            {cartCount} ítem{cartCount !== 1 ? 's' : ''}
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-newsreader)',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 600,
            }}
          >
            Tu Carrito
          </h1>
        </div>
        <button
          onClick={clear}
          className="text-sm flex items-center gap-1.5 hover:opacity-70 transition-opacity"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          <Trash2 size={14} /> Vaciar carrito
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-start">

        {/* Items list */}
        <div className="flex-1 min-w-0 flex flex-col gap-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="flex gap-4 items-center rounded-2xl p-4 shadow-ambient"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              {/* Image */}
              <div className="relative w-20 h-20 rounded-xl overflow-hidden shrink-0">
                <Image src={item.image} alt={item.name} fill className="object-cover" />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <span
                  className="text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: 'var(--color-secondary)' }}
                >
                  {CATEGORY_LABEL[item.category] ?? item.category}
                </span>
                <p
                  className="font-medium leading-snug mt-0.5 truncate"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  {item.name}
                </p>
                <p
                  className="text-sm font-bold mt-1"
                  style={{ color: 'var(--color-primary)' }}
                >
                  S/{(item.price * item.quantity).toLocaleString('es-PE')}
                </p>
              </div>

              {/* Qty controls */}
              <div className="flex items-center gap-2 shrink-0">
                <button
                  onClick={() => updateQty(item.id, item.quantity - 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-70"
                  style={{ backgroundColor: 'var(--color-surface-container)' }}
                >
                  <Minus size={13} />
                </button>
                <span className="text-sm font-semibold w-5 text-center">{item.quantity}</span>
                <button
                  onClick={() => updateQty(item.id, item.quantity + 1)}
                  className="w-8 h-8 rounded-full flex items-center justify-center transition-colors hover:opacity-70"
                  style={{ backgroundColor: 'var(--color-surface-container)' }}
                >
                  <Plus size={13} />
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => remove(item.id)}
                className="p-2 rounded-full hover:opacity-70 transition-opacity shrink-0"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}

          {/* Seguir comprando */}
          <div className="flex flex-wrap gap-3 mt-2">
            <Link
              href="/menus"
              className="text-sm font-medium hover:underline underline-offset-2"
              style={{ color: 'var(--color-primary)' }}
            >
              + Agregar más menús
            </Link>
            <span style={{ color: 'var(--color-outline-variant)' }}>·</span>
            <Link
              href="/carta"
              className="text-sm font-medium hover:underline underline-offset-2"
              style={{ color: 'var(--color-primary)' }}
            >
              + A la carta
            </Link>
            <span style={{ color: 'var(--color-outline-variant)' }}>·</span>
            <Link
              href="/pedido"
              className="text-sm font-medium hover:underline underline-offset-2"
              style={{ color: 'var(--color-primary)' }}
            >
              + Armar bowl
            </Link>
          </div>
        </div>

        {/* Order summary */}
        <aside
          className="lg:w-80 w-full rounded-2xl p-6 shadow-ambient lg:sticky lg:top-24"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <h2
            className="mb-5"
            style={{
              fontFamily: 'var(--font-newsreader)',
              fontSize: '1.25rem',
              fontWeight: 500,
            }}
          >
            Resumen
          </h2>

          {/* Line items summary */}
          <div className="flex flex-col gap-2 mb-4">
            {items.map((item) => (
              <div key={item.id} className="flex justify-between text-sm">
                <span
                  className="truncate max-w-[160px]"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  {item.name} ×{item.quantity}
                </span>
                <span className="font-medium">
                  S/{(item.price * item.quantity).toLocaleString('es-PE')}
                </span>
              </div>
            ))}
          </div>

          <div
            className="pt-4 mb-5"
            style={{ borderTop: '1px solid var(--color-outline-variant)' }}
          >
            <div className="flex justify-between items-center mb-2 text-sm">
              <span style={{ color: 'var(--color-on-surface-variant)' }}>Servicio</span>
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
                className="text-2xl font-bold"
                style={{ color: 'var(--color-primary)' }}
              >
                S/{cartTotal.toLocaleString('es-PE')}
              </span>
            </div>
          </div>

          <Link
            href="/checkout"
            className="w-full py-3.5 rounded-full text-sm font-semibold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
          >
            Ir al Checkout <ArrowRight size={16} />
          </Link>

          <p
            className="text-center text-xs mt-4"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            Elige modalidad y método de pago en el siguiente paso
          </p>
        </aside>
      </div>
    </div>
  )
}
