package com.comidaalpaso.api.shared.exception;

/**
 * El usuario intentó loguearse pero su cuenta tiene {@code activo = 0}.
 *
 * <p>GlobalExceptionHandler → HTTP 400 con {@code error="USER_INACTIVE"}.
 */
public class UsuarioInactivoException extends RuntimeException {

    public UsuarioInactivoException() {
        super("La cuenta de usuario está desactivada");
    }

    public UsuarioInactivoException(String message) {
        super(message);
    }
}
