"use client";

import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function LogoutBtn() {
  const router = useRouter();

  async function logout() {
    const sb = createClient();
    await sb.auth.signOut();
    router.push("/login");
  }

  return (
    <button
      onClick={logout}
      className="text-sm text-stone-400 hover:text-stone-600 transition-colors"
    >
      Salir
    </button>
  );
}
