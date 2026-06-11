package com.comidaalpaso.api.shared.exception;

public class ReglaDeNegocioException extends RuntimeException {
    public ReglaDeNegocioException(String message) { super(message); }
    public ReglaDeNegocioException(String message, Throwable cause) { super(message, cause); }
}
