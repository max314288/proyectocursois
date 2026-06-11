package com.comidaalpaso.api.resource.menu.model;

import jakarta.validation.constraints.NotNull;

public class ToggleItemMenuRequest {

    @NotNull(message = "El campo 'disponible' es obligatorio")
    private Boolean disponible;

    public Boolean getDisponible() { return disponible; }
    public void setDisponible(Boolean disponible) { this.disponible = disponible; }
}
