package com.comidaalpaso.api.shared.security;

import com.comidaalpaso.api.adapter.authusuario.model.Rol;
import com.comidaalpaso.api.shared.exception.JwtAuthException;
import com.comidaalpaso.api.adapter.authusuario.model.Usuario;
import io.jsonwebtoken.Claims;
import io.jsonwebtoken.ExpiredJwtException;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.nio.charset.StandardCharsets;
import java.util.Date;
import java.util.UUID;

/**
 * Genera y valida JWTs firmados con HS256.
 *
 * <p><strong>SOLID-S:</strong> única responsabilidad — firmar/verificar tokens.
 * No consulta usuarios ni accede a BD.
 *
 * <p>Claims:
 * <ul>
 *   <li>{@code sub} → UUID del usuario</li>
 *   <li>{@code rol} → string del rol en formato BD ({@code cliente|admin|restaurante|repartidor})</li>
 *   <li>{@code email} → email del usuario (conveniencia para el frontend)</li>
 *   <li>{@code iat} / {@code exp} → estándar</li>
 * </ul>
 */
@Component
public class JwtTokenProvider {

    private final SecretKey signingKey;
    private final long expirationMs;

    public JwtTokenProvider(@Value("${jwt.secret}") String secret,
                            @Value("${jwt.expiration-ms}") long expirationMs) {
        this.signingKey = Keys.hmacShaKeyFor(secret.getBytes(StandardCharsets.UTF_8));
        this.expirationMs = expirationMs;
    }

    public String generateToken(Usuario u) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
            .subject(u.getId().toString())
            .claim("rol", u.getRol())
            .claim("email", u.getEmail())
            .issuedAt(now)
            .expiration(exp)
            .signWith(signingKey)
            .compact();
    }

    public long getExpirationMs() {
        return expirationMs;
    }

    /**
     * Parsea el token y devuelve los claims. Lanza {@link JwtAuthException} si
     * el token es inválido, expirado o tampered.
     */
    public Claims parseClaims(String token) {
        try {
            return Jwts.parser()
                .verifyWith(signingKey)
                .build()
                .parseSignedClaims(token)
                .getPayload();
        } catch (ExpiredJwtException ex) {
            throw new JwtAuthException("Token expirado", ex);
        } catch (JwtException | IllegalArgumentException ex) {
            throw new JwtAuthException("Token inválido", ex);
        }
    }

    public UUID extractUserId(String token) {
        return UUID.fromString(parseClaims(token).getSubject());
    }

    public Rol extractRol(String token) {
        return Rol.fromDb(parseClaims(token).get("rol", String.class));
    }
}
