/** Formatea un número como precio en pesos argentinos */
export function fmt(n: number | null | undefined): string {
  if (n == null) return "Consultar precio";
  return "$" + n.toLocaleString("es-AR");
}
