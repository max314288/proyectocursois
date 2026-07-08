-- ============================================================
--  MIGRACIÓN: estado 'cancelado' + resolución automática de pago
--  Aplicar sobre bdAppcomida existente (NO borra datos).
--  Idempotente: se puede ejecutar más de una vez.
-- ============================================================
USE bdAppcomida;
GO

-- 1) CHECK pedidos.estado: agregar 'cancelado'
IF OBJECT_ID('chk_pedidos_estado', 'C') IS NOT NULL
    ALTER TABLE pedidos DROP CONSTRAINT chk_pedidos_estado;
GO
ALTER TABLE pedidos ADD CONSTRAINT chk_pedidos_estado
    CHECK (estado IN ('recibido', 'en_preparacion', 'listo', 'entregado', 'cancelado'));
GO

-- 2) CHECK historial_estados.estado_nuevo: agregar 'cancelado'
IF OBJECT_ID('chk_historial_estado', 'C') IS NOT NULL
    ALTER TABLE historial_estados DROP CONSTRAINT chk_historial_estado;
GO
ALTER TABLE historial_estados ADD CONSTRAINT chk_historial_estado
    CHECK (estado_nuevo IN ('recibido', 'en_preparacion', 'listo', 'entregado', 'cancelado'));
GO

-- 3) sp_cambiar_estado_pedido: al entregar, completar pago efectivo pendiente
CREATE OR ALTER PROCEDURE sp_cambiar_estado_pedido
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

    -- Pago en local (efectivo): quien entrega, cobra — se completa automáticamente
    IF @estado = 'entregado'
        UPDATE pagos
        SET estado = 'completado'
        WHERE pedido_id = @pedido_id AND metodo = 'efectivo' AND estado = 'pendiente';
END;
GO

-- 4) sp_cancelar_pedido: cancelación lógica (UPDATE) + anular pago pendiente
CREATE OR ALTER PROCEDURE sp_cancelar_pedido
    @pedido_id UNIQUEIDENTIFIER
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @estado  VARCHAR(20);
    DECLARE @modo    VARCHAR(20);
    DECLARE @mesa_id UNIQUEIDENTIFIER;

    SELECT @estado = estado, @modo = modo FROM pedidos WHERE id = @pedido_id;
    IF @estado IS NULL THROW 50070, 'Pedido no encontrado.', 1;
    IF @estado IN ('listo', 'entregado', 'cancelado') THROW 50071, 'No se puede cancelar un pedido en este estado.', 1;

    IF @modo = 'salon'
    BEGIN
        SELECT @mesa_id = mesa_id FROM pedido_salon WHERE pedido_id = @pedido_id;
        UPDATE mesas SET estado = 'disponible' WHERE id = @mesa_id;
    END;

    -- Cancelación lógica: el trigger trg_pedido_historial registra el cambio de estado
    UPDATE pedidos SET estado = 'cancelado' WHERE id = @pedido_id;

    -- El pago pendiente queda anulado por la cancelación
    UPDATE pagos SET estado = 'fallido'
    WHERE pedido_id = @pedido_id AND estado = 'pendiente';
END;
GO

PRINT '✓ Migración estado cancelado aplicada correctamente';
GO
