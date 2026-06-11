package com.comidaalpaso.api.resource.mesa.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CambiarEstadoMesaRequest {

    @NotBlank(message = "El estado es obligatorio")
    @Pattern(regexp = "disponible|ocupada|reservada",
             message = "El estado debe ser: disponible, ocupada o reservada")
    private String estado;

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
