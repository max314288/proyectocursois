'use client'

import Image from 'next/image'
import { useState } from 'react'
import { menus } from '@/lib/data'
import { useCart } from '@/store/cartStore'
import { filtrarMenus, esMenuDestacado } from '@/lib/services/menuService'
import { ShoppingBag, Check } from 'lucide-react'

const FILTERS = ['Todos', 'Campesino', 'Verde', 'Express', 'Mar', 'Ejecutivo']

export default function MenusPage() {
  const add = useCart((s) => s.add)
  const [added, setAdded] = useState<string | null>(null)
  const [filter, setFilter] = useState('Todos')

  // CONTROLLER delegado a menuService (MVC + SOLID-S)
  const filtered = filtrarMenus(menus, filter)

  function handleAdd(menu: (typeof menus)[0]) {
    add({ id: menu.id, name: menu.name, price: menu.price, image: menu.image, category: 'menu' })
    setAdded(menu.id)
    setTimeout(() => setAdded(null), 1800)
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p
          className="text-xs uppercase tracking-[0.22em] font-semibold mb-3"
          style={{ color: 'var(--color-secondary)' }}
        >
          Cada día diferente
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h1
            style={{
              fontFamily: 'var(--font-newsreader)',
              fontSize: 'clamp(2rem, 5vw, 3rem)',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            Opciones diarias.{' '}
            <span style={{ color: 'var(--color-primary)' }}>Frescura inmediata.</span>
          </h1>
          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            Descubre nuestros menús del día diseñados para ofrecerte la mejor calidad en el menor tiempo.
          </p>
        </div>
      </div>

      {/* Category filters */}
      <div className="flex gap-2 flex-wrap mb-10">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
            style={
              filter === f
                ? {
                    backgroundColor: 'var(--color-primary)',
                    color: 'var(--color-on-primary)',
                  }
                : {
                    backgroundColor: 'var(--color-surface-container)',
                    color: 'var(--color-on-surface-variant)',
                  }
            }
          >
            {f}
          </button>
        ))}
      </div>

      {/* Bento grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((menu, i) => {
          // CONTROLLER delegado a menuService (MVC + SOLID-S)
          const isFeatured = esMenuDestacado(i, filter)
          return (
            <article
              key={menu.id}
              className={`rounded-2xl overflow-hidden shadow-ambient group flex flex-col ${
                isFeatured ? 'md:col-span-2 md:flex-row' : ''
              }`}
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <div
                className={`relative overflow-hidden shrink-0 ${
                  isFeatured
                    ? 'md:w-1/2 h-64 md:h-auto'
                    : 'h-52'
                }`}
              >
                <Image
                  src={menu.image}
                  alt={menu.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {isFeatured && (
                  <div
                    className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-on-primary)',
                    }}
                  >
                    ★ Destacado
                  </div>
                )}
              </div>

              <div className="p-5 flex flex-col flex-1">
                <h2
                  className="mb-1.5"
                  style={{
                    fontFamily: 'var(--font-newsreader)',
                    fontSize: isFeatured ? '1.5rem' : '1.2rem',
                    fontWeight: 500,
                  }}
                >
                  {menu.name}
                </h2>
                <p
                  className="text-sm leading-relaxed flex-1 mb-5"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  {menu.description}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span
                    className="font-bold"
                    style={{
                      fontSize: isFeatured ? '1.4rem' : '1.1rem',
                      color: 'var(--color-primary)',
                    }}
                  >
                    S/{menu.price.toLocaleString('es-PE')}
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
                        <Check size={14} /> Agregado
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={14} /> Agregar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          )
        })}
      </div>

      {/* Info strip */}
      <div
        className="mt-14 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6"
        style={{ backgroundColor: 'var(--color-secondary-container)' }}
      >
        <div className="text-4xl">🍽️</div>
        <div className="flex-1">
          <h3
            className="mb-1"
            style={{
              fontFamily: 'var(--font-newsreader)',
              fontSize: '1.2rem',
              fontWeight: 500,
              color: 'var(--color-on-secondary-container)',
            }}
          >
            ¿Prefieres armar tu propio bowl?
          </h3>
          <p
            className="text-sm"
            style={{ color: 'var(--color-on-secondary-container)', opacity: 0.85 }}
          >
            Elige tu base, proteína, toppings y bebida.{' '}
            <a href="/pedido" className="font-semibold underline underline-offset-2">
              Ir a Arma tu Pedido →
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}
