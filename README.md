# 🏪 Raíces Regionales — Tienda Online

Sitio de ventas para distribuidora mayorista. Stack: **Next.js 14 + Supabase + Vercel**.

---

## 🚀 Puesta en marcha

### 1. Clonar e instalar dependencias

```bash
git clone https://github.com/tu-usuario/raices-regionales.git
cd raices-regionales
npm install
```

### 2. Configurar variables de entorno

```bash
cp .env.local.example .env.local
```

Editá `.env.local` con tus valores de Supabase:

| Variable | Dónde encontrarla |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | supabase.com → Settings → API → Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | supabase.com → Settings → API → anon public |
| `SUPABASE_SERVICE_ROLE_KEY` | supabase.com → Settings → API → service_role |
| `NEXT_PUBLIC_WA_NUMBER` | Tu número sin `+` (ej: `5491123456789`) |

### 3. Crear tablas en Supabase

En el **SQL Editor** de tu proyecto Supabase:

1. Correr `supabase/schema.sql`
2. Correr `supabase/seed.sql` (productos de ejemplo)

### 4. Correr en local

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000)

---

## 📦 Deploy en Vercel

1. Subí el repo a GitHub
2. Importalo en [vercel.com](https://vercel.com) → "New Project"
3. Agregá las variables de entorno en Vercel → Settings → Environment Variables
4. Vercel detecta Next.js automáticamente → ¡Deploy! 🎉

---

## 🗂 Estructura del proyecto

```
raices-regionales/
├── app/
│   ├── layout.tsx          # Layout global + CartProvider
│   ├── page.tsx            # Página principal (Server Component, fetch de productos)
│   ├── globals.css
│   └── api/orders/route.ts # API route para guardar pedidos en Supabase
├── components/
│   ├── ShopClient.tsx      # Shell cliente: búsqueda, filtros, grilla
│   ├── Header.tsx          # Barra superior con logo y carrito
│   ├── CategoryFilter.tsx  # Botones de categoría
│   ├── ProductCard.tsx     # Tarjeta de producto
│   ├── CartDrawer.tsx      # Panel lateral del carrito
│   └── Toast.tsx           # Notificación flotante
├── context/
│   └── CartContext.tsx     # Estado global del carrito (useReducer + localStorage)
├── lib/
│   ├── supabase.ts         # Cliente Supabase (browser)
│   ├── supabase-server.ts  # Cliente Supabase (server/API routes)
│   ├── types.ts            # Tipos TypeScript
│   └── format.ts           # Formateo de precios
├── supabase/
│   ├── schema.sql          # Tablas + RLS policies
│   └── seed.sql            # Productos de ejemplo
└── public/
    └── logo.jpg            # Logo de Raíces Regionales
```

---

## ✏️ Personalización rápida

- **Agregar productos**: en Supabase → Table Editor → `products` → Insert row  
- **Cambiar precios**: editar directamente en la tabla `products`  
- **Número de WhatsApp**: variable `NEXT_PUBLIC_WA_NUMBER` en `.env.local` y en Vercel  
- **Categorías nuevas**: agregar en `lib/types.ts` → array `CATEGORIES`

---

## 🛒 Flujo del carrito

1. Cliente agrega productos → estado en `CartContext` (persiste en `localStorage`)
2. Al pedir, se guarda el pedido en Supabase vía `/api/orders`
3. Se abre WhatsApp con el detalle del pedido y el número de orden
