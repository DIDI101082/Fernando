/** Formatea un número como precio en pesos argentinos */
export function fmt(n: number): string {
  return "$" + n.toLocaleString("es-AR");
}
