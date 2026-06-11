package com.comidaalpaso.api.resource.menu;

import com.comidaalpaso.api.business.menu.MenuService;
import com.comidaalpaso.api.resource.menu.model.AgregarComponenteArmaPlatoRequest;
import com.comidaalpaso.api.resource.menu.model.AgregarComponenteMenuRequest;
import com.comidaalpaso.api.resource.menu.model.CategoriaMenuDTO;
import com.comidaalpaso.api.resource.menu.model.ComponenteMenuDTO;
import com.comidaalpaso.api.resource.menu.model.CreateItemMenuRequest;
import com.comidaalpaso.api.resource.menu.model.ItemMenuDTO;
import com.comidaalpaso.api.resource.menu.model.OpcionArmaPlatoDTO;
import com.comidaalpaso.api.resource.menu.model.ToggleItemMenuRequest;
import com.comidaalpaso.api.resource.menu.model.UpdateItemMenuRequest;
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
@RequestMapping("/api/menu")
public class MenuResource {

    private final MenuService menuService;

    public MenuResource(MenuService menuService) {
        this.menuService = menuService;
    }

    // ─── categorías ────────────────────────────────────────────────────────────

    @GetMapping("/categorias")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<CategoriaMenuDTO>> listarCategorias() {
        return ResponseEntity.ok(menuService.listarCategorias());
    }

    // ─── items ─────────────────────────────────────────────────────────────────

    @GetMapping("/items")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ItemMenuDTO>> listarItems(
            @RequestParam(required = false) UUID restauranteId,
            @RequestParam(required = false) String categoria,
            @RequestParam(required = false) String etiqueta,
            @RequestParam(defaultValue = "false") boolean soloDisponibles) {
        return ResponseEntity.ok(menuService.listarItems(restauranteId, categoria, etiqueta, soloDisponibles));
    }

    @PostMapping("/items")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, UUID>> crearItem(@Valid @RequestBody CreateItemMenuRequest req) {
        UUID id = menuService.crearItem(req);
        return ResponseEntity.ok(Map.of("id", id));
    }

    @PutMapping("/items/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, Boolean>> actualizarItem(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateItemMenuRequest req) {
        menuService.actualizarItem(id, req);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    @PatchMapping("/items/{id}/toggle")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, Boolean>> toggleItem(
            @PathVariable UUID id,
            @Valid @RequestBody ToggleItemMenuRequest req) {
        menuService.toggleItem(id, req.getDisponible());
        return ResponseEntity.accepted().body(Map.of("ok", true));
    }

    @DeleteMapping("/items/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, Boolean>> eliminarItem(@PathVariable UUID id) {
        menuService.eliminarItem(id);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ─── componentes de menú compuesto ─────────────────────────────────────────

    @GetMapping("/items/{menuId}/componentes")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<ComponenteMenuDTO>> listarComponentes(@PathVariable UUID menuId) {
        return ResponseEntity.ok(menuService.listarComponentesMenu(menuId));
    }

    @PostMapping("/items/{menuId}/componentes")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, UUID>> agregarComponente(
            @PathVariable UUID menuId,
            @Valid @RequestBody AgregarComponenteMenuRequest req) {
        UUID id = menuService.agregarComponenteMenu(menuId, req);
        return ResponseEntity.ok(Map.of("id", id));
    }

    @DeleteMapping("/items/{menuId}/componentes/{itemId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, Boolean>> quitarComponente(
            @PathVariable UUID menuId,
            @PathVariable UUID itemId) {
        menuService.quitarComponenteMenu(menuId, itemId);
        return ResponseEntity.ok(Map.of("ok", true));
    }

    // ─── opciones arma-plato ───────────────────────────────────────────────────

    @GetMapping("/items/{armaPlatoId}/arma-plato")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<OpcionArmaPlatoDTO>> listarOpciones(@PathVariable UUID armaPlatoId) {
        return ResponseEntity.ok(menuService.listarOpcionesArmaPlato(armaPlatoId));
    }

    @PostMapping("/items/{armaPlatoId}/arma-plato")
    @PreAuthorize("hasAnyRole('ADMIN', 'RESTAURANTE')")
    public ResponseEntity<Map<String, UUID>> agregarOpcion(
            @PathVariable UUID armaPlatoId,
            @Valid @RequestBody AgregarComponenteArmaPlatoRequest req) {
        UUID id = menuService.agregarComponenteArmaPlato(armaPlatoId, req);
        return ResponseEntity.ok(Map.of("id", id));
    }
}
