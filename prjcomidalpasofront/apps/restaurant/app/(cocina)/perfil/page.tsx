'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Eye, EyeOff, AlertCircle, CheckCircle, User, KeyRound, ArrowLeft } from 'lucide-react'
import { getUsuario } from '@/lib/services/authService'
import {
  actualizarPerfil,
  cambiarPassword,
  validarPasswordNuevo,
  getMensajeErrorPerfil,
  getMensajeErrorPassword,
} from '@/lib/services/usuarioService'

const inputStyle: React.CSSProperties = {
  backgroundColor: 'var(--color-surface-alt)',
  color: 'var(--color-on-surface)',
  border: '1.5px solid var(--color-border)',
}

export default function PerfilPage() {
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
    const usuario = getUsuario()
    if (usuario) {
      setNombre(usuario.nombre)
      setApellido(usuario.apellido)
      setEmail(usuario.email)
    }
  }, [])

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

  return (
    <div className="min-h-screen px-8 py-8">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm mb-6 hover:opacity-70 transition-opacity"
          style={{ color: 'var(--color-muted)' }}
        >
          <ArrowLeft size={15} />
          Volver a cocina
        </Link>

        <p
          className="text-xs font-semibold uppercase tracking-widest mb-1"
          style={{ color: 'var(--color-muted)' }}
        >
          Tu cuenta
        </p>
        <h1 className="text-2xl font-bold mb-8" style={{ color: 'var(--color-on-surface)' }}>
          Mi Perfil
        </h1>

        {/* ── Datos personales ── */}
        <section
          className="rounded-2xl p-7 mb-6"
          style={{
            backgroundColor: 'var(--color-surface-card)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <User size={18} style={{ color: 'var(--color-pending)' }} />
            <h2
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: 'var(--color-on-surface)' }}
            >
              Datos personales
            </h2>
          </div>

          <form onSubmit={handlePerfil} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--color-muted)' }}
                >
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
                  value={apellido}
                  onChange={(e) => { setApellido(e.target.value); setPerfilError(''); setPerfilOk(false) }}
                  required
                  disabled={perfilLoading}
                  className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                  style={inputStyle}
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
                value={email}
                onChange={(e) => { setEmail(e.target.value); setPerfilError(''); setPerfilOk(false) }}
                required
                disabled={perfilLoading}
                className="w-full px-4 py-3 rounded-xl text-sm outline-none transition-all"
                style={inputStyle}
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-pending)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>

            {perfilError && (
              <div
                className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-lg"
                style={{
                  backgroundColor: 'rgba(220,38,38,0.10)',
                  border: '1px solid rgba(220,38,38,0.25)',
                  color: '#f87171',
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
                  backgroundColor: 'rgba(34,197,94,0.10)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  color: '#4ade80',
                }}
              >
                <CheckCircle size={14} className="shrink-0" />
                Perfil actualizado correctamente.
              </div>
            )}

            <button
              type="submit"
              disabled={perfilLoading}
              className="self-start px-8 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-pending)', color: '#0f0f0f' }}
            >
              {perfilLoading ? 'Guardando…' : 'Guardar cambios'}
            </button>
          </form>
        </section>

        {/* ── Cambiar contraseña ── */}
        <section
          className="rounded-2xl p-7"
          style={{
            backgroundColor: 'var(--color-surface-card)',
            border: '1px solid var(--color-border)',
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <KeyRound size={18} style={{ color: 'var(--color-pending)' }} />
            <h2
              className="text-sm font-semibold uppercase tracking-wide"
              style={{ color: 'var(--color-on-surface)' }}
            >
              Cambiar contraseña
            </h2>
          </div>

          <form onSubmit={handlePassword} className="flex flex-col gap-4">
            <div>
              <label
                className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                style={{ color: 'var(--color-muted)' }}
              >
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
                onFocus={(e) => (e.target.style.borderColor = 'var(--color-pending)')}
                onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--color-muted)' }}
                >
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
              <div>
                <label
                  className="block text-xs font-semibold uppercase tracking-wider mb-1.5"
                  style={{ color: 'var(--color-muted)' }}
                >
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
                  onFocus={(e) => (e.target.style.borderColor = 'var(--color-pending)')}
                  onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
                />
              </div>
            </div>

            {pwdError && (
              <div
                className="flex items-center gap-2 text-xs px-3 py-2.5 rounded-lg"
                style={{
                  backgroundColor: 'rgba(220,38,38,0.10)',
                  border: '1px solid rgba(220,38,38,0.25)',
                  color: '#f87171',
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
                  backgroundColor: 'rgba(34,197,94,0.10)',
                  border: '1px solid rgba(34,197,94,0.25)',
                  color: '#4ade80',
                }}
              >
                <CheckCircle size={14} className="shrink-0" />
                Contraseña actualizada correctamente.
              </div>
            )}

            <button
              type="submit"
              disabled={pwdLoading}
              className="self-start px-8 py-3 rounded-full text-sm font-bold hover:opacity-90 transition-opacity disabled:opacity-50"
              style={{ backgroundColor: 'var(--color-pending)', color: '#0f0f0f' }}
            >
              {pwdLoading ? 'Actualizando…' : 'Cambiar contraseña'}
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
