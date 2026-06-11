package com.comidaalpaso.api;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * Punto de entrada del backend de Comida al Paso.
 *
 * <p>Arranca un servidor embebido Tomcat en el puerto 8080 (configurable
 * en {@code application.properties}) y expone los endpoints REST de la
 * capa {@code resource/} para las 3 apps frontend (web, admin, restaurant).
 */
@SpringBootApplication
public class ApiApplication {

    public static void main(String[] args) {
        SpringApplication.run(ApiApplication.class, args);
    }
}
