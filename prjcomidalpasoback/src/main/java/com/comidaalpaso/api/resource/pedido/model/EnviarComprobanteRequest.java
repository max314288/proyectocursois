package com.comidaalpaso.api.resource.pedido.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public class EnviarComprobanteRequest {

    @NotBlank(message = "El correo es obligatorio")
    @Email(message = "El correo no tiene un formato válido")
    private String email;

    public EnviarComprobanteRequest() { }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
}
