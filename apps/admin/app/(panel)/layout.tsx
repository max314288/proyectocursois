'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Sidebar from '@/components/Sidebar'
import { estaAutenticado } from '@/lib/services/authService'

export default function PanelLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    // CONTROLLER delegado a authService (MVC + SOLID-D)
    if (!estaAutenticado()) {
      router.replace('/login')
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) return null

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64 p-8 bg-[var(--color-surface)]">
        {children}
      </main>
    </div>
  )
}
