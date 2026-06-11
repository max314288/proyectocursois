-- ============================================================
--  USUARIOS — schema para tests con Testcontainers
--  Espejo de sql_usuario.sql + SP nuevo sp_obtener_usuario_por_email
--  Sin "GO" porque el cargador de Testcontainers ejecuta cada statement.
-- ============================================================

CREATE TABLE usuarios (
    id              UNIQUEIDENTIFIER NOT NULL PRIMARY KEY DEFAULT NEWID(),
    nombre          VARCHAR(100)     NOT NULL,
    apellido        VARCHAR(100)     NOT NULL,
    email           VARCHAR(255)     NOT NULL UNIQUE,
    password_hash   VARCHAR(255)     NOT NULL,
    rol             VARCHAR(30)      NOT NULL DEFAULT 'cliente',
    activo          TINYINT          NOT NULL DEFAULT 1,
    created_at      DATE             NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    updated_at      DATE             NOT NULL DEFAULT CAST(GETDATE() AS DATE),
    CONSTRAINT chk_usuarios_rol CHECK (rol IN ('cliente', 'admin', 'restaurante', 'repartidor'))
);

EXEC('
CREATE PROCEDURE sp_crear_usuario
    @nombre        VARCHAR(100),
    @apellido      VARCHAR(100),
    @email         VARCHAR(255),
    @password_hash VARCHAR(255),
    @rol           VARCHAR(30) = ''cliente'',
    @nuevo_id      UNIQUEIDENTIFIER OUTPUT
AS
BEGIN
    SET NOCOUNT ON;
    IF EXISTS (SELECT 1 FROM usuarios WHERE email = @email)
        THROW 50001, ''El email ya está registrado.'', 1;

    SET @nuevo_id = NEWID();
    INSERT INTO usuarios (id, nombre, apellido, email, password_hash, rol)
    VALUES (@nuevo_id, @nombre, @apellido, @email, @password_hash, @rol);
END;
');

EXEC('
CREATE PROCEDURE sp_actualizar_usuario
    @id       UNIQUEIDENTIFIER,
    @nombre   VARCHAR(100),
    @apellido VARCHAR(100),
    @email    VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    IF NOT EXISTS (SELECT 1 FROM usuarios WHERE id = @id)
        THROW 50002, ''Usuario no encontrado.'', 1;
    IF EXISTS (SELECT 1 FROM usuarios WHERE email = @email AND id <> @id)
        THROW 50003, ''El email ya está en uso.'', 1;

    UPDATE usuarios SET nombre = @nombre, apellido = @apellido, email = @email
    WHERE id = @id;
END;
');

EXEC('
CREATE PROCEDURE sp_cambiar_password
    @id            UNIQUEIDENTIFIER,
    @password_hash VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE usuarios SET password_hash = @password_hash WHERE id = @id;
    IF @@ROWCOUNT = 0 THROW 50004, ''Usuario no encontrado.'', 1;
END;
');

EXEC('
CREATE PROCEDURE sp_toggle_usuario
    @id     UNIQUEIDENTIFIER,
    @activo TINYINT
AS
BEGIN
    SET NOCOUNT ON;
    UPDATE usuarios SET activo = @activo WHERE id = @id;
    IF @@ROWCOUNT = 0 THROW 50005, ''Usuario no encontrado.'', 1;
END;
');

EXEC('
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
');

EXEC('
CREATE PROCEDURE sp_obtener_usuario
    @id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, nombre, apellido, email, rol, activo, created_at
    FROM usuarios WHERE id = @id;
END;
');

EXEC('
CREATE PROCEDURE sp_obtener_usuario_por_email
    @email VARCHAR(255)
AS
BEGIN
    SET NOCOUNT ON;
    SELECT id, nombre, apellido, email, password_hash, rol, activo, created_at
    FROM usuarios WHERE email = @email;
END;
');
