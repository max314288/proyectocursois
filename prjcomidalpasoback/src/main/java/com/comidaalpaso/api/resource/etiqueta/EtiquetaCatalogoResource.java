package com.comidaalpaso.api.resource.etiqueta;

import com.comidaalpaso.api.business.etiqueta.EtiquetaService;
import com.comidaalpaso.api.resource.etiqueta.model.EtiquetaDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/etiquetas")
public class EtiquetaCatalogoResource {

    private final EtiquetaService etiquetaService;

    public EtiquetaCatalogoResource(EtiquetaService etiquetaService) {
        this.etiquetaService = etiquetaService;
    }

    @GetMapping
    public ResponseEntity<List<EtiquetaDTO>> listarTodas() {
        return ResponseEntity.ok(etiquetaService.listarTodas());
    }
}
