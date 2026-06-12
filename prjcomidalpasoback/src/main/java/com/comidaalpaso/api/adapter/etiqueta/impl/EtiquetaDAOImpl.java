package com.comidaalpaso.api.adapter.etiqueta.impl;

import com.comidaalpaso.api.adapter.etiqueta.EtiquetaDAO;
import com.comidaalpaso.api.adapter.etiqueta.model.Etiqueta;
import com.comidaalpaso.api.shared.exception.ResourceNotFoundException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import jakarta.persistence.StoredProcedureQuery;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Component
public class EtiquetaDAOImpl implements EtiquetaDAO {

    @PersistenceContext
    private EntityManager em;

    // ─── sp_asignar_etiqueta ───────────────────────────────────────────────────

    @Override
    @Transactional
    public void asignar(UUID itemId, String etiquetaCodigo) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_asignar_etiqueta")
            .registerStoredProcedureParameter("item_id",         String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("etiqueta_codigo", String.class, ParameterMode.IN)
            .setParameter("item_id",         itemId.toString())
            .setParameter("etiqueta_codigo", etiquetaCodigo);

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_quitar_etiqueta ────────────────────────────────────────────────────

    @Override
    @Transactional
    public void quitar(UUID itemId, String etiquetaCodigo) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_quitar_etiqueta")
            .registerStoredProcedureParameter("item_id",         String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("etiqueta_codigo", String.class, ParameterMode.IN)
            .setParameter("item_id",         itemId.toString())
            .setParameter("etiqueta_codigo", etiquetaCodigo);

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_etiquetas_de_item ──────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<Etiqueta> etiquetasDeItem(UUID itemId) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_etiquetas_de_item")
            .registerStoredProcedureParameter("item_id", String.class, ParameterMode.IN)
            .setParameter("item_id", itemId.toString());

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        return rows.stream().map(this::mapRow).toList();
    }

    // ─── sp_listar_etiquetas ──────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<Etiqueta> listarTodas() {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_listar_etiquetas");
        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        return rows.stream().map(this::mapRow).toList();
    }

    // ─── helpers ───────────────────────────────────────────────────────────────

    /** sp_etiquetas_de_item / sp_listar_etiquetas: codigo, nombre, color */
    private Etiqueta mapRow(Object[] row) {
        Etiqueta e = new Etiqueta();
        int i = 0;
        e.setCodigo((String) row[i++]);
        e.setNombre((String) row[i++]);
        e.setColor((String) row[i]);
        return e;
    }

    private RuntimeException mapSqlError(PersistenceException ex) {
        String msg = rootMessage(ex);
        if (msg.contains("51030") || msg.contains("Etiqueta no existe")) {
            return new ResourceNotFoundException("Etiqueta no existe", ex);
        }
        return ex;
    }

    private String rootMessage(Throwable t) {
        Throwable cur = t;
        while (cur.getCause() != null && cur.getCause() != cur) cur = cur.getCause();
        return cur.getMessage() == null ? "" : cur.getMessage();
    }
}
