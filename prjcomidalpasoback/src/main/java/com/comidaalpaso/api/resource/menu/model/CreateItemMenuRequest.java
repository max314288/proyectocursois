package com.comidaalpaso.api.resource.menu.model;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.UUID;

public class CreateItemMenuRequest {

    @NotNull(message = "El restauranteId es obligatorio")
    private UUID restauranteId;

    @NotBlank(message = "La categoría es obligatoria")
    @Size(max = 30)
    private String categoriaCodigo;

    @NotBlank(message = "El nombre es obligatorio")
    @Size(max = 150)
    private String nombre;

    @Size(max = 1000)
    private String descripcion;

    @NotNull(message = "El precio es obligatorio")
    @DecimalMin(value = "0.0", message = "El precio no puede ser negativo")
    private BigDecimal precio;

    @Size(max = 500)
    private String imagenUrl;

    private BigDecimal pesoGramos;
    private Integer porciones;
    private Integer tiempoPreparacion;

    @Size(max = 500)
    private String informacionNutricional;

    private boolean esMenuCompuesto = false;
    private boolean esArmaPlato = false;

    public UUID getRestauranteId() { return restauranteId; }
    public void setRestauranteId(UUID restauranteId) { this.restauranteId = restauranteId; }
    public String getCategoriaCodigo() { return categoriaCodigo; }
    public void setCategoriaCodigo(String categoriaCodigo) { this.categoriaCodigo = categoriaCodigo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
    public BigDecimal getPesoGramos() { return pesoGramos; }
    public void setPesoGramos(BigDecimal pesoGramos) { this.pesoGramos = pesoGramos; }
    public Integer getPorciones() { return porciones; }
    public void setPorciones(Integer porciones) { this.porciones = porciones; }
    public Integer getTiempoPreparacion() { return tiempoPreparacion; }
    public void setTiempoPreparacion(Integer tiempoPreparacion) { this.tiempoPreparacion = tiempoPreparacion; }
    public String getInformacionNutricional() { return informacionNutricional; }
    public void setInformacionNutricional(String v) { this.informacionNutricional = v; }
    public boolean isEsMenuCompuesto() { return esMenuCompuesto; }
    public void setEsMenuCompuesto(boolean esMenuCompuesto) { this.esMenuCompuesto = esMenuCompuesto; }
    public boolean isEsArmaPlato() { return esArmaPlato; }
    public void setEsArmaPlato(boolean esArmaPlato) { this.esArmaPlato = esArmaPlato; }
}
