package com.comidaalpaso.api.resource.pedido.model;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.util.List;
import java.util.UUID;

public class CreatePedidoRequest {

    @NotNull(message = "El restauranteId es obligatorio")
    private UUID restauranteId;

    @NotNull(message = "El modo es obligatorio")
    @Pattern(regexp = "recojo|delivery|salon",
             message = "El modo debe ser: recojo, delivery o salon")
    private String modo;

    @NotEmpty(message = "Debe incluir al menos un ítem")
    @Valid
    private List<ItemPedidoRequest> items;

    @Size(max = 1000)
    private String notas;

    // delivery
    @Size(max = 500)
    private String direccion;

    @Size(max = 300)
    private String referencia;

    private BigDecimal latitud;
    private BigDecimal longitud;

    // salon
    private UUID mesaId;
    private Integer numComensales;

    public UUID getRestauranteId() { return restauranteId; }
    public void setRestauranteId(UUID restauranteId) { this.restauranteId = restauranteId; }
    public String getModo() { return modo; }
    public void setModo(String modo) { this.modo = modo; }
    public List<ItemPedidoRequest> getItems() { return items; }
    public void setItems(List<ItemPedidoRequest> items) { this.items = items; }
    public String getNotas() { return notas; }
    public void setNotas(String notas) { this.notas = notas; }
    public String getDireccion() { return direccion; }
    public void setDireccion(String direccion) { this.direccion = direccion; }
    public String getReferencia() { return referencia; }
    public void setReferencia(String referencia) { this.referencia = referencia; }
    public BigDecimal getLatitud() { return latitud; }
    public void setLatitud(BigDecimal latitud) { this.latitud = latitud; }
    public BigDecimal getLongitud() { return longitud; }
    public void setLongitud(BigDecimal longitud) { this.longitud = longitud; }
    public UUID getMesaId() { return mesaId; }
    public void setMesaId(UUID mesaId) { this.mesaId = mesaId; }
    public Integer getNumComensales() { return numComensales; }
    public void setNumComensales(Integer numComensales) { this.numComensales = numComensales; }
}
