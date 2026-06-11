package com.comidaalpaso.api.adapter.authusuario.impl;

import com.comidaalpaso.api.adapter.authusuario.UsuarioDAO;
import com.comidaalpaso.api.adapter.authusuario.model.Rol;
import com.comidaalpaso.api.shared.exception.DuplicateEmailException;
import com.comidaalpaso.api.shared.exception.ResourceNotFoundException;
import com.comidaalpaso.api.adapter.authusuario.model.Usuario;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import jakarta.persistence.StoredProcedureQuery;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Implementación de {@link UsuarioDAO} basada en stored procedures de SQL Server.
 *
 * <p>Invoca cada SP vía {@link EntityManager#createStoredProcedureQuery} y mapea
 * los códigos de error 50001-50005 a excepciones de dominio.
 *
 * <p>SOLID-S: única responsabilidad — invocar SPs y traducir resultados.
 * SOLID-D: implementa la abstracción {@code UsuarioDAO} — los servicios no
 * conocen los detalles de los SPs.
 */
@Component
public class UsuarioDAOImpl implements UsuarioDAO {

    private static final String COL_ID            = "id";
    private static final String COL_NOMBRE        = "nombre";
    private static final String COL_APELLIDO      = "apellido";
    private static final String COL_EMAIL         = "email";
    private static final String COL_PASSWORD_HASH = "password_hash";
    private static final String COL_ROL           = "rol";
    private static final String COL_ACTIVO        = "activo";
    private static final String COL_CREATED_AT    = "created_at";

    @PersistenceContext
    private EntityManager em;

    // ─── sp_crear_usuario ──────────────────────────────────────────────────────

    @Override
    @Transactional
    public UUID crear(String nombre, String apellido, String email,
                      String passwordHash, Rol rol) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_crear_usuario")
            .registerStoredProcedureParameter("nombre",        String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("apellido",      String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("email",         String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("password_hash", String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("rol",           String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("nuevo_id",      String.class, ParameterMode.OUT)
            .setParameter("nombre",        nombre)
            .setParameter("apellido",      apellido)
            .setParameter("email",         email)
            .setParameter("password_hash", passwordHash)
            .setParameter("rol",           rol.dbValue());

        try {
            q.execute();
            Object out = q.getOutputParameterValue("nuevo_id");
            return out instanceof UUID u ? u : UUID.fromString(out.toString());
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_obtener_usuario_por_email ──────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findByEmail(String email) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_obtener_usuario_por_email")
            .registerStoredProcedureParameter("email", String.class, ParameterMode.IN)
            .setParameter("email", email);

        return executeAndMapFirstWithPassword(q);
    }

    // ─── sp_obtener_usuario ────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public Optional<Usuario> findById(UUID id) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_obtener_usuario")
            .registerStoredProcedureParameter("id", String.class, ParameterMode.IN)
            .setParameter("id", id.toString());

        return executeAndMapFirst(q, false);
    }

    // ─── sp_listar_usuarios ────────────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<Usuario> listar(Rol rolFiltro) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_listar_usuarios")
            .registerStoredProcedureParameter("rol", String.class, ParameterMode.IN)
            .setParameter("rol", rolFiltro == null ? null : rolFiltro.dbValue());

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        return rows.stream().map(row -> mapRow(row, false)).toList();
    }

    // ─── sp_actualizar_usuario ─────────────────────────────────────────────────

    @Override
    @Transactional
    public void actualizar(UUID id, String nombre, String apellido, String email) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_actualizar_usuario")
            .registerStoredProcedureParameter("id",       String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("nombre",   String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("apellido", String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("email",    String.class, ParameterMode.IN)
            .setParameter("id",       id.toString())
            .setParameter("nombre",   nombre)
            .setParameter("apellido", apellido)
            .setParameter("email",    email);

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_cambiar_password ───────────────────────────────────────────────────

    @Override
    @Transactional
    public void cambiarPassword(UUID id, String passwordHash) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_cambiar_password")
            .registerStoredProcedureParameter("id",            String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("password_hash", String.class, ParameterMode.IN)
            .setParameter("id",            id.toString())
            .setParameter("password_hash", passwordHash);

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_toggle_usuario ─────────────────────────────────────────────────────

    @Override
    @Transactional
    public void toggleActivo(UUID id, boolean activo) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_toggle_usuario")
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

    // ─── helpers ───────────────────────────────────────────────────────────────

    private Optional<Usuario> executeAndMapFirst(StoredProcedureQuery q, boolean withPassword) {
        try {
            @SuppressWarnings("unchecked")
            List<Object[]> rows = q.getResultList();
            if (rows.isEmpty()) return Optional.empty();
            return Optional.of(mapRow(rows.get(0), withPassword));
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    private Optional<Usuario> executeAndMapFirstWithPassword(StoredProcedureQuery q) {
        return executeAndMapFirst(q, true);
    }

    /**
     * Mapea una fila (Object[]) del ResultSet del SP a una entity Usuario.
     *
     * <p>El orden de columnas en los SPs:
     * <ul>
     *   <li>{@code sp_listar_usuarios} / {@code sp_obtener_usuario}: id, nombre, apellido, email, rol, activo, created_at (7 cols, SIN password)</li>
     *   <li>{@code sp_obtener_usuario_por_email}: id, nombre, apellido, email, password_hash, rol, activo, created_at (8 cols, CON password)</li>
     * </ul>
     */
    private Usuario mapRow(Object[] row, boolean withPassword) {
        Usuario u = new Usuario();
        int i = 0;
        u.setId(toUuid(row[i++]));
        u.setNombre((String) row[i++]);
        u.setApellido((String) row[i++]);
        u.setEmail((String) row[i++]);
        if (withPassword) {
            u.setPasswordHash((String) row[i++]);
        }
        u.setRol((String) row[i++]);
        u.setActivo(toShort(row[i++]));
        u.setCreatedAt(toLocalDate(row[i]));
        return u;
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

    /**
     * Convierte un PersistenceException (que envuelve un SQLException con código
     * 50001-50005) en la excepción de dominio correcta.
     */
    private RuntimeException mapSqlError(PersistenceException ex) {
        String msg = rootMessage(ex);
        if (msg.contains("50001") || msg.contains("email ya está registrado")) {
            return new DuplicateEmailException("El email ya está registrado", ex);
        }
        if (msg.contains("50003") || msg.contains("email ya está en uso")) {
            return new DuplicateEmailException("El email ya está en uso por otro usuario", ex);
        }
        if (msg.contains("50002") || msg.contains("50004") || msg.contains("50005")
            || msg.contains("Usuario no encontrado")) {
            return new ResourceNotFoundException("Usuario no encontrado", ex);
        }
        return ex; // se propaga al GlobalExceptionHandler como 500
    }

    private String rootMessage(Throwable t) {
        Throwable cur = t;
        while (cur.getCause() != null && cur.getCause() != cur) {
            cur = cur.getCause();
        }
        return cur.getMessage() == null ? "" : cur.getMessage();
    }
}
