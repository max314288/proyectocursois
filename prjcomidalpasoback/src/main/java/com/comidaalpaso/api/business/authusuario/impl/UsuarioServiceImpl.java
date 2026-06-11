package com.comidaalpaso.api.business.authusuario.impl;

import com.comidaalpaso.api.adapter.authusuario.UsuarioDAO;
import com.comidaalpaso.api.adapter.authusuario.model.Rol;
import com.comidaalpaso.api.shared.exception.InvalidCredentialsException;
import com.comidaalpaso.api.shared.exception.ResourceNotFoundException;
import com.comidaalpaso.api.resource.authusuario.model.CambiarPasswordRequest;
import com.comidaalpaso.api.resource.authusuario.model.UpdateUsuarioRequest;
import com.comidaalpaso.api.resource.authusuario.model.UsuarioDTO;
import com.comidaalpaso.api.adapter.authusuario.model.Usuario;
import com.comidaalpaso.api.business.authusuario.UsuarioService;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

/**
 * Implementación del {@link UsuarioService}.
 *
 * <p>SOLID-D: depende del DAO + PasswordEncoder. Mockeable sin Spring.
 * SOLID-S: única responsabilidad — reglas de negocio sobre usuarios.
 */
@Service
public class UsuarioServiceImpl implements UsuarioService {

    private final UsuarioDAO dao;
    private final PasswordEncoder encoder;

    public UsuarioServiceImpl(UsuarioDAO dao, PasswordEncoder encoder) {
        this.dao = dao;
        this.encoder = encoder;
    }

    @Override
    public List<UsuarioDTO> listar(Rol rolFiltro) {
        return dao.listar(rolFiltro).stream()
            .map(UsuarioDTO::from)
            .toList();
    }

    @Override
    public UsuarioDTO obtener(UUID id) {
        return dao.findById(id)
            .map(UsuarioDTO::from)
            .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
    }

    @Override
    public UsuarioDTO actualizar(UUID id, UpdateUsuarioRequest req) {
        dao.actualizar(id, req.getNombre(), req.getApellido(), req.getEmail());
        return obtener(id);
    }

    @Override
    public void cambiarPassword(UUID id, CambiarPasswordRequest req, boolean esAdmin) {
        if (!esAdmin) {
            // Verificación de password actual solo aplica cuando el dueño cambia su propia password
            Usuario actual = dao.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
            // Re-leemos con findByEmail para tener password_hash (findById no lo trae)
            Usuario withHash = dao.findByEmail(actual.getEmail())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado: " + id));
            if (req.getPasswordActual() == null
                || !encoder.matches(req.getPasswordActual(), withHash.getPasswordHash())) {
                throw new InvalidCredentialsException("La contraseña actual es incorrecta");
            }
        }
        dao.cambiarPassword(id, encoder.encode(req.getPasswordNuevo()));
    }

    @Override
    public void toggle(UUID id, boolean activo) {
        dao.toggleActivo(id, activo);
    }
}
