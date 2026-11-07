"use client";

import Image from "next/image";
import { useCart } from "@/context/CartContext";

interface HeaderProps {
  search: string;
  onSearchChange: (v: string) => void;
}

export default function Header({ search, onSearchChange }: HeaderProps) {
  const { totalQty, openCart } = useCart();

  return (
    <header className="bg-primary sticky top-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        {/* Logo */}
        <a href="/" className="flex items-center gap-2 text-white shrink-0">
          <Image
            src="/logo.jpg"
            alt="Raíces Regionales"
            width={44}
            height={44}
            className="rounded-full object-cover border-2 border-accent"
          />
          <div className="leading-tight hidden sm:block">
            <p className="font-serif font-bold text-sm text-white">Raíces Regionales</p>
            <p className="text-[10px] text-accent tracking-widest uppercase">Distribuidora Mayorista</p>
          </div>
        </a>

        {/* Buscador */}
        <div className="flex-1 max-w-sm flex bg-white/15 border border-white/25 rounded-lg overflow-hidden">
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Buscar producto…"
            className="flex-1 bg-transparent border-none outline-none px-3 py-2 text-white placeholder-white/60 text-sm"
          />
          <span className="px-3 flex items-center text-white opacity-70 text-sm">🔍</span>
        </div>

        {/* Carrito */}
        <button
          onClick={openCart}
          className="flex items-center gap-2 bg-accent hover:bg-accent-dark text-white font-semibold px-4 py-2 rounded-lg text-sm transition-colors shrink-0"
        >
          🛒
          <span className="hidden sm:inline">Carrito</span>
          {totalQty > 0 && (
            <span className="bg-white text-accent-dark rounded-full w-5 h-5 text-xs font-bold flex items-center justify-center">
              {totalQty}
            </span>
          )}
        </button>
      </div>
    </header>
  );
}
