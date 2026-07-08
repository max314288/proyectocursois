'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useCart } from '@/store/cartStore'
import { useRestauranteStore } from '@/store/restauranteStore'
import { cargarCatalogo, itemsPorCategoriaCodigo, type ItemCartaDTO } from '@/lib/services/catalogoService'
import { itemACartItem, formatearPrecioSoles } from '@/lib/services/restauranteService'
import { ShoppingBag, Check, RefreshCw } from 'lucide-react'

export default function PostresPage() {
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
    setItems(itemsPorCategoriaCodigo(data, 'postres'))
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
      <div className="text-center mb-14">
        <p className="text-sm uppercase tracking-[0.2em] font-medium mb-3" style={{ color: 'var(--color-secondary)' }}>
          El final perfecto
        </p>
        <h1 style={{ fontFamily: 'var(--font-newsreader)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 600 }}>
          Postres
        </h1>
        <p className="mt-4 max-w-lg mx-auto text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
          {mounted && restaurante
            ? `Hechos en casa por ${restaurante.nombre}. El dulce cierre que mereces.`
            : 'Elige un restaurante para ver sus postres.'}
        </p>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl h-72 animate-pulse" style={{ backgroundColor: 'var(--color-surface-container)' }} />
          ))}
        </div>
      )}

      {restaurante && !loading && error && (
        <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: 'var(--color-surface-container)' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
            No pudimos cargar los postres.
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
            Este restaurante no tiene postres por ahora.
          </p>
        </div>
      )}

      {restaurante && !loading && !error && items.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <article
              key={item.id}
              className={`rounded-2xl overflow-hidden shadow-ambient group flex flex-col ${!item.disponible ? 'opacity-60' : ''}`}
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <div className="relative h-52 overflow-hidden">
                <Image
                  src={item.imagenUrl ?? '/images/postre1.jpg'}
                  alt={item.nombre}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-5 flex flex-col flex-1">
                <h2 className="mb-1" style={{ fontFamily: 'var(--font-newsreader)', fontSize: '1.2rem', fontWeight: 500 }}>
                  {item.nombre}
                </h2>
                <p className="text-sm leading-relaxed flex-1 mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {item.descripcion}
                </p>
                <div className="flex items-center justify-between mt-auto">
                  <span className="text-lg font-bold" style={{ color: 'var(--color-primary)' }}>
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
                        <Check size={15} /> Agregado
                      </>
                    ) : (
                      <>
                        <ShoppingBag size={15} /> Agregar
                      </>
                    )}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {/* Decorative quote */}
      <blockquote
        className="mt-20 text-center max-w-xl mx-auto"
        style={{ fontFamily: 'var(--font-newsreader)', fontSize: '1.5rem', fontStyle: 'italic', color: 'var(--color-on-surface-variant)' }}
      >
        &ldquo;La vida es incierta. Come el postre primero.&rdquo;
      </blockquote>
    </div>
  )
}
