package com.comidaalpaso.api.adapter.restaurante;

import com.comidaalpaso.api.adapter.restaurante.model.Restaurante;

import java.util.List;
import java.util.Optional;
import java.util.UUID;


public interface RestauranteDAO {
    UUID crear(UUID usuarioId, String nombre, String direccion, String telefono,
               String logoUrl, boolean aceptaRecojo, boolean aceptaDelivery, boolean aceptaSalon);
    void actualizar(UUID id, String nombre, String direccion, String telefono,
                    String logoUrl, boolean aceptaRecojo, boolean aceptaDelivery, boolean aceptaSalon);
    void toggle(UUID id, boolean activo);
    List<Restaurante> listar(boolean soloActivos, UUID usuarioId);
    Optional<UUID> findRestauranteIdByUsuarioId(UUID usuarioId);
    Optional<Restaurante> findById(UUID id);
}
