package com.comidaalpaso.api.resource.pedido.model;

import java.math.BigDecimal;

public class ItemDetallePedidoDTO {
    private String itemNombre;
    private int cantidad;
    private BigDecimal precioUnitario;
    private String notasItem;

    public ItemDetallePedidoDTO() { }

    public String getItemNombre() { return itemNombre; }
    public void setItemNombre(String itemNombre) { this.itemNombre = itemNombre; }
    public int getCantidad() { return cantidad; }
    public void setCantidad(int cantidad) { this.cantidad = cantidad; }
    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }
    public String getNotasItem() { return notasItem; }
    public void setNotasItem(String notasItem) { this.notasItem = notasItem; }
}
