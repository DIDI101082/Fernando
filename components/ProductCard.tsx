"use client";

import { Product } from "@/lib/types";
import { useCart } from "@/context/CartContext";
import { fmt } from "@/lib/format";
import Image from "next/image";

interface Props {
  product: Product;
  onAdd?: () => void;
}

export default function ProductCard({ product, onAdd }: Props) {
  const { add, isInCart, openCart } = useCart();

  const handleAdd = () => {
    add(product);
    onAdd?.();
  };

  const inCart = isInCart(product.id);

  return (
    <div className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col">
      {/* Imagen del producto */}
      <div className="relative bg-gray-50 aspect-square overflow-hidden">
        {product.image_url ? (
          <Image
            src={product.image_url}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-5xl">
            {product.emoji}
          </div>
        )}
        {product.badge && (
          <span className="absolute top-2 right-2 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase">
            {product.badge}
          </span>
        )}
      </div>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        <p className="font-semibold text-sm leading-snug">{product.name}</p>
        <p className="text-xs text-gray-400 mt-0.5 mb-2">{product.brand}</p>

        {product.stock !== null && product.stock <= 5 && product.stock > 0 && (
          <p className="text-xs text-orange-500 font-medium mb-1">
            ⚠ Solo quedan {product.stock} unidades
          </p>
        )}
        {product.stock === 0 && (
          <p className="text-xs text-red-500 font-medium mb-1">Sin stock</p>
        )}

        <p className="text-primary font-bold text-lg mt-auto mb-2">
          {fmt(product.price)}{" "}
          {product.price != null && (
            <span className="text-gray-400 text-xs font-normal">c/u</span>
          )}
        </p>

        {(product.category === 'yerba' || product.category === 'infusiones') && (
          <p className="text-[10px] text-gray-400 mb-2 leading-tight">
            Compra mínima 20 unidades.<br/>
            (10 unidades de cada tipo)
          </p>
        )}

        <button
          onClick={handleAdd}
          disabled={product.stock === 0}
          className={`w-full py-2 rounded-lg text-sm font-semibold transition-colors ${
            product.stock === 0
              ? "bg-gray-100 text-gray-400 cursor-not-allowed"
              : inCart
              ? "bg-green-600 text-white hover:bg-green-700"
              : "bg-primary text-white hover:bg-primary-dark"
          }`}
        >
          {product.stock === 0 ? "Sin stock" : inCart ? "✓ Agregado" : "+ Agregar"}
        </button>

        {inCart && (
          <button
            onClick={openCart}
            className="w-full mt-1.5 py-1.5 rounded-lg text-xs font-medium text-primary border border-primary hover:bg-green-50 transition-colors"
          >
            Ver carrito →
          </button>
        )}
      </div>
    </div>
  );
}
