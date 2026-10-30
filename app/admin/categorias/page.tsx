export const dynamic = "force-dynamic";

import { createClient } from "@/lib/supabase/server";
import AccionesCategoria from "@/components/AccionesCategoria";
import CategoriaForm from "@/components/CategoriaForm";

export default async function CategoriasPage() {
  const sb = createClient();
  const { data: categorias } = await sb
    .from("categorias")
    .select("id, nombre, slug, orden")
    .order("orden")
    .order("nombre");

  return (
    <div className="space-y-6">
      <h1 className="font-display text-2xl font-bold text-stone-800">Categorías</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Lista */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm divide-y divide-stone-100 overflow-hidden">
          {!categorias?.length ? (
            <p className="p-8 text-center text-stone-400 text-sm">Sin categorías todavía.</p>
          ) : (
            categorias.map((c) => (
              <div key={c.id} className="flex items-center gap-3 px-4 py-3">
                <span className="text-xs text-stone-400 w-6 text-center">{c.orden}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-stone-800">{c.nombre}</p>
                  <p className="text-xs text-stone-400">{c.slug}</p>
                </div>
                <AccionesCategoria id={c.id} />
              </div>
            ))
          )}
        </div>

        {/* Form nueva */}
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm p-5">
          <h2 className="font-semibold text-stone-800 mb-4 text-sm">Nueva categoría</h2>
          <CategoriaForm />
        </div>
      </div>
    </div>
  );
}
