package com.comidaalpaso.api.shared.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;

/**
 * Expone el {@link PasswordEncoder} como bean.
 *
 * <p><strong>SOLID-S:</strong> única responsabilidad — proveer el encoder.
 * Strength 12 ≈ ~250ms por hash en hardware estándar (~2^12 iteraciones).
 */
@Configuration
public class PasswordConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
