package com.comidaalpaso.api.business.authusuario;

import com.comidaalpaso.api.adapter.authusuario.model.Rol;
import com.comidaalpaso.api.resource.authusuario.model.CambiarPasswordRequest;
import com.comidaalpaso.api.resource.authusuario.model.UpdateUsuarioRequest;
import com.comidaalpaso.api.resource.authusuario.model.UsuarioDTO;

import java.util.List;
import java.util.UUID;

/**
 * Gestión CRUD de usuarios (post-registro).
 *
 * <p>SOLID-I: expone solo los métodos necesarios para el recurso, distintos
 * de los de {@code AuthService}.
 */
public interface UsuarioService {

    List<UsuarioDTO> listar(Rol rolFiltro);

    UsuarioDTO obtener(UUID id);

    UsuarioDTO actualizar(UUID id, UpdateUsuarioRequest req);

    /**
     * Cambia la contraseña del usuario.
     *
     * @param esAdmin true si el caller es ADMIN — puede omitir {@code passwordActual}
     */
    void cambiarPassword(UUID id, CambiarPasswordRequest req, boolean esAdmin);

    void toggle(UUID id, boolean activo);
}
