package com.comidaalpaso.api.resource.authusuario.model;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/**
 * DTO de entrada para {@code POST /api/auth/register}.
 *
 * <p>SOLID-S: representa únicamente la forma de entrada de un registro.
 * SOLID-I: campos mínimos que el endpoint necesita (sin id, sin activo).
 */
public class RegisterRequest {

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 100, message = "El nombre no puede exceder 100 caracteres")
    private String nombre;

    @NotBlank(message = "El apellido es obligatorio")
    @Size(max = 100, message = "El apellido no puede exceder 100 caracteres")
    private String apellido;

    @NotBlank(message = "El email es obligatorio")
    @Email(message = "Email inválido")
    @Size(max = 255)
    private String email;

    @NotBlank(message = "La contraseña es obligatoria")
    @Size(min = 8, max = 100, message = "La contraseña debe tener entre 8 y 100 caracteres")
    private String password;

    /**
     * Rol opcional — si no se especifica, default {@code cliente}.
     * En fase futura se restringirá: solo admins podrán crear admin/restaurante.
     */
    private String rol;

    public RegisterRequest() { }

    public String getNombre()   { return nombre;   }
    public String getApellido() { return apellido; }
    public String getEmail()    { return email;    }
    public String getPassword() { return password; }
    public String getRol()      { return rol;      }

    public void setNombre(String nombre)     { this.nombre = nombre;     }
    public void setApellido(String apellido) { this.apellido = apellido; }
    public void setEmail(String email)       { this.email = email;       }
    public void setPassword(String password) { this.password = password; }
    public void setRol(String rol)           { this.rol = rol;           }
}
