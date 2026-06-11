package com.comidaalpaso.api.business.pedido;

import com.comidaalpaso.api.resource.pedido.model.CreatePedidoRequest;
import com.comidaalpaso.api.resource.pedido.model.HistorialEstadoDTO;
import com.comidaalpaso.api.resource.pedido.model.PedidoDetalleDTO;
import com.comidaalpaso.api.resource.pedido.model.PedidoResumenDTO;

import java.util.List;
import java.util.UUID;

public interface PedidoService {
    UUID crear(UUID clienteId, CreatePedidoRequest req);
    PedidoDetalleDTO obtener(UUID pedidoId);
    List<PedidoResumenDTO> listarPorRestaurante(UUID restauranteId, String estado, String modo);
    List<PedidoResumenDTO> listarPorCliente(UUID clienteId);
    void cambiarEstado(UUID pedidoId, String estado, UUID usuarioId);
    void asignarRepartidor(UUID pedidoId, UUID repartidorId);
    void cancelar(UUID pedidoId);
    List<HistorialEstadoDTO> historial(UUID pedidoId);
}
