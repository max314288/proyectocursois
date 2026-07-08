'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface RestauranteSeleccionado {
  id: string
  nombre: string
}

interface RestauranteStore {
  restaurante: RestauranteSeleccionado | null
  seleccionar: (r: RestauranteSeleccionado) => void
}

export const useRestauranteStore = create<RestauranteStore>()(
  persist(
    (set) => ({
      restaurante: null,
      seleccionar: (r) => set({ restaurante: r }),
    }),
    { name: 'admin-restaurante' }
  )
)
