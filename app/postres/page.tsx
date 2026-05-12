'use client'

import Image from 'next/image'
import { useState } from 'react'
import { postresItems } from '@/lib/data'
import { useCart } from '@/store/cartStore'
import { ShoppingBag, Check } from 'lucide-react'

export default function PostresPage() {
  const add = useCart((s) => s.add)
  const [added, setAdded] = useState<string | null>(null)

  function handleAdd(item: (typeof postresItems)[0]) {
    add({ id: item.id, name: item.name, price: item.price, image: item.image, category: 'postre' })
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
          El final perfecto
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-newsreader)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 600,
          }}
        >
          Postres
        </h1>
        <p
          className="mt-4 max-w-lg mx-auto text-sm leading-relaxed"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          Hechos en casa, con cariño y los mejores ingredientes. El dulce cierre que mereces.
        </p>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {postresItems.map((item) => (
          <article
            key={item.id}
            className="rounded-2xl overflow-hidden shadow-ambient group flex flex-col"
            style={{ backgroundColor: 'var(--color-surface)' }}
          >
            <div className="relative h-52 overflow-hidden">
              <Image
                src={item.image}
                alt={item.name}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center"
                style={{ backgroundColor: 'rgba(130,59,24,0.15)' }}
              />
            </div>
            <div className="p-5 flex flex-col flex-1">
              <h2
                className="mb-1"
                style={{
                  fontFamily: 'var(--font-newsreader)',
                  fontSize: '1.2rem',
                  fontWeight: 500,
                }}
              >
                {item.name}
              </h2>
              <p
                className="text-sm leading-relaxed flex-1 mb-4"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                {item.description}
              </p>
              <div className="flex items-center justify-between mt-auto">
                <span
                  className="text-lg font-bold"
                  style={{ color: 'var(--color-primary)' }}
                >
                  ${item.price.toLocaleString('es-CO')}
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

      {/* Decorative quote */}
      <blockquote
        className="mt-20 text-center max-w-xl mx-auto"
        style={{
          fontFamily: 'var(--font-newsreader)',
          fontSize: '1.5rem',
          fontStyle: 'italic',
          color: 'var(--color-on-surface-variant)',
        }}
      >
        "La vida es incierta. Come el postre primero."
      </blockquote>
    </div>
  )
}
