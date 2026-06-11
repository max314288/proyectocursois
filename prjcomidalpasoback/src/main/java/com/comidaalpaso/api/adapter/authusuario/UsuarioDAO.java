package com.comidaalpaso.api.adapter.authusuario;

import com.comidaalpaso.api.adapter.authusuario.model.Rol;
import com.comidaalpaso.api.adapter.authusuario.model.Usuario;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

/**
 * Abstracción de persistencia para {@link Usuario}.
 *
 * <p><strong>SOLID-I (Interface Segregation):</strong> expone solo los 7 métodos
 * que los servicios necesitan, no los ~30 genéricos de {@code JpaRepository}.
 *
 * <p><strong>SOLID-D (Dependency Inversion):</strong> los servicios dependen de
 * esta interfaz, no de la implementación concreta. Permite cambiar entre
 * "SP-backed" y "JPA-pure" sin tocar la capa de servicio.
 *
 * <p>Cada método mapea 1:1 con un stored procedure en {@code sql_usuario.sql}.
 */
public interface UsuarioDAO {

    /**
     * Invoca {@code sp_crear_usuario}.
     *
     * @return UUID del usuario creado (campo OUTPUT del SP).
     * @throws com.comidaalpaso.api.shared.exception.DuplicateEmailException si SQL error 50001.
     */
    UUID crear(String nombre, String apellido, String email,
               String passwordHash, Rol rol);

    /**
     * Invoca {@code sp_obtener_usuario_por_email}. Devuelve el usuario completo
     * (incluyendo password_hash) — único método que expone el hash, usado
     * exclusivamente por el AuthService durante login.
     */
    Optional<Usuario> findByEmail(String email);

    /**
     * Invoca {@code sp_obtener_usuario}. NO incluye password_hash.
     */
    Optional<Usuario> findById(UUID id);

    /**
     * Invoca {@code sp_listar_usuarios}. NO incluye password_hash.
     *
     * @param rolFiltro opcional — si es {@code null} devuelve todos.
     */
    List<Usuario> listar(Rol rolFiltro);

    /**
     * Invoca {@code sp_actualizar_usuario}.
     *
     * @throws com.comidaalpaso.api.shared.exception.ResourceNotFoundException si SQL error 50002.
     * @throws com.comidaalpaso.api.shared.exception.DuplicateEmailException si SQL error 50003.
     */
    void actualizar(UUID id, String nombre, String apellido, String email);

    /**
     * Invoca {@code sp_cambiar_password}.
     *
     * @throws com.comidaalpaso.api.shared.exception.ResourceNotFoundException si SQL error 50004.
     */
    void cambiarPassword(UUID id, String passwordHash);

    /**
     * Invoca {@code sp_toggle_usuario}.
     *
     * @param activo true → 1, false → 0
     * @throws com.comidaalpaso.api.shared.exception.ResourceNotFoundException si SQL error 50005.
     */
    void toggleActivo(UUID id, boolean activo);
}
