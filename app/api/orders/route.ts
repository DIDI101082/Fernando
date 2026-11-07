import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase-server";
import { CartItem } from "@/lib/types";

interface OrderBody {
  customer_name: string;
  customer_phone: string;
  customer_address: string;
  items: CartItem[];
  total: number;
}

export async function POST(req: NextRequest) {
  try {
    const body: OrderBody = await req.json();
    const { customer_name, customer_phone, customer_address, items, total } = body;

    if (!customer_name || !customer_phone || !items?.length) {
      return NextResponse.json({ error: "Datos incompletos" }, { status: 400 });
    }

    const supabase = createServerClient();

    // 1. Crear el pedido
    const { data: order, error: orderError } = await supabase
      .from("orders")
      .insert({ customer_name, customer_phone, customer_address, total, status: "pending" })
      .select()
      .single();

    if (orderError) throw orderError;

    // 2. Insertar los ítems del pedido
    const orderItems = items.map((item) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.qty,
      price: item.price,
    }));

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems);
    if (itemsError) throw itemsError;

    return NextResponse.json({ success: true, orderId: order.id });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Error interno";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
