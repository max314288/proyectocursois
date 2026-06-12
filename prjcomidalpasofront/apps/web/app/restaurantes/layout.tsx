'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { estaAutenticado } from '@/lib/services/authService'

export default function RestaurantesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (!estaAutenticado()) {
      router.replace('/acceso')
    } else {
      setReady(true)
    }
  }, [router])

  if (!ready) return null

  return <>{children}</>
}
