import { Producto, ShopConfig } from './types'

export function waLink(producto: Producto, config: ShopConfig, cantidad = 1): string {
  const precio = producto.precio_descuento ?? producto.precio
  const moneda = config.moneda || '$'
  const texto = encodeURIComponent(
    `Hola! Me interesa el siguiente producto:\n\n` +
    `*${producto.nombre}*\n` +
    `Precio: ${moneda}${precio.toLocaleString('es-AR')}\n` +
    (cantidad > 1 ? `Cantidad: ${cantidad}\n` : '') +
    `\nQuedo a la espera. Gracias!`
  )
  return `https://wa.me/${config.whatsapp}?text=${texto}`
}

export function formatPrecio(precio: number, moneda = '$'): string {
  return `${moneda}${precio.toLocaleString('es-AR', { minimumFractionDigits: 0, maximumFractionDigits: 2 })}`
}
