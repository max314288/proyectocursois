package com.comidaalpaso.api.resource.authusuario;

import com.comidaalpaso.api.adapter.authusuario.model.Rol;
import com.comidaalpaso.api.resource.authusuario.model.CambiarPasswordRequest;
import com.comidaalpaso.api.resource.authusuario.model.ToggleUsuarioRequest;
import com.comidaalpaso.api.resource.authusuario.model.UpdateUsuarioRequest;
import com.comidaalpaso.api.resource.authusuario.model.UsuarioDTO;
import com.comidaalpaso.api.shared.security.AuthenticatedUser;
import com.comidaalpaso.api.business.authusuario.UsuarioService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Endpoints CRUD de usuarios, protegidos con {@code @PreAuthorize}.
 *
 * <p>Reglas de autorización:
 * <ul>
 *   <li>Listar / obtener / toggle → solo ADMIN</li>
 *   <li>Actualizar / cambiar password → ADMIN o el propio dueño</li>
 * </ul>
 *
 * <p>Status codes: 200 (listar/obtener/actualizar), 200 (cambiar password),
 * 202 (toggle — cambio aceptado), 400 (validación / invalid), 404 (no encontrado).
 */
@RestController
@RequestMapping("/api/usuarios")
public class UsuarioResource {

    private final UsuarioService usuarioService;

    public UsuarioResource(UsuarioService usuarioService) {
        this.usuarioService = usuarioService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<UsuarioDTO>> listar(
            @RequestParam(value = "rol", required = false) String rol) {
        Rol filtro = (rol == null || rol.isBlank()) ? null : Rol.fromDb(rol);
        return ResponseEntity.ok(usuarioService.listar(filtro));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UsuarioDTO> obtener(@PathVariable UUID id) {
        return ResponseEntity.ok(usuarioService.obtener(id));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<UsuarioDTO> actualizar(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateUsuarioRequest req) {
        return ResponseEntity.ok(usuarioService.actualizar(id, req));
    }

    @PutMapping("/{id}/password")
    @PreAuthorize("hasRole('ADMIN') or #id == authentication.principal.id")
    public ResponseEntity<Map<String, Boolean>> cambiarPassword(
            @PathVariable UUID id,
            @Valid @RequestBody CambiarPasswordRequest req,
            @AuthenticationPrincipal AuthenticatedUser caller) {
        boolean esAdmin = caller.getRol() == Rol.ADMIN && !caller.getId().equals(id);
        usuarioService.cambiarPassword(id, req, esAdmin);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> toggle(
            @PathVariable UUID id,
            @Valid @RequestBody ToggleUsuarioRequest req) {
        usuarioService.toggle(id, req.getActivo());
        return ResponseEntity.accepted().body(Map.of("ok", true));
    }
}
