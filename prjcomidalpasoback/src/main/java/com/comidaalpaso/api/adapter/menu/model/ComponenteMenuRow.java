package com.comidaalpaso.api.adapter.menu.model;

import java.math.BigDecimal;
import java.util.UUID;

/** Fila del resultado de sp_listar_componentes_menu. */
public class ComponenteMenuRow {
    private UUID itemId;
    private String nombre;
    private String categoria;
    private String rol;
    private Short obligatorio;
    private BigDecimal precio;
    private Integer orden;

    public ComponenteMenuRow() { }

    public UUID getItemId() { return itemId; }
    public void setItemId(UUID itemId) { this.itemId = itemId; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }

    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }

    public Short getObligatorio() { return obligatorio; }
    public void setObligatorio(Short obligatorio) { this.obligatorio = obligatorio; }

    public boolean isObligatorio() { return obligatorio != null && obligatorio == 1; }

    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }

    public Integer getOrden() { return orden; }
    public void setOrden(Integer orden) { this.orden = orden; }
}
