package com.comidaalpaso.api.resource.pedido.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class CambiarEstadoPedidoRequest {

    @NotBlank(message = "El estado es obligatorio")
    @Pattern(regexp = "recibido|en_preparacion|listo|entregado",
             message = "El estado debe ser: recibido, en_preparacion, listo o entregado")
    private String estado;

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
