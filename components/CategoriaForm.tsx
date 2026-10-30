"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function CategoriaForm() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [orden, setOrden] = useState("0");
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState("");

  function toSlug(s: string) {
    return s
      .toLowerCase()
      .normalize("NFD")
      .replace(/[̀-ͯ]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!nombre.trim()) { setError("El nombre es obligatorio"); return; }
    setGuardando(true);
    setError("");
    const sb = createClient();
    const { error: err } = await sb.from("categorias").insert({
      nombre: nombre.trim(),
      slug: toSlug(nombre),
      orden: Number(orden) || 0,
    });
    setGuardando(false);
    if (err) { setError(err.message); return; }
    setNombre("");
    setOrden("0");
    router.refresh();
  }

  const inp = "w-full px-3 py-2 rounded-lg border border-stone-200 text-sm focus:outline-none focus:ring-2 focus:ring-orange-400 bg-white";

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Nombre</label>
        <input className={inp} value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Ej: Lácteos" />
        {nombre && (
          <p className="text-xs text-stone-400 mt-1">Slug: {toSlug(nombre)}</p>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-stone-700 mb-1">Orden</label>
        <input type="number" className={inp} value={orden} onChange={e => setOrden(e.target.value)} />
      </div>
      {error && <p className="text-sm text-red-600">{error}</p>}
      <button
        type="submit"
        disabled={guardando}
        className="w-full py-2.5 rounded-lg bg-orange-500 text-white text-sm font-semibold hover:bg-orange-600 disabled:opacity-50 transition-colors"
      >
        {guardando ? "Guardando..." : "Agregar categoría"}
      </button>
    </form>
  );
}
