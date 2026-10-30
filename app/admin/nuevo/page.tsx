export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import ProductoForm from "@/components/ProductoForm";

export default async function NuevoProducto() {
  const sb = createClient();
  const { data: categorias } = await sb
    .from("categorias")
    .select("id, nombre, slug")
    .order("orden")
    .order("nombre");

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-stone-800">Nuevo producto</h1>
      <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-6">
        <ProductoForm categorias={categorias ?? []} />
      </div>
    </div>
  );
}
