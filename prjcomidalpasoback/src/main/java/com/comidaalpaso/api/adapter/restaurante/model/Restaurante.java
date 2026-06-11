package com.comidaalpaso.api.adapter.restaurante.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "restaurantes")
public class Restaurante {

    @Id
    @Column(name = "id", columnDefinition = "UNIQUEIDENTIFIER", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "usuario_id", nullable = false, columnDefinition = "UNIQUEIDENTIFIER")
    private UUID usuarioId;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column(name = "direccion", nullable = false, length = 500)
    private String direccion;

    @Column(name = "telefono", length = 30)
    private String telefono;

    @Column(name = "logo_url", length = 500)
    private String logoUrl;

    @Column(name = "acepta_recojo", nullable = false)
    private Short aceptaRecojo;

    @Column(name = "acepta_delivery", nullable = false)
    private Short aceptaDelivery;

    @Column(name = "acepta_salon", nullable = false)
    private Short aceptaSalon;

    @Column(name = "activo", nullable = false)
    private Short activo;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDate createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDate updatedAt;

    public Restaurante() { }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getUsuarioId() { return usuarioId; }
    public void setUsuarioId(UUID usuarioId) { this.usuarioId = usuarioId; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }

    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }

    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }

    public Short getAceptaRecojo() { return aceptaRecojo; }
    public void setAceptaRecojo(Short aceptaRecojo) { this.aceptaRecojo = aceptaRecojo; }

    public Short getAceptaDelivery() { return aceptaDelivery; }
    public void setAceptaDelivery(Short aceptaDelivery) { this.aceptaDelivery = aceptaDelivery; }

    public Short getAceptaSalon() { return aceptaSalon; }
    public void setAceptaSalon(Short aceptaSalon) { this.aceptaSalon = aceptaSalon; }

    public Short getActivo() { return activo; }
    public void setActivo(Short activo) { this.activo = activo; }

    public boolean isActivo() { return activo != null && activo == 1; }

    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

    public LocalDate getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }
}
