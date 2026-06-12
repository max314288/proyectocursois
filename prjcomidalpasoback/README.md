# Backend — Comida al Paso API

API REST · Spring Boot 3.4 · Java 21 · SQL Server · JWT

Sirve a las 3 apps frontend del monorepo: `apps/web` (port 3000), `apps/admin` (port 3001) y `apps/restaurant` (port 3002).

---

## Requisitos

| Herramienta | Versión mínima |
|---|---|
| Java | 21 |
| SQL Server | 2019+ (local o SQLEXPRESS) |
| Docker Desktop | cualquiera — solo para tests con Testcontainers |

La BD debe existir: `bdAppcomida`. Crea el usuario de aplicación con `sql_usuario.sql`.

---

## Configuración

### Variable de entorno JWT (una vez por sesión PowerShell)

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

---

## Comandos

```powershell
# Arrancar en :8080
.\mvnw spring-boot:run

# Ejecutar tests (requiere Docker)
.\mvnw test

# Solo compilar (sin tests)
.\mvnw -q compile

# Build del JAR
.\mvnw clean package -DskipTests
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
SQL Server      ← Stored Procedures para toda la persistencia
```

`shared/` es transversal: `config/` (Security, CORS, OpenAPI), `security/` (JWT filter), `exception/` (handler global).

Dirección de dependencias: `resource → business → adapter`. Ninguna capa conoce a la capa superior.

Patrones: **arquitectura en capas · DAO · SOLID · TDD**.

---

## Autenticación

Todas las rutas protegidas requieren el header:

```
Authorization: Bearer <token>
```

El token se obtiene en `/api/auth/login` o `/api/auth/register`. Expira en **24 horas**.

Roles disponibles: `ADMIN`, `RESTAURANTE`, `CLIENTE`, `REPARTIDOR`.

---

## Códigos de estado

| Código | Cuándo se usa |
|---|---|
| 200 | GET, POST, PUT exitosos |
| 202 | Operaciones de cambio de estado (toggle, cambiar estado, asignar) |
| 400 | Validación fallida, credenciales inválidas, regla de negocio violada |
| 404 | Recurso no encontrado |
| 409 | Conflicto (recurso duplicado) |
| 500 | Error inesperado del servidor |
| 504 | Timeout de base de datos |

### Formato de error

```json
{
  "timestamp": "2025-06-11T14:00:00+00:00",
  "status": 400,
  "error": "INVALID_CREDENTIALS",
  "message": "Email o contraseña incorrectos",
  "path": "/api/auth/login",
  "details": [
    { "field": "email", "message": "must not be blank" }
  ]
}
```

Valores del campo `error`: `VALIDATION_ERROR` · `INVALID_CREDENTIALS` · `DUPLICATE_EMAIL` · `USER_INACTIVE` · `UNAUTHORIZED` · `FORBIDDEN` · `BAD_REQUEST` · `BUSINESS_RULE` · `NOT_FOUND` · `CONFLICT` · `INTERNAL_ERROR` · `DB_TIMEOUT`

---

## Endpoints

### Auth — `/api/auth`

#### POST `/api/auth/register` — Registrar usuario

```bash
curl -X POST http://localhost:8080/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María",
    "apellido": "López",
    "email": "maria@example.com",
    "password": "Segura123!",
    "rol": "CLIENTE"
  }'
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "expiresIn": 86400000,
  "usuario": {
    "id": "a1b2c3d4-...",
    "nombre": "María",
    "apellido": "López",
    "email": "maria@example.com",
    "rol": "CLIENTE",
    "activo": true
  }
}
```

---

#### POST `/api/auth/login` — Iniciar sesión

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "maria@example.com",
    "password": "Segura123!"
  }'
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "expiresIn": 86400000,
  "usuario": {
    "id": "a1b2c3d4-...",
    "nombre": "María",
    "apellido": "López",
    "email": "maria@example.com",
    "rol": "CLIENTE",
    "activo": true
  }
}
```

---

#### POST `/api/auth/refresh` — Renovar token

```bash
curl -X POST http://localhost:8080/api/auth/refresh \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

```json
{
  "token": "eyJhbGciOiJIUzI1NiJ9...nuevo...",
  "expiresIn": 86400000,
  "usuario": { "id": "a1b2c3d4-...", "email": "maria@example.com", "rol": "CLIENTE" }
}
```

---

#### GET `/api/auth/me` — Usuario autenticado

```bash
curl http://localhost:8080/api/auth/me \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiJ9..."
```

```json
{
  "id": "a1b2c3d4-...",
  "nombre": "María",
  "apellido": "López",
  "email": "maria@example.com",
  "rol": "CLIENTE",
  "activo": true
}
```

---

### Usuarios — `/api/usuarios`

#### GET `/api/usuarios` — Listar usuarios _(admin)_

```bash
curl "http://localhost:8080/api/usuarios?rol=CLIENTE" \
  -H "Authorization: Bearer <token-admin>"
```

```json
[
  { "id": "a1b2c3d4-...", "nombre": "María", "apellido": "López", "email": "maria@example.com", "rol": "CLIENTE", "activo": true },
  { "id": "b2c3d4e5-...", "nombre": "Carlos", "apellido": "Ruiz", "email": "carlos@example.com", "rol": "CLIENTE", "activo": true }
]
```

---

#### GET `/api/usuarios/{id}` — Obtener usuario _(admin o el propio usuario)_

```bash
curl http://localhost:8080/api/usuarios/a1b2c3d4-1234-5678-abcd-ef0123456789 \
  -H "Authorization: Bearer <token>"
```

```json
{
  "id": "a1b2c3d4-1234-5678-abcd-ef0123456789",
  "nombre": "María",
  "apellido": "López",
  "email": "maria@example.com",
  "rol": "CLIENTE",
  "activo": true
}
```

---

#### PUT `/api/usuarios/{id}` — Actualizar usuario _(admin o el propio usuario)_

```bash
curl -X PUT http://localhost:8080/api/usuarios/a1b2c3d4-... \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "María José",
    "apellido": "López Torres"
  }'
```

```json
{ "id": "a1b2c3d4-...", "nombre": "María José", "apellido": "López Torres", "email": "maria@example.com", "rol": "CLIENTE", "activo": true }
```

---

#### PUT `/api/usuarios/{id}/password` — Cambiar contraseña _(admin o el propio usuario)_

```bash
curl -X PUT http://localhost:8080/api/usuarios/a1b2c3d4-.../password \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "passwordActual": "Segura123!",
    "passwordNueva": "MasSegura456!"
  }'
```

```json
{ "ok": true }
```

---

#### PATCH `/api/usuarios/{id}/toggle` — Activar / desactivar _(admin)_

```bash
curl -X PATCH http://localhost:8080/api/usuarios/a1b2c3d4-.../toggle \
  -H "Authorization: Bearer <token-admin>" \
  -H "Content-Type: application/json" \
  -d '{ "activo": false }'
```

`202 Accepted`
```json
{ "ok": true }
```

---

### Restaurantes — `/api/restaurantes`

#### POST `/api/restaurantes` — Crear restaurante _(admin)_

```bash
curl -X POST http://localhost:8080/api/restaurantes \
  -H "Authorization: Bearer <token-admin>" \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Comida al Paso Miraflores",
    "direccion": "Av. Larco 345, Miraflores",
    "telefono": "987654321"
  }'
```

```json
{ "id": "c3d4e5f6-..." }
```

---

#### GET `/api/restaurantes` — Listar restaurantes _(autenticado)_

El SP filtra según el rol del token: `RESTAURANTE` solo ve su propio restaurante; `ADMIN`/`CLIENTE` ven todos.

```bash
curl "http://localhost:8080/api/restaurantes?soloActivos=true" \
  -H "Authorization: Bearer <token>"
```

```json
[
  {
    "id": "c3d4e5f6-...",
    "nombre": "Comida al Paso Miraflores",
    "direccion": "Av. Larco 345, Miraflores",
    "telefono": "987654321",
    "aceptaRecojo": true,
    "aceptaDelivery": true,
    "aceptaSalon": true,
    "activo": true
  }
]
```

---

#### GET `/api/restaurantes/{id}/elegir` — Cargar restaurante completo para cliente _(cliente)_

Endpoint pensado para alimentar la web de cliente. Devuelve en una sola llamada: datos del restaurante, catálogo de categorías activas en sus ítems, lista global de etiquetas, y todos los ítems enriquecidos (etiquetas, componentes de combo y opciones de arma-tu-plato).

```bash
curl http://localhost:8080/api/restaurantes/c3d4e5f6-.../elegir \
  -H "Authorization: Bearer <token-cliente>"
```

```json
{
  "restaurante": {
    "id": "c3d4e5f6-...",
    "nombre": "Comida al Paso Miraflores",
    "direccion": "Av. Larco 345, Miraflores",
    "telefono": "987654321",
    "aceptaRecojo": true,
    "aceptaDelivery": true,
    "aceptaSalon": true,
    "activo": true
  },
  "categorias": [
    { "codigo": "A_LA_CARTA", "nombre": "A la carta", "descripcion": "...", "orden": 1 },
    { "codigo": "MENUS",      "nombre": "Menús del día", "descripcion": "...", "orden": 2 }
  ],
  "etiquetas": [
    { "codigo": "VEGANO",     "nombre": "Vegano",     "color": "#4caf50" },
    { "codigo": "SIN_GLUTEN", "nombre": "Sin Gluten", "color": "#ff9800" }
  ],
  "items": [
    {
      "id": "f6a7b8c9-...",
      "nombre": "Lomo Saltado",
      "descripcion": "Clásico peruano con papas fritas",
      "precio": 28.00,
      "categoria": "A la carta",
      "disponible": true,
      "esMenuCompuesto": 0,
      "esArmaPlato": 0,
      "imagenUrl": "/images/lomo-saltado.jpg",
      "etiquetas": [
        { "codigo": "SIN_GLUTEN", "nombre": "Sin Gluten", "color": "#ff9800" }
      ],
      "componentes": [],
      "opcionesArmaPlato": []
    },
    {
      "id": "a1b2c3d4-...",
      "nombre": "Bowl Personalizado",
      "precio": 18.00,
      "categoria": "A la carta",
      "disponible": true,
      "esMenuCompuesto": 0,
      "esArmaPlato": 1,
      "etiquetas": [],
      "componentes": [],
      "opcionesArmaPlato": [
        { "itemId": "opc-001-...", "nombre": "Quinoa",            "tipo": "BASE",     "precioExtra": 0.00,  "disponible": true },
        { "itemId": "opc-002-...", "nombre": "Pollo a la plancha","tipo": "PROTEINA", "precioExtra": 5.00,  "disponible": true },
        { "itemId": "opc-003-...", "nombre": "Palta",             "tipo": "TOPPING",  "precioExtra": 2.00,  "disponible": true }
      ]
    }
  ]
}
```

---

#### PUT `/api/restaurantes/{id}` — Actualizar restaurante _(admin)_

```bash
curl -X PUT http://localhost:8080/api/restaurantes/c3d4e5f6-... \
  -H "Authorization: Bearer <token-admin>" \
  -H "Content-Type: application/json" \
  -d '{ "nombre": "Comida al Paso — Miraflores", "telefono": "999888777" }'
```

```json
{ "ok": true }
```

---

#### PATCH `/api/restaurantes/{id}/toggle` — Activar / desactivar _(admin)_

```bash
curl -X PATCH http://localhost:8080/api/restaurantes/c3d4e5f6-.../toggle \
  -H "Authorization: Bearer <token-admin>" \
  -H "Content-Type: application/json" \
  -d '{ "activo": false }'
```

`202 Accepted`
```json
{ "ok": true }
```

---

### Mesas — `/api/mesas`

#### POST `/api/mesas` — Crear mesa _(admin o restaurante)_

```bash
curl -X POST http://localhost:8080/api/mesas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "restauranteId": "c3d4e5f6-...",
    "numero": 5,
    "capacidad": 4
  }'
```

```json
{ "id": "d4e5f6a7-..." }
```

---

#### GET `/api/mesas` — Listar mesas _(autenticado)_

```bash
curl "http://localhost:8080/api/mesas?restauranteId=c3d4e5f6-...&estado=LIBRE" \
  -H "Authorization: Bearer <token>"
```

```json
[
  { "id": "d4e5f6a7-...", "numero": 5, "capacidad": 4, "estado": "LIBRE", "restauranteId": "c3d4e5f6-..." },
  { "id": "e5f6a7b8-...", "numero": 6, "capacidad": 2, "estado": "LIBRE", "restauranteId": "c3d4e5f6-..." }
]
```

---

#### PUT `/api/mesas/{id}` — Actualizar mesa _(admin o restaurante)_

```bash
curl -X PUT http://localhost:8080/api/mesas/d4e5f6a7-... \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "capacidad": 6 }'
```

```json
{ "ok": true }
```

---

#### PATCH `/api/mesas/{id}/estado` — Cambiar estado de mesa _(admin o restaurante)_

```bash
curl -X PATCH http://localhost:8080/api/mesas/d4e5f6a7-.../estado \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "estado": "OCUPADA" }'
```

`202 Accepted`
```json
{ "ok": true }
```

---

#### DELETE `/api/mesas/{id}` — Eliminar mesa _(admin o restaurante)_

```bash
curl -X DELETE http://localhost:8080/api/mesas/d4e5f6a7-... \
  -H "Authorization: Bearer <token>"
```

```json
{ "ok": true }
```

---

### Menú — `/api/menu`

> **Ownership:** Las operaciones de escritura (crear, actualizar, toggle, eliminar ítems y componentes) validan que el usuario con rol `RESTAURANTE` solo pueda gestionar ítems de su propio restaurante. Intentar modificar ítems de otro restaurante devuelve `400 FORBIDDEN`.

#### GET `/api/menu/categorias` — Listar categorías _(autenticado)_

```bash
curl http://localhost:8080/api/menu/categorias \
  -H "Authorization: Bearer <token>"
```

```json
[
  { "codigo": "ENTRADAS", "nombre": "Entradas" },
  { "codigo": "FONDOS",   "nombre": "Fondos" },
  { "codigo": "POSTRES",  "nombre": "Postres" },
  { "codigo": "BEBIDAS",  "nombre": "Bebidas" }
]
```

---

#### GET `/api/menu/items` — Listar ítems de menú _(autenticado)_

```bash
curl "http://localhost:8080/api/menu/items?restauranteId=c3d4e5f6-...&categoria=FONDOS&soloDisponibles=true" \
  -H "Authorization: Bearer <token>"
```

```json
[
  {
    "id": "f6a7b8c9-...",
    "nombre": "Lomo Saltado",
    "descripcion": "Clásico peruano con papas fritas",
    "precio": 28.00,
    "categoria": "FONDOS",
    "disponible": true,
    "imagenUrl": "/images/lomo-saltado.jpg"
  }
]
```

---

#### POST `/api/menu/items` — Crear ítem _(admin o restaurante)_

```bash
curl -X POST http://localhost:8080/api/menu/items \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "restauranteId": "c3d4e5f6-...",
    "nombre": "Ceviche Clásico",
    "descripcion": "Pescado fresco, limón, ají y choclo",
    "precio": 32.00,
    "categoria": "ENTRADAS",
    "imagenUrl": "/images/ceviche.jpg"
  }'
```

```json
{ "id": "g7h8i9j0-..." }
```

---

#### PUT `/api/menu/items/{id}` — Actualizar ítem _(admin o restaurante)_

```bash
curl -X PUT http://localhost:8080/api/menu/items/g7h8i9j0-... \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "precio": 34.00, "descripcion": "Pescado fresco del día" }'
```

```json
{ "ok": true }
```

---

#### PATCH `/api/menu/items/{id}/toggle` — Activar / desactivar ítem _(admin o restaurante)_

```bash
curl -X PATCH http://localhost:8080/api/menu/items/g7h8i9j0-.../toggle \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "disponible": false }'
```

`202 Accepted`
```json
{ "ok": true }
```

---

#### DELETE `/api/menu/items/{id}` — Eliminar ítem _(admin o restaurante)_

```bash
curl -X DELETE http://localhost:8080/api/menu/items/g7h8i9j0-... \
  -H "Authorization: Bearer <token>"
```

```json
{ "ok": true }
```

---

#### GET `/api/menu/items/{menuId}/componentes` — Componentes de un combo _(autenticado)_

```bash
curl http://localhost:8080/api/menu/items/f6a7b8c9-.../componentes \
  -H "Authorization: Bearer <token>"
```

```json
[
  { "id": "comp-001-...", "itemId": "h8i9j0k1-...", "nombre": "Arroz con leche", "cantidad": 1 }
]
```

---

#### POST `/api/menu/items/{menuId}/componentes` — Agregar componente _(admin o restaurante)_

```bash
curl -X POST http://localhost:8080/api/menu/items/f6a7b8c9-.../componentes \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "h8i9j0k1-...",
    "cantidad": 1
  }'
```

```json
{ "id": "comp-002-..." }
```

---

#### DELETE `/api/menu/items/{menuId}/componentes/{itemId}` — Quitar componente _(admin o restaurante)_

```bash
curl -X DELETE http://localhost:8080/api/menu/items/f6a7b8c9-.../componentes/h8i9j0k1-... \
  -H "Authorization: Bearer <token>"
```

```json
{ "ok": true }
```

---

#### GET `/api/menu/items/{armaPlatoId}/arma-plato` — Opciones de arma tu plato _(autenticado)_

```bash
curl http://localhost:8080/api/menu/items/bowl-base-001-.../arma-plato \
  -H "Authorization: Bearer <token>"
```

```json
[
  { "id": "opc-001-...", "nombre": "Quinoa", "tipo": "BASE",     "precio": 0.00 },
  { "id": "opc-002-...", "nombre": "Pollo a la plancha", "tipo": "PROTEINA", "precio": 5.00 },
  { "id": "opc-003-...", "nombre": "Palta", "tipo": "TOPPING",  "precio": 2.00 }
]
```

---

#### POST `/api/menu/items/{armaPlatoId}/arma-plato` — Agregar opción arma tu plato _(admin o restaurante)_

```bash
curl -X POST http://localhost:8080/api/menu/items/bowl-base-001-.../arma-plato \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "itemId": "opc-004-...",
    "tipo": "TOPPING",
    "precioAdicional": 1.50
  }'
```

```json
{ "id": "opc-005-..." }
```

---

### Pedidos — `/api/pedidos`

#### POST `/api/pedidos` — Crear pedido _(cliente)_

```bash
curl -X POST http://localhost:8080/api/pedidos \
  -H "Authorization: Bearer <token-cliente>" \
  -H "Content-Type: application/json" \
  -d '{
    "restauranteId": "c3d4e5f6-...",
    "modo": "SALON",
    "mesaId": "d4e5f6a7-...",
    "numComensales": 2,
    "notas": "Sin picante por favor",
    "items": [
      { "itemId": "f6a7b8c9-...", "cantidad": 1, "notas": "" },
      { "itemId": "g7h8i9j0-...", "cantidad": 2, "notas": "Extra limón" }
    ]
  }'
```

```json
{ "id": "k1l2m3n4-..." }
```

---

#### GET `/api/pedidos/{id}` — Detalle de pedido _(autenticado)_

```bash
curl http://localhost:8080/api/pedidos/k1l2m3n4-... \
  -H "Authorization: Bearer <token>"
```

```json
{
  "id": "k1l2m3n4-...",
  "restauranteId": "c3d4e5f6-...",
  "clienteId": "a1b2c3d4-...",
  "modo": "SALON",
  "estado": "PENDIENTE",
  "total": 88.00,
  "notas": "Sin picante por favor",
  "creadoEn": "2025-06-11T14:30:00",
  "items": [
    { "itemId": "f6a7b8c9-...", "nombre": "Lomo Saltado", "cantidad": 1, "precioUnitario": 28.00, "subtotal": 28.00 },
    { "itemId": "g7h8i9j0-...", "nombre": "Ceviche Clásico", "cantidad": 2, "precioUnitario": 32.00, "subtotal": 64.00, "notas": "Extra limón" }
  ]
}
```

---

#### GET `/api/pedidos/restaurante/{restauranteId}` — Pedidos del restaurante _(admin o restaurante)_

```bash
curl "http://localhost:8080/api/pedidos/restaurante/c3d4e5f6-...?estado=PENDIENTE&modo=SALON" \
  -H "Authorization: Bearer <token>"
```

```json
[
  { "id": "k1l2m3n4-...", "estado": "PENDIENTE", "modo": "SALON", "total": 88.00, "creadoEn": "2025-06-11T14:30:00" }
]
```

---

#### GET `/api/pedidos/cliente` — Mis pedidos _(cliente)_

```bash
curl http://localhost:8080/api/pedidos/cliente \
  -H "Authorization: Bearer <token-cliente>"
```

```json
[
  { "id": "k1l2m3n4-...", "estado": "ENTREGADO", "modo": "TAKEAWAY", "total": 34.00, "creadoEn": "2025-06-10T12:00:00" }
]
```

---

#### PATCH `/api/pedidos/{id}/estado` — Cambiar estado _(admin, restaurante o repartidor)_

Flujo salón / recojo: `recibido → en_preparacion → listo → entregado`  
Flujo delivery: `recibido → en_preparacion → listo → asignado → en_camino → entregado`

Estados válidos: `recibido` · `en_preparacion` · `listo` · `entregado` · `asignado` · `en_camino`

```bash
curl -X PATCH http://localhost:8080/api/pedidos/k1l2m3n4-.../estado \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "estado": "en_preparacion" }'
```

`202 Accepted`
```json
{ "ok": true }
```

---

#### PATCH `/api/pedidos/{id}/repartidor` — Asignar repartidor _(admin o restaurante)_

```bash
curl -X PATCH http://localhost:8080/api/pedidos/k1l2m3n4-.../repartidor \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "repartidorId": "z9y8x7w6-..." }'
```

`202 Accepted`
```json
{ "ok": true }
```

---

#### POST `/api/pedidos/{id}/cancelar` — Cancelar pedido _(autenticado)_

```bash
curl -X POST http://localhost:8080/api/pedidos/k1l2m3n4-.../cancelar \
  -H "Authorization: Bearer <token>"
```

```json
{ "ok": true }
```

---

#### GET `/api/pedidos/{id}/historial` — Historial de estados _(autenticado)_

```bash
curl http://localhost:8080/api/pedidos/k1l2m3n4-.../historial \
  -H "Authorization: Bearer <token>"
```

```json
[
  { "estado": "PENDIENTE",       "cambiadoEn": "2025-06-11T14:30:00", "usuarioId": "a1b2c3d4-..." },
  { "estado": "EN_PREPARACION",  "cambiadoEn": "2025-06-11T14:32:00", "usuarioId": "b2c3d4e5-..." }
]
```

---

### Pagos — `/api/pagos`

#### POST `/api/pagos` — Registrar pago _(autenticado)_

```bash
curl -X POST http://localhost:8080/api/pagos \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{
    "pedidoId": "k1l2m3n4-...",
    "metodo": "TARJETA",
    "monto": 88.00
  }'
```

```json
{ "id": "pago-001-..." }
```

---

#### PATCH `/api/pagos/{id}/confirmar` — Confirmar pago _(admin)_

```bash
curl -X PATCH http://localhost:8080/api/pagos/pago-001-.../confirmar \
  -H "Authorization: Bearer <token-admin>" \
  -H "Content-Type: application/json" \
  -d '{ "referenciaExterna": "TXN-987654" }'
```

`202 Accepted`
```json
{ "ok": true }
```

---

#### PATCH `/api/pagos/{id}/fallo` — Marcar pago fallido _(admin)_

```bash
curl -X PATCH http://localhost:8080/api/pagos/pago-001-.../fallo \
  -H "Authorization: Bearer <token-admin>"
```

`202 Accepted`
```json
{ "ok": true }
```

---

#### GET `/api/pagos/pedido/{pedidoId}` — Pago de un pedido _(autenticado)_

```bash
curl http://localhost:8080/api/pagos/pedido/k1l2m3n4-... \
  -H "Authorization: Bearer <token>"
```

```json
{
  "id": "pago-001-...",
  "pedidoId": "k1l2m3n4-...",
  "metodo": "TARJETA",
  "monto": 88.00,
  "estado": "CONFIRMADO",
  "referenciaExterna": "TXN-987654",
  "creadoEn": "2025-06-11T14:35:00"
}
```

---

### Etiquetas — `/api/items/{itemId}/etiquetas`

#### POST — Asignar etiqueta a ítem _(admin o restaurante)_

```bash
curl -X POST http://localhost:8080/api/items/g7h8i9j0-.../etiquetas \
  -H "Authorization: Bearer <token>" \
  -H "Content-Type: application/json" \
  -d '{ "codigo": "VEGANO" }'
```

```json
{ "ok": true }
```

---

#### GET — Etiquetas de un ítem _(autenticado)_

```bash
curl http://localhost:8080/api/items/g7h8i9j0-.../etiquetas \
  -H "Authorization: Bearer <token>"
```

```json
[
  { "codigo": "VEGANO",    "nombre": "Vegano" },
  { "codigo": "SIN_GLUTEN","nombre": "Sin Gluten" }
]
```

---

#### DELETE `/api/items/{itemId}/etiquetas/{codigo}` — Quitar etiqueta _(admin o restaurante)_

```bash
curl -X DELETE http://localhost:8080/api/items/g7h8i9j0-.../etiquetas/VEGANO \
  -H "Authorization: Bearer <token>"
```

```json
{ "ok": true }
```
