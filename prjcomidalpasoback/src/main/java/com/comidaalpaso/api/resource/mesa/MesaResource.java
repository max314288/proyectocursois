package com.comidaalpaso.api.resource.mesa;

import com.comidaalpaso.api.business.mesa.MesaService;
import com.comidaalpaso.api.resource.mesa.model.CambiarEstadoMesaRequest;
import com.comidaalpaso.api.resource.mesa.model.CreateMesaRequest;
import com.comidaalpaso.api.resource.mesa.model.MesaDTO;
import com.comidaalpaso.api.resource.mesa.model.UpdateMesaRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
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
@RequestMapping("/api/mesas")
public class MesaResource {

    private final MesaService mesaService;

    public MesaResource(MesaService mesaService) {
        this.mesaService = mesaService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, UUID>> crear(@Valid @RequestBody CreateMesaRequest req) {
        UUID id = mesaService.crear(req);
        return ResponseEntity.ok(Map.of("id", id));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<MesaDTO>> listar(
            @RequestParam UUID restauranteId,
            @RequestParam(required = false) String estado) {
        return ResponseEntity.ok(mesaService.listar(restauranteId, estado));
    }

    @PutMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, Boolean>> actualizar(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateMesaRequest req) {
        mesaService.actualizar(id, req);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, Boolean>> cambiarEstado(
            @PathVariable UUID id,
            @Valid @RequestBody CambiarEstadoMesaRequest req) {
        mesaService.cambiarEstado(id, req.getEstado());
        return ResponseEntity.accepted().body(Map.of("ok", true));
    }

    @DeleteMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, Boolean>> eliminar(@PathVariable UUID id) {
        mesaService.eliminar(id);
        return ResponseEntity.ok(Map.of("ok", true));
    }
}
