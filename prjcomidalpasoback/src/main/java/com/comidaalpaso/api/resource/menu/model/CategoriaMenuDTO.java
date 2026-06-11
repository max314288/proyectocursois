package com.comidaalpaso.api.resource.menu.model;

import com.comidaalpaso.api.adapter.menu.model.CategoriaMenu;

import java.util.UUID;

public class CategoriaMenuDTO {
    private UUID id;
    private String codigo;
    private String nombre;
    private String descripcion;
    private int orden;

    public CategoriaMenuDTO() { }

    public static CategoriaMenuDTO from(CategoriaMenu c) {
        CategoriaMenuDTO dto = new CategoriaMenuDTO();
        dto.setId(c.getId());
        dto.setCodigo(c.getCodigo());
        dto.setNombre(c.getNombre());
        dto.setDescripcion(c.getDescripcion());
        dto.setOrden(c.getOrden() != null ? c.getOrden() : 0);
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public int getOrden() { return orden; }
    public void setOrden(int orden) { this.orden = orden; }
}
