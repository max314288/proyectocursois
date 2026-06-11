package com.comidaalpaso.api.business.etiqueta;

import com.comidaalpaso.api.resource.etiqueta.model.AsignarEtiquetaRequest;
import com.comidaalpaso.api.resource.etiqueta.model.EtiquetaDTO;

import java.util.List;
import java.util.UUID;

public interface EtiquetaService {
    void asignar(UUID itemId, AsignarEtiquetaRequest req);
    void quitar(UUID itemId, String etiquetaCodigo);
    List<EtiquetaDTO> etiquetasDeItem(UUID itemId);
}
