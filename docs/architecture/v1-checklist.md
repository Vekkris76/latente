# LATENTE — Checklist de cierre v1 (funcional)

Fecha: 2026-01-10

## A. Principios (bloqueantes)

- [ ] Anti-GPS: ningún evento acepta ni almacena latitude/longitude, geohash, place_name/place_id/venue_id, wifi_bssid, bluetooth_id, exact_timestamp, device_id, ip_address.
- [ ] Anti-engagement: sin feed, sin ranking, sin boosts, sin loops de engagement.
- [ ] Minimización: solo campos permitidos (time_bucket, place_category, day_type, duration_bucket, week_id).
- [ ] No identidad antes de mutual confirm (revelación solo tras confirmación mutua).

## B. Flujo core (v1)

- [ ] Ingesta: `EventIngestionService.ingest(userId, input)` valida y guarda eventos.
- [ ] Patrones: `PatternDetectionService.detectForUser(userId)` detecta patrón (>=3 repeticiones / 4 semanas) y excluye transport.
- [ ] Copresencias: `CoPresenceDetectionService.detectForUsers(userIds)` crea copresencias solo si hay overlap week_id >= 1 y sin bloqueos/reportes.
- [ ] Propuestas: `WindowProposalService.generateFromCoPresences(now)` crea propuesta con reglas de 04.
- [ ] Decisiones: `WindowDecisionService.accept/decline/expireProposals` aplica TTL 48h y cooldown 7d tras decline.
- [ ] Ventana activa: `ActiveWindowService.activateFromProposal` y `getActiveWindowForUser`.
- [ ] Reconocimiento: `RecognitionService.confirm` gestiona mutual/no-mutual (TTL no-mutual 24h).
- [ ] Revelación: `RevelationService.createFromActiveWindow` y `getRevelationForUser` (TTL 7 días).

## C. Seguridad / cuenta

- [ ] Safety: bloqueo y reporte impiden copresencias/propuestas futuras (según tests existentes).
- [ ] Eliminación de cuenta: `AccountDeletionService` purga datos del usuario (según tests existentes).

## D. Retención / expiraciones

- [ ] TTL propuesta: 48h (expire manual invocable, sin cron).
- [ ] TTL reconocimiento no-mutuo: 24h.
- [ ] TTL revelación/conversación: 7 días.
- [ ] Cooldown declinar: 7 días.
- [ ] Límite propuestas activas: 1.
- [ ] Límite copresencias activas: 2.

## E. Verificación (evidencias)

- [ ] Unit tests: `npm run test:unit` en verde.
- [ ] Integration tests: `npm run test:integration` en verde.
- [ ] Runner demo: `npm run runner:demo` ejecuta happy path sin errores (si aplica).
- [ ] `api-servicios.md` generado desde código (fuente de verdad).