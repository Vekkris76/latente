# 10 — Modelo de datos funcional

## Entidades principales
Las siguientes entidades representan el modelo de datos conceptual de LATENTE v1. Este documento NO define implementación técnica (tablas, índices, tipos de datos), solo atributos funcionales y estados.

1. User
2. ConsentState
3. AbstractEvent
4. Pattern
5. LatentCoPresence
6. SyncWindow
7. Recognition
8. Revelation
9. Block
10. Report

---

## 1. User

### Atributos conceptuales
- **user_id**: Identificador único interno (no mostrado al usuario)
- **name**: Nombre del usuario (obligatorio, máx 50 caracteres)
- **age**: Edad del usuario (obligatorio - TODO: definir si es número exacto o rango)
- **profile_photo**: URL o referencia a foto de perfil (opcional)
- **observation_active**: Boolean - indica si el usuario tiene la observación activa o pausada
- **created_at**: Timestamp de creación de la cuenta
- **account_status**: Estado de la cuenta (active, suspended, deleted)

### Estados posibles
- **active**: Cuenta activa, observación activa
- **active_paused**: Cuenta activa, observación pausada
- **suspended**: Cuenta suspendida por moderación (no puede usar el sistema)
- **deleted**: Cuenta eliminada (soft delete para cumplimiento legal - TODO: definir)

### Campos explícitamente prohibidos
- latitude, longitude, last_known_location
- device_id, ip_address, advertising_id
- social_graph_ids, contact_list
- email, phone_number (se almacenan para autenticación, NO en esta entidad - TODO: definir arquitectura de auth)
- preferences, filters, search_criteria (no hay matching activo)

---

## 2. ConsentState

### Atributos conceptuales
- **user_id**: Referencia al usuario
- **pattern_detection_consent**: Boolean - consentimiento para detección de patrones
- **location_abstraction_acknowledgment**: Boolean - reconocimiento de que NO se guarda ubicación exacta
- **sync_window_proposals_consent**: Boolean - consentimiento para recibir propuestas de ventanas
- **terms_accepted**: Boolean - aceptación de términos de servicio
- **privacy_policy_accepted**: Boolean - aceptación de política de privacidad
- **consent_timestamp**: Timestamp de cuándo se dieron los consentimientos

### Estados posibles
- **all_granted**: Todos los consentimientos obligatorios otorgados
- **partial**: Faltan consentimientos obligatorios (usuario no puede usar el sistema)
- **revoked**: Usuario ha revocado consentimientos (cuenta debe pausarse o eliminarse)

### Campos explícitamente prohibidos
- N/A (entidad específica de consentimientos)

---

## 3. AbstractEvent

### Atributos conceptuales
Según [01_ABSTRACCION_DATOS.md](01_ABSTRACCION_DATOS.md):
- **user_id**: Referencia al usuario
- **time_bucket**: Enum (morning, midday, afternoon, evening, night)
- **place_category**: Enum (cafe, library, park, gym, coworking, cultural, transport, education, other)
- **day_type**: Enum (weekday, weekend, holiday)
- **duration_bucket**: Enum (short, medium, long)
- **week_id**: String formato YYYY-WW
- **created_at**: Timestamp de cuándo se registró el evento (con precisión reducida después del procesamiento - TODO: definir)

### Estados posibles
- **pending**: Evento registrado, pendiente de procesamiento para detección de patrones
- **processed**: Evento ya procesado en ciclo de detección de patrones
- **expired**: Evento fuera de ventana temporal relevante (> 4 semanas)

### Campos explícitamente prohibidos
Según [01_ABSTRACCION_DATOS.md](01_ABSTRACCION_DATOS.md):
- latitude, longitude, geohash
- place_name, place_id, venue_id, address
- bluetooth_id, wifi_ssid, wifi_bssid, cell_tower_id
- device_id, exact_timestamp (con precisión de segundos)
- altitude, floor_level, motion_vector, heading, speed

---

## 4. Pattern

### Atributos conceptuales
- **pattern_id**: Identificador único interno
- **user_id**: Referencia al usuario
- **place_category**: Categoría del patrón (desde AbstractEvent)
- **time_bucket**: Franja temporal del patrón (desde AbstractEvent)
- **event_count**: Número de eventos que conforman el patrón (≥ 3)
- **first_week_id**: Primera semana del patrón
- **last_week_id**: Última semana del patrón
- **pattern_status**: Estado del patrón (active, expired, matched)
- **detected_at**: Timestamp de cuándo se detectó el patrón

### Estados posibles
- **active**: Patrón válido, dentro de ventana temporal (< 4 semanas span)
- **expired**: Patrón fuera de ventana temporal (> 4 semanas span)
- **matched**: Patrón ya usado para generar una co-presencia latente (TODO: definir si se reutiliza o se marca como usado)

### Campos explícitamente prohibidos
- location_data (cualquier forma de ubicación)
- user_similarity_score, affinity_score
- frequency_score, priority_ranking

---

## 5. LatentCoPresence

### Atributos conceptuales
- **copresence_id**: Identificador único interno
- **user_a_id**: Referencia al primer usuario
- **user_b_id**: Referencia al segundo usuario
- **pattern_id_a**: Patrón del usuario A que generó la co-presencia
- **pattern_id_b**: Patrón del usuario B que generó la co-presencia
- **shared_place_category**: Categoría compartida
- **shared_time_bucket**: Franja temporal compartida
- **detected_at**: Timestamp de detección de la co-presencia
- **status**: Estado de la co-presencia (detected, proposed, accepted, expired, declined)

### Estados posibles
- **detected**: Co-presencia detectada, pendiente de generar propuesta
- **proposed**: Propuesta de ventana enviada a ambos usuarios
- **accepted**: Ambos usuarios aceptaron, ventana activa futura generada
- **expired**: Propuesta no aceptada por ambos (timeout)
- **declined**: Al menos uno declinó explícitamente
- **recognized_mutual**: Ambos confirmaron durante ventana activa (revelación generada)
- **recognized_partial**: Solo uno confirmó (purga después de 24h)
- **no_recognition**: Ninguno confirmó durante ventana activa

### Campos explícitamente prohibidos
- score, affinity, compatibility_percentage
- location_overlap, proximity_estimate
- number_of_shared_patterns (solo se usa el patrón que generó la co-presencia)

---

## 6. SyncWindow

### Atributos conceptuales
- **window_id**: Identificador único interno
- **copresence_id**: Referencia a la co-presencia latente que generó esta ventana
- **user_a_id**: Referencia al primer usuario
- **user_b_id**: Referencia al segundo usuario
- **proposed_date**: Fecha de la ventana (día específico)
- **start_time**: Hora de inicio (HH:MM)
- **end_time**: Hora de fin (HH:MM)
- **duration_minutes**: Duración en minutos (30-45 según [00_DECISIONES_V1.md](../00_DECISIONES_V1.md))
- **window_status**: Estado de la ventana (proposed, accepted_by_both, active, expired, completed)
- **user_a_accepted**: Boolean - usuario A aceptó la propuesta
- **user_b_accepted**: Boolean - usuario B aceptó la propuesta
- **user_a_accepted_at**: Timestamp de aceptación de usuario A (si aceptó)
- **user_b_accepted_at**: Timestamp de aceptación de usuario B (si aceptó)

### Estados posibles
- **proposed**: Ventana propuesta, esperando respuesta de ambos usuarios
- **accepted_by_both**: Ambos aceptaron, ventana futura activa (esperando a que llegue el horario)
- **active**: Ventana activa ahora (dentro del rango start_time - end_time)
- **expired_no_acceptance**: Propuesta expiró sin aceptación de ambos
- **expired_no_confirmation**: Ventana activa terminó sin confirmación mutua
- **completed_mutual**: Ventana terminó con confirmación mutua (revelación generada)
- **declined**: Al menos uno declinó la propuesta

### Campos explícitamente prohibidos
- location, venue_suggestion, map_coordinates
- other_users_in_window (no hay información de cuántas personas más están en la ventana)

---

## 7. Recognition

### Atributos conceptuales
- **recognition_id**: Identificador único interno
- **window_id**: Referencia a la ventana activa
- **user_id**: Usuario que hizo la confirmación
- **confirmed_at**: Timestamp exacto de la confirmación
- **is_mutual**: Boolean - indica si la otra persona también confirmó (se actualiza cuando se evalúa mutualidad)

### Estados posibles
- **pending**: Confirmación registrada, esperando confirmación del otro usuario
- **mutual**: Ambos usuarios confirmaron (revelación generada)
- **unilateral**: Solo este usuario confirmó, la ventana terminó (purga después de 24h según [00_DECISIONES_V1.md](../00_DECISIONES_V1.md))

### Campos explícitamente prohibidos
- location_at_confirmation, precise_timestamp_shared_with_other_user

---

## 8. Revelation

### Atributos conceptuales
- **revelation_id**: Identificador único interno
- **window_id**: Referencia a la ventana que generó la revelación
- **user_a_id**: Referencia al primer usuario
- **user_b_id**: Referencia al segundo usuario
- **revealed_at**: Timestamp de cuándo se produjo la revelación mutua
- **expires_at**: Timestamp de cuándo expira la conversación (revealed_at + 7 días según [00_DECISIONES_V1.md](../00_DECISIONES_V1.md))
- **conversation_status**: Estado de la conversación (active, expired, blocked_by_a, blocked_by_b)
- **shared_pattern**: Patrón compartido (place_category + time_bucket, para mostrar en UI)
- **messages**: Referencia a entidad Message (TODO: definir si Message es una entidad separada o se almacena aquí)

### Estados posibles
- **active**: Conversación activa, dentro de ventana de 7 días
- **expired**: Conversación expirada (> 7 días desde revealed_at)
- **blocked_by_a**: Usuario A bloqueó a usuario B
- **blocked_by_b**: Usuario B bloqueó a usuario A
- **mutually_blocked**: Ambos se bloquearon mutuamente (caso raro)

### Campos explícitamente prohibidos
- location_data, meeting_place_suggestion
- other_shared_patterns (solo se muestra el patrón que generó la revelación)
- compatibility_score, affinity_metrics

---

## 9. Block

### Atributos conceptuales
- **block_id**: Identificador único interno
- **blocker_user_id**: Usuario que bloquea
- **blocked_user_id**: Usuario bloqueado
- **blocked_at**: Timestamp del bloqueo
- **reason**: Razón del bloqueo (opcional, no mostrada al bloqueado - TODO: definir categorías)
- **revelation_id**: Referencia a la revelación donde ocurrió el bloqueo (si aplica)

### Estados posibles
- **active**: Bloqueo activo
- **permanent**: Bloqueo es permanente (no reversible en v1)

### Campos explícitamente prohibidos
- N/A (entidad específica de bloqueo)

---

## 10. Report

### Atributos conceptuales
- **report_id**: Identificador único interno
- **reporter_user_id**: Usuario que reporta
- **reported_user_id**: Usuario reportado
- **reported_at**: Timestamp del reporte
- **category**: Categoría del reporte (TODO: definir categorías exactas - acoso, spam, contenido inapropiado, etc.)
- **details**: Texto libre opcional con detalles adicionales
- **revelation_id**: Referencia a la revelación donde ocurrió el comportamiento reportado (si aplica)
- **moderation_status**: Estado de moderación (pending, reviewed, action_taken, dismissed)
- **auto_blocked**: Boolean - indica si se bloqueó automáticamente al reportar

### Estados posibles
- **pending**: Reporte pendiente de revisión
- **under_review**: Reporte siendo revisado por moderación
- **action_taken**: Se tomó acción (advertencia, suspensión, baneado)
- **dismissed**: Reporte descartado (no requiere acción)

### Campos explícitamente prohibidos
- N/A (entidad específica de reportes)

---

**Notas adicionales:**
- Este modelo NO define implementación técnica (SQL, NoSQL, graph DB, etc.)
- Cada entidad puede tener campos adicionales de auditoría (updated_at, deleted_at para soft deletes)
- Las relaciones entre entidades se infieren de los campos de referencia (user_id, pattern_id, etc.)
- TODO: Definir estrategia de purga y retención para cada entidad (ver [11_RETENCION_PURGA.md](11_RETENCION_PURGA.md))

---

**Estado: CERRADO (v1)**
