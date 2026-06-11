package com.comidaalpaso.api.adapter.menu.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "items_menu")
public class ItemMenu {

    @Id
    @Column(name = "id", columnDefinition = "UNIQUEIDENTIFIER", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "restaurante_id", nullable = false, columnDefinition = "UNIQUEIDENTIFIER")
    private UUID restauranteId;

    @Column(name = "categoria_id", nullable = false, columnDefinition = "UNIQUEIDENTIFIER")
    private UUID categoriaId;

    @Column(name = "nombre", nullable = false, length = 150)
    private String nombre;

    @Column(name = "descripcion", length = 1000)
    private String descripcion;

    @Column(name = "precio", nullable = false, precision = 10, scale = 2)
    private BigDecimal precio;

    @Column(name = "imagen_url", length = 500)
    private String imagenUrl;

    @Column(name = "peso_gramos", precision = 8, scale = 2)
    private BigDecimal pesoGramos;

    @Column(name = "porciones")
    private Integer porciones;

    @Column(name = "tiempo_preparacion")
    private Integer tiempoPreparacion;

    @Column(name = "informacion_nutricional", length = 500)
    private String informacionNutricional;

    @Column(name = "es_menu_compuesto", nullable = false)
    private Short esMenuCompuesto;

    @Column(name = "es_arma_plato", nullable = false)
    private Short esArmaPlato;

    @Column(name = "disponible", nullable = false)
    private Short disponible;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDate createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDate updatedAt;

    public ItemMenu() { }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getRestauranteId() { return restauranteId; }
    public void setRestauranteId(UUID restauranteId) { this.restauranteId = restauranteId; }

    public UUID getCategoriaId() { return categoriaId; }
    public void setCategoriaId(UUID categoriaId) { this.categoriaId = categoriaId; }

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

    public Short getEsMenuCompuesto() { return esMenuCompuesto; }
    public void setEsMenuCompuesto(Short esMenuCompuesto) { this.esMenuCompuesto = esMenuCompuesto; }

    public Short getEsArmaPlato() { return esArmaPlato; }
    public void setEsArmaPlato(Short esArmaPlato) { this.esArmaPlato = esArmaPlato; }

    public Short getDisponible() { return disponible; }
    public void setDisponible(Short disponible) { this.disponible = disponible; }

    public boolean isDisponible() { return disponible != null && disponible == 1; }

    public LocalDate getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDate createdAt) { this.createdAt = createdAt; }

    public LocalDate getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDate updatedAt) { this.updatedAt = updatedAt; }
}
