package com.comidaalpaso.api.resource.authusuario.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

/**
 * DTO de entrada para {@code POST /api/auth/login}.
 */
public class LoginRequest {

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Email inválido")
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    private String password;

    public LoginRequest() { }

    public String getEmail()    { return email;    }
    public String getPassword() { return password; }

    public void setEmail(String email)       { this.email = email;       }
    public void setPassword(String password) { this.password = password; }
}
