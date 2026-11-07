import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { CartProvider } from "@/context/CartContext";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Raíces Regionales — Distribuidora Mayorista",
  description:
    "Productos de almacén al mejor precio. Yerba, aceites, azúcar, arroz y mucho más. Distribuidora Mayorista.",
  openGraph: {
    title: "Raíces Regionales — Distribuidora Mayorista",
    description: "Comprá yerba, aceites, azúcar, harinas y más.",
    images: ["/logo.jpg"],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  );
}
