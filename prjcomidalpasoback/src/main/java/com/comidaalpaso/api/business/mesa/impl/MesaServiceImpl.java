package com.comidaalpaso.api.business.mesa.impl;

import com.comidaalpaso.api.adapter.mesa.MesaDAO;
import com.comidaalpaso.api.business.mesa.MesaService;
import com.comidaalpaso.api.resource.mesa.model.CreateMesaRequest;
import com.comidaalpaso.api.resource.mesa.model.MesaDTO;
import com.comidaalpaso.api.resource.mesa.model.UpdateMesaRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MesaServiceImpl implements MesaService {

    private final MesaDAO mesaDAO;

    public MesaServiceImpl(MesaDAO mesaDAO) {
        this.mesaDAO = mesaDAO;
    }

    @Override
    public UUID crear(CreateMesaRequest req) {
        return mesaDAO.crear(req.getRestauranteId(), req.getNumero(), req.getCapacidad());
    }

    @Override
    public List<MesaDTO> listar(UUID restauranteId, String estado) {
        return mesaDAO.listar(restauranteId, estado).stream()
            .map(MesaDTO::from)
            .toList();
    }

    @Override
    public void actualizar(UUID id, UpdateMesaRequest req) {
        mesaDAO.actualizar(id, req.getNumero(), req.getCapacidad());
    }

    @Override
    public void cambiarEstado(UUID id, String estado) {
        mesaDAO.cambiarEstado(id, estado);
    }

    @Override
    public void eliminar(UUID id) {
        mesaDAO.eliminar(id);
    }
}
