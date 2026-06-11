package com.comidaalpaso.api.adapter.menu.model;

import java.math.BigDecimal;
import java.util.UUID;

/** Fila del resultado de sp_listar_opciones_arma_plato. */
public class OpcionArmaPlatoRow {
    private String tipo;
    private UUID itemId;
    private String nombre;
    private BigDecimal precioExtra;
    private Short disponible;

    public OpcionArmaPlatoRow() { }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }

    public UUID getItemId() { return itemId; }
    public void setItemId(UUID itemId) { this.itemId = itemId; }

    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }

    public BigDecimal getPrecioExtra() { return precioExtra; }
    public void setPrecioExtra(BigDecimal precioExtra) { this.precioExtra = precioExtra; }

    public Short getDisponible() { return disponible; }
    public void setDisponible(Short disponible) { this.disponible = disponible; }

    public boolean isDisponible() { return disponible != null && disponible == 1; }
}
