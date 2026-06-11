package com.comidaalpaso.api.business.pago.impl;

import com.comidaalpaso.api.adapter.pago.PagoDAO;
import com.comidaalpaso.api.business.pago.PagoService;
import com.comidaalpaso.api.resource.pago.model.PagoDTO;
import com.comidaalpaso.api.resource.pago.model.RegistrarPagoRequest;
import com.comidaalpaso.api.shared.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class PagoServiceImpl implements PagoService {

    private final PagoDAO pagoDAO;

    public PagoServiceImpl(PagoDAO pagoDAO) {
        this.pagoDAO = pagoDAO;
    }

    @Override
    public UUID registrar(RegistrarPagoRequest req) {
        return pagoDAO.registrar(req.getPedidoId(), req.getMetodo(), req.getReferenciaExterna());
    }

    @Override
    public void confirmar(UUID pagoId, String referenciaExterna) {
        pagoDAO.confirmar(pagoId, referenciaExterna);
    }

    @Override
    public void fallo(UUID pagoId) {
        pagoDAO.fallo(pagoId);
    }

    @Override
    public PagoDTO obtener(UUID pedidoId) {
        return pagoDAO.obtener(pedidoId)
            .map(PagoDTO::from)
            .orElseThrow(() -> new ResourceNotFoundException("Pago no encontrado para el pedido"));
    }
}
