'use client'

import { create } from 'zustand'
import { CartItem } from './cartStore'

export type ConsumptionMode = 'salon' | 'recojo'
export type PaymentMethod = 'efectivo' | 'tarjeta'

export interface ConfirmedOrder {
  id: string
  items: CartItem[]
  total: number
  modo: ConsumptionMode
  metodo: PaymentMethod
  codigoQr: string | null
  referenciaExterna?: string
  createdAt: string
}

interface OrderStore {
  order: ConfirmedOrder | null
  set: (order: ConfirmedOrder) => void
  clear: () => void
}

export const useOrderStore = create<OrderStore>((setState) => ({
  order: null,
  set: (order) => setState({ order }),
  clear: () => setState({ order: null }),
}))
