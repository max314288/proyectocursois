'use client'

import Image from 'next/image'
import { useState } from 'react'
import { Eye, EyeOff } from 'lucide-react'

export default function AccesoPage() {
  const [showPwd, setShowPwd] = useState(false)
  const [remember, setRemember] = useState(false)

  return (
    <div className="min-h-[calc(100vh-4rem)] grid grid-cols-1 md:grid-cols-2">
      {/* Left: image panel */}
      <div className="relative hidden md:block">
        <Image
          src="/images/presentacion3.jpg"
          alt="Comida al Paso"
          fill
          className="object-cover"
          priority
        />
        <div
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(130,59,24,0.60)' }}
        />
        <div className="absolute inset-0 flex flex-col justify-end p-12">
          <p
            className="text-4xl font-semibold leading-tight mb-3"
            style={{
              fontFamily: 'var(--font-newsreader)',
              color: 'var(--color-on-primary)',
            }}
          >
            Comida al Paso
          </p>
          <p
            className="text-base italic"
            style={{ color: 'rgba(255,255,255,0.80)', fontFamily: 'var(--font-newsreader)' }}
          >
            "Eficiencia y sofisticación en cada bocado."
          </p>
        </div>
      </div>

      {/* Right: form */}
      <div
        className="flex flex-col justify-center px-8 py-16 md:px-16"
        style={{ backgroundColor: 'var(--color-surface)' }}
      >
        <div className="max-w-sm w-full mx-auto">
          {/* Mobile logo */}
          <p
            className="md:hidden text-2xl font-semibold mb-2"
            style={{
              fontFamily: 'var(--font-newsreader)',
              color: 'var(--color-primary)',
            }}
          >
            Comida al Paso
          </p>

          <h1
            className="mb-1"
            style={{
              fontFamily: 'var(--font-newsreader)',
              fontSize: '1.75rem',
              fontWeight: 600,
              color: 'var(--color-on-surface)',
            }}
          >
            Bienvenido de nuevo
          </h1>
          <p
            className="text-sm mb-8"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            Ingresa a tu cuenta para continuar
          </p>

          <form onSubmit={(e) => e.preventDefault()} className="flex flex-col gap-5">
            {/* Email */}
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
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--color-surface-container-low)',
                  color: 'var(--color-on-surface)',
                  border: '1.5px solid var(--color-outline-variant)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
              />
            </div>

            {/* Password */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  className="text-sm font-medium"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  Contraseña
                </label>
                <button
                  type="button"
                  className="text-xs hover:underline"
                  style={{ color: 'var(--color-primary)' }}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--color-surface-container-low)',
                    color: 'var(--color-on-surface)',
                    border: '1.5px solid var(--color-outline-variant)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
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

            {/* Remember */}
            <label className="flex items-center gap-3 cursor-pointer select-none">
              <button
                type="button"
                role="checkbox"
                aria-checked={remember}
                onClick={() => setRemember(!remember)}
                className="w-5 h-5 rounded-md flex items-center justify-center shrink-0 transition-colors"
                style={{
                  backgroundColor: remember
                    ? 'var(--color-primary)'
                    : 'var(--color-surface-container)',
                  border: remember
                    ? '2px solid var(--color-primary)'
                    : '2px solid var(--color-outline-variant)',
                }}
              >
                {remember && (
                  <svg width="11" height="9" viewBox="0 0 11 9" fill="none">
                    <path d="M1 4L4 7.5L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                )}
              </button>
              <span className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                Mantener sesión iniciada
              </span>
            </label>

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-3 rounded-full text-sm font-semibold mt-1 hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: 'var(--color-on-primary)',
              }}
            >
              Iniciar Sesión
            </button>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-outline-variant)' }} />
              <span className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                O continuar con
              </span>
              <div className="flex-1 h-px" style={{ backgroundColor: 'var(--color-outline-variant)' }} />
            </div>

            {/* Google */}
            <button
              type="button"
              className="w-full py-3 rounded-full text-sm font-medium flex items-center justify-center gap-3 transition-colors hover:bg-surface-container-high"
              style={{
                border: '1.5px solid var(--color-outline-variant)',
                color: 'var(--color-on-surface)',
                backgroundColor: 'var(--color-surface)',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
                <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
                <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z" fill="#34A853"/>
                <path d="M3.964 10.706A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.706V4.962H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.038l3.007-2.332z" fill="#FBBC05"/>
                <path d="M9 3.583c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.962L3.964 7.294C4.672 5.163 6.656 3.583 9 3.583z" fill="#EA4335"/>
              </svg>
              Continuar con Google
            </button>
          </form>

          <p
            className="text-center text-xs mt-8"
            style={{ color: 'var(--color-on-surface-variant)' }}
          >
            ¿No tienes cuenta?{' '}
            <button
              className="font-medium hover:underline"
              style={{ color: 'var(--color-primary)' }}
            >
              Regístrate gratis
            </button>
          </p>
        </div>
      </div>
    </div>
  )
}
