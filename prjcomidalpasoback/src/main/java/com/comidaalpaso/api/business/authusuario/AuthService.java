package com.comidaalpaso.api.business.authusuario;

import com.comidaalpaso.api.resource.authusuario.model.AuthResponse;
import com.comidaalpaso.api.resource.authusuario.model.LoginRequest;
import com.comidaalpaso.api.resource.authusuario.model.RegisterRequest;
import com.comidaalpaso.api.resource.authusuario.model.UsuarioDTO;

import java.util.UUID;

/**
 * Servicio de autenticación.
 *
 * <p>SOLID-I: expone únicamente los métodos necesarios para auth.
 * SOLID-D: la implementación inyecta {@code UsuarioDAO} (no {@code Repository}).
 */
public interface AuthService {

    /**
     * Registra un nuevo usuario, hashea su password con BCrypt y devuelve un JWT.
     *
     * @throws com.comidaalpaso.api.shared.exception.DuplicateEmailException si el email ya está registrado
     */
    AuthResponse register(RegisterRequest req);

    /**
     * Verifica credenciales contra BCrypt y devuelve un JWT.
     *
     * @throws com.comidaalpaso.api.shared.exception.InvalidCredentialsException si email/password incorrectos
     * @throws com.comidaalpaso.api.shared.exception.UsuarioInactivoException si la cuenta está desactivada
     */
    AuthResponse login(LoginRequest req);

    /**
     * Re-emite un JWT para un usuario ya autenticado (extiende la sesión).
     *
     * @param userId UUID del usuario actualmente autenticado (del token entrante)
     */
    AuthResponse refresh(UUID userId);

    /**
     * Devuelve los datos del usuario autenticado (para {@code GET /api/auth/me}).
     *
     * @throws com.comidaalpaso.api.shared.exception.ResourceNotFoundException si no existe
     */
    UsuarioDTO me(UUID userId);
}
