"use client";

import { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { Product, Category, CATEGORIES } from "@/lib/types";
import Header from "./Header";
import CategoryFilter from "./CategoryFilter";
import ProductCard from "./ProductCard";
import CartDrawer from "./CartDrawer";
import Toast from "./Toast";

interface Props {
  products: Product[];
}

export default function ShopClient({ products }: Props) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<Category>("todos");
  const [toast, setToast] = useState({ visible: false, message: "" });

  const filtered = useMemo(() => {
    let list = products;
    if (category !== "todos") list = list.filter((p) => p.category === category);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q)
      );
    }
    return list;
  }, [products, category, search]);

  const showToast = useCallback((msg: string) => {
    setToast({ visible: true, message: msg });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2200);
  }, []);

  const catLabel =
    CATEGORIES.find((c) => c.slug === category)?.label ?? "Todos";

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header search={search} onSearchChange={setSearch} />

      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-dark via-primary to-primary-light text-white py-10 px-4 text-center">
        <div className="max-w-xl mx-auto flex flex-col items-center gap-3">
          <Image
            src="/logo.jpg"
            alt="Raíces Regionales"
            width={90}
            height={90}
            className="rounded-full border-4 border-accent shadow-lg"
          />
          <h2 className="font-serif text-3xl font-bold">Raíces Regionales</h2>
          <p className="text-accent text-xs tracking-widest uppercase font-semibold">
            ── Distribuidora Mayorista ──
          </p>
          <p className="text-white/80 text-sm mt-1">
            Yerba, aceites, azúcar, arroz y mucho más. Envíos a domicilio.
          </p>
          <a
            href="https://instagram.com/raicesregionales.mayorista"
            target="_blank"
            rel="noreferrer"
            className="text-xs text-white/70 hover:text-white flex items-center gap-1 mt-1 transition-colors"
          >
            📸 @raicesregionales.mayorista
          </a>
        </div>
      </section>

      {/* Categorías */}
      <CategoryFilter active={category} onChange={setCategory} />

      {/* Resultado label */}
      <p className="max-w-6xl mx-auto px-4 text-sm text-gray-400 mb-2">
        {search
          ? `${filtered.length} resultado(s) para "${search}"`
          : `${filtered.length} producto(s) — ${catLabel}`}
      </p>

      {/* Grid de productos */}
      <main className="max-w-6xl mx-auto px-4 pb-10 flex-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-2">
            <span className="text-5xl">🔍</span>
            <p>Sin resultados para tu búsqueda.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filtered.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onAdd={() => showToast(`🛒 ${p.name} agregado`)}
              />
            ))}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-primary-dark text-white/70 text-center py-6 text-xs space-y-1">
        <div className="flex items-center justify-center gap-2">
          <Image
            src="/logo.jpg"
            alt="logo"
            width={28}
            height={28}
            className="rounded-full opacity-80"
          />
          <span className="font-serif text-white font-semibold">Raíces Regionales</span>
        </div>
        <p>Distribuidora Mayorista · Lunes a Sábado 8:00 – 18:00</p>
        <a
          href="https://instagram.com/raicesregionales.mayorista"
          target="_blank"
          rel="noreferrer"
          className="hover:text-accent transition-colors"
        >
          📸 @raicesregionales.mayorista
        </a>
      </footer>

      {/* WhatsApp flotante */}
      <a
        href={`https://wa.me/${process.env.NEXT_PUBLIC_WA_NUMBER ?? "5491100000000"}?text=${encodeURIComponent("Hola! Quisiera consultar sobre los productos.")}`}
        target="_blank"
        rel="noreferrer"
        className="fixed bottom-6 right-6 bg-[#25d366] hover:bg-[#1ebe5d] text-white w-14 h-14 rounded-full shadow-xl flex items-center justify-center text-2xl z-30 transition-transform hover:scale-110"
        title="Contactar por WhatsApp"
      >
        💬
      </a>

      <CartDrawer />
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  );
}
