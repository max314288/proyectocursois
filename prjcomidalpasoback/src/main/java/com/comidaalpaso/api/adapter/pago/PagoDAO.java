package com.comidaalpaso.api.adapter.pago;

import com.comidaalpaso.api.adapter.pago.model.Pago;

import java.util.Optional;
import java.util.UUID;

public interface PagoDAO {
    UUID registrar(UUID pedidoId, String metodo, String referenciaExterna);
    void confirmar(UUID pagoId, String referenciaExterna);
    void fallo(UUID pagoId);
    Optional<Pago> obtener(UUID pedidoId);
}
