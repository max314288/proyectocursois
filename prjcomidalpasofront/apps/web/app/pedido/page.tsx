'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useMemo, useState } from 'react'
import { useCart } from '@/store/cartStore'
import { useRestauranteStore } from '@/store/restauranteStore'
import { cargarCatalogo } from '@/lib/services/catalogoService'
import type { ItemCartaDTO, OpcionArmaPlatoDTO } from '@/lib/services/restauranteApiService'
import { formatearPrecioSoles } from '@/lib/services/restauranteService'
import {
  calcularPrecioBowl,
  puedeAvanzarPaso,
  toggleOpcion,
  seleccionACartItem,
  estaSeleccionado,
  agruparOpcionesPorTipo,
  imagenOpcion,
  ORDEN_TIPOS,
  LABEL_TIPO,
  esTipoMultiple,
  BOWL_SELECTION_INICIAL,
  type BowlSelection,
} from '@/lib/services/pedidoService'
import { Check, ChevronRight, ShoppingBag, RefreshCw } from 'lucide-react'

export default function PedidoPage() {
  const restaurante = useRestauranteStore((s) => s.restaurante)
  const { add, count } = useCart()
  const cartCount = count()

  const [mounted, setMounted] = useState(false)
  const [armaPlatoItem, setArmaPlatoItem] = useState<ItemCartaDTO | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  const [step, setStep] = useState(0)
  const [sel, setSel] = useState<BowlSelection>(BOWL_SELECTION_INICIAL)
  const [bowlAdded, setBowlAdded] = useState(false)

  useEffect(() => setMounted(true), [])

  async function cargar() {
    if (!restaurante) return
    setLoading(true)
    setError(false)
    const data = await cargarCatalogo(restaurante.id)
    setLoading(false)
    if (!data) {
      setError(true)
      return
    }
    setArmaPlatoItem(data.items.find((i) => i.esArmaPlato && i.disponible) ?? null)
  }

  useEffect(() => {
    if (restaurante) cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [restaurante])

  const opcionesPorTipo = useMemo(
    () => (armaPlatoItem ? agruparOpcionesPorTipo(armaPlatoItem.opcionesArmaPlato) : {}),
    [armaPlatoItem]
  )
  const tipos = useMemo(
    () => ORDEN_TIPOS.filter((t) => (opcionesPorTipo[t]?.length ?? 0) > 0),
    [opcionesPorTipo]
  )
  const tiposObligatorios = useMemo(() => tipos.filter((t) => t !== 'topping'), [tipos])

  function selectOpcion(tipo: string, item: OpcionArmaPlatoDTO) {
    setSel((prev) => toggleOpcion(prev, tipo, item))
  }

  function addBowlToCart() {
    if (!armaPlatoItem || !restaurante) return
    const cartItem = seleccionACartItem(armaPlatoItem, restaurante.id, sel, tiposObligatorios)
    if (!cartItem) return
    add(cartItem)
    setSel(BOWL_SELECTION_INICIAL)
    setStep(0)
    setBowlAdded(true)
    setTimeout(() => setBowlAdded(false), 3000)
  }

  const currentTipo = tipos[step]

  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      {/* Header */}
      <div className="flex items-start justify-between mb-10">
        <div>
          <p className="text-xs uppercase tracking-[0.22em] font-semibold mb-2" style={{ color: 'var(--color-secondary)' }}>
            Personaliza tu plato
          </p>
          <h1 style={{ fontFamily: 'var(--font-newsreader)', fontSize: 'clamp(1.75rem, 4vw, 2.5rem)', fontWeight: 600 }}>
            Arma tu Pedido
          </h1>
        </div>

        <Link
          href="/carrito"
          className="relative flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-colors hover:opacity-90"
          style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}
        >
          <ShoppingBag size={16} />
          Ver carrito
          {cartCount > 0 && (
            <span
              className="w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center"
              style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
            >
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {mounted && !restaurante && (
        <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: 'var(--color-surface-container)' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
            Aún no has elegido un restaurante.
          </p>
          <Link
            href="/restaurantes"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
          >
            Ver restaurantes
          </Link>
        </div>
      )}

      {restaurante && loading && (
        <div className="rounded-2xl h-96 animate-pulse" style={{ backgroundColor: 'var(--color-surface-container)' }} />
      )}

      {restaurante && !loading && error && (
        <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: 'var(--color-surface-container)' }}>
          <p className="text-sm mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
            No pudimos cargar las opciones para armar tu plato.
          </p>
          <button
            onClick={cargar}
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
            style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
          >
            <RefreshCw size={14} />
            Reintentar
          </button>
        </div>
      )}

      {restaurante && !loading && !error && !armaPlatoItem && (
        <div className="rounded-2xl p-10 text-center" style={{ backgroundColor: 'var(--color-surface-container)' }}>
          <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
            {restaurante.nombre} no ofrece la opción de armar tu propio plato por ahora.
          </p>
        </div>
      )}

      {restaurante && !loading && !error && armaPlatoItem && tipos.length > 0 && (
        <>
          {/* Bowl added toast */}
          {bowlAdded && (
            <div className="mb-6 rounded-2xl p-4 flex items-center justify-between" style={{ backgroundColor: 'var(--color-secondary-container)' }}>
              <div className="flex items-center gap-3">
                <div
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }}
                >
                  <Check size={16} />
                </div>
                <p className="text-sm font-medium" style={{ color: 'var(--color-on-secondary-container)' }}>
                  ¡Plato agregado al carrito!
                </p>
              </div>
              <Link href="/carrito" className="text-sm font-semibold underline underline-offset-2" style={{ color: 'var(--color-on-secondary-container)' }}>
                Ver carrito →
              </Link>
            </div>
          )}

          {/* Step progress */}
          <div className="flex items-center gap-2 mb-8">
            {tipos.map((tipo, i) => (
              <div key={tipo} className="flex items-center gap-2 flex-1">
                <button onClick={() => i < step && setStep(i)} className="flex items-center gap-2">
                  <span
                    className="w-8 h-8 rounded-full text-sm font-bold flex items-center justify-center shrink-0 transition-colors"
                    style={
                      i === step
                        ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }
                        : i < step
                        ? { backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }
                        : { backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)' }
                    }
                  >
                    {i < step ? <Check size={14} /> : i + 1}
                  </span>
                  <span
                    className="text-sm font-medium hidden sm:block"
                    style={{ color: i === step ? 'var(--color-on-surface)' : 'var(--color-on-surface-variant)' }}
                  >
                    {LABEL_TIPO[tipo]}
                  </span>
                </button>
                {i < tipos.length - 1 && (
                  <div
                    className="flex-1 h-px"
                    style={{ backgroundColor: i < step ? 'var(--color-secondary)' : 'var(--color-outline-variant)' }}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step card */}
          <div className="rounded-2xl p-6 shadow-ambient" style={{ backgroundColor: 'var(--color-surface)' }}>
            <h2 className="mb-1" style={{ fontFamily: 'var(--font-newsreader)', fontSize: '1.4rem', fontWeight: 500 }}>
              Paso {step + 1}: Elige tu {LABEL_TIPO[currentTipo]}
            </h2>
            {esTipoMultiple(currentTipo) && (
              <p className="text-sm mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
                Puedes elegir uno o varios.
              </p>
            )}

            <div
              className={`grid gap-4 mt-5 ${
                (opcionesPorTipo[currentTipo]?.length ?? 0) <= 3 ? 'grid-cols-1 sm:grid-cols-3' : 'grid-cols-2 sm:grid-cols-4'
              }`}
            >
              {(opcionesPorTipo[currentTipo] ?? []).map((opcion) => {
                const isSelected = estaSeleccionado(sel, currentTipo, opcion.itemId)
                return (
                  <button
                    key={opcion.itemId}
                    disabled={!opcion.disponible}
                    onClick={() => selectOpcion(currentTipo, opcion)}
                    className="rounded-xl overflow-hidden text-left transition-all duration-200 focus:outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      border: isSelected ? '2px solid var(--color-primary)' : '2px solid var(--color-outline-variant)',
                      boxShadow: isSelected ? '0 0 0 3px rgba(130,59,24,0.12)' : 'none',
                    }}
                  >
                    <div className="relative h-32">
                      <Image src={imagenOpcion(opcion)} alt={opcion.nombre} fill className="object-cover" />
                      {isSelected && (
                        <div
                          className="absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }}
                        >
                          <Check size={13} />
                        </div>
                      )}
                    </div>
                    <div className="p-3">
                      <p className="text-sm font-medium leading-tight">{opcion.nombre}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--color-on-surface-variant)' }}>
                        {opcion.precioExtra === 0 ? 'Incluido' : `+ ${formatearPrecioSoles(opcion.precioExtra)}`}
                      </p>
                    </div>
                  </button>
                )
              })}
            </div>

            {/* Nav buttons */}
            <div className="flex items-center justify-between mt-8 pt-6" style={{ borderTop: '1px solid var(--color-outline-variant)' }}>
              {step > 0 ? (
                <button
                  onClick={() => setStep(step - 1)}
                  className="text-sm font-medium px-5 py-2 rounded-full transition-colors"
                  style={{ backgroundColor: 'var(--color-surface-container)', color: 'var(--color-on-surface)' }}
                >
                  ← Anterior
                </button>
              ) : (
                <div />
              )}

              {step < tipos.length - 1 ? (
                <button
                  onClick={() => puedeAvanzarPaso(currentTipo, sel) && setStep(step + 1)}
                  disabled={!puedeAvanzarPaso(currentTipo, sel)}
                  className="flex items-center gap-2 text-sm font-semibold px-6 py-2 rounded-full transition-all"
                  style={
                    puedeAvanzarPaso(currentTipo, sel)
                      ? { backgroundColor: 'var(--color-primary)', color: 'var(--color-on-primary)' }
                      : { backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)', cursor: 'not-allowed' }
                  }
                >
                  Siguiente <ChevronRight size={15} />
                </button>
              ) : (
                <button
                  onClick={addBowlToCart}
                  disabled={!puedeAvanzarPaso(currentTipo, sel)}
                  className="flex items-center gap-2 text-sm font-semibold px-6 py-2 rounded-full transition-all"
                  style={
                    puedeAvanzarPaso(currentTipo, sel)
                      ? { backgroundColor: 'var(--color-secondary)', color: 'var(--color-on-secondary)' }
                      : { backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface-variant)', cursor: 'not-allowed' }
                  }
                >
                  <ShoppingBag size={15} /> Agregar al carrito
                </button>
              )}
            </div>
          </div>

          {/* Bowl in-progress summary */}
          {(sel.base || sel.proteina || sel.toppings.length > 0 || sel.bebida) && (
            <div className="mt-4 rounded-xl p-4 text-sm" style={{ backgroundColor: 'var(--color-surface-container-low)' }}>
              <p className="font-medium mb-2" style={{ color: 'var(--color-on-surface)' }}>
                Tu plato en progreso:
              </p>
              <div className="flex flex-wrap gap-2">
                {sel.base && (
                  <span
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
                  >
                    Base: {sel.base.nombre}
                  </span>
                )}
                {sel.proteina && (
                  <span
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ backgroundColor: 'var(--color-primary-container)', color: 'var(--color-on-primary-container)' }}
                  >
                    {sel.proteina.nombre}
                  </span>
                )}
                {sel.toppings.map((t) => (
                  <span
                    key={t.itemId}
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ backgroundColor: 'var(--color-secondary-container)', color: 'var(--color-on-secondary-container)' }}
                  >
                    {t.nombre}
                  </span>
                ))}
                {sel.bebida && (
                  <span
                    className="px-3 py-1 rounded-full text-xs"
                    style={{ backgroundColor: 'var(--color-surface-container-high)', color: 'var(--color-on-surface)' }}
                  >
                    {sel.bebida.nombre}
                  </span>
                )}
              </div>
              <p className="mt-3 font-bold" style={{ color: 'var(--color-primary)' }}>
                Precio: {formatearPrecioSoles(calcularPrecioBowl(armaPlatoItem, sel))}
              </p>
            </div>
          )}
        </>
      )}
    </div>
  )
}
