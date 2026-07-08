'use client'

import Image from 'next/image'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Eye, EyeOff, AlertCircle } from 'lucide-react'
import {
  validarCredenciales,
  registrar,
  getMensajeErrorCredenciales,
  getMensajeErrorRegistro,
} from '@/lib/services/authService'

type Tab = 'login' | 'registro'

export default function AccesoPage() {
  const router = useRouter()
  const [tab, setTab] = useState<Tab>('login')

  // login state
  const [loginEmail, setLoginEmail] = useState('')
  const [loginPassword, setLoginPassword] = useState('')
  const [showLoginPwd, setShowLoginPwd] = useState(false)
  const [loginError, setLoginError] = useState('')
  const [loginLoading, setLoginLoading] = useState(false)

  // registro state
  const [regNombre, setRegNombre] = useState('')
  const [regApellido, setRegApellido] = useState('')
  const [regEmail, setRegEmail] = useState('')
  const [regPassword, setRegPassword] = useState('')
  const [showRegPwd, setShowRegPwd] = useState(false)
  const [regError, setRegError] = useState('')
  const [regLoading, setRegLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoginLoading(true)
    setLoginError('')
    const ok = await validarCredenciales(loginEmail, loginPassword)
    setLoginLoading(false)
    if (ok) {
      router.replace('/restaurantes')
    } else {
      setLoginError(getMensajeErrorCredenciales())
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
      router.replace('/restaurantes')
    } else {
      setRegError(getMensajeErrorRegistro())
    }
  }

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

          {/* Tab switcher */}
          <div
            className="flex rounded-xl p-1 mb-8"
            style={{ backgroundColor: 'var(--color-surface-container-low)' }}
          >
            {(['login', 'registro'] as Tab[]).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setTab(t)}
                className="flex-1 py-2 rounded-lg text-sm font-medium transition-all capitalize"
                style={
                  tab === t
                    ? {
                        backgroundColor: 'var(--color-surface)',
                        color: 'var(--color-primary)',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.12)',
                      }
                    : { color: 'var(--color-on-surface-variant)' }
                }
              >
                {t === 'login' ? 'Iniciar sesión' : 'Crear cuenta'}
              </button>
            ))}
          </div>

          {/* ── LOGIN FORM ── */}
          {tab === 'login' && (
            <form onSubmit={handleLogin} className="flex flex-col gap-5">
              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={loginEmail}
                  onChange={(e) => { setLoginEmail(e.target.value); setLoginError('') }}
                  placeholder="tu@correo.com"
                  required
                  disabled={loginLoading}
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

              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  Contraseña
                </label>
                <div className="relative">
                  <input
                    type={showLoginPwd ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => { setLoginPassword(e.target.value); setLoginError('') }}
                    placeholder="••••••••"
                    required
                    disabled={loginLoading}
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
                    onClick={() => setShowLoginPwd(!showLoginPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 btn-icon-interactive"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                    aria-label={showLoginPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    data-tooltip={showLoginPwd ? 'Ocultar' : 'Mostrar'}
                  >
                    {showLoginPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {loginError && (
                <div
                  className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(220,38,38,0.08)',
                    border: '1px solid rgba(220,38,38,0.2)',
                    color: '#dc2626',
                  }}
                >
                  <AlertCircle size={14} className="shrink-0" />
                  {loginError}
                </div>
              )}

              <button
                type="submit"
                disabled={loginLoading}
                className="w-full py-3 rounded-full text-sm font-semibold mt-1 hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                }}
              >
                {loginLoading ? 'Verificando…' : 'Iniciar sesión'}
              </button>
            </form>
          )}

          {/* ── REGISTRO FORM ── */}
          {tab === 'registro' && (
            <form onSubmit={handleRegistro} className="flex flex-col gap-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: 'var(--color-on-surface)' }}
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
                      backgroundColor: 'var(--color-surface-container-low)',
                      color: 'var(--color-on-surface)',
                      border: '1.5px solid var(--color-outline-variant)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1.5"
                    style={{ color: 'var(--color-on-surface)' }}
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
                      backgroundColor: 'var(--color-surface-container-low)',
                      color: 'var(--color-on-surface)',
                      border: '1.5px solid var(--color-outline-variant)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
                  />
                </div>
              </div>

              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-on-surface)' }}
                >
                  Correo electrónico
                </label>
                <input
                  type="email"
                  value={regEmail}
                  onChange={(e) => { setRegEmail(e.target.value); setRegError('') }}
                  placeholder="tu@correo.com"
                  required
                  disabled={regLoading}
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

              <div>
                <label
                  className="block text-sm font-medium mb-1.5"
                  style={{ color: 'var(--color-on-surface)' }}
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
                      backgroundColor: 'var(--color-surface-container-low)',
                      color: 'var(--color-on-surface)',
                      border: '1.5px solid var(--color-outline-variant)',
                    }}
                    onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                    onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowRegPwd(!showRegPwd)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 btn-icon-interactive"
                    style={{ color: 'var(--color-on-surface-variant)' }}
                    aria-label={showRegPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                    data-tooltip={showRegPwd ? 'Ocultar' : 'Mostrar'}
                  >
                    {showRegPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              {regError && (
                <div
                  className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-lg"
                  style={{
                    backgroundColor: 'rgba(220,38,38,0.08)',
                    border: '1px solid rgba(220,38,38,0.2)',
                    color: '#dc2626',
                  }}
                >
                  <AlertCircle size={14} className="shrink-0" />
                  {regError}
                </div>
              )}

              <button
                type="submit"
                disabled={regLoading}
                className="w-full py-3 rounded-full text-sm font-semibold mt-1 hover:opacity-90 transition-opacity disabled:opacity-50"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                }}
              >
                {regLoading ? 'Creando cuenta…' : 'Crear cuenta gratis'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
