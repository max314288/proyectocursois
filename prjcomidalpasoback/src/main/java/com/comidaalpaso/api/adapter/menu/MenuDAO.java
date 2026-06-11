package com.comidaalpaso.api.adapter.menu;

import com.comidaalpaso.api.adapter.menu.model.CategoriaMenu;
import com.comidaalpaso.api.adapter.menu.model.ComponenteMenuRow;
import com.comidaalpaso.api.adapter.menu.model.ItemListadoRow;
import com.comidaalpaso.api.adapter.menu.model.OpcionArmaPlatoRow;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public interface MenuDAO {
    // Categorías
    List<CategoriaMenu> listarCategorias();

    // Ítems
    UUID crearItem(UUID restauranteId, String categoriaCodigo, String nombre, String descripcion,
                   BigDecimal precio, String imagenUrl, BigDecimal pesoGramos, Integer porciones,
                   Integer tiempoPreparacion, String informacionNutricional,
                   boolean esMenuCompuesto, boolean esArmaPlato);
    void actualizarItem(UUID id, String categoriaCodigo, String nombre, String descripcion,
                        BigDecimal precio, String imagenUrl, BigDecimal pesoGramos, Integer porciones,
                        Integer tiempoPreparacion, String informacionNutricional);
    void toggleItem(UUID id, boolean disponible);
    void eliminarItem(UUID id);

    // Componentes de menú compuesto
    UUID agregarComponenteMenu(UUID menuId, UUID itemId, String rol, boolean obligatorio, int orden);
    void quitarComponenteMenu(UUID menuId, UUID itemId);
    List<ComponenteMenuRow> listarComponentesMenu(UUID menuId);

    // Arma tu plato
    UUID agregarComponenteArmaPlato(UUID armaPlatoId, UUID itemId, String tipo, BigDecimal precioExtra);
    List<OpcionArmaPlatoRow> listarOpcionesArmaPlato(UUID armaPlatoId);

    // Listado completo con filtros
    List<ItemListadoRow> listarItems(UUID restauranteId, String categoriaCodigo,
                                     String etiquetaCodigo, boolean soloDisponibles);
}
