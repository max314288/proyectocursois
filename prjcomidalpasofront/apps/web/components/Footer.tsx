import Link from 'next/link'

const navLinks = [
  ['/', 'Inicio'],
  ['/menus', 'Menús'],
  ['/carta', 'A la Carta'],
  ['/postres', 'Postres'],
  ['/pedido', 'Arma tu Pedido'],
  ['/contacto', 'Contacto'],
]

export default function Footer() {
  return (
    <footer
      className="mt-24 py-14"
      style={{ backgroundColor: 'var(--color-inverse-surface)', color: 'var(--color-inverse-on-surface)' }}
    >
      <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10">
        <div>
          <p
            className="text-xl font-semibold mb-3"
            style={{
              fontFamily: 'var(--font-newsreader)',
              color: 'var(--color-inverse-primary)',
            }}
          >
            Comida al Paso
          </p>
          <p className="text-sm leading-relaxed opacity-70">
            Fresco, rápido y casero.
            <br />
            Porque comer bien no debería complicarse.
          </p>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-4">Páginas</p>
          <nav className="flex flex-col gap-2">
            {navLinks.map(([href, label]) => (
              <Link
                key={href}
                href={href}
                className="text-sm opacity-70 hover:opacity-100 transition-opacity w-fit"
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>

        <div>
          <p className="text-xs font-semibold uppercase tracking-widest opacity-50 mb-4">Horario y contacto</p>
          <div className="flex flex-col gap-2 text-sm opacity-70">
            <p>Lun – Vie: 7:00 am – 8:00 pm</p>
            <p>Sáb: 8:00 am – 6:00 pm</p>
            <p className="mt-2">info@comidaalpaso.co</p>
            <p>+57 300 000 0000</p>
          </div>
        </div>
      </div>

      <div
        className="max-w-[1280px] mx-auto px-6 mt-10 pt-6 text-xs opacity-40"
        style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}
      >
        © 2026 Comida al Paso. Todos los derechos reservados.
      </div>
    </footer>
  )
}
