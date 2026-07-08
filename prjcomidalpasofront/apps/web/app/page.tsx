'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useRestauranteStore } from '@/store/restauranteStore'
import { cargarCatalogo, type ItemCartaDTO } from '@/lib/services/catalogoService'
import { formatearPrecioSoles } from '@/lib/services/restauranteService'

const categories = [
  { label: 'Menús del Día', href: '/menus', img: '/images/menu1.jpg', desc: '5 opciones' },
  { label: 'A la Carta', href: '/carta', img: '/images/alacarta1.jpg', desc: 'Platos individuales' },
  { label: 'Postres', href: '/postres', img: '/images/postre1.jpg', desc: 'Dulce final' },
  { label: 'Arma tu Bowl', href: '/pedido', img: '/images/base1.jpg', desc: 'A tu medida' },
]

export default function InicioPage() {
  const restaurante = useRestauranteStore((s) => s.restaurante)
  const [featured, setFeatured] = useState<ItemCartaDTO[]>([])
  const [loading, setLoading] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  useEffect(() => {
    if (!restaurante) return
    let cancel = false
    setLoading(true)
    cargarCatalogo(restaurante.id).then((data) => {
      if (cancel) return
      setLoading(false)
      if (data) setFeatured(data.items.filter((i) => i.disponible).slice(0, 3))
    })
    return () => {
      cancel = true
    }
  }, [restaurante])

  return (
    <>
      {/* ── Hero Split ── */}
      <section className="max-w-[1280px] mx-auto px-6 pt-14 pb-8 md:pt-20 md:pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-16 items-center min-h-[520px]">
          {/* Left: copy */}
          <div>
            <p
              className="text-xs uppercase tracking-[0.22em] font-semibold mb-5"
              style={{ color: 'var(--color-secondary)' }}
            >
              Fresco · Rápido · Casero
            </p>
            <h1
              className="mb-6"
              style={{
                fontFamily: 'var(--font-newsreader)',
                fontSize: 'clamp(2.5rem, 5vw, 3.5rem)',
                fontWeight: 600,
                lineHeight: 1.1,
                letterSpacing: '-0.02em',
                color: 'var(--color-on-surface)',
              }}
            >
              Rapidez sin comprometer la calidad
            </h1>
            <p
              className="text-base leading-relaxed mb-8 max-w-md"
              style={{ color: 'var(--color-on-surface-variant)' }}
            >
              Menús del día, platos a la carta y bowls armados a tu gusto. Todo preparado con ingredientes frescos, listo en minutos.
            </p>
            <div className="flex flex-wrap gap-3">
              {mounted && restaurante ? (
                <>
                  <Link
                    href="/menus"
                    className="px-7 py-3 rounded-full font-semibold text-sm transition-opacity hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
                  >
                    Ver Menú Completo
                  </Link>
                  <Link
                    href="/pedido"
                    className="px-7 py-3 rounded-full font-semibold text-sm border-2 transition-colors hover:bg-[var(--color-surface-container)]"
                    style={{ borderColor: 'var(--color-outline)', color: 'var(--color-on-surface)' }}
                  >
                    Arma tu Pedido
                  </Link>
                </>
              ) : (
                <Link
                  href="/restaurantes"
                  className="px-7 py-3 rounded-full font-semibold text-sm transition-opacity hover:opacity-90"
                  style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
                >
                  Elige tu restaurante
                </Link>
              )}
            </div>

            {/* Stats bar */}
            <div
              className="mt-10 pt-8 grid grid-cols-3 gap-4 text-center"
              style={{ borderTop: '1px solid var(--color-outline-variant)' }}
            >
              {[
                { value: '5', label: 'Menús diarios' },
                { value: '<10min', label: 'Tiempo de espera' },
                { value: '100%', label: 'Ingredientes frescos' },
              ].map((s) => (
                <div key={s.label}>
                  <p
                    className="font-bold text-xl mb-0.5"
                    style={{ fontFamily: 'var(--font-newsreader)', color: 'var(--color-primary)' }}
                  >
                    {s.value}
                  </p>
                  <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right: image panel */}
          <div className="relative h-[420px] md:h-[540px] rounded-3xl overflow-hidden shadow-ambient">
            <Image
              src="/images/presentacion1.jpg"
              alt="Comida al Paso — plato destacado"
              fill
              className="object-cover"
              priority
            />
            <div
              className="absolute bottom-5 left-5 px-4 py-2.5 rounded-2xl backdrop-blur-md"
              style={{ backgroundColor: 'rgba(255,248,245,0.88)' }}
            >
              <p className="text-xs font-semibold" style={{ color: 'var(--color-primary)' }}>
                {mounted && restaurante ? restaurante.nombre : 'Menú del día disponible'}
              </p>
              <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                Lun – Vie · 7 am – 8 pm
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Categorías ── */}
      <section className="py-16" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <h2
            className="mb-8"
            style={{ fontFamily: 'var(--font-newsreader)', fontSize: '1.75rem', fontWeight: 600 }}
          >
            Lo que ofrecemos
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {categories.map((cat) => (
              <Link
                key={cat.href}
                href={cat.href}
                className="group relative rounded-2xl overflow-hidden shadow-ambient transition-transform duration-200 hover:-translate-y-1"
                style={{ aspectRatio: '3/4' }}
              >
                <Image
                  src={cat.img}
                  alt={cat.label}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: 'linear-gradient(to top, rgba(30,27,24,0.75) 0%, transparent 55%)' }}
                />
                <div className="absolute bottom-0 left-0 p-4">
                  <p
                    className="text-base font-semibold leading-tight"
                    style={{ fontFamily: 'var(--font-newsreader)', color: 'var(--color-inverse-on-surface)' }}
                  >
                    {cat.label}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: 'rgba(248,239,234,0.70)' }}>
                    {cat.desc}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Destacados de Hoy / CTA elegir restaurante ── */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        {mounted && !restaurante ? (
          <div
            className="rounded-3xl p-12 text-center"
            style={{ backgroundColor: 'var(--color-surface-container-low)' }}
          >
            <p
              className="text-xs uppercase tracking-[0.2em] font-semibold mb-3"
              style={{ color: 'var(--color-secondary)' }}
            >
              Antes de empezar
            </p>
            <h2
              className="mb-4"
              style={{ fontFamily: 'var(--font-newsreader)', fontSize: '1.75rem', fontWeight: 600 }}
            >
              Elige el restaurante donde quieres pedir
            </h2>
            <p className="mb-8 max-w-md mx-auto text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              Cada restaurante tiene su propia carta. Selecciona uno para ver sus menús, platos y postres.
            </p>
            <Link
              href="/restaurantes"
              className="inline-block px-8 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
            >
              Ver restaurantes
            </Link>
          </div>
        ) : (
          <>
            <div className="flex items-end justify-between mb-10">
              <div>
                <p
                  className="text-xs uppercase tracking-[0.2em] font-semibold mb-2"
                  style={{ color: 'var(--color-secondary)' }}
                >
                  Selección de hoy
                </p>
                <h2 style={{ fontFamily: 'var(--font-newsreader)', fontSize: '1.75rem', fontWeight: 600 }}>
                  Destacados de {restaurante?.nombre}
                </h2>
              </div>
              <Link
                href="/menus"
                className="text-sm font-medium hover:underline underline-offset-2 hidden md:block"
                style={{ color: 'var(--color-primary)' }}
              >
                Ver todos →
              </Link>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="rounded-2xl h-64 animate-pulse"
                    style={{ backgroundColor: 'var(--color-surface-container)' }}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {featured.map((item, i) => (
                  <article
                    key={item.id}
                    className={`rounded-2xl overflow-hidden shadow-ambient group flex flex-col transition-transform duration-200 hover:-translate-y-1 ${
                      i === 0 ? 'md:col-span-2 md:row-span-1' : ''
                    }`}
                    style={{ backgroundColor: 'var(--color-surface)' }}
                  >
                    <div className={`relative overflow-hidden ${i === 0 ? 'h-64' : 'h-44'}`}>
                      <Image
                        src={item.imagenUrl ?? '/images/presentacion1.jpg'}
                        alt={item.nombre}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div
                        className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: 'rgba(255,248,245,0.92)', color: 'var(--color-primary)' }}
                      >
                        {item.categoria}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <h3
                        className="mb-1"
                        style={{
                          fontFamily: 'var(--font-newsreader)',
                          fontSize: i === 0 ? '1.35rem' : '1.15rem',
                          fontWeight: 500,
                        }}
                      >
                        {item.nombre}
                      </h3>
                      <p
                        className="text-sm leading-relaxed flex-1 mb-4"
                        style={{ color: 'var(--color-on-surface-variant)' }}
                      >
                        {item.descripcion}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <span className="font-bold text-lg" style={{ color: 'var(--color-primary)' }}>
                          {formatearPrecioSoles(item.precio)}
                        </span>
                        <Link
                          href="/menus"
                          className="text-sm px-4 py-2 rounded-full font-medium hover:opacity-80 transition-opacity"
                          style={{
                            backgroundColor: 'var(--color-secondary-container)',
                            color: 'var(--color-on-secondary-container)',
                          }}
                        >
                          Ver más
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </>
        )}
      </section>

      {/* ── ¿Por qué elegirnos? ── */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <h2
            className="text-center mb-12"
            style={{ fontFamily: 'var(--font-newsreader)', fontSize: '1.75rem', fontWeight: 600 }}
          >
            ¿Por qué elegirnos?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { icon: '🥗', title: 'Ingredientes frescos', text: 'Cada día usamos ingredientes de temporada, seleccionados en mercados locales.' },
              { icon: '⚡', title: 'Listo en minutos', text: 'Nuestros procesos están diseñados para que no esperes más de 10 minutos.' },
              { icon: '💛', title: 'Sabor casero', text: 'Recetas de tradición colombiana adaptadas para el día a día urbano.' },
            ].map((f) => (
              <div key={f.title} className="rounded-2xl p-8" style={{ backgroundColor: 'var(--color-surface)' }}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3
                  className="mb-2"
                  style={{ fontFamily: 'var(--font-newsreader)', fontSize: '1.2rem', fontWeight: 500 }}
                >
                  {f.title}
                </h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {f.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="max-w-[1280px] mx-auto px-6 py-16">
        <div className="relative rounded-3xl overflow-hidden">
          <Image src="/images/presentacion2.jpg" alt="Presentación" fill className="object-cover" />
          <div className="absolute inset-0" style={{ backgroundColor: 'rgba(130,59,24,0.70)' }} />
          <div className="relative z-10 py-20 px-10 text-center max-w-xl mx-auto">
            <h2
              className="mb-3"
              style={{
                fontFamily: 'var(--font-newsreader)',
                fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
                fontWeight: 600,
                color: 'var(--color-on-primary)',
              }}
            >
              ¿Listo para pedir?
            </h2>
            <p className="mb-8 text-sm" style={{ color: 'rgba(255,255,255,0.80)' }}>
              Arma tu bowl perfecto en 4 pasos o elige uno de nuestros menús del día.
            </p>
            <Link
              href={mounted && restaurante ? '/pedido' : '/restaurantes'}
              className="inline-block px-8 py-3 rounded-full font-semibold text-sm hover:opacity-90 transition-opacity"
              style={{ backgroundColor: 'var(--color-on-primary)', color: 'var(--color-primary)' }}
            >
              {mounted && restaurante ? 'Arma tu Pedido' : 'Elige tu restaurante'}
            </Link>
          </div>
        </div>
      </section>
    </>
  )
}
