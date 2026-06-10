'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { estaAutenticado } from '@/lib/services/authService'

export default function CocinaLayout({ children }: { children: React.ReactNode }) {
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

  return <>{children}</>
}
