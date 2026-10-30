export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AccionesProducto from "@/components/AccionesProducto";

export default async function AdminPage() {
  const sb = createClient();
  const { data: productos } = await sb
    .from("productos")
    .select("id, nombre, categoria_id, precio, precio_oferta, disponible")
    .order("orden")
    .order("nombre");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-stone-800">Productos</h1>
        <Link
          href="/admin/nuevo"
          className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors"
        >
          + Nuevo
        </Link>
      </div>

      {!productos?.length ? (
        <div className="bg-white rounded-2xl border border-stone-100 p-12 text-center">
          <p className="text-stone-400 mb-4">No hay productos todavía.</p>
          <Link href="/admin/nuevo" className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-lg hover:bg-orange-600 transition-colors">
            Agregar el primero
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-100 overflow-hidden">
          {productos.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-800 text-sm">{p.nombre}</p>
                <p className="text-xs text-stone-400">Cat. {p.categoria_id ?? "—"}</p>
              </div>
              <span className="text-sm text-stone-600 tabular-nums whitespace-nowrap">
                {p.precio != null
                  ? `$${Number(p.precio).toLocaleString("es-AR")}`
                  : "—"}
              </span>
              {p.precio_oferta != null && (
                <span className="text-xs text-orange-500 font-medium tabular-nums">
                  Oferta: ${Number(p.precio_oferta).toLocaleString("es-AR")}
                </span>
              )}
              <span
                className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                  p.disponible
                    ? "bg-green-50 text-green-700"
                    : "bg-stone-100 text-stone-400"
                }`}
              >
                {p.disponible ? "Activo" : "Oculto"}
              </span>
              <Link
                href={`/admin/${p.id}/editar`}
                className="text-xs px-3 py-1.5 rounded-lg text-stone-600 border border-stone-200 hover:bg-stone-50 transition-colors"
              >
                Editar
              </Link>
              <AccionesProducto id={p.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
