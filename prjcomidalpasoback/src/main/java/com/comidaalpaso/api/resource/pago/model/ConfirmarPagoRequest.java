package com.comidaalpaso.api.resource.pago.model;

import jakarta.validation.constraints.Size;

public class ConfirmarPagoRequest {

    @Size(max = 255)
    private String referenciaExterna;

    public String getReferenciaExterna() { return referenciaExterna; }
    public void setReferenciaExterna(String referenciaExterna) { this.referenciaExterna = referenciaExterna; }
}
