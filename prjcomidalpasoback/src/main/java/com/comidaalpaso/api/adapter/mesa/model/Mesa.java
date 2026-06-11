package com.comidaalpaso.api.adapter.mesa.model;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import java.util.UUID;

@Entity
@Table(name = "mesas")
public class Mesa {

    @Id
    @Column(name = "id", columnDefinition = "UNIQUEIDENTIFIER", updatable = false, nullable = false)
    private UUID id;

    @Column(name = "restaurante_id", nullable = false, columnDefinition = "UNIQUEIDENTIFIER")
    private UUID restauranteId;

    @Column(name = "numero", nullable = false, length = 20)
    private String numero;

    @Column(name = "capacidad", nullable = false)
    private Integer capacidad;

    @Column(name = "estado", nullable = false, length = 20)
    private String estado;

    public Mesa() { }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }

    public UUID getRestauranteId() { return restauranteId; }
    public void setRestauranteId(UUID restauranteId) { this.restauranteId = restauranteId; }

    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }

    public Integer getCapacidad() { return capacidad; }
    public void setCapacidad(Integer capacidad) { this.capacidad = capacidad; }

    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
