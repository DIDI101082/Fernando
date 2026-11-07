export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  emoji: string;
  badge: string | null;
  active: boolean;
  stock: number | null;
}

export interface CartItem extends Product {
  qty: number;
}

export type Category =
  | "todos"
  | "yerba"
  | "aceites"
  | "vinos"
  | "cervezas"
  | "bebidas"
  | "infusiones"
  | "dulces"
  | "conservas";

export const CATEGORIES: { slug: Category; label: string; emoji: string }[] = [
  { slug: "todos", label: "Todos", emoji: "🛒" },
  { slug: "yerba", label: "Yerba Mate", emoji: "🧉" },
  { slug: "aceites", label: "Aceites de Oliva", emoji: "🫒" },
  { slug: "vinos", label: "Vinos", emoji: "🍷" },
  { slug: "cervezas", label: "Cervezas", emoji: "🍺" },
  { slug: "bebidas", label: "Bebidas", emoji: "🧃" },
  { slug: "infusiones", label: "Infusiones", emoji: "🍵" },
  { slug: "dulces", label: "Dulces y Confitería", emoji: "🍫" },
  { slug: "conservas", label: "Conservas", emoji: "🥫" },
];
