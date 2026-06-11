package com.comidaalpaso.api.business.pago;

import com.comidaalpaso.api.resource.pago.model.PagoDTO;
import com.comidaalpaso.api.resource.pago.model.RegistrarPagoRequest;

import java.util.UUID;

public interface PagoService {
    UUID registrar(RegistrarPagoRequest req);
    void confirmar(UUID pagoId, String referenciaExterna);
    void fallo(UUID pagoId);
    PagoDTO obtener(UUID pedidoId);
}
