import type { Metadata } from 'next'
import { Newsreader, Work_Sans } from 'next/font/google'
import Nav from '@/components/Nav'
import Footer from '@/components/Footer'
import PedidoWatcher from '@/components/PedidoWatcher'
import AuthInterceptor from '@/components/AuthInterceptor'
import './globals.css'

const newsreader = Newsreader({
  subsets: ['latin'],
  style: ['normal', 'italic'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-newsreader',
  display: 'swap',
})

const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-work-sans',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Comida al Paso',
    template: '%s | Comida al Paso',
  },
  description: 'Fresco, rápido y casero. Menús del día, a la carta, postres y arma tu bowl a tu gusto.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es" className={`${newsreader.variable} ${workSans.variable}`}>
      <body>
        <Nav />
        <main className="pt-16">{children}</main>
        <Footer />
        <PedidoWatcher />
        <AuthInterceptor />
      </body>
    </html>
  )
}
