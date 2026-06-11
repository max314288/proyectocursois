package com.comidaalpaso.api.resource.etiqueta;

import com.comidaalpaso.api.business.etiqueta.EtiquetaService;
import com.comidaalpaso.api.resource.etiqueta.model.AsignarEtiquetaRequest;
import com.comidaalpaso.api.resource.etiqueta.model.EtiquetaDTO;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/items/{itemId}/etiquetas")
public class EtiquetaResource {

    private final EtiquetaService etiquetaService;

    public EtiquetaResource(EtiquetaService etiquetaService) {
        this.etiquetaService = etiquetaService;
    }

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, Boolean>> asignar(
            @PathVariable UUID itemId,
            @Valid @RequestBody AsignarEtiquetaRequest req) {
        etiquetaService.asignar(itemId, req);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @DeleteMapping("/{codigo}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, Boolean>> quitar(
            @PathVariable UUID itemId,
            @PathVariable String codigo) {
        etiquetaService.quitar(itemId, codigo);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<EtiquetaDTO>> listar(@PathVariable UUID itemId) {
        return ResponseEntity.ok(etiquetaService.etiquetasDeItem(itemId));
    }
}
