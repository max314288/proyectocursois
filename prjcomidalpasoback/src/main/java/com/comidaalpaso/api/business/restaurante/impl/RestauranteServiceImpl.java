package com.comidaalpaso.api.business.restaurante.impl;

import com.comidaalpaso.api.adapter.restaurante.RestauranteDAO;
import com.comidaalpaso.api.business.restaurante.RestauranteService;
import com.comidaalpaso.api.resource.restaurante.model.CreateRestauranteRequest;
import com.comidaalpaso.api.resource.restaurante.model.RestauranteDTO;
import com.comidaalpaso.api.resource.restaurante.model.UpdateRestauranteRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class RestauranteServiceImpl implements RestauranteService {

    private final RestauranteDAO restauranteDAO;

    public RestauranteServiceImpl(RestauranteDAO restauranteDAO) {
        this.restauranteDAO = restauranteDAO;
    }

    @Override
    public UUID crear(CreateRestauranteRequest req) {
        return restauranteDAO.crear(
            req.getUsuarioId(), req.getNombre(), req.getDireccion(),
            req.getTelefono(), req.getLogoUrl(),
            req.isAceptaRecojo(), req.isAceptaDelivery(), req.isAceptaSalon()
        );
    }

    @Override
    public List<RestauranteDTO> listar(boolean soloActivos) {
        return restauranteDAO.listar(soloActivos).stream()
            .map(RestauranteDTO::from)
            .toList();
    }

    @Override
    public void actualizar(UUID id, UpdateRestauranteRequest req) {
        restauranteDAO.actualizar(
            id, req.getNombre(), req.getDireccion(), req.getTelefono(), req.getLogoUrl(),
            req.isAceptaRecojo(), req.isAceptaDelivery(), req.isAceptaSalon()
        );
    }

    @Override
    public void toggle(UUID id, boolean activo) {
        restauranteDAO.toggle(id, activo);
    }
}
