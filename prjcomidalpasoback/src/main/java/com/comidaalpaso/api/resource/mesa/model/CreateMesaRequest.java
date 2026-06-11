package com.comidaalpaso.api.resource.mesa.model;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.UUID;

public class CreateMesaRequest {

    @NotNull(message = "El restauranteId es obligatorio")
    private UUID restauranteId;

    @NotBlank(message = "El número de mesa es obligatorio")
    @Size(max = 20)
    private String numero;

    @NotNull(message = "La capacidad es obligatoria")
    @Min(value = 1, message = "La capacidad debe ser mayor a 0")
    private Integer capacidad;

    public UUID getRestauranteId() { return restauranteId; }
    public void setRestauranteId(UUID restauranteId) { this.restauranteId = restauranteId; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public Integer getCapacidad() { return capacidad; }
    public void setCapacidad(Integer capacidad) { this.capacidad = capacidad; }
}
