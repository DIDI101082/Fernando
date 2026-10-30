"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";

type Categoria = { id: number; nombre: string; slug: string };

type Inicial = {
  id?: number;
  nombre?: string;
  descripcion?: string | null;
  precio?: number | null;
  precio_oferta?: number | null;
  categoria_id?: number | null;
  imagen_url?: string | null;
  disponible?: boolean;
  orden?: number | null;
};

export default function ProductoForm({
  categorias,
  inicial,
}: {
  categorias: Categoria[];
  inicial?: Inicial;
}) {
  const router = useRouter();
  const sb = createClient();

  const [nombre, setNombre] = useState(inicial?.nombre ?? "");
  const [descripcion, setDescripcion] = useState(inicial?.descripcion ?? "");
  const [precio, setPrecio] = useState(inicial?.precio?.toString() ?? "");
  const [precioOferta, setPrecioOferta] = useState(inicial?.precio_oferta?.toString() ?? "");
  const [categoriaId, setCategoriaId] = useState(inicial?.categoria_id?.toString() ?? "");
  const [imagenUrl, setImagenUrl] = useState(inicial?.imagen_url ?? "");
  const [disponible, setDisponible] = useState(inicial?.disponible ?? true);
  const [orden, setOrden] = useState(inicial?.orden?.toString() ?? "0");
  const [subiendo, setSubiendo] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  async function subirImagen(file: File) {
    setSubiendo(true);
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}.${ext}`;
    const { error } = await sb.storage
      .from("imagenes")
      .upload(path, file, { upsert: true });
    setSubiendo(false);
    if (error) { setError("Error al subir imagen: " + error.message); return; }
    const { data } = sb.storage.from("imagenes").getPublicUrl(path);
    setImagenUrl(data.publicUrl);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) { setError("El nombre es obligatorio"); return; }
    setGuardando(true);
    setError("");

    const datos = {
      nombre: nombre.trim(),
      descripcion: descripcion.trim() || null,
      precio: precio ? Number(precio) : null,
      precio_oferta: precioOferta ? Number(precioOferta) : null,
      categoria_id: categoriaId ? Number(categoriaId) : null,
      imagen_url: imagenUrl || null,
      disponible,
      orden: Number(orden) || 0,
    };

    let err;
    if (inicial?.id) {
      ({ error: err } = await sb.from("productos").update(datos).eq("id", inicial.id));
    } else {
      ({ error: err } = await sb.from("productos").insert(datos));
    }

    setGuardando(false);
    if (err) { setError(err.message); return; }
    router.push("/admin");
    router.refresh();
  }

  const inp = "w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-lg">
      {/* Imagen */}
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Imagen</label>
        {imagenUrl && (
          <div className="relative w-full aspect-video rounded-xl overflow-hidden mb-2 bg-stone-100">
            <Image src={imagenUrl} alt="preview" fill className="object-cover" />
            <button
              type="button"
              onClick={() => setImagenUrl("")}
              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-black/60 text-white text-xs flex items-center justify-center"
            >
              ×
            </button>
          </div>
        )}
        <label className="flex items-center gap-2 px-3 py-2 rounded-lg border border-dashed border-stone-300 cursor-pointer text-sm text-stone-500 hover:bg-stone-50 transition-colors">
          📷 {subiendo ? "Subiendo..." : "Subir imagen"}
          <input
            type="file"
            accept="image/*"
            className="hidden"
            disabled={subiendo}
            onChange={e => { const f = e.target.files?.[0]; if (f) subirImagen(f); }}
          />
        </label>
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Nombre *</label>
        <input className={inp} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre del producto" />
      </div>

      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Descripción</label>
        <textarea className={inp} rows={3} value={descripcion} onChange={e => setDescripcion(e.target.value)} placeholder="Descripción opcional..." style={{ resize: "vertical" }} />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Precio</label>
          <input type="number" min="0" step="0.01" className={inp} value={precio} onChange={e => setPrecio(e.target.value)} placeholder="0.00" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Precio oferta</label>
          <input type="number" min="0" step="0.01" className={inp} value={precioOferta} onChange={e => setPrecioOferta(e.target.value)} placeholder="Vacío = sin oferta" />
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Categoría</label>
          <select className={inp} value={categoriaId} onChange={e => setCategoriaId(e.target.value)}>
            <option value="">Sin categoría</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-stone-700 mb-1">Orden</label>
          <input type="number" className={inp} value={orden} onChange={e => setOrden(e.target.value)} />
        </div>
      </div>

      <label className="flex items-center gap-2 cursor-pointer">
        <input type="checkbox" checked={disponible} onChange={e => setDisponible(e.target.checked)} className="rounded" />
        <span className="text-sm text-stone-700">Visible en el catálogo</span>
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex gap-2 pt-2">
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="flex-1 py-2.5 rounded-lg border border-stone-200 text-sm text-stone-600 hover:bg-stone-50 transition-colors"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={guardando || subiendo}
          className="flex-1 py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors"
        >
          {guardando ? "Guardando..." : inicial?.id ? "Guardar cambios" : "Crear producto"}
        </button>
      </div>
    </form>
  );
}
