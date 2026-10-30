"use client";

import { useState } from "react";
import Image from "next/image";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  categoria: string | null;
  imagen_url: string | null;
  disponible: boolean;
};

type Categoria = {
  id: number;
  nombre: string;
  slug: string;
};

const WA = process.env.NEXT_PUBLIC_WA_NUMBER ?? "5491100000000";

function waLink(producto: Producto) {
  const msg = encodeURIComponent(`Hola! Me interesa el producto: *${producto.nombre}*. ¿Me podés dar más info?`);
  return `https://wa.me/${WA}?text=${msg}`;
}

export default function CatalogoCliente({ productos, categorias }: { productos: Producto[]; categorias: Categoria[] }) {
  const [cat, setCat] = useState<string | null>(null);

  const filtrados = cat ? productos.filter((p) => p.categoria === cat) : productos;

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white border-b border-stone-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-xl font-bold text-stone-800">🛒 Catálogo</h1>
            <p className="text-xs text-stone-400 hidden sm:block">Productos frescos y de calidad</p>
          </div>
          <a
            href={`https://wa.me/${WA}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary text-xs sm:text-sm"
          >
            <WhatsAppIcon /> Contactar
          </a>
        </div>
      </header>

      {/* Categorías */}
      {categorias.length > 0 && (
        <div className="bg-white border-b border-stone-100">
          <div className="max-w-5xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
            <button
              onClick={() => setCat(null)}
              className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                cat === null ? "bg-brand-500 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Todos
            </button>
            {categorias.map((c) => (
              <button
                key={c.id}
                onClick={() => setCat(c.slug)}
                className={`shrink-0 px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  cat === c.slug ? "bg-brand-500 text-white" : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grilla */}
      <main className="max-w-5xl mx-auto px-4 py-8">
        {filtrados.length === 0 ? (
          <p className="text-center text-stone-400 py-16">No hay productos en esta categoría.</p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtrados.map((p) => (
              <div key={p.id} className="card overflow-hidden flex flex-col">
                {/* Imagen */}
                <div className="aspect-square bg-stone-100 relative">
                  {p.imagen_url ? (
                    <Image src={p.imagen_url} alt={p.nombre} fill className="object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">🥗</div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1 gap-1">
                  <p className="font-semibold text-stone-800 text-sm leading-tight">{p.nombre}</p>
                  {p.descripcion && (
                    <p className="text-xs text-stone-400 leading-snug line-clamp-2">{p.descripcion}</p>
                  )}
                  <div className="mt-auto pt-2 flex items-center justify-between gap-2">
                    {p.precio != null ? (
                      <span className="font-display font-bold text-brand-600 text-sm">
                        ${p.precio.toLocaleString("es-AR")}
                      </span>
                    ) : (
                      <span className="text-xs text-stone-400">Consultar</span>
                    )}
                    <a
                      href={waLink(p)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="shrink-0 inline-flex items-center gap-1 bg-green-500 hover:bg-green-600 text-white text-xs font-medium px-2 py-1 rounded-lg transition-colors"
                    >
                      <WhatsAppIcon size={12} /> Pedir
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Botón flotante WhatsApp */}
      <a
        href={`https://wa.me/${WA}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white font-medium text-sm px-4 py-3 rounded-full shadow-lg transition-colors"
      >
        <WhatsAppIcon size={20} /> WhatsApp
      </a>
    </div>
  );
}

function WhatsAppIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
    </svg>
  );
}
