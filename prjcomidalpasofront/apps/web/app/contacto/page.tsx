import type { Metadata } from 'next'
import { MapPin, Clock, Mail, Phone } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Contacto',
}

const infoItems = [
  {
    icon: MapPin,
    title: 'Ubicación',
    lines: ['Calle 45 #12-34, Chapinero', 'Bogotá, Colombia'],
  },
  {
    icon: Clock,
    title: 'Horario',
    lines: ['Lunes – Viernes: 7:00 am – 8:00 pm', 'Sábados: 8:00 am – 6:00 pm'],
  },
  {
    icon: Mail,
    title: 'Correo',
    lines: ['info@comidaalpaso.co'],
    href: 'mailto:info@comidaalpaso.co',
  },
  {
    icon: Phone,
    title: 'Teléfono',
    lines: ['+57 300 000 0000'],
    href: 'tel:+573000000000',
  },
]

export default function ContactoPage() {
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-16">
      <div className="text-center mb-14">
        <p className="text-sm uppercase tracking-[0.2em] font-medium mb-3" style={{ color: 'var(--color-secondary)' }}>
          Estamos para ti
        </p>
        <h1 style={{ fontFamily: 'var(--font-newsreader)', fontSize: 'clamp(2rem, 5vw, 3rem)', fontWeight: 600 }}>
          Contacto
        </h1>
        <p className="mt-4 max-w-md mx-auto text-sm leading-relaxed" style={{ color: 'var(--color-on-surface-variant)' }}>
          ¿Dudas, sugerencias o un pedido especial? Escríbenos o llámanos directamente.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 max-w-2xl mx-auto">
        {infoItems.map((item) => {
          const Icon = item.icon
          const Wrapper = item.href ? 'a' : 'div'
          return (
            <Wrapper
              key={item.title}
              {...(item.href ? { href: item.href } : {})}
              className="rounded-2xl p-6 shadow-ambient block transition-opacity hover:opacity-90"
              style={{ backgroundColor: 'var(--color-surface)' }}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-primary)' }}
              >
                <Icon size={20} />
              </div>
              <p className="font-medium mb-1 text-sm" style={{ color: 'var(--color-on-surface)' }}>
                {item.title}
              </p>
              {item.lines.map((line) => (
                <p key={line} className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                  {line}
                </p>
              ))}
            </Wrapper>
          )
        })}
      </div>
    </div>
  )
}
