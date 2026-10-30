"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function AccionesProducto({ id }: { id: number }) {
  const router = useRouter();

  async function eliminar() {
    if (!confirm("¿Eliminar este producto?")) return;
    await createClient().from("productos").delete().eq("id", id);
    router.refresh();
  }

  return (
    <button onClick={eliminar} className="btn-danger text-xs">Eliminar</button>
  );
}
