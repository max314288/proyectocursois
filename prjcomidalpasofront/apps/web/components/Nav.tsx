'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/store/cartStore'
import { useRestauranteStore } from '@/store/restauranteStore'
import { estaAutenticado } from '@/lib/services/authService'
import { ShoppingBag, Menu, X, Store } from 'lucide-react'
import { useEffect, useState } from 'react'

const baseLinks = [
  { href: '/', label: 'Inicio' },
  { href: '/restaurantes', label: 'Restaurantes' },
  { href: '/menus', label: 'Menús' },
  { href: '/carta', label: 'A la Carta' },
  { href: '/postres', label: 'Postres' },
  { href: '/pedido', label: 'Arma tu Pedido' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Nav() {
  const pathname = usePathname()
  const count = useCart((s) => s.count())
  const restaurante = useRestauranteStore((s) => s.restaurante)
  const [open, setOpen] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  // gate `mounted` evita hydration mismatch al leer localStorage
  const autenticado = mounted && estaAutenticado()
  const links = [
    ...baseLinks,
    autenticado
      ? { href: '/perfil', label: 'Mi Perfil' }
      : { href: '/acceso', label: 'Acceso' },
  ]

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-outline-variant">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="font-newsreader text-xl font-semibold text-primary">
          Comida al Paso
        </Link>

        {mounted && restaurante && (
          <Link
            href="/restaurantes"
            className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-surface-container hover:bg-surface-container-high transition-colors text-on-surface-variant"
            title="Cambiar restaurante"
          >
            <Store size={12} />
            {restaurante.nombre}
          </Link>
        )}

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                pathname === l.href
                  ? 'text-primary'
                  : 'text-on-surface-variant hover:text-on-surface'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/carrito"
            className="relative p-2 rounded-full hover:bg-surface-container transition-colors"
          >
            <ShoppingBag size={20} className="text-on-surface-variant" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-primary text-on-primary text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            className="md:hidden p-2 rounded-full hover:bg-surface-container transition-colors text-on-surface"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-outline-variant bg-surface-container-low px-6 py-4 flex flex-col gap-4">
          {mounted && restaurante && (
            <Link
              href="/restaurantes"
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-on-surface-variant"
            >
              <Store size={12} />
              {restaurante.nombre} · cambiar
            </Link>
          )}
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium py-1 transition-colors ${
                pathname === l.href ? 'text-primary' : 'text-on-surface-variant'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </div>
      )}
    </header>
  )
}
