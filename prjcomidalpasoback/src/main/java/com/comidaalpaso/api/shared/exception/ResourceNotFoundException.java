package com.comidaalpaso.api.shared.exception;

/**
 * Usuario/recurso no encontrado. Mapea SQL errors 50002, 50004, 50005.
 *
 * <p>GlobalExceptionHandler → HTTP 404.
 */
public class ResourceNotFoundException extends RuntimeException {

    public ResourceNotFoundException(String message) {
        super(message);
    }

    public ResourceNotFoundException(String message, Throwable cause) {
        super(message, cause);
    }
}
