package com.comidaalpaso.api.business.menu.impl;

import com.comidaalpaso.api.adapter.menu.MenuDAO;
import com.comidaalpaso.api.business.menu.MenuService;
import com.comidaalpaso.api.resource.menu.model.AgregarComponenteArmaPlatoRequest;
import com.comidaalpaso.api.resource.menu.model.AgregarComponenteMenuRequest;
import com.comidaalpaso.api.resource.menu.model.CategoriaMenuDTO;
import com.comidaalpaso.api.resource.menu.model.ComponenteMenuDTO;
import com.comidaalpaso.api.resource.menu.model.CreateItemMenuRequest;
import com.comidaalpaso.api.resource.menu.model.ItemMenuDTO;
import com.comidaalpaso.api.resource.menu.model.OpcionArmaPlatoDTO;
import com.comidaalpaso.api.resource.menu.model.UpdateItemMenuRequest;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
public class MenuServiceImpl implements MenuService {

    private final MenuDAO menuDAO;

    public MenuServiceImpl(MenuDAO menuDAO) {
        this.menuDAO = menuDAO;
    }

    @Override
    public List<CategoriaMenuDTO> listarCategorias() {
        return menuDAO.listarCategorias().stream().map(CategoriaMenuDTO::from).toList();
    }

    @Override
    public UUID crearItem(CreateItemMenuRequest req) {
        return menuDAO.crearItem(
            req.getRestauranteId(), req.getCategoriaCodigo(), req.getNombre(),
            req.getDescripcion(), req.getPrecio(), req.getImagenUrl(),
            req.getPesoGramos(), req.getPorciones(), req.getTiempoPreparacion(),
            req.getInformacionNutricional(), req.isEsMenuCompuesto(), req.isEsArmaPlato()
        );
    }

    @Override
    public void actualizarItem(UUID id, UpdateItemMenuRequest req) {
        menuDAO.actualizarItem(
            id, req.getCategoriaCodigo(), req.getNombre(), req.getDescripcion(),
            req.getPrecio(), req.getImagenUrl(), req.getPesoGramos(), req.getPorciones(),
            req.getTiempoPreparacion(), req.getInformacionNutricional()
        );
    }

    @Override
    public void toggleItem(UUID id, boolean disponible) {
        menuDAO.toggleItem(id, disponible);
    }

    @Override
    public void eliminarItem(UUID id) {
        menuDAO.eliminarItem(id);
    }

    @Override
    public UUID agregarComponenteMenu(UUID menuId, AgregarComponenteMenuRequest req) {
        return menuDAO.agregarComponenteMenu(
            menuId, req.getItemId(), req.getRol(), req.isObligatorio(), req.getOrden()
        );
    }

    @Override
    public void quitarComponenteMenu(UUID menuId, UUID itemId) {
        menuDAO.quitarComponenteMenu(menuId, itemId);
    }

    @Override
    public List<ComponenteMenuDTO> listarComponentesMenu(UUID menuId) {
        return menuDAO.listarComponentesMenu(menuId).stream()
            .map(ComponenteMenuDTO::from)
            .toList();
    }

    @Override
    public UUID agregarComponenteArmaPlato(UUID armaPlatoId, AgregarComponenteArmaPlatoRequest req) {
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
}
