'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { setOnUnauthorized } from '@/lib/services/apiClient'
import { cerrarSesion } from '@/lib/services/authService'

/** Si el backend responde 401, limpia la sesión y redirige a /acceso. Montado en el layout raíz. */
export default function AuthInterceptor() {
  const router = useRouter()

  useEffect(() => {
    setOnUnauthorized(() => {
      cerrarSesion()
      router.replace('/acceso')
    })
  }, [router])

  return null
}
