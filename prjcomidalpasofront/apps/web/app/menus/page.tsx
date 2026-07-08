'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCart } from '@/store/cartStore'
import { useRestauranteStore } from '@/store/restauranteStore'
import { cargarCatalogo, itemsPorCategoriaCodigo, type ItemCartaDTO } from '@/lib/services/catalogoService'
import { itemACartItem, formatearPrecioSoles } from '@/lib/services/restauranteService'
import { ShoppingBag, Check, RefreshCw } from 'lucide-react'

export default function MenusPage() {
  const add = useCart((s) => s.add)
  const restaurante = useRestauranteStore((s) => s.restaurante)
  const [mounted, setMounted] = useState(false)
  const [items, setItems] = useState<ItemCartaDTO[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [added, setAdded] = useState<string | null>(null)

  useEffect(() => setMounted(true), [])

  async function cargar() {
    if (!restaurante) return
    setLoading(true)
    setError(false)
    const data = await cargarCatalogo(restaurante.id)
    setLoading(false)
    if (!data) {
      setError(true)
      return
    }
    setItems(itemsPorCategoriaCodigo(data, 'menu'))
  }

  useEffect(() => {
    if (restaurante) cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurante])

  function handleAdd(item: ItemCartaDTO) {
    if (!restaurante) return
    add(itemACartItem(item, restaurante.id))
    setAdded(item.id)
    setTimeout(() => setAdded(null), 1800)
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p className="text-xs uppercase tracking-[0.22em] font-semibold mb-3" style={{ color: 'var(--color-secondary)' }}>
          Cada día diferente
        </p>
        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <h1 style={{ fontFamily: 'var(--font-newsreader)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 600, letterSpacing: '-0.01em' }}>
            Opciones diarias.{' '}
            <span style={{ color: 'var(--color-primary)' }}>Frescura inmediata.</span>
          </h1>
          <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
            {mounted && restaurante ? `Menús del día de ${restaurante.nombre}.` : 'Elige un restaurante para ver sus menús del día.'}
          </p>
        </div>
      </div>

      {mounted && !restaurante && (
        <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: 'var(--color-surface-container)' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
            Aún no has elegido un restaurante.
          </p>
          <Link
            href="/restaurantes"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
          >
            Ver restaurantes
          </Link>
        </div>
      )}

      {restaurante && loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl h-72 animate-pulse" style={{ backgroundColor: 'var(--color-surface-container)' }} />
          ))}
        </div>
      )}

      {restaurante && !loading && error && (
        <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: 'var(--color-surface-container)' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
            No pudimos cargar los menús.
          </p>
          <button
            onClick={cargar}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      )}

      {restaurante && !loading && !error && items.length === 0 && (
        <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: 'var(--color-surface-container)' }}>
          <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            Este restaurante no tiene menús del día por ahora.
          </p>
        </div>
      )}

      {restaurante && !loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {items.map((item, i) => {
            const isFeatured = i === 0
            return (
              <article
                key={item.id}
                className={`rounded-2xl overflow-hidden shadow-ambient group flex flex-col ${
                  isFeatured ? 'md:col-span-2 md:flex-row' : ''
                } ${!item.disponible ? 'opacity-60' : ''}`}
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <div className={`relative overflow-hidden shrink-0 ${isFeatured ? 'md:w-1/2 h-64 md:h-auto' : 'h-52'}`}>
                  <Image
                    src={item.imagenUrl ?? '/images/menu1.jpg'}
                    alt={item.nombre}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {isFeatured && (
                    <div
                      className="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-semibold"
                      style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
                    >
                      ★ Destacado
                    </div>
                  )}
                </div>

                <div className="p-5 flex flex-col flex-1">
                  <h2
                    className="mb-1.5"
                    style={{ fontFamily: 'var(--font-newsreader)', fontSize: isFeatured ? '1.5rem' : '1.2rem', fontWeight: 500 }}
                  >
                    {item.nombre}
                  </h2>
                  <p className="text-sm leading-relaxed flex-1 mb-5" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {item.descripcion}
                  </p>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-bold" style={{ fontSize: isFeatured ? '1.4rem' : '1.1rem', color: 'var(--color-primary)' }}>
                      {formatearPrecioSoles(item.precio)}
                    </span>
                    <button
                      onClick={() => handleAdd(item)}
                      disabled={!item.disponible}
                      className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                      style={
                        !item.disponible
                          ? { backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface-variant)' }
                          : added === item.id
                          ? { backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }
                          : { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }
                      }
                    >
                      {!item.disponible ? (
                        'No disponible'
                      ) : added === item.id ? (
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
      )}

      {/* Info strip */}
      <div
        className="mt-14 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-6"
        style={{ backgroundColor: 'var(--color-secondary-container)' }}
      >
        <div className="text-4xl">🍽️</div>
        <div className="flex-1">
          <h3
            className="mb-1"
            style={{ fontFamily: 'var(--font-newsreader)', fontSize: '1.2rem', fontWeight: 500, color: 'var(--color-on-secondary-container)' }}
          >
            ¿Prefieres armar tu propio bowl?
          </h3>
          <p className="text-sm" style={{ color: 'var(--color-on-secondary-container)', opacity: 0.85 }}>
            Elige tu base, proteína, toppings y bebida.{' '}
            <Link href="/pedido" className="font-semibold underline underline-offset-2">
              Ir a Arma tu Pedido →
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
