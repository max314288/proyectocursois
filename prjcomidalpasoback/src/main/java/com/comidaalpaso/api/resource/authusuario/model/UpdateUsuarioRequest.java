package com.comidaalpaso.api.resource.authusuario.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO de entrada para {@code PUT /api/usuarios/{id}} — invoca {@code sp_actualizar_usuario}.
 *
 * <p>Solo modifica nombre, apellido y email. Password y rol tienen endpoints separados.
 */
public class UpdateUsuarioRequest {

    @NotBlank @Size(max = 100)
    private String nombre;

    @NotBlank @Size(max = 100)
    private String apellido;

    @NotBlank @Email @Size(max = 255)
    private String email;

    public UpdateUsuarioRequest() { }

    public String getNombre()   { return nombre;   }
    public String getApellido() { return apellido; }
    public String getEmail()    { return email;    }

    public void setNombre(String nombre)     { this.nombre = nombre;     }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public void setEmail(String email)       { this.email = email;       }
}
