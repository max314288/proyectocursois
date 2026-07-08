'use client'

import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { CheckCircle2, X } from 'lucide-react'
import { estaAutenticado } from '@/lib/services/authService'
import { listarMisPedidos } from '@/lib/services/pedidoApiService'

const POLL_MS = 15000
const STORAGE_KEY = 'cap-pedidos-vistos-listo'

function getVistos(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    return new Set(JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'))
  } catch {
    return new Set()
  }
}

function guardarVistos(ids: Set<string>) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]))
}

/**
 * Vigila los pedidos activos del cliente y avisa (toast + Notification API)
 * cuando alguno pasa a 'listo'. Montado en el layout raíz — activo en toda la app.
 */
export default function PedidoWatcher() {
  const [toast, setToast] = useState<{ id: string } | null>(null)
  const vistosRef = useRef<Set<string>>(new Set())

  useEffect(() => {
    vistosRef.current = getVistos()
    if (typeof Notification !== 'undefined' && Notification.permission === 'default') {
      Notification.requestPermission().catch(() => {})
    }
  }, [])

  useEffect(() => {
    if (!estaAutenticado()) return

    let cancelled = false

    async function tick() {
      try {
        const pedidos = await listarMisPedidos()
        if (cancelled) return
        for (const p of pedidos) {
          if (p.estado === 'listo' && !vistosRef.current.has(p.id)) {
            vistosRef.current.add(p.id)
            guardarVistos(vistosRef.current)
            setToast({ id: p.id })
            if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
              new Notification('¡Tu pedido está listo!', {
                body: `Pedido #${p.id.slice(0, 8).toUpperCase()} — pásalo a recoger.`,
              })
            }
          }
        }
      } catch {
        // silencioso — próximo tick reintenta
      }
    }

    tick()
    const interval = setInterval(() => {
      if (document.visibilityState === 'visible') tick()
    }, POLL_MS)

    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  if (!toast) return null

  return (
    <div className="fixed bottom-6 right-6 z-[60] max-w-sm">
      <div
        className="rounded-2xl p-4 shadow-ambient flex items-start gap-3"
        style={{ backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' }}
      >
        <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
        <div className="flex-1">
          <p className="text-sm font-semibold mb-0.5">¡Tu pedido está listo!</p>
          <p className="text-xs mb-2">Pedido #{toast.id.slice(0, 8).toUpperCase()} — pásalo a recoger.</p>
          <Link href="/perfil/pedidos" className="text-xs font-semibold underline underline-offset-2">
            Ver pedido →
          </Link>
        </div>
        <button onClick={() => setToast(null)} className="shrink-0 p-1 hover:opacity-70 transition-opacity">
          <X size={16} />
        </button>
      </div>
    </div>
  )
}
