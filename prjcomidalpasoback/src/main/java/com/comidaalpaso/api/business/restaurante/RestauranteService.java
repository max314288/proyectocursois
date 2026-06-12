package com.comidaalpaso.api.business.restaurante;

import com.comidaalpaso.api.resource.restaurante.model.CreateRestauranteRequest;
import com.comidaalpaso.api.resource.restaurante.model.ElegirRestauranteDTO;
import com.comidaalpaso.api.resource.restaurante.model.RestauranteDTO;
import com.comidaalpaso.api.resource.restaurante.model.UpdateRestauranteRequest;

import java.util.List;
import java.util.UUID;

public interface RestauranteService {
    UUID crear(CreateRestauranteRequest req);
    List<RestauranteDTO> listar(boolean soloActivos, UUID usuarioId);
    void actualizar(UUID id, UpdateRestauranteRequest req);
    void toggle(UUID id, boolean activo);
    ElegirRestauranteDTO elegir(UUID restauranteId);
}
