package com.comidaalpaso.api.resource.authusuario;

import com.comidaalpaso.api.adapter.authusuario.UsuarioDAO;
import com.comidaalpaso.api.shared.exception.GlobalExceptionHandler;
import com.comidaalpaso.api.shared.exception.ResourceNotFoundException;
import com.comidaalpaso.api.resource.authusuario.model.UsuarioDTO;
import com.comidaalpaso.api.shared.security.JwtTokenProvider;
import com.comidaalpaso.api.business.authusuario.UsuarioService;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

/**
 * Tests del UsuarioResource — solo verifica el contrato HTTP (status + body).
 *
 * <p>Las reglas de autorización ({@code @PreAuthorize}) se validan
 * en el AuthFlowIntegrationTest con la cadena de seguridad real.
 */
@WebMvcTest(controllers = UsuarioResource.class,
            excludeAutoConfiguration = {SecurityAutoConfiguration.class})
@Import(GlobalExceptionHandler.class)
@AutoConfigureMockMvc(addFilters = false)
@DisplayName("UsuarioResource — contrato HTTP")
class UsuarioResourceTest {

    @Autowired private MockMvc mvc;

    @MockitoBean private UsuarioService usuarioService;
    @MockitoBean private JwtTokenProvider tokenProvider;
    @MockitoBean private UsuarioDAO usuarioDAO;

    // ─── GET /api/usuarios ─────────────────────────────────────────────────────

    @Test
    @DisplayName("GET /usuarios → 200 + lista")
    void listarOk() throws Exception {
        when(usuarioService.listar(any())).thenReturn(List.of(
            new UsuarioDTO(UUID.randomUUID(), "A", "B", "a@test.com",
                "cliente", true, LocalDate.now())
        ));

        mvc.perform(get("/api/usuarios"))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$[0].email").value("a@test.com"));
    }

    @Test
    @DisplayName("GET /usuarios?rol=admin filtra por rol")
    void listarConFiltro() throws Exception {
        when(usuarioService.listar(any())).thenReturn(List.of());
        mvc.perform(get("/api/usuarios?rol=admin"))
            .andExpect(status().isOk());
    }

    // ─── GET /api/usuarios/{id} ────────────────────────────────────────────────

    @Test
    @DisplayName("GET /usuarios/{id} existente → 200")
    void obtenerExistenteOk() throws Exception {
        UUID id = UUID.randomUUID();
        when(usuarioService.obtener(id)).thenReturn(
            new UsuarioDTO(id, "X", "Y", "x@test.com", "cliente", true, LocalDate.now())
        );

        mvc.perform(get("/api/usuarios/" + id))
            .andExpect(status().isOk())
            .andExpect(jsonPath("$.id").value(id.toString()));
    }

    @Test
    @DisplayName("GET /usuarios/{id} inexistente → 404 NOT_FOUND")
    void obtenerNoExiste() throws Exception {
        UUID id = UUID.randomUUID();
        when(usuarioService.obtener(id))
            .thenThrow(new ResourceNotFoundException("Usuario no encontrado: " + id));

        mvc.perform(get("/api/usuarios/" + id))
            .andExpect(status().isNotFound())
            .andExpect(jsonPath("$.error").value("NOT_FOUND"));
    }
}
