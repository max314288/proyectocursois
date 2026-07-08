package com.comidaalpaso.api.business.pedido.impl;

import com.comidaalpaso.api.adapter.pedido.PedidoDAO;
import com.comidaalpaso.api.adapter.pedido.model.PedidoDetalleRow;
import com.comidaalpaso.api.business.pedido.PedidoService;
import com.comidaalpaso.api.resource.pedido.model.CreatePedidoRequest;
import com.comidaalpaso.api.resource.pedido.model.HistorialEstadoDTO;
import com.comidaalpaso.api.resource.pedido.model.ItemDetallePedidoDTO;
import com.comidaalpaso.api.resource.pedido.model.ItemPedidoRequest;
import com.comidaalpaso.api.resource.pedido.model.PedidoDetalleDTO;
import com.comidaalpaso.api.resource.pedido.model.PedidoResumenDTO;
import com.comidaalpaso.api.shared.exception.ResourceNotFoundException;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@Service
public class PedidoServiceImpl implements PedidoService {

    private final PedidoDAO pedidoDAO;
    private final ObjectMapper objectMapper;

    public PedidoServiceImpl(PedidoDAO pedidoDAO, ObjectMapper objectMapper) {
        this.pedidoDAO = pedidoDAO;
        this.objectMapper = objectMapper;
    }

    @Override
    public UUID crear(UUID clienteId, CreatePedidoRequest req) {
        String itemsJson = serializarItems(req.getItems());
        return pedidoDAO.crear(
            clienteId,
            req.getRestauranteId(),
            req.getModo(),
            itemsJson,
            req.getNotas(),
            req.getDireccion(),
            req.getReferencia(),
            req.getLatitud(),
            req.getLongitud(),
            req.getMesaId(),
            req.getNumComensales()
        );
    }

    @Override
    public PedidoDetalleDTO obtener(UUID pedidoId) {
        List<PedidoDetalleRow> rows = pedidoDAO.obtener(pedidoId);
        if (rows.isEmpty()) throw new ResourceNotFoundException("Pedido no encontrado");

        PedidoDetalleRow first = rows.get(0);
        PedidoDetalleDTO dto = new PedidoDetalleDTO();
        dto.setPedidoId(first.getPedidoId());
        dto.setCliente(first.getCliente());
        dto.setRestaurante(first.getRestaurante());
        dto.setModo(first.getModo());
        dto.setEstado(first.getEstado());
        dto.setSubtotal(first.getSubtotal());
        dto.setCostoDelivery(first.getCostoDelivery());
        dto.setTotal(first.getTotal());
        dto.setCodigoQr(first.getCodigoQr());
        dto.setNotas(first.getNotas());
        dto.setCreatedAt(first.getCreatedAt());

        List<ItemDetallePedidoDTO> items = rows.stream().map(row -> {
            ItemDetallePedidoDTO item = new ItemDetallePedidoDTO();
            item.setItemNombre(row.getItemNombre());
            item.setCantidad(row.getCantidad() != null ? row.getCantidad() : 0);
            item.setPrecioUnitario(row.getPrecioUnitario());
            item.setNotasItem(row.getNotasItem());
            return item;
        }).toList();
        dto.setItems(items);

        return dto;
    }

    @Override
    public List<PedidoResumenDTO> listarPorRestaurante(UUID restauranteId, String estado, String modo, LocalDate fecha) {
        return pedidoDAO.listarPorRestaurante(restauranteId, estado, modo, fecha)
            .stream().map(PedidoResumenDTO::from).toList();
    }

    @Override
    public List<PedidoResumenDTO> listarPorCliente(UUID clienteId) {
        return pedidoDAO.listarPorCliente(clienteId)
            .stream().map(PedidoResumenDTO::from).toList();
    }

    @Override
    public void cambiarEstado(UUID pedidoId, String estado, UUID usuarioId) {
        pedidoDAO.cambiarEstado(pedidoId, estado, usuarioId);
    }

    @Override
    public void asignarRepartidor(UUID pedidoId, UUID repartidorId) {
        pedidoDAO.asignarRepartidor(pedidoId, repartidorId);
    }

    @Override
    public void cancelar(UUID pedidoId) {
        pedidoDAO.cancelar(pedidoId);
    }

    @Override
    public List<HistorialEstadoDTO> historial(UUID pedidoId) {
        return pedidoDAO.historial(pedidoId)
            .stream().map(HistorialEstadoDTO::from).toList();
    }

    private String serializarItems(List<ItemPedidoRequest> items) {
        List<Map<String, Object>> list = new ArrayList<>();
        for (ItemPedidoRequest i : items) {
            Map<String, Object> m = new HashMap<>();
            m.put("item_menu_id", i.getItemMenuId().toString());
            m.put("cantidad",     i.getCantidad());
            m.put("notas_item",   i.getNotasItem() != null ? i.getNotasItem() : "");
            list.add(m);
        }
        try {
            return objectMapper.writeValueAsString(list);
        } catch (JsonProcessingException e) {
            throw new IllegalArgumentException("No se pudo serializar los ítems del pedido", e);
        }
    }
}
