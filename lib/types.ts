export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number | null;
  image_url: string | null;
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
  | "aceites"
  | "yerba"
  | "infusiones";

export const CATEGORIES: { slug: Category; label: string; emoji: string }[] = [
  { slug: "todos",      label: "Todos",             emoji: "🛒" },
  { slug: "aceites",    label: "Aceites de Oliva",  emoji: "🫒" },
  { slug: "yerba",      label: "Yerba Mate",        emoji: "🧉" },
  { slug: "infusiones", label: "Infusiones",        emoji: "🍵" },
];
