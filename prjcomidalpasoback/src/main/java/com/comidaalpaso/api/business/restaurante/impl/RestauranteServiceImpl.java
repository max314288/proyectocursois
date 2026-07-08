package com.comidaalpaso.api.business.restaurante.impl;

import com.comidaalpaso.api.adapter.etiqueta.EtiquetaDAO;
import com.comidaalpaso.api.adapter.menu.MenuDAO;
import com.comidaalpaso.api.adapter.menu.model.ItemListadoRow;
import com.comidaalpaso.api.adapter.restaurante.RestauranteDAO;
import com.comidaalpaso.api.adapter.restaurante.model.Restaurante;
import com.comidaalpaso.api.business.restaurante.RestauranteService;
import com.comidaalpaso.api.resource.etiqueta.model.EtiquetaDTO;
import com.comidaalpaso.api.resource.menu.model.CategoriaMenuDTO;
import com.comidaalpaso.api.resource.menu.model.ComponenteMenuDTO;
import com.comidaalpaso.api.resource.menu.model.OpcionArmaPlatoDTO;
import com.comidaalpaso.api.resource.restaurante.model.CreateRestauranteRequest;
import com.comidaalpaso.api.resource.restaurante.model.ElegirRestauranteDTO;
import com.comidaalpaso.api.resource.restaurante.model.ItemMenuConDetalleDTO;
import com.comidaalpaso.api.resource.restaurante.model.RestauranteDTO;
import com.comidaalpaso.api.resource.restaurante.model.UpdateRestauranteRequest;
import com.comidaalpaso.api.shared.exception.ResourceNotFoundException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
public class RestauranteServiceImpl implements RestauranteService {

    private final RestauranteDAO restauranteDAO;
    private final MenuDAO menuDAO;
    private final EtiquetaDAO etiquetaDAO;

    public RestauranteServiceImpl(RestauranteDAO restauranteDAO,
                                   MenuDAO menuDAO,
                                   EtiquetaDAO etiquetaDAO) {
        this.restauranteDAO = restauranteDAO;
        this.menuDAO = menuDAO;
        this.etiquetaDAO = etiquetaDAO;
    }

    @Override
    public UUID crear(CreateRestauranteRequest req) {
        return restauranteDAO.crear(
            req.getUsuarioId(), req.getNombre(), req.getDireccion(),
            req.getTelefono(), req.getLogoUrl(),
            req.isAceptaRecojo(), req.isAceptaDelivery(), req.isAceptaSalon()
        );
    }

    @Override
    public List<RestauranteDTO> listar(boolean soloActivos, UUID usuarioId) {
        return restauranteDAO.listar(soloActivos, usuarioId).stream()
            .map(RestauranteDTO::from)
            .toList();
    }

    @Override
    public void actualizar(UUID id, UpdateRestauranteRequest req) {
        restauranteDAO.actualizar(
            id, req.getNombre(), req.getDireccion(), req.getTelefono(), req.getLogoUrl(),
            req.isAceptaRecojo(), req.isAceptaDelivery(), req.isAceptaSalon()
        );
    }

    @Override
    public void toggle(UUID id, boolean activo) {
        restauranteDAO.toggle(id, activo);
    }

    @Override
    public ElegirRestauranteDTO elegir(UUID restauranteId) {
        // 1. restaurante
        Restaurante restaurante = restauranteDAO.findById(restauranteId)
            .orElseThrow(() -> new ResourceNotFoundException("Restaurante no encontrado"));
        RestauranteDTO restauranteDTO = RestauranteDTO.from(restaurante);

        // 2. todos los ítems del restaurante
        List<ItemListadoRow> itemRows = menuDAO.listarItems(restauranteId, null, null, false);

        // 3. categorías usadas por este restaurante (filtra las globales por nombre)
        Set<String> categoriasUsadas = itemRows.stream()
            .map(ItemListadoRow::getCategoria)
            .collect(Collectors.toSet());
        List<CategoriaMenuDTO> categorias = menuDAO.listarCategorias().stream()
            .filter(c -> categoriasUsadas.contains(c.getNombre()))
            .map(CategoriaMenuDTO::from)
            .toList();

        // 4. etiquetas globales disponibles
        List<EtiquetaDTO> etiquetas = etiquetaDAO.listarTodas()
            .stream().map(EtiquetaDTO::from).toList();

        // 5. enriquecer cada ítem con sus etiquetas, componentes y opciones arma-plato
        List<ItemMenuConDetalleDTO> items = itemRows.stream().map(row -> {
            List<EtiquetaDTO> etiquetasItem = etiquetaDAO.etiquetasDeItem(row.getId())
                .stream().map(EtiquetaDTO::from).toList();

            List<ComponenteMenuDTO> componentes = (row.getEsMenuCompuesto() != null && row.getEsMenuCompuesto() == 1)
                ? menuDAO.listarComponentesMenu(row.getId()).stream().map(ComponenteMenuDTO::from).toList()
                : List.of();

            List<OpcionArmaPlatoDTO> opciones = (row.getEsArmaPlato() != null && row.getEsArmaPlato() == 1)
                ? menuDAO.listarOpcionesArmaPlato(row.getId()).stream().map(OpcionArmaPlatoDTO::from).toList()
                : List.of();

            return ItemMenuConDetalleDTO.from(row, etiquetasItem, componentes, opciones);
        }).toList();

        return new ElegirRestauranteDTO(restauranteDTO, categorias, etiquetas, items);
    }

    @Override
    public RestauranteDTO miRestaurante(UUID usuarioId) {
        UUID restauranteId = restauranteDAO.findRestauranteIdByUsuarioId(usuarioId)
            .orElseThrow(() -> new ResourceNotFoundException("El usuario no tiene un restaurante asignado"));
        Restaurante restaurante = restauranteDAO.findById(restauranteId)
            .orElseThrow(() -> new ResourceNotFoundException("Restaurante no encontrado"));
        return RestauranteDTO.from(restaurante);
    }
}
