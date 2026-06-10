'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import {
  validarCredenciales,
  guardarSesion,
  getMensajeErrorCredenciales,
  DEMO_CREDENTIALS,
} from '@/lib/services/authService'

export default function AdminLoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')

  // CONTROLLER delegado a authService (MVC + SOLID-S)
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (validarCredenciales(email, password)) {
      guardarSesion()
      router.replace('/')
    } else {
      setError(getMensajeErrorCredenciales())
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="mb-8 text-center">
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: 'var(--color-muted)' }}
          >
            Comida al Paso
          </p>
          <h1
            className="text-3xl font-bold"
            style={{ color: 'var(--color-primary)' }}
          >
            Panel Admin
          </h1>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8"
          style={{
            backgroundColor: 'var(--color-surface-alt)',
            border: '1px solid var(--color-border)',
          }}
        >
          <h2
            className="text-lg font-semibold mb-1"
            style={{ color: 'var(--color-on-surface)' }}
          >
            Iniciar sesión
          </h2>
          <p className="text-sm mb-6" style={{ color: 'var(--color-muted)' }}>
            Accede al panel de administración
          </p>

          {/* Demo hint — datos centralizados en authService */}
          <div
            className="rounded-lg px-4 py-3 mb-6 text-xs"
            style={{
              backgroundColor: 'rgba(130,59,24,0.08)',
              border: '1px solid rgba(130,59,24,0.2)',
              color: 'var(--color-primary)',
            }}
          >
            <span className="font-semibold">Demo: </span>
            {DEMO_CREDENTIALS.email} · {DEMO_CREDENTIALS.password}
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
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
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError('') }}
                placeholder={DEMO_CREDENTIALS.email}
                required
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={{
                  backgroundColor: 'var(--color-surface)',
                  color: 'var(--color-on-surface)',
                  border: '1.5px solid var(--color-border)',
                }}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>

            {/* Password */}
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
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder="••••••••"
                  required
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--color-surface)',
                    color: 'var(--color-on-surface)',
                    border: '1.5px solid var(--color-border)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
                  style={{ color: 'var(--color-muted)' }}
                >
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <div
                className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-lg"
                style={{
                  backgroundColor: 'rgba(220,38,38,0.08)',
                  border: '1px solid rgba(220,38,38,0.2)',
                  color: '#dc2626',
                }}
              >
                <AlertCircle size={14} className="shrink-0" />
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 rounded-full text-sm font-semibold mt-1 hover:opacity-90 transition-opacity"
              style={{
                backgroundColor: 'var(--color-primary)',
                color: '#ffffff',
              }}
            >
              Entrar al panel
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
