package com.comidaalpaso.api.shared.security;

import com.comidaalpaso.api.resource.authusuario.model.ErrorResponse;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Punto de entrada para requests no autenticadas: responde {@code 401} con un
 * body JSON uniforme (misma forma que {@link ErrorResponse} del
 * {@code GlobalExceptionHandler}).
 *
 * <p>Se dispara cuando {@link JwtAuthFilter} no pudo poblar el contexto
 * (token ausente, inválido, expirado o usuario inactivo) y la request llega a
 * un endpoint protegido. El detalle del motivo lo deja el filtro en el
 * atributo {@code auth_error}.
 */
@Component
public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    static final String AUTH_ERROR_ATTR = "auth_error";

    private final ObjectMapper objectMapper;

    public RestAuthenticationEntryPoint(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response,
                         AuthenticationException authException) throws IOException {
        Object motivo = request.getAttribute(AUTH_ERROR_ATTR);
        String message = motivo != null
            ? motivo.toString()
            : "Token ausente, inválido o expirado";

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        response.setCharacterEncoding("UTF-8");

        ErrorResponse body = new ErrorResponse(401, "NO_AUTORIZADO", message, request.getRequestURI());
        objectMapper.writeValue(response.getWriter(), body);
    }
}
