package com.comidaalpaso.api.adapter.pedido;

import com.comidaalpaso.api.adapter.pedido.model.HistorialEstadoRow;
import com.comidaalpaso.api.adapter.pedido.model.PedidoDetalleRow;
import com.comidaalpaso.api.adapter.pedido.model.PedidoResumenRow;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface PedidoDAO {
    UUID crear(UUID clienteId, UUID restauranteId, String modo, String itemsJson, String notas,
               String direccion, String referencia, BigDecimal latitud, BigDecimal longitud,
               UUID mesaId, Integer numComensales);
    void cambiarEstado(UUID pedidoId, String estado, UUID usuarioId);
    void asignarRepartidor(UUID pedidoId, UUID repartidorId);
    List<PedidoDetalleRow> obtener(UUID pedidoId);
    List<PedidoResumenRow> listarPorRestaurante(UUID restauranteId, String estado, String modo);
    List<PedidoResumenRow> listarPorCliente(UUID clienteId);
    void cancelar(UUID pedidoId);
    List<HistorialEstadoRow> historial(UUID pedidoId);
}
