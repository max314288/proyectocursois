package com.comidaalpaso.api.business.authusuario.impl;

import com.comidaalpaso.api.adapter.authusuario.UsuarioDAO;
import com.comidaalpaso.api.adapter.authusuario.model.Rol;
import com.comidaalpaso.api.shared.exception.InvalidCredentialsException;
import com.comidaalpaso.api.shared.exception.ResourceNotFoundException;
import com.comidaalpaso.api.shared.exception.UsuarioInactivoException;
import com.comidaalpaso.api.resource.authusuario.model.AuthResponse;
import com.comidaalpaso.api.resource.authusuario.model.LoginRequest;
import com.comidaalpaso.api.resource.authusuario.model.RegisterRequest;
import com.comidaalpaso.api.resource.authusuario.model.UsuarioDTO;
import com.comidaalpaso.api.adapter.authusuario.model.Usuario;
import com.comidaalpaso.api.shared.security.JwtTokenProvider;
import com.comidaalpaso.api.business.authusuario.AuthService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.UUID;

/**
 * Implementación del {@link AuthService}.
 *
 * <p>SOLID-D: depende de las abstracciones {@code UsuarioDAO}, {@code PasswordEncoder},
 * {@code JwtTokenProvider}. Esto permite tests con Mockito sin levantar Spring.
 *
 * <p>SOLID-S: única responsabilidad — orquestar credenciales y emisión de JWT.
 * La persistencia es responsabilidad del DAO; el hashing del encoder; la firma
 * del token provider.
 */
@Service
public class AuthServiceImpl implements AuthService {

    private final UsuarioDAO usuarioDAO;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider tokenProvider;

    public AuthServiceImpl(UsuarioDAO usuarioDAO,
                           PasswordEncoder passwordEncoder,
                           JwtTokenProvider tokenProvider) {
        this.usuarioDAO = usuarioDAO;
        this.passwordEncoder = passwordEncoder;
        this.tokenProvider = tokenProvider;
    }

    // ─── register ──────────────────────────────────────────────────────────────

    @Override
    public AuthResponse register(RegisterRequest req) {
        Rol rol = resolverRol(req.getRol());
        String hash = passwordEncoder.encode(req.getPassword());

        UUID id = usuarioDAO.crear(
            req.getNombre(),
            req.getApellido(),
            req.getEmail(),
            hash,
            rol
        );

        // Re-leemos para obtener created_at + activo desde la BD
        Usuario nuevo = usuarioDAO.findById(id)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario recién creado no se pudo leer"));

        return buildAuthResponse(nuevo);
    }

    // ─── login ─────────────────────────────────────────────────────────────────

    @Override
    public AuthResponse login(LoginRequest req) {
        Usuario u = usuarioDAO.findByEmail(req.getEmail())
            .orElseThrow(InvalidCredentialsException::new);

        if (!passwordEncoder.matches(req.getPassword(), u.getPasswordHash())) {
            throw new InvalidCredentialsException();
        }
        if (!u.isActivo()) {
            throw new UsuarioInactivoException();
        }
        return buildAuthResponse(u);
    }

    // ─── refresh ───────────────────────────────────────────────────────────────

    @Override
    public AuthResponse refresh(UUID userId) {
        Usuario u = usuarioDAO.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        if (!u.isActivo()) {
            throw new UsuarioInactivoException();
        }
        return buildAuthResponse(u);
    }

    // ─── me ────────────────────────────────────────────────────────────────────

    @Override
    public UsuarioDTO me(UUID userId) {
        Usuario u = usuarioDAO.findById(userId)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return UsuarioDTO.from(u);
    }

    // ─── helpers ───────────────────────────────────────────────────────────────

    private Rol resolverRol(String rolStr) {
        if (rolStr == null || rolStr.isBlank()) return Rol.CLIENTE;
        return Rol.fromDb(rolStr);
    }

    private AuthResponse buildAuthResponse(Usuario u) {
        String token = tokenProvider.generateToken(u);
        return new AuthResponse(token, tokenProvider.getExpirationMs(), UsuarioDTO.from(u));
    }
}
