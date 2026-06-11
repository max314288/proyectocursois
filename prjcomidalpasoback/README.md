# Backend — Comida al Paso API

API REST en Spring Boot 3.4 + Java 21 + SQL Server. Autenticación con JWT
para las 3 apps frontend (`apps/web`, `apps/admin`, `apps/restaurant`).

## Requisitos

- **Java 21** (`java -version` debe mostrar 21+)
- **SQL Server** local con la BD `bdAppcomida` (ver `sql_usuario.sql`)
- **Docker Desktop** corriendo (solo para `mvnw test` — usa Testcontainers)

## Arrancar

### Variable de entorno (una sola vez por sesión PowerShell)

```powershell
$env:JWT_SECRET = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### Comandos

```powershell
# Tests (requiere Docker)
.\mvnw test

# Arrancar en :8080
.\mvnw spring-boot:run

# Build del JAR
.\mvnw clean package
```

### Verificación

- API en `http://localhost:8080/api`
- Swagger UI en `http://localhost:8080/swagger-ui.html`

## Arquitectura

```
HTTP → Resource → Business → Adapter → SQL Server (Stored Procedures)
       (exposición) (lógica)  (persistencia)
```

Capas (cada una es dueña de sus modelos):
- `resource/` — capa de exposición: REST controllers (`@RestController`) + `resource/model/` con los DTOs que viajan por HTTP (requests, responses, `ErrorResponse`)
- `business/` — capa de negocio: services (interfaz + `impl/`), solo lógica
- `adapter/` — capa hacia la BD / micros internos: DAO que invoca SPs (`EntityManager.createStoredProcedureQuery`) + `adapter/model/` (entidad JPA `Usuario`, enum `Rol`) + `adapter/repository/` (Spring Data JPA, uso interno)
- `shared/` — transversal: `config/`, `security/` (JWT) y `exception/`

Dirección de dependencias: `resource → business → adapter`; `shared` puede usarse desde cualquier capa.

Patrones aplicados: **arquitectura en capas, DAO, SOLID, TDD**.

## Endpoints

| Método | Path | Auth | SP |
|---|---|---|---|
| POST | `/api/auth/register` | público | `sp_crear_usuario` |
| POST | `/api/auth/login` | público | `sp_obtener_usuario_por_email` |
| GET | `/api/auth/me` | Bearer | `sp_obtener_usuario` |
| POST | `/api/auth/refresh` | Bearer | — |
| GET | `/api/usuarios` | admin | `sp_listar_usuarios` |
| GET | `/api/usuarios/{id}` | admin | `sp_obtener_usuario` |
| PUT | `/api/usuarios/{id}` | admin u owner | `sp_actualizar_usuario` |
| PUT | `/api/usuarios/{id}/password` | admin u owner | `sp_cambiar_password` |
| PATCH | `/api/usuarios/{id}/toggle` | admin | `sp_toggle_usuario` |

Status codes: **200, 202, 400, 404, 500, 504** (errores de cliente discriminados con `error` en el body).
