import { createClient } from "@/lib/supabase/server";
import Link from "next/link";
import AccionesProducto from "@/components/AccionesProducto";

export default async function AdminPage() {
  const sb = createClient();
  const { data: productos } = await sb
    .from("productos")
    .select("id, nombre, categoria, precio, disponible")
    .order("categoria")
    .order("nombre");

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-stone-800">Productos</h1>
        <Link href="/" className="btn-ghost text-sm" target="_blank">Ver sitio ↗</Link>
      </div>

      {!productos?.length ? (
        <div className="card p-10 text-center">
          <p className="text-stone-400 mb-4">No hay productos todavía.</p>
          <Link href="/admin/nuevo" className="btn-primary">Agregar el primero</Link>
        </div>
      ) : (
        <div className="card divide-y divide-stone-100 overflow-hidden">
          {productos.map((p) => (
            <div key={p.id} className="flex items-center gap-4 px-5 py-3">
              <div className="flex-1 min-w-0">
                <p className="font-medium text-stone-800 text-sm">{p.nombre}</p>
                <p className="text-xs text-stone-400">{p.categoria ?? "Sin categoría"}</p>
              </div>
              <span className="text-sm text-stone-600 tabular-nums whitespace-nowrap">
                {p.precio != null ? `$${p.precio.toLocaleString("es-AR")}` : "—"}
              </span>
              <span className={`badge ${p.disponible ? "bg-green-50 text-green-700" : "bg-stone-100 text-stone-400"}`}>
                {p.disponible ? "Activo" : "Oculto"}
              </span>
              <Link href={`/admin/${p.id}/editar`} className="btn-ghost text-xs">Editar</Link>
              <AccionesProducto id={p.id} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
