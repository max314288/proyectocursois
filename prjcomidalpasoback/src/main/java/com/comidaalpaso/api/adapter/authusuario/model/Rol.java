package com.comidaalpaso.api.adapter.authusuario.model;

import java.util.Arrays;

/**
 * Roles definidos en la tabla {@code usuarios}.
 *
 * <p>El check constraint en SQL Server usa valores en MINÚSCULA:
 * {@code 'cliente', 'admin', 'restaurante', 'repartidor'}. Esta enum
 * mantiene constantes en MAYÚSCULA (convención Java) y mapea a/desde
 * el formato BD vía {@link #dbValue()} y {@link #fromDb(String)}.
 *
 * <p>SOLID-S: única responsabilidad — representar y convertir roles.
 */
public enum Rol {
    CLIENTE("cliente"),
    ADMIN("admin"),
    RESTAURANTE("restaurante"),
    REPARTIDOR("repartidor");

    private final String dbValue;

    Rol(String dbValue) {
        this.dbValue = dbValue;
    }

    /** Valor exacto que se persiste en la columna {@code rol} de SQL Server. */
    public String dbValue() {
        return dbValue;
    }

    /**
     * Convierte el string almacenado en BD a la enum correspondiente.
     *
     * @throws IllegalArgumentException si el valor no coincide con ningún rol válido.
     */
    public static Rol fromDb(String value) {
        return Arrays.stream(values())
            .filter(r -> r.dbValue.equalsIgnoreCase(value))
            .findFirst()
            .orElseThrow(() -> new IllegalArgumentException("Rol desconocido: " + value));
    }
}
