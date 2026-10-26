# Shop WA — Catálogo con WhatsApp

Sitio de catálogo de productos con panel admin. Los clientes ven el catálogo y piden por WhatsApp; sin carrito ni checkout.

**Stack:** Next.js 14 · Supabase · Tailwind CSS · Vercel

---

## Puesta en marcha

### 1. Supabase

1. Creá un proyecto en [supabase.com](https://supabase.com)
2. En **SQL Editor**, ejecutá todo el contenido de `supabase/shop.sql`
3. Iniciá el primer admin ejecutando en SQL Editor:
   ```sql
   SELECT shop_setup('admin@tudominio.com', 'Tu Nombre', 'contraseña_segura');
   ```
4. En **Storage → Buckets**, creá un bucket llamado `shop-imagenes` con visibilidad **Public**

### 2. Variables de entorno

Copiá `.env.example` a `.env.local` y completá con tus datos de Supabase:

```bash
cp .env.example .env.local
```

Los valores los encontrás en **Supabase → Settings → API**:
- `NEXT_PUBLIC_SUPABASE_URL` → Project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` → anon/public key

### 3. Instalar y correr

```bash
npm install
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000) para ver el catálogo.
El panel admin está en [http://localhost:3000/admin](http://localhost:3000/admin).

---

## Deploy en Vercel

1. Subí el proyecto a GitHub
2. Importá el repo en [vercel.com](https://vercel.com)
3. Agregá las variables de entorno en **Settings → Environment Variables**
4. Deploy ✅

---

## Estructura de páginas

| Ruta | Descripción |
|------|-------------|
| `/` | Catálogo público (sin login) |
| `/admin` | Login del panel admin |
| `/admin/productos` | ABM de productos con imágenes |
| `/admin/categorias` | ABM de categorías con imágenes |
| `/admin/config` | Configuración del negocio |

---

## Configuración del negocio

Desde `/admin/config` podés editar:

- **Nombre del negocio** — aparece en el header del catálogo
- **Descripción** — subtítulo en el header
- **WhatsApp** — número con código de país, sin +. Ej: `5491112345678`
- **Moneda** — símbolo que aparece antes del precio. Ej: `$`, `USD`
- **Color de acento** — color principal del catálogo (hexadecimal). Default: `#f59e0b`
- **Instagram** — con o sin @. Si está vacío no se muestra
- **Facebook** — URL o nombre de página. Si está vacío no se muestra

---

## Imágenes de productos

Las imágenes se suben al bucket `shop-imagenes` de Supabase Storage.
El bucket debe ser **público** para que se muestren en el catálogo sin autenticación.

Formato recomendado: JPG/WebP, relación 1:1 para productos, 16:9 para categorías.

---

## Seguridad

- Todas las tablas tienen **RLS habilitado** con `REVOKE ALL` para anon/authenticated
- El acceso es exclusivamente por funciones `SECURITY DEFINER`
- Las sesiones de admin usan tokens de 48 hex chars almacenados como SHA-256
- Las contraseñas se hashean con bcrypt (pgcrypto `crypt()`)
- El catálogo público (`shop_catalogo`) no requiere token

---

## Agregar más admins

Ejecutar en SQL Editor de Supabase:

```sql
INSERT INTO shop_admin (nombre, email, password_hash)
VALUES ('Nombre', 'email@ejemplo.com', crypt('contraseña', gen_salt('bf')));
```
