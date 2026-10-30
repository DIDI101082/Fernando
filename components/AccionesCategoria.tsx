"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AccionesCategoria({ id }: { id: number }) {
  const router = useRouter();

  async function eliminar() {
    if (!confirm("¿Eliminar esta categoría? Los productos quedarán sin categoría.")) return;
    const sb = createClient();
    await sb.from("categorias").delete().eq("id", id);
    router.refresh();
  }

  return (
    <button
      onClick={eliminar}
      className="text-xs px-2 py-1 rounded-lg text-red-600 border border-red-100 hover:bg-red-50 transition-colors"
    >
      ×
    </button>
  );
}
