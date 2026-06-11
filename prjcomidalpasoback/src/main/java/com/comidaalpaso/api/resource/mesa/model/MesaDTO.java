package com.comidaalpaso.api.resource.mesa.model;

import com.comidaalpaso.api.adapter.mesa.model.Mesa;

import java.util.UUID;

public class MesaDTO {
    private UUID id;
    private String numero;
    private int capacidad;
    private String estado;

    public MesaDTO() { }

    public MesaDTO(UUID id, String numero, int capacidad, String estado) {
        this.id = id;
        this.numero = numero;
        this.capacidad = capacidad;
        this.estado = estado;
    }

    public static MesaDTO from(Mesa m) {
        return new MesaDTO(m.getId(), m.getNumero(),
            m.getCapacidad() != null ? m.getCapacidad() : 0, m.getEstado());
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNumero() { return numero; }
    public void setNumero(String numero) { this.numero = numero; }
    public int getCapacidad() { return capacidad; }
    public void setCapacidad(int capacidad) { this.capacidad = capacidad; }
    public String getEstado() { return estado; }
    public void setEstado(String estado) { this.estado = estado; }
}
