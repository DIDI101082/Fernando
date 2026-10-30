"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function NavAdmin() {
  const router = useRouter();

  async function logout() {
    await createClient().auth.signOut();
    router.push("/login");
  }

  return (
    <header className="bg-white border-b border-stone-100">
      <div className="max-w-4xl mx-auto px-4 py-3 flex items-center gap-4">
        <Link href="/" className="text-xl">🛒</Link>
        <Link href="/admin" className="font-display font-semibold text-stone-800 hover:text-brand-600 text-sm">
          Admin
        </Link>
        <Link href="/admin/nuevo" className="btn-primary ml-auto text-xs">
          + Nuevo producto
        </Link>
        <button onClick={logout} className="btn-ghost text-xs">
          Salir
        </button>
      </div>
    </header>
  );
}
