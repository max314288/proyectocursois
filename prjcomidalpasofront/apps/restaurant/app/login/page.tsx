'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, ChefHat, AlertCircle } from 'lucide-react'
import {
  validarCredenciales,
  registrar,
  getMensajeErrorCredenciales,
  getMensajeErrorRegistro,
} from '@/lib/services/authService'

type Tab = 'login' | 'registro'

export default function RestaurantLoginPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('login')

  // login state
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // registro state
  const [regNombre, setRegNombre] = useState('')
  const [regApellido, setRegApellido] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [showRegPwd, setShowRegPwd] = useState(false)
  const [regError, setRegError] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    const ok = await validarCredenciales(email, password)
    setLoading(false)
    if (ok) {
      router.replace('/')
    } else {
      setError(getMensajeErrorCredenciales())
    }
  }

  async function handleRegistro(e: React.FormEvent) {
    e.preventDefault()
    setRegLoading(true)
    setRegError('')
    const ok = await registrar({
      nombre: regNombre,
      apellido: regApellido,
      email: regEmail,
      password: regPassword,
    })
    setRegLoading(false)
    if (ok) {
      router.replace('/')
    } else {
      setRegError(getMensajeErrorRegistro())
    }
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: 'var(--color-surface)' }}
    >
      <div className="w-full max-w-xs">
        {/* Icon + heading */}
        <div className="mb-8 text-center">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-4"
            style={{ backgroundColor: 'var(--color-surface-alt)' }}
          >
            <ChefHat size={28} style={{ color: 'var(--color-pending)' }} />
          </div>
          <p
            className="text-xs font-semibold uppercase tracking-widest mb-1"
            style={{ color: 'var(--color-muted)' }}
          >
            Comida al Paso
          </p>
          <h1
            className="text-2xl font-bold"
            style={{ color: 'var(--color-on-surface)' }}
          >
            Vista Cocina
          </h1>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-7"
          style={{
            backgroundColor: 'var(--color-surface-card)',
            border: '1px solid var(--color-border)',
          }}
        >
          {/* Tab switcher */}
          <div
            className="flex rounded-xl p-1 mb-6"
            style={{ backgroundColor: 'var(--color-surface-alt)' }}
          >
            {(['login', 'registro'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className="flex-1 py-2 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all"
                style={
                  tab === t
                    ? {
                        backgroundColor: 'var(--color-surface-card)',
                        color: 'var(--color-pending)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.4)',
                      }
                    : { color: 'var(--color-muted)' }
                }
              >
                {t === 'login' ? 'Entrar' : 'Crear cuenta'}
              </button>
            ))}
          </div>

          {/* ── LOGIN FORM ── */}
          {tab === 'login' && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Email */}
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--color-muted)' }}
                >
                  Correo
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); setError('') }}
                  placeholder="cocina@comidaalpaso.com"
                  required
                  disabled={loading}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--color-surface-alt)',
                    color: 'var(--color-on-surface)',
                    border: '1.5px solid var(--color-border)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-pending)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                />
              </div>

              {/* Password */}
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--color-muted)' }}
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
                    disabled={loading}
                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--color-surface-alt)',
                      color: 'var(--color-on-surface)',
                      border: '1.5px solid var(--color-border)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-pending)')}
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
                    backgroundColor: 'rgba(220,38,38,0.10)',
                    border: '1px solid rgba(220,38,38,0.25)',
                    color: '#f87171',
                  }}
                >
                  <AlertCircle size={14} className="shrink-0" />
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-full text-sm font-bold mt-1 hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--color-pending)',
                  color: '#0f0f0f',
                }}
              >
                {loading ? 'Verificando…' : 'Acceder a cocina'}
              </button>
            </form>
          )}

          {/* ── REGISTRO FORM ── */}
          {tab === 'registro' && (
            <form onSubmit={handleRegistro} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    Nombre
                  </label>
                  <input
                    type="text"
                    value={regNombre}
                    onChange={(e) => { setRegNombre(e.target.value); setRegError('') }}
                    placeholder="Ana"
                    required
                    disabled={regLoading}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--color-surface-alt)',
                      color: 'var(--color-on-surface)',
                      border: '1.5px solid var(--color-border)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-pending)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                  />
                </div>
                <div>
                  <label
                    className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    Apellido
                  </label>
                  <input
                    type="text"
                    value={regApellido}
                    onChange={(e) => { setRegApellido(e.target.value); setRegError('') }}
                    placeholder="García"
                    required
                    disabled={regLoading}
                    className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--color-surface-alt)',
                      color: 'var(--color-on-surface)',
                      border: '1.5px solid var(--color-border)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-pending)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--color-muted)' }}
                >
                  Correo
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => { setRegEmail(e.target.value); setRegError('') }}
                  placeholder="cocina@comidaalpaso.com"
                  required
                  disabled={regLoading}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={{
                    backgroundColor: 'var(--color-surface-alt)',
                    color: 'var(--color-on-surface)',
                    border: '1.5px solid var(--color-border)',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-pending)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                />
              </div>

              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--color-muted)' }}
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showRegPwd ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => { setRegPassword(e.target.value); setRegError('') }}
                    placeholder="••••••••"
                    required
                    minLength={8}
                    disabled={regLoading}
                    className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                    style={{
                      backgroundColor: 'var(--color-surface-alt)',
                      color: 'var(--color-on-surface)',
                      border: '1.5px solid var(--color-border)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-pending)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPwd(!showRegPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 hover:opacity-70 transition-opacity"
                    style={{ color: 'var(--color-muted)' }}
                  >
                    {showRegPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {regError && (
                <div
                  className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(220,38,38,0.10)',
                    border: '1px solid rgba(220,38,38,0.25)',
                    color: '#f87171',
                  }}
                >
                  <AlertCircle size={14} className="shrink-0" />
                  {regError}
                </div>
              )}

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3 rounded-full text-sm font-bold mt-1 hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--color-pending)',
                  color: '#0f0f0f',
                }}
              >
                {regLoading ? 'Creando cuenta…' : 'Crear cuenta de cocina'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
