-- ============================================================
--  SISTEMA DE RESERVA DE COMIDAS — Procedures completo (SQL Server)
--  Combina v3 + v4 en un solo archivo
-- ============================================================


-- ============================================================
--  USUARIOS
-- ============================================================
GO

IF OBJECT_ID('sp_crear_usuario', 'P') IS NOT NULL DROP PROCEDURE sp_crear_usuario;
GO

CREATE PROCEDURE sp_crear_usuario
    @nombre        VARCHAR(100),
    @apellido      VARCHAR(100),
    @email         VARCHAR(255),
    @password_hash VARCHAR(255),
    @rol           VARCHAR(30) = 'cliente',
    @nuevo_id      UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM usuarios WHERE email = @email)
        THROW 50001, 'El email ya está registrado.', 1;

    SET @nuevo_id = NEWID();
    INSERT INTO usuarios (id, nombre, apellido, email, password_hash, rol)
    VALUES (@nuevo_id, @nombre, @apellido, @email, @password_hash, @rol);
END;
GO

IF OBJECT_ID('sp_actualizar_usuario', 'P') IS NOT NULL DROP PROCEDURE sp_actualizar_usuario;
GO

CREATE PROCEDURE sp_actualizar_usuario
    @id       UNIQUEIDENTIFIER,
    @nombre   VARCHAR(100),
    @apellido VARCHAR(100),
    @email    VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE id = @id)
        THROW 50002, 'Usuario no encontrado.', 1;
    IF EXISTS (SELECT 1 FROM usuarios WHERE email = @email AND id <> @id)
        THROW 50003, 'El email ya está en uso.', 1;

    UPDATE usuarios SET nombre = @nombre, apellido = @apellido, email = @email
    WHERE id = @id;
END;
GO

IF OBJECT_ID('sp_cambiar_password', 'P') IS NOT NULL DROP PROCEDURE sp_cambiar_password;
GO

CREATE PROCEDURE sp_cambiar_password
    @id            UNIQUEIDENTIFIER,
    @password_hash VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE usuarios SET password_hash = @password_hash WHERE id = @id;
    IF @@ROWCOUNT = 0 THROW 50004, 'Usuario no encontrado.', 1;
END;
GO

IF OBJECT_ID('sp_toggle_usuario', 'P') IS NOT NULL DROP PROCEDURE sp_toggle_usuario;
GO

CREATE PROCEDURE sp_toggle_usuario
    @id     UNIQUEIDENTIFIER,
    @activo TINYINT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE usuarios SET activo = @activo WHERE id = @id;
    IF @@ROWCOUNT = 0 THROW 50005, 'Usuario no encontrado.', 1;
END;
GO

IF OBJECT_ID('sp_listar_usuarios', 'P') IS NOT NULL DROP PROCEDURE sp_listar_usuarios;
GO

CREATE PROCEDURE sp_listar_usuarios
    @rol VARCHAR(30) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, nombre, apellido, email, rol, activo, created_at
    FROM usuarios
    WHERE (@rol IS NULL OR rol = @rol)
    ORDER BY created_at DESC;
END;
GO

IF OBJECT_ID('sp_obtener_usuario', 'P') IS NOT NULL DROP PROCEDURE sp_obtener_usuario;
GO

CREATE PROCEDURE sp_obtener_usuario
    @id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, nombre, apellido, email, rol, activo, created_at
    FROM usuarios WHERE id = @id;
END;
GO

IF OBJECT_ID('sp_obtener_usuario_por_email','P') IS NOT NULL DROP PROCEDURE sp_obtener_usuario_por_email;
GO
CREATE PROCEDURE sp_obtener_usuario_por_email
    @email VARCHAR(255)
AS BEGIN
    SET NOCOUNT ON;
    SELECT id, nombre, apellido, email, password_hash, rol, activo, created_at
    FROM usuarios WHERE email = @email;
END;
GO

-- ============================================================
--  RESTAURANTES
-- ============================================================

IF OBJECT_ID('sp_crear_restaurante', 'P') IS NOT NULL DROP PROCEDURE sp_crear_restaurante;
GO

CREATE PROCEDURE sp_crear_restaurante
    @usuario_id      UNIQUEIDENTIFIER,
    @nombre          VARCHAR(150),
    @direccion       VARCHAR(500),
    @telefono        VARCHAR(30)  = NULL,
    @logo_url        VARCHAR(500) = NULL,
    @acepta_recojo   TINYINT      = 1,
    @acepta_delivery TINYINT      = 0,
    @acepta_salon    TINYINT      = 0,
    @nuevo_id        UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE id = @usuario_id AND rol = 'restaurante')
        THROW 50010, 'El usuario no existe o no tiene rol restaurante.', 1;

    SET @nuevo_id = NEWID();
    INSERT INTO restaurantes (id, usuario_id, nombre, direccion, telefono, logo_url,
                              acepta_recojo, acepta_delivery, acepta_salon)
    VALUES (@nuevo_id, @usuario_id, @nombre, @direccion, @telefono, @logo_url,
            @acepta_recojo, @acepta_delivery, @acepta_salon);
END;
GO

IF OBJECT_ID('sp_actualizar_restaurante', 'P') IS NOT NULL DROP PROCEDURE sp_actualizar_restaurante;
GO

CREATE PROCEDURE sp_actualizar_restaurante
    @id              UNIQUEIDENTIFIER,
    @nombre          VARCHAR(150),
    @direccion       VARCHAR(500),
    @telefono        VARCHAR(30),
    @logo_url        VARCHAR(500),
    @acepta_recojo   TINYINT,
    @acepta_delivery TINYINT,
    @acepta_salon    TINYINT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE restaurantes
    SET nombre          = @nombre,
        direccion       = @direccion,
        telefono        = @telefono,
        logo_url        = @logo_url,
        acepta_recojo   = @acepta_recojo,
        acepta_delivery = @acepta_delivery,
        acepta_salon    = @acepta_salon
    WHERE id = @id;
    IF @@ROWCOUNT = 0 THROW 50011, 'Restaurante no encontrado.', 1;
END;
GO

IF OBJECT_ID('sp_toggle_restaurante', 'P') IS NOT NULL DROP PROCEDURE sp_toggle_restaurante;
GO

CREATE PROCEDURE sp_toggle_restaurante
    @id     UNIQUEIDENTIFIER,
    @activo TINYINT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE restaurantes SET activo = @activo WHERE id = @id;
    IF @@ROWCOUNT = 0 THROW 50012, 'Restaurante no encontrado.', 1;
END;
GO

IF OBJECT_ID('sp_listar_restaurantes', 'P') IS NOT NULL DROP PROCEDURE sp_listar_restaurantes;
GO

CREATE OR ALTER PROCEDURE sp_listar_restaurantes
    @solo_activos TINYINT = 1
    ,@id_user UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @rol varchar(30);
    Set @rol = (SELECT rol FROM usuarios WHERE id = @id_user);

    IF @rol = 'restaurante'
    BEGIN
        SELECT id, nombre, direccion, telefono,
               acepta_recojo, acepta_delivery, acepta_salon, activo
        FROM restaurantes
        WHERE (@solo_activos = 0 OR activo = 1)
        and usuario_id = @id_user
        ORDER BY nombre;
    END
    ELSE
    BEGIN
        SELECT id, nombre, direccion, telefono,
               acepta_recojo, acepta_delivery, acepta_salon, activo
        FROM restaurantes
        WHERE (@solo_activos = 0 OR activo = 1)
        ORDER BY nombre;
    END
END;
GO


-- ============================================================
--  MESAS
-- ============================================================

IF OBJECT_ID('sp_crear_mesa', 'P') IS NOT NULL DROP PROCEDURE sp_crear_mesa;
GO

CREATE PROCEDURE sp_crear_mesa
    @restaurante_id UNIQUEIDENTIFIER,
    @numero         VARCHAR(20),
    @capacidad      INT,
    @nuevo_id       UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM mesas WHERE restaurante_id = @restaurante_id AND numero = @numero)
        THROW 50020, 'La mesa ya existe en este restaurante.', 1;

    SET @nuevo_id = NEWID();
    INSERT INTO mesas (id, restaurante_id, numero, capacidad)
    VALUES (@nuevo_id, @restaurante_id, @numero, @capacidad);
END;
GO

IF OBJECT_ID('sp_actualizar_mesa', 'P') IS NOT NULL DROP PROCEDURE sp_actualizar_mesa;
GO

CREATE PROCEDURE sp_actualizar_mesa
    @id         UNIQUEIDENTIFIER,
    @numero     VARCHAR(20),
    @capacidad  INT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE mesas SET numero = @numero, capacidad = @capacidad WHERE id = @id;
    IF @@ROWCOUNT = 0 THROW 50021, 'Mesa no encontrada.', 1;
END;
GO

IF OBJECT_ID('sp_cambiar_estado_mesa', 'P') IS NOT NULL DROP PROCEDURE sp_cambiar_estado_mesa;
GO

CREATE PROCEDURE sp_cambiar_estado_mesa
    @id     UNIQUEIDENTIFIER,
    @estado VARCHAR(20)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE mesas SET estado = @estado WHERE id = @id;
    IF @@ROWCOUNT = 0 THROW 50022, 'Mesa no encontrada.', 1;
END;
GO

IF OBJECT_ID('sp_eliminar_mesa', 'P') IS NOT NULL DROP PROCEDURE sp_eliminar_mesa;
GO

CREATE PROCEDURE sp_eliminar_mesa
    @id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM pedido_salon WHERE mesa_id = @id)
        THROW 50023, 'No se puede eliminar la mesa porque tiene pedidos asociados.', 1;
    DELETE FROM mesas WHERE id = @id;
END;
GO

IF OBJECT_ID('sp_listar_mesas', 'P') IS NOT NULL DROP PROCEDURE sp_listar_mesas;
GO

CREATE PROCEDURE sp_listar_mesas
    @restaurante_id UNIQUEIDENTIFIER,
    @estado         VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, numero, capacidad, estado
    FROM mesas
    WHERE restaurante_id = @restaurante_id
      AND (@estado IS NULL OR estado = @estado)
    ORDER BY numero;
END;
GO


-- ============================================================
--  CATEGORÍAS GLOBALES
-- ============================================================

IF OBJECT_ID('sp_listar_categorias_globales', 'P') IS NOT NULL DROP PROCEDURE sp_listar_categorias_globales;
GO

CREATE PROCEDURE sp_listar_categorias_globales
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, codigo, nombre, descripcion, orden
    FROM categorias_menu
    WHERE activo = 1
    ORDER BY orden;
END;
GO


-- ============================================================
--  ÍTEMS DE MENÚ
-- ============================================================

IF OBJECT_ID('sp_crear_item_menu', 'P') IS NOT NULL DROP PROCEDURE sp_crear_item_menu;
GO

CREATE PROCEDURE sp_crear_item_menu
    @restaurante_id          UNIQUEIDENTIFIER,
    @categoria_codigo        VARCHAR(30),
    @nombre                  VARCHAR(150),
    @descripcion             VARCHAR(1000) = NULL,
    @precio                  DECIMAL(10,2) = 0,
    @imagen_url              VARCHAR(500)  = NULL,
    @peso_gramos             DECIMAL(8,2)  = NULL,
    @porciones               INT           = NULL,
    @tiempo_preparacion      INT           = NULL,
    @informacion_nutricional VARCHAR(500)  = NULL,
    @es_menu_compuesto       TINYINT       = 0,
    @es_arma_plato           TINYINT       = 0,
    @nuevo_id                UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @categoria_id UNIQUEIDENTIFIER;

    SELECT @categoria_id = id FROM categorias_menu WHERE codigo = @categoria_codigo;
    IF @categoria_id IS NULL
        THROW 51001, 'Categoría no existe.', 1;

    IF @es_menu_compuesto = 1 AND @categoria_codigo <> 'menu'
        THROW 51002, 'Solo ítems de categoría "menu" pueden ser menú compuesto.', 1;
    IF @es_arma_plato = 1 AND @categoria_codigo <> 'arma_plato'
        THROW 51003, 'Solo ítems de categoría "arma_plato" pueden ser arma tu plato.', 1;

    SET @nuevo_id = NEWID();
    INSERT INTO items_menu (
        id, restaurante_id, categoria_id, nombre, descripcion, precio, imagen_url,
        peso_gramos, porciones, tiempo_preparacion, informacion_nutricional,
        es_menu_compuesto, es_arma_plato
    )
    VALUES (
        @nuevo_id, @restaurante_id, @categoria_id, @nombre, @descripcion, @precio, @imagen_url,
        @peso_gramos, @porciones, @tiempo_preparacion, @informacion_nutricional,
        @es_menu_compuesto, @es_arma_plato
    );
END;
GO

IF OBJECT_ID('sp_actualizar_item_menu', 'P') IS NOT NULL DROP PROCEDURE sp_actualizar_item_menu;
GO

CREATE PROCEDURE sp_actualizar_item_menu
    @id                      UNIQUEIDENTIFIER,
    @categoria_codigo        VARCHAR(30),
    @nombre                  VARCHAR(150),
    @descripcion             VARCHAR(1000),
    @precio                  DECIMAL(10,2),
    @imagen_url              VARCHAR(500),
    @peso_gramos             DECIMAL(8,2),
    @porciones               INT,
    @tiempo_preparacion      INT,
    @informacion_nutricional VARCHAR(500)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @categoria_id UNIQUEIDENTIFIER;
    SELECT @categoria_id = id FROM categorias_menu WHERE codigo = @categoria_codigo;
    IF @categoria_id IS NULL THROW 51004, 'Categoría no existe.', 1;

    UPDATE items_menu
    SET categoria_id            = @categoria_id,
        nombre                  = @nombre,
        descripcion             = @descripcion,
        precio                  = @precio,
        imagen_url              = @imagen_url,
        peso_gramos             = @peso_gramos,
        porciones               = @porciones,
        tiempo_preparacion      = @tiempo_preparacion,
        informacion_nutricional = @informacion_nutricional
    WHERE id = @id;
    IF @@ROWCOUNT = 0 THROW 51005, 'Ítem de menú no encontrado.', 1;
END;
GO

IF OBJECT_ID('sp_toggle_item_menu', 'P') IS NOT NULL DROP PROCEDURE sp_toggle_item_menu;
GO

CREATE PROCEDURE sp_toggle_item_menu
    @id         UNIQUEIDENTIFIER,
    @disponible TINYINT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE items_menu SET disponible = @disponible WHERE id = @id;
    IF @@ROWCOUNT = 0 THROW 51006, 'Ítem de menú no encontrado.', 1;
END;
GO

IF OBJECT_ID('sp_eliminar_item_menu', 'P') IS NOT NULL DROP PROCEDURE sp_eliminar_item_menu;
GO

CREATE PROCEDURE sp_eliminar_item_menu
    @id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM detalle_pedido WHERE item_menu_id = @id)
        THROW 51007, 'No se puede eliminar el ítem porque ya fue pedido.', 1;
    DELETE FROM items_menu WHERE id = @id;
END;
GO


-- ============================================================
--  MENÚ COMPUESTO — Componentes
-- ============================================================

IF OBJECT_ID('sp_agregar_componente_menu', 'P') IS NOT NULL DROP PROCEDURE sp_agregar_componente_menu;
GO

CREATE PROCEDURE sp_agregar_componente_menu
    @menu_id      UNIQUEIDENTIFIER,
    @item_id      UNIQUEIDENTIFIER,
    @rol          VARCHAR(30),
    @obligatorio  TINYINT = 1,
    @orden        INT     = 0,
    @nuevo_id     UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @rest_menu UNIQUEIDENTIFIER;
    DECLARE @rest_item UNIQUEIDENTIFIER;
    DECLARE @es_menu   TINYINT;

    SELECT @rest_menu = restaurante_id, @es_menu = es_menu_compuesto
    FROM items_menu WHERE id = @menu_id;

    IF @rest_menu IS NULL THROW 51010, 'Menú no encontrado.', 1;
    IF @es_menu <> 1 THROW 51011, 'El ítem no está marcado como menú compuesto.', 1;

    SELECT @rest_item = restaurante_id FROM items_menu WHERE id = @item_id;
    IF @rest_item IS NULL THROW 51012, 'Ítem componente no encontrado.', 1;
    IF @rest_menu <> @rest_item THROW 51013, 'El componente debe pertenecer al mismo restaurante que el menú.', 1;
    IF @menu_id = @item_id THROW 51014, 'Un menú no puede contenerse a sí mismo.', 1;

    SET @nuevo_id = NEWID();
    INSERT INTO menu_componentes (id, menu_id, item_id, rol, obligatorio, orden)
    VALUES (@nuevo_id, @menu_id, @item_id, @rol, @obligatorio, @orden);
END;
GO

IF OBJECT_ID('sp_quitar_componente_menu', 'P') IS NOT NULL DROP PROCEDURE sp_quitar_componente_menu;
GO

CREATE PROCEDURE sp_quitar_componente_menu
    @menu_id UNIQUEIDENTIFIER,
    @item_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    DELETE FROM menu_componentes WHERE menu_id = @menu_id AND item_id = @item_id;
    IF @@ROWCOUNT = 0 THROW 51015, 'El componente no estaba asociado al menú.', 1;
END;
GO

IF OBJECT_ID('sp_listar_componentes_menu', 'P') IS NOT NULL DROP PROCEDURE sp_listar_componentes_menu;
GO

CREATE PROCEDURE sp_listar_componentes_menu
    @menu_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT i.id AS item_id, i.nombre, c.nombre AS categoria,
           mc.rol, mc.obligatorio, i.precio, mc.orden
    FROM menu_componentes mc
    JOIN items_menu      i ON i.id = mc.item_id
    JOIN categorias_menu c ON c.id = i.categoria_id
    WHERE mc.menu_id = @menu_id
    ORDER BY mc.orden, mc.rol;
END;
GO


-- ============================================================
--  ARMA TU PLATO — Componentes
-- ============================================================

IF OBJECT_ID('sp_agregar_componente_arma_plato', 'P') IS NOT NULL DROP PROCEDURE sp_agregar_componente_arma_plato;
GO

CREATE PROCEDURE sp_agregar_componente_arma_plato
    @arma_plato_id UNIQUEIDENTIFIER,
    @item_id       UNIQUEIDENTIFIER,
    @tipo          VARCHAR(20),
    @precio_extra  DECIMAL(10,2) = 0,
    @nuevo_id      UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF @tipo NOT IN ('base', 'proteina', 'topping', 'bebida')
        THROW 51020, 'Tipo inválido. Debe ser: base, proteina, topping o bebida.', 1;

    DECLARE @rest_arma UNIQUEIDENTIFIER;
    DECLARE @rest_item UNIQUEIDENTIFIER;
    DECLARE @es_arma   TINYINT;

    SELECT @rest_arma = restaurante_id, @es_arma = es_arma_plato
    FROM items_menu WHERE id = @arma_plato_id;

    IF @rest_arma IS NULL THROW 51021, 'Arma tu plato no encontrado.', 1;
    IF @es_arma <> 1 THROW 51022, 'El ítem no es un arma tu plato.', 1;

    SELECT @rest_item = restaurante_id FROM items_menu WHERE id = @item_id;
    IF @rest_arma <> @rest_item THROW 51023, 'El componente debe pertenecer al mismo restaurante.', 1;

    SET @nuevo_id = NEWID();
    INSERT INTO arma_plato_componentes (id, arma_plato_id, item_id, tipo, precio_extra)
    VALUES (@nuevo_id, @arma_plato_id, @item_id, @tipo, @precio_extra);
END;
GO

IF OBJECT_ID('sp_listar_opciones_arma_plato', 'P') IS NOT NULL DROP PROCEDURE sp_listar_opciones_arma_plato;
GO

CREATE PROCEDURE sp_listar_opciones_arma_plato
    @arma_plato_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT ac.tipo, i.id AS item_id, i.nombre, ac.precio_extra, ac.disponible
    FROM arma_plato_componentes ac
    JOIN items_menu i ON i.id = ac.item_id
    WHERE ac.arma_plato_id = @arma_plato_id
    ORDER BY
        CASE ac.tipo
            WHEN 'base'     THEN 1
            WHEN 'proteina' THEN 2
            WHEN 'topping'  THEN 3
            WHEN 'bebida'   THEN 4
        END,
        i.nombre;
END;
GO


-- ============================================================
--  ETIQUETAS
-- ============================================================
IF OBJECT_ID('sp_listar_etiquetas', 'P') IS NOT NULL DROP PROCEDURE sp_listar_etiquetas;
GO

CREATE OR ALTER PROCEDURE sp_listar_etiquetas
AS
BEGIN
    SET NOCOUNT ON;
    SELECT codigo, nombre, color
    FROM etiquetas
    WHERE activo = 1
END;
GO

IF OBJECT_ID('sp_asignar_etiqueta', 'P') IS NOT NULL DROP PROCEDURE sp_asignar_etiqueta;
GO

CREATE PROCEDURE sp_asignar_etiqueta
    @item_id          UNIQUEIDENTIFIER,
    @etiqueta_codigo  VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @etiqueta_id UNIQUEIDENTIFIER;
    SELECT @etiqueta_id = id FROM etiquetas WHERE codigo = @etiqueta_codigo;
    IF @etiqueta_id IS NULL THROW 51030, 'Etiqueta no existe.', 1;

    IF NOT EXISTS (SELECT 1 FROM items_etiquetas WHERE item_id = @item_id AND etiqueta_id = @etiqueta_id)
        INSERT INTO items_etiquetas (item_id, etiqueta_id) VALUES (@item_id, @etiqueta_id);
END;
GO

IF OBJECT_ID('sp_quitar_etiqueta', 'P') IS NOT NULL DROP PROCEDURE sp_quitar_etiqueta;
GO

CREATE PROCEDURE sp_quitar_etiqueta
    @item_id          UNIQUEIDENTIFIER,
    @etiqueta_codigo  VARCHAR(50)
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @etiqueta_id UNIQUEIDENTIFIER;
    SELECT @etiqueta_id = id FROM etiquetas WHERE codigo = @etiqueta_codigo;
    DELETE FROM items_etiquetas WHERE item_id = @item_id AND etiqueta_id = @etiqueta_id;
END;
GO

IF OBJECT_ID('sp_etiquetas_de_item', 'P') IS NOT NULL DROP PROCEDURE sp_etiquetas_de_item;
GO

CREATE PROCEDURE sp_etiquetas_de_item
    @item_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT e.codigo, e.nombre, e.color
    FROM items_etiquetas ie
    JOIN etiquetas e ON e.id = ie.etiqueta_id
    WHERE ie.item_id = @item_id;
END;
GO


-- ============================================================
--  CONSULTAS DE MENÚ
-- ============================================================

IF OBJECT_ID('sp_listar_items_completo', 'P') IS NOT NULL DROP PROCEDURE sp_listar_items_completo;
GO

CREATE PROCEDURE sp_listar_items_completo
    @restaurante_id    UNIQUEIDENTIFIER,
    @categoria_codigo  VARCHAR(30) = NULL,
    @etiqueta_codigo   VARCHAR(50) = NULL,
    @solo_disponibles  TINYINT     = 1
AS
BEGIN
    SET NOCOUNT ON;
    SELECT DISTINCT
        i.id, i.nombre, c.nombre AS categoria,
        i.descripcion, i.precio,
        i.peso_gramos, i.informacion_nutricional,
        i.es_menu_compuesto, i.es_arma_plato,
        i.disponible, i.imagen_url
    FROM items_menu i
    JOIN categorias_menu c ON c.id = i.categoria_id
    LEFT JOIN items_etiquetas ie ON ie.item_id = i.id
    LEFT JOIN etiquetas e        ON e.id = ie.etiqueta_id
    WHERE i.restaurante_id = @restaurante_id
      AND (@categoria_codigo IS NULL OR c.codigo = @categoria_codigo)
      AND (@etiqueta_codigo  IS NULL OR e.codigo = @etiqueta_codigo)
      AND (@solo_disponibles = 0 OR i.disponible = 1)
    ORDER BY c.nombre, i.nombre;
END;
GO


-- ============================================================
--  PEDIDOS
-- ============================================================

IF OBJECT_ID('sp_crear_pedido', 'P') IS NOT NULL DROP PROCEDURE sp_crear_pedido;
GO

CREATE PROCEDURE sp_crear_pedido
    @cliente_id     UNIQUEIDENTIFIER,
    @restaurante_id UNIQUEIDENTIFIER,
    @modo           VARCHAR(20),
    @items          NVARCHAR(MAX),
    @notas          VARCHAR(1000) = NULL,
    @direccion      VARCHAR(500)  = NULL,
    @referencia     VARCHAR(300)  = NULL,
    @latitud        DECIMAL(10,7) = NULL,
    @longitud       DECIMAL(10,7) = NULL,
    @mesa_id        UNIQUEIDENTIFIER = NULL,
    @num_comensales INT              = NULL,
    @nuevo_id       UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    BEGIN TRY
        BEGIN TRANSACTION;

        IF @modo = 'delivery' AND NOT EXISTS (SELECT 1 FROM restaurantes WHERE id = @restaurante_id AND acepta_delivery = 1)
            THROW 50050, 'El restaurante no acepta delivery.', 1;
        IF @modo = 'salon' AND NOT EXISTS (SELECT 1 FROM restaurantes WHERE id = @restaurante_id AND acepta_salon = 1)
            THROW 50051, 'El restaurante no acepta pedidos en salón.', 1;
        IF @modo = 'recojo' AND NOT EXISTS (SELECT 1 FROM restaurantes WHERE id = @restaurante_id AND acepta_recojo = 1)
            THROW 50052, 'El restaurante no acepta recojo en local.', 1;

        SET @nuevo_id = NEWID();

        INSERT INTO pedidos (id, cliente_id, restaurante_id, modo, notas)
        VALUES (@nuevo_id, @cliente_id, @restaurante_id, @modo, @notas);

        DECLARE @subtotal  DECIMAL(10,2) = 0;
        DECLARE @costo_del DECIMAL(10,2) = 0;

        INSERT INTO detalle_pedido (id, pedido_id, item_menu_id, cantidad, precio_unitario, notas_item)
        SELECT
            NEWID(),
            @nuevo_id,
            CAST(j.item_menu_id AS UNIQUEIDENTIFIER),
            j.cantidad,
            im.precio,
            j.notas_item
        FROM OPENJSON(@items) WITH (
            item_menu_id VARCHAR(36)  '$.item_menu_id',
            cantidad     INT          '$.cantidad',
            notas_item   VARCHAR(500) '$.notas_item'
        ) j
        JOIN items_menu im ON im.id = CAST(j.item_menu_id AS UNIQUEIDENTIFIER)
                           AND im.restaurante_id = @restaurante_id
                           AND im.disponible = 1;

        IF @@ROWCOUNT = 0
            THROW 50053, 'Ningún ítem válido encontrado para este pedido.', 1;

        SELECT @subtotal = SUM(precio_unitario * cantidad)
        FROM detalle_pedido WHERE pedido_id = @nuevo_id;

        IF @modo = 'delivery' SET @costo_del = 5.00;

        UPDATE pedidos
        SET subtotal       = @subtotal,
            costo_delivery = @costo_del,
            total          = @subtotal + @costo_del,
            codigo_qr      = CONVERT(VARCHAR(64), HASHBYTES('SHA2_256', CAST(@nuevo_id AS VARCHAR(36))), 2)
        WHERE id = @nuevo_id;

        IF @modo = 'delivery'
        BEGIN
            IF @direccion IS NULL THROW 50054, 'Se requiere dirección para delivery.', 1;
            INSERT INTO pedido_delivery (id, pedido_id, direccion_entrega, referencia, latitud, longitud)
            VALUES (NEWID(), @nuevo_id, @direccion, @referencia, @latitud, @longitud);
        END;

        IF @modo = 'salon'
        BEGIN
            IF @mesa_id IS NULL THROW 50055, 'Se requiere mesa para pedido en salón.', 1;
            INSERT INTO pedido_salon (id, pedido_id, mesa_id, num_comensales)
            VALUES (NEWID(), @nuevo_id, @mesa_id, ISNULL(@num_comensales, 1));
            UPDATE mesas SET estado = 'ocupada' WHERE id = @mesa_id;
        END;

        INSERT INTO historial_estados (id, pedido_id, estado_nuevo)
        VALUES (NEWID(), @nuevo_id, 'recibido');

        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        ROLLBACK TRANSACTION;
        THROW;
    END CATCH;
END;
GO

IF OBJECT_ID('sp_cambiar_estado_pedido', 'P') IS NOT NULL DROP PROCEDURE sp_cambiar_estado_pedido;
GO

CREATE PROCEDURE sp_cambiar_estado_pedido
    @pedido_id  UNIQUEIDENTIFIER,
    @estado     VARCHAR(20),
    @usuario_id UNIQUEIDENTIFIER = NULL
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @modo    VARCHAR(20);
    DECLARE @mesa_id UNIQUEIDENTIFIER;

    SELECT @modo = modo FROM pedidos WHERE id = @pedido_id;
    IF @modo IS NULL THROW 50060, 'Pedido no encontrado.', 1;

    UPDATE pedidos SET estado = @estado WHERE id = @pedido_id;

    IF @estado = 'entregado' AND @modo = 'salon'
    BEGIN
        SELECT @mesa_id = mesa_id FROM pedido_salon WHERE pedido_id = @pedido_id;
        UPDATE mesas SET estado = 'disponible' WHERE id = @mesa_id;
    END;

    IF @estado = 'entregado' AND @modo = 'delivery'
        UPDATE pedido_delivery
        SET estado = 'entregado', entregado_at = CAST(GETDATE() AS DATE)
        WHERE pedido_id = @pedido_id;
END;
GO

IF OBJECT_ID('sp_asignar_repartidor', 'P') IS NOT NULL DROP PROCEDURE sp_asignar_repartidor;
GO

CREATE PROCEDURE sp_asignar_repartidor
    @pedido_id     UNIQUEIDENTIFIER,
    @repartidor_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE id = @repartidor_id AND rol = 'repartidor')
        THROW 50061, 'El usuario no tiene rol repartidor.', 1;

    UPDATE pedido_delivery
    SET repartidor_id = @repartidor_id, estado = 'en_camino'
    WHERE pedido_id = @pedido_id;

    IF @@ROWCOUNT = 0 THROW 50062, 'No existe detalle delivery para este pedido.', 1;
END;
GO

IF OBJECT_ID('sp_obtener_pedido', 'P') IS NOT NULL DROP PROCEDURE sp_obtener_pedido;
GO

CREATE PROCEDURE sp_obtener_pedido
    @pedido_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        p.id AS pedido_id,
        u.nombre + ' ' + u.apellido AS cliente,
        r.nombre AS restaurante,
        p.modo, p.estado,
        p.subtotal, p.costo_delivery, p.total,
        p.codigo_qr, p.notas, p.created_at,
        i.nombre AS item_nombre,
        d.cantidad, d.precio_unitario, d.notas_item
    FROM pedidos p
    JOIN usuarios u        ON u.id = p.cliente_id
    JOIN restaurantes r    ON r.id = p.restaurante_id
    JOIN detalle_pedido d  ON d.pedido_id = p.id
    JOIN items_menu i      ON i.id = d.item_menu_id
    WHERE p.id = @pedido_id;
END;
GO

IF OBJECT_ID('sp_listar_pedidos_restaurante', 'P') IS NOT NULL DROP PROCEDURE sp_listar_pedidos_restaurante;
GO

CREATE PROCEDURE sp_listar_pedidos_restaurante
    @restaurante_id UNIQUEIDENTIFIER,
    @estado         VARCHAR(20) = NULL,
    @modo           VARCHAR(20) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    SELECT p.id,
           u.nombre + ' ' + u.apellido AS cliente,
           p.modo, p.estado, p.total, p.created_at
    FROM pedidos p
    JOIN usuarios u ON u.id = p.cliente_id
    WHERE p.restaurante_id = @restaurante_id
      AND (@estado IS NULL OR p.estado = @estado)
      AND (@modo   IS NULL OR p.modo   = @modo)
    ORDER BY p.created_at DESC;
END;
GO

IF OBJECT_ID('sp_listar_pedidos_cliente', 'P') IS NOT NULL DROP PROCEDURE sp_listar_pedidos_cliente;
GO

CREATE PROCEDURE sp_listar_pedidos_cliente
    @cliente_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT p.id, r.nombre AS restaurante, p.modo, p.estado,
           p.total, p.codigo_qr, p.created_at
    FROM pedidos p
    JOIN restaurantes r ON r.id = p.restaurante_id
    WHERE p.cliente_id = @cliente_id
    ORDER BY p.created_at DESC;
END;
GO

IF OBJECT_ID('sp_cancelar_pedido', 'P') IS NOT NULL DROP PROCEDURE sp_cancelar_pedido;
GO

CREATE PROCEDURE sp_cancelar_pedido
    @pedido_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @estado  VARCHAR(20);
    DECLARE @modo    VARCHAR(20);
    DECLARE @mesa_id UNIQUEIDENTIFIER;

    SELECT @estado = estado, @modo = modo FROM pedidos WHERE id = @pedido_id;
    IF @estado IS NULL THROW 50070, 'Pedido no encontrado.', 1;
    IF @estado IN ('listo', 'entregado') THROW 50071, 'No se puede cancelar un pedido en este estado.', 1;

    IF @modo = 'salon'
    BEGIN
        SELECT @mesa_id = mesa_id FROM pedido_salon WHERE pedido_id = @pedido_id;
        UPDATE mesas SET estado = 'disponible' WHERE id = @mesa_id;
    END;

    DELETE FROM pedidos WHERE id = @pedido_id;
END;
GO


-- ============================================================
--  PAGOS
-- ============================================================

IF OBJECT_ID('sp_registrar_pago', 'P') IS NOT NULL DROP PROCEDURE sp_registrar_pago;
GO

CREATE PROCEDURE sp_registrar_pago
    @pedido_id           UNIQUEIDENTIFIER,
    @metodo              VARCHAR(20),
    @referencia_externa  VARCHAR(255) = NULL,
    @nuevo_id            UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM pagos WHERE pedido_id = @pedido_id AND estado = 'completado')
        THROW 50080, 'El pedido ya tiene un pago completado.', 1;

    DECLARE @monto DECIMAL(10,2);
    SELECT @monto = total FROM pedidos WHERE id = @pedido_id;
    IF @monto IS NULL THROW 50081, 'Pedido no encontrado.', 1;

    SET @nuevo_id = NEWID();
    INSERT INTO pagos (id, pedido_id, monto, metodo, referencia_externa)
    VALUES (@nuevo_id, @pedido_id, @monto, @metodo, @referencia_externa);
END;
GO

IF OBJECT_ID('sp_confirmar_pago', 'P') IS NOT NULL DROP PROCEDURE sp_confirmar_pago;
GO

CREATE PROCEDURE sp_confirmar_pago
    @pago_id            UNIQUEIDENTIFIER,
    @referencia_externa VARCHAR(255) = NULL
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE pagos
    SET estado = 'completado',
        referencia_externa = ISNULL(@referencia_externa, referencia_externa)
    WHERE id = @pago_id AND estado = 'pendiente';
    IF @@ROWCOUNT = 0 THROW 50082, 'Pago no encontrado o ya procesado.', 1;
END;
GO

IF OBJECT_ID('sp_fallo_pago', 'P') IS NOT NULL DROP PROCEDURE sp_fallo_pago;
GO

CREATE PROCEDURE sp_fallo_pago
    @pago_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE pagos SET estado = 'fallido' WHERE id = @pago_id;
    IF @@ROWCOUNT = 0 THROW 50083, 'Pago no encontrado.', 1;
END;
GO

IF OBJECT_ID('sp_obtener_pago', 'P') IS NOT NULL DROP PROCEDURE sp_obtener_pago;
GO

CREATE PROCEDURE sp_obtener_pago
    @pedido_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, monto, metodo, estado, referencia_externa, created_at
    FROM pagos WHERE pedido_id = @pedido_id;
END;
GO


-- ============================================================
--  HISTORIAL DE ESTADOS
-- ============================================================

IF OBJECT_ID('sp_historial_pedido', 'P') IS NOT NULL DROP PROCEDURE sp_historial_pedido;
GO

CREATE PROCEDURE sp_historial_pedido
    @pedido_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT
        h.estado_nuevo AS estado,
        ISNULL(u.nombre + ' ' + u.apellido, 'Sistema') AS cambiado_por,
        h.created_at
    FROM historial_estados h
    LEFT JOIN usuarios u ON u.id = h.usuario_id
    WHERE h.pedido_id = @pedido_id
    ORDER BY h.created_at;
END;
GO

PRINT '✓ Procedimientos almacenados creados correctamente';
GO