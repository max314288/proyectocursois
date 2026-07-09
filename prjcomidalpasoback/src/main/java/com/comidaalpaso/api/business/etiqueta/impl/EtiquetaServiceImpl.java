package com.comidaalpaso.api.business.etiqueta.impl;

import com.comidaalpaso.api.adapter.etiqueta.EtiquetaDAO;
import com.comidaalpaso.api.business.etiqueta.EtiquetaService;
import com.comidaalpaso.api.resource.etiqueta.model.AsignarEtiquetaRequest;
import com.comidaalpaso.api.resource.etiqueta.model.EtiquetaDTO;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class EtiquetaServiceImpl implements EtiquetaService {

    private final EtiquetaDAO etiquetaDAO;

    public EtiquetaServiceImpl(EtiquetaDAO etiquetaDAO) {
        this.etiquetaDAO = etiquetaDAO;
    }

    @Override
    public void asignar(UUID itemId, AsignarEtiquetaRequest req) {
        etiquetaDAO.asignar(itemId, req.getEtiquetaCodigo());
    }

    @Override
    public void quitar(UUID itemId, String etiquetaCodigo) {
        etiquetaDAO.quitar(itemId, etiquetaCodigo);
    }

    @Override
    public List<EtiquetaDTO> etiquetasDeItem(UUID itemId) {
        return etiquetaDAO.etiquetasDeItem(itemId).stream()
            .map(EtiquetaDTO::from)
            .toList();
    }

    @Override
    public List<EtiquetaDTO> listarTodas() {
        return etiquetaDAO.listarTodas().stream()
            .map(EtiquetaDTO::from)
            .toList();
    }
}
