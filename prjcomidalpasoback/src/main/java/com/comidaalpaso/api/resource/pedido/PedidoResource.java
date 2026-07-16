package com.comidaalpaso.api.resource.pedido;

import com.comidaalpaso.api.business.email.EmailService;
import com.comidaalpaso.api.business.pedido.PedidoService;
import com.comidaalpaso.api.resource.pedido.model.AsignarRepartidorRequest;
import com.comidaalpaso.api.resource.pedido.model.CambiarEstadoPedidoRequest;
import com.comidaalpaso.api.resource.pedido.model.CreatePedidoRequest;
import com.comidaalpaso.api.resource.pedido.model.EnviarComprobanteRequest;
import com.comidaalpaso.api.resource.pedido.model.HistorialEstadoDTO;
import com.comidaalpaso.api.resource.pedido.model.PedidoDetalleDTO;
import com.comidaalpaso.api.resource.pedido.model.PedidoResumenDTO;
import com.comidaalpaso.api.shared.security.AuthenticatedUser;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoResource {

    private final PedidoService pedidoService;
    private final EmailService emailService;

    public PedidoResource(PedidoService pedidoService, EmailService emailService) {
        this.pedidoService = pedidoService;
        this.emailService = emailService;
    }

    @PostMapping
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<Map<String, UUID>> crear(
            @Valid @RequestBody CreatePedidoRequest req,
            @AuthenticationPrincipal AuthenticatedUser caller) {
        UUID id = pedidoService.crear(caller.getId(), req);
        return ResponseEntity.ok(Map.of("id", id));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<PedidoDetalleDTO> obtener(@PathVariable UUID id) {
        return ResponseEntity.ok(pedidoService.obtener(id));
    }

    @GetMapping("/restaurante/{restauranteId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<List<PedidoResumenDTO>> listarPorRestaurante(
            @PathVariable UUID restauranteId,
            @RequestParam(required = false) String estado,
            @RequestParam(required = false) String modo,
            @RequestParam(required = false) LocalDate fecha) {
        return ResponseEntity.ok(pedidoService.listarPorRestaurante(restauranteId, estado, modo, fecha));
    }

    @GetMapping("/cliente")
    @PreAuthorize("hasRole('CLIENTE')")
    public ResponseEntity<List<PedidoResumenDTO>> listarPorCliente(
            @AuthenticationPrincipal AuthenticatedUser caller) {
        return ResponseEntity.ok(pedidoService.listarPorCliente(caller.getId()));
    }

    @PatchMapping("/{id}/estado")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE', 'REPARTIDOR')")
    public ResponseEntity<Map<String, Boolean>> cambiarEstado(
            @PathVariable UUID id,
            @Valid @RequestBody CambiarEstadoPedidoRequest req,
            @AuthenticationPrincipal AuthenticatedUser caller) {
        pedidoService.cambiarEstado(id, req.getEstado(), caller.getId());
        return ResponseEntity.accepted().body(Map.of("ok", true));
    }

    @PatchMapping("/{id}/repartidor")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, Boolean>> asignarRepartidor(
            @PathVariable UUID id,
            @Valid @RequestBody AsignarRepartidorRequest req) {
        pedidoService.asignarRepartidor(id, req.getRepartidorId());
        return ResponseEntity.accepted().body(Map.of("ok", true));
    }

    @PostMapping("/{id}/cancelar")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Boolean>> cancelar(@PathVariable UUID id) {
        pedidoService.cancelar(id);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @GetMapping("/{id}/historial")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<HistorialEstadoDTO>> historial(@PathVariable UUID id) {
        return ResponseEntity.ok(pedidoService.historial(id));
    }

    @PostMapping("/{id}/enviar-comprobante")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<Map<String, Boolean>> enviarComprobante(
            @PathVariable UUID id,
            @Valid @RequestBody EnviarComprobanteRequest req) {
        emailService.enviarComprobante(id, req.getEmail());
        return ResponseEntity.accepted().body(Map.of("ok", true));
    }
}
