import { supabase } from "@/lib/supabase";
import { Product } from "@/lib/types";
import ShopClient from "@/components/ShopClient";

async function getProducts(): Promise<Product[]> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("active", true)
    .order("category")
    .order("name");

  if (error) {
    console.error("Error al obtener productos:", error.message);
    return [];
  }
  return data as Product[];
}

export default async function HomePage() {
  const products = await getProducts();
  return <ShopClient products={products} />;
}

// Revalida la página cada 60 segundos (ISR)
export const revalidate = 60;
