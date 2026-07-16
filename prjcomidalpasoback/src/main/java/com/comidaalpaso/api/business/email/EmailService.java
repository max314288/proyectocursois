package com.comidaalpaso.api.business.email;

import java.util.UUID;

public interface EmailService {
    void enviarComprobante(UUID pedidoId, String emailDestino);
}
