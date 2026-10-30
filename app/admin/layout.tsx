export const dynamic = "force-dynamic";

import Link from "next/link";
import LogoutBtn from "@/components/LogoutBtn";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-stone-50">
      <header className="bg-white border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="font-display font-bold text-stone-800">Admin</span>
            <nav className="flex items-center gap-1">
              <Link href="/admin" className="text-sm px-3 py-1.5 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors">
                Productos
              </Link>
              <Link href="/admin/categorias" className="text-sm px-3 py-1.5 rounded-lg text-stone-600 hover:bg-stone-100 transition-colors">
                Categorías
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/" target="_blank" className="text-sm text-stone-400 hover:text-stone-600 transition-colors">
              Ver sitio ↗
            </Link>
            <LogoutBtn />
          </div>
        </div>
      </header>
      <main className="max-w-5xl mx-auto px-4 py-8">{children}</main>
    </div>
  );
}
