package com.comidaalpaso.api.resource.authusuario.model;

import com.comidaalpaso.api.adapter.authusuario.model.Rol;
import com.comidaalpaso.api.adapter.authusuario.model.Usuario;

import java.time.LocalDate;
import java.util.UUID;

/**
 * DTO de salida — proyección segura del Usuario (NUNCA expone password_hash).
 *
 * <p>SOLID-S: solo proyecta datos para el front. Los mappers viven en los Services.
 */
public class UsuarioDTO {

    private UUID id;
    private String nombre;
    private String apellido;
    private String email;
    private String rol;        // formato BD: minúscula
    private boolean activo;
    private LocalDate createdAt;

    public UsuarioDTO() { }

    public UsuarioDTO(UUID id, String nombre, String apellido, String email,
                      String rol, boolean activo, LocalDate createdAt) {
        this.id = id;
        this.nombre = nombre;
        this.apellido = apellido;
        this.email = email;
        this.rol = rol;
        this.activo = activo;
        this.createdAt = createdAt;
    }

    /**
     * Construye un DTO a partir de la entity (mapper estático para reutilizar
     * en service e integration tests sin instanciar un mapper bean).
     */
    public static UsuarioDTO from(Usuario u) {
        return new UsuarioDTO(
            u.getId(),
            u.getNombre(),
            u.getApellido(),
            u.getEmail(),
            u.getRol(),
            u.isActivo(),
            u.getCreatedAt()
        );
    }

    public UUID getId()              { return id;        }
    public String getNombre()        { return nombre;    }
    public String getApellido()      { return apellido;  }
    public String getEmail()         { return email;     }
    public String getRol()           { return rol;       }
    public boolean isActivo()        { return activo;    }
    public LocalDate getCreatedAt()  { return createdAt; }

    public void setId(UUID id)                     { this.id = id;               }
    public void setNombre(String nombre)           { this.nombre = nombre;       }
    public void setApellido(String apellido)       { this.apellido = apellido;   }
    public void setEmail(String email)             { this.email = email;         }
    public void setRol(String rol)                 { this.rol = rol;             }
    public void setActivo(boolean activo)          { this.activo = activo;       }
    public void setCreatedAt(LocalDate createdAt)  { this.createdAt = createdAt; }
}
