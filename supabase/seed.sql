-- =============================================================
-- RAÍCES REGIONALES — Distribuidora Mayorista
-- Seed de productos — SOLO los que tienen foto real
-- Precios mayoristas por unidad (ARS) · vigencia nov 2026
-- =============================================================

TRUNCATE products RESTART IDENTITY CASCADE;

INSERT INTO products (name, brand, category, price, image_url, emoji, badge, stock, active) VALUES

-- ============================================================
-- ACEITES DE OLIVA — Finca Nobles Caciques AOVE Virgen Extra
-- ============================================================
('AOVE Coratina 500ml',         'Finca Nobles Caciques', 'aceites', 19500, '/images/nobles-coratina.jpg',  '🫒', 'Premium',       NULL, true),
('AOVE Arbequina 250ml',        'Finca Nobles Caciques', 'aceites',  9500, '/images/nobles-arbequina.jpg', '🫒', 'Virgen Extra',  NULL, true),
('AOVE Arbequina 500ml',        'Finca Nobles Caciques', 'aceites', 16000, '/images/nobles-arbequina.jpg', '🫒', 'Virgen Extra',  NULL, true),
('AOVE Arbosana 250ml',         'Finca Nobles Caciques', 'aceites',  9500, '/images/nobles-arbosana.jpg',  '🫒', 'Virgen Extra',  NULL, true),
('AOVE Arbosana 500ml',         'Finca Nobles Caciques', 'aceites', 16000, '/images/nobles-arbosana.jpg',  '🫒', 'Virgen Extra',  NULL, true),
('AOVE Koroneiki 250ml',        'Finca Nobles Caciques', 'aceites', 10000, '/images/nobles-koroneiki.jpg', '🫒', 'Virgen Extra',  NULL, true),
('AOVE Koroneiki 500ml',        'Finca Nobles Caciques', 'aceites', 17000, '/images/nobles-koroneiki.jpg', '🫒', 'Virgen Extra',  NULL, true),

-- ============================================================
-- YERBA MATE — Atiguá Orgánica
-- ============================================================
('Yerba Mate Orgánica 500gr',   'Atiguá',         'yerba',   NULL, '/images/atigua-yerba.jpg',    '🧉', 'Orgánica',  NULL, true),

-- ============================================================
-- YERBA MATE — León
-- ============================================================
('Yerba Mate con Palo 500gr',            'León',           'yerba',      NULL, '/images/leon-yerba.jpg',                   '🧉', NULL,        NULL, true),

-- ============================================================
-- INFUSIONES — Ninusha's Tea
-- ============================================================
('Yerba Elaborada con Palo 500gr',       'Ninusha''s Tea', 'infusiones', NULL, '/images/ninusha-palo.jpg',                 '🍵', 'Artesanal', NULL, true),
('Mate Cocido + Té Verde en Saquitos',   'Ninusha''s Tea', 'infusiones', NULL, '/images/ninusha-mate-cocido-te-verde.jpg', '🍵', 'Artesanal', NULL, true),
('Té Verde Orgánico en Saquitos',        'Ninusha''s Tea', 'infusiones', NULL, '/images/ninusha-te-verde.jpg',             '🍵', 'Orgánico',  NULL, true),
('Té Negro en Saquitos',                 'Ninusha''s Tea', 'infusiones', NULL, '/images/ninusha-te-negro.jpg',             '🍵', NULL,        NULL, true),
('Yerba Compuesta + Té Verde 500gr',     'Ninusha''s Tea', 'infusiones', NULL, '/images/ninusha-te-verde.jpg',             '🍵', 'Artesanal', NULL, true);
