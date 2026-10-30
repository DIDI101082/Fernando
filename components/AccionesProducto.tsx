"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AccionesProducto({ id }: { id: number }) {
  const router = useRouter();

  async function eliminar() {
    if (!confirm("¿Eliminar este producto?")) return;
    const sb = createClient();
    await sb.from("productos").delete().eq("id", id);
    router.refresh();
  }

  return (
    <button
      onClick={eliminar}
      className="text-xs px-3 py-1.5 rounded-lg text-red-600 border border-red-100 hover:bg-red-50 transition-colors"
    >
      Eliminar
    </button>
  );
}
