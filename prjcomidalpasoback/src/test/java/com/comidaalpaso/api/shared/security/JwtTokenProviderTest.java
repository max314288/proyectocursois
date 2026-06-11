package com.comidaalpaso.api.shared.security;

import com.comidaalpaso.api.adapter.authusuario.model.Rol;
import com.comidaalpaso.api.shared.exception.JwtAuthException;
import com.comidaalpaso.api.adapter.authusuario.model.Usuario;
import io.jsonwebtoken.Claims;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;

import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

/**
 * Tests TDD del {@link JwtTokenProvider} — sin Spring, JUnit puro.
 */
@DisplayName("JwtTokenProvider")
class JwtTokenProviderTest {

    private static final String SECRET = "test-secret-32-bytes-base64-aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa";
    private static final long ONE_HOUR = 3600_000L;

    private JwtTokenProvider provider;
    private Usuario usuario;

    @BeforeEach
    void setUp() {
        provider = new JwtTokenProvider(SECRET, ONE_HOUR);

        usuario = new Usuario();
        usuario.setId(UUID.fromString("11111111-2222-3333-4444-555555555555"));
        usuario.setEmail("test@comidaalpaso.com");
        usuario.setRol("admin");
    }

    @Test
    @DisplayName("generateToken() produce un JWT no vacío con 3 segmentos")
    void generaToken() {
        String token = provider.generateToken(usuario);
        assertThat(token).isNotBlank();
        assertThat(token.split("\\.")).hasSize(3);
    }

    @Test
    @DisplayName("parseClaims() devuelve los claims firmados con el secreto correcto")
    void parsea() {
        String token = provider.generateToken(usuario);
        Claims claims = provider.parseClaims(token);
        assertThat(claims.getSubject()).isEqualTo(usuario.getId().toString());
        assertThat(claims.get("rol", String.class)).isEqualTo("admin");
        assertThat(claims.get("email", String.class)).isEqualTo("test@comidaalpaso.com");
    }

    @Test
    @DisplayName("extractUserId() devuelve el UUID original")
    void extraeUserId() {
        String token = provider.generateToken(usuario);
        assertThat(provider.extractUserId(token)).isEqualTo(usuario.getId());
    }

    @Test
    @DisplayName("extractRol() mapea correctamente el string del claim al enum Rol")
    void extraeRol() {
        String token = provider.generateToken(usuario);
        assertThat(provider.extractRol(token)).isEqualTo(Rol.ADMIN);
    }

    @Test
    @DisplayName("parseClaims() de un token alterado lanza JwtAuthException")
    void tokenTamperedLanza() {
        String token = provider.generateToken(usuario);
        String tampered = token.substring(0, token.length() - 2) + "XX";
        assertThatThrownBy(() -> provider.parseClaims(tampered))
            .isInstanceOf(JwtAuthException.class);
    }

    @Test
    @DisplayName("parseClaims() de un token expirado lanza JwtAuthException")
    void tokenExpiradoLanza() throws InterruptedException {
        JwtTokenProvider shortLived = new JwtTokenProvider(SECRET, 1L);
        String token = shortLived.generateToken(usuario);
        Thread.sleep(50);
        assertThatThrownBy(() -> shortLived.parseClaims(token))
            .isInstanceOf(JwtAuthException.class)
            .hasMessageContaining("expirado");
    }

    @Test
    @DisplayName("parseClaims() de un string no-JWT lanza JwtAuthException")
    void tokenInvalidoLanza() {
        assertThatThrownBy(() -> provider.parseClaims("no-es-un-jwt"))
            .isInstanceOf(JwtAuthException.class);
    }

    @Test
    @DisplayName("getExpirationMs() devuelve el valor configurado")
    void exposesExpiration() {
        assertThat(provider.getExpirationMs()).isEqualTo(ONE_HOUR);
    }
}
