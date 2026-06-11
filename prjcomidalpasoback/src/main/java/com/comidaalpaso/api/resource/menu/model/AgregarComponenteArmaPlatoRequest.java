package com.comidaalpaso.api.resource.menu.model;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.math.BigDecimal;
import java.util.UUID;

public class AgregarComponenteArmaPlatoRequest {

    @NotNull(message = "El itemId es obligatorio")
    private UUID itemId;

    @NotBlank(message = "El tipo es obligatorio")
    @Pattern(regexp = "base|proteina|topping|bebida",
             message = "El tipo debe ser: base, proteina, topping o bebida")
    private String tipo;

    private BigDecimal precioExtra = BigDecimal.ZERO;

    public UUID getItemId() { return itemId; }
    public void setItemId(UUID itemId) { this.itemId = itemId; }
    public String getTipo() { return tipo; }
    public void setTipo(String tipo) { this.tipo = tipo; }
    public BigDecimal getPrecioExtra() { return precioExtra; }
    public void setPrecioExtra(BigDecimal precioExtra) { this.precioExtra = precioExtra; }
}
