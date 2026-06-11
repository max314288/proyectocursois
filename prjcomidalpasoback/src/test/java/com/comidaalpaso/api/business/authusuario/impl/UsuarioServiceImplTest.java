package com.comidaalpaso.api.business.authusuario.impl;

import com.comidaalpaso.api.adapter.authusuario.UsuarioDAO;
import com.comidaalpaso.api.adapter.authusuario.model.Rol;
import com.comidaalpaso.api.shared.exception.InvalidCredentialsException;
import com.comidaalpaso.api.shared.exception.ResourceNotFoundException;
import com.comidaalpaso.api.resource.authusuario.model.CambiarPasswordRequest;
import com.comidaalpaso.api.resource.authusuario.model.UpdateUsuarioRequest;
import com.comidaalpaso.api.resource.authusuario.model.UsuarioDTO;
import com.comidaalpaso.api.adapter.authusuario.model.Usuario;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@DisplayName("UsuarioServiceImpl")
@ExtendWith(MockitoExtension.class)
class UsuarioServiceImplTest {

    @Mock private UsuarioDAO dao;
    @Mock private PasswordEncoder encoder;

    @InjectMocks private UsuarioServiceImpl service;

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
        u.setRol("cliente");
        u.setPasswordHash("hash-actual");
        u.setActivo((short) 1);
        u.setCreatedAt(LocalDate.now());
    }

    // ─── listar ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("listar(null) delega al DAO y mapea a DTOs")
    void listarMapeaDTOs() {
        when(dao.listar(null)).thenReturn(List.of(u));
        List<UsuarioDTO> out = service.listar(null);
        assertThat(out).hasSize(1);
        assertThat(out.get(0).getEmail()).isEqualTo("juan@test.com");
    }

    // ─── obtener ───────────────────────────────────────────────────────────────

    @Test
    @DisplayName("obtener() devuelve DTO cuando existe")
    void obtenerOk() {
        when(dao.findById(uid)).thenReturn(Optional.of(u));
        assertThat(service.obtener(uid).getEmail()).isEqualTo("juan@test.com");
    }

    @Test
    @DisplayName("obtener() lanza ResourceNotFoundException cuando no existe")
    void obtenerInexistente() {
        when(dao.findById(uid)).thenReturn(Optional.empty());
        assertThatThrownBy(() -> service.obtener(uid))
            .isInstanceOf(ResourceNotFoundException.class);
    }

    // ─── actualizar ────────────────────────────────────────────────────────────

    @Test
    @DisplayName("actualizar() delega al DAO y devuelve el usuario actualizado")
    void actualizarOk() {
        UpdateUsuarioRequest req = new UpdateUsuarioRequest();
        req.setNombre("Nuevo");
        req.setApellido("Apellido");
        req.setEmail("nuevo@test.com");

        Usuario actualizado = new Usuario();
        actualizado.setId(uid);
        actualizado.setNombre("Nuevo");
        actualizado.setApellido("Apellido");
        actualizado.setEmail("nuevo@test.com");
        actualizado.setRol("cliente");
        actualizado.setActivo((short) 1);
        actualizado.setCreatedAt(LocalDate.now());

        when(dao.findById(uid)).thenReturn(Optional.of(actualizado));

        UsuarioDTO dto = service.actualizar(uid, req);
        verify(dao).actualizar(uid, "Nuevo", "Apellido", "nuevo@test.com");
        assertThat(dto.getNombre()).isEqualTo("Nuevo");
    }

    // ─── cambiarPassword ───────────────────────────────────────────────────────

    @Test
    @DisplayName("cambiarPassword() como admin omite la verificación de password actual")
    void cambiarPasswordAdminOmiteCheck() {
        CambiarPasswordRequest req = new CambiarPasswordRequest();
        req.setPasswordNuevo("nueva-pass-1234");
        when(encoder.encode("nueva-pass-1234")).thenReturn("nuevo-hash");

        service.cambiarPassword(uid, req, true);
        verify(dao).cambiarPassword(uid, "nuevo-hash");
    }

    @Test
    @DisplayName("cambiarPassword() como dueño con password actual correcto delega al DAO")
    void cambiarPasswordOwnerOk() {
        CambiarPasswordRequest req = new CambiarPasswordRequest();
        req.setPasswordActual("actual");
        req.setPasswordNuevo("nueva-pass-1234");

        when(dao.findById(uid)).thenReturn(Optional.of(u));
        when(dao.findByEmail(u.getEmail())).thenReturn(Optional.of(u));
        when(encoder.matches("actual", "hash-actual")).thenReturn(true);
        when(encoder.encode("nueva-pass-1234")).thenReturn("nuevo-hash");

        service.cambiarPassword(uid, req, false);
        verify(dao).cambiarPassword(uid, "nuevo-hash");
    }

    @Test
    @DisplayName("cambiarPassword() como dueño con password actual incorrecta lanza InvalidCredentials")
    void cambiarPasswordOwnerWrong() {
        CambiarPasswordRequest req = new CambiarPasswordRequest();
        req.setPasswordActual("wrong");
        req.setPasswordNuevo("nueva-pass-1234");

        when(dao.findById(uid)).thenReturn(Optional.of(u));
        when(dao.findByEmail(u.getEmail())).thenReturn(Optional.of(u));
        when(encoder.matches("wrong", "hash-actual")).thenReturn(false);

        assertThatThrownBy(() -> service.cambiarPassword(uid, req, false))
            .isInstanceOf(InvalidCredentialsException.class);
    }

    // ─── toggle ────────────────────────────────────────────────────────────────

    @Test
    @DisplayName("toggle() delega al DAO con el flag correspondiente")
    void toggleDelegaAlDAO() {
        service.toggle(uid, false);
        verify(dao).toggleActivo(eq(uid), eq(false));
    }
}
