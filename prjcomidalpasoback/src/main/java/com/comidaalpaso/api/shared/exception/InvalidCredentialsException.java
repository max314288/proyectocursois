package com.comidaalpaso.api.shared.exception;

/**
 * Email o contraseña incorrectos en login. NUNCA se distingue cuál fue
 * el incorrecto (anti-enumeration por seguridad).
 *
 * <p>GlobalExceptionHandler → HTTP 400 con {@code error="INVALID_CREDENTIALS"}.
 */
public class InvalidCredentialsException extends RuntimeException {

    public InvalidCredentialsException() {
        super("Email o contraseña incorrectos");
    }

    public InvalidCredentialsException(String message) {
        super(message);
    }
}
