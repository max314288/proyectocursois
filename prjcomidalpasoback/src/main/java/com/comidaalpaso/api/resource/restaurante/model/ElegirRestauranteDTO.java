package com.comidaalpaso.api.resource.restaurante.model;

import com.comidaalpaso.api.resource.etiqueta.model.EtiquetaDTO;
import com.comidaalpaso.api.resource.menu.model.CategoriaMenuDTO;

import java.util.List;

public class ElegirRestauranteDTO {

    private RestauranteDTO restaurante;
    private List<CategoriaMenuDTO> categorias;
    private List<EtiquetaDTO> etiquetas;
    private List<ItemMenuConDetalleDTO> items;

    public ElegirRestauranteDTO() { }

    public ElegirRestauranteDTO(RestauranteDTO restaurante,
                                 List<CategoriaMenuDTO> categorias,
                                 List<EtiquetaDTO> etiquetas,
                                 List<ItemMenuConDetalleDTO> items) {
        this.restaurante = restaurante;
        this.categorias = categorias;
        this.etiquetas = etiquetas;
        this.items = items;
    }

    public RestauranteDTO getRestaurante() { return restaurante; }
    public void setRestaurante(RestauranteDTO restaurante) { this.restaurante = restaurante; }
    public List<CategoriaMenuDTO> getCategorias() { return categorias; }
    public void setCategorias(List<CategoriaMenuDTO> categorias) { this.categorias = categorias; }
    public List<EtiquetaDTO> getEtiquetas() { return etiquetas; }
    public void setEtiquetas(List<EtiquetaDTO> etiquetas) { this.etiquetas = etiquetas; }
    public List<ItemMenuConDetalleDTO> getItems() { return items; }
    public void setItems(List<ItemMenuConDetalleDTO> items) { this.items = items; }
}
