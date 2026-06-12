package com.comidaalpaso.api.resource.restaurante.model;

import com.comidaalpaso.api.adapter.menu.model.ItemListadoRow;
import com.comidaalpaso.api.resource.etiqueta.model.EtiquetaDTO;
import com.comidaalpaso.api.resource.menu.model.ComponenteMenuDTO;
import com.comidaalpaso.api.resource.menu.model.OpcionArmaPlatoDTO;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class ItemMenuConDetalleDTO {

    private UUID id;
    private String nombre;
    private String categoria;
    private String descripcion;
    private BigDecimal precio;
    private BigDecimal pesoGramos;
    private String informacionNutricional;
    private boolean esMenuCompuesto;
    private boolean esArmaPlato;
    private boolean disponible;
    private String imagenUrl;
    private List<EtiquetaDTO> etiquetas;
    private List<ComponenteMenuDTO> componentes;
    private List<OpcionArmaPlatoDTO> opcionesArmaPlato;

    public ItemMenuConDetalleDTO() { }

    public static ItemMenuConDetalleDTO from(ItemListadoRow r,
                                             List<EtiquetaDTO> etiquetas,
                                             List<ComponenteMenuDTO> componentes,
                                             List<OpcionArmaPlatoDTO> opcionesArmaPlato) {
        ItemMenuConDetalleDTO dto = new ItemMenuConDetalleDTO();
        dto.setId(r.getId());
        dto.setNombre(r.getNombre());
        dto.setCategoria(r.getCategoria());
        dto.setDescripcion(r.getDescripcion());
        dto.setPrecio(r.getPrecio());
        dto.setPesoGramos(r.getPesoGramos());
        dto.setInformacionNutricional(r.getInformacionNutricional());
        dto.setEsMenuCompuesto(r.getEsMenuCompuesto() != null && r.getEsMenuCompuesto() == 1);
        dto.setEsArmaPlato(r.getEsArmaPlato() != null && r.getEsArmaPlato() == 1);
        dto.setDisponible(r.isDisponible());
        dto.setImagenUrl(r.getImagenUrl());
        dto.setEtiquetas(etiquetas);
        dto.setComponentes(componentes);
        dto.setOpcionesArmaPlato(opcionesArmaPlato);
        return dto;
    }

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getCategoria() { return categoria; }
    public void setCategoria(String categoria) { this.categoria = categoria; }
    public String getDescripcion() { return descripcion; }
    public void setDescripcion(String descripcion) { this.descripcion = descripcion; }
    public BigDecimal getPrecio() { return precio; }
    public void setPrecio(BigDecimal precio) { this.precio = precio; }
    public BigDecimal getPesoGramos() { return pesoGramos; }
    public void setPesoGramos(BigDecimal pesoGramos) { this.pesoGramos = pesoGramos; }
    public String getInformacionNutricional() { return informacionNutricional; }
    public void setInformacionNutricional(String v) { this.informacionNutricional = v; }
    public boolean isEsMenuCompuesto() { return esMenuCompuesto; }
    public void setEsMenuCompuesto(boolean esMenuCompuesto) { this.esMenuCompuesto = esMenuCompuesto; }
    public boolean isEsArmaPlato() { return esArmaPlato; }
    public void setEsArmaPlato(boolean esArmaPlato) { this.esArmaPlato = esArmaPlato; }
    public boolean isDisponible() { return disponible; }
    public void setDisponible(boolean disponible) { this.disponible = disponible; }
    public String getImagenUrl() { return imagenUrl; }
    public void setImagenUrl(String imagenUrl) { this.imagenUrl = imagenUrl; }
    public List<EtiquetaDTO> getEtiquetas() { return etiquetas; }
    public void setEtiquetas(List<EtiquetaDTO> etiquetas) { this.etiquetas = etiquetas; }
    public List<ComponenteMenuDTO> getComponentes() { return componentes; }
    public void setComponentes(List<ComponenteMenuDTO> componentes) { this.componentes = componentes; }
    public List<OpcionArmaPlatoDTO> getOpcionesArmaPlato() { return opcionesArmaPlato; }
    public void setOpcionesArmaPlato(List<OpcionArmaPlatoDTO> opcionesArmaPlato) { this.opcionesArmaPlato = opcionesArmaPlato; }
}
