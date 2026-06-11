package com.comidaalpaso.api.resource.authusuario.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO de entrada para {@code PUT /api/usuarios/{id}/password} — invoca
 * {@code sp_cambiar_password}.
 *
 * <p>{@code passwordActual} solo es obligatorio cuando el dueño cambia su propia
 * contraseña; si un admin la resetea para otro usuario, puede omitirse (la
 * validación se hace en el Service).
 */
public class CambiarPasswordRequest {

    private String passwordActual;

    @NotBlank(message = "La nueva contraseña es obligatoria")
    @Size(min = 8, max = 100, message = "La contraseña debe tener entre 8 y 100 caracteres")
    private String passwordNuevo;

    public CambiarPasswordRequest() { }

    public String getPasswordActual() { return passwordActual; }
    public String getPasswordNuevo()  { return passwordNuevo;  }

    public void setPasswordActual(String passwordActual) { this.passwordActual = passwordActual; }
    public void setPasswordNuevo(String passwordNuevo)   { this.passwordNuevo = passwordNuevo;   }
}
