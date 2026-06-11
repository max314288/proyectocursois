package com.comidaalpaso.api.resource.authusuario;

import com.comidaalpaso.api.resource.authusuario.model.AuthResponse;
import com.comidaalpaso.api.resource.authusuario.model.LoginRequest;
import com.comidaalpaso.api.resource.authusuario.model.RegisterRequest;
import com.comidaalpaso.api.resource.authusuario.model.UsuarioDTO;
import com.comidaalpaso.api.shared.security.AuthenticatedUser;
import com.comidaalpaso.api.business.authusuario.AuthService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

/**
 * Endpoints públicos de autenticación.
 *
 * <p>Mapeo a status codes (200/202/400/404/500/504 únicamente):
 * <ul>
 *   <li>{@code 200} — éxito en register, login, refresh, me</li>
 *   <li>{@code 400} — credenciales inválidas, usuario inactivo, validación, email duplicado</li>
 * </ul>
 *
 * <p>SOLID-S: única responsabilidad — recibir requests, delegar al service, devolver responses.
 * SOLID-D: depende de la interfaz {@link AuthService}, no de la implementación.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthResource {

    private final AuthService authService;

    public AuthResource(AuthService authService) {
        this.authService = authService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest req) {
        return ResponseEntity.ok(authService.register(req));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest req) {
        return ResponseEntity.ok(authService.login(req));
    }

    @PostMapping("/refresh")
    public ResponseEntity<AuthResponse> refresh(@AuthenticationPrincipal AuthenticatedUser principal) {
        return ResponseEntity.ok(authService.refresh(principal.getId()));
    }

    @GetMapping("/me")
    public ResponseEntity<UsuarioDTO> me(@AuthenticationPrincipal AuthenticatedUser principal) {
        return ResponseEntity.ok(authService.me(principal.getId()));
    }
}
