package com.comidaalpaso.api.resource.etiqueta.model;

import com.comidaalpaso.api.adapter.etiqueta.model.Etiqueta;

public class EtiquetaDTO {
    private String codigo;
    private String nombre;
    private String color;

    public EtiquetaDTO() { }

    public static EtiquetaDTO from(Etiqueta e) {
        EtiquetaDTO dto = new EtiquetaDTO();
        dto.setCodigo(e.getCodigo());
        dto.setNombre(e.getNombre());
        dto.setColor(e.getColor());
        return dto;
    }

    public String getCodigo() { return codigo; }
    public void setCodigo(String codigo) { this.codigo = codigo; }
    public String getNombre() { return nombre; }
    public void setNombre(String nombre) { this.nombre = nombre; }
    public String getColor() { return color; }
    public void setColor(String color) { this.color = color; }
}
