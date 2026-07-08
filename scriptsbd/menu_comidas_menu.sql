-- ============================================================
--  EJEMPLO COMPLETO — Menú v4 (SQL Server)
--  Restaurante: "La Trattoria di Luigi"
-- ============================================================

DECLARE @rest_id          UNIQUEIDENTIFIER;

-- Entradas
DECLARE @ceviche_entrada  UNIQUEIDENTIFIER;
DECLARE @tamalito         UNIQUEIDENTIFIER;

-- Bebidas
DECLARE @chicha_morada    UNIQUEIDENTIFIER;
DECLARE @pisco_sour       UNIQUEIDENTIFIER;
DECLARE @inca_kola        UNIQUEIDENTIFIER;

-- A la carta
DECLARE @risotto          UNIQUEIDENTIFIER;
DECLARE @pachamanca       UNIQUEIDENTIFIER;
DECLARE @osobuco          UNIQUEIDENTIFIER;
DECLARE @parrilla         UNIQUEIDENTIFIER;
DECLARE @ceviche_acarta   UNIQUEIDENTIFIER;

-- Postres
DECLARE @tiramisu         UNIQUEIDENTIFIER;
DECLARE @suspiro          UNIQUEIDENTIFIER;

-- Menús compuestos
DECLARE @menu_marino      UNIQUEIDENTIFIER;
DECLARE @menu_criollo     UNIQUEIDENTIFIER;
DECLARE @menu_vegetariano UNIQUEIDENTIFIER;

-- Arma tu plato + opciones
DECLARE @arma             UNIQUEIDENTIFIER;
DECLARE @arroz            UNIQUEIDENTIFIER;
DECLARE @papa             UNIQUEIDENTIFIER;
DECLARE @yuca             UNIQUEIDENTIFIER;
DECLARE @pollo            UNIQUEIDENTIFIER;
DECLARE @carne            UNIQUEIDENTIFIER;
DECLARE @pescado          UNIQUEIDENTIFIER;
DECLARE @ensalada         UNIQUEIDENTIFIER;
DECLARE @queso            UNIQUEIDENTIFIER;

-- Variable scratch para los OUTPUT que no usamos
DECLARE @aux              UNIQUEIDENTIFIER;

SELECT @rest_id = id FROM restaurantes WHERE nombre = 'La Trattoria di Luigi';

-- ============================================================
--  ENTRADAS
-- ============================================================
EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'entradas',
    @nombre                  = 'Ceviche entrada',
    @descripcion             = 'Pescado fresco en limón, cebolla y ají (porción individual)',
    @precio                  = 18.00,
    @peso_gramos             = 180,
    @porciones               = 1,
    @tiempo_preparacion      = 10,
    @informacion_nutricional = 'Aprox. 220 kcal · alto en proteína · sin gluten',
    @nuevo_id                = @ceviche_entrada OUTPUT;

EXEC sp_asignar_etiqueta @ceviche_entrada, 'marino';
EXEC sp_asignar_etiqueta @ceviche_entrada, 'frio';
EXEC sp_asignar_etiqueta @ceviche_entrada, 'sin_gluten';

EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'entradas',
    @nombre                  = 'Tamalito verde',
    @descripcion             = 'Tamal de maíz con culantro y pollo deshilachado',
    @precio                  = 14.00,
    @peso_gramos             = 220,
    @porciones               = 1,
    @tiempo_preparacion      = 5,
    @informacion_nutricional = 'Aprox. 310 kcal · contiene gluten · porción ligera',
    @nuevo_id                = @tamalito OUTPUT;

EXEC sp_asignar_etiqueta @tamalito, 'criollo';
EXEC sp_asignar_etiqueta @tamalito, 'caliente';

-- ============================================================
--  BEBIDAS
-- ============================================================
EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'bebidas',
    @nombre                  = 'Chicha morada',
    @descripcion             = 'Bebida tradicional de maíz morado, piña y especias',
    @precio                  = 10.00,
    @peso_gramos             = 300,
    @porciones               = 1,
    @tiempo_preparacion      = 3,
    @informacion_nutricional = 'Aprox. 110 kcal · sin alcohol · alta en antioxidantes',
    @nuevo_id                = @chicha_morada OUTPUT;

EXEC sp_asignar_etiqueta @chicha_morada, 'sin_alcohol';
EXEC sp_asignar_etiqueta @chicha_morada, 'frio';
EXEC sp_asignar_etiqueta @chicha_morada, 'criollo';

EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'bebidas',
    @nombre                  = 'Pisco sour',
    @descripcion             = 'Cóctel clásico de pisco, limón, clara de huevo y amargo',
    @precio                  = 22.00,
    @peso_gramos             = 180,
    @porciones               = 1,
    @tiempo_preparacion      = 5,
    @informacion_nutricional = 'Aprox. 180 kcal · contiene alcohol · clara de huevo',
    @nuevo_id                = @pisco_sour OUTPUT;

EXEC sp_asignar_etiqueta @pisco_sour, 'con_alcohol';
EXEC sp_asignar_etiqueta @pisco_sour, 'frio';

EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'bebidas',
    @nombre                  = 'Inca Kola',
    @descripcion             = 'Gaseosa peruana sabor a hierba luisa',
    @precio                  = 7.00,
    @peso_gramos             = 500,
    @porciones               = 1,
    @tiempo_preparacion      = 1,
    @informacion_nutricional = 'Aprox. 220 kcal · alta en azúcar',
    @nuevo_id                = @inca_kola OUTPUT;

EXEC sp_asignar_etiqueta @inca_kola, 'sin_alcohol';
EXEC sp_asignar_etiqueta @inca_kola, 'frio';

-- ============================================================
--  A LA CARTA
-- ============================================================
EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'a_la_carta',
    @nombre                  = 'Risotto ai funghi',
    @descripcion             = 'Arroz arborio cremoso con hongos porcini y parmesano',
    @precio                  = 48.00,
    @peso_gramos             = 380,
    @porciones               = 1,
    @tiempo_preparacion      = 25,
    @informacion_nutricional = 'Aprox. 620 kcal · vegetariano · contiene lácteos',
    @nuevo_id                = @risotto OUTPUT;

EXEC sp_asignar_etiqueta @risotto, 'vegetariano';
EXEC sp_asignar_etiqueta @risotto, 'caliente';

EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'a_la_carta',
    @nombre                  = 'Pachamanca',
    @descripcion             = 'Carnes cocidas bajo tierra con habas, papa y humita',
    @precio                  = 55.00,
    @peso_gramos             = 450,
    @porciones               = 1,
    @tiempo_preparacion      = 35,
    @informacion_nutricional = 'Aprox. 780 kcal · plato contundente · alto en proteína',
    @nuevo_id                = @pachamanca OUTPUT;

EXEC sp_asignar_etiqueta @pachamanca, 'criollo';
EXEC sp_asignar_etiqueta @pachamanca, 'caliente';

EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'a_la_carta',
    @nombre                  = 'Osobuco',
    @descripcion             = 'Caña de ternera estofada en vino tinto con vegetales',
    @precio                  = 62.00,
    @peso_gramos             = 420,
    @porciones               = 1,
    @tiempo_preparacion      = 40,
    @informacion_nutricional = 'Aprox. 720 kcal · contiene alcohol en la cocción',
    @nuevo_id                = @osobuco OUTPUT;

EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'a_la_carta',
    @nombre                  = 'Parrilla mixta',
    @descripcion             = 'Bife de chorizo, chorizo, morcilla y chinchulín',
    @precio                  = 78.00,
    @peso_gramos             = 600,
    @porciones               = 1,
    @tiempo_preparacion      = 30,
    @informacion_nutricional = 'Aprox. 980 kcal · porción para compartir',
    @nuevo_id                = @parrilla OUTPUT;

EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'a_la_carta',
    @nombre                  = 'Ceviche clásico',
    @descripcion             = 'Pescado en limón con camote, choclo y cancha (plato de fondo)',
    @precio                  = 45.00,
    @peso_gramos             = 380,
    @porciones               = 1,
    @tiempo_preparacion      = 12,
    @informacion_nutricional = 'Aprox. 520 kcal · alto en proteína · sin gluten',
    @nuevo_id                = @ceviche_acarta OUTPUT;

EXEC sp_asignar_etiqueta @ceviche_acarta, 'marino';
EXEC sp_asignar_etiqueta @ceviche_acarta, 'frio';
EXEC sp_asignar_etiqueta @ceviche_acarta, 'sin_gluten';

-- ============================================================
--  POSTRES
-- ============================================================
EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'postres',
    @nombre                  = 'Tiramisú',
    @descripcion             = 'Bizcochos con mascarpone, café y cacao',
    @precio                  = 22.00,
    @peso_gramos             = 180,
    @porciones               = 1,
    @tiempo_preparacion      = 5,
    @informacion_nutricional = 'Aprox. 420 kcal · contiene lácteos, gluten y alcohol',
    @nuevo_id                = @tiramisu OUTPUT;

EXEC sp_asignar_etiqueta @tiramisu, 'con_alcohol';
EXEC sp_asignar_etiqueta @tiramisu, 'frio';

EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'postres',
    @nombre                  = 'Suspiro a la limeña',
    @descripcion             = 'Manjar blanco con merengue al oporto',
    @precio                  = 18.00,
    @peso_gramos             = 160,
    @porciones               = 1,
    @tiempo_preparacion      = 5,
    @informacion_nutricional = 'Aprox. 480 kcal · muy dulce · contiene huevo y lácteos',
    @nuevo_id                = @suspiro OUTPUT;

EXEC sp_asignar_etiqueta @suspiro, 'criollo';

-- ============================================================
--  MENÚS COMPUESTOS
-- ============================================================

EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'menu',
    @nombre                  = 'Menú marino',
    @descripcion             = 'Entrada de ceviche + ceviche clásico + chicha morada',
    @precio                  = 58.00,
    @porciones               = 1,
    @tiempo_preparacion      = 25,
    @informacion_nutricional = 'Combo marino · ideal para almuerzo',
    @es_menu_compuesto       = 1,
    @nuevo_id                = @menu_marino OUTPUT;

EXEC sp_asignar_etiqueta @menu_marino, 'marino';

EXEC sp_agregar_componente_menu @menu_marino, @ceviche_entrada, 'entrada',     1, 1, @nuevo_id = @aux OUTPUT;
EXEC sp_agregar_componente_menu @menu_marino, @ceviche_acarta,  'plato_fondo', 1, 2, @nuevo_id = @aux OUTPUT;
EXEC sp_agregar_componente_menu @menu_marino, @chicha_morada,   'bebida',      1, 3, @nuevo_id = @aux OUTPUT;

EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'menu',
    @nombre                  = 'Menú criollo',
    @descripcion             = 'Tamalito verde + pachamanca + chicha morada',
    @precio                  = 62.00,
    @porciones               = 1,
    @tiempo_preparacion      = 40,
    @informacion_nutricional = 'Combo criollo abundante',
    @es_menu_compuesto       = 1,
    @nuevo_id                = @menu_criollo OUTPUT;

EXEC sp_asignar_etiqueta @menu_criollo, 'criollo';

EXEC sp_agregar_componente_menu @menu_criollo, @tamalito,      'entrada',     1, 1, @nuevo_id = @aux OUTPUT;
EXEC sp_agregar_componente_menu @menu_criollo, @pachamanca,    'plato_fondo', 1, 2, @nuevo_id = @aux OUTPUT;
EXEC sp_agregar_componente_menu @menu_criollo, @chicha_morada, 'bebida',      1, 3, @nuevo_id = @aux OUTPUT;

EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'menu',
    @nombre                  = 'Menú vegetariano',
    @descripcion             = 'Tamalito + risotto de hongos + chicha morada',
    @precio                  = 55.00,
    @porciones               = 1,
    @tiempo_preparacion      = 30,
    @informacion_nutricional = 'Combo vegetariano · sin carnes',
    @es_menu_compuesto       = 1,
    @nuevo_id                = @menu_vegetariano OUTPUT;

EXEC sp_asignar_etiqueta @menu_vegetariano, 'vegetariano';

EXEC sp_agregar_componente_menu @menu_vegetariano, @tamalito,      'entrada',     1, 1, @nuevo_id = @aux OUTPUT;
EXEC sp_agregar_componente_menu @menu_vegetariano, @risotto,       'plato_fondo', 1, 2, @nuevo_id = @aux OUTPUT;
EXEC sp_agregar_componente_menu @menu_vegetariano, @chicha_morada, 'bebida',      1, 3, @nuevo_id = @aux OUTPUT;

-- ============================================================
--  ARMA TU PLATO
-- ============================================================
EXEC sp_crear_item_menu
    @restaurante_id          = @rest_id,
    @categoria_codigo        = 'arma_plato',
    @nombre                  = 'Arma tu plato',
    @descripcion             = 'Elige tu base + proteína + topping + bebida (precio base)',
    @precio                  = 35.00,
    @porciones               = 1,
    @tiempo_preparacion      = 15,
    @informacion_nutricional = 'Plato personalizado · porción individual',
    @es_arma_plato           = 1,
    @nuevo_id                = @arma OUTPUT;

-- BASES
EXEC sp_crear_item_menu @rest_id, 'a_la_carta', 'Arroz blanco',  'Arroz graneado al vapor',           0, NULL, 180, 1, 5, 'Aprox. 230 kcal', 0, 0, @arroz OUTPUT;
EXEC sp_crear_item_menu @rest_id, 'a_la_carta', 'Papas doradas', 'Papas amarillas doradas al sartén',0, NULL, 200, 1, 8, 'Aprox. 280 kcal', 0, 0, @papa  OUTPUT;
EXEC sp_crear_item_menu @rest_id, 'a_la_carta', 'Yuca frita',    'Bastones de yuca frita crujiente', 0, NULL, 180, 1, 8, 'Aprox. 310 kcal', 0, 0, @yuca  OUTPUT;

EXEC sp_agregar_componente_arma_plato @arma, @arroz, 'base', 0, @nuevo_id = @aux OUTPUT;
EXEC sp_agregar_componente_arma_plato @arma, @papa,  'base', 0, @nuevo_id = @aux OUTPUT;
EXEC sp_agregar_componente_arma_plato @arma, @yuca,  'base', 0, @nuevo_id = @aux OUTPUT;

-- PROTEÍNAS
EXEC sp_crear_item_menu @rest_id, 'a_la_carta', 'Pechuga de pollo',  'Pechuga grillada con hierbas', 0, NULL, 180, 1, 12, 'Aprox. 290 kcal · alto en proteína', 0, 0, @pollo   OUTPUT;
EXEC sp_crear_item_menu @rest_id, 'a_la_carta', 'Lomo de res',       'Bife fino a la plancha',       0, NULL, 180, 1, 12, 'Aprox. 380 kcal · alto en proteína', 0, 0, @carne   OUTPUT;
EXEC sp_crear_item_menu @rest_id, 'a_la_carta', 'Filete de pescado', 'Pescado del día a la plancha', 0, NULL, 180, 1, 10, 'Aprox. 240 kcal · alto en proteína', 0, 0, @pescado OUTPUT;

EXEC sp_agregar_componente_arma_plato @arma, @pollo,   'proteina', 0, @nuevo_id = @aux OUTPUT;
EXEC sp_agregar_componente_arma_plato @arma, @carne,   'proteina', 8, @nuevo_id = @aux OUTPUT;
EXEC sp_agregar_componente_arma_plato @arma, @pescado, 'proteina', 5, @nuevo_id = @aux OUTPUT;

-- TOPPINGS
EXEC sp_crear_item_menu @rest_id, 'entradas', 'Ensalada mixta', 'Lechuga, tomate, palta, cebolla', 0, NULL, 120, 1, 5, 'Aprox. 90 kcal · ligera',          0, 0, @ensalada OUTPUT;
EXEC sp_crear_item_menu @rest_id, 'entradas', 'Queso fresco',   'Queso fresco artesanal',          0, NULL,  80, 1, 2, 'Aprox. 180 kcal · contiene lácteos', 0, 0, @queso    OUTPUT;

EXEC sp_agregar_componente_arma_plato @arma, @ensalada, 'topping', 0, @nuevo_id = @aux OUTPUT;
EXEC sp_agregar_componente_arma_plato @arma, @queso,    'topping', 3, @nuevo_id = @aux OUTPUT;

-- BEBIDAS (reusa las ya creadas)
EXEC sp_agregar_componente_arma_plato @arma, @chicha_morada, 'bebida',  0, @nuevo_id = @aux OUTPUT;
EXEC sp_agregar_componente_arma_plato @arma, @inca_kola,     'bebida',  0, @nuevo_id = @aux OUTPUT;
EXEC sp_agregar_componente_arma_plato @arma, @pisco_sour,    'bebida', 10, @nuevo_id = @aux OUTPUT;

PRINT '✓ Menú v4 insertado correctamente';
GO

