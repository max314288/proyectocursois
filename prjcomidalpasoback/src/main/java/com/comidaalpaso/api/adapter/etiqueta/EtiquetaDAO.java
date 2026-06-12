package com.comidaalpaso.api.adapter.etiqueta;

import com.comidaalpaso.api.adapter.etiqueta.model.Etiqueta;

import java.util.List;
import java.util.UUID;

public interface EtiquetaDAO {
    void asignar(UUID itemId, String etiquetaCodigo);
    void quitar(UUID itemId, String etiquetaCodigo);
    List<Etiqueta> etiquetasDeItem(UUID itemId);
    List<Etiqueta> listarTodas();
}
