package com.comidaalpaso.api.resource.pedido.model;

import com.comidaalpaso.api.adapter.pedido.model.HistorialEstadoRow;

import java.time.LocalDate;

public class HistorialEstadoDTO {
    private String estado;
    private String cambiadoPor;
    private LocalDate createdAt;

    public HistorialEstadoDTO() { }

    public static HistorialEstadoDTO from(HistorialEstadoRow r) {
        HistorialEstadoDTO dto = new HistorialEstadoDTO();
        dto.setEstado(r.getEstado());
        dto.setCambiadoPor(r.getCambiadoPor());
        dto.setCreatedAt(r.getCreatedAt());
        return dto;
    }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
    public String getCambiadoPor() { return cambiadoPor; }
    public void setCambiadoPor(String cambiadoPor) { this.cambiadoPor = cambiadoPor; }
    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
