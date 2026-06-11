package com.comidaalpaso.api.resource.etiqueta.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public class AsignarEtiquetaRequest {

    @NotBlank(message = "El código de etiqueta es obligatorio")
    @Size(max = 50)
    private String etiquetaCodigo;

    public String getEtiquetaCodigo() { return etiquetaCodigo; }
    public void setEtiquetaCodigo(String etiquetaCodigo) { this.etiquetaCodigo = etiquetaCodigo; }
}
