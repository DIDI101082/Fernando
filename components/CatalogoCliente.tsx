"use client";

import { useState } from "react";
import Image from "next/image";

type Producto = {
  id: number;
  nombre: string;
  descripcion: string | null;
  precio: number | null;
  precio_oferta: number | null;
  categoria_id: number | null;
  imagen_url: string | null;
  disponible: boolean;
};

type Categoria = {
  id: number;
  nombre: string;
  slug: string;
};

const WA_NUMBER = process.env.NEXT_PUBLIC_WA_NUMBER ?? "5491100000000";

function waLink(producto: Producto) {
  const precio = producto.precio_oferta ?? producto.precio;
  const texto = `Hola! Me interesa el producto: *${producto.nombre}*${precio ? ` ($${Number(precio).toLocaleString("es-AR")})` : ""}. ¿Está disponible?`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(texto)}`;
}

export default function CatalogoCliente({
  productos,
  categorias,
}: {
  productos: Producto[];
  categorias: Categoria[];
}) {
  const [catActiva, setCatActiva] = useState<number | null>(null);

  const filtrados = catActiva
    ? productos.filter((p) => p.categoria_id === catActiva)
    : productos;

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Header */}
      <header className="bg-white border-b border-stone-200 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <h1 className="font-display text-xl font-bold text-stone-800">
            🛒 Catálogo
          </h1>
        </div>
      </header>

      {/* Filtros */}
      {categorias.length > 0 && (
        <div className="bg-white border-b border-stone-100">
          <div className="max-w-6xl mx-auto px-4 py-3 flex gap-2 overflow-x-auto">
            <button
              onClick={() => setCatActiva(null)}
              className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                catActiva === null
                  ? "bg-orange-500 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200"
              }`}
            >
              Todos
            </button>
            {categorias.map((c) => (
              <button
                key={c.id}
                onClick={() => setCatActiva(c.id)}
                className={`shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${
                  catActiva === c.id
                    ? "bg-orange-500 text-white"
                    : "bg-stone-100 text-stone-600 hover:bg-stone-200"
                }`}
              >
                {c.nombre}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Grid */}
      <main className="max-w-6xl mx-auto px-4 py-8">
        {filtrados.length === 0 ? (
          <p className="text-center text-stone-400 py-20">
            No hay productos en esta categoría.
          </p>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {filtrados.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden flex flex-col"
              >
                {/* Imagen */}
                <div className="aspect-square bg-stone-100 relative">
                  {p.imagen_url ? (
                    <Image
                      src={p.imagen_url}
                      alt={p.nombre}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-4xl">
                      🛍️
                    </div>
                  )}
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col flex-1">
                  <p className="font-medium text-stone-800 text-sm leading-tight mb-1">
                    {p.nombre}
                  </p>
                  {p.descripcion && (
                    <p className="text-xs text-stone-400 mb-2 line-clamp-2">
                      {p.descripcion}
                    </p>
                  )}
                  <div className="mt-auto">
                    {p.precio != null && (
                      <div className="mb-2">
                        {p.precio_oferta != null ? (
                          <div className="flex items-baseline gap-1.5">
                            <span className="font-bold text-orange-500 text-base">
                              ${Number(p.precio_oferta).toLocaleString("es-AR")}
                            </span>
                            <span className="text-xs text-stone-400 line-through">
                              ${Number(p.precio).toLocaleString("es-AR")}
                            </span>
                          </div>
                        ) : (
                          <span className="font-bold text-stone-800 text-base">
                            ${Number(p.precio).toLocaleString("es-AR")}
                          </span>
                        )}
                      </div>
                    )}
                    <a
                      href={waLink(p)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="block w-full text-center py-2 bg-green-500 hover:bg-green-600 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      Pedir por WhatsApp
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Botón WhatsApp flotante */}
      <a
        href={`https://wa.me/${WA_NUMBER}`}
        target="_blank"
        rel="noopener noreferrer"
        className="fixed bottom-6 right-6 w-14 h-14 bg-green-500 hover:bg-green-600 text-white rounded-full shadow-lg flex items-center justify-center text-2xl transition-colors z-20"
        title="Contactar por WhatsApp"
      >
        💬
      </a>
    </div>
  );
}
