package com.comidaalpaso.api.shared.exception;

/**
 * Error de autenticación con JWT: token ausente, inválido, expirado o tampered.
 *
 * <p>GlobalExceptionHandler → HTTP 400 con {@code error="UNAUTHORIZED"}.
 */
public class JwtAuthException extends RuntimeException {

    public JwtAuthException(String message) {
        super(message);
    }

    public JwtAuthException(String message, Throwable cause) {
        super(message, cause);
    }
}
