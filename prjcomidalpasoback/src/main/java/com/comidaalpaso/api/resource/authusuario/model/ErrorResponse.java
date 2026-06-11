package com.comidaalpaso.api.resource.authusuario.model;

import java.time.OffsetDateTime;
import java.util.List;

/**
 * Formato uniforme de error que retorna el API en cualquier non-2xx.
 *
 * <p>Como los status codes están restringidos a 200/202/400/404/500/504, el campo
 * {@code error} discrimina la causa específica para que el frontend pueda mostrar
 * mensajes adecuados (ej. {@code "INVALID_CREDENTIALS"} vs {@code "DUPLICATE_EMAIL"}).
 *
 * <p>{@code details} es opcional y se usa para errores de validación con la lista
 * de campos inválidos.
 */
public class ErrorResponse {

    private OffsetDateTime timestamp;
    private int status;
    private String error;
    private String message;
    private String path;
    private List<FieldError> details;

    public ErrorResponse() {
        this.timestamp = OffsetDateTime.now();
    }

    public ErrorResponse(int status, String error, String message, String path) {
        this();
        this.status = status;
        this.error = error;
        this.message = message;
        this.path = path;
    }

    public OffsetDateTime getTimestamp()    { return timestamp; }
    public int getStatus()                  { return status;    }
    public String getError()                { return error;     }
    public String getMessage()              { return message;   }
    public String getPath()                 { return path;      }
    public List<FieldError> getDetails()    { return details;   }

    public void setTimestamp(OffsetDateTime t) { this.timestamp = t; }
    public void setStatus(int status)          { this.status = status; }
    public void setError(String error)         { this.error = error; }
    public void setMessage(String message)     { this.message = message; }
    public void setPath(String path)           { this.path = path; }
    public void setDetails(List<FieldError> d) { this.details = d; }

    /** Detalle de error de validación por campo. */
    public record FieldError(String field, String message) { }
}
