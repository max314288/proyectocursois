'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle, CheckCircle, User, KeyRound, Receipt, ChevronRight, LogOut } from 'lucide-react'
import { estaAutenticado, getUsuario, cerrarSesion } from '@/lib/services/authService'
import {
  actualizarPerfil,
  cambiarPassword,
  validarPasswordNuevo,
  getMensajeErrorPerfil,
  getMensajeErrorPassword,
} from '@/lib/services/usuarioService'

const inputStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-surface-container-low)',
  color: 'var(--color-on-surface)',
  border: '1.5px solid var(--color-outline-variant)',
}

export default function PerfilPage() {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  // datos personales
  const [nombre, setNombre] = useState('')
  const [apellido, setApellido] = useState('')
  const [email, setEmail] = useState('')
  const [perfilError, setPerfilError] = useState('')
  const [perfilOk, setPerfilOk] = useState(false)
  const [perfilLoading, setPerfilLoading] = useState(false)

  // contraseña
  const [pwdActual, setPwdActual] = useState('')
  const [pwdNuevo, setPwdNuevo] = useState('')
  const [pwdConfirm, setPwdConfirm] = useState('')
  const [showPwd, setShowPwd] = useState(false)
  const [pwdError, setPwdError] = useState('')
  const [pwdOk, setPwdOk] = useState(false)
  const [pwdLoading, setPwdLoading] = useState(false)

  useEffect(() => {
    if (!estaAutenticado()) {
      router.replace('/acceso')
      return
    }
    const usuario = getUsuario()
    if (usuario) {
      setNombre(usuario.nombre)
      setApellido(usuario.apellido)
      setEmail(usuario.email)
    }
    setReady(true)
  }, [router])

  async function handlePerfil(e: React.FormEvent) {
    e.preventDefault()
    setPerfilLoading(true)
    setPerfilError('')
    setPerfilOk(false)
    const ok = await actualizarPerfil({ nombre, apellido, email })
    setPerfilLoading(false)
    if (ok) {
      setPerfilOk(true)
    } else {
      setPerfilError(getMensajeErrorPerfil())
    }
  }

  async function handlePassword(e: React.FormEvent) {
    e.preventDefault()
    setPwdError('')
    setPwdOk(false)
    if (!validarPasswordNuevo(pwdNuevo)) {
      setPwdError('La nueva contraseña debe tener al menos 8 caracteres.')
      return
    }
    if (pwdNuevo !== pwdConfirm) {
      setPwdError('Las contraseñas no coinciden.')
      return
    }
    setPwdLoading(true)
    const ok = await cambiarPassword(pwdActual, pwdNuevo)
    setPwdLoading(false)
    if (ok) {
      setPwdOk(true)
      setPwdActual('')
      setPwdNuevo('')
      setPwdConfirm('')
    } else {
      setPwdError(getMensajeErrorPassword())
    }
  }

  function handleLogout() {
    cerrarSesion()
    router.replace('/acceso')
  }

  if (!ready) return null

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <p
        className="text-xs font-semibold uppercase tracking-widest mb-2"
        style={{ color: 'var(--color-secondary)' }}
      >
        Tu cuenta
      </p>
      <h1
        className="text-4xl font-semibold mb-10"
        style={{ fontFamily: 'var(--font-newsreader)', color: 'var(--color-on-surface)' }}
      >
        Mi Perfil
      </h1>

      {/* ── Mis pedidos ── */}
      <Link
        href="/perfil/pedidos"
        className="flex items-center justify-between rounded-2xl p-6 mb-8 shadow-ambient hover:opacity-90 transition-opacity"
        style={{ backgroundColor: 'var(--color-surface-container-lowest, #ffffff)' }}
      >
        <div className="flex items-center gap-3">
          <Receipt size={20} style={{ color: 'var(--color-primary)' }} />
          <div>
            <p className="font-semibold" style={{ color: 'var(--color-on-surface)' }}>
              Mis pedidos
            </p>
            <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
              Historial, seguimiento y comprobantes
            </p>
          </div>
        </div>
        <ChevronRight size={18} style={{ color: 'var(--color-on-surface-variant)' }} />
      </Link>

      {/* ── Datos personales ── */}
      <section
        className="rounded-2xl p-8 mb-8 shadow-ambient"
        style={{ backgroundColor: 'var(--color-surface-container-lowest, #ffffff)' }}
      >
        <div className="flex items-center gap-2 mb-6">
          <User size={18} style={{ color: 'var(--color-primary)' }} />
          <h2
            className="text-xl font-semibold"
            style={{ fontFamily: 'var(--font-newsreader)', color: 'var(--color-on-surface)' }}
          >
            Datos personales
          </h2>
        </div>

        <form onSubmit={handlePerfil} className="flex flex-col gap-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-on-surface)' }}>
                Nombre
              </label>
              <input
                type="text"
                value={nombre}
                onChange={(e) => { setNombre(e.target.value); setPerfilError(''); setPerfilOk(false) }}
                required
                disabled={perfilLoading}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-on-surface)' }}>
                Apellido
              </label>
              <input
                type="text"
                value={apellido}
                onChange={(e) => { setApellido(e.target.value); setPerfilError(''); setPerfilOk(false) }}
                required
                disabled={perfilLoading}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-on-surface)' }}>
              Correo electrónico
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => { setEmail(e.target.value); setPerfilError(''); setPerfilOk(false) }}
              required
              disabled={perfilLoading}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
            />
          </div>

          {perfilError && (
            <div
              className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-lg"
              style={{
                backgroundColor: 'rgba(220,38,38,0.08)',
                border: '1px solid rgba(220,38,38,0.2)',
                color: '#dc2626',
              }}
            >
              <AlertCircle size={14} className="shrink-0" />
              {perfilError}
            </div>
          )}
          {perfilOk && (
            <div
              className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-lg"
              style={{
                backgroundColor: 'rgba(22,163,74,0.08)',
                border: '1px solid rgba(22,163,74,0.2)',
                color: '#16a34a',
              }}
            >
              <CheckCircle size={14} className="shrink-0" />
              Perfil actualizado correctamente.
            </div>
          )}

          <button
            type="submit"
            disabled={perfilLoading}
            className="self-start px-8 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
          >
            {perfilLoading ? 'Guardando…' : 'Guardar cambios'}
          </button>
        </form>
      </section>

      {/* ── Cambiar contraseña ── */}
      <section
        className="rounded-2xl p-8 shadow-ambient"
        style={{ backgroundColor: 'var(--color-surface-container-lowest, #ffffff)' }}
      >
        <div className="flex items-center gap-2 mb-6">
          <KeyRound size={18} style={{ color: 'var(--color-primary)' }} />
          <h2
            className="text-xl font-semibold"
            style={{ fontFamily: 'var(--font-newsreader)', color: 'var(--color-on-surface)' }}
          >
            Cambiar contraseña
          </h2>
        </div>

        <form onSubmit={handlePassword} className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-on-surface)' }}>
              Contraseña actual
            </label>
            <input
              type={showPwd ? 'text' : 'password'}
              value={pwdActual}
              onChange={(e) => { setPwdActual(e.target.value); setPwdError(''); setPwdOk(false) }}
              required
              disabled={pwdLoading}
              className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
              style={inputStyle}
              onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
              onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-on-surface)' }}>
                Nueva contraseña
              </label>
              <div className="relative">
                <input
                  type={showPwd ? 'text' : 'password'}
                  value={pwdNuevo}
                  onChange={(e) => { setPwdNuevo(e.target.value); setPwdError(''); setPwdOk(false) }}
                  required
                  minLength={8}
                  disabled={pwdLoading}
                  className="w-full px-4 py-3 pr-11 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
                />
                <button
                  type="button"
                  onClick={() => setShowPwd(!showPwd)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-1 btn-icon-interactive"
                  style={{ color: 'var(--color-on-surface-variant)' }}
                  aria-label={showPwd ? 'Ocultar contraseña' : 'Mostrar contraseña'}
                  data-tooltip={showPwd ? 'Ocultar' : 'Mostrar'}
                >
                  {showPwd ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1.5" style={{ color: 'var(--color-on-surface)' }}>
                Confirmar contraseña
              </label>
              <input
                type={showPwd ? 'text' : 'password'}
                value={pwdConfirm}
                onChange={(e) => { setPwdConfirm(e.target.value); setPwdError(''); setPwdOk(false) }}
                required
                minLength={8}
                disabled={pwdLoading}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-primary)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-outline-variant)')}
              />
            </div>
          </div>

          {pwdError && (
            <div
              className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-lg"
              style={{
                backgroundColor: 'rgba(220,38,38,0.08)',
                border: '1px solid rgba(220,38,38,0.2)',
                color: '#dc2626',
              }}
            >
              <AlertCircle size={14} className="shrink-0" />
              {pwdError}
            </div>
          )}
          {pwdOk && (
            <div
              className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-lg"
              style={{
                backgroundColor: 'rgba(22,163,74,0.08)',
                border: '1px solid rgba(22,163,74,0.2)',
                color: '#16a34a',
              }}
            >
              <CheckCircle size={14} className="shrink-0" />
              Contraseña actualizada correctamente.
            </div>
          )}

          <button
            type="submit"
            disabled={pwdLoading}
            className="self-start px-8 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity disabled:opacity-50"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
          >
            {pwdLoading ? 'Actualizando…' : 'Cambiar contraseña'}
          </button>
        </form>
      </section>

      <button
        type="button"
        onClick={handleLogout}
        className="flex items-center gap-2 mt-8 mx-auto text-sm font-semibold hover:opacity-80 transition-opacity"
        style={{ color: '#dc2626' }}
      >
        <LogOut size={16} />
        Cerrar sesión
      </button>
    </div>
  )
}
