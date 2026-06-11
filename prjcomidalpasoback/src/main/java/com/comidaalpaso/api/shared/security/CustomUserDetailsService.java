package com.comidaalpaso.api.shared.security;

import com.comidaalpaso.api.adapter.authusuario.UsuarioDAO;
import com.comidaalpaso.api.adapter.authusuario.model.Usuario;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

/**
 * Carga {@link UserDetails} (envuelto en {@link AuthenticatedUser}) usando el
 * {@link UsuarioDAO}.
 *
 * <p><strong>SOLID-D:</strong> depende de {@code UsuarioDAO}, no del
 * {@code UsuarioRepository} directamente.
 */
@Service
public class CustomUserDetailsService implements UserDetailsService {

    private final UsuarioDAO usuarioDAO;

    public CustomUserDetailsService(UsuarioDAO usuarioDAO) {
        this.usuarioDAO = usuarioDAO;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        Usuario u = usuarioDAO.findByEmail(email)
            .orElseThrow(() -> new UsernameNotFoundException("Usuario no encontrado: " + email));
        return new AuthenticatedUser(u);
    }
}
