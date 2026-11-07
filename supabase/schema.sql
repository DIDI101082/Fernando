-- ============================================================
-- Raíces Regionales — Schema de Supabase
-- Ejecutar en: supabase.com → SQL Editor → New Query
-- ============================================================

-- Tabla de productos
create table if not exists public.products (
  id          serial       primary key,
  name        text         not null,
  brand       text         not null default '',
  category    text         not null,
  price       numeric(10,2) not null,
  emoji       text         not null default '📦',
  badge       text,                          -- "OFERTA", "NUEVO", "PREMIUM", etc.
  stock       integer,                       -- null = sin control de stock
  active      boolean      not null default true,
  created_at  timestamptz  not null default now(),
  updated_at  timestamptz  not null default now()
);

-- Tabla de pedidos
create table if not exists public.orders (
  id               serial       primary key,
  customer_name    text         not null default 'Sin nombre',
  customer_phone   text,
  customer_address text,
  status           text         not null default 'pending',
  total            numeric(10,2) not null,
  created_at       timestamptz  not null default now()
);

-- Tabla de ítems de pedido
create table if not exists public.order_items (
  id          serial       primary key,
  order_id    integer      not null references public.orders(id) on delete cascade,
  product_id  integer      not null references public.products(id),
  quantity    integer      not null,
  price       numeric(10,2) not null    -- precio al momento de la compra
);

-- Índices útiles
create index if not exists idx_products_category on public.products(category);
create index if not exists idx_products_active    on public.products(active);
create index if not exists idx_order_items_order  on public.order_items(order_id);

-- Trigger para actualizar updated_at automáticamente
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists trg_products_updated_at on public.products;
create trigger trg_products_updated_at
  before update on public.products
  for each row execute function public.set_updated_at();

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

alter table public.products    enable row level security;
alter table public.orders      enable row level security;
alter table public.order_items enable row level security;

-- Productos: lectura pública (cualquiera puede ver el catálogo)
create policy "products_public_read"
  on public.products for select
  using (active = true);

-- Pedidos: solo el service role puede insertar/leer (desde la API route)
create policy "orders_service_insert"
  on public.orders for insert
  with check (true);

create policy "order_items_service_insert"
  on public.order_items for insert
  with check (true);
