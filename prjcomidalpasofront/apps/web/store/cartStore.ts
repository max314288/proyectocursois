'use client'

import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  itemMenuId: string
  restauranteId: string
  name: string
  price: number
  quantity: number
  image: string
  category: string
  notasItem?: string
}

interface CartStore {
  items: CartItem[]
  add: (item: Omit<CartItem, 'quantity'>) => void
  remove: (id: string) => void
  updateQty: (id: string, qty: number) => void
  clear: () => void
  total: () => number
  count: () => number
}

export const useCart = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      add: (item) =>
        set((state) => {
          // Regla mono-restaurante: un pedido solo puede tener ítems de un restaurante.
          const otroRestaurante =
            state.items.length > 0 && state.items[0].restauranteId !== item.restauranteId
          const base = otroRestaurante ? [] : state.items

          const existing = base.find((i) => i.id === item.id)
          if (existing) {
            return {
              items: base.map((i) =>
                i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
              ),
            }
          }
          return { items: [...base, { ...item, quantity: 1 }] }
        }),
      remove: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      updateQty: (id, qty) =>
        set((state) => ({
          items:
            qty <= 0
              ? state.items.filter((i) => i.id !== id)
              : state.items.map((i) => (i.id === id ? { ...i, quantity: qty } : i)),
        })),
      clear: () => set({ items: [] }),
      total: () => get().items.reduce((sum, i) => sum + i.price * i.quantity, 0),
      count: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
    }),
    { name: 'cap-cart' }
  )
)
