'use client'

import Image from 'next/image'
import { useState } from 'react'
import { menus } from '@/lib/data'
import { useCart } from '@/store/cartStore'
import { ShoppingBag, Check } from 'lucide-react'
import type { Metadata } from 'next'

export default function MenusPage() {
  const add = useCart((s) => s.add)
  const [added, setAdded] = useState<string | null>(null)

  function handleAdd(menu: (typeof menus)[0]) {
    add({ id: menu.id, name: menu.name, price: menu.price, image: menu.image, category: 'menu' })
    setAdded(menu.id)
    setTimeout(() => setAdded(null), 1800)
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <p
          className="text-sm uppercase tracking-[0.2em] font-medium mb-3"
          style={{ color: 'var(--color-secondary)' }}
        >
          Cada día diferente
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-newsreader)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 600,
            color: 'var(--color-on-surface)',
          }}
        >
          Menús del Día
        </h1>
        <p
          className="mt-4 max-w-lg mx-auto text-sm leading-relaxed"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          Cinco opciones preparadas a diario con ingredientes frescos. Incluyen plato fuerte,
          acompañamiento y bebida.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {menus.map((menu) => (
          <article
            key={menu.id}
            className="rounded-2xl overflow-hidden shadow-ambient group flex flex-col"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div className="relative h-56 overflow-hidden">
              <Image
                src={menu.image}
                alt={menu.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h2
                className="mb-1"
                style={{
                  fontFamily: 'var(--font-newsreader)',
                  fontSize: '1.25rem',
                  fontWeight: 500,
                }}
              >
                {menu.name}
              </h2>
              <p
                className="text-sm leading-relaxed flex-1 mb-4"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                {menu.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span
                  className="text-xl font-bold"
                  style={{ color: 'var(--color-primary)' }}
                >
                  ${menu.price.toLocaleString('es-CO')}
                </span>
                <button
                  onClick={() => handleAdd(menu)}
                  className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                  style={
                    added === menu.id
                      ? {
                          backgroundColor: 'var(--color-secondary)',
                          color: 'var(--color-on-secondary)',
                        }
                      : {
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--color-on-primary)',
                        }
                  }
                >
                  {added === menu.id ? (
                    <>
                      <Check size={15} />
                      Agregado
                    </>
                  ) : (
                    <>
                      <ShoppingBag size={15} />
                      Agregar
                    </>
                  )}
                </button>
              </div>
            </div>
          </article>
        ))}
      </div>

      {/* Info banner */}
      <div
        className="mt-16 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6 text-center md:text-left"
        style={{ backgroundColor: 'var(--color-secondary-container)' }}
      >
        <div className="text-5xl">🍽️</div>
        <div>
          <h3
            className="mb-1"
            style={{
              fontFamily: 'var(--font-newsreader)',
              fontSize: '1.25rem',
              fontWeight: 500,
              color: 'var(--color-on-secondary-container)',
            }}
          >
            ¿Prefieres armar tu propio bowl?
          </h3>
          <p
            className="text-sm"
            style={{ color: 'var(--color-on-secondary-container)', opacity: 0.8 }}
          >
            Elige tu base, proteína, toppings y bebida en nuestra sección{' '}
            <a href="/pedido" className="font-semibold underline underline-offset-2">
              Arma tu Pedido
            </a>
            .
          </p>
        </div>
      </div>
    </div>
  )
}
