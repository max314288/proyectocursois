package com.comidaalpaso.api.resource.restaurante;

import com.comidaalpaso.api.business.restaurante.RestauranteService;
import com.comidaalpaso.api.resource.restaurante.model.CreateRestauranteRequest;
import com.comidaalpaso.api.resource.restaurante.model.RestauranteDTO;
import com.comidaalpaso.api.resource.restaurante.model.ToggleRestauranteRequest;
import com.comidaalpaso.api.resource.restaurante.model.UpdateRestauranteRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/restaurantes")
public class RestauranteResource {

    private final RestauranteService restauranteService;

    public RestauranteResource(RestauranteService restauranteService) {
        this.restauranteService = restauranteService;
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, UUID>> crear(@Valid @RequestBody CreateRestauranteRequest req) {
        UUID id = restauranteService.crear(req);
        return ResponseEntity.ok(Map.of("id", id));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<RestauranteDTO>> listar(
            @RequestParam(defaultValue = "false") boolean soloActivos) {
        return ResponseEntity.ok(restauranteService.listar(soloActivos));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> actualizar(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateRestauranteRequest req) {
        restauranteService.actualizar(id, req);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PatchMapping("/{id}/toggle")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Boolean>> toggle(
            @PathVariable UUID id,
            @Valid @RequestBody ToggleRestauranteRequest req) {
        restauranteService.toggle(id, req.getActivo());
        return ResponseEntity.accepted().body(Map.of("ok", true));
    }
}
