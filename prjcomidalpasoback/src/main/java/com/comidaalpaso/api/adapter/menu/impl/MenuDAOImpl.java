package com.comidaalpaso.api.adapter.menu.impl;

import com.comidaalpaso.api.adapter.menu.MenuDAO;
import com.comidaalpaso.api.adapter.menu.model.CategoriaMenu;
import com.comidaalpaso.api.adapter.menu.model.ComponenteMenuRow;
import com.comidaalpaso.api.adapter.menu.model.ItemListadoRow;
import com.comidaalpaso.api.adapter.menu.model.OpcionArmaPlatoRow;
import com.comidaalpaso.api.shared.exception.ConflictoRecursoException;
import com.comidaalpaso.api.shared.exception.ReglaDeNegocioException;
import com.comidaalpaso.api.shared.exception.ResourceNotFoundException;
import jakarta.persistence.EntityManager;
import jakarta.persistence.ParameterMode;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.PersistenceException;
import jakarta.persistence.StoredProcedureQuery;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Component
public class MenuDAOImpl implements MenuDAO {

    @PersistenceContext
    private EntityManager em;

    // ─── sp_listar_categorias_globales ─────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<CategoriaMenu> listarCategorias() {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_listar_categorias_globales");

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        return rows.stream().map(this::mapCategoria).toList();
    }

    // ─── sp_crear_item_menu ────────────────────────────────────────────────────

    @Override
    @Transactional
    public UUID crearItem(UUID restauranteId, String categoriaCodigo, String nombre, String descripcion,
                          BigDecimal precio, String imagenUrl, BigDecimal pesoGramos, Integer porciones,
                          Integer tiempoPreparacion, String informacionNutricional,
                          boolean esMenuCompuesto, boolean esArmaPlato) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_crear_item_menu")
            .registerStoredProcedureParameter("restaurante_id",          String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("categoria_codigo",        String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("nombre",                  String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("descripcion",             String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("precio",                  BigDecimal.class, ParameterMode.IN)
            .registerStoredProcedureParameter("imagen_url",              String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("peso_gramos",             BigDecimal.class, ParameterMode.IN)
            .registerStoredProcedureParameter("porciones",               Integer.class,    ParameterMode.IN)
            .registerStoredProcedureParameter("tiempo_preparacion",      Integer.class,    ParameterMode.IN)
            .registerStoredProcedureParameter("informacion_nutricional", String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("es_menu_compuesto",       Short.class,      ParameterMode.IN)
            .registerStoredProcedureParameter("es_arma_plato",           Short.class,      ParameterMode.IN)
            .registerStoredProcedureParameter("nuevo_id",                String.class,     ParameterMode.OUT)
            .setParameter("restaurante_id",          restauranteId.toString())
            .setParameter("categoria_codigo",        categoriaCodigo)
            .setParameter("nombre",                  nombre)
            .setParameter("descripcion",             descripcion)
            .setParameter("precio",                  precio)
            .setParameter("imagen_url",              imagenUrl)
            .setParameter("peso_gramos",             pesoGramos)
            .setParameter("porciones",               porciones)
            .setParameter("tiempo_preparacion",      tiempoPreparacion)
            .setParameter("informacion_nutricional", informacionNutricional)
            .setParameter("es_menu_compuesto",       (short) (esMenuCompuesto ? 1 : 0))
            .setParameter("es_arma_plato",           (short) (esArmaPlato     ? 1 : 0));

        try {
            q.execute();
            Object out = q.getOutputParameterValue("nuevo_id");
            return out instanceof UUID u ? u : UUID.fromString(out.toString());
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_actualizar_item_menu ───────────────────────────────────────────────

    @Override
    @Transactional
    public void actualizarItem(UUID id, String categoriaCodigo, String nombre, String descripcion,
                               BigDecimal precio, String imagenUrl, BigDecimal pesoGramos, Integer porciones,
                               Integer tiempoPreparacion, String informacionNutricional) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_actualizar_item_menu")
            .registerStoredProcedureParameter("id",                      String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("categoria_codigo",        String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("nombre",                  String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("descripcion",             String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("precio",                  BigDecimal.class, ParameterMode.IN)
            .registerStoredProcedureParameter("imagen_url",              String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("peso_gramos",             BigDecimal.class, ParameterMode.IN)
            .registerStoredProcedureParameter("porciones",               Integer.class,    ParameterMode.IN)
            .registerStoredProcedureParameter("tiempo_preparacion",      Integer.class,    ParameterMode.IN)
            .registerStoredProcedureParameter("informacion_nutricional", String.class,     ParameterMode.IN)
            .setParameter("id",                      id.toString())
            .setParameter("categoria_codigo",        categoriaCodigo)
            .setParameter("nombre",                  nombre)
            .setParameter("descripcion",             descripcion)
            .setParameter("precio",                  precio)
            .setParameter("imagen_url",              imagenUrl)
            .setParameter("peso_gramos",             pesoGramos)
            .setParameter("porciones",               porciones)
            .setParameter("tiempo_preparacion",      tiempoPreparacion)
            .setParameter("informacion_nutricional", informacionNutricional);

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_toggle_item_menu ───────────────────────────────────────────────────

    @Override
    @Transactional
    public void toggleItem(UUID id, boolean disponible) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_toggle_item_menu")
            .registerStoredProcedureParameter("id",         String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("disponible", Short.class,  ParameterMode.IN)
            .setParameter("id",         id.toString())
            .setParameter("disponible", (short) (disponible ? 1 : 0));

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_eliminar_item_menu ─────────────────────────────────────────────────

    @Override
    @Transactional
    public void eliminarItem(UUID id) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_eliminar_item_menu")
            .registerStoredProcedureParameter("id", String.class, ParameterMode.IN)
            .setParameter("id", id.toString());

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_agregar_componente_menu ────────────────────────────────────────────

    @Override
    @Transactional
    public UUID agregarComponenteMenu(UUID menuId, UUID itemId, String rol, boolean obligatorio, int orden) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_agregar_componente_menu")
            .registerStoredProcedureParameter("menu_id",     String.class,  ParameterMode.IN)
            .registerStoredProcedureParameter("item_id",     String.class,  ParameterMode.IN)
            .registerStoredProcedureParameter("rol",         String.class,  ParameterMode.IN)
            .registerStoredProcedureParameter("obligatorio", Short.class,   ParameterMode.IN)
            .registerStoredProcedureParameter("orden",       Integer.class, ParameterMode.IN)
            .registerStoredProcedureParameter("nuevo_id",    String.class,  ParameterMode.OUT)
            .setParameter("menu_id",     menuId.toString())
            .setParameter("item_id",     itemId.toString())
            .setParameter("rol",         rol)
            .setParameter("obligatorio", (short) (obligatorio ? 1 : 0))
            .setParameter("orden",       orden);

        try {
            q.execute();
            Object out = q.getOutputParameterValue("nuevo_id");
            return out instanceof UUID u ? u : UUID.fromString(out.toString());
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_quitar_componente_menu ─────────────────────────────────────────────

    @Override
    @Transactional
    public void quitarComponenteMenu(UUID menuId, UUID itemId) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_quitar_componente_menu")
            .registerStoredProcedureParameter("menu_id", String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("item_id", String.class, ParameterMode.IN)
            .setParameter("menu_id", menuId.toString())
            .setParameter("item_id", itemId.toString());

        try {
            q.execute();
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_listar_componentes_menu ────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<ComponenteMenuRow> listarComponentesMenu(UUID menuId) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_listar_componentes_menu")
            .registerStoredProcedureParameter("menu_id", String.class, ParameterMode.IN)
            .setParameter("menu_id", menuId.toString());

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        return rows.stream().map(this::mapComponente).toList();
    }

    // ─── sp_agregar_componente_arma_plato ──────────────────────────────────────

    @Override
    @Transactional
    public UUID agregarComponenteArmaPlato(UUID armaPlatoId, UUID itemId, String tipo, BigDecimal precioExtra) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_agregar_componente_arma_plato")
            .registerStoredProcedureParameter("arma_plato_id", String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("item_id",       String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("tipo",          String.class,     ParameterMode.IN)
            .registerStoredProcedureParameter("precio_extra",  BigDecimal.class, ParameterMode.IN)
            .registerStoredProcedureParameter("nuevo_id",      String.class,     ParameterMode.OUT)
            .setParameter("arma_plato_id", armaPlatoId.toString())
            .setParameter("item_id",       itemId.toString())
            .setParameter("tipo",          tipo)
            .setParameter("precio_extra",  precioExtra != null ? precioExtra : BigDecimal.ZERO);

        try {
            q.execute();
            Object out = q.getOutputParameterValue("nuevo_id");
            return out instanceof UUID u ? u : UUID.fromString(out.toString());
        } catch (PersistenceException ex) {
            throw mapSqlError(ex);
        }
    }

    // ─── sp_listar_opciones_arma_plato ─────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<OpcionArmaPlatoRow> listarOpcionesArmaPlato(UUID armaPlatoId) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_listar_opciones_arma_plato")
            .registerStoredProcedureParameter("arma_plato_id", String.class, ParameterMode.IN)
            .setParameter("arma_plato_id", armaPlatoId.toString());

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        return rows.stream().map(this::mapOpcion).toList();
    }

    // ─── sp_listar_items_completo ──────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public List<ItemListadoRow> listarItems(UUID restauranteId, String categoriaCodigo,
                                             String etiquetaCodigo, boolean soloDisponibles) {
        StoredProcedureQuery q = em.createStoredProcedureQuery("sp_listar_items_completo")
            .registerStoredProcedureParameter("restaurante_id",   String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("categoria_codigo", String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("etiqueta_codigo",  String.class, ParameterMode.IN)
            .registerStoredProcedureParameter("solo_disponibles", Short.class,  ParameterMode.IN)
            .setParameter("restaurante_id",   restauranteId.toString())
            .setParameter("categoria_codigo", categoriaCodigo)
            .setParameter("etiqueta_codigo",  etiquetaCodigo)
            .setParameter("solo_disponibles", (short) (soloDisponibles ? 1 : 0));

        @SuppressWarnings("unchecked")
        List<Object[]> rows = q.getResultList();
        return rows.stream().map(this::mapItemListado).toList();
    }

    // ─── findRestauranteIdByItemId ─────────────────────────────────────────────

    @Override
    @Transactional(readOnly = true)
    public Optional<UUID> findRestauranteIdByItemId(UUID itemId) {
        @SuppressWarnings("unchecked")
        List<Object> result = em.createNativeQuery(
                "SELECT CAST(restaurante_id AS VARCHAR(36)) FROM items_menu WHERE id = CAST(:id AS UNIQUEIDENTIFIER)")
            .setParameter("id", itemId.toString())
            .getResultList();
        if (result.isEmpty()) return Optional.empty();
        return Optional.of(UUID.fromString(result.get(0).toString()));
    }

    // ─── row mappers ───────────────────────────────────────────────────────────

    /** sp_listar_categorias_globales: id, codigo, nombre, descripcion, orden */
    private CategoriaMenu mapCategoria(Object[] row) {
        CategoriaMenu c = new CategoriaMenu();
        int i = 0;
        c.setId(toUuid(row[i++]));
        c.setCodigo((String) row[i++]);
        c.setNombre((String) row[i++]);
        c.setDescripcion((String) row[i++]);
        c.setOrden(toInt(row[i]));
        return c;
    }

    /** sp_listar_componentes_menu: item_id, nombre, categoria, rol, obligatorio, precio, orden */
    private ComponenteMenuRow mapComponente(Object[] row) {
        ComponenteMenuRow r = new ComponenteMenuRow();
        int i = 0;
        r.setItemId(toUuid(row[i++]));
        r.setNombre((String) row[i++]);
        r.setCategoria((String) row[i++]);
        r.setRol((String) row[i++]);
        r.setObligatorio(toShort(row[i++]));
        r.setPrecio(toDecimal(row[i++]));
        r.setOrden(toInt(row[i]));
        return r;
    }

    /** sp_listar_opciones_arma_plato: tipo, item_id, nombre, precio_extra, disponible */
    private OpcionArmaPlatoRow mapOpcion(Object[] row) {
        OpcionArmaPlatoRow r = new OpcionArmaPlatoRow();
        int i = 0;
        r.setTipo((String) row[i++]);
        r.setItemId(toUuid(row[i++]));
        r.setNombre((String) row[i++]);
        r.setPrecioExtra(toDecimal(row[i++]));
        r.setDisponible(toShort(row[i]));
        return r;
    }

    /** sp_listar_items_completo: id, nombre, categoria, descripcion, precio, peso_gramos,
     *  informacion_nutricional, es_menu_compuesto, es_arma_plato, disponible, imagen_url */
    private ItemListadoRow mapItemListado(Object[] row) {
        ItemListadoRow r = new ItemListadoRow();
        int i = 0;
        r.setId(toUuid(row[i++]));
        r.setNombre((String) row[i++]);
        r.setCategoria((String) row[i++]);
        r.setDescripcion((String) row[i++]);
        r.setPrecio(toDecimal(row[i++]));
        r.setPesoGramos(toDecimal(row[i++]));
        r.setInformacionNutricional((String) row[i++]);
        r.setEsMenuCompuesto(toShort(row[i++]));
        r.setEsArmaPlato(toShort(row[i++]));
        r.setDisponible(toShort(row[i++]));
        r.setImagenUrl((String) row[i]);
        return r;
    }

    // ─── error mapping ─────────────────────────────────────────────────────────

    private RuntimeException mapSqlError(PersistenceException ex) {
        String msg = rootMessage(ex);
        // ítems
        if (msg.contains("51001") || msg.contains("51004") || msg.contains("Categoría no existe")) {
            return new ResourceNotFoundException("Categoría no existe", ex);
        }
        if (msg.contains("51002") || msg.contains("51003") || msg.contains("51011")
                || msg.contains("51013") || msg.contains("51014")
                || msg.contains("51022") || msg.contains("51023")
                || msg.contains("menú compuesto") || msg.contains("arma tu plato")
                || msg.contains("mismo restaurante") || msg.contains("contenerse")) {
            return new ReglaDeNegocioException(msg, ex);
        }
        if (msg.contains("51007") || msg.contains("ya fue pedido")) {
            return new ConflictoRecursoException("No se puede eliminar el ítem porque ya fue pedido", ex);
        }
        if (msg.contains("51015") || msg.contains("no estaba asociado")) {
            return new ResourceNotFoundException("El componente no estaba asociado al menú", ex);
        }
        if (msg.contains("51020") || msg.contains("Tipo inválido")) {
            return new ReglaDeNegocioException("Tipo inválido. Debe ser: base, proteina, topping o bebida", ex);
        }
        if (msg.contains("51005") || msg.contains("51006") || msg.contains("Ítem de menú no encontrado")) {
            return new ResourceNotFoundException("Ítem de menú no encontrado", ex);
        }
        if (msg.contains("51010") || msg.contains("51012") || msg.contains("51021")
                || msg.contains("no encontrado")) {
            return new ResourceNotFoundException(msg, ex);
        }
        return ex;
    }

    // ─── type helpers ──────────────────────────────────────────────────────────

    private UUID toUuid(Object v) {
        if (v == null) return null;
        if (v instanceof UUID u) return u;
        return UUID.fromString(v.toString());
    }

    private Short toShort(Object v) {
        if (v == null) return 0;
        if (v instanceof Short s) return s;
        if (v instanceof Number n) return n.shortValue();
        return Short.parseShort(v.toString());
    }

    private Integer toInt(Object v) {
        if (v == null) return 0;
        if (v instanceof Integer i) return i;
        if (v instanceof Number n) return n.intValue();
        return Integer.parseInt(v.toString());
    }

    private BigDecimal toDecimal(Object v) {
        if (v == null) return null;
        if (v instanceof BigDecimal d) return d;
        if (v instanceof Number n) return new BigDecimal(n.toString());
        return new BigDecimal(v.toString());
    }

    private String rootMessage(Throwable t) {
        Throwable cur = t;
        while (cur.getCause() != null && cur.getCause() != cur) cur = cur.getCause();
        return cur.getMessage() == null ? "" : cur.getMessage();
    }
}
