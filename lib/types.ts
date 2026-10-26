export interface Categoria {
  id: number
  nombre: string
  descripcion: string | null
  imagen_url: string | null
  orden: number
  activa: boolean
}

export interface Producto {
  id: number
  nombre: string
  descripcion: string | null
  precio: number
  precio_descuento: number | null
  categoria_id: number | null
  categoria_nombre: string | null
  imagen_url: string | null
  activo: boolean
  orden: number
}

export interface ShopConfig {
  nombre_negocio: string
  descripcion_negocio: string
  whatsapp: string      // ej: 5491100000000
  moneda: string        // ej: $
  color_acento: string  // ej: #f59e0b
  instagram: string
  facebook: string
}

export interface Admin {
  id: number
  nombre: string
  email: string
}
