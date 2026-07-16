package com.comidaalpaso.api.shared.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.ArrayList;
import java.util.List;

/**
 * Configuración CORS para que las 3 apps Next.js puedan llamar al API.
 *
 * <p>Origins permitidos se leen de {@code cors.allowed-origins} en {@code application.properties}:
 * {@code localhost:3000, localhost:3001, localhost:3002}.
 *
 * <p>Además se permite cualquier subdominio de {@code devtunnels.ms} (VS Code dev tunnels)
 * para poder exponer las apps locales por túnel durante pruebas/demos.
 */
@Configuration
public class CorsConfig {

    @Value("${cors.allowed-origins}")
    private String allowedOrigins;

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration cfg = new CorsConfiguration();
        List<String> patterns = new ArrayList<>(List.of(allowedOrigins.split(",")));
        patterns.add("https://*.trycloudflare.com");
        cfg.setAllowedOriginPatterns(patterns);
        cfg.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        cfg.setAllowedHeaders(List.of("Authorization", "Content-Type", "Accept"));
        cfg.setExposedHeaders(List.of("Authorization"));
        cfg.setAllowCredentials(true);
        cfg.setMaxAge(3600L);

        UrlBasedCorsConfigurationSource src = new UrlBasedCorsConfigurationSource();
        src.registerCorsConfiguration("/**", cfg);
        return src;
    }    
}
