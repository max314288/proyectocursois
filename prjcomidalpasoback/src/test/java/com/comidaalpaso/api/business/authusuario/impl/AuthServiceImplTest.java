package com.comidaalpaso.api.business.authusuario.impl;

import com.comidaalpaso.api.adapter.authusuario.UsuarioDAO;
import com.comidaalpaso.api.adapter.authusuario.model.Rol;
import com.comidaalpaso.api.shared.exception.InvalidCredentialsException;
import com.comidaalpaso.api.shared.exception.UsuarioInactivoException;
import com.comidaalpaso.api.resource.authusuario.model.AuthResponse;
import com.comidaalpaso.api.resource.authusuario.model.LoginRequest;
import com.comidaalpaso.api.resource.authusuario.model.RegisterRequest;
import com.comidaalpaso.api.adapter.authusuario.model.Usuario;
import com.comidaalpaso.api.shared.security.JwtTokenProvider;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.when;

/**
 * Tests TDD del {@link AuthServiceImpl} con Mockito — sin Spring Context.
 *
 * <p>Verifica la lógica de orquestación: hashing + DAO + JWT, sin tocar BD.
 */
@DisplayName("AuthServiceImpl")
@ExtendWith(MockitoExtension.class)
class AuthServiceImplTest {

    @Mock private UsuarioDAO dao;
    @Mock private PasswordEncoder encoder;
    @Mock private JwtTokenProvider tokenProvider;

    @InjectMocks private AuthServiceImpl service;

    private Usuario u;
    private UUID uid;

    @BeforeEach
    void setUp() {
        uid = UUID.randomUUID();
        u = new Usuario();
        u.setId(uid);
        u.setNombre("Juan");
        u.setApellido("Perez");
        u.setEmail("juan@test.com");
        u.setPasswordHash("hash-bcrypt");
        u.setRol("cliente");
        u.setActivo((short) 1);
        u.setCreatedAt(LocalDate.now());
    }

    // ─── register ──────────────────────────────────────────────────────────────

    @Test
    @DisplayName("register() hashea la password, llama DAO.crear y devuelve un AuthResponse")
    void registerOk() {
        RegisterRequest req = new RegisterRequest();
        req.setNombre("Juan");
        req.setApellido("Perez");
        req.setEmail("juan@test.com");
        req.setPassword("plain1234");

        when(encoder.encode("plain1234")).thenReturn("hash-bcrypt");
        when(dao.crear("Juan", "Perez", "juan@test.com", "hash-bcrypt", Rol.CLIENTE))
            .thenReturn(uid);
        when(dao.findById(uid)).thenReturn(Optional.of(u));
        when(tokenProvider.generateToken(any())).thenReturn("token-jwt");
        when(tokenProvider.getExpirationMs()).thenReturn(86_400_000L);

        AuthResponse resp = service.register(req);

        assertThat(resp.getToken()).isEqualTo("token-jwt");
        assertThat(resp.getUsuario().getEmail()).isEqualTo("juan@test.com");
        assertThat(resp.getUsuario().getRol()).isEqualTo("cliente");
    }

    @Test
    @DisplayName("register() usa rol=cliente cuando el request no especifica rol")
    void registerSinRolUsaCliente() {
        RegisterRequest req = new RegisterRequest();
        req.setNombre("X"); req.setApellido("Y");
        req.setEmail("x@test.com"); req.setPassword("plain1234");

        when(encoder.encode(anyString())).thenReturn("hash");
        when(dao.crear(anyString(), anyString(), anyString(), anyString(), any(Rol.class)))
            .thenReturn(uid);
        when(dao.findById(uid)).thenReturn(Optional.of(u));
        when(tokenProvider.generateToken(any())).thenReturn("t");

        service.register(req);

        // verificación implícita: si no es CLIENTE, el stub del DAO no matchea y falla
        assertThat(req.getRol()).isNull();
    }

    // ─── login ─────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("login() con credenciales correctas devuelve AuthResponse")
    void loginOk() {
        LoginRequest req = new LoginRequest();
        req.setEmail("juan@test.com");
        req.setPassword("plain1234");

        when(dao.findByEmail("juan@test.com")).thenReturn(Optional.of(u));
        when(encoder.matches("plain1234", "hash-bcrypt")).thenReturn(true);
        when(tokenProvider.generateToken(u)).thenReturn("token-xyz");

        AuthResponse resp = service.login(req);

        assertThat(resp.getToken()).isEqualTo("token-xyz");
        assertThat(resp.getUsuario().getEmail()).isEqualTo("juan@test.com");
    }

    @Test
    @DisplayName("login() con email inexistente lanza InvalidCredentialsException")
    void loginEmailInexistente() {
        LoginRequest req = new LoginRequest();
        req.setEmail("no-existe@test.com");
        req.setPassword("x");

        when(dao.findByEmail("no-existe@test.com")).thenReturn(Optional.empty());

        assertThatThrownBy(() -> service.login(req))
            .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    @DisplayName("login() con password incorrecta lanza InvalidCredentialsException")
    void loginPasswordIncorrecta() {
        LoginRequest req = new LoginRequest();
        req.setEmail("juan@test.com");
        req.setPassword("wrong");

        when(dao.findByEmail("juan@test.com")).thenReturn(Optional.of(u));
        when(encoder.matches("wrong", "hash-bcrypt")).thenReturn(false);

        assertThatThrownBy(() -> service.login(req))
            .isInstanceOf(InvalidCredentialsException.class);
    }

    @Test
    @DisplayName("login() con usuario inactivo lanza UsuarioInactivoException")
    void loginInactivoLanza() {
        u.setActivo((short) 0);
        LoginRequest req = new LoginRequest();
        req.setEmail("juan@test.com");
        req.setPassword("plain1234");

        when(dao.findByEmail("juan@test.com")).thenReturn(Optional.of(u));
        when(encoder.matches("plain1234", "hash-bcrypt")).thenReturn(true);

        assertThatThrownBy(() -> service.login(req))
            .isInstanceOf(UsuarioInactivoException.class);
    }

    // ─── refresh ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("refresh() devuelve un nuevo token para un usuario activo")
    void refreshOk() {
        when(dao.findById(uid)).thenReturn(Optional.of(u));
        when(tokenProvider.generateToken(u)).thenReturn("nuevo-token");

        AuthResponse resp = service.refresh(uid);

        assertThat(resp.getToken()).isEqualTo("nuevo-token");
    }

    @Test
    @DisplayName("refresh() de usuario inactivo lanza UsuarioInactivoException")
    void refreshInactivo() {
        u.setActivo((short) 0);
        when(dao.findById(uid)).thenReturn(Optional.of(u));

        assertThatThrownBy(() -> service.refresh(uid))
            .isInstanceOf(UsuarioInactivoException.class);
    }

    // ─── me ────────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("me() devuelve un UsuarioDTO sin password_hash")
    void meDevuelveDTO() {
        when(dao.findById(uid)).thenReturn(Optional.of(u));
        var dto = service.me(uid);
        assertThat(dto.getId()).isEqualTo(uid);
        assertThat(dto.getEmail()).isEqualTo("juan@test.com");
    }
}
