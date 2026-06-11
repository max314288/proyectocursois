package com.comidaalpaso.api.adapter.mesa.impl;

import com.comidaalpaso.api.adapter.mesa.MesaDAO;
import com.comidaalpaso.api.adapter.mesa.model.Mesa;
import com.comidaalpaso.api.shared.exception.ConflictoRecursoException;
import com.comidaalpaso.api.shared.exception.ResourceNotFoundException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import jakarta.persistence.StoredProcedureQuery;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@Component
public class MesaDAOImpl implements MesaDAO {

    @PersistenceContext
    private EntityManager em;

    // ─── sp_crear_mesa ─────────────────────────────────────────────────────────

    @Override
    @Transactional
    public UUID crear(UUID restauranteId, String numero, int capacidad) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_crear_mesa")
            .registerStoredProcedureParameter("restaurante_id", String.class,  ParameterMode.IN)
            .registerStoredProcedureParameter("numero",         String.class,  ParameterMode.IN)
            .registerStoredProcedureParameter("capacidad",      Integer.class, ParameterMode.IN)
            .registerStoredProcedureParameter("nuevo_id",       String.class,  ParameterMode.OUT)
            .setParameter("restaurante_id", restauranteId.toString())
            .setParameter("numero",         numero)
            .setParameter("capacidad",      capacidad);

        try {
            q.execute();
            Object out = q.getOutputParameterValue("nuevo_id");
            return out instanceof UUID u ? u : UUID.fromString(out.toString());
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_actualizar_mesa ────────────────────────────────────────────────────

    @Override
    @Transactional
    public void actualizar(UUID id, String numero, int capacidad) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_actualizar_mesa")
            .registerStoredProcedureParameter("id",       String.class,  ParameterMode.IN)
            .registerStoredProcedureParameter("numero",   String.class,  ParameterMode.IN)
            .registerStoredProcedureParameter("capacidad",Integer.class, ParameterMode.IN)
            .setParameter("id",        id.toString())
            .setParameter("numero",    numero)
            .setParameter("capacidad", capacidad);

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_cambiar_estado_mesa ────────────────────────────────────────────────

    @Override
    @Transactional
    public void cambiarEstado(UUID id, String estado) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_cambiar_estado_mesa")
            .registerStoredProcedureParameter("id",     String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("estado", String.class, ParameterMode.IN)
            .setParameter("id",     id.toString())
            .setParameter("estado", estado);

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_eliminar_mesa ──────────────────────────────────────────────────────

    @Override
    @Transactional
    public void eliminar(UUID id) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_eliminar_mesa")
            .registerStoredProcedureParameter("id", String.class, ParameterMode.IN)
            .setParameter("id", id.toString());

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_listar_mesas ───────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<Mesa> listar(UUID restauranteId, String estado) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_listar_mesas")
            .registerStoredProcedureParameter("restaurante_id", String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("estado",         String.class, ParameterMode.IN)
            .setParameter("restaurante_id", restauranteId.toString())
            .setParameter("estado",         estado);

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        return rows.stream().map(this::mapRow).toList();
    }

    // ─── helpers ───────────────────────────────────────────────────────────────

    /** sp_listar_mesas: id, numero, capacidad, estado */
    private Mesa mapRow(Object[] row) {
        Mesa m = new Mesa();
        int i = 0;
        m.setId(toUuid(row[i++]));
        m.setNumero((String) row[i++]);
        m.setCapacidad(toInt(row[i++]));
        m.setEstado((String) row[i]);
        return m;
    }

    private RuntimeException mapSqlError(PersistenceException ex) {
        String msg = rootMessage(ex);
        if (msg.contains("50020") || msg.contains("mesa ya existe")) {
            return new ConflictoRecursoException("La mesa ya existe en este restaurante", ex);
        }
        if (msg.contains("50023") || msg.contains("pedidos asociados")) {
            return new ConflictoRecursoException("No se puede eliminar la mesa porque tiene pedidos asociados", ex);
        }
        if (msg.contains("50021") || msg.contains("50022") || msg.contains("Mesa no encontrada")) {
            return new ResourceNotFoundException("Mesa no encontrada", ex);
        }
        return ex;
    }

    private UUID toUuid(Object v) {
        if (v == null) return null;
        if (v instanceof UUID u) return u;
        return UUID.fromString(v.toString());
    }

    private Integer toInt(Object v) {
        if (v == null) return 0;
        if (v instanceof Integer i) return i;
        if (v instanceof Number n) return n.intValue();
        return Integer.parseInt(v.toString());
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
