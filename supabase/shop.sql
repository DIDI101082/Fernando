-- ============================================================
-- SHOP WA — Catálogo con WhatsApp
-- Ejecutar en: Supabase SQL Editor
-- ============================================================

-- Extensiones necesarias
create extension if not exists pgcrypto;

-- ============================================================
-- TABLAS
-- ============================================================

-- Configuración del negocio
create table if not exists shop_config (
  clave text primary key,
  valor text
);

-- Categorías
create table if not exists shop_categorias (
  id         serial primary key,
  nombre     text not null,
  descripcion text,
  imagen_url text,
  orden      int not null default 0,
  activa     boolean not null default true,
  creado_en  timestamptz not null default now()
);

-- Productos
create table if not exists shop_productos (
  id              serial primary key,
  nombre          text not null,
  descripcion     text,
  precio          numeric(12,2) not null,
  precio_descuento numeric(12,2),
  categoria_id    int references shop_categorias(id) on delete set null,
  imagen_url      text,
  activo          boolean not null default true,
  orden           int not null default 0,
  creado_en       timestamptz not null default now(),
  actualizado_en  timestamptz not null default now()
);

-- Admin (usuario único o pocos usuarios internos)
create table if not exists shop_admin (
  id           serial primary key,
  email        text not null unique,
  password_hash text not null,
  nombre       text not null,
  creado_en    timestamptz not null default now()
);

-- Sesiones admin
create table if not exists shop_sesiones (
  id          serial primary key,
  admin_id    int not null references shop_admin(id) on delete cascade,
  token_hash  text not null unique,
  creado_en   timestamptz not null default now(),
  expira_en   timestamptz not null default now() + interval '30 days'
);

-- ============================================================
-- RLS — bloquear acceso directo
-- ============================================================
alter table shop_config     enable row level security;
alter table shop_categorias enable row level security;
alter table shop_productos  enable row level security;
alter table shop_admin      enable row level security;
alter table shop_sesiones   enable row level security;

revoke all on shop_config     from anon, authenticated;
revoke all on shop_categorias from anon, authenticated;
revoke all on shop_productos  from anon, authenticated;
revoke all on shop_admin      from anon, authenticated;
revoke all on shop_sesiones   from anon, authenticated;

-- ============================================================
-- HELPERS
-- ============================================================

-- Hash de token (SHA-256 hex)
create or replace function shop_hash(p_texto text)
returns text language sql immutable security definer as $$
  select encode(digest(p_texto, 'sha256'), 'hex');
$$;

-- Verificar sesión y devolver admin_id (null si inválida)
create or replace function shop_verificar(p_token text)
returns int language sql security definer as $$
  select admin_id from shop_sesiones
  where token_hash = shop_hash(p_token)
    and expira_en > now()
  limit 1;
$$;

-- ============================================================
-- AUTH
-- ============================================================

create or replace function shop_login(p_email text, p_password text)
returns json language plpgsql security definer as $$
declare
  v_admin   shop_admin;
  v_token   text;
begin
  select * into v_admin from shop_admin where lower(email) = lower(p_email);
  if not found then
    raise exception 'Credenciales incorrectas';
  end if;
  if v_admin.password_hash <> crypt(p_password, v_admin.password_hash) then
    raise exception 'Credenciales incorrectas';
  end if;
  v_token := encode(gen_random_bytes(24), 'hex');
  insert into shop_sesiones(admin_id, token_hash)
  values (v_admin.id, shop_hash(v_token));
  return json_build_object(
    'token', v_token,
    'admin', json_build_object('id', v_admin.id, 'nombre', v_admin.nombre, 'email', v_admin.email)
  );
end;
$$;

create or replace function shop_logout(p_token text)
returns void language sql security definer as $$
  delete from shop_sesiones where token_hash = shop_hash(p_token);
$$;

create or replace function shop_mi_sesion(p_token text)
returns json language plpgsql security definer as $$
declare
  v_admin_id int;
  v_admin    shop_admin;
begin
  v_admin_id := shop_verificar(p_token);
  if v_admin_id is null then return null; end if;
  select * into v_admin from shop_admin where id = v_admin_id;
  return json_build_object('id', v_admin.id, 'nombre', v_admin.nombre, 'email', v_admin.email);
end;
$$;

-- ============================================================
-- PÚBLICO — catálogo (no requiere token)
-- ============================================================

create or replace function shop_catalogo(p_categoria_id int default null, p_buscar text default null)
returns json language plpgsql security definer as $$
declare
  v_categorias json;
  v_productos  json;
  v_config     json;
begin
  select json_object_agg(clave, valor) into v_config from shop_config;

  select json_agg(c order by c.orden, c.nombre) into v_categorias
  from (
    select id, nombre, descripcion, imagen_url, orden
    from shop_categorias
    where activa = true
    order by orden, nombre
  ) c;

  select json_agg(p order by p.orden, p.nombre) into v_productos
  from (
    select
      pr.id, pr.nombre, pr.descripcion, pr.precio, pr.precio_descuento,
      pr.categoria_id, pr.imagen_url,
      cat.nombre as categoria_nombre
    from shop_productos pr
    left join shop_categorias cat on cat.id = pr.categoria_id
    where pr.activo = true
      and (p_categoria_id is null or pr.categoria_id = p_categoria_id)
      and (p_buscar is null or pr.nombre ilike '%' || p_buscar || '%' or pr.descripcion ilike '%' || p_buscar || '%')
    order by pr.orden, pr.nombre
  ) p;

  return json_build_object(
    'config', coalesce(v_config, '{}'::json),
    'categorias', coalesce(v_categorias, '[]'::json),
    'productos', coalesce(v_productos, '[]'::json)
  );
end;
$$;

-- ============================================================
-- ADMIN — productos
-- ============================================================

create or replace function shop_admin_listar_productos(p_token text)
returns json language plpgsql security definer as $$
begin
  if shop_verificar(p_token) is null then raise exception 'No autorizado'; end if;
  return (
    select json_agg(p order by p.orden, p.nombre)
    from (
      select pr.*, cat.nombre as categoria_nombre
      from shop_productos pr
      left join shop_categorias cat on cat.id = pr.categoria_id
      order by pr.activo desc, pr.orden, pr.nombre
    ) p
  );
end;
$$;

create or replace function shop_admin_guardar_producto(p_token text, p_datos json)
returns json language plpgsql security definer as $$
declare
  v_id int;
begin
  if shop_verificar(p_token) is null then raise exception 'No autorizado'; end if;
  v_id := (p_datos->>'id')::int;
  if v_id is not null then
    update shop_productos set
      nombre           = coalesce(p_datos->>'nombre', nombre),
      descripcion      = p_datos->>'descripcion',
      precio           = coalesce((p_datos->>'precio')::numeric, precio),
      precio_descuento = (p_datos->>'precio_descuento')::numeric,
      categoria_id     = (p_datos->>'categoria_id')::int,
      imagen_url       = p_datos->>'imagen_url',
      activo           = coalesce((p_datos->>'activo')::boolean, activo),
      orden            = coalesce((p_datos->>'orden')::int, orden),
      actualizado_en   = now()
    where id = v_id
    returning id into v_id;
  else
    insert into shop_productos(nombre, descripcion, precio, precio_descuento, categoria_id, imagen_url, activo, orden)
    values (
      p_datos->>'nombre',
      p_datos->>'descripcion',
      (p_datos->>'precio')::numeric,
      (p_datos->>'precio_descuento')::numeric,
      (p_datos->>'categoria_id')::int,
      p_datos->>'imagen_url',
      coalesce((p_datos->>'activo')::boolean, true),
      coalesce((p_datos->>'orden')::int, 0)
    )
    returning id into v_id;
  end if;
  return (select row_to_json(p) from shop_productos p where id = v_id);
end;
$$;

create or replace function shop_admin_eliminar_producto(p_token text, p_id int)
returns void language plpgsql security definer as $$
begin
  if shop_verificar(p_token) is null then raise exception 'No autorizado'; end if;
  delete from shop_productos where id = p_id;
end;
$$;

-- ============================================================
-- ADMIN — categorías
-- ============================================================

create or replace function shop_admin_listar_categorias(p_token text)
returns json language plpgsql security definer as $$
begin
  if shop_verificar(p_token) is null then raise exception 'No autorizado'; end if;
  return (select json_agg(c order by c.orden, c.nombre) from shop_categorias c);
end;
$$;

create or replace function shop_admin_guardar_categoria(p_token text, p_datos json)
returns json language plpgsql security definer as $$
declare v_id int;
begin
  if shop_verificar(p_token) is null then raise exception 'No autorizado'; end if;
  v_id := (p_datos->>'id')::int;
  if v_id is not null then
    update shop_categorias set
      nombre      = coalesce(p_datos->>'nombre', nombre),
      descripcion = p_datos->>'descripcion',
      imagen_url  = p_datos->>'imagen_url',
      orden       = coalesce((p_datos->>'orden')::int, orden),
      activa      = coalesce((p_datos->>'activa')::boolean, activa)
    where id = v_id returning id into v_id;
  else
    insert into shop_categorias(nombre, descripcion, imagen_url, orden, activa)
    values (
      p_datos->>'nombre', p_datos->>'descripcion', p_datos->>'imagen_url',
      coalesce((p_datos->>'orden')::int, 0), coalesce((p_datos->>'activa')::boolean, true)
    ) returning id into v_id;
  end if;
  return (select row_to_json(c) from shop_categorias c where id = v_id);
end;
$$;

create or replace function shop_admin_eliminar_categoria(p_token text, p_id int)
returns void language plpgsql security definer as $$
begin
  if shop_verificar(p_token) is null then raise exception 'No autorizado'; end if;
  delete from shop_categorias where id = p_id;
end;
$$;

-- ============================================================
-- ADMIN — configuración
-- ============================================================

create or replace function shop_admin_get_config(p_token text)
returns json language plpgsql security definer as $$
begin
  if shop_verificar(p_token) is null then raise exception 'No autorizado'; end if;
  return (select json_object_agg(clave, valor) from shop_config);
end;
$$;

create or replace function shop_admin_set_config(p_token text, p_datos json)
returns void language plpgsql security definer as $$
declare
  v_key text;
  v_val text;
begin
  if shop_verificar(p_token) is null then raise exception 'No autorizado'; end if;
  for v_key, v_val in select key, value::text from json_each_text(p_datos)
  loop
    insert into shop_config(clave, valor) values (v_key, v_val)
    on conflict (clave) do update set valor = excluded.valor;
  end loop;
end;
$$;

-- ============================================================
-- ADMIN — subir imagen (devuelve URL firmada)
-- ============================================================
-- Las imágenes se suben desde el frontend al bucket 'shop-imagenes'
-- (público). Esta función solo valida la sesión.
create or replace function shop_admin_validar(p_token text)
returns boolean language sql security definer as $$
  select shop_verificar(p_token) is not null;
$$;

-- ============================================================
-- SETUP — crear primer admin (solo si no existe ninguno)
-- ============================================================
create or replace function shop_setup(p_email text, p_nombre text, p_password text)
returns text language plpgsql security definer as $$
begin
  if exists (select 1 from shop_admin) then
    raise exception 'Ya existe un administrador. Usá shop_admin_guardar_admin() para agregar más.';
  end if;
  insert into shop_admin(email, nombre, password_hash)
  values (lower(p_email), p_nombre, crypt(p_password, gen_salt('bf')));
  -- Config inicial
  insert into shop_config(clave, valor) values
    ('nombre_negocio', 'Mi Tienda'),
    ('descripcion_negocio', 'Los mejores productos, directos a tu puerta'),
    ('whatsapp', '5491100000000'),
    ('moneda', '$'),
    ('color_acento', '#f59e0b'),
    ('instagram', ''),
    ('facebook', '')
  on conflict do nothing;
  return 'Admin creado: ' || p_email;
end;
$$;

-- ============================================================
-- GRANTS
-- ============================================================
grant execute on function shop_catalogo(int, text)                         to anon, authenticated;
grant execute on function shop_login(text, text)                            to anon, authenticated;
grant execute on function shop_logout(text)                                 to anon, authenticated;
grant execute on function shop_mi_sesion(text)                              to anon, authenticated;
grant execute on function shop_admin_listar_productos(text)                 to anon, authenticated;
grant execute on function shop_admin_guardar_producto(text, json)           to anon, authenticated;
grant execute on function shop_admin_eliminar_producto(text, int)           to anon, authenticated;
grant execute on function shop_admin_listar_categorias(text)                to anon, authenticated;
grant execute on function shop_admin_guardar_categoria(text, json)          to anon, authenticated;
grant execute on function shop_admin_eliminar_categoria(text, int)          to anon, authenticated;
grant execute on function shop_admin_get_config(text)                       to anon, authenticated;
grant execute on function shop_admin_set_config(text, json)                 to anon, authenticated;
grant execute on function shop_admin_validar(text)                          to anon, authenticated;
grant execute on function shop_setup(text, text, text)                      to anon, authenticated;

-- ============================================================
-- BUCKET DE IMÁGENES (ejecutar en Storage o acá)
-- ============================================================
-- En Supabase Dashboard → Storage → New bucket:
--   Nombre: shop-imagenes
--   Public: SÍ
-- O con SQL (si tenés el schema de storage disponible):
-- insert into storage.buckets(id, name, public) values ('shop-imagenes', 'shop-imagenes', true)
-- on conflict do nothing;
