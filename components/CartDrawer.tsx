"use client";

import { useState } from "react";
import { useCart } from "@/context/CartContext";
import { fmt } from "@/lib/format";

export default function CartDrawer() {
  const { items, isOpen, closeCart, increment, decrement, remove, clear, totalPrice, totalQty } =
    useCart();
  const [loading, setLoading] = useState(false);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const waNumber = process.env.NEXT_PUBLIC_WA_NUMBER ?? "5491100000000";

  async function handleCheckout() {
    if (!items.length) return;

    setLoading(true);
    try {
      // 1. Guardar pedido en Supabase
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer_name: name || "Sin nombre",
          customer_phone: phone || waNumber,
          customer_address: address || "",
          items,
          total: totalPrice,
        }),
      });
      const data = await res.json();
      const orderId = data.orderId ? ` (Pedido #${data.orderId})` : "";

      // 2. Abrir WhatsApp con el pedido
      const lines = items.map(
        (i) => `• ${i.name} (${i.brand}) x${i.qty} = ${i.price != null ? fmt(i.price * i.qty) : "consultar precio"}`
      );
      const msg = [
        `Hola! Quiero hacer el siguiente pedido${orderId}:`,
        "",
        ...lines,
        "",
        `*Total: ${fmt(totalPrice)}*`,
        name ? `\nNombre: ${name}` : "",
        address ? `Dirección: ${address}` : "",
        "\n¿Podés confirmarlo?",
      ]
        .filter((l) => l !== undefined)
        .join("\n");

      window.open(`https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`, "_blank");
      clear();
      closeCart();
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      {/* Overlay */}
      <div
        onClick={closeCart}
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity ${
          isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      />

      {/* Drawer */}
      <aside
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white z-50 flex flex-col shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b">
          <h2 className="font-bold text-lg">🛒 Tu carrito ({totalQty})</h2>
          <button onClick={closeCart} className="text-gray-400 hover:text-gray-600 text-2xl leading-none">
            ✕
          </button>
        </div>

        {/* Items */}
        <div className="flex-1 overflow-y-auto cart-scroll px-5 py-3">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-gray-400 gap-2">
              <span className="text-5xl">🛒</span>
              <p>Tu carrito está vacío</p>
            </div>
          ) : (
            <ul className="divide-y">
              {items.map((item) => (
                <li key={item.id} className="py-3 flex gap-3 items-center">
                  <span className="text-3xl">{item.emoji}</span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-sm truncate">{item.name}</p>
                    <p className="text-xs text-gray-400">{item.brand} · {fmt(item.price)} c/u</p>
                    <div className="flex items-center gap-2 mt-1.5">
                      <button
                        onClick={() => decrement(item.id)}
                        className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="font-semibold text-sm w-5 text-center">{item.qty}</span>
                      <button
                        onClick={() => increment(item.id)}
                        className="w-6 h-6 rounded border border-gray-200 flex items-center justify-center text-sm hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end gap-1">
                    <span className="font-bold text-primary text-sm">{item.price != null ? fmt(item.price * item.qty) : "—"}</span>
                    <button
                      onClick={() => remove(item.id)}
                      className="text-red-400 hover:text-red-600 text-xs"
                    >
                      🗑
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t px-5 py-4 space-y-3">
            {/* Datos opcionales del cliente */}
            <details className="text-sm">
              <summary className="cursor-pointer text-gray-500 hover:text-gray-700 select-none">
                + Agregar datos de entrega (opcional)
              </summary>
              <div className="mt-2 space-y-2">
                <input
                  type="text"
                  placeholder="Tu nombre"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <input
                  type="text"
                  placeholder="Dirección de entrega"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                />
                <input
                  type="tel"
                  placeholder="Tu teléfono"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>
            </details>

            {/* Total */}
            <div className="flex items-center justify-between font-bold text-base">
              <span>Total</span>
              <span className="text-primary text-xl">{fmt(totalPrice)}</span>
            </div>

            {/* Pedir por WhatsApp */}
            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-[#25d366] hover:bg-[#1ebe5d] disabled:opacity-60 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 transition-colors"
            >
              {loading ? "Enviando…" : "💬 Pedir por WhatsApp"}
            </button>

            {/* Vaciar */}
            <button
              onClick={clear}
              className="w-full border border-gray-200 hover:border-red-300 hover:text-red-500 text-gray-400 py-2 rounded-lg text-sm transition-colors"
            >
              🗑 Vaciar carrito
            </button>
          </div>
        )}
      </aside>
    </>
  );
}
