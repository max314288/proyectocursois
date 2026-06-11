package com.comidaalpaso.api.adapter.mesa;

import com.comidaalpaso.api.adapter.mesa.model.Mesa;

import java.util.List;
import java.util.UUID;

public interface MesaDAO {
    UUID crear(UUID restauranteId, String numero, int capacidad);
    void actualizar(UUID id, String numero, int capacidad);
    void cambiarEstado(UUID id, String estado);
    void eliminar(UUID id);
    List<Mesa> listar(UUID restauranteId, String estado);
}
