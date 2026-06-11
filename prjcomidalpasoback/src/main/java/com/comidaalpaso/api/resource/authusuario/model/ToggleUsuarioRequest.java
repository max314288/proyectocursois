package com.comidaalpaso.api.resource.authusuario.model;

import jakarta.validation.constraints.NotNull;

/**
 * DTO de entrada para {@code PATCH /api/usuarios/{id}/toggle} — invoca
 * {@code sp_toggle_usuario}.
 */
public class ToggleUsuarioRequest {

    @NotNull(message = "El campo 'activo' es obligatorio")
    private Boolean activo;

    public ToggleUsuarioRequest() { }

    public Boolean getActivo()              { return activo; }
    public void setActivo(Boolean activo)   { this.activo = activo; }
}
