'use client'

import Image from 'next/image'
import { useState } from 'react'
import { alaCartaItems } from '@/lib/data'
import { useCart } from '@/store/cartStore'
import { ShoppingBag, Check } from 'lucide-react'

export default function CartaPage() {
  const add = useCart((s) => s.add)
  const [added, setAdded] = useState<string | null>(null)

  function handleAdd(item: (typeof alaCartaItems)[0]) {
    add({ id: item.id, name: item.name, price: item.price, image: item.image, category: 'carta' })
    setAdded(item.id)
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
          Platos individuales
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-newsreader)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 600,
          }}
        >
          A la Carta
        </h1>
        <p
          className="mt-4 max-w-lg mx-auto text-sm leading-relaxed"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          Platos preparados al momento, sin combos ni compromisos. Elige solo lo que quieres.
        </p>
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {alaCartaItems.map((item, idx) => (
          <article
            key={item.id}
            className={`rounded-2xl overflow-hidden shadow-ambient flex group ${
              idx === 0 ? 'md:col-span-2' : ''
            }`}
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div
              className={`relative shrink-0 ${
                idx === 0 ? 'w-1/2 h-64 md:h-72' : 'w-40 h-auto'
              } overflow-hidden`}
            >
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
            </div>
            <div className="p-6 flex flex-col justify-between flex-1">
              <div>
                <h2
                  className="mb-2"
                  style={{
                    fontFamily: 'var(--font-newsreader)',
                    fontSize: idx === 0 ? '1.5rem' : '1.15rem',
                    fontWeight: 500,
                  }}
                >
                  {item.name}
                </h2>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                >
                  {item.description}
                </p>
              </div>
              <div className="flex items-center justify-between mt-6">
                <span
                  className="text-xl font-bold"
                  style={{ color: 'var(--color-primary)' }}
                >
                  S/{item.price.toLocaleString('es-PE')}
                </span>
                <button
                  onClick={() => handleAdd(item)}
                  className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200"
                  style={
                    added === item.id
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
                  {added === item.id ? (
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
    </div>
  )
}
