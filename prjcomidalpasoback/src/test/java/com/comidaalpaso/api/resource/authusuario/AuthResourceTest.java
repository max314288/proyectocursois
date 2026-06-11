package com.comidaalpaso.api.resource.authusuario;

import com.comidaalpaso.api.adapter.authusuario.UsuarioDAO;
import com.comidaalpaso.api.shared.exception.GlobalExceptionHandler;
import com.comidaalpaso.api.shared.exception.InvalidCredentialsException;
import com.comidaalpaso.api.resource.authusuario.model.AuthResponse;
import com.comidaalpaso.api.resource.authusuario.model.UsuarioDTO;
import com.comidaalpaso.api.shared.security.JwtTokenProvider;
import com.comidaalpaso.api.business.authusuario.AuthService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests del Resource layer con MockMvc + AuthService mockeado.
 *
 * <p>Verifica el contrato HTTP: status codes 200/400, formato del body,
 * validación de DTOs.
 */
@WebMvcTest(controllers = AuthResource.class,
            excludeAutoConfiguration = {org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration.class})
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("AuthResource HTTP contract")
class AuthResourceTest {

    @Autowired private MockMvc mvc;
    @Autowired private ObjectMapper mapper;

    @MockitoBean private AuthService authService;
    @MockitoBean private JwtTokenProvider tokenProvider;
    @MockitoBean private UsuarioDAO usuarioDAO;

    // ─── POST /api/auth/login ──────────────────────────────────────────────────

    @Test
    @DisplayName("POST /login con credenciales correctas → 200 + token")
    void loginOk() throws Exception {
        var resp = new AuthResponse(
            "jwt-token",
            86_400_000L,
            new UsuarioDTO(UUID.randomUUID(), "Juan", "Perez",
                "juan@test.com", "cliente", true, LocalDate.now())
        );
        when(authService.login(any())).thenReturn(resp);

        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"email":"juan@test.com","password":"plain1234"}
                """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.token").value("jwt-token"))
            .andExpect(jsonPath("$.usuario.email").value("juan@test.com"))
            .andExpect(jsonPath("$.usuario.rol").value("cliente"));
    }

    @Test
    @DisplayName("POST /login con credenciales incorrectas → 400 con error=INVALID_CREDENTIALS")
    void loginInvalido() throws Exception {
        when(authService.login(any())).thenThrow(new InvalidCredentialsException());

        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"email":"x@test.com","password":"x"}
                """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("INVALID_CREDENTIALS"))
            .andExpect(jsonPath("$.status").value(400));
    }

    @Test
    @DisplayName("POST /login con email inválido → 400 con error=VALIDATION_ERROR")
    void loginEmailInvalido() throws Exception {
        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {"email":"no-es-email","password":"plain1234"}
                """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"));
    }

    @Test
    @DisplayName("POST /login sin body → 400")
    void loginSinBody() throws Exception {
        mvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content("{}"))
            .andExpect(status().isBadRequest());
    }

    // ─── POST /api/auth/register ───────────────────────────────────────────────

    @Test
    @DisplayName("POST /register con datos válidos → 200 + token")
    void registerOk() throws Exception {
        var resp = new AuthResponse("t", 1L,
            new UsuarioDTO(UUID.randomUUID(), "Ana", "Lopez",
                "ana@test.com", "cliente", true, LocalDate.now()));
        when(authService.register(any())).thenReturn(resp);

        mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "nombre":"Ana",
                      "apellido":"Lopez",
                      "email":"ana@test.com",
                      "password":"plain1234"
                    }
                """))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.usuario.nombre").value("Ana"));
    }

    @Test
    @DisplayName("POST /register sin apellido → 400 VALIDATION_ERROR")
    void registerSinApellido() throws Exception {
        mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "nombre":"Ana",
                      "email":"ana@test.com",
                      "password":"plain1234"
                    }
                """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"));
    }

    @Test
    @DisplayName("POST /register con password corta → 400 VALIDATION_ERROR")
    void registerPasswordCorta() throws Exception {
        mvc.perform(post("/api/auth/register")
                .contentType(MediaType.APPLICATION_JSON)
                .content("""
                    {
                      "nombre":"Ana",
                      "apellido":"Lopez",
                      "email":"ana@test.com",
                      "password":"123"
                    }
                """))
            .andExpect(status().isBadRequest())
            .andExpect(jsonPath("$.error").value("VALIDATION_ERROR"));
    }
}
