export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import CatalogoCliente from "@/components/CatalogoCliente";

export default async function Home() {
  const sb = createClient();

  const [{ data: productos }, { data: categorias }] = await Promise.all([
    sb
      .from("productos")
      .select("id, nombre, descripcion, precio, precio_oferta, categoria_id, imagen_url, disponible")
      .eq("disponible", true)
      .order("orden")
      .order("nombre"),
    sb
      .from("categorias")
      .select("id, nombre, slug")
      .order("orden")
      .order("nombre"),
  ]);

  return (
    <CatalogoCliente
      productos={productos ?? []}
      categorias={categorias ?? []}
    />
  );
}
