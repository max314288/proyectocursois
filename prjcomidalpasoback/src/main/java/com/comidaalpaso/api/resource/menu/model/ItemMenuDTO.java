package com.comidaalpaso.api.resource.menu.model;

import com.comidaalpaso.api.adapter.menu.model.ItemListadoRow;

import java.math.BigDecimal;
import java.util.UUID;

public class ItemMenuDTO {
    private UUID id;
    private String nombre;
    private String categoria;
    private String descripcion;
    private BigDecimal precio;
    private BigDecimal pesoGramos;
    private String informacionNutricional;
    private boolean esMenuCompuesto;
    private boolean esArmaPlato;
    private boolean disponible;
    private String imagenUrl;

    public ItemMenuDTO() { }

    public static ItemMenuDTO from(ItemListadoRow r) {
        ItemMenuDTO dto = new ItemMenuDTO();
        dto.setId(r.getId());
        dto.setNombre(r.getNombre());
        dto.setCategoria(r.getCategoria());
        dto.setDescripcion(r.getDescripcion());
        dto.setPrecio(r.getPrecio());
        dto.setPesoGramos(r.getPesoGramos());
        dto.setInformacionNutricional(r.getInformacionNutricional());
        dto.setEsMenuCompuesto(r.getEsMenuCompuesto() != null && r.getEsMenuCompuesto() == 1);
        dto.setEsArmaPlato(r.getEsArmaPlato() != null && r.getEsArmaPlato() == 1);
        dto.setDisponible(r.isDisponible());
        dto.setImagenUrl(r.getImagenUrl());
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public BigDecimal getPesoGramos() { return pesoGramos; }
    public void setPesoGramos(BigDecimal pesoGramos) { this.pesoGramos = pesoGramos; }
    public String getInformacionNutricional() { return informacionNutricional; }
    public void setInformacionNutricional(String v) { this.informacionNutricional = v; }
    public boolean isEsMenuCompuesto() { return esMenuCompuesto; }
    public void setEsMenuCompuesto(boolean esMenuCompuesto) { this.esMenuCompuesto = esMenuCompuesto; }
    public boolean isEsArmaPlato() { return esArmaPlato; }
    public void setEsArmaPlato(boolean esArmaPlato) { this.esArmaPlato = esArmaPlato; }
    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
}
