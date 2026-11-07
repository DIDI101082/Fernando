"use client";

import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useState,
  ReactNode,
} from "react";
import { CartItem, Product } from "@/lib/types";

// ── State ─────────────────────────────────────────────────────────────────────

interface CartState {
  items: CartItem[];
  isOpen: boolean;
}

type CartAction =
  | { type: "ADD"; product: Product }
  | { type: "REMOVE"; id: number }
  | { type: "INCREMENT"; id: number }
  | { type: "DECREMENT"; id: number }
  | { type: "CLEAR" }
  | { type: "OPEN" }
  | { type: "CLOSE" }
  | { type: "HYDRATE"; items: CartItem[] };

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case "ADD": {
      const existing = state.items.find((i) => i.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((i) =>
            i.id === action.product.id ? { ...i, qty: i.qty + 1 } : i
          ),
        };
      }
      return { ...state, items: [...state.items, { ...action.product, qty: 1 }] };
    }
    case "REMOVE":
      return { ...state, items: state.items.filter((i) => i.id !== action.id) };
    case "INCREMENT":
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: i.qty + 1 } : i
        ),
      };
    case "DECREMENT": {
      const item = state.items.find((i) => i.id === action.id);
      if (!item) return state;
      if (item.qty <= 1) return { ...state, items: state.items.filter((i) => i.id !== action.id) };
      return {
        ...state,
        items: state.items.map((i) =>
          i.id === action.id ? { ...i, qty: i.qty - 1 } : i
        ),
      };
    }
    case "CLEAR":
      return { ...state, items: [] };
    case "OPEN":
      return { ...state, isOpen: true };
    case "CLOSE":
      return { ...state, isOpen: false };
    case "HYDRATE":
      return { ...state, items: action.items };
    default:
      return state;
  }
}

// ── Context ───────────────────────────────────────────────────────────────────

interface CartContextValue {
  items: CartItem[];
  isOpen: boolean;
  totalQty: number;
  totalPrice: number;
  add: (product: Product) => void;
  remove: (id: number) => void;
  increment: (id: number) => void;
  decrement: (id: number) => void;
  clear: () => void;
  openCart: () => void;
  closeCart: () => void;
  isInCart: (id: number) => boolean;
}

const CartContext = createContext<CartContextValue | null>(null);

// ── Provider ──────────────────────────────────────────────────────────────────

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [], isOpen: false });
  const [hydrated, setHydrated] = useState(false);

  // Hidratación desde localStorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("almacen_cart");
      if (saved) dispatch({ type: "HYDRATE", items: JSON.parse(saved) });
    } catch {}
    setHydrated(true);
  }, []);

  // Persistencia en localStorage
  useEffect(() => {
    if (hydrated) localStorage.setItem("almacen_cart", JSON.stringify(state.items));
  }, [state.items, hydrated]);

  const totalQty = state.items.reduce((s, i) => s + i.qty, 0);
  const totalPrice = state.items.reduce((s, i) => s + (i.price ?? 0) * i.qty, 0);

  const value: CartContextValue = {
    items: state.items,
    isOpen: state.isOpen,
    totalQty,
    totalPrice,
    add: (product) => dispatch({ type: "ADD", product }),
    remove: (id) => dispatch({ type: "REMOVE", id }),
    increment: (id) => dispatch({ type: "INCREMENT", id }),
    decrement: (id) => dispatch({ type: "DECREMENT", id }),
    clear: () => dispatch({ type: "CLEAR" }),
    openCart: () => dispatch({ type: "OPEN" }),
    closeCart: () => dispatch({ type: "CLOSE" }),
    isInCart: (id) => state.items.some((i) => i.id === id),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
