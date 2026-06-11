package com.comidaalpaso.api.resource.pedido.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

public class PedidoDetalleDTO {
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
    private List<ItemDetallePedidoDTO> items;

    public PedidoDetalleDTO() { }

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
    public List<ItemDetallePedidoDTO> getItems() { return items; }
    public void setItems(List<ItemDetallePedidoDTO> items) { this.items = items; }
}
