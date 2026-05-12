'use client'

import { create } from 'zustand'
import { CartItem } from './cartStore'

export type ConsumptionMode = 'salon' | 'takeaway'
export type PaymentMethod = 'gateway' | 'presencial'

export interface ConfirmedOrder {
  id: string
  items: CartItem[]
  total: number
  mode: ConsumptionMode
  payment: PaymentMethod
  createdAt: string
  qrDataUrl?: string
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
