'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useCart } from '@/store/cartStore'
import { ShoppingBag, Menu, X } from 'lucide-react'
import { useState } from 'react'

const links = [
  { href: '/', label: 'Inicio' },
  { href: '/menus', label: 'Menús' },
  { href: '/carta', label: 'A la Carta' },
  { href: '/postres', label: 'Postres' },
  { href: '/pedido', label: 'Arma tu Pedido' },
  { href: '/acceso', label: 'Acceso' },
  { href: '/contacto', label: 'Contacto' },
]

export default function Nav() {
  const pathname = usePathname()
  const count = useCart((s) => s.count())
  const [open, setOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass-nav border-b border-[var(--color-outline-variant)]">
      <div className="max-w-[1280px] mx-auto px-6 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-[family-name:var(--font-newsreader)] text-xl font-semibold text-[var(--color-primary)]"
        >
          Comida al Paso
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className={`text-sm font-medium transition-colors ${
                pathname === l.href
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface-variant)] hover:text-[var(--color-on-surface)]'
              }`}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/pedido"
            className="relative p-2 rounded-full hover:bg-[var(--color-surface-container)] transition-colors"
          >
            <ShoppingBag size={20} className="text-[var(--color-on-surface-variant)]" />
            {count > 0 && (
              <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full bg-[var(--color-primary)] text-[var(--color-on-primary)] text-[10px] font-bold flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <button
            className="md:hidden p-2 rounded-full hover:bg-[var(--color-surface-container)] transition-colors text-[var(--color-on-surface)]"
            onClick={() => setOpen(!open)}
            aria-label="Menú"
          >
            {open ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-[var(--color-outline-variant)] bg-[var(--color-surface-container-low)] px-6 py-4 flex flex-col gap-4">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setOpen(false)}
              className={`text-sm font-medium py-1 transition-colors ${
                pathname === l.href
                  ? 'text-[var(--color-primary)]'
                  : 'text-[var(--color-on-surface-variant)]'
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
