package com.comidaalpaso.api.resource.menu.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class AgregarComponenteMenuRequest {

    @NotNull(message = "El itemId es obligatorio")
    private UUID itemId;

    @NotBlank(message = "El rol del componente es obligatorio")
    @Size(max = 30)
    private String rol;

    private boolean obligatorio = true;
    private int orden = 0;

    public UUID getItemId() { return itemId; }
    public void setItemId(UUID itemId) { this.itemId = itemId; }
    public String getRol() { return rol; }
    public void setRol(String rol) { this.rol = rol; }
    public boolean isObligatorio() { return obligatorio; }
    public void setObligatorio(boolean obligatorio) { this.obligatorio = obligatorio; }
    public int getOrden() { return orden; }
    public void setOrden(int orden) { this.orden = orden; }
}
