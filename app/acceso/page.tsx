'use client'

import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

type Tab = 'login' | 'register'

export default function AccesoPage() {
  const [tab, setTab] = useState<Tab>('login')
  const [showPwd, setShowPwd] = useState(false)

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center px-6 py-16">
      <div
        className="w-full max-w-md rounded-2xl shadow-ambient p-8"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        {/* Logo */}
        <p
          className="text-center text-2xl font-semibold mb-2"
          style={{
            fontFamily: 'var(--font-newsreader)',
            color: 'var(--color-primary)',
          }}
        >
          Comida al Paso
        </p>
        <p
          className="text-center text-sm mb-8"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          {tab === 'login' ? 'Bienvenido de nuevo' : 'Crea tu cuenta'}
        </p>

        {/* Tabs */}
        <div
          className="flex rounded-full p-1 mb-8"
          style={{ backgroundColor: 'var(--color-surface-container)' }}
        >
          {(['login', 'register'] as Tab[]).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="flex-1 py-2 rounded-full text-sm font-medium transition-all duration-200"
              style={
                tab === t
                  ? {
                      backgroundColor: 'var(--color-primary)',
                      color: 'var(--color-on-primary)',
                    }
                  : {
                      color: 'var(--color-on-surface-variant)',
                    }
              }
            >
              {t === 'login' ? 'Ingresar' : 'Registrarme'}
            </button>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-4">
          {tab === 'register' && (
            <div>
              <label
                className="block text-sm font-medium mb-1.5"
                style={{ color: 'var(--color-on-surface)' }}
              >
                Nombre completo
              </label>
              <input
                type="text"
                placeholder="Tu nombre"
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-shadow"
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
          )}

          <div>
            <label
              className="block text-sm font-medium mb-1.5"
              style={{ color: 'var(--color-on-surface)' }}
            >
              Correo electrónico
            </label>
            <input
              type="email"
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
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
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPwd ? 'text' : 'password'}
                placeholder="••••••••"
                className="w-full px-4 py-3 pr-12 rounded-xl text-sm outline-none transition-all"
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
              <button
                type="button"
                onClick={() => setShowPwd(!showPwd)}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 transition-opacity hover:opacity-70"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
              </button>
            </div>
          </div>

          {tab === 'login' && (
            <div className="text-right">
              <button
                type="button"
                className="text-xs hover:underline"
                style={{ color: 'var(--color-primary)' }}
              >
                ¿Olvidaste tu contraseña?
              </button>
            </div>
          )}

          <button
            type="submit"
            className="w-full py-3 rounded-full text-sm font-semibold mt-2 hover:opacity-90 transition-opacity"
            style={{
              backgroundColor: 'var(--color-primary)',
              color: 'var(--color-on-primary)',
            }}
          >
            {tab === 'login' ? 'Ingresar' : 'Crear cuenta'}
          </button>
        </form>

        <p
          className="text-center text-xs mt-6"
          style={{ color: 'var(--color-on-surface-variant)' }}
        >
          {tab === 'login' ? '¿No tienes cuenta? ' : '¿Ya tienes cuenta? '}
          <button
            onClick={() => setTab(tab === 'login' ? 'register' : 'login')}
            className="font-medium hover:underline"
            style={{ color: 'var(--color-primary)' }}
          >
            {tab === 'login' ? 'Regístrate' : 'Ingresa'}
          </button>
        </p>
      </div>
    </div>
  )
}
