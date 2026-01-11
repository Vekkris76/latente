# LATENTE — SISTEMA_ESTADO (v1)

Fecha: 2026-01-10  
Estado: CERRADO (v1)  
Fuentes de verdad: 00_DECISIONES_V1.md + specs Fase 0 (01..08) + Seguridad/Eliminación v1.

---

## 0) Principios invariantes (NO negociables)

### Anti-GPS / Anti-tracking
- El sistema NO almacena coordenadas, geohash, dirección, nombres de lugares, SSID/BSSID, IDs Bluetooth, torres móviles, device IDs, IP ni timestamps exactos en inputs.
- Los eventos de entrada aceptan SOLO una lista cerrada de campos abstractos.

### Anti-engagement
- No hay feed, ranking, boosts, ni “número de candidatos”.
- No hay rechazo explícito visible: si no hay match, simplemente no progresa.
- Sin presión temporal artificial:
  - TTLs existen por minimización de datos, no por “urgencia psicológica”.
- Purga de datos y TTLs obligatorios.

---

## 1) Catálogos cerrados (entrada de datos)

### AbstractEvent (input permitido)
Campos permitidos (lista cerrada):
- time_bucket: morning | midday | afternoon | evening | night
- place_category: cafe | library | park | gym | coworking | cultural | transport | education | other
- day_type: weekday | weekend | holiday
- duration_bucket: short | medium | long
- week_id: YYYY-Www (ISO)

Campos prohibidos (no exhaustivo): latitude/longitude/geohash/address/place_name/place_id/zone/radius/distance/bluetooth_id/wifi_ssid/wifi_bssid/cell_tower_id/device_id/advertising_id/imei/ip/timestamp/exact_timestamp/etc.

---

## 2) Entidades y estados

### 2.1 AbstractEvent
- Persistencia: in-memory (MVP)
- Estado: (si existe) pending | stored
- Invariantes:
  - Rechazar cualquier campo no permitido o prohibido.

### 2.2 Pattern
Se detecta por usuario a partir de eventos.
- Clave: (user_id, place_category, time_bucket, day_type*)
- Reglas:
  - Mínimo 3 coincidencias deduplicadas
  - Ventana de 4 semanas
  - Excluir place_category=transport
  - Deduplicación por (week_id, day_type, time_bucket, place_category)
  - duration_bucket NO influye en detección

\* day_type: se utiliza para consistencia con deduplicación y priorización posterior.

### 2.3 CoPresence (co-presencia latente)
Existe entre A y B si:
- Ambos tienen patrones válidos
- Coincidencia exacta en place_category + time_bucket
- Solapamiento week_id >= 1 (ambos tienen eventos del patrón en al menos una semana común)
- No bloqueo/reporte mutuo
- Límites:
  - máx 2 copresencias activas por usuario
  - máx 1 propuesta activa por usuario
  - cooldown 7 días tras declinar propuesta

Estado:
- active | inactive (o borrado)

### 2.4 WindowProposal (propuesta de ventana)
Se genera desde una CoPresence.
Información “mostrable” (no identidad):
- patrón abstracto legible (categoria + franja)
- fecha + hora inicio/fin
- acciones: aceptar / declinar
- contexto educativo solo primera vez (si está implementado)

Estados:
- pending
- accepted_by_a / accepted_by_b
- activated
- declined
- expired

Reglas temporales:
- Fecha: mañana..+7 días (nunca el mismo día)
- Priorización day_type del patrón (weekday/weekend; holiday no inferible sin calendario)
- Hora: midpoint del time_bucket (definidos):
  - morning -> 09:00
  - afternoon -> 15:00
  - evening -> 20:00
  - midday/night: no definidos -> no generar propuesta (MVP)
- Horario permitido: 08:00–22:00
- Duración exacta v1: 30 minutos
- TTL propuesta v1: 48 horas

Efectos:
- Si uno declina: cooldown 7 días SOLO al declinante; purga copresencia; sin rechazo visible al que aceptó.
- Si timeout: expira; purga copresencia; sin cooldown.

### 2.5 ActiveWindow (ventana activa)
Se crea cuando WindowProposal pasa a activated.
- Estado: active -> completed
- Solo dentro del rango [start_time, end_time] se permite confirmación.

### 2.6 Recognition (“Creo que te he visto”)
Acción positiva, sin acción negativa.
- Un Recognition por (active_window_id, user_id)
- Mutualidad:
  - Si ambos confirman dentro de ventana activa -> revelación
  - Si solo uno confirma -> no revelación; purga reconocimiento unilateral a 24h

TTL no-mutuo v1: 24 horas

### 2.7 Revelation + Conversation
Se crea solo tras reconocimiento mutuo.
- Estado: active -> expired
- TTL revelación/conversación v1: 7 días
- Conversación: texto simple (MVP)
- Al expirar: se purga conversación

### 2.8 Block / Report (Seguridad v1)
Bloquear:
- Solo tras revelación (v1)
- Efecto:
  - expira/cierra revelación
  - purga conversación
  - impide futuras copresencias/propuestas/ventanas/revelaciones entre ambos
  - sin notificación al bloqueado
- Persistencia: no expira

Reportar:
- Solo tras revelación (v1)
- Captura mínima:
  - reporter_user_id
  - reported_user_id
  - reason (lista cerrada)
  - created_at
- Efecto:
  - crea reporte
  - aplica bloqueo automático

### 2.9 Eliminación de cuenta (v1)
deleteAccount(userId):
- Purga:
  - events, patterns, copresences, proposals, active windows, recognitions, revelations, conversations, cooldown, proposalState y perfil (si existe)
- Conserva:
  - bloqueos emitidos por el usuario (prevención)
  - (bloqueos hacia el usuario se pueden conservar para proteger a terceros)
- Sin notificación explícita a otros usuarios.

---

## 3) TTLs y límites (v1)

- TTL propuesta: 48h
- Cooldown tras declinar: 7 días
- TTL no-mutuo: 24h
- TTL revelación/conversación: 7 días
- Máx propuestas activas simultáneas: 1 / usuario
- Máx copresencias activas: 2 / usuario

---

## 4) Invariantes de seguridad funcional (tests obligatorios)

- Rechazo de campos prohibidos en AbstractEvent.
- CoPresence NO se genera con:
  - transport
  - bloqueos/reportes
  - límites excedidos
  - propuesta activa
  - cooldown activo
- Propuesta:
  - no muestra identidad
  - no incluye ubicaciones
  - respeta 08:00–22:00
- Decisiones:
  - no rechazo explícito visible
  - cooldown solo declinante
  - timeout sin cooldown
- Reconocimiento:
  - solo dentro de ventana activa
  - no-mutuo se purga a 24h
- Revelación:
  - TTL 7 días y purga conversación
- Bloqueo/Reporte:
  - solo tras revelación
  - impide futuros emparejamientos
- Eliminación:
  - purga completa + conserva bloqueos emitidos