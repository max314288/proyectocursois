package com.comidaalpaso.api.resource.pago;

import com.comidaalpaso.api.business.pago.PagoService;
import com.comidaalpaso.api.resource.pago.model.ConfirmarPagoRequest;
import com.comidaalpaso.api.resource.pago.model.PagoDTO;
import com.comidaalpaso.api.resource.pago.model.RegistrarPagoRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/pagos")
public class PagoResource {

    private final PagoService pagoService;

    public PagoResource(PagoService pagoService) {
        this.pagoService = pagoService;
    }

    @PostMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, UUID>> registrar(@Valid @RequestBody RegistrarPagoRequest req) {
        UUID id = pagoService.registrar(req);
        return ResponseEntity.ok(Map.of("id", id));
    }

    @PatchMapping("/{id}/confirmar")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, Boolean>> confirmar(
            @PathVariable UUID id,
            @RequestBody(required = false) ConfirmarPagoRequest req) {
        pagoService.confirmar(id, req != null ? req.getReferenciaExterna() : null);
        return ResponseEntity.accepted().body(Map.of("ok", true));
    }

    @PatchMapping("/{id}/fallo")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, Boolean>> fallo(@PathVariable UUID id) {
        pagoService.fallo(id);
        return ResponseEntity.accepted().body(Map.of("ok", true));
    }

    @GetMapping("/pedido/{pedidoId}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PagoDTO> obtener(@PathVariable UUID pedidoId) {
        return ResponseEntity.ok(pagoService.obtener(pedidoId));
    }
}
