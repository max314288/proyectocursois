'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import {
  ArrowLeft, MapPin, Phone, ShoppingBag, Bike, UtensilsCrossed,
  Check, RefreshCw, X, Layers,
} from 'lucide-react'
import { useCart } from '@/store/cartStore'
import { useRestauranteStore } from '@/store/restauranteStore'
import {
  cargarCarta,
  getServicios,
  filtrarItemsPorCategoria,
  formatearPrecioSoles,
  itemACartItem,
  armaPlatoACartItem,
  calcularPrecioArmaPlato,
} from '@/lib/services/restauranteService'
import { getImagenItem } from '@/lib/services/imagenService'
import type {
  ElegirResponse,
  ItemCartaDTO,
  OpcionArmaPlatoDTO,
} from '@/lib/services/restauranteApiService'

const SERVICIO_ICONS = {
  Recojo: ShoppingBag,
  Delivery: Bike,
  'Salón': UtensilsCrossed,
} as const

// Tipos de opción que permiten selección múltiple
function esTipoMultiple(tipo: string): boolean {
  return tipo.toUpperCase().includes('TOPPING')
}

export default function RestauranteDetallePage() {
  const { id } = useParams<{ id: string }>()
  const add = useCart((s) => s.add)
  const seleccionar = useRestauranteStore((s) => s.seleccionar)

  const [data, setData] = useState<ElegirResponse | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)
  const [filter, setFilter] = useState('Todos')
  const [added, setAdded] = useState<string | null>(null)

  // picker arma-plato
  const [pickerItem, setPickerItem] = useState<ItemCartaDTO | null>(null)
  const [seleccion, setSeleccion] = useState<OpcionArmaPlatoDTO[]>([])

  async function cargar() {
    setLoading(true)
    setError(false)
    const res = await cargarCarta(id)
    setLoading(false)
    if (res === null) {
      setError(true)
    } else {
      setData(res)
      seleccionar({ id, nombre: res.restaurante.nombre })
    }
  }

  useEffect(() => {
    if (id) cargar()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  function handleAdd(item: ItemCartaDTO) {
    if (item.esArmaPlato) {
      setPickerItem(item)
      setSeleccion([])
      return
    }
    add(itemACartItem(item, id))
    setAdded(item.id)
    setTimeout(() => setAdded(null), 1800)
  }

  function toggleOpcion(opcion: OpcionArmaPlatoDTO) {
    setSeleccion((prev) => {
      const ya = prev.some((o) => o.itemId === opcion.itemId && o.tipo === opcion.tipo)
      if (ya) {
        return prev.filter((o) => !(o.itemId === opcion.itemId && o.tipo === opcion.tipo))
      }
      if (esTipoMultiple(opcion.tipo)) {
        return [...prev, opcion]
      }
      // selección única por tipo: reemplaza la opción previa del mismo tipo
      return [...prev.filter((o) => o.tipo !== opcion.tipo), opcion]
    })
  }

  function confirmarArmaPlato() {
    if (!pickerItem) return
    add(armaPlatoACartItem(pickerItem, id, seleccion))
    setAdded(pickerItem.id)
    setTimeout(() => setAdded(null), 1800)
    setPickerItem(null)
    setSeleccion([])
  }

  // categorías ordenadas + filtro
  const categorias = data
    ? [...data.categorias].sort((a, b) => a.orden - b.orden)
    : []
  const items = data ? filtrarItemsPorCategoria(data.items, filter) : []

  // opciones agrupadas por tipo para el picker
  const opcionesPorTipo = pickerItem
    ? pickerItem.opcionesArmaPlato.reduce<Record<string, OpcionArmaPlatoDTO[]>>((acc, o) => {
        (acc[o.tipo] ??= []).push(o)
        return acc
      }, {})
    : {}

  return (
    <div className="max-w-[1280px] mx-auto px-6 py-16">
      <Link
        href="/restaurantes"
        className="inline-flex items-center gap-2 text-sm mb-8 hover:opacity-70 transition-opacity"
        style={{ color: 'var(--color-on-surface-variant)' }}
      >
        <ArrowLeft size={15} />
        Volver a restaurantes
      </Link>

      {/* Loading */}
      {loading && (
        <div className="space-y-6">
          <div
            className="rounded-2xl h-32 animate-pulse"
            style={{ backgroundColor: 'var(--color-surface-container)' }}
          />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="rounded-2xl h-72 animate-pulse"
                style={{ backgroundColor: 'var(--color-surface-container)' }}
              />
            ))}
          </div>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div
          className="rounded-2xl p-10 text-center"
          style={{ backgroundColor: 'var(--color-surface-container)' }}
        >
          <p className="text-sm mb-4" style={{ color: 'var(--color-on-surface-variant)' }}>
            No pudimos cargar la carta de este restaurante.
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

      {!loading && !error && data && (
        <>
          {/* Header restaurante */}
          <div className="mb-12">
            <p
              className="text-xs uppercase tracking-[0.22em] font-semibold mb-3"
              style={{ color: 'var(--color-secondary)' }}
            >
              Carta del restaurante
            </p>
            <h1
              className="mb-4"
              style={{
                fontFamily: 'var(--font-newsreader)',
                fontSize: 'clamp(2rem, 5vw, 3rem)',
                fontWeight: 600,
                letterSpacing: '-0.01em',
              }}
            >
              {data.restaurante.nombre}
            </h1>
            <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
              <span className="inline-flex items-center gap-2">
                <MapPin size={15} />
                {data.restaurante.direccion}
              </span>
              {data.restaurante.telefono && (
                <span className="inline-flex items-center gap-2">
                  <Phone size={15} />
                  {data.restaurante.telefono}
                </span>
              )}
              <span className="flex gap-2">
                {getServicios(data.restaurante).map((s) => {
                  const Icon = SERVICIO_ICONS[s as keyof typeof SERVICIO_ICONS]
                  return (
                    <span
                      key={s}
                      className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        backgroundColor: 'var(--color-secondary-container)',
                        color: 'var(--color-on-secondary-container)',
                      }}
                    >
                      {Icon && <Icon size={12} />}
                      {s}
                    </span>
                  )
                })}
              </span>
            </div>
          </div>

          {/* Filtros de categoría */}
          <div className="flex gap-2 flex-wrap mb-10">
            {['Todos', ...categorias.map((c) => c.nombre)].map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-all duration-200"
                style={
                  filter === f
                    ? {
                        backgroundColor: 'var(--color-primary)',
                        color: 'var(--color-on-primary)',
                      }
                    : {
                        backgroundColor: 'var(--color-surface-container)',
                        color: 'var(--color-on-surface-variant)',
                      }
                }
              >
                {f}
              </button>
            ))}
          </div>

          {/* Grid de items */}
          {items.length === 0 ? (
            <div
              className="rounded-2xl p-10 text-center"
              style={{ backgroundColor: 'var(--color-surface-container)' }}
            >
              <p className="text-sm" style={{ color: 'var(--color-on-surface-variant)' }}>
                No hay platos en esta categoría.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {items.map((item) => (
                <article
                  key={item.id}
                  className={`rounded-2xl overflow-hidden shadow-ambient group flex flex-col ${
                    !item.disponible ? 'opacity-60' : ''
                  }`}
                  style={{ backgroundColor: 'var(--color-surface)' }}
                >
                  <div className="relative overflow-hidden h-52 shrink-0">
                    <Image
                      src={item.imagenUrl ?? getImagenItem(item.nombre, item.categoria, item.id)}
                      alt={item.nombre}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    {item.esArmaPlato && (
                      <div
                        className="absolute top-4 left-4 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold"
                        style={{
                          backgroundColor: 'var(--color-primary)',
                          color: 'var(--color-on-primary)',
                        }}
                      >
                        <Layers size={12} />
                        Arma tu plato
                      </div>
                    )}
                  </div>

                  <div className="p-5 flex flex-col flex-1">
                    <h2
                      className="mb-1.5"
                      style={{
                        fontFamily: 'var(--font-newsreader)',
                        fontSize: '1.2rem',
                        fontWeight: 500,
                      }}
                    >
                      {item.nombre}
                    </h2>

                    {/* Etiquetas */}
                    {item.etiquetas.length > 0 && (
                      <div className="flex gap-1.5 flex-wrap mb-2">
                        {item.etiquetas.map((e) => (
                          <span
                            key={e.codigo}
                            className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                            style={{
                              backgroundColor: e.color ? `${e.color}22` : 'var(--color-secondary-container)',
                              color: e.color ?? 'var(--color-on-secondary-container)',
                            }}
                          >
                            {e.nombre}
                          </span>
                        ))}
                      </div>
                    )}

                    {item.descripcion && (
                      <p
                        className="text-sm leading-relaxed mb-3"
                        style={{ color: 'var(--color-on-surface-variant)' }}
                      >
                        {item.descripcion}
                      </p>
                    )}

                    {/* Componentes de menú compuesto */}
                    {item.esMenuCompuesto && item.componentes.length > 0 && (
                      <p
                        className="text-xs leading-relaxed mb-3"
                        style={{ color: 'var(--color-on-surface-variant)' }}
                      >
                        Incluye: {item.componentes.map((c) => c.nombre).join(' · ')}
                      </p>
                    )}

                    {item.pesoGramos != null && item.pesoGramos > 0 && (
                      <p className="text-xs mb-3" style={{ color: 'var(--color-on-surface-variant)' }}>
                        {item.pesoGramos} g
                      </p>
                    )}

                    <div className="flex items-center justify-between mt-auto pt-2">
                      <span
                        className="font-bold"
                        style={{ fontSize: '1.1rem', color: 'var(--color-primary)' }}
                      >
                        {formatearPrecioSoles(item.precio)}
                        {item.esArmaPlato && (
                          <span
                            className="block text-[11px] font-normal"
                            style={{ color: 'var(--color-on-surface-variant)' }}
                          >
                            precio base
                          </span>
                        )}
                      </span>
                      <button
                        onClick={() => handleAdd(item)}
                        disabled={!item.disponible}
                        className="flex items-center gap-2 px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 disabled:cursor-not-allowed"
                        style={
                          !item.disponible
                            ? {
                                backgroundColor: 'var(--color-surface-container)',
                                color: 'var(--color-on-surface-variant)',
                              }
                            : added === item.id
                            ? {
                                backgroundColor: 'var(--color-secondary)',
                                color: 'var(--color-on-secondary)',
                              }
                            : {
                                backgroundColor: 'var(--color-primary)',
                                color: 'var(--color-on-primary)',
                              }
                        }
                      >
                        {!item.disponible ? (
                          'No disponible'
                        ) : added === item.id ? (
                          <>
                            <Check size={14} /> Agregado
                          </>
                        ) : (
                          <>
                            <ShoppingBag size={14} /> Agregar
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Modal picker arma-plato ── */}
      {pickerItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}
          onClick={() => setPickerItem(null)}
        >
          <div
            className="w-full max-w-lg max-h-[85vh] overflow-y-auto rounded-2xl p-7 shadow-ambient"
            style={{ backgroundColor: 'var(--color-surface)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between mb-1">
              <h2
                style={{
                  fontFamily: 'var(--font-newsreader)',
                  fontSize: '1.5rem',
                  fontWeight: 500,
                }}
              >
                {pickerItem.nombre}
              </h2>
              <button
                onClick={() => setPickerItem(null)}
                className="p-1 hover:opacity-70 transition-opacity"
                style={{ color: 'var(--color-on-surface-variant)' }}
              >
                <X size={20} />
              </button>
            </div>
            <p className="text-sm mb-6" style={{ color: 'var(--color-on-surface-variant)' }}>
              Personaliza tu plato eligiendo las opciones.
            </p>

            {Object.entries(opcionesPorTipo).map(([tipo, opciones]) => (
              <div key={tipo} className="mb-6">
                <p
                  className="text-xs font-semibold uppercase tracking-widest mb-3"
                  style={{ color: 'var(--color-secondary)' }}
                >
                  {tipo}
                  {esTipoMultiple(tipo) && (
                    <span className="normal-case tracking-normal font-normal"> · elige varios</span>
                  )}
                </p>
                <div className="flex flex-col gap-2">
                  {opciones.map((o) => {
                    const activa = seleccion.some(
                      (s) => s.itemId === o.itemId && s.tipo === o.tipo,
                    )
                    return (
                      <button
                        key={`${o.tipo}-${o.itemId}`}
                        type="button"
                        disabled={!o.disponible}
                        onClick={() => toggleOpcion(o)}
                        className="flex items-center justify-between px-4 py-3 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        style={
                          activa
                            ? {
                                backgroundColor: 'var(--color-secondary-container)',
                                border: '1.5px solid var(--color-secondary)',
                                color: 'var(--color-on-secondary-container)',
                              }
                            : {
                                backgroundColor: 'var(--color-surface-container-low)',
                                border: '1.5px solid var(--color-outline-variant)',
                                color: 'var(--color-on-surface)',
                              }
                        }
                      >
                        <span className="flex items-center gap-2">
                          {activa && <Check size={14} />}
                          {o.nombre}
                          {!o.disponible && ' (no disponible)'}
                        </span>
                        <span className="font-semibold">
                          {o.precioExtra > 0 ? `+ ${formatearPrecioSoles(o.precioExtra)}` : 'Incluido'}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Total + confirmar */}
            <div
              className="flex items-center justify-between pt-5 mt-2"
              style={{ borderTop: '1px solid var(--color-outline-variant)' }}
            >
              <div>
                <p className="text-xs" style={{ color: 'var(--color-on-surface-variant)' }}>
                  Total
                </p>
                <p className="text-xl font-bold" style={{ color: 'var(--color-primary)' }}>
                  {formatearPrecioSoles(calcularPrecioArmaPlato(pickerItem, seleccion))}
                </p>
              </div>
              <button
                onClick={confirmarArmaPlato}
                className="flex items-center gap-2 px-7 py-3 rounded-full text-sm font-semibold hover:opacity-90 transition-opacity"
                style={{
                  backgroundColor: 'var(--color-primary)',
                  color: 'var(--color-on-primary)',
                }}
              >
                <ShoppingBag size={14} />
                Agregar al carrito
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
