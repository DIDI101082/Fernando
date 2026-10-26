'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Producto, Categoria, ShopConfig } from '@/lib/types'
import { waLink, formatPrecio } from '@/lib/wa'

interface CatalogoData {
  config: ShopConfig
  categorias: Categoria[]
  productos: Producto[]
}

export default function CatalogoPage() {
  const [data, setData] = useState<CatalogoData | null>(null)
  const [catActiva, setCatActiva] = useState<number | null>(null)
  const [buscar, setBuscar] = useState('')
  const [modal, setModal] = useState<Producto | null>(null)

  useEffect(() => {
    supabase.rpc('shop_catalogo').then(({ data: d }) => {
      if (d) setData(d as CatalogoData)
    })
  }, [])

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#0a0a0a' }}>
        <div className="w-6 h-6 rounded-full border-2 border-amber-500 border-t-transparent animate-spin" />
      </div>
    )
  }

  const { config, categorias, productos } = data
  const acento = config.color_acento || '#f59e0b'

  const productosFiltrados = productos.filter(p => {
    const matchCat = catActiva === null || p.categoria_id === catActiva
    const matchBuscar = !buscar || p.nombre.toLowerCase().includes(buscar.toLowerCase())
    return matchCat && matchBuscar
  })

  return (
    <div className="min-h-screen" style={{ background: '#0a0a0a' }}>
      {/* Header */}
      <header style={{ background: '#141414', borderBottom: '1px solid #2a2a2a' }}>
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">{config.nombre_negocio}</h1>
            {config.descripcion_negocio && (
              <p className="text-xs mt-0.5" style={{ color: '#666' }}>{config.descripcion_negocio}</p>
            )}
          </div>
          <div className="flex items-center gap-3">
            {config.instagram && (
              <a href={`https://instagram.com/${config.instagram.replace('@', '')}`} target="_blank" rel="noopener"
                className="text-xs transition-colors" style={{ color: '#666' }}
                onMouseEnter={e => e.currentTarget.style.color = '#fff'}
                onMouseLeave={e => e.currentTarget.style.color = '#666'}>
                @{config.instagram.replace('@', '')}
              </a>
            )}
            <a
              href={`https://wa.me/${config.whatsapp}`}
              target="_blank" rel="noopener"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-sm font-medium text-white transition-opacity hover:opacity-90"
              style={{ background: '#25D366' }}>
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.117 1.523 5.847L0 24l6.338-1.5A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.661-.492-5.2-1.355l-.374-.215-3.863.913.975-3.758-.234-.385A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Contactar
            </a>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto px-4 py-6">
        {/* Búsqueda */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Buscar productos..."
            value={buscar}
            onChange={e => setBuscar(e.target.value)}
            className="w-full max-w-md px-4 py-2.5 rounded-xl text-sm text-white outline-none"
            style={{ background: '#1c1c1c', border: '1px solid #2a2a2a' }}
          />
        </div>

        {/* Categorías */}
        {categorias.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-8">
            <button
              onClick={() => setCatActiva(null)}
              className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
              style={{
                background: catActiva === null ? acento : '#1c1c1c',
                color: catActiva === null ? '#000' : '#999',
                border: catActiva === null ? `1px solid ${acento}` : '1px solid #2a2a2a',
              }}>
              Todo
            </button>
            {categorias.map(c => (
              <button
                key={c.id}
                onClick={() => setCatActiva(c.id === catActiva ? null : c.id)}
                className="px-4 py-1.5 rounded-full text-sm font-medium transition-colors"
                style={{
                  background: catActiva === c.id ? acento : '#1c1c1c',
                  color: catActiva === c.id ? '#000' : '#999',
                  border: catActiva === c.id ? `1px solid ${acento}` : '1px solid #2a2a2a',
                }}>
                {c.nombre}
              </button>
            ))}
          </div>
        )}

        {/* Grid de productos */}
        {productosFiltrados.length === 0 ? (
          <div className="py-20 text-center" style={{ color: '#444' }}>
            <p>No se encontraron productos.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {productosFiltrados.map(p => (
              <ProductCard key={p.id} producto={p} config={config} onVerDetalle={() => setModal(p)} />
            ))}
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="mt-16 py-8 text-center text-xs" style={{ color: '#444', borderTop: '1px solid #1c1c1c' }}>
        © {new Date().getFullYear()} {config.nombre_negocio}
        {config.whatsapp && (
          <span> · <a href={`https://wa.me/${config.whatsapp}`} target="_blank" rel="noopener" style={{ color: '#25D366' }}>WhatsApp</a></span>
        )}
      </footer>

      {/* Modal detalle */}
      {modal && (
        <ProductModal producto={modal} config={config} onClose={() => setModal(null)} />
      )}
    </div>
  )
}

function ProductCard({ producto: p, config, onVerDetalle }: {
  producto: Producto
  config: ShopConfig
  onVerDetalle: () => void
}) {
  const precio = p.precio_descuento ?? p.precio
  const acento = config.color_acento || '#f59e0b'

  return (
    <div
      className="rounded-2xl overflow-hidden cursor-pointer group transition-transform hover:-translate-y-0.5"
      style={{ background: '#1c1c1c', border: '1px solid #2a2a2a' }}
      onClick={onVerDetalle}
    >
      {/* Imagen */}
      <div className="relative w-full aspect-square overflow-hidden" style={{ background: '#141414' }}>
        {p.imagen_url ? (
          <Image src={p.imagen_url} alt={p.nombre} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-3xl" style={{ color: '#2a2a2a' }}>
            🛍
          </div>
        )}
        {p.precio_descuento && (
          <span className="absolute top-2 left-2 text-xs font-bold px-2 py-0.5 rounded-full"
            style={{ background: acento, color: '#000' }}>
            OFERTA
          </span>
        )}
      </div>
      {/* Info */}
      <div className="p-3">
        <p className="text-sm font-semibold text-white line-clamp-2 mb-1">{p.nombre}</p>
        {p.categoria_nombre && (
          <p className="text-xs mb-2" style={{ color: '#555' }}>{p.categoria_nombre}</p>
        )}
        <div className="flex items-center justify-between gap-2">
          <div>
            <span className="text-base font-bold" style={{ color: acento }}>
              {formatPrecio(precio, config.moneda)}
            </span>
            {p.precio_descuento && (
              <span className="text-xs ml-1.5 line-through" style={{ color: '#555' }}>
                {formatPrecio(p.precio, config.moneda)}
              </span>
            )}
          </div>
          <a
            href={waLink(p, config)}
            target="_blank" rel="noopener"
            onClick={e => e.stopPropagation()}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-white transition-opacity hover:opacity-90"
            style={{ background: '#25D366', whiteSpace: 'nowrap' }}>
            <svg className="w-3.5 h-3.5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
              <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.117 1.523 5.847L0 24l6.338-1.5A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.661-.492-5.2-1.355l-.374-.215-3.863.913.975-3.758-.234-.385A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
            </svg>
            Pedir
          </a>
        </div>
      </div>
    </div>
  )
}

function ProductModal({ producto: p, config, onClose }: { producto: Producto; config: ShopConfig; onClose: () => void }) {
  const precio = p.precio_descuento ?? p.precio
  const acento = config.color_acento || '#f59e0b'

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.85)' }}
      onClick={onClose}>
      <div
        className="w-full max-w-lg rounded-3xl overflow-hidden"
        style={{ background: '#1c1c1c', border: '1px solid #2a2a2a' }}
        onClick={e => e.stopPropagation()}>
        {p.imagen_url && (
          <div className="relative w-full" style={{ aspectRatio: '16/9', background: '#141414' }}>
            <Image src={p.imagen_url} alt={p.nombre} fill className="object-cover" />
          </div>
        )}
        <div className="p-5">
          {p.categoria_nombre && (
            <p className="text-xs mb-1" style={{ color: '#555' }}>{p.categoria_nombre}</p>
          )}
          <h2 className="text-xl font-bold text-white mb-2">{p.nombre}</h2>
          {p.descripcion && (
            <p className="text-sm mb-4" style={{ color: '#999' }}>{p.descripcion}</p>
          )}
          <div className="flex items-center justify-between">
            <div>
              <span className="text-2xl font-bold" style={{ color: acento }}>{formatPrecio(precio, config.moneda)}</span>
              {p.precio_descuento && (
                <span className="text-sm ml-2 line-through" style={{ color: '#555' }}>{formatPrecio(p.precio, config.moneda)}</span>
              )}
            </div>
            <a
              href={waLink(p, config)}
              target="_blank" rel="noopener"
              className="flex items-center gap-2 px-5 py-3 rounded-xl font-semibold text-white text-sm transition-opacity hover:opacity-90"
              style={{ background: '#25D366' }}>
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                <path d="M12 0C5.373 0 0 5.373 0 12c0 2.122.554 4.117 1.523 5.847L0 24l6.338-1.5A11.954 11.954 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.89 0-3.661-.492-5.2-1.355l-.374-.215-3.863.913.975-3.758-.234-.385A10 10 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
              </svg>
              Pedir por WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
