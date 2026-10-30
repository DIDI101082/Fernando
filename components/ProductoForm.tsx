"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

type Categoria = { id: number; nombre: string; slug: string };

type Producto = {
  id?: number;
  nombre: string;
  descripcion: string;
  precio: string;
  categoria: string;
  imagen_url: string;
  disponible: boolean;
};

type Props = {
  categorias: Categoria[];
  inicial?: Partial<Producto> & { id?: number };
};

export default function ProductoForm({ categorias, inicial }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<Producto>({
    nombre:      inicial?.nombre ?? "",
    descripcion: inicial?.descripcion ?? "",
    precio:      inicial?.precio != null ? String(inicial.precio) : "",
    categoria:   inicial?.categoria ?? "",
    imagen_url:  inicial?.imagen_url ?? "",
    disponible:  inicial?.disponible ?? true,
  });
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function set(k: keyof Producto, v: string | boolean) {
    setForm((f) => ({ ...f, [k]: v }));
  }

  async function subirImagen(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setSubiendo(true);
    const sb = createClient();
    const ext = file.name.split(".").pop();
    const path = `productos/${Date.now()}.${ext}`;
    const { error } = await sb.storage.from("imagenes").upload(path, file, { upsert: true });
    if (error) { setError(error.message); setSubiendo(false); return; }
    const { data } = sb.storage.from("imagenes").getPublicUrl(path);
    set("imagen_url", data.publicUrl);
    setSubiendo(false);
  }

  async function guardar(e: React.FormEvent) {
    e.preventDefault();
    setGuardando(true);
    setError(null);
    const sb = createClient();
    const payload = {
      nombre:      form.nombre,
      descripcion: form.descripcion || null,
      precio:      form.precio ? Number(form.precio) : null,
      categoria:   form.categoria || null,
      imagen_url:  form.imagen_url || null,
      disponible:  form.disponible,
    };
    const { error } = inicial?.id
      ? await sb.from("productos").update(payload).eq("id", inicial.id)
      : await sb.from("productos").insert(payload);
    setGuardando(false);
    if (error) { setError(error.message); return; }
    router.push("/admin");
    router.refresh();
  }

  return (
    <form onSubmit={guardar} className="space-y-5">
      {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

      <div className="grid sm:grid-cols-2 gap-5">
        <div>
          <label className="label">Nombre *</label>
          <input className="input" required value={form.nombre} onChange={(e) => set("nombre", e.target.value)} placeholder="Ej: Miel de abeja" />
        </div>
        <div>
          <label className="label">Precio (opcional)</label>
          <input className="input" type="number" min="0" step="0.01" value={form.precio} onChange={(e) => set("precio", e.target.value)} placeholder="Ej: 1500" />
        </div>
      </div>

      <div>
        <label className="label">Descripción (opcional)</label>
        <textarea className="input resize-none" rows={3} value={form.descripcion} onChange={(e) => set("descripcion", e.target.value)} placeholder="Breve descripción del producto…" />
      </div>

      <div>
        <label className="label">Categoría</label>
        {categorias.length > 0 ? (
          <select className="input" value={form.categoria} onChange={(e) => set("categoria", e.target.value)}>
            <option value="">Sin categoría</option>
            {categorias.map((c) => (
              <option key={c.id} value={c.slug}>{c.nombre}</option>
            ))}
          </select>
        ) : (
          <input className="input" value={form.categoria} onChange={(e) => set("categoria", e.target.value)} placeholder="Ej: frutas, lácteos, panificados…" />
        )}
      </div>

      <div>
        <label className="label">Imagen</label>
        <input type="file" accept="image/*" onChange={subirImagen} className="text-sm text-stone-600" />
        {subiendo && <p className="text-xs text-stone-400 mt-1">Subiendo imagen…</p>}
        {form.imagen_url && (
          <div className="mt-2 relative w-24 h-24 rounded-lg overflow-hidden border border-stone-200">
            <Image src={form.imagen_url} alt="preview" fill className="object-cover" />
          </div>
        )}
      </div>

      <label className="flex items-center gap-3 cursor-pointer">
        <input
          type="checkbox"
          checked={form.disponible}
          onChange={(e) => set("disponible", e.target.checked)}
          className="w-4 h-4 accent-brand-500"
        />
        <span className="text-sm text-stone-700">Visible en el catálogo</span>
      </label>

      <div className="flex gap-3 pt-2">
        <button type="submit" className="btn-primary" disabled={guardando || subiendo}>
          {guardando ? "Guardando…" : inicial?.id ? "Guardar cambios" : "Crear producto"}
        </button>
        <button type="button" className="btn-ghost" onClick={() => router.back()}>
          Cancelar
        </button>
      </div>
    </form>
  );
}
