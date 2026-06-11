package com.comidaalpaso.api.adapter.restaurante.impl;

import com.comidaalpaso.api.adapter.restaurante.RestauranteDAO;
import com.comidaalpaso.api.adapter.restaurante.model.Restaurante;
import com.comidaalpaso.api.shared.exception.ReglaDeNegocioException;
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
public class RestauranteDAOImpl implements RestauranteDAO {

    @PersistenceContext
    private EntityManager em;

    // ─── sp_crear_restaurante ──────────────────────────────────────────────────

    @Override
    @Transactional
    public UUID crear(UUID usuarioId, String nombre, String direccion, String telefono,
                      String logoUrl, boolean aceptaRecojo, boolean aceptaDelivery, boolean aceptaSalon) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_crear_restaurante")
            .registerStoredProcedureParameter("usuario_id",      String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("nombre",          String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("direccion",       String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("telefono",        String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("logo_url",        String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("acepta_recojo",   Short.class,  ParameterMode.IN)
            .registerStoredProcedureParameter("acepta_delivery", Short.class,  ParameterMode.IN)
            .registerStoredProcedureParameter("acepta_salon",    Short.class,  ParameterMode.IN)
            .registerStoredProcedureParameter("nuevo_id",        String.class, ParameterMode.OUT)
            .setParameter("usuario_id",      usuarioId.toString())
            .setParameter("nombre",          nombre)
            .setParameter("direccion",       direccion)
            .setParameter("telefono",        telefono)
            .setParameter("logo_url",        logoUrl)
            .setParameter("acepta_recojo",   (short) (aceptaRecojo   ? 1 : 0))
            .setParameter("acepta_delivery", (short) (aceptaDelivery ? 1 : 0))
            .setParameter("acepta_salon",    (short) (aceptaSalon    ? 1 : 0));

        try {
            q.execute();
            Object out = q.getOutputParameterValue("nuevo_id");
            return out instanceof UUID u ? u : UUID.fromString(out.toString());
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_actualizar_restaurante ─────────────────────────────────────────────

    @Override
    @Transactional
    public void actualizar(UUID id, String nombre, String direccion, String telefono,
                           String logoUrl, boolean aceptaRecojo, boolean aceptaDelivery, boolean aceptaSalon) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_actualizar_restaurante")
            .registerStoredProcedureParameter("id",              String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("nombre",          String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("direccion",       String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("telefono",        String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("logo_url",        String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("acepta_recojo",   Short.class,  ParameterMode.IN)
            .registerStoredProcedureParameter("acepta_delivery", Short.class,  ParameterMode.IN)
            .registerStoredProcedureParameter("acepta_salon",    Short.class,  ParameterMode.IN)
            .setParameter("id",              id.toString())
            .setParameter("nombre",          nombre)
            .setParameter("direccion",       direccion)
            .setParameter("telefono",        telefono)
            .setParameter("logo_url",        logoUrl)
            .setParameter("acepta_recojo",   (short) (aceptaRecojo   ? 1 : 0))
            .setParameter("acepta_delivery", (short) (aceptaDelivery ? 1 : 0))
            .setParameter("acepta_salon",    (short) (aceptaSalon    ? 1 : 0));

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_toggle_restaurante ─────────────────────────────────────────────────

    @Override
    @Transactional
    public void toggle(UUID id, boolean activo) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_toggle_restaurante")
            .registerStoredProcedureParameter("id",     String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("activo", Short.class,  ParameterMode.IN)
            .setParameter("id",     id.toString())
            .setParameter("activo", (short) (activo ? 1 : 0));

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_listar_restaurantes ────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<Restaurante> listar(boolean soloActivos) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_listar_restaurantes")
            .registerStoredProcedureParameter("solo_activos", Short.class, ParameterMode.IN)
            .setParameter("solo_activos", (short) (soloActivos ? 1 : 0));

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        return rows.stream().map(this::mapRow).toList();
    }

    // ─── helpers ───────────────────────────────────────────────────────────────

    /** sp_listar_restaurantes: id, nombre, direccion, telefono, acepta_recojo, acepta_delivery, acepta_salon, activo */
    private Restaurante mapRow(Object[] row) {
        Restaurante r = new Restaurante();
        int i = 0;
        r.setId(toUuid(row[i++]));
        r.setNombre((String) row[i++]);
        r.setDireccion((String) row[i++]);
        r.setTelefono((String) row[i++]);
        r.setAceptaRecojo(toShort(row[i++]));
        r.setAceptaDelivery(toShort(row[i++]));
        r.setAceptaSalon(toShort(row[i++]));
        r.setActivo(toShort(row[i]));
        return r;
    }

    private RuntimeException mapSqlError(PersistenceException ex) {
        String msg = rootMessage(ex);
        if (msg.contains("50010") || msg.contains("no tiene rol restaurante")) {
            return new ReglaDeNegocioException("El usuario no existe o no tiene rol restaurante", ex);
        }
        if (msg.contains("50011") || msg.contains("50012") || msg.contains("Restaurante no encontrado")) {
            return new ResourceNotFoundException("Restaurante no encontrado", ex);
        }
        return ex;
    }

    private UUID toUuid(Object v) {
        if (v == null) return null;
        if (v instanceof UUID u) return u;
        return UUID.fromString(v.toString());
    }

    private Short toShort(Object v) {
        if (v == null) return 0;
        if (v instanceof Short s) return s;
        if (v instanceof Number n) return n.shortValue();
        return Short.parseShort(v.toString());
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
