package com.comidaalpaso.api.adapter.authusuario.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.UUID;

/**
 * Entidad JPA que mapea la tabla {@code usuarios} en SQL Server.
 *
 * <p>Esquema fuente: {@code L:/Documentos/Proyectos/prjcomidaalpaso/sql_usuario.sql}.
 *
 * <p>Notas de diseño:
 * <ul>
 *   <li>{@code id} es {@code UNIQUEIDENTIFIER} (UUID) generado por la BD con {@code NEWID()}.
 *       JPA no lo asigna automáticamente — lo genera el SP {@code sp_crear_usuario}.</li>
 *   <li>{@code rol} se almacena como String (no enum) porque el check constraint usa
 *       minúsculas y la conversión a/desde {@code Rol} se hace en service/DAO.</li>
 *   <li>{@code activo} es {@code TINYINT} (0/1) — usamos {@code Short} en Java.</li>
 *   <li>{@code created_at} y {@code updated_at} son {@code DATE} (sin hora).</li>
 * </ul>
 *
 * <p>SOLID-S: representa únicamente el estado de la entidad — sin lógica de negocio.
 */
@Entity
@Table(name = "usuarios")
public class Usuario {

    @Id
    @Column(name = "id", columnDefinition = "UNIQUEIDENTIFIER", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "nombre", nullable = false, length = 100)
    private String nombre;

    @Column(name = "apellido", nullable = false, length = 100)
    private String apellido;

    @Column(name = "email", nullable = false, unique = true, length = 255)
    private String email;

    @Column(name = "password_hash", nullable = false, length = 255)
    private String passwordHash;

    @Column(name = "rol", nullable = false, length = 30)
    private String rol;

    @Column(name = "activo", nullable = false)
    private Short activo;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDate createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDate updatedAt;

    // ─── Constructores ─────────────────────────────────────────────────────
    public Usuario() { }

    // ─── Getters / Setters ─────────────────────────────────────────────────
    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getApellido() { return apellido; }
    public void setApellido(String apellido) { this.apellido = apellido; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getPasswordHash() { return passwordHash; }
    public void setPasswordHash(String passwordHash) { this.passwordHash = passwordHash; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public Short getActivo() { return activo; }
    public void setActivo(Short activo) { this.activo = activo; }

    public boolean isActivo() { return activo != null && activo == 1; }

    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

    public LocalDate getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }
}
