package com.comidaalpaso.api.adapter.pedido.model;

import java.time.LocalDate;

/** Fila del resultado de sp_historial_pedido. */
public class HistorialEstadoRow {
    private String estado;
    private String cambiadoPor;
    private LocalDate createdAt;

    public HistorialEstadoRow() { }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }

    public String getCambiadoPor() { return cambiadoPor; }
    public void setCambiadoPor(String cambiadoPor) { this.cambiadoPor = cambiadoPor; }

    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }
}
