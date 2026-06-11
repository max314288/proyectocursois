package com.comidaalpaso.api.resource.restaurante.model;

import com.comidaalpaso.api.adapter.restaurante.model.Restaurante;

import java.util.UUID;

public class RestauranteDTO {
    private UUID id;
    private String nombre;
    private String direccion;
    private String telefono;
    private boolean aceptaRecojo;
    private boolean aceptaDelivery;
    private boolean aceptaSalon;
    private boolean activo;

    public RestauranteDTO() { }

    public RestauranteDTO(UUID id, String nombre, String direccion, String telefono,
                          boolean aceptaRecojo, boolean aceptaDelivery, boolean aceptaSalon, boolean activo) {
        this.id = id;
        this.nombre = nombre;
        this.direccion = direccion;
        this.telefono = telefono;
        this.aceptaRecojo = aceptaRecojo;
        this.aceptaDelivery = aceptaDelivery;
        this.aceptaSalon = aceptaSalon;
        this.activo = activo;
    }

    public static RestauranteDTO from(Restaurante r) {
        return new RestauranteDTO(
            r.getId(), r.getNombre(), r.getDireccion(), r.getTelefono(),
            r.getAceptaRecojo() != null && r.getAceptaRecojo() == 1,
            r.getAceptaDelivery() != null && r.getAceptaDelivery() == 1,
            r.getAceptaSalon() != null && r.getAceptaSalon() == 1,
            r.isActivo()
        );
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getTelefono() { return telefono; }
    public void setTelefono(String telefono) { this.telefono = telefono; }
    public boolean isAceptaRecojo() { return aceptaRecojo; }
    public void setAceptaRecojo(boolean aceptaRecojo) { this.aceptaRecojo = aceptaRecojo; }
    public boolean isAceptaDelivery() { return aceptaDelivery; }
    public void setAceptaDelivery(boolean aceptaDelivery) { this.aceptaDelivery = aceptaDelivery; }
    public boolean isAceptaSalon() { return aceptaSalon; }
    public void setAceptaSalon(boolean aceptaSalon) { this.aceptaSalon = aceptaSalon; }
    public boolean isActivo() { return activo; }
    public void setActivo(boolean activo) { this.activo = activo; }
}
