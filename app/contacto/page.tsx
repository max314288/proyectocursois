'use client'

import { useState } from 'react'
import { MapPin, Clock, Mail, Phone, Send, Check } from 'lucide-react'

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
  },
  {
    icon: Phone,
    title: 'Teléfono',
    lines: ['+57 300 000 0000'],
  },
]

export default function ContactoPage() {
  const [sent, setSent] = useState(false)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSent(true)
    setTimeout(() => setSent(false), 3000)
  }

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-16">
      {/* Header */}
      <div className="text-center mb-14">
        <p
          className="text-sm uppercase tracking-[0.2em] font-medium mb-3"
          style={{ color: 'var(--color-secondary)' }}
        >
          Estamos para ti
        </p>
        <h1
          style={{
            fontFamily: 'var(--font-newsreader)',
            fontSize: 'clamp(2rem, 5vw, 3rem)',
            fontWeight: 600,
          }}
        >
          Contacto
        </h1>
        <p
          className="mt-4 max-w-md mx-auto text-sm leading-relaxed"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          Tienes dudas, sugerencias o quieres hacer un pedido especial. Escríbenos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
        {/* Info */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {infoItems.map((item) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="rounded-2xl p-6 shadow-ambient"
                style={{ backgroundColor: 'var(--color-surface)' }}
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{
                    backgroundColor: 'var(--color-primary-container)',
                    color: 'var(--color-primary)',
                  }}
                >
                  <Icon size={20} />
                </div>
                <p
                  className="font-medium mb-1 text-sm"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  {item.title}
                </p>
                {item.lines.map((line) => (
                  <p
                    key={line}
                    className="text-sm"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                  >
                    {line}
                  </p>
                ))}
              </div>
            )
          })}
        </div>

        {/* Form */}
        <div
          className="rounded-2xl p-8 shadow-ambient"
          style={{ backgroundColor: 'var(--color-surface)' }}
        >
          <h2
            className="mb-6"
            style={{
              fontFamily: 'var(--font-newsreader)',
              fontSize: '1.5rem',
              fontWeight: 500,
            }}
          >
            Envíanos un mensaje
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  Nombre
                </label>
                <input
                  type="text"
                  placeholder="Tu nombre"
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--color-surface-container-low)',
                    color: 'var(--color-on-surface)',
                    border: '1.5px solid var(--color-outline-variant)',
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = 'var(--color-primary)')
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = 'var(--color-outline-variant)')
                  }
                />
              </div>
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  Correo
                </label>
                <input
                  type="email"
                  placeholder="tu@correo.com"
                  required
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                  style={{
                    backgroundColor: 'var(--color-surface-container-low)',
                    color: 'var(--color-on-surface)',
                    border: '1.5px solid var(--color-outline-variant)',
                  }}
                  onFocus={(e) =>
                    (e.target.style.borderColor = 'var(--color-primary)')
                  }
                  onBlur={(e) =>
                    (e.target.style.borderColor = 'var(--color-outline-variant)')
                  }
                />
              </div>
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-on-surface)' }}
              >
                Asunto
              </label>
              <input
                type="text"
                placeholder="¿En qué podemos ayudarte?"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none"
                style={{
                  backgroundColor: 'var(--color-surface-container-low)',
                  color: 'var(--color-on-surface)',
                  border: '1.5px solid var(--color-outline-variant)',
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = 'var(--color-primary)')
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = 'var(--color-outline-variant)')
                }
              />
            </div>

            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-on-surface)' }}
              >
                Mensaje
              </label>
              <textarea
                rows={5}
                placeholder="Escribe tu mensaje aquí..."
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none resize-none"
                style={{
                  backgroundColor: 'var(--color-surface-container-low)',
                  color: 'var(--color-on-surface)',
                  border: '1.5px solid var(--color-outline-variant)',
                }}
                onFocus={(e) =>
                  (e.target.style.borderColor = 'var(--color-primary)')
                }
                onBlur={(e) =>
                  (e.target.style.borderColor = 'var(--color-outline-variant)')
                }
              />
            </div>

            <button
              type="submit"
              className="flex items-center justify-center gap-2 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-all"
              style={
                sent
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
              {sent ? (
                <>
                  <Check size={16} /> ¡Mensaje enviado!
                </>
              ) : (
                <>
                  <Send size={16} /> Enviar mensaje
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
