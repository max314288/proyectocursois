package com.comidaalpaso.api.adapter.pedido.model;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

/** Fila de listado de pedidos — compartida por sp_listar_pedidos_restaurante y sp_listar_pedidos_cliente. */
public class PedidoResumenRow {
    private UUID id;
    /** Nombre del cliente (cuando se lista por restaurante) o nombre del restaurante (cuando se lista por cliente). */
    private String contraparte;
    private String modo;
    private String estado;
    private BigDecimal total;
    private String codigoQr;   // solo en sp_listar_pedidos_cliente
    private LocalDate createdAt;

    public PedidoResumenRow() { }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public String getContraparte() { return contraparte; }
    public void setContraparte(String contraparte) { this.contraparte = contraparte; }

    public String getModo() { return modo; }
    public void setModo(String modo) { this.modo = modo; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public BigDecimal getTotal() { return total; }
    public void setTotal(BigDecimal total) { this.total = total; }

    public String getCodigoQr() { return codigoQr; }
    public void setCodigoQr(String codigoQr) { this.codigoQr = codigoQr; }

    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
