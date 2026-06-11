package com.comidaalpaso.api.resource.menu.model;

import com.comidaalpaso.api.adapter.menu.model.OpcionArmaPlatoRow;

import java.math.BigDecimal;
import java.util.UUID;

public class OpcionArmaPlatoDTO {
    private String tipo;
    private UUID itemId;
    private String nombre;
    private BigDecimal precioExtra;
    private boolean disponible;

    public OpcionArmaPlatoDTO() { }

    public static OpcionArmaPlatoDTO from(OpcionArmaPlatoRow r) {
        OpcionArmaPlatoDTO dto = new OpcionArmaPlatoDTO();
        dto.setTipo(r.getTipo());
        dto.setItemId(r.getItemId());
        dto.setNombre(r.getNombre());
        dto.setPrecioExtra(r.getPrecioExtra());
        dto.setDisponible(r.isDisponible());
        return dto;
    }

    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public UUID getItemId() { return itemId; }
    public void setItemId(UUID itemId) { this.itemId = itemId; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public BigDecimal getPrecioExtra() { return precioExtra; }
    public void setPrecioExtra(BigDecimal precioExtra) { this.precioExtra = precioExtra; }
    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }
}
