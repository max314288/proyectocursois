-- ============================================================
--  MIGRACIÓN: filtro por fecha en sp_listar_pedidos_restaurante
--  Habilita el historial del día en la app restaurant (bandeja
--  "Historial") y sienta la base para reportes por fecha.
--  Aplicar después de procedures_completo.sql (y de
--  migracion_estado_cancelado.sql si ya se aplicó).
-- ============================================================

USE bdAppcomida;
GO

IF OBJECT_ID('sp_listar_pedidos_restaurante', 'P') IS NOT NULL DROP PROCEDURE sp_listar_pedidos_restaurante;
GO

CREATE PROCEDURE sp_listar_pedidos_restaurante
    @restaurante_id UNIQUEIDENTIFIER,
    @estado         VARCHAR(20) = NULL,
    @modo           VARCHAR(20) = NULL,
    @fecha          DATE        = NULL
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
      AND (@fecha  IS NULL OR p.created_at = @fecha)
    ORDER BY p.created_at DESC;
END;
GO

PRINT '✓ sp_listar_pedidos_restaurante ahora acepta @fecha (filtro opcional)';
GO
