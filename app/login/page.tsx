"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error } = await createClient().auth.signInWithPassword({ email, password: pass });
    setLoading(false);
    if (error) { setError("Email o contraseña incorrectos."); return; }
    router.push("/admin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-stone-50">
      <div className="card p-8 w-full max-w-sm space-y-6">
        <div className="text-center">
          <div className="text-4xl mb-2">🛒</div>
          <h1 className="font-display text-xl font-bold text-stone-800">Panel Admin</h1>
          <p className="text-sm text-stone-400 mt-1">Ingresá para gestionar los productos</p>
        </div>
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}
        <form onSubmit={onSubmit} className="space-y-4">
          <div>
            <label className="label">Email</label>
            <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoFocus />
          </div>
          <div>
            <label className="label">Contraseña</label>
            <input className="input" type="password" required value={pass} onChange={(e) => setPass(e.target.value)} />
          </div>
          <button className="btn-primary w-full justify-center" disabled={loading}>
            {loading ? "Ingresando…" : "Ingresar"}
          </button>
        </form>
      </div>
    </div>
  );
}
