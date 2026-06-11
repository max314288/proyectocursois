package com.comidaalpaso.api.resource.authusuario.model;

/**
 * DTO de salida para los endpoints de auth: login, register, refresh.
 *
 * <p>Contiene el JWT firmado, su duración (ms) y el usuario autenticado
 * (sin password_hash).
 */
public class AuthResponse {

    private String token;
    private long expiresIn;
    private UsuarioDTO usuario;

    public AuthResponse() { }

    public AuthResponse(String token, long expiresIn, UsuarioDTO usuario) {
        this.token = token;
        this.expiresIn = expiresIn;
        this.usuario = usuario;
    }

    public String getToken()         { return token;     }
    public long getExpiresIn()       { return expiresIn; }
    public UsuarioDTO getUsuario()   { return usuario;   }

    public void setToken(String token)           { this.token = token;         }
    public void setExpiresIn(long expiresIn)     { this.expiresIn = expiresIn; }
    public void setUsuario(UsuarioDTO usuario)   { this.usuario = usuario;     }
}
