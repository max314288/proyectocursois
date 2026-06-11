package com.comidaalpaso.api.shared.security;

import com.comidaalpaso.api.adapter.authusuario.UsuarioDAO;
import com.comidaalpaso.api.shared.exception.JwtAuthException;
import com.comidaalpaso.api.adapter.authusuario.model.Usuario;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.UUID;

/**
 * Filtro de Spring Security que extrae el JWT del header {@code Authorization}
 * y popula el {@link SecurityContextHolder} con un {@link AuthenticatedUser}.
 *
 * <p>Endpoints públicos (login/register) lo ignoran porque {@link SecurityConfig}
 * los permite sin autenticación.
 */
@Component
public class JwtAuthFilter extends OncePerRequestFilter {

    private static final String AUTH_HEADER = "Authorization";
    private static final String BEARER      = "Bearer ";

    private final JwtTokenProvider tokenProvider;
    private final UsuarioDAO usuarioDAO;

    public JwtAuthFilter(JwtTokenProvider tokenProvider, UsuarioDAO usuarioDAO) {
        this.tokenProvider = tokenProvider;
        this.usuarioDAO = usuarioDAO;
    }

    @Override
    protected void doFilterInternal(HttpServletRequest req, HttpServletResponse res,
                                    FilterChain chain) throws ServletException, IOException {
        String token = extractToken(req);
        if (token != null && SecurityContextHolder.getContext().getAuthentication() == null) {
            try {
                UUID userId = tokenProvider.extractUserId(token);
                Usuario u = usuarioDAO.findById(userId)
                    .orElseThrow(() -> new JwtAuthException("Usuario del token ya no existe"));
                if (!u.isActivo()) {
                    throw new JwtAuthException("La cuenta está desactivada");
                }
                AuthenticatedUser principal = new AuthenticatedUser(u);
                UsernamePasswordAuthenticationToken auth =
                    new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
                auth.setDetails(new WebAuthenticationDetailsSource().buildDetails(req));
                SecurityContextHolder.getContext().setAuthentication(auth);
            } catch (JwtAuthException ex) {
                SecurityContextHolder.clearContext();
                // Dejamos pasar — el endpoint protegido respondera 400 vía SecurityConfig
            }
        }
        chain.doFilter(req, res);
    }

    private String extractToken(HttpServletRequest req) {
        String header = req.getHeader(AUTH_HEADER);
        if (header != null && header.startsWith(BEARER)) {
            return header.substring(BEARER.length());
        }
        return null;
    }
}
