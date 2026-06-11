package com.comidaalpaso.api.resource.menu.model;

import com.comidaalpaso.api.adapter.menu.model.ComponenteMenuRow;

import java.math.BigDecimal;
import java.util.UUID;

public class ComponenteMenuDTO {
    private UUID itemId;
    private String nombre;
    private String categoria;
    private String rol;
    private boolean obligatorio;
    private BigDecimal precio;
    private int orden;

    public ComponenteMenuDTO() { }

    public static ComponenteMenuDTO from(ComponenteMenuRow r) {
        ComponenteMenuDTO dto = new ComponenteMenuDTO();
        dto.setItemId(r.getItemId());
        dto.setNombre(r.getNombre());
        dto.setCategoria(r.getCategoria());
        dto.setRol(r.getRol());
        dto.setObligatorio(r.isObligatorio());
        dto.setPrecio(r.getPrecio());
        dto.setOrden(r.getOrden() != null ? r.getOrden() : 0);
        return dto;
    }

    public UUID getItemId() { return itemId; }
    public void setItemId(UUID itemId) { this.itemId = itemId; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public boolean isObligatorio() { return obligatorio; }
    public void setObligatorio(boolean obligatorio) { this.obligatorio = obligatorio; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public int getOrden() { return orden; }
    public void setOrden(int orden) { this.orden = orden; }
}
