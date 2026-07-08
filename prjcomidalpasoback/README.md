# Backend — Comida al Paso API

API REST · Spring Boot 3.4 · Java 21 · SQL Server · JWT

Sirve a las 3 apps frontend del monorepo: `apps/web` (port 3000), `apps/admin` (port 3001) y `apps/restaurant` (port 3002).

---

## Requisitos

| Herramienta | Versión mínima |
|---|---|
| Java | 21 |
| SQL Server | 2019+ (local o SQLEXPRESS) |
| Docker Desktop | cualquiera — solo para tests con Testcontainers (no implementado aún) |

La BD debe existir: `bdAppcomida`, con el esquema, stored procedures y datos de ejemplo de `../scriptsbd/` cargados (`sql_tablas.sql` → `procedures_completo.sql` → `insert_restaurantecompleto.sql` + `menu_comidas_menu.sql` → `migracion_estado_cancelado.sql`).

---

## Configuración

### Variable de entorno JWT (una vez por sesión)

```powershell
$env:JWT_SECRET = [Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))
```

### application.properties (valores clave)

```properties
server.port=8080
spring.datasource.url=jdbc:sqlserver://localhost\\SQLEXPRESS:1433;databaseName=bdAppcomida;encrypt=true;trustServerCertificate=true
spring.datasource.username=comidaalpaso_app
spring.datasource.password=C0midaLpas00906!
jwt.secret=${JWT_SECRET:cambia-este-secreto-por-uno-real-de-al-menos-32-bytes-base64}
jwt.expiration-ms=86400000
cors.allowed-origins=http://localhost:3000,http://localhost:3001,http://localhost:3002
```

Credenciales reales de desarrollo (BD local) no van en este archivo — usa `application-local.properties` (untracked) o pregunta al equipo.

---

## Comandos

```powershell
.\mvnw spring-boot:run          # Arrancar en :8080
.\mvnw test                     # Ejecutar tests (36, sin Docker)
.\mvnw -q compile               # Solo compilar
.\mvnw clean package -DskipTests # Build del JAR
```

### Verificación rápida

```
http://localhost:8080/swagger-ui.html   ← Swagger UI interactivo
http://localhost:8080/v3/api-docs       ← OpenAPI JSON
```

---

## Arquitectura

```
HTTP Request
    ↓
resource/       ← Controllers (@RestController) + DTOs de HTTP
    ↓
business/       ← Services (interface + impl), solo lógica de negocio
    ↓
adapter/        ← DAOs que invocan Stored Procedures (EntityManager)
    ↓
SQL Server      ← 43 Stored Procedures para toda la persistencia
```

`shared/` es transversal: `config/` (Security, CORS, OpenAPI), `security/` (JWT filter, 401 entry point), `exception/` (handler global).

Dirección de dependencias: `resource → business → adapter`. Ninguna capa conoce a la capa superior.

---

## Autenticación

Rutas protegidas requieren:

```
Authorization: Bearer <token>
```

Token obtenido en `/api/auth/login` o `/api/auth/register`. Expira en **24 horas**.

Roles (BD, minúscula): `cliente` · `admin` · `restaurante` · `repartidor`.

**Endpoints públicos** (sin token): `POST /api/auth/register`, `POST /api/auth/login`, y el catálogo de lectura — `GET /api/menu/categorias`, `GET /api/menu/items`, `GET /api/menu/items/{id}/componentes`, `GET /api/menu/items/{id}/arma-plato`, `GET /api/restaurantes`, `GET /api/restaurantes/{id}/elegir`. Todo lo demás requiere JWT válido.

Token ausente/inválido/expirado en un endpoint protegido → **401** con body uniforme:

```json
{ "timestamp": "...", "status": 401, "error": "NO_AUTORIZADO", "message": "Token ausente, inválido o expirado", "path": "/api/pedidos/cliente" }
```

---

## Códigos de estado

| Código | Cuándo se usa |
|---|---|
| 200 | GET, POST, PUT exitosos |
| 202 | Operaciones de cambio de estado (toggle, cambiar estado, asignar) |
| 400 | Validación fallida, credenciales inválidas, regla de negocio violada |
| 401 | Sin token / token inválido o expirado |
| 404 | Recurso no encontrado |
| 409 | Conflicto (recurso duplicado) |
| 500 | Error inesperado del servidor |
| 504 | Timeout de base de datos |

### Formato de error

```json
{
  "timestamp": "2026-07-08T14:00:00+00:00",
  "status": 400,
  "error": "INVALID_CREDENTIALS",
  "message": "Email o contraseña incorrectos",
  "path": "/api/auth/login",
  "details": [
    { "field": "email", "message": "must not be blank" }
  ]
}
```

Valores del campo `error`: `VALIDATION_ERROR` · `DUPLICATE_EMAIL` · `INVALID_CREDENTIALS` · `USER_INACTIVE` · `NO_AUTORIZADO` · `FORBIDDEN` · `BAD_REQUEST` · `BUSINESS_RULE` · `CONFLICT` · `NOT_FOUND` · `DB_TIMEOUT` · `INTERNAL_ERROR`

---

## Endpoints

### Auth — `/api/auth`

#### POST `/api/auth/register` — Registrar usuario _(público)_

El campo `rol` es libre (curso) — no valida que solo admins puedan crear otros admins.

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María",
    "apellido": "López",
    "email": "maria@example.com",
    "password": "Segura123!",
    "rol": "cliente"
  }'
```

```json
{
  "token": "eyJhbGciOiJIUzM4NCJ9...",
  "expiresIn": 86400000,
  "usuario": { "id": "a1b2c3d4-...", "nombre": "María", "apellido": "López", "email": "maria@example.com", "rol": "cliente", "activo": true, "createdAt": "2026-07-08" }
}
```

#### POST `/api/auth/login` — Iniciar sesión _(público)_

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{ "email": "maria@example.com", "password": "Segura123!" }'
```

Misma forma de respuesta que `register`.

#### POST `/api/auth/refresh` — Renovar token _(autenticado)_

```bash
curl -X POST http://localhost:8080/api/auth/refresh -H "Authorization: Bearer <token>"
```

#### GET `/api/auth/me` — Usuario autenticado _(autenticado)_

```bash
curl http://localhost:8080/api/auth/me -H "Authorization: Bearer <token>"
```

---

### Usuarios — `/api/usuarios`

| Método | Ruta | Auth |
|---|---|---|
| GET | `/api/usuarios?rol=cliente` | admin |
| GET | `/api/usuarios/{id}` | admin o el propio usuario |
| PUT | `/api/usuarios/{id}` | admin o el propio usuario |
| PUT | `/api/usuarios/{id}/password` | admin (sin password actual) o el propio usuario (con password actual) |
| PATCH | `/api/usuarios/{id}/toggle` | admin |

```bash
curl -X PUT http://localhost:8080/api/usuarios/a1b2c3d4-.../password \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{ "passwordActual": "Segura123!", "passwordNuevo": "MasSegura456!" }'
```

---

### Restaurantes — `/api/restaurantes`

| Método | Ruta | Auth |
|---|---|---|
| POST | `/api/restaurantes` | admin |
| GET | `/api/restaurantes?soloActivos=true` | público — el SP filtra a "solo el mío" si el token es rol `restaurante` |
| GET | `/api/restaurantes/mio` | restaurante — resuelve el restaurante fijo del usuario logueado |
| GET | `/api/restaurantes/{id}/elegir` | público — catálogo completo para pintar la carta |
| PUT | `/api/restaurantes/{id}` | admin |
| PATCH | `/api/restaurantes/{id}/toggle` | admin |

```bash
curl -X POST http://localhost:8080/api/restaurantes \
  -H "Authorization: Bearer <token-admin>" -H "Content-Type: application/json" \
  -d '{ "usuarioId": "u1-...", "nombre": "Comida al Paso Miraflores", "direccion": "Av. Larco 345, Miraflores", "telefono": "987654321", "aceptaRecojo": true, "aceptaDelivery": true, "aceptaSalon": true }'
```

#### GET `/api/restaurantes/{id}/elegir` — carta completa

Una sola llamada: datos del restaurante, categorías con ítems en este restaurante, catálogo global de etiquetas, y todos los ítems enriquecidos (etiquetas, componentes de menú compuesto, opciones de arma-tu-plato).

```json
{
  "restaurante": { "id": "c3d4e5f6-...", "nombre": "La Trattoria di Luigi", "direccion": "...", "telefono": "...", "aceptaRecojo": true, "aceptaDelivery": true, "aceptaSalon": true, "activo": true },
  "categorias": [{ "id": "...", "codigo": "a_la_carta", "nombre": "A la carta", "descripcion": "...", "orden": 2 }],
  "etiquetas": [{ "codigo": "vegano", "nombre": "Vegano", "color": "#639922" }],
  "items": [
    {
      "id": "f6a7b8c9-...", "nombre": "Ceviche clásico", "categoria": "A la carta", "descripcion": "...",
      "precio": 45.00, "pesoGramos": 380, "esMenuCompuesto": false, "esArmaPlato": false, "disponible": true,
      "imagenUrl": null, "etiquetas": [{ "codigo": "marino", "nombre": "Marino", "color": "#185FA5" }],
      "componentes": [], "opcionesArmaPlato": []
    },
    {
      "id": "a1b2c3d4-...", "nombre": "Arma tu plato", "categoria": "Arma tu plato", "precio": 35.00,
      "esArmaPlato": true, "disponible": true, "etiquetas": [], "componentes": [],
      "opcionesArmaPlato": [
        { "tipo": "base", "itemId": "opc-001-...", "nombre": "Arroz blanco", "precioExtra": 0.00, "disponible": true },
        { "tipo": "proteina", "itemId": "opc-002-...", "nombre": "Lomo de res", "precioExtra": 8.00, "disponible": true }
      ]
    }
  ]
}
```

Categorías fijas por `codigo`: `menu` · `a_la_carta` · `entradas` · `postres` · `bebidas` · `arma_plato`.

---

### Mesas — `/api/mesas`

| Método | Ruta | Auth |
|---|---|---|
| POST | `/api/mesas` | admin o restaurante |
| GET | `/api/mesas?restauranteId=...&estado=disponible` | autenticado |
| PUT | `/api/mesas/{id}` | admin o restaurante |
| PATCH | `/api/mesas/{id}/estado` | admin o restaurante |
| DELETE | `/api/mesas/{id}` | admin o restaurante |

```bash
curl -X POST http://localhost:8080/api/mesas \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{ "restauranteId": "c3d4e5f6-...", "numero": "M-06", "capacidad": 4 }'
```

`numero` es texto (`"M-06"`), no número. Estados de mesa: `disponible` · `ocupada` · `reservada`.

---

### Menú — `/api/menu`

> **Ownership:** las escrituras validan que el usuario `restaurante` solo gestione ítems de su propio restaurante — de lo contrario `400 BUSINESS_RULE`.

| Método | Ruta | Auth |
|---|---|---|
| GET | `/api/menu/categorias` | público |
| GET | `/api/menu/items?restauranteId=&categoria=&etiqueta=&soloDisponibles=` | público |
| POST | `/api/menu/items` | admin o restaurante |
| PUT / PATCH toggle / DELETE `/api/menu/items/{id}` | admin o restaurante |
| GET `/api/menu/items/{menuId}/componentes` | público |
| POST `/api/menu/items/{menuId}/componentes` | admin o restaurante |
| DELETE `/api/menu/items/{menuId}/componentes/{itemId}` | admin o restaurante |
| GET `/api/menu/items/{armaPlatoId}/arma-plato` | público |
| POST `/api/menu/items/{armaPlatoId}/arma-plato` | admin o restaurante |

```bash
# Crear ítem
curl -X POST http://localhost:8080/api/menu/items \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{
    "restauranteId": "c3d4e5f6-...",
    "categoriaCodigo": "entradas",
    "nombre": "Ceviche entrada",
    "descripcion": "Pescado fresco en limón",
    "precio": 18.00,
    "pesoGramos": 180,
    "esMenuCompuesto": false,
    "esArmaPlato": false
  }'

# Agregar componente a un menú compuesto (rol = 'entrada' | 'fondo' | 'bebida', libre)
curl -X POST http://localhost:8080/api/menu/items/{menuId}/componentes \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{ "itemId": "h8i9j0k1-...", "rol": "fondo", "obligatorio": true, "orden": 1 }'

# Agregar opción de arma-tu-plato (tipo ∈ base|proteina|topping|bebida)
curl -X POST http://localhost:8080/api/menu/items/{armaPlatoId}/arma-plato \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{ "itemId": "opc-004-...", "tipo": "topping", "precioExtra": 3.00 }'
```

---

### Etiquetas — `/api/items/{itemId}/etiquetas`

| Método | Auth |
|---|---|
| POST — asignar (`{"codigo": "vegano"}`) | admin o restaurante |
| GET — listar del ítem | autenticado |
| DELETE `/{codigo}` — quitar | admin o restaurante |

---

### Pedidos — `/api/pedidos`

Estados: `recibido` → `en_preparacion` → `listo` → `entregado`, o `cancelado` (solo desde `recibido`/`en_preparacion`).

#### POST `/api/pedidos` — Crear pedido _(cliente)_

```bash
curl -X POST http://localhost:8080/api/pedidos \
  -H "Authorization: Bearer <token-cliente>" -H "Content-Type: application/json" \
  -d '{
    "restauranteId": "c3d4e5f6-...",
    "modo": "salon",
    "mesaId": "d4e5f6a7-...",
    "numComensales": 2,
    "notas": "Sin picante por favor",
    "items": [
      { "itemMenuId": "f6a7b8c9-...", "cantidad": 1 },
      { "itemMenuId": "g7h8i9j0-...", "cantidad": 2, "notasItem": "Extra limón" }
    ]
  }'
```

`modo` ∈ `recojo` · `delivery` · `salon`. Salón exige `mesaId`; delivery exige `direccion`. El precio de cada línea lo fija el backend desde `items_menu.precio` — no confía en lo que mande el cliente. El total se calcula en el SP; para ítems de "arma tu plato" los extras solo viajan como texto en `notasItem` (el precio base del ítem es el que se cobra).

```json
{ "id": "k1l2m3n4-..." }
```

| Método | Ruta | Auth |
|---|---|---|
| GET `/api/pedidos/{id}` | autenticado |
| GET `/api/pedidos/restaurante/{restauranteId}?estado=&modo=` | admin o restaurante |
| GET `/api/pedidos/cliente` | cliente |
| PATCH `/api/pedidos/{id}/estado` | admin, restaurante o repartidor |
| PATCH `/api/pedidos/{id}/repartidor` | admin o restaurante |
| POST `/api/pedidos/{id}/cancelar` | autenticado |
| GET `/api/pedidos/{id}/historial` | autenticado |

```bash
curl -X PATCH http://localhost:8080/api/pedidos/k1l2m3n4-.../estado \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{ "estado": "en_preparacion" }'
```

`estado` acepta: `recibido` · `en_preparacion` · `listo` · `entregado` · `asignado` · `en_camino` (los dos últimos, delivery). `cancelado` **no** se setea aquí — usa `POST /cancelar`.

**Al entregar** un pedido con pago en `efectivo` pendiente, el backend lo marca `completado` automáticamente (quien entrega, cobra). **Al cancelar**, cualquier pago `pendiente` pasa a `fallido` y la mesa (si era salón) vuelve a `disponible`.

---

### Pagos — `/api/pagos`

#### POST `/api/pagos` — Registrar pago _(autenticado)_

```bash
curl -X POST http://localhost:8080/api/pagos \
  -H "Authorization: Bearer <token>" -H "Content-Type: application/json" \
  -d '{ "pedidoId": "k1l2m3n4-...", "metodo": "tarjeta", "referenciaExterna": "1111" }'
```

`metodo` ∈ `tarjeta` · `transferencia` · `efectivo`. El monto lo toma el backend de `pedidos.total` — no se envía. **`tarjeta` se confirma automáticamente al registrarse** (simula una pasarela síncrona); `efectivo`/`transferencia` quedan `pendiente` hasta que el restaurante confirma el cobro físico.

| Método | Ruta | Auth |
|---|---|---|
| PATCH `/api/pagos/{id}/confirmar` | admin o restaurante |
| PATCH `/api/pagos/{id}/fallo` | admin o restaurante |
| GET `/api/pagos/pedido/{pedidoId}` | autenticado |

Un pedido solo puede tener **un** pago (`pedido_id UNIQUE`) — no hay reintentos de pago.

---

## Estado de tests

36 tests (JUnit 5 + Mockito + `@WebMvcTest`), cubren `authusuario` y `JwtTokenProvider`. Testcontainers para los demás dominios (pedido, pago, restaurante, menu, mesa, etiqueta) queda pendiente — hoy se verifican con smoke tests manuales contra la BD real.
