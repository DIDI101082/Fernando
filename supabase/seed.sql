-- =============================================================
-- RAÍCES REGIONALES — Distribuidora Mayorista
-- Seed de productos reales (catálogo vigencia 14/09/26)
-- Precios mayoristas por unidad (ARS)
-- =============================================================

TRUNCATE products RESTART IDENTITY CASCADE;

INSERT INTO products (name, brand, category, price, emoji, badge, stock, active) VALUES

-- ============================================================
-- ACEITES DE OLIVA — Finca Nobles Caciques AOVE Virgen Extra
-- ============================================================
('AOVE Arbequina 250ml',       'Finca Nobles Caciques', 'aceites',  9000,  '🫒', 'Virgen Extra',  NULL, true),
('AOVE Arbequina 500ml',       'Finca Nobles Caciques', 'aceites', 15500,  '🫒', 'Virgen Extra',  NULL, true),
('AOVE Arbosana 250ml',        'Finca Nobles Caciques', 'aceites',  9000,  '🫒', 'Virgen Extra',  NULL, true),
('AOVE Arbosana 500ml',        'Finca Nobles Caciques', 'aceites', 13500,  '🫒', 'Virgen Extra',  NULL, true),
('AOVE Koroneiki 250ml',       'Finca Nobles Caciques', 'aceites',  9500,  '🫒', 'Virgen Extra',  NULL, true),
('AOVE Koroneiki 500ml',       'Finca Nobles Caciques', 'aceites', 16500,  '🫒', 'Virgen Extra',  NULL, true),
('AOVE Coratina 500ml',        'Finca Nobles Caciques', 'aceites', 18800,  '🫒', 'Premium',       NULL, true),
('Box Regalo 3x250ml (Arbequina+Arbosana+Coratina)', 'Finca Nobles Caciques', 'aceites', 30000, '🎁', 'Ideal regalo', NULL, true),

-- Aceite Vista Larga AOVE Orgánico (La Rioja)
('AOVE Orgánico Suave/Medio/Intenso 250cc PET',  'Vista Larga', 'aceites',  6500,  '🫒', 'Orgánico',  NULL, true),
('AOVE Orgánico Suave/Medio/Intenso 500cc Vidrio','Vista Larga', 'aceites', 12000,  '🫒', 'Orgánico',  NULL, true),
('AOVE Novello 500cc PET',                        'Vista Larga', 'aceites', 10000,  '🫒', 'Sin filtrar', NULL, true),
('AOVE Orgánico 2 Litros PET',                    'Vista Larga', 'aceites', 35000,  '🫒', 'Orgánico',  NULL, true),

-- ============================================================
-- YERBA MATE — Producción Argentina (tradicionales)
-- ============================================================
('Yerba Mate 500gr',            'Nory',      'yerba',  1300,  '🧉', NULL,          NULL, true),
('Yerba Mate 500gr',            'La Buena',  'yerba',  1400,  '🧉', NULL,          NULL, true),
('Yerba Mate 1kg',              'La Buena',  'yerba',  2700,  '🧉', NULL,          NULL, true),
('Yerba Mate 500gr',            'Secadero',  'yerba',  1700,  '🧉', 'Sin TACC',    NULL, true),
('Yerba Mate 500gr',            'Don Omar',  'yerba',  1600,  '🧉', 'Sin gluten',  NULL, true),

-- Yerbas Premium / Artesanales
('Yerba Mate Orgánica 500gr',          'Atiguá',       'yerba',  NULL,  '🧉', 'Orgánica',       NULL, true),
('Yerba con Palo 500gr',               'Ninusha''s Tea','yerba',  NULL,  '🧉', 'Artesanal',      NULL, true),
('Yerba Compuesta + Té Verde 500gr',   'Ninusha''s Tea','yerba',  NULL,  '🧉', 'Artesanal',      NULL, true),

-- Yerbas Importadas
('Yerba Mate Tradicional 500gr',       'Canarias',  'yerba',  5100,  '🧉', 'Importada',   NULL, true),
('Yerba Mate Tradicional 1kg',         'Canarias',  'yerba',  9700,  '🧉', 'Importada',   NULL, true),
('Yerba Serena/Té Verde/Ed. Esp. 500gr','Canarias', 'yerba',  5650,  '🧉', 'Importada',   NULL, true),
('Yerba Serena/Té Verde/Ed. Esp. 1kg', 'Canarias',  'yerba', 10500,  '🧉', 'Importada',   NULL, true),
('Yerba Extra Suave / Tradicional 500gr','Sara',    'yerba',  7500,  '🧉', 'Importada',   NULL, true),
('Yerba Extra Suave / Tradicional 1kg','Sara',      'yerba', 12800,  '🧉', 'Importada',   NULL, true),
('Yerba Mate 500gr',                   'Baldo',     'yerba',  5750,  '🧉', 'Brasil',      NULL, true),
('Yerba Mate 1kg',                     'Baldo',     'yerba', 10500,  '🧉', 'Brasil',      NULL, true),

-- ============================================================
-- INFUSIONES — Nory
-- ============================================================
('Té en Saquitos — caja 25u',          'Nory', 'infusiones',   495,  '🍵', NULL,          NULL, true),
('Té en Saquitos — caja 50u',          'Nory', 'infusiones',   970,  '🍵', NULL,          NULL, true),
('Mate Cocido en Saquitos — caja 25u', 'Nory', 'infusiones',   615,  '🍵', NULL,          NULL, true),
('Mate Cocido en Saquitos — caja 50u', 'Nory', 'infusiones',  1190,  '🍵', NULL,          NULL, true),
('Manzanilla en Saquitos — caja 25u',  'Nory', 'infusiones',   915,  '🌼', NULL,          NULL, true),
('Manzanilla con Anís — caja 25u',     'Nory', 'infusiones',  1100,  '🌼', NULL,          NULL, true),
('Boldo en Saquitos — caja 25u',       'Nory', 'infusiones',  1915,  '🌿', NULL,          NULL, true),
('Café en Saquitos — caja 25u',        'Nory', 'infusiones',  3210,  '☕', NULL,          NULL, true),

-- ============================================================
-- BEBIDAS — Jugos Fruggina (Patagonia Argentina) + Gin Indiana
-- ============================================================
('Jugo Pera o Manzana 250ml',    'Fruggina', 'bebidas',  1350, '🍎', '100% Natural',  NULL, true),
('Jugo Pera o Manzana 500ml',    'Fruggina', 'bebidas',  1950, '🍎', '100% Natural',  NULL, true),
('Jugo Pera o Manzana 910ml',    'Fruggina', 'bebidas',  2900, '🍎', '100% Natural',  NULL, true),
('Jugo Naranja 250ml',           'Fruggina', 'bebidas',  1500, '🍊', '100% Natural',  NULL, true),
('Jugo Naranja 500ml',           'Fruggina', 'bebidas',  2500, '🍊', '100% Natural',  NULL, true),
('Jugo Naranja 910ml',           'Fruggina', 'bebidas',  4000, '🍊', '100% Natural',  NULL, true),
('Gin London Dry 750ml (caja x6)','Indiana Gin','bebidas', 9400, '🍸', 'Artesanal',   NULL, true),

-- ============================================================
-- VINOS — Casa Las Misiones
-- ============================================================
('Reserva de los Andes',         'Reserva de los Andes',  'vinos',  2500, '🍷', NULL,          NULL, true),
('Finca Las Margaritas',         'Finca Las Margaritas',  'vinos',  3500, '🍷', NULL,          NULL, true),
('Goyenechea Clásico',           'Goyenechea',            'vinos',  3200, '🍷', NULL,          NULL, true),
('Goyenechea Varietales (GOYE)', 'Goyenechea',            'vinos',  5000, '🍷', NULL,          NULL, true),
('Goyenechea Frescos',           'Goyenechea',            'vinos',  6150, '🌸', NULL,          NULL, true),
('Goyenechea Centenario',        'Goyenechea',            'vinos',  6500, '🍷', NULL,          NULL, true),
('Goyenechea 5ta Generación',    'Goyenechea',            'vinos', 11800, '🍷', 'Premium',     NULL, true),
('Lorenza de Goyenechea',        'Goyenechea',            'vinos', 12650, '🍷', 'Premium',     NULL, true),
('Vista Larga La Rioja',         'Vista Larga',           'vinos',  6000, '🍷', NULL,          NULL, true),

-- ============================================================
-- CERVEZAS — Goyeneche Familia Cervecera
-- (Botellas — precio por unidad; latas — precio caja x6)
-- ============================================================
-- Botellas estándar
('Golden — botella',       'Goyeneche', 'cervezas', 2100, '🍺', NULL,     NULL, true),
('Blond Ale — botella',    'Goyeneche', 'cervezas', 2100, '🍺', NULL,     NULL, true),
('Scottish — botella',     'Goyeneche', 'cervezas', 2100, '🍺', NULL,     NULL, true),
('Porter — botella',       'Goyeneche', 'cervezas', 2200, '🍺', NULL,     NULL, true),
('Honey — botella',        'Goyeneche', 'cervezas', 2200, '🍯', NULL,     NULL, true),
('American Wheat — botella','Goyeneche','cervezas', 2200, '🌾', NULL,     NULL, true),
('Tripel — botella',       'Goyeneche', 'cervezas', 2900, '🍺', 'Especial', NULL, true),
('APA — botella',          'Goyeneche', 'cervezas', 2900, '🍺', NULL,     NULL, true),
('IPA — botella',          'Goyeneche', 'cervezas', 2900, '🍺', NULL,     NULL, true),
('Doble IPA — botella',    'Goyeneche', 'cervezas', 3800, '🍺', 'Premium', NULL, true),
('Nepia — botella',        'Goyeneche', 'cervezas', 4700, '🍺', 'Especial', NULL, true),
('Hazy IPA — botella',     'Goyeneche', 'cervezas', 4700, '🍺', 'Especial', NULL, true),
('Pacific IPA — botella',  'Goyeneche', 'cervezas', 4700, '🍺', 'Especial', NULL, true),
-- Latas 473ml, caja x6
('Golden — lata 473ml caja x6',   'Goyeneche', 'cervezas', 1650, '🥤', NULL,  NULL, true),
('Honey — lata 473ml caja x6',    'Goyeneche', 'cervezas', 1750, '🥤', NULL,  NULL, true),
('IPA — lata 473ml caja x6',      'Goyeneche', 'cervezas', 2300, '🥤', NULL,  NULL, true),
('Scottish — lata 473ml caja x6', 'Goyeneche', 'cervezas', 1650, '🥤', NULL,  NULL, true),

-- ============================================================
-- DULCES Y CONFITERÍA
-- ============================================================
-- Cachafaz
('Galletitas Integrales (Avena y pasas / Integral y algarroba)', 'Cachafaz', 'dulces', 2900, '🍪', NULL,          NULL, true),
('Galletitas Integrales (Avena y chocolate / Granola+almendras)', 'Cachafaz','dulces', 3100, '🍪', NULL,          NULL, true),
('Galletitas Orgánicas (Avena y miel / Cacao y miel)',           'Cachafaz', 'dulces', 2500, '🌿', 'Orgánicas',   NULL, true),
('Alfajor 72% Cacao — masa de almendras sin harina',             'Cachafaz', 'dulces',34300, '🍫', 'Premium',     NULL, true),
('Alfajores negro/blanco/maicena/mousse — caja exhib. x12',      'Cachafaz', 'dulces',21600, '🍫', NULL,          NULL, true),
('Bocadito Marroc con Crocante — caja exhib. x54',               'Cachafaz', 'dulces',41500, '🍫', NULL,          NULL, true),
('Conito relleno DDL caja exhib. x12',                           'Cachafaz', 'dulces',18900, '🍬', NULL,          NULL, true),
('Pistachino — caja exhib. x36',                                 'Cachafaz', 'dulces',32000, '🍃', 'Especial',    NULL, true),
('Gianduiot — caja exhib. x36',                                  'Cachafaz', 'dulces',32000, '🍫', NULL,          NULL, true),

-- Don Quique Alfajores
('Alfajores Chocolate — bandeja 80u 2.5kg',         'Don Quique', 'dulces', 28000, '🍫', NULL,  NULL, true),
('Alfajores Chocolate Blanco — bandeja 70u 2.5kg',  'Don Quique', 'dulces', 28000, '🍫', NULL,  NULL, true),
('Copitos — bandeja 60u 2kg',                       'Don Quique', 'dulces', 23500, '🤍', NULL,  NULL, true),
('Alfajores caja cartón x18 (Maicena)',             'Don Quique', 'dulces', 13250, '🍫', NULL,  NULL, true),
('Alfajores caja cartón x18 (Chocolate negro/blanco/merengue/black)', 'Don Quique', 'dulces', 14500, '🍫', NULL, NULL, true),

-- Miel y Dulce de Leche
('Miel Pura 500gr',             'Don Saul',      'dulces', 5200, '🍯', 'Artesanal',    NULL, true),
('Miel Pura 1kg',               'Don Saul',      'dulces', 6600, '🍯', 'Artesanal',    NULL, true),
('Dulce de Leche 500gr',        'Lácteos Mayol', 'dulces', 5000, '🥛', 'Sin TACC',     NULL, true),
('Dulce de Leche 1kg',          'Lácteos Mayol', 'dulces', 6600, '🥛', 'Agroecológico',NULL, true),

-- ============================================================
-- CONSERVAS — Aceitunas Vista Larga (La Rioja)
-- ============================================================
('Aceitunas Verdes Arauco / Rellenas — 390gr escurridos',  'Vista Larga', 'conservas', 5700, '🫒', NULL, NULL, true),
('Aceitunas Negras con Carozo — 390gr escurridos',         'Vista Larga', 'conservas', 5700, '🫒', NULL, NULL, true),
('Aceitunas Morrón/Negras Carozo — 390gr escurridos',      'Vista Larga', 'conservas', 5700, '🫒', NULL, NULL, true),
('Aceitunas Verdes Descarozadas — 360gr escurridos',       'Vista Larga', 'conservas', 5700, '🫒', NULL, NULL, true),
('Aceitunas Negras Descarozadas — 360gr escurridos',       'Vista Larga', 'conservas', 5700, '🫒', NULL, NULL, true);
