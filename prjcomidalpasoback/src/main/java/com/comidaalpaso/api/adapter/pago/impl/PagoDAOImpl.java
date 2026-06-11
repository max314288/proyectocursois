package com.comidaalpaso.api.adapter.pago.impl;

import com.comidaalpaso.api.adapter.pago.PagoDAO;
import com.comidaalpaso.api.adapter.pago.model.Pago;
import com.comidaalpaso.api.shared.exception.ConflictoRecursoException;
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
import java.util.Optional;
import java.util.UUID;

@Component
public class PagoDAOImpl implements PagoDAO {

    @PersistenceContext
    private EntityManager em;

    // ─── sp_registrar_pago ─────────────────────────────────────────────────────

    @Override
    @Transactional
    public UUID registrar(UUID pedidoId, String metodo, String referenciaExterna) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_registrar_pago")
            .registerStoredProcedureParameter("pedido_id",          String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("metodo",             String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("referencia_externa", String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("nuevo_id",           String.class, ParameterMode.OUT)
            .setParameter("pedido_id",          pedidoId.toString())
            .setParameter("metodo",             metodo)
            .setParameter("referencia_externa", referenciaExterna);

        try {
            q.execute();
            Object out = q.getOutputParameterValue("nuevo_id");
            return out instanceof UUID u ? u : UUID.fromString(out.toString());
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_confirmar_pago ─────────────────────────────────────────────────────

    @Override
    @Transactional
    public void confirmar(UUID pagoId, String referenciaExterna) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_confirmar_pago")
            .registerStoredProcedureParameter("pago_id",            String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("referencia_externa", String.class, ParameterMode.IN)
            .setParameter("pago_id",            pagoId.toString())
            .setParameter("referencia_externa", referenciaExterna);

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_fallo_pago ─────────────────────────────────────────────────────────

    @Override
    @Transactional
    public void fallo(UUID pagoId) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_fallo_pago")
            .registerStoredProcedureParameter("pago_id", String.class, ParameterMode.IN)
            .setParameter("pago_id", pagoId.toString());

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_obtener_pago ───────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public Optional<Pago> obtener(UUID pedidoId) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_obtener_pago")
            .registerStoredProcedureParameter("pedido_id", String.class, ParameterMode.IN)
            .setParameter("pedido_id", pedidoId.toString());

        try {
            @SuppressWarnings("unchecked")
            List<Object[]> rows = q.getResultList();
            if (rows.isEmpty()) return Optional.empty();
            return Optional.of(mapRow(rows.get(0)));
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── helpers ───────────────────────────────────────────────────────────────

    /** sp_obtener_pago: id, monto, metodo, estado, referencia_externa, created_at */
    private Pago mapRow(Object[] row) {
        Pago p = new Pago();
        int i = 0;
        p.setId(toUuid(row[i++]));
        p.setMonto(toDecimal(row[i++]));
        p.setMetodo((String) row[i++]);
        p.setEstado((String) row[i++]);
        p.setReferenciaExterna((String) row[i++]);
        p.setCreatedAt(toLocalDate(row[i]));
        return p;
    }

    private RuntimeException mapSqlError(PersistenceException ex) {
        String msg = rootMessage(ex);
        if (msg.contains("50080") || msg.contains("ya tiene un pago completado")) {
            return new ConflictoRecursoException("El pedido ya tiene un pago completado", ex);
        }
        if (msg.contains("50082") || msg.contains("ya procesado")) {
            return new ConflictoRecursoException("Pago no encontrado o ya procesado", ex);
        }
        if (msg.contains("50081") || msg.contains("50083") || msg.contains("Pedido no encontrado")
                || msg.contains("Pago no encontrado")) {
            return new ResourceNotFoundException(msg.contains("Pago") ? "Pago no encontrado" : "Pedido no encontrado", ex);
        }
        return ex;
    }

    private UUID toUuid(Object v) {
        if (v == null) return null;
        if (v instanceof UUID u) return u;
        return UUID.fromString(v.toString());
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
