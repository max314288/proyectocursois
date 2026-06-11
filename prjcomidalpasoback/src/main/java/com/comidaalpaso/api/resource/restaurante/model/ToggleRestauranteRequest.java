package com.comidaalpaso.api.resource.restaurante.model;

import jakarta.validation.constraints.NotNull;

public class ToggleRestauranteRequest {

    @NotNull(message = "El campo 'activo' es obligatorio")
    private Boolean activo;

    public Boolean getActivo() { return activo; }
    public void setActivo(Boolean activo) { this.activo = activo; }
}
