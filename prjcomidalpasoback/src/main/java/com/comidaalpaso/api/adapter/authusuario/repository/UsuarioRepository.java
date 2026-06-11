package com.comidaalpaso.api.adapter.authusuario.repository;

import com.comidaalpaso.api.adapter.authusuario.model.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

/**
 * Spring Data JPA repository para la entidad {@link Usuario}.
 *
 * <p><strong>SOLID-D / encapsulación:</strong> esta interfaz solo se usa
 * dentro de {@code dao/impl/UsuarioDAOImpl}. Los servicios NUNCA la inyectan —
 * dependen del {@code UsuarioDAO} para obtener la abstracción correcta (ISP).
 *
 * <p>En esta fase no se exponen queries derivadas porque <strong>todo el CRUD
 * pasa por stored procedures</strong>. El repository queda disponible para
 * futuras queries simples (paginación, búsquedas) sin necesidad de un SP.
 */
@Repository
public interface UsuarioRepository extends JpaRepository<Usuario, UUID> {
}
