'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import { MapPin, Phone, ShoppingBag, Bike, UtensilsCrossed, RefreshCw } from 'lucide-react'
import { cargarRestaurantes, getServicios } from '@/lib/services/restauranteService'
import type { RestauranteDTO } from '@/lib/services/restauranteApiService'

const SERVICIO_ICONS = {
  Recojo: ShoppingBag,
  Delivery: Bike,
  'Salón': UtensilsCrossed,
} as const

export default function RestaurantesPage() {
  const [restaurantes, setRestaurantes] = useState<RestauranteDTO[] | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  async function cargar() {
    setLoading(true)
    setError(false)
    const data = await cargarRestaurantes()
    setLoading(false)
    if (data === null) {
      setError(true)
    } else {
      setRestaurantes(data)
    }
  }

  useEffect(() => {
    cargar()
  }, [])

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-16">
      {/* Header */}
      <div className="mb-12">
        <p
          className="text-xs uppercase tracking-[0.22em] font-semibold mb-3"
          style={{ color: 'var(--color-secondary)' }}
        >
          Elige dónde comer hoy
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
            Nuestros restaurantes.{' '}
            <span style={{ color: 'var(--color-primary)' }}>A tu alcance.</span>
          </h1>
          <p
            className="text-sm leading-relaxed max-w-xs"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            Selecciona un restaurante para explorar su carta y hacer tu pedido.
          </p>
        </div>
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl h-48 animate-pulse"
              style={{ backgroundColor: 'var(--color-surface-container)' }}
            />
          ))}
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          className="rounded-2xl p-10 text-center"
          style={{ backgroundColor: 'var(--color-surface-container)' }}
        >
          <p className="text-sm mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
            No pudimos cargar los restaurantes. Verifica tu conexión.
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

      {/* Empty */}
      {!loading && !error && restaurantes !== null && restaurantes.length === 0 && (
        <div
          className="rounded-2xl p-10 text-center"
          style={{ backgroundColor: 'var(--color-surface-container)' }}
        >
          <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            No hay restaurantes disponibles por el momento.
          </p>
        </div>
      )}

      {/* Grid */}
      {!loading && !error && restaurantes !== null && restaurantes.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {restaurantes.map((r) => (
            <Link
              key={r.id}
              href={`/restaurantes/${r.id}`}
              className="rounded-2xl p-6 shadow-ambient group flex flex-col gap-3 transition-transform duration-200 hover:-translate-y-1"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <h2
                className="group-hover:underline underline-offset-4"
                style={{
                  fontFamily: 'var(--font-newsreader)',
                  fontSize: '1.4rem',
                  fontWeight: 500,
                  color: 'var(--color-on-surface)',
                }}
              >
                {r.nombre}
              </h2>

              <div className="flex items-start gap-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                <MapPin size={15} className="shrink-0 mt-0.5" />
                {r.direccion}
              </div>

              {r.telefono && (
                <div className="flex items-center gap-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  <Phone size={15} className="shrink-0" />
                  {r.telefono}
                </div>
              )}

              <div className="flex gap-2 flex-wrap mt-auto pt-3">
                {getServicios(r).map((s) => {
                  const Icon = SERVICIO_ICONS[s as keyof typeof SERVICIO_ICONS]
                  return (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--color-secondary-container)',
                        color: 'var(--color-on-secondary-container)',
                      }}
                    >
                      {Icon && <Icon size={12} />}
                      {s}
                    </span>
                  )
                })}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
