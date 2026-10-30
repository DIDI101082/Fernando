import { createClient } from "@/lib/supabase/server";
import ProductoForm from "@/components/ProductoForm";

export const dynamic = "force-dynamic";

export default async function NuevoProducto() {
  const { data: categorias } = await createClient().from("categorias").select("id, nombre, slug").order("orden").order("nombre");

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-stone-800">Nuevo producto</h1>
      <div className="card p-6">
        <ProductoForm categorias={categorias ?? []} />
      </div>
    </div>
  );
}
