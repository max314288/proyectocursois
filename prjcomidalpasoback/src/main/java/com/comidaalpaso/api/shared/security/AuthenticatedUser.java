package com.comidaalpaso.api.shared.security;

import com.comidaalpaso.api.adapter.authusuario.model.Rol;
import com.comidaalpaso.api.adapter.authusuario.model.Usuario;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;
import java.util.UUID;

/**
 * Adapter que envuelve {@link Usuario} en un {@link UserDetails} de Spring Security.
 *
 * <p><strong>SOLID-I (Interface Segregation):</strong> Spring Security NO accede
 * directamente a la entity {@code Usuario} — solo a esta vista mínima.
 *
 * <p>Los authorities se exponen con el prefijo {@code ROLE_} (convención Spring)
 * en MAYÚSCULA, mientras que el rol en BD se mantiene en minúscula.
 */
public class AuthenticatedUser implements UserDetails {

    private final Usuario usuario;

    public AuthenticatedUser(Usuario usuario) {
        this.usuario = usuario;
    }

    public UUID getId()       { return usuario.getId(); }
    public Rol getRol()       { return Rol.fromDb(usuario.getRol()); }
    public Usuario getUsuario() { return usuario; }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        // Convención Spring: ROLE_ADMIN, ROLE_CLIENTE, ROLE_RESTAURANTE, ROLE_REPARTIDOR
        return List.of(new SimpleGrantedAuthority("ROLE_" + getRol().name()));
    }

    @Override
    public String getPassword() { return usuario.getPasswordHash(); }

    @Override
    public String getUsername() { return usuario.getEmail(); }

    @Override
    public boolean isAccountNonExpired()     { return true; }

    @Override
    public boolean isAccountNonLocked()      { return true; }

    @Override
    public boolean isCredentialsNonExpired() { return true; }

    @Override
    public boolean isEnabled() { return usuario.isActivo(); }
}
