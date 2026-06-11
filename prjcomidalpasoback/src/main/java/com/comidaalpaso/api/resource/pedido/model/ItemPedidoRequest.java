package com.comidaalpaso.api.resource.pedido.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class ItemPedidoRequest {

    @NotNull(message = "El itemMenuId es obligatorio")
    private UUID itemMenuId;

    @NotNull(message = "La cantidad es obligatoria")
    @Min(value = 1, message = "La cantidad debe ser mayor a 0")
    private Integer cantidad;

    private String notasItem;

    public UUID getItemMenuId() { return itemMenuId; }
    public void setItemMenuId(UUID itemMenuId) { this.itemMenuId = itemMenuId; }
    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }
    public String getNotasItem() { return notasItem; }
    public void setNotasItem(String notasItem) { this.notasItem = notasItem; }
}
