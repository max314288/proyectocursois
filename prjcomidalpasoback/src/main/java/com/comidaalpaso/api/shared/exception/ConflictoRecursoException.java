package com.comidaalpaso.api.shared.exception;

public class ConflictoRecursoException extends RuntimeException {
    public ConflictoRecursoException(String message) { super(message); }
    public ConflictoRecursoException(String message, Throwable cause) { super(message, cause); }
}
