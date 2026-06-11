package com.comidaalpaso.api.resource.pago.model;

import com.comidaalpaso.api.adapter.pago.model.Pago;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public class PagoDTO {
    private UUID id;
    private UUID pedidoId;
    private BigDecimal monto;
    private String metodo;
    private String estado;
    private String referenciaExterna;
    private LocalDate createdAt;

    public PagoDTO() { }

    public static PagoDTO from(Pago p) {
        PagoDTO dto = new PagoDTO();
        dto.setId(p.getId());
        dto.setPedidoId(p.getPedidoId());
        dto.setMonto(p.getMonto());
        dto.setMetodo(p.getMetodo());
        dto.setEstado(p.getEstado());
        dto.setReferenciaExterna(p.getReferenciaExterna());
        dto.setCreatedAt(p.getCreatedAt());
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public UUID getPedidoId() { return pedidoId; }
    public void setPedidoId(UUID pedidoId) { this.pedidoId = pedidoId; }
    public BigDecimal getMonto() { return monto; }
    public void setMonto(BigDecimal monto) { this.monto = monto; }
    public String getMetodo() { return metodo; }
    public void setMetodo(String metodo) { this.metodo = metodo; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getReferenciaExterna() { return referenciaExterna; }
    public void setReferenciaExterna(String referenciaExterna) { this.referenciaExterna = referenciaExterna; }
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
