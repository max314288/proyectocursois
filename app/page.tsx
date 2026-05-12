import Image from 'next/image'
import Link from 'next/link'
import { menus } from '@/lib/data'

const categories = [
  { label: 'Menús del Día', href: '/menus', img: '/images/menu1.jpg', desc: '5 opciones diarias' },
  { label: 'A la Carta', href: '/carta', img: '/images/alacarta1.jpg', desc: 'Platos individuales' },
  { label: 'Postres', href: '/postres', img: '/images/postre1.jpg', desc: 'Dulce final' },
  { label: 'Arma tu Bowl', href: '/pedido', img: '/images/base1.jpg', desc: 'A tu medida' },
]

const features = [
  {
    icon: '🥗',
    title: 'Ingredientes frescos',
    text: 'Cada día usamos ingredientes de temporada, seleccionados en mercados locales.',
  },
  {
    icon: '⚡',
    title: 'Listo en minutos',
    text: 'Nuestros procesos están diseñados para que no esperes más de 10 minutos.',
  },
  {
    icon: '💛',
    title: 'Sabor casero',
    text: 'Recetas de tradición colombiana adaptadas para el día a día urbano.',
  },
]

export default function InicioPage() {
  const featured = menus.slice(0, 3)

  return (
    <>
      {/* Hero */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/presentacion1.jpg"
          alt="Comida al Paso — Fresco y casero"
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0" style={{ backgroundColor: 'rgba(30,27,24,0.60)' }} />
        <div className="relative z-10 text-center px-6 max-w-3xl mx-auto">
          <p
            className="text-sm uppercase tracking-[0.2em] font-medium mb-4"
            style={{ color: 'var(--color-inverse-primary)' }}
          >
            Fresco · Rápido · Casero
          </p>
          <h1
            className="mb-6"
            style={{
              fontFamily: 'var(--font-newsreader)',
              fontSize: 'clamp(2.5rem, 6vw, 4rem)',
              fontWeight: 600,
              lineHeight: 1.15,
              color: 'var(--color-inverse-on-surface)',
            }}
          >
            Comida al Paso
          </h1>
          <p
            className="text-lg mb-8 max-w-xl mx-auto"
            style={{ color: 'rgba(248,239,234,0.80)' }}
          >
            Sabores de casa, listos en minutos. Menús del día, a la carta y arma tu bowl a tu gusto.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/menus"
              className="px-8 py-3 rounded-full font-semibold transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
            >
              Ver Menús
            </Link>
            <Link
              href="/pedido"
              className="px-8 py-3 rounded-full font-semibold border-2 transition-colors"
              style={{
                borderColor: 'var(--color-inverse-on-surface)',
                color: 'var(--color-inverse-on-surface)',
              }}
            >
              Arma tu Pedido
            </Link>
          </div>
        </div>
      </section>

      {/* Categorías */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <h2
          className="text-center mb-12"
          style={{ fontFamily: 'var(--font-newsreader)', fontSize: '2rem', fontWeight: 600 }}
        >
          Lo que ofrecemos
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((cat) => (
            <Link
              key={cat.href}
              href={cat.href}
              className="group relative aspect-square rounded-2xl overflow-hidden shadow-ambient"
            >
              <Image
                src={cat.img}
                alt={cat.label}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div
                className="absolute inset-0"
                style={{
                  background:
                    'linear-gradient(to top, rgba(30,27,24,0.70) 0%, transparent 60%)',
                }}
              />
              <div className="absolute bottom-0 left-0 p-4">
                <p
                  className="text-lg font-semibold"
                  style={{
                    fontFamily: 'var(--font-newsreader)',
                    color: 'var(--color-inverse-on-surface)',
                  }}
                >
                  {cat.label}
                </p>
                <p className="text-xs" style={{ color: 'rgba(248,239,234,0.70)' }}>
                  {cat.desc}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Menús destacados */}
      <section className="py-20" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
        <div className="max-w-[1280px] mx-auto px-6">
          <div className="flex items-end justify-between mb-10">
            <h2
              style={{ fontFamily: 'var(--font-newsreader)', fontSize: '2rem', fontWeight: 600 }}
            >
              Menús destacados
            </h2>
            <Link
              href="/menus"
              className="text-sm font-medium hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              Ver todos →
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featured.map((menu) => (
              <div
                key={menu.id}
                className="rounded-2xl overflow-hidden shadow-ambient group"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <div className="relative h-52">
                  <Image
                    src={menu.image}
                    alt={menu.name}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <h3
                    className="mb-1"
                    style={{
                      fontFamily: 'var(--font-newsreader)',
                      fontSize: '1.25rem',
                      fontWeight: 500,
                    }}
                  >
                    {menu.name}
                  </h3>
                  <p
                    className="text-sm mb-4 leading-relaxed"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                  >
                    {menu.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span
                      className="text-lg font-bold"
                      style={{ color: 'var(--color-primary)' }}
                    >
                      ${menu.price.toLocaleString('es-CO')}
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
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ¿Por qué elegirnos? */}
      <section className="max-w-[1280px] mx-auto px-6 py-20">
        <h2
          className="text-center mb-12"
          style={{ fontFamily: 'var(--font-newsreader)', fontSize: '2rem', fontWeight: 600 }}
        >
          ¿Por qué elegirnos?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((f) => (
            <div
              key={f.title}
              className="rounded-2xl p-8 text-center"
              style={{ backgroundColor: 'var(--color-surface-container-low)' }}
            >
              <div className="text-4xl mb-4">{f.icon}</div>
              <h3
                className="mb-2"
                style={{
                  fontFamily: 'var(--font-newsreader)',
                  fontSize: '1.25rem',
                  fontWeight: 500,
                }}
              >
                {f.title}
              </h3>
              <p
                className="text-sm leading-relaxed"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                {f.text}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="relative py-28 overflow-hidden">
        <Image
          src="/images/presentacion2.jpg"
          alt="Presentación Comida al Paso"
          fill
          className="object-cover"
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(130,59,24,0.72)' }}
        />
        <div className="relative z-10 text-center px-6 max-w-2xl mx-auto">
          <h2
            className="mb-4"
            style={{
              fontFamily: 'var(--font-newsreader)',
              fontSize: 'clamp(1.75rem, 4vw, 2.5rem)',
              fontWeight: 600,
              color: 'var(--color-on-primary)',
            }}
          >
            ¿Listo para pedir?
          </h2>
          <p className="mb-8" style={{ color: 'rgba(255,255,255,0.80)' }}>
            Arma tu bowl perfecto en 4 pasos o elige uno de nuestros menús del día.
          </p>
          <Link
            href="/pedido"
            className="inline-block px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: 'var(--color-on-primary)',
              color: 'var(--color-primary)',
            }}
          >
            Arma tu Pedido
          </Link>
        </div>
      </section>
    </>
  )
}
