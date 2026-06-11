package com.comidaalpaso.api.adapter.pedido.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/** Fila plana del resultado de sp_obtener_pedido (una fila por ítem del pedido). */
public class PedidoDetalleRow {
    private UUID pedidoId;
    private String cliente;
    private String restaurante;
    private String modo;
    private String estado;
    private BigDecimal subtotal;
    private BigDecimal costoDelivery;
    private BigDecimal total;
    private String codigoQr;
    private String notas;
    private LocalDate createdAt;
    private String itemNombre;
    private Integer cantidad;
    private BigDecimal precioUnitario;
    private String notasItem;

    public PedidoDetalleRow() { }

    public UUID getPedidoId() { return pedidoId; }
    public void setPedidoId(UUID pedidoId) { this.pedidoId = pedidoId; }

    public String getCliente() { return cliente; }
    public void setCliente(String cliente) { this.cliente = cliente; }

    public String getRestaurante() { return restaurante; }
    public void setRestaurante(String restaurante) { this.restaurante = restaurante; }

    public String getModo() { return modo; }
    public void setModo(String modo) { this.modo = modo; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public BigDecimal getSubtotal() { return subtotal; }
    public void setSubtotal(BigDecimal subtotal) { this.subtotal = subtotal; }

    public BigDecimal getCostoDelivery() { return costoDelivery; }
    public void setCostoDelivery(BigDecimal costoDelivery) { this.costoDelivery = costoDelivery; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getCodigoQr() { return codigoQr; }
    public void setCodigoQr(String codigoQr) { this.codigoQr = codigoQr; }

    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }

    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

    public String getItemNombre() { return itemNombre; }
    public void setItemNombre(String itemNombre) { this.itemNombre = itemNombre; }

    public Integer getCantidad() { return cantidad; }
    public void setCantidad(Integer cantidad) { this.cantidad = cantidad; }

    public BigDecimal getPrecioUnitario() { return precioUnitario; }
    public void setPrecioUnitario(BigDecimal precioUnitario) { this.precioUnitario = precioUnitario; }

    public String getNotasItem() { return notasItem; }
    public void setNotasItem(String notasItem) { this.notasItem = notasItem; }
}
