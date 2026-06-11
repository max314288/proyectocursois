package com.comidaalpaso.api.adapter.menu.model;

import java.math.BigDecimal;
import java.util.UUID;

/** Fila del resultado de sp_listar_items_completo. */
public class ItemListadoRow {
    private UUID id;
    private String nombre;
    private String categoria;
    private String descripcion;
    private BigDecimal precio;
    private BigDecimal pesoGramos;
    private String informacionNutricional;
    private Short esMenuCompuesto;
    private Short esArmaPlato;
    private Short disponible;
    private String imagenUrl;

    public ItemListadoRow() { }

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

    public Short getEsMenuCompuesto() { return esMenuCompuesto; }
    public void setEsMenuCompuesto(Short esMenuCompuesto) { this.esMenuCompuesto = esMenuCompuesto; }

    public Short getEsArmaPlato() { return esArmaPlato; }
    public void setEsArmaPlato(Short esArmaPlato) { this.esArmaPlato = esArmaPlato; }

    public Short getDisponible() { return disponible; }
    public void setDisponible(Short disponible) { this.disponible = disponible; }

    public boolean isDisponible() { return disponible != null && disponible == 1; }

    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
}
