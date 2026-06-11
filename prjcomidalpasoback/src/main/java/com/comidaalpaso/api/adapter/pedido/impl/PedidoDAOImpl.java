package com.comidaalpaso.api.adapter.pedido.impl;

import com.comidaalpaso.api.adapter.pedido.PedidoDAO;
import com.comidaalpaso.api.adapter.pedido.model.HistorialEstadoRow;
import com.comidaalpaso.api.adapter.pedido.model.PedidoDetalleRow;
import com.comidaalpaso.api.adapter.pedido.model.PedidoResumenRow;
import com.comidaalpaso.api.shared.exception.ConflictoRecursoException;
import com.comidaalpaso.api.shared.exception.ReglaDeNegocioException;
import com.comidaalpaso.api.shared.exception.ResourceNotFoundException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import jakarta.persistence.StoredProcedureQuery;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Component
public class PedidoDAOImpl implements PedidoDAO {

    @PersistenceContext
    private EntityManager em;

    // ─── sp_crear_pedido ───────────────────────────────────────────────────────

    @Override
    @Transactional
    public UUID crear(UUID clienteId, UUID restauranteId, String modo, String itemsJson, String notas,
                      String direccion, String referencia, BigDecimal latitud, BigDecimal longitud,
                      UUID mesaId, Integer numComensales) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_crear_pedido")
            .registerStoredProcedureParameter("cliente_id",     String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("restaurante_id", String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("modo",           String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("items",          String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("notas",          String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("direccion",      String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("referencia",     String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("latitud",        BigDecimal.class, ParameterMode.IN)
            .registerStoredProcedureParameter("longitud",       BigDecimal.class, ParameterMode.IN)
            .registerStoredProcedureParameter("mesa_id",        String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("num_comensales", Integer.class,    ParameterMode.IN)
            .registerStoredProcedureParameter("nuevo_id",       String.class,     ParameterMode.OUT)
            .setParameter("cliente_id",     clienteId.toString())
            .setParameter("restaurante_id", restauranteId.toString())
            .setParameter("modo",           modo)
            .setParameter("items",          itemsJson)
            .setParameter("notas",          notas)
            .setParameter("direccion",      direccion)
            .setParameter("referencia",     referencia)
            .setParameter("latitud",        latitud)
            .setParameter("longitud",       longitud)
            .setParameter("mesa_id",        mesaId != null ? mesaId.toString() : null)
            .setParameter("num_comensales", numComensales);

        try {
            q.execute();
            Object out = q.getOutputParameterValue("nuevo_id");
            return out instanceof UUID u ? u : UUID.fromString(out.toString());
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_cambiar_estado_pedido ──────────────────────────────────────────────

    @Override
    @Transactional
    public void cambiarEstado(UUID pedidoId, String estado, UUID usuarioId) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_cambiar_estado_pedido")
            .registerStoredProcedureParameter("pedido_id",  String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("estado",     String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("usuario_id", String.class, ParameterMode.IN)
            .setParameter("pedido_id",  pedidoId.toString())
            .setParameter("estado",     estado)
            .setParameter("usuario_id", usuarioId != null ? usuarioId.toString() : null);

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_asignar_repartidor ─────────────────────────────────────────────────

    @Override
    @Transactional
    public void asignarRepartidor(UUID pedidoId, UUID repartidorId) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_asignar_repartidor")
            .registerStoredProcedureParameter("pedido_id",     String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("repartidor_id", String.class, ParameterMode.IN)
            .setParameter("pedido_id",     pedidoId.toString())
            .setParameter("repartidor_id", repartidorId.toString());

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_obtener_pedido ─────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<PedidoDetalleRow> obtener(UUID pedidoId) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_obtener_pedido")
            .registerStoredProcedureParameter("pedido_id", String.class, ParameterMode.IN)
            .setParameter("pedido_id", pedidoId.toString());

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        return rows.stream().map(this::mapDetalle).toList();
    }

    // ─── sp_listar_pedidos_restaurante ─────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<PedidoResumenRow> listarPorRestaurante(UUID restauranteId, String estado, String modo) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_listar_pedidos_restaurante")
            .registerStoredProcedureParameter("restaurante_id", String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("estado",         String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("modo",           String.class, ParameterMode.IN)
            .setParameter("restaurante_id", restauranteId.toString())
            .setParameter("estado",         estado)
            .setParameter("modo",           modo);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        return rows.stream().map(row -> mapResumen(row, false)).toList();
    }

    // ─── sp_listar_pedidos_cliente ─────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<PedidoResumenRow> listarPorCliente(UUID clienteId) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_listar_pedidos_cliente")
            .registerStoredProcedureParameter("cliente_id", String.class, ParameterMode.IN)
            .setParameter("cliente_id", clienteId.toString());

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        return rows.stream().map(row -> mapResumen(row, true)).toList();
    }

    // ─── sp_cancelar_pedido ────────────────────────────────────────────────────

    @Override
    @Transactional
    public void cancelar(UUID pedidoId) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_cancelar_pedido")
            .registerStoredProcedureParameter("pedido_id", String.class, ParameterMode.IN)
            .setParameter("pedido_id", pedidoId.toString());

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_historial_pedido ───────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<HistorialEstadoRow> historial(UUID pedidoId) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_historial_pedido")
            .registerStoredProcedureParameter("pedido_id", String.class, ParameterMode.IN)
            .setParameter("pedido_id", pedidoId.toString());

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        return rows.stream().map(this::mapHistorial).toList();
    }

    // ─── row mappers ───────────────────────────────────────────────────────────

    /**
     * sp_obtener_pedido: pedido_id, cliente, restaurante, modo, estado,
     * subtotal, costo_delivery, total, codigo_qr, notas, created_at,
     * item_nombre, cantidad, precio_unitario, notas_item
     */
    private PedidoDetalleRow mapDetalle(Object[] row) {
        PedidoDetalleRow r = new PedidoDetalleRow();
        int i = 0;
        r.setPedidoId(toUuid(row[i++]));
        r.setCliente((String) row[i++]);
        r.setRestaurante((String) row[i++]);
        r.setModo((String) row[i++]);
        r.setEstado((String) row[i++]);
        r.setSubtotal(toDecimal(row[i++]));
        r.setCostoDelivery(toDecimal(row[i++]));
        r.setTotal(toDecimal(row[i++]));
        r.setCodigoQr((String) row[i++]);
        r.setNotas((String) row[i++]);
        r.setCreatedAt(toLocalDate(row[i++]));
        r.setItemNombre((String) row[i++]);
        r.setCantidad(toInt(row[i++]));
        r.setPrecioUnitario(toDecimal(row[i++]));
        r.setNotasItem((String) row[i]);
        return r;
    }

    /**
     * sp_listar_pedidos_restaurante: id, cliente, modo, estado, total, created_at (6 cols)
     * sp_listar_pedidos_cliente:     id, restaurante, modo, estado, total, codigo_qr, created_at (7 cols)
     */
    private PedidoResumenRow mapResumen(Object[] row, boolean conQr) {
        PedidoResumenRow r = new PedidoResumenRow();
        int i = 0;
        r.setId(toUuid(row[i++]));
        r.setContraparte((String) row[i++]);
        r.setModo((String) row[i++]);
        r.setEstado((String) row[i++]);
        r.setTotal(toDecimal(row[i++]));
        if (conQr) r.setCodigoQr((String) row[i++]);
        r.setCreatedAt(toLocalDate(row[i]));
        return r;
    }

    /** sp_historial_pedido: estado, cambiado_por, created_at */
    private HistorialEstadoRow mapHistorial(Object[] row) {
        HistorialEstadoRow r = new HistorialEstadoRow();
        int i = 0;
        r.setEstado((String) row[i++]);
        r.setCambiadoPor((String) row[i++]);
        r.setCreatedAt(toLocalDate(row[i]));
        return r;
    }

    // ─── error mapping ─────────────────────────────────────────────────────────

    private RuntimeException mapSqlError(PersistenceException ex) {
        String msg = rootMessage(ex);
        if (msg.contains("50050") || msg.contains("no acepta delivery")
                || msg.contains("50051") || msg.contains("no acepta pedidos en salón")
                || msg.contains("50052") || msg.contains("no acepta recojo")
                || msg.contains("50053") || msg.contains("Ningún ítem válido")
                || msg.contains("50054") || msg.contains("requiere dirección")
                || msg.contains("50055") || msg.contains("requiere mesa")
                || msg.contains("50061") || msg.contains("no tiene rol repartidor")) {
            return new ReglaDeNegocioException(msg, ex);
        }
        if (msg.contains("50071") || msg.contains("No se puede cancelar")) {
            return new ConflictoRecursoException("No se puede cancelar un pedido en este estado", ex);
        }
        if (msg.contains("50060") || msg.contains("50062") || msg.contains("50070")
                || msg.contains("Pedido no encontrado") || msg.contains("detalle delivery")) {
            return new ResourceNotFoundException("Pedido no encontrado", ex);
        }
        return ex;
    }

    // ─── type helpers ──────────────────────────────────────────────────────────

    private UUID toUuid(Object v) {
        if (v == null) return null;
        if (v instanceof UUID u) return u;
        return UUID.fromString(v.toString());
    }

    private Integer toInt(Object v) {
        if (v == null) return null;
        if (v instanceof Integer i) return i;
        if (v instanceof Number n) return n.intValue();
        return Integer.parseInt(v.toString());
    }

    private BigDecimal toDecimal(Object v) {
        if (v == null) return BigDecimal.ZERO;
        if (v instanceof BigDecimal d) return d;
        if (v instanceof Number n) return new BigDecimal(n.toString());
        return new BigDecimal(v.toString());
    }

    private LocalDate toLocalDate(Object v) {
        if (v == null) return null;
        if (v instanceof LocalDate d) return d;
        if (v instanceof java.sql.Date d) return d.toLocalDate();
        return LocalDate.parse(v.toString());
    }

    private String rootMessage(Throwable t) {
        Throwable cur = t;
        while (cur.getCause() != null && cur.getCause() != cur) cur = cur.getCause();
        return cur.getMessage() == null ? "" : cur.getMessage();
    }
}
