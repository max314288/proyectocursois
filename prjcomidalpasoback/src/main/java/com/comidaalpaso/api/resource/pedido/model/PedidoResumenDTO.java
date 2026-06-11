package com.comidaalpaso.api.resource.pedido.model;

import com.comidaalpaso.api.adapter.pedido.model.PedidoResumenRow;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class PedidoResumenDTO {
    private UUID id;
    private String contraparte;
    private String modo;
    private String estado;
    private BigDecimal total;
    private String codigoQr;
    private LocalDate createdAt;

    public PedidoResumenDTO() { }

    public static PedidoResumenDTO from(PedidoResumenRow r) {
        PedidoResumenDTO dto = new PedidoResumenDTO();
        dto.setId(r.getId());
        dto.setContraparte(r.getContraparte());
        dto.setModo(r.getModo());
        dto.setEstado(r.getEstado());
        dto.setTotal(r.getTotal());
        dto.setCodigoQr(r.getCodigoQr());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }

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
