package com.comidaalpaso.api.resource.pedido.model;

import jakarta.validation.constraints.NotNull;

import java.util.UUID;

public class AsignarRepartidorRequest {

    @NotNull(message = "El repartidorId es obligatorio")
    private UUID repartidorId;

    public UUID getRepartidorId() { return repartidorId; }
    public void setRepartidorId(UUID repartidorId) { this.repartidorId = repartidorId; }
}
