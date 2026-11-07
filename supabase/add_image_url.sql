-- =============================================================
-- Agregar columna image_url a la tabla products existente
-- Ejecutar en: Supabase → SQL Editor → New Query
-- Solo correr esto si ya tenías la tabla creada antes
-- =============================================================

ALTER TABLE products ADD COLUMN IF NOT EXISTS image_url text;
