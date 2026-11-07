/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    // Agrega aquí dominios externos si usás imágenes de Supabase Storage
    // domains: ["tu-proyecto.supabase.co"],
    formats: ["image/avif", "image/webp"],
  },
};

module.exports = nextConfig;
