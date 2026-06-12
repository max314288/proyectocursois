package com.comidaalpaso.api.business.menu.impl;

import com.comidaalpaso.api.adapter.authusuario.model.Rol;
import com.comidaalpaso.api.adapter.menu.MenuDAO;
import com.comidaalpaso.api.adapter.restaurante.RestauranteDAO;
import com.comidaalpaso.api.business.menu.MenuService;
import com.comidaalpaso.api.resource.menu.model.AgregarComponenteArmaPlatoRequest;
import com.comidaalpaso.api.resource.menu.model.AgregarComponenteMenuRequest;
import com.comidaalpaso.api.resource.menu.model.CategoriaMenuDTO;
import com.comidaalpaso.api.resource.menu.model.ComponenteMenuDTO;
import com.comidaalpaso.api.resource.menu.model.CreateItemMenuRequest;
import com.comidaalpaso.api.resource.menu.model.ItemMenuDTO;
import com.comidaalpaso.api.resource.menu.model.OpcionArmaPlatoDTO;
import com.comidaalpaso.api.resource.menu.model.UpdateItemMenuRequest;
import com.comidaalpaso.api.shared.exception.ReglaDeNegocioException;
import com.comidaalpaso.api.shared.exception.ResourceNotFoundException;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MenuServiceImpl implements MenuService {

    private final MenuDAO menuDAO;
    private final RestauranteDAO restauranteDAO;

    public MenuServiceImpl(MenuDAO menuDAO, RestauranteDAO restauranteDAO) {
        this.menuDAO = menuDAO;
        this.restauranteDAO = restauranteDAO;
    }

    @Override
    public List<CategoriaMenuDTO> listarCategorias() {
        return menuDAO.listarCategorias().stream().map(CategoriaMenuDTO::from).toList();
    }

    @Override
    public UUID crearItem(CreateItemMenuRequest req, UUID usuarioId, Rol rol) {
        verificarOwnership(req.getRestauranteId(), usuarioId, rol);
        return menuDAO.crearItem(
            req.getRestauranteId(), req.getCategoriaCodigo(), req.getNombre(),
            req.getDescripcion(), req.getPrecio(), req.getImagenUrl(),
            req.getPesoGramos(), req.getPorciones(), req.getTiempoPreparacion(),
            req.getInformacionNutricional(), req.isEsMenuCompuesto(), req.isEsArmaPlato()
        );
    }

    @Override
    public void actualizarItem(UUID id, UpdateItemMenuRequest req, UUID usuarioId, Rol rol) {
        verificarOwnershipDeItem(id, usuarioId, rol);
        menuDAO.actualizarItem(
            id, req.getCategoriaCodigo(), req.getNombre(), req.getDescripcion(),
            req.getPrecio(), req.getImagenUrl(), req.getPesoGramos(), req.getPorciones(),
            req.getTiempoPreparacion(), req.getInformacionNutricional()
        );
    }

    @Override
    public void toggleItem(UUID id, boolean disponible, UUID usuarioId, Rol rol) {
        verificarOwnershipDeItem(id, usuarioId, rol);
        menuDAO.toggleItem(id, disponible);
    }

    @Override
    public void eliminarItem(UUID id, UUID usuarioId, Rol rol) {
        verificarOwnershipDeItem(id, usuarioId, rol);
        menuDAO.eliminarItem(id);
    }

    @Override
    public UUID agregarComponenteMenu(UUID menuId, AgregarComponenteMenuRequest req, UUID usuarioId, Rol rol) {
        verificarOwnershipDeItem(menuId, usuarioId, rol);
        return menuDAO.agregarComponenteMenu(
            menuId, req.getItemId(), req.getRol(), req.isObligatorio(), req.getOrden()
        );
    }

    @Override
    public void quitarComponenteMenu(UUID menuId, UUID itemId, UUID usuarioId, Rol rol) {
        verificarOwnershipDeItem(menuId, usuarioId, rol);
        menuDAO.quitarComponenteMenu(menuId, itemId);
    }

    @Override
    public List<ComponenteMenuDTO> listarComponentesMenu(UUID menuId) {
        return menuDAO.listarComponentesMenu(menuId).stream()
            .map(ComponenteMenuDTO::from)
            .toList();
    }

    @Override
    public UUID agregarComponenteArmaPlato(UUID armaPlatoId, AgregarComponenteArmaPlatoRequest req,
                                            UUID usuarioId, Rol rol) {
        verificarOwnershipDeItem(armaPlatoId, usuarioId, rol);
        return menuDAO.agregarComponenteArmaPlato(
            armaPlatoId, req.getItemId(), req.getTipo(), req.getPrecioExtra()
        );
    }

    @Override
    public List<OpcionArmaPlatoDTO> listarOpcionesArmaPlato(UUID armaPlatoId) {
        return menuDAO.listarOpcionesArmaPlato(armaPlatoId).stream()
            .map(OpcionArmaPlatoDTO::from)
            .toList();
    }

    @Override
    public List<ItemMenuDTO> listarItems(UUID restauranteId, String categoriaCodigo,
                                          String etiquetaCodigo, boolean soloDisponibles) {
        return menuDAO.listarItems(restauranteId, categoriaCodigo, etiquetaCodigo, soloDisponibles)
            .stream().map(ItemMenuDTO::from).toList();
    }

    // ─── helpers de ownership ──────────────────────────────────────────────────

    private void verificarOwnership(UUID restauranteId, UUID usuarioId, Rol rol) {
        if (rol != Rol.RESTAURANTE) return;
        UUID miRestaurante = restauranteDAO.findRestauranteIdByUsuarioId(usuarioId)
            .orElseThrow(() -> new ReglaDeNegocioException("El usuario no tiene un restaurante asignado"));
        if (!miRestaurante.equals(restauranteId)) {
            throw new AccessDeniedException("No tienes permisos para gestionar ese restaurante");
        }
    }

    private void verificarOwnershipDeItem(UUID itemId, UUID usuarioId, Rol rol) {
        if (rol != Rol.RESTAURANTE) return;
        UUID restauranteId = menuDAO.findRestauranteIdByItemId(itemId)
            .orElseThrow(() -> new ResourceNotFoundException("Ítem de menú no encontrado"));
        verificarOwnership(restauranteId, usuarioId, rol);
    }
}
