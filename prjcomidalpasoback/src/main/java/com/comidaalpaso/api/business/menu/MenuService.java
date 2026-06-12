package com.comidaalpaso.api.business.menu;

import com.comidaalpaso.api.adapter.authusuario.model.Rol;
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
    UUID crearItem(CreateItemMenuRequest req, UUID usuarioId, Rol rol);
    void actualizarItem(UUID id, UpdateItemMenuRequest req, UUID usuarioId, Rol rol);
    void toggleItem(UUID id, boolean disponible, UUID usuarioId, Rol rol);
    void eliminarItem(UUID id, UUID usuarioId, Rol rol);
    UUID agregarComponenteMenu(UUID menuId, AgregarComponenteMenuRequest req, UUID usuarioId, Rol rol);
    void quitarComponenteMenu(UUID menuId, UUID itemId, UUID usuarioId, Rol rol);
    List<ComponenteMenuDTO> listarComponentesMenu(UUID menuId);
    UUID agregarComponenteArmaPlato(UUID armaPlatoId, AgregarComponenteArmaPlatoRequest req, UUID usuarioId, Rol rol);
    List<OpcionArmaPlatoDTO> listarOpcionesArmaPlato(UUID armaPlatoId);
    List<ItemMenuDTO> listarItems(UUID restauranteId, String categoriaCodigo,
                                   String etiquetaCodigo, boolean soloDisponibles);
}
