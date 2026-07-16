package com.comidaalpaso.api.shared.exception;

import com.comidaalpaso.api.resource.authusuario.model.ErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessResourceFailureException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.sql.SQLTimeoutException;
import java.util.List;

/**
 * Mapea TODAS las excepciones a respuestas HTTP uniformes.
 *
 * <p><strong>Status codes permitidos:</strong> 200, 202, 400, 404, 500, 504.
 * Para errores 4xx no estándar, devolvemos 400 con un {@code error} discriminador
 * en el body (ver {@link ErrorResponse}).
 *
 * <p>SOLID-S: única responsabilidad — convertir excepciones en respuestas HTTP.
 * SOLID-O: agregar un nuevo tipo de error = nuevo {@code @ExceptionHandler},
 * sin tocar los existentes.
 */
@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger log = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    // ─── 400 — errores de cliente discriminados por "error" ────────────────────

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ErrorResponse> handleValidation(
            MethodArgumentNotValidException ex, HttpServletRequest req) {
        List<ErrorResponse.FieldError> fieldErrors = ex.getBindingResult().getFieldErrors().stream()
            .map(fe -> new ErrorResponse.FieldError(fe.getField(), fe.getDefaultMessage()))
            .toList();
        ErrorResponse body = new ErrorResponse(400, "VALIDATION_ERROR",
            "Los datos enviados son inválidos", req.getRequestURI());
        body.setDetails(fieldErrors);
        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(DuplicateEmailException.class)
    public ResponseEntity<ErrorResponse> handleDuplicateEmail(
            DuplicateEmailException ex, HttpServletRequest req) {
        return badRequest("DUPLICATE_EMAIL", ex.getMessage(), req);
    }

    @ExceptionHandler({InvalidCredentialsException.class, BadCredentialsException.class})
    public ResponseEntity<ErrorResponse> handleInvalidCredentials(
            Exception ex, HttpServletRequest req) {
        return badRequest("INVALID_CREDENTIALS", "Email o contraseña incorrectos", req);
    }

    @ExceptionHandler(UsuarioInactivoException.class)
    public ResponseEntity<ErrorResponse> handleInactive(
            UsuarioInactivoException ex, HttpServletRequest req) {
        return badRequest("USER_INACTIVE", ex.getMessage(), req);
    }

    @ExceptionHandler(JwtAuthException.class)
    public ResponseEntity<ErrorResponse> handleJwt(
            JwtAuthException ex, HttpServletRequest req) {
        return badRequest("UNAUTHORIZED", ex.getMessage(), req);
    }

    @ExceptionHandler(AccessDeniedException.class)
    public ResponseEntity<ErrorResponse> handleAccessDenied(
            AccessDeniedException ex, HttpServletRequest req) {
        return badRequest("FORBIDDEN", "No tienes permisos para realizar esta acción", req);
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<ErrorResponse> handleIllegalArgument(
            IllegalArgumentException ex, HttpServletRequest req) {
        return badRequest("BAD_REQUEST", ex.getMessage(), req);
    }

    @ExceptionHandler(ReglaDeNegocioException.class)
    public ResponseEntity<ErrorResponse> handleRegla(
            ReglaDeNegocioException ex, HttpServletRequest req) {
        return badRequest("BUSINESS_RULE", ex.getMessage(), req);
    }

    @ExceptionHandler(EmailEnvioException.class)
    public ResponseEntity<ErrorResponse> handleEmailEnvio(
            EmailEnvioException ex, HttpServletRequest req) {
        log.warn("Fallo al enviar comprobante por correo", ex);
        return badRequest("EMAIL_SEND_FAILED", "No se pudo enviar el correo. Intenta de nuevo más tarde.", req);
    }

    // ─── 409 ───────────────────────────────────────────────────────────────────

    @ExceptionHandler(ConflictoRecursoException.class)
    public ResponseEntity<ErrorResponse> handleConflicto(
            ConflictoRecursoException ex, HttpServletRequest req) {
        return status(HttpStatus.CONFLICT, "CONFLICT", ex.getMessage(), req);
    }

    // ─── 404 ───────────────────────────────────────────────────────────────────

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<ErrorResponse> handleNotFound(
            ResourceNotFoundException ex, HttpServletRequest req) {
        return status(HttpStatus.NOT_FOUND, "NOT_FOUND", ex.getMessage(), req);
    }

    // ─── 504 — timeouts / pool agotado ─────────────────────────────────────────

    @ExceptionHandler({SQLTimeoutException.class, DataAccessResourceFailureException.class})
    public ResponseEntity<ErrorResponse> handleTimeout(
            Exception ex, HttpServletRequest req) {
        log.warn("Timeout / DB inaccesible", ex);
        return status(HttpStatus.GATEWAY_TIMEOUT, "DB_TIMEOUT",
            "No se pudo conectar con la base de datos. Reintenta más tarde.", req);
    }

    // ─── 500 — último recurso ──────────────────────────────────────────────────

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ErrorResponse> handleUnknown(Exception ex, HttpServletRequest req) {
        log.error("Error no controlado en " + req.getRequestURI(), ex);
        return status(HttpStatus.INTERNAL_SERVER_ERROR, "INTERNAL_ERROR",
            "Ocurrió un error inesperado", req);
    }

    // ─── helpers ───────────────────────────────────────────────────────────────

    private ResponseEntity<ErrorResponse> badRequest(String error, String message,
                                                     HttpServletRequest req) {
        return ResponseEntity.badRequest()
            .body(new ErrorResponse(400, error, message, req.getRequestURI()));
    }

    private ResponseEntity<ErrorResponse> status(HttpStatus s, String error, String message,
                                                  HttpServletRequest req) {
        return ResponseEntity.status(s)
            .body(new ErrorResponse(s.value(), error, message, req.getRequestURI()));
    }
}
