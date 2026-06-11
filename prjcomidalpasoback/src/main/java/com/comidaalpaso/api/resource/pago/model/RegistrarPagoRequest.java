package com.comidaalpaso.api.resource.pago.model;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class RegistrarPagoRequest {

    @NotNull(message = "El pedidoId es obligatorio")
    private UUID pedidoId;

    @NotNull(message = "El método de pago es obligatorio")
    @Pattern(regexp = "tarjeta|transferencia|efectivo",
             message = "El método debe ser: tarjeta, transferencia o efectivo")
    private String metodo;

    @Size(max = 255)
    private String referenciaExterna;

    public UUID getPedidoId() { return pedidoId; }
    public void setPedidoId(UUID pedidoId) { this.pedidoId = pedidoId; }
    public String getMetodo() { return metodo; }
    public void setMetodo(String metodo) { this.metodo = metodo; }
    public String getReferenciaExterna() { return referenciaExterna; }
    public void setReferenciaExterna(String referenciaExterna) { this.referenciaExterna = referenciaExterna; }
}
