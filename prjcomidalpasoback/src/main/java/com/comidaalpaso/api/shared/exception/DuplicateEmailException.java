package com.comidaalpaso.api.shared.exception;

/**
 * Email ya registrado o en uso por otro usuario. Mapea SQL errors 50001, 50003.
 *
 * <p>GlobalExceptionHandler → HTTP 400 con {@code error="DUPLICATE_EMAIL"}.
 */
public class DuplicateEmailException extends RuntimeException {

    public DuplicateEmailException(String message) {
        super(message);
    }

    public DuplicateEmailException(String message, Throwable cause) {
        super(message, cause);
    }
}
