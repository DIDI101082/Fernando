import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import ProductoForm from "@/components/ProductoForm";

export const dynamic = "force-dynamic";

export default async function EditarProducto({ params }: { params: { id: string } }) {
  const sb = createClient();
  const [{ data: producto }, { data: categorias }] = await Promise.all([
    sb.from("productos").select("*").eq("id", params.id).single(),
    sb.from("categorias").select("id, nombre, slug").order("orden").order("nombre"),
  ]);

  if (!producto) notFound();

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-stone-800">Editar producto</h1>
      <div className="card p-6">
        <ProductoForm categorias={categorias ?? []} inicial={producto} />
      </div>
    </div>
  );
}
