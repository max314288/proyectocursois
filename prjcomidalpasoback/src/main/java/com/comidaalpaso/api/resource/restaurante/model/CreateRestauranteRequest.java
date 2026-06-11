package com.comidaalpaso.api.resource.restaurante.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class CreateRestauranteRequest {

    @NotNull(message = "El usuarioId es obligatorio")
    private UUID usuarioId;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150)
    private String nombre;

    @NotBlank(message = "La dirección es obligatoria")
    @Size(max = 500)
    private String direccion;

    @Size(max = 30)
    private String telefono;

    @Size(max = 500)
    private String logoUrl;

    private boolean aceptaRecojo = true;
    private boolean aceptaDelivery = false;
    private boolean aceptaSalon = false;

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
    public boolean isAceptaRecojo() { return aceptaRecojo; }
    public void setAceptaRecojo(boolean aceptaRecojo) { this.aceptaRecojo = aceptaRecojo; }
    public boolean isAceptaDelivery() { return aceptaDelivery; }
    public void setAceptaDelivery(boolean aceptaDelivery) { this.aceptaDelivery = aceptaDelivery; }
    public boolean isAceptaSalon() { return aceptaSalon; }
    public void setAceptaSalon(boolean aceptaSalon) { this.aceptaSalon = aceptaSalon; }
}
