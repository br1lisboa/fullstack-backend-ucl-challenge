# Champions League Draw API

API REST para el sorteo de la Champions League en formato Swiss Round: 36 equipos, 8 jornadas, 144 partidos.

**Autor:** Bruno Lisboa

---

## Setup

```bash
npm install
npx prisma generate
npx prisma migrate dev
npm run seed

# Desarrollo
npm run dev          # http://localhost:8000

# Tests
npm run test:unit    # Vitest (34 unit tests)
npm test             # Mocha + Chai E2E (38 integration tests)
npm run test:load    # Autocannon load tests (8 scenarios)
```

---

## API Endpoints

| Method | Path | Descripcion |
|--------|------|-------------|
| GET | `/health` | Health check del servicio |
| POST | `/draw` | Ejecutar el sorteo (201 / 409 si ya existe) |
| GET | `/draw` | Obtener el sorteo actual (200 / 404) |
| DELETE | `/draw` | Eliminar el sorteo (200 / 404) |
| GET | `/draw/statistics` | Estadisticas del sorteo |
| GET | `/matches` | Listar partidos con filtros y paginacion |
| GET | `/matches/:id` | Detalle de un partido |
| GET | `/teams` | Listar los 36 equipos |
| GET | `/teams/:id` | Detalle de equipo con sus partidos |
| GET | `/api-docs` | Documentacion Swagger/OpenAPI |

### Query params de GET /matches

| Param | Tipo | Descripcion |
|-------|------|-------------|
| `teamId` | int | Filtrar por equipo (home o away) |
| `matchDay` | int (1-8) | Filtrar por jornada exacta |
| `matchDayFrom` | int (1-8) | Filtrar desde jornada (rango) |
| `matchDayTo` | int (1-8) | Filtrar hasta jornada (rango) |
| `countryId` | int | Filtrar por pais (equipos home o away) |
| `sortBy` | string | Ordenar por: `matchDay`, `homeTeam`, `awayTeam`, `id` (default: `matchDay`) |
| `sortOrder` | string | `asc` o `desc` (default: `asc`) |
| `page` | int (>0) | Pagina (default: 1) |
| `limit` | int (1-100) | Resultados por pagina (default: 10) |

---

## Bugs encontrados y soluciones

### 1. MAX_COUNTRY_OPPONENTS incorrecto

**Archivo:** `src/contexts/draw/domain/application/draw-assigner.service.ts`

**Problema:** La constante `MAX_COUNTRY_OPPONENTS` estaba en `3`, pero la regla del dominio dice que un equipo no puede enfrentar a mas de 2 equipos del mismo pais.

**Solucion:** Cambiar de `3` a `2`. El fix es directo porque la constante ya se usaba correctamente en las validaciones del algoritmo; simplemente tenia el valor equivocado.

### 2. Tipo de drawId como string

**Archivo:** `src/contexts/draw/domain/application/draw-assigner.service.ts`

**Problema:** En `generateMatches()` se pasaba `String(drawId)` a `tryGenerateMatches()`, y el parametro estaba tipado como `any`. Esto provocaba que los matches se crearan con `drawId` como string en vez de number, rompiendo la comparacion estricta `match.drawId === 42` en los tests.

**Solucion:** Eliminar la conversion `String()`, pasar `drawId` directamente, y tipar el parametro como `number` en lugar de `any`. Esto mantiene coherencia con la interfaz de `Match.create()` que espera un number.

### 3. CreateDrawService sin validacion de draw existente

**Archivo:** `src/contexts/draw/application/create-draw.service.ts`

**Problema:** El service creaba un nuevo draw sin verificar si ya existia uno. Esto permitia multiples sorteos simultaneos, violando la regla de negocio de un unico sorteo activo.

**Solucion:** Antes de crear, consultar `drawRepository.searchCurrent()`. Si ya existe, lanzar `DrawAlreadyExistsError` (la clase ya existia en `domain/exceptions/` pero no se usaba). Decidi poner la validacion en el application service porque es una regla de negocio, no de presentacion.

### 4. draw.router.ts no maneja error 409

**Archivo:** `src/contexts/draw/presentation/draw.router.ts`

**Problema:** El catch del POST `/draw` trataba todos los errores como 400. El test E2E esperaba un 409 con body `"Draw already exists"` (texto plano, no JSON).

**Solucion:** Agregar un `instanceof DrawAlreadyExistsError` antes del catch generico, respondiendo con `res.status(409).send("Draw already exists")`. Use `send()` en lugar de `json()` porque el test valida `response.text` en vez de `response.body.message`.

### 5. SearchMatchesService sin validacion de paginacion

**Archivo:** `src/contexts/matches/application/search-matches.service.ts`

**Problema:** El service aceptaba cualquier valor de `page` y `limit` sin validar. Los unit tests esperaban que `page: 0` lance error y que `limit: 150` caiga al default.

**Solucion:** Dos comportamientos distintos segun lo que dictan los tests:
- `page < 1` → throw Error (el test espera un rechazo explicito)
- `limit` fuera de rango (< 1 o > 100) → reset a `undefined` para que tome el default de 10 (el test espera que el repository reciba `limit: 10`, no un error)

Esta asimetria viene de los tests: el de page espera `rejects.toThrow()` mientras que el de limit espera que el repository se llame con el default. Respete lo que los tests dictaban.

### 6. matches.router.ts no usa schema Zod

**Archivo:** `src/contexts/matches/presentation/matches.router.ts`

**Problema:** Los query params se parseaban manualmente con `Number()` sin ninguna validacion. El schema `SearchMatchesQuerySchema` ya existia en `dtos/search-matches.dto.ts` con validaciones de rango (matchDay 1-8, page > 0, limit 1-100), pero nunca se importaba ni usaba.

**Solucion:** Importar el schema y usarlo con `SearchMatchesQuerySchema.parse(req.query)` al inicio del handler. Agregar un catch especifico para `ZodError` que responda 400 con el mensaje del primer issue. Esto cubre la validacion de matchDay fuera de rango que los tests E2E verifican.

---

## Endpoints implementados

### DELETE /draw

Reutilice `DrawRepository.deleteAll()` que ya existia y hacia el cascade delete correcto (Match → DrawTeamPot → Draw en una transaccion). Solo agregue la verificacion previa con `searchCurrent()` para devolver 404 si no hay draw.

### GET /health

Lo monte directamente en `routes.ts` sin pasar por el container de DI. Un health check no tiene logica de negocio ni estado, asi que no justifica crear un service/repository para algo tan simple.

---

## Mejoras opcionales implementadas

### Teams bounded context (GET /teams, GET /teams/:id)

El directorio `src/contexts/teams/` solo tenia el seed script. Lo extendi con la misma estructura DDD del proyecto: domain (entity + repository interface), infrastructure (PrismaTeamRepository), application (SearchTeamsService, SearchTeamByIdService), y presentation (teamsRouter).

`GET /teams/:id` devuelve el equipo junto con sus 8 partidos, reutilizando el `MatchRepository.findAll()` existente con filtro por teamId.

### GET /matches/:id

Agregue `findById()` a la interfaz `MatchRepository` y su implementacion en `PrismaMatchRepository`. El endpoint valida el ID con Zod y devuelve 404 si no existe.

### GET /draw/statistics

Servicio que calcula estadisticas a partir de los datos existentes: total de partidos, partidos por jornada, y distribucion de equipos por pais. Requiere un draw activo (404 si no existe).

### Filtros adicionales en GET /matches

Extendi el endpoint con tres capacidades nuevas:

- **Rango de jornadas** (`matchDayFrom`, `matchDayTo`): usa `gte`/`lte` en Prisma. Se ignora si `matchDay` exacto esta presente.
- **Filtro por pais** (`countryId`): filtra matches donde el homeTeam o awayTeam pertenezca a ese pais. Usa `OR` en la relacion de Prisma.
- **Ordenamiento** (`sortBy`, `sortOrder`): soporta ordenar por jornada, equipo local, equipo visitante o ID. El orderBy se mapea dinamicamente a la query de Prisma incluyendo ordenamiento por relaciones (`homeTeam.name`).

Los tres se validan con Zod en el schema y se propagan por la cadena: dto → service → repository → Prisma query.

### Swagger / OpenAPI

Agregue `swagger-jsdoc` + `swagger-ui-express` montado en `/api-docs`. Defini los schemas inline en el archivo de configuracion en vez de usar JSDoc annotations en cada router, porque el proyecto no tenia ese patron establecido y no queria agregar ruido a los archivos existentes.

### Diagrama de arquitectura

Documentado en `api-docs/ARCHITECTURE.md` con diagramas ASCII: overview del sistema, estructura de cada bounded context, flujo de un request, y esquema de base de datos.

### Coleccion Postman

`api-docs/postman_collection.json` — importable en Postman o Insomnia. Incluye 16 requests organizados por categoria (Health, Draw, Matches, Teams, Validation) con variable `baseUrl` configurable.

### Tests de carga

`npm run test:load` ejecuta 8 escenarios con autocannon contra todos los endpoints de lectura. Mide requests/sec, latencia promedio, p99 y errores. Corre un servidor en puerto separado (8099) con un draw pre-creado.

---

## Decisiones tecnicas

### Validacion en dos capas

La validacion de query params ocurre en dos lugares:
1. **Router** (Zod): transforma strings a numeros y valida rangos (matchDay 1-8, teamId > 0)
2. **Service**: valida reglas de paginacion (page >= 1, limit en rango)

Esto es una consecuencia de los tests: los unit tests del service esperan que el service valide, y los E2E esperan que el router devuelva 400. Mantener ambas capas asegura que el service sea seguro de usar independientemente del transport.

### No agregar global error handler

El proyecto usa try/catch inline en cada handler. Considere agregar un middleware global de errores, pero el challenge dice explicitamente "no reescribir todo desde cero". Los routers existentes ya tenian su patron, y los nuevos endpoints lo siguen por consistencia.

### Swagger con definicion inline vs JSDoc

Preferi definir la spec de OpenAPI en un solo archivo (`swagger.ts`) en vez de distribuir JSDoc annotations en cada router. Es mas facil de mantener y evita mezclar documentacion con logica de routing.

### Reutilizar DrawRepository.deleteAll()

El metodo ya existia con el orden correcto de borrado en una transaccion. No habia necesidad de reimplementarlo ni de agregar `onDelete: Cascade` al schema de Prisma, lo cual hubiera requerido una migracion.

---

## Supuestos

- El test de 409 espera `response.text` (texto plano), no `response.body.message` (JSON). Adapte la respuesta a lo que el test valida.
- Para `limit` fuera de rango, el unit test espera un fallback al default en vez de un error. Segui lo que el test dicta.
- Los endpoints bonus no tienen tests E2E (los tests son read-only). Se validaron manualmente con el servidor corriendo.
- El schema de Prisma no tiene `onDelete: Cascade` pero `deleteAll()` ya maneja el orden de borrado. No modifique el schema.

---

## Stack

- **Runtime:** Node.js 18+
- **Lenguaje:** TypeScript
- **Framework:** Express.js
- **ORM:** Prisma (SQLite + better-sqlite3)
- **DI:** InversifyJS
- **Validacion:** Zod
- **Testing:** Vitest (unit) + Mocha/Chai/ChaiHttp (E2E)
- **Docs:** Swagger (swagger-jsdoc + swagger-ui-express)
