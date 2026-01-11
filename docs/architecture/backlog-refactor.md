# LATENTE — Backlog de Refactor (higiene) — MVP v1

Fecha: 2026-01-10  
Objetivo: Reducir fricción técnica sin cambiar funcionalidad ni principios (anti-GPS / anti-engagement).  
Alcance: Solo refactor ligero, tipado, coherencia de APIs, runners, docs.

---

## D1 — Normalizar rutas e imports (higiene)

### Tareas
- [ ] D1.1 Identificar todas las rutas actuales de servicios (`src/application/services/**`) y documentarlas.
- [ ] D1.2 Eliminar “TODO IMPORT PATH” en runners y reemplazar por rutas definitivas.
- [ ] D1.3 Unificar carpeta de servicios por dominio (`events/`, `patterns/`, `copresences/`, `windows/`, `recognition/`, `revelation/`, etc.) sin cambiar nombres públicos.
- [ ] D1.4 Unificar naming plural/singular: `copresence` vs `copresences` (consistencia).

### Hecho (criterio verificable)
- `grep -R "TODO IMPORT PATH" -n scripts/runners` devuelve 0 resultados.
- `npm run build` (tsc) compila sin errores.
- Los runners compilan sin necesitar cambios manuales de rutas.

---

## D2 — Convención consistente de métodos de servicios (async y retornos)

### Tareas
- [ ] D2.1 Listar métodos públicos por servicio y si son sync/async.
- [ ] D2.2 Definir convención mínima: métodos de servicios que consultan/crean datos son `async` y retornan valor (no `void`).
- [ ] D2.3 Eliminar duplicidad innecesaria de métodos (ej: `detectAllUsers` vs `detectForUsers`), manteniendo compatibilidad si es necesario.

### Hecho
- Existe `docs/api_servicios.md` con lista de métodos públicos + firmas definitivas.
- Los runners no requieren lógica adaptativa (`if (service as any).detectX`) para funcionar.
- No hay servicios que devuelvan `Promise { <pending> }` en logs por falta de `await`.

---

## D3 — Tipado en runners (eliminar `as any`)

### Tareas
- [ ] D3.1 Tipar retornos de métodos de servicios usados por runners (ej: proposals, activeWindow, revelation).
- [ ] D3.2 Añadir métodos de repos usados por runners con tipos estables (`findAllByUser`, `findByUser`, `findAll`, etc.).
- [ ] D3.3 Eliminar `as any` en `scripts/runners/demoHappyPath.ts`.
- [ ] D3.4 Eliminar `as any` en `scripts/runners/demoSadPaths.ts`.

### Hecho
- `grep -R "as any" -n scripts/runners` devuelve 0 resultados.
- `npm run build` compila sin errores.
- `npm run runner:demo` y `npm run runner:sad` ejecutan sin warnings TypeScript.

---

## D4 — Expiración/Purga sin cron (invocable manualmente)

### Objetivo
Permitir ejecutar expiraciones/purgas desde runners y tests sin depender de cron/jobs.

### Tareas
- [ ] D4.1 Exponer método manual de expiración de propuestas (TTL=48h): `WindowDecisionService.expireProposals(now)` o equivalente.
- [ ] D4.2 Exponer método manual de purga reconocimiento no-mutuo (TTL=24h): `RecognitionService.purgeExpired(now)` o equivalente.
- [ ] D4.3 Exponer método manual de purga revelación/conversación (TTL=7 días) si aplica: `RevelationService.purgeExpired(now)` o equivalente.
- [ ] D4.4 Añadir tests unit/integration de expiración y purga manual.

### Hecho
- `npm run runner:sad` ejecuta S1/S2/S3 sin secciones “TODO” ni pasos manuales.
- Existe al menos 1 test por cada expiración/purga manual.
- No se introduce cron ni timers automáticos en el runner.

---

## D5 — Eliminar placeholders de copy (sin inventar)

### Problema
Existen strings “placeholder” que pueden inventar información no soportada por la spec.

### Tareas
- [ ] D5.1 Localizar placeholders en servicios (ej: `pattern_summary` en revelación).
- [ ] D5.2 Sustituir placeholders por generadores deterministas basados solo en:
  - `place_category`
  - `time_bucket`
  - (y otros campos permitidos si aplica, sin ubicación ni día concreto si no está definido)
- [ ] D5.3 Centralizar textos en un catálogo (ej: `src/i18n/es.ts` o `src/copy/es.ts`).

### Hecho
- No existen comentarios `// Placeholder` en `src/services`.
- Tests verifican que `pattern_summary`:
  - no incluye GPS/ubicación/IDs únicos
  - no inventa “martes” u otros detalles no definidos
- Todos los textos del usuario están centralizados y versionables.

---

## D6 — Logging y minimización de datos (en demo y tests)

### Tareas
- [ ] D6.1 Añadir un flag de logging verbose (ej: `VERBOSE=1`) para runners.
- [ ] D6.2 En modo no-verbose, loggear solo IDs/estados (no eventos completos).
- [ ] D6.3 Revisar logs en tests para evitar impresión accidental de datos no necesarios.

### Hecho
- `VERBOSE=0 npm run runner:demo` no imprime payloads completos de eventos.
- `VERBOSE=1 npm run runner:demo` imprime detalle útil para debugging.
- No aparecen campos prohibidos en logs (validación anti-GPS).

---

## Orden recomendado de ejecución (dependencias)

1. D1 (rutas/imports)  
2. D3 (tipado runners)  
3. D2 (convención de métodos)  
4. D4 (expirar/purgar manual)  
5. D5 (copy determinista)  
6. D6 (logging minimizado)

---

## Definición de “terminado” global

- `npm run test:unit` OK  
- `npm run test:integration` OK  
- `npm run runner:demo` OK (happy path)  
- `npm run runner:sad` OK (3 escenarios sin TODOs)  
- `npm run build` OK  
- No hay `as any` en runners  
- No hay placeholders en servicios