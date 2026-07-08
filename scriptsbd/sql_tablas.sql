-- ============================================================
--  SISTEMA DE RESERVA DE COMIDAS — Esquema completo (SQL Server)
--  Combina v3 + v4 en un solo script
-- ============================================================


-- ============================================================
--  LIMPIEZA: borrar tablas y triggers existentes
--  El orden importa por las foreign keys
-- ============================================================
USE bdAppcomida;
GO

IF OBJECT_ID('trg_pedido_historial',          'TR') IS NOT NULL DROP TRIGGER trg_pedido_historial;
IF OBJECT_ID('trg_pagos_updated_at',          'TR') IS NOT NULL DROP TRIGGER trg_pagos_updated_at;
IF OBJECT_ID('trg_pedidos_updated_at',        'TR') IS NOT NULL DROP TRIGGER trg_pedidos_updated_at;
IF OBJECT_ID('trg_items_menu_updated_at',     'TR') IS NOT NULL DROP TRIGGER trg_items_menu_updated_at;
IF OBJECT_ID('trg_restaurantes_updated_at',   'TR') IS NOT NULL DROP TRIGGER trg_restaurantes_updated_at;
IF OBJECT_ID('trg_usuarios_updated_at',       'TR') IS NOT NULL DROP TRIGGER trg_usuarios_updated_at;
GO

IF OBJECT_ID('items_etiquetas',         'U') IS NOT NULL DROP TABLE items_etiquetas;
IF OBJECT_ID('etiquetas',               'U') IS NOT NULL DROP TABLE etiquetas;
IF OBJECT_ID('arma_plato_componentes',  'U') IS NOT NULL DROP TABLE arma_plato_componentes;
IF OBJECT_ID('menu_componentes',        'U') IS NOT NULL DROP TABLE menu_componentes;
IF OBJECT_ID('historial_estados',       'U') IS NOT NULL DROP TABLE historial_estados;
IF OBJECT_ID('pagos',                   'U') IS NOT NULL DROP TABLE pagos;
IF OBJECT_ID('pedido_salon',            'U') IS NOT NULL DROP TABLE pedido_salon;
IF OBJECT_ID('pedido_delivery',         'U') IS NOT NULL DROP TABLE pedido_delivery;
IF OBJECT_ID('detalle_pedido',          'U') IS NOT NULL DROP TABLE detalle_pedido;
IF OBJECT_ID('pedidos',                 'U') IS NOT NULL DROP TABLE pedidos;
IF OBJECT_ID('items_menu',              'U') IS NOT NULL DROP TABLE items_menu;
IF OBJECT_ID('categorias_menu',         'U') IS NOT NULL DROP TABLE categorias_menu;
IF OBJECT_ID('mesas',                   'U') IS NOT NULL DROP TABLE mesas;
IF OBJECT_ID('restaurantes',            'U') IS NOT NULL DROP TABLE restaurantes;
IF OBJECT_ID('usuarios',                'U') IS NOT NULL DROP TABLE usuarios;
GO

-- ============================================================
--  RESTAURANTES
-- ============================================================
CREATE TABLE restaurantes (
    id               UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    usuario_id       UNIQUEIDENTIFIER NOT NULL,
    nombre           VARCHAR(150)     NOT NULL,
    direccion        VARCHAR(500)     NOT NULL,
    telefono         VARCHAR(30),
    logo_url         VARCHAR(500),
    acepta_recojo    TINYINT          NOT NULL DEFAULT 1,
    acepta_delivery  TINYINT          NOT NULL DEFAULT 0,
    acepta_salon     TINYINT          NOT NULL DEFAULT 0,
    activo           TINYINT          NOT NULL DEFAULT 1,
    created_at       DATE             NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    updated_at       DATE             NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    CONSTRAINT fk_restaurantes_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE NO ACTION
);
GO


-- ============================================================
--  MESAS
-- ============================================================
CREATE TABLE mesas (
    id               UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    restaurante_id   UNIQUEIDENTIFIER NOT NULL,
    numero           VARCHAR(20)      NOT NULL,
    capacidad        INT              NOT NULL,
    estado           VARCHAR(20)      NOT NULL DEFAULT 'disponible',
    CONSTRAINT chk_mesas_capacidad CHECK (capacidad > 0),
    CONSTRAINT chk_mesas_estado    CHECK (estado IN ('disponible', 'ocupada', 'reservada')),
    CONSTRAINT uq_mesas_restaurante_numero UNIQUE (restaurante_id, numero),
    CONSTRAINT fk_mesas_restaurante FOREIGN KEY (restaurante_id)
        REFERENCES restaurantes(id) ON DELETE CASCADE
);
GO


-- ============================================================
--  CATEGORÍAS DE MENÚ (globales — 6 fijas)
-- ============================================================
CREATE TABLE categorias_menu (
    id              UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    codigo          VARCHAR(30)      NOT NULL UNIQUE,
    nombre          VARCHAR(100)     NOT NULL,
    descripcion     VARCHAR(500),
    activo          TINYINT          NOT NULL DEFAULT 1,
    orden           INT              NOT NULL DEFAULT 0
);
GO

INSERT INTO categorias_menu (codigo, nombre, descripcion, orden) VALUES
    ('menu',       'Menús',         'Combos con entrada, plato de fondo y bebida',              1),
    ('a_la_carta', 'A la carta',    'Platos especializados individuales',                       2),
    ('entradas',   'Entradas',      'Sopas, tamalitos, pancitos y aperitivos',                  3),
    ('postres',    'Postres',       'Dulces, helados y reposterías',                            4),
    ('bebidas',    'Bebidas',       'Calientes, frías, jugos, con o sin alcohol',               5),
    ('arma_plato', 'Arma tu plato', 'Plato personalizado: base + proteína + topping + bebida',  6);
GO


-- ============================================================
--  ÍTEMS DE MENÚ
-- ============================================================
CREATE TABLE items_menu (
    id                       UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    restaurante_id           UNIQUEIDENTIFIER NOT NULL,
    categoria_id             UNIQUEIDENTIFIER NOT NULL,
    nombre                   VARCHAR(150)     NOT NULL,
    descripcion              VARCHAR(1000),
    precio                   DECIMAL(10,2)    NOT NULL DEFAULT 0,
    imagen_url               VARCHAR(500),
    -- presentación
    peso_gramos              DECIMAL(8,2),
    porciones                INT,
    tiempo_preparacion       INT,
    -- nutricional (texto libre)
    informacion_nutricional  VARCHAR(500),
    -- flags de tipo especial
    es_menu_compuesto        TINYINT          NOT NULL DEFAULT 0,
    es_arma_plato            TINYINT          NOT NULL DEFAULT 0,
    -- estado
    disponible               TINYINT          NOT NULL DEFAULT 1,
    created_at               DATE             NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    updated_at               DATE             NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    CONSTRAINT chk_items_precio CHECK (precio >= 0),
    CONSTRAINT fk_items_restaurante FOREIGN KEY (restaurante_id)
        REFERENCES restaurantes(id) ON DELETE CASCADE,
    CONSTRAINT fk_items_categoria FOREIGN KEY (categoria_id)
        REFERENCES categorias_menu(id) ON DELETE NO ACTION
);
GO


-- ============================================================
--  MENÚ — COMPONENTES (qué ítems componen un menú compuesto)
-- ============================================================
CREATE TABLE menu_componentes (
    id              UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    menu_id         UNIQUEIDENTIFIER NOT NULL,
    item_id         UNIQUEIDENTIFIER NOT NULL,
    rol             VARCHAR(30)      NOT NULL,
    obligatorio     TINYINT          NOT NULL DEFAULT 1,
    orden           INT              NOT NULL DEFAULT 0,
    CONSTRAINT uq_menu_componentes UNIQUE (menu_id, item_id),
    CONSTRAINT fk_mc_menu FOREIGN KEY (menu_id)
        REFERENCES items_menu(id) ON DELETE CASCADE,
    CONSTRAINT fk_mc_item FOREIGN KEY (item_id)
        REFERENCES items_menu(id) ON DELETE NO ACTION
);
GO


-- ============================================================
--  ARMA TU PLATO — COMPONENTES
-- ============================================================
CREATE TABLE arma_plato_componentes (
    id              UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    arma_plato_id   UNIQUEIDENTIFIER NOT NULL,
    item_id         UNIQUEIDENTIFIER NOT NULL,
    tipo            VARCHAR(20)      NOT NULL,
    precio_extra    DECIMAL(10,2)    NOT NULL DEFAULT 0,
    disponible      TINYINT          NOT NULL DEFAULT 1,
    CONSTRAINT chk_arma_tipo CHECK (tipo IN ('base', 'proteina', 'topping', 'bebida')),
    CONSTRAINT uq_arma_componentes UNIQUE (arma_plato_id, item_id),
    CONSTRAINT fk_ac_arma FOREIGN KEY (arma_plato_id)
        REFERENCES items_menu(id) ON DELETE CASCADE,
    CONSTRAINT fk_ac_item FOREIGN KEY (item_id)
        REFERENCES items_menu(id) ON DELETE NO ACTION
);
GO


-- ============================================================
--  ETIQUETAS (TAGS)
-- ============================================================
CREATE TABLE etiquetas (
    id              UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    codigo          VARCHAR(50)      NOT NULL UNIQUE,
    nombre          VARCHAR(80)      NOT NULL,
    color           VARCHAR(20),
    activo          TINYINT          NOT NULL DEFAULT 1
);
GO

INSERT INTO etiquetas (codigo, nombre, color) VALUES
    ('vegetariano',    'Vegetariano',     '#1D9E75'),
    ('vegano',         'Vegano',          '#639922'),
    ('sin_gluten',     'Sin gluten',      '#BA7517'),
    ('sin_lactosa',    'Sin lactosa',     '#D85A30'),
    ('picante',        'Picante',         '#E24B4A'),
    ('caliente',       'Caliente',        '#D85A30'),
    ('frio',           'Frío',            '#378ADD'),
    ('con_alcohol',    'Con alcohol',     '#7F77DD'),
    ('sin_alcohol',    'Sin alcohol',     '#5DCAA5'),
    ('jugo',           'Jugo natural',    '#EF9F27'),
    ('marino',         'Marino',          '#185FA5'),
    ('criollo',        'Criollo',         '#993C1D'),
    ('infantil',       'Apto para niños', '#ED93B1');
GO

CREATE TABLE items_etiquetas (
    item_id         UNIQUEIDENTIFIER NOT NULL,
    etiqueta_id     UNIQUEIDENTIFIER NOT NULL,
    CONSTRAINT pk_items_etiquetas PRIMARY KEY (item_id, etiqueta_id),
    CONSTRAINT fk_ie_item     FOREIGN KEY (item_id)     REFERENCES items_menu(id) ON DELETE CASCADE,
    CONSTRAINT fk_ie_etiqueta FOREIGN KEY (etiqueta_id) REFERENCES etiquetas(id)  ON DELETE CASCADE
);
GO


-- ============================================================
--  PEDIDOS
-- ============================================================
CREATE TABLE pedidos (
    id               UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    cliente_id       UNIQUEIDENTIFIER NOT NULL,
    restaurante_id   UNIQUEIDENTIFIER NOT NULL,
    modo             VARCHAR(20)      NOT NULL,
    estado           VARCHAR(20)      NOT NULL DEFAULT 'recibido',
    subtotal         DECIMAL(10,2)    NOT NULL DEFAULT 0,
    costo_delivery   DECIMAL(10,2)    NOT NULL DEFAULT 0,
    total            DECIMAL(10,2)    NOT NULL DEFAULT 0,
    codigo_qr        VARCHAR(255)     NULL UNIQUE,
    notas            VARCHAR(1000),
    created_at       DATE             NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    updated_at       DATE             NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    CONSTRAINT chk_pedidos_modo   CHECK (modo   IN ('recojo', 'delivery', 'salon')),
    CONSTRAINT chk_pedidos_estado CHECK (estado IN ('recibido', 'en_preparacion', 'listo', 'entregado')),
    CONSTRAINT fk_pedidos_cliente     FOREIGN KEY (cliente_id)
        REFERENCES usuarios(id) ON DELETE NO ACTION,
    CONSTRAINT fk_pedidos_restaurante FOREIGN KEY (restaurante_id)
        REFERENCES restaurantes(id) ON DELETE NO ACTION
);
GO


-- ============================================================
--  DETALLE DE PEDIDO
-- ============================================================
CREATE TABLE detalle_pedido (
    id               UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    pedido_id        UNIQUEIDENTIFIER NOT NULL,
    item_menu_id     UNIQUEIDENTIFIER NOT NULL,
    cantidad         INT              NOT NULL,
    precio_unitario  DECIMAL(10,2)    NOT NULL DEFAULT 0,
    notas_item       VARCHAR(500),
    CONSTRAINT chk_detalle_cantidad        CHECK (cantidad > 0),
    CONSTRAINT chk_detalle_precio_unitario CHECK (precio_unitario >= 0),
    CONSTRAINT fk_detalle_pedido    FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id) ON DELETE CASCADE,
    CONSTRAINT fk_detalle_item_menu FOREIGN KEY (item_menu_id)
        REFERENCES items_menu(id) ON DELETE NO ACTION
);
GO


-- ============================================================
--  PEDIDO — DETALLE DELIVERY
-- ============================================================
CREATE TABLE pedido_delivery (
    id                UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    pedido_id         UNIQUEIDENTIFIER NOT NULL UNIQUE,
    repartidor_id     UNIQUEIDENTIFIER NULL,
    direccion_entrega VARCHAR(500)     NOT NULL,
    referencia        VARCHAR(300),
    latitud           DECIMAL(10,7),
    longitud          DECIMAL(10,7),
    estado            VARCHAR(20)      NOT NULL DEFAULT 'asignado',
    entregado_at      DATE             NULL,
    CONSTRAINT chk_delivery_estado CHECK (estado IN ('asignado', 'en_camino', 'entregado')),
    CONSTRAINT fk_delivery_pedido     FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id) ON DELETE CASCADE,
    CONSTRAINT fk_delivery_repartidor FOREIGN KEY (repartidor_id)
        REFERENCES usuarios(id) ON DELETE SET NULL
);
GO


-- ============================================================
--  PEDIDO — DETALLE SALÓN
-- ============================================================
CREATE TABLE pedido_salon (
    id               UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    pedido_id        UNIQUEIDENTIFIER NOT NULL UNIQUE,
    mesa_id          UNIQUEIDENTIFIER NOT NULL,
    num_comensales   INT              NOT NULL DEFAULT 1,
    sentado_at       DATE             NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    CONSTRAINT chk_salon_comensales CHECK (num_comensales > 0),
    CONSTRAINT fk_salon_pedido FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id) ON DELETE CASCADE,
    CONSTRAINT fk_salon_mesa   FOREIGN KEY (mesa_id)
        REFERENCES mesas(id) ON DELETE NO ACTION
);
GO


-- ============================================================
--  PAGOS
-- ============================================================
CREATE TABLE pagos (
    id                  UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    pedido_id           UNIQUEIDENTIFIER NOT NULL UNIQUE,
    monto               DECIMAL(10,2)    NOT NULL DEFAULT 0,
    metodo              VARCHAR(20)      NOT NULL,
    estado              VARCHAR(20)      NOT NULL DEFAULT 'pendiente',
    referencia_externa  VARCHAR(255),
    created_at          DATE             NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    updated_at          DATE             NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    CONSTRAINT chk_pagos_monto  CHECK (monto >= 0),
    CONSTRAINT chk_pagos_metodo CHECK (metodo IN ('tarjeta', 'transferencia', 'efectivo')),
    CONSTRAINT chk_pagos_estado CHECK (estado IN ('pendiente', 'completado', 'fallido')),
    CONSTRAINT fk_pagos_pedido  FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id) ON DELETE NO ACTION
);
GO


-- ============================================================
--  HISTORIAL DE ESTADOS
-- ============================================================
CREATE TABLE historial_estados (
    id               UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    pedido_id        UNIQUEIDENTIFIER NOT NULL,
    usuario_id       UNIQUEIDENTIFIER NULL,
    estado_nuevo     VARCHAR(20)      NOT NULL,
    created_at       DATE             NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    CONSTRAINT chk_historial_estado CHECK (estado_nuevo IN ('recibido', 'en_preparacion', 'listo', 'entregado')),
    CONSTRAINT fk_historial_pedido  FOREIGN KEY (pedido_id)
        REFERENCES pedidos(id) ON DELETE CASCADE,
    CONSTRAINT fk_historial_usuario FOREIGN KEY (usuario_id)
        REFERENCES usuarios(id) ON DELETE SET NULL
);
GO


-- ============================================================
--  ÍNDICES
-- ============================================================
CREATE INDEX idx_pedidos_cliente             ON pedidos(cliente_id);
CREATE INDEX idx_pedidos_restaurante         ON pedidos(restaurante_id);
CREATE INDEX idx_pedidos_estado              ON pedidos(estado);
CREATE INDEX idx_pedidos_modo                ON pedidos(modo);
CREATE INDEX idx_detalle_pedido              ON detalle_pedido(pedido_id);
CREATE INDEX idx_items_menu_restaurante      ON items_menu(restaurante_id);
CREATE INDEX idx_items_menu_categoria        ON items_menu(categoria_id);
CREATE INDEX idx_items_menu_es_menu          ON items_menu(es_menu_compuesto);
CREATE INDEX idx_items_menu_es_arma          ON items_menu(es_arma_plato);
CREATE INDEX idx_historial_pedido            ON historial_estados(pedido_id);
CREATE INDEX idx_pedido_delivery             ON pedido_delivery(repartidor_id);
CREATE INDEX idx_mesas_restaurante           ON mesas(restaurante_id);
CREATE INDEX idx_menu_componentes_menu       ON menu_componentes(menu_id);
CREATE INDEX idx_menu_componentes_item       ON menu_componentes(item_id);
CREATE INDEX idx_arma_componentes_arma       ON arma_plato_componentes(arma_plato_id);
CREATE INDEX idx_arma_componentes_tipo       ON arma_plato_componentes(tipo);
CREATE INDEX idx_items_etiquetas_etiqueta    ON items_etiquetas(etiqueta_id);
GO


-- ============================================================
--  TRIGGERS — updated_at automático
-- ============================================================
CREATE TRIGGER trg_usuarios_updated_at ON usuarios
AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE usuarios SET updated_at = CAST(GETDATE() AS DATE)
    FROM usuarios u INNER JOIN inserted i ON u.id = i.id;
END;
GO

CREATE TRIGGER trg_restaurantes_updated_at ON restaurantes
AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE restaurantes SET updated_at = CAST(GETDATE() AS DATE)
    FROM restaurantes r INNER JOIN inserted i ON r.id = i.id;
END;
GO

CREATE TRIGGER trg_items_menu_updated_at ON items_menu
AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE items_menu SET updated_at = CAST(GETDATE() AS DATE)
    FROM items_menu im INNER JOIN inserted i ON im.id = i.id;
END;
GO

CREATE TRIGGER trg_pedidos_updated_at ON pedidos
AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE pedidos SET updated_at = CAST(GETDATE() AS DATE)
    FROM pedidos p INNER JOIN inserted i ON p.id = i.id;
END;
GO

CREATE TRIGGER trg_pagos_updated_at ON pagos
AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    UPDATE pagos SET updated_at = CAST(GETDATE() AS DATE)
    FROM pagos pa INNER JOIN inserted i ON pa.id = i.id;
END;
GO


-- ============================================================
--  TRIGGER: historial automático al cambiar estado del pedido
-- ============================================================
CREATE TRIGGER trg_pedido_historial ON pedidos
AFTER UPDATE AS
BEGIN
    SET NOCOUNT ON;
    INSERT INTO historial_estados (id, pedido_id, estado_nuevo, created_at)
    SELECT NEWID(), i.id, i.estado, CAST(GETDATE() AS DATE)
    FROM inserted i INNER JOIN deleted d ON i.id = d.id
    WHERE i.estado <> d.estado;
END;
GO

PRINT '✓ Esquema completo creado correctamente';
GO

