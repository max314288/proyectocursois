package com.comidaalpaso.api.business.mesa;

import com.comidaalpaso.api.resource.mesa.model.CreateMesaRequest;
import com.comidaalpaso.api.resource.mesa.model.MesaDTO;
import com.comidaalpaso.api.resource.mesa.model.UpdateMesaRequest;

import java.util.List;
import java.util.UUID;

public interface MesaService {
    UUID crear(CreateMesaRequest req);
    List<MesaDTO> listar(UUID restauranteId, String estado);
    void actualizar(UUID id, UpdateMesaRequest req);
    void cambiarEstado(UUID id, String estado);
    void eliminar(UUID id);
}
