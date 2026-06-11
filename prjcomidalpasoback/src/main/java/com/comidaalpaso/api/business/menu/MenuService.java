package com.comidaalpaso.api.business.menu;

import com.comidaalpaso.api.resource.menu.model.AgregarComponenteArmaPlatoRequest;
import com.comidaalpaso.api.resource.menu.model.AgregarComponenteMenuRequest;
import com.comidaalpaso.api.resource.menu.model.CategoriaMenuDTO;
import com.comidaalpaso.api.resource.menu.model.ComponenteMenuDTO;
import com.comidaalpaso.api.resource.menu.model.CreateItemMenuRequest;
import com.comidaalpaso.api.resource.menu.model.ItemMenuDTO;
import com.comidaalpaso.api.resource.menu.model.OpcionArmaPlatoDTO;
import com.comidaalpaso.api.resource.menu.model.UpdateItemMenuRequest;

import java.util.List;
import java.util.UUID;

public interface MenuService {
    List<CategoriaMenuDTO> listarCategorias();
    UUID crearItem(CreateItemMenuRequest req);
    void actualizarItem(UUID id, UpdateItemMenuRequest req);
    void toggleItem(UUID id, boolean disponible);
    void eliminarItem(UUID id);
    UUID agregarComponenteMenu(UUID menuId, AgregarComponenteMenuRequest req);
    void quitarComponenteMenu(UUID menuId, UUID itemId);
    List<ComponenteMenuDTO> listarComponentesMenu(UUID menuId);
    UUID agregarComponenteArmaPlato(UUID armaPlatoId, AgregarComponenteArmaPlatoRequest req);
    List<OpcionArmaPlatoDTO> listarOpcionesArmaPlato(UUID armaPlatoId);
    List<ItemMenuDTO> listarItems(UUID restauranteId, String categoriaCodigo,
                                   String etiquetaCodigo, boolean soloDisponibles);
}
