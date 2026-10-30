-- =============================================
-- CATÁLOGO DE PRODUCTOS
-- Ejecutar en Supabase → SQL Editor
-- =============================================

-- Categorías
create table if not exists categorias (
  id     bigint primary key generated always as identity,
  nombre text not null,
  slug   text not null unique,
  orden  int  not null default 0
);

-- Productos
create table if not exists productos (
  id          bigint primary key generated always as identity,
  nombre      text    not null,
  descripcion text,
  precio      numeric(10,2),
  categoria   text    references categorias(slug) on update cascade on delete set null,
  imagen_url  text,
  disponible  boolean not null default true,
  created_at  timestamptz not null default now()
);

-- RLS: catálogo público (solo lectura)
alter table productos   enable row level security;
alter table categorias  enable row level security;

create policy "Catálogo público"
  on productos for select using (disponible = true);

create policy "Categorías públicas"
  on categorias for select using (true);

-- Admin: acceso total para usuarios autenticados
create policy "Admin productos"
  on productos for all using (auth.role() = 'authenticated');

create policy "Admin categorías"
  on categorias for all using (auth.role() = 'authenticated');

-- Storage: bucket para imágenes
insert into storage.buckets (id, name, public)
values ('imagenes', 'imagenes', true)
on conflict (id) do nothing;

create policy "Imágenes públicas"
  on storage.objects for select
  using (bucket_id = 'imagenes');

create policy "Admin sube imágenes"
  on storage.objects for insert
  with check (bucket_id = 'imagenes' and auth.role() = 'authenticated');

create policy "Admin borra imágenes"
  on storage.objects for delete
  using (bucket_id = 'imagenes' and auth.role() = 'authenticated');

-- =============================================
-- CATEGORÍAS DE EJEMPLO (borrar o ajustar)
-- =============================================
insert into categorias (nombre, slug, orden) values
  ('Lácteos',     'lacteos',     1),
  ('Panificados', 'panificados', 2),
  ('Frutas',      'frutas',      3),
  ('Bebidas',     'bebidas',     4)
on conflict (slug) do nothing;
