# FASE 1 — Simulación y validación funcional

**Fecha**: 2026-01-10
**Objetivo**: Validar las reglas de Fase 0 mediante simulación, sin código ni arquitectura técnica.

---

## 1. SIMULACIÓN DE DATOS SINTÉTICOS

### 1.1 Dataset de usuarios

| user_id | name | age | observation_active |
|---------|------|-----|-------------------|
| U1 | Ana | 28 | true |
| U2 | Bruno | 32 | true |
| U3 | Clara | 26 | true |
| U4 | David | 30 | true |
| U5 | Elena | 29 | true |
| U6 | Franco | 31 | true |
| U7 | Greta | 27 | true |
| U8 | Hugo | 33 | true |
| U9 | Irene | 25 | true |
| U10 | Javier | 34 | true |

### 1.2 Dataset de eventos abstractos (6 semanas: 2026-01 a 2026-06)

**Usuario U1 (Ana):**

| user_id | time_bucket | place_category | day_type | duration_bucket | week_id |
|---------|-------------|----------------|----------|-----------------|---------|
| U1 | morning | cafe | weekday | medium | 2026-02 |
| U1 | morning | cafe | weekday | medium | 2026-03 |
| U1 | morning | cafe | weekday | medium | 2026-04 |
| U1 | afternoon | library | weekend | long | 2026-02 |

**Usuario U2 (Bruno):**

| user_id | time_bucket | place_category | day_type | duration_bucket | week_id |
|---------|-------------|----------------|----------|-----------------|---------|
| U2 | morning | cafe | weekday | medium | 2026-02 |
| U2 | morning | cafe | weekday | short | 2026-03 |
| U2 | morning | cafe | weekday | medium | 2026-04 |
| U2 | evening | gym | weekday | short | 2026-02 |
| U2 | evening | gym | weekday | short | 2026-03 |

**Usuario U3 (Clara):**

| user_id | time_bucket | place_category | day_type | duration_bucket | week_id |
|---------|-------------|----------------|----------|-----------------|---------|
| U3 | afternoon | library | weekend | long | 2026-02 |
| U3 | afternoon | library | weekend | long | 2026-03 |
| U3 | afternoon | library | weekend | long | 2026-04 |
| U3 | morning | park | weekend | medium | 2026-05 |

**Usuario U4 (David):**

| user_id | time_bucket | place_category | day_type | duration_bucket | week_id |
|---------|-------------|----------------|----------|-----------------|---------|
| U4 | afternoon | library | weekend | long | 2026-02 |
| U4 | afternoon | library | weekend | medium | 2026-03 |
| U4 | afternoon | library | weekend | long | 2026-04 |
| U4 | evening | gym | weekday | short | 2026-05 |

**Usuario U5 (Elena):**

| user_id | time_bucket | place_category | day_type | duration_bucket | week_id |
|---------|-------------|----------------|----------|-----------------|---------|
| U5 | morning | coworking | weekday | long | 2026-02 |
| U5 | morning | coworking | weekday | long | 2026-03 |
| U5 | afternoon | cafe | weekday | short | 2026-04 |

**Usuario U6 (Franco):**

| user_id | time_bucket | place_category | day_type | duration_bucket | week_id |
|---------|-------------|----------------|----------|-----------------|---------|
| U6 | morning | transport | weekday | short | 2026-01 |
| U6 | morning | transport | weekday | short | 2026-02 |
| U6 | morning | transport | weekday | short | 2026-03 |
| U6 | morning | transport | weekday | short | 2026-04 |

**Usuario U7 (Greta):**

| user_id | time_bucket | place_category | day_type | duration_bucket | week_id |
|---------|-------------|----------------|----------|-----------------|---------|
| U7 | evening | gym | weekday | short | 2026-02 |
| U7 | evening | gym | weekday | short | 2026-03 |
| U7 | evening | gym | weekday | short | 2026-04 |
| U7 | evening | gym | weekday | short | 2026-05 |

**Usuario U8 (Hugo):**

| user_id | time_bucket | place_category | day_type | duration_bucket | week_id |
|---------|-------------|----------------|----------|-----------------|---------|
| U8 | morning | cafe | weekday | long | 2026-02 |
| U8 | morning | cafe | weekday | short | 2026-02 |
| U8 | morning | cafe | weekday | medium | 2026-02 |

**Usuario U9 (Irene):**

| user_id | time_bucket | place_category | day_type | duration_bucket | week_id |
|---------|-------------|----------------|----------|-----------------|---------|
| U9 | afternoon | park | weekend | medium | 2026-03 |
| U9 | afternoon | park | weekend | medium | 2026-05 |

**Usuario U10 (Javier):**

| user_id | time_bucket | place_category | day_type | duration_bucket | week_id |
|---------|-------------|----------------|----------|-----------------|---------|
| U10 | evening | gym | weekday | short | 2026-02 |
| U10 | evening | gym | weekday | short | 2026-03 |
| U10 | evening | gym | weekday | short | 2026-04 |

### 1.3 Detección de patrones (aplicando reglas de 02_DEFINICION_PATRONES.md)

**Regla**: Mínimo 3 coincidencias en `place_category` + `time_bucket`, dentro de 4 semanas consecutivas.

**Patrones DETECTADOS:**

| user_id | place_category | time_bucket | event_count | week_span | pattern_id | Estado |
|---------|----------------|-------------|-------------|-----------|------------|--------|
| U1 | cafe | morning | 3 | 2026-02 a 2026-04 | P1 | VÁLIDO |
| U2 | cafe | morning | 3 | 2026-02 a 2026-04 | P2 | VÁLIDO |
| U3 | library | afternoon | 3 | 2026-02 a 2026-04 | P3 | VÁLIDO |
| U4 | library | afternoon | 3 | 2026-02 a 2026-04 | P4 | VÁLIDO |
| U7 | gym | evening | 4 | 2026-02 a 2026-05 | P5 | VÁLIDO |
| U10 | gym | evening | 3 | 2026-02 a 2026-04 | P6 | VÁLIDO |

**Patrones DESCARTADOS:**

| user_id | place_category | time_bucket | Motivo de descarte |
|---------|----------------|-------------|--------------------|
| U1 | library | afternoon | Solo 1 evento (no hay recurrencia) |
| U2 | gym | evening | Solo 2 eventos (mínimo: 3) |
| U5 | coworking | morning | Solo 2 eventos (mínimo: 3) |
| U5 | cafe | afternoon | Solo 1 evento |
| U6 | transport | morning | Categoría "transport" excluida (alta variabilidad) |
| U8 | cafe | morning | 3 eventos en misma semana (2026-02) = 1 sola coincidencia (acumulación en un día) |
| U9 | park | afternoon | Solo 2 eventos |

**Resumen**: 6 patrones válidos detectados, 7 casos descartados.

---

## 2. SIMULACIÓN DE CO-PRESENCIAS Y VENTANAS

### 2.1 Detección de co-presencias (aplicando reglas de 03_COPRESENCIA_REGLAS.md)

**Condiciones**: Ambos usuarios tienen patrones válidos con mismo `place_category` + `time_bucket`, con solapamiento en `week_id`.

**Co-presencias DETECTADAS:**

| copresence_id | user_a | user_b | shared_pattern | week_overlap | Estado |
|---------------|--------|--------|----------------|--------------|--------|
| CP1 | U1 (Ana) | U2 (Bruno) | cafe + morning | 2026-02, 03, 04 | VÁLIDA |
| CP2 | U3 (Clara) | U4 (David) | library + afternoon | 2026-02, 03, 04 | VÁLIDA |
| CP3 | U7 (Greta) | U10 (Javier) | gym + evening | 2026-02, 03, 04 | VÁLIDA |

**Verificación de límites:**
- Cada usuario tiene máximo 1 co-presencia (límite: 2) ✓
- No hay co-presencias adicionales porque no hay más patrones compartidos

**Co-presencias DESCARTADAS:**
- Ninguna descartada por límites o bloqueos (dataset limpio)

### 2.2 Generación de propuestas de ventana (aplicando reglas de 04_PROPUESTAS_VENTANA.md)

Asumimos fecha de detección: 2026-01-10 (viernes)

**Propuesta 1 (CP1: U1 + U2)**
- Patrón compartido: "cafés por la mañana"
- Fecha propuesta: Lunes 13 de enero, 2026 (weekday, próximo día dentro de 7 días)
- Hora: 09:00 - 09:45 (punto medio de "morning" = 09:00, duración 45 min)
- Estado: proposed

**Propuesta 2 (CP2: U3 + U4)**
- Patrón compartido: "bibliotecas por la tarde"
- Fecha propuesta: Sábado 11 de enero, 2026 (weekend, próximo día dentro de 7 días)
- Hora: 15:00 - 15:30 (punto medio de "afternoon" = 15:00, duración 30 min)
- Estado: proposed

**Propuesta 3 (CP3: U7 + U10)**
- Patrón compartido: "gimnasios por la tarde-noche"
- Fecha propuesta: Lunes 13 de enero, 2026 (weekday)
- Hora: 20:00 - 20:45 (punto medio de "evening" = 20:00, duración 45 min)
- Estado: proposed

**Verificación anti-spam:**
- Total propuestas: 3
- Propuestas por usuario: 1 cada uno (U1, U2, U3, U4, U7, U10) ✓
- Ningún usuario tiene > 1 propuesta activa simultánea ✓
- NO hay generación masiva de propuestas ✓

---

## 3. SIMULACIÓN DE FLUJO COMPLETO (3 ESCENARIOS)

### ESCENARIO A: Ambos aceptan → ventana activa → ambos confirman → revelación

**Protagonistas**: U1 (Ana) y U2 (Bruno)
**Propuesta**: Lunes 13 de enero, 09:00 - 09:45, "cafés por la mañana"

#### Paso 1: Propuesta enviada
- **Estado del sistema**:
  - CP1.status = "proposed"
  - SyncWindow creada (window_id: W1, status: "proposed")
- **Qué ve U1**:
  - Pantalla Home: "Nueva propuesta de ventana"
  - "Coincidencia en: cafés por la mañana"
  - "Lunes 13 de enero, 09:00 - 09:45"
  - Botones: "Aceptar" / "Declinar"
- **Qué ve U2**: Mismo mensaje

#### Paso 2: Ambos aceptan
- **Acción**: U1 toca "Aceptar" (11/01 10:00), U2 toca "Aceptar" (11/01 14:30)
- **Estado del sistema**:
  - W1.user_a_accepted = true, W1.user_b_accepted = true
  - W1.status = "accepted_by_both"
- **Qué ve U1**: "La ventana ha sido activada. Te notificaremos cuando comience."
- **Qué ve U2**: "La ventana ha sido activada. Te notificaremos cuando comience."
- **Qué NO ven**: Identidad del otro, cuándo aceptó el otro, si el otro ya aceptó

#### Paso 3: Ventana activa (lunes 13/01, 09:00)
- **Estado del sistema**:
  - W1.status = "active"
- **Qué ve U1**:
  - Pantalla "Ventana activa ahora"
  - "Patrón: cafés por la mañana"
  - "Tiempo restante: 45 minutos"
  - Botón grande: "Creo que te he visto"
- **Qué ve U2**: Mismo

#### Paso 4: Ambos confirman
- **Acción**: U1 toca "Creo que te he visto" (09:15), U2 toca "Creo que te he visto" (09:18)
- **Estado del sistema**:
  - Recognition creado para U1 (09:15)
  - Recognition creado para U2 (09:18)
  - is_mutual = true para ambos
  - Revelation creada (revelation_id: R1, revealed_at: 09:18, expires_at: 20/01 09:18)
- **Qué ve U1 (a las 09:18, inmediato)**:
  - Transición automática a pantalla "¡Confirmación mutua!"
  - Perfil de Bruno: foto, nombre "Bruno", edad "32"
  - "Coincidís en: cafés por la mañana"
  - "Conversación disponible durante 7 días"
  - Chat vacío con mensaje: "¡Os habéis encontrado! Podéis conversar durante 7 días."
- **Qué ve U2**: Mismo, con perfil de Ana
- **Qué NO ven**: Ubicación exacta, otros patrones compartidos, timestamp exacto de confirmación

#### Paso 5: Conversación activa
- **Acciones**: U1 y U2 intercambian mensajes durante los próximos días
- **Estado del sistema**: R1.conversation_status = "active"
- **Qué ven**: Chat de texto, tiempo restante ("Expira en 5 días", "Expira en 2 días", etc.)
- **Qué NO ven**: "escribiendo...", "visto", "última conexión"

#### Paso 6: Expiración (7 días después, 20/01 09:18)
- **Estado del sistema**:
  - R1.conversation_status = "expired"
  - Mensajes purgados (según 11_RETENCION_PURGA.md)
- **Qué ven**: "Esta conversación ha expirado"
- **Consecuencias**: Ana y Bruno pueden volver a generar co-presencias futuras si desarrollan nuevos patrones

---

### ESCENARIO B: Ambos aceptan → ventana activa → solo uno confirma → purga silenciosa

**Protagonistas**: U3 (Clara) y U4 (David)
**Propuesta**: Sábado 11 de enero, 15:00 - 15:30, "bibliotecas por la tarde"

#### Paso 1: Propuesta enviada
- **Estado del sistema**: CP2.status = "proposed", W2.status = "proposed"
- **Qué ven**: Mismo que Escenario A, con su patrón específico

#### Paso 2: Ambos aceptan
- **Acción**: U3 acepta (10/01 11:00), U4 acepta (10/01 18:00)
- **Estado del sistema**: W2.status = "accepted_by_both"
- **Qué ven**: "La ventana ha sido activada. Te notificaremos cuando comience."

#### Paso 3: Ventana activa (sábado 11/01, 15:00)
- **Estado del sistema**: W2.status = "active"
- **Qué ven**: Pantalla "Ventana activa ahora", botón "Creo que te he visto"

#### Paso 4: Solo Clara confirma
- **Acción**: U3 (Clara) toca "Creo que te he visto" (15:10), U4 (David) NO confirma
- **Estado del sistema**:
  - Recognition creado para U3 (15:10)
  - NO hay Recognition de U4
  - Ventana termina a las 15:30
  - W2.status = "expired_no_confirmation"
  - Recognition de U3 se marca como "unilateral"
- **Qué ve U3 (Clara) a las 15:30**:
  - "La ventana ha terminado."
  - Botón: "Volver a Home"
  - **NO hay mensaje explícito de rechazo**
  - **NO se le dice que David no confirmó**
- **Qué ve U4 (David) a las 15:30**:
  - "La ventana ha terminado."
  - Botón: "Volver a Home"
  - **NO sabe que Clara confirmó**

#### Paso 5: Purga silenciosa (24 horas después, 12/01 15:30)
- **Estado del sistema**:
  - Recognition de U3 purgado (TTL 24h según 00_DECISIONES_V1.md)
  - CP2 purgado
  - W2 purgado
- **Qué ven**: Nada (purga automática, sin notificación)
- **Consecuencias**: Clara y David vuelven a estar disponibles para nuevas co-presencias

**Observación crítica**: El no-mutuo es verdaderamente silencioso. Clara NO sabe que David no confirmó. David NO sabe que Clara confirmó. No hay rechazo explícito visible.

---

### ESCENARIO C: Uno declina → no activación → mensaje neutral

**Protagonistas**: U7 (Greta) y U10 (Javier)
**Propuesta**: Lunes 13 de enero, 20:00 - 20:45, "gimnasios por la tarde-noche"

#### Paso 1: Propuesta enviada
- **Estado del sistema**: CP3.status = "proposed", W3.status = "proposed"
- **Qué ven**: Propuesta con su patrón específico, botones "Aceptar" / "Declinar"

#### Paso 2: Greta declina
- **Acción**: U7 (Greta) toca "Declinar" (11/01 09:00)
- **Estado del sistema**:
  - W3.status = "declined"
  - CP3.status = "declined"
  - U7 entra en cooldown de 7 días (hasta 18/01)
- **Qué ve U7 (Greta)**:
  - "Has declinado la propuesta."
  - Vuelve a Home
- **Qué ve U10 (Javier) mientras U7 declina**:
  - La propuesta sigue visible en Home
  - **NO se le notifica inmediatamente que Greta declinó**

#### Paso 3: Propuesta expira para Javier (timeout asumido: 24 horas)
- **Acción**: U10 no responde durante 24 horas
- **Estado del sistema** (12/01 09:00):
  - W3.status = "expired_no_acceptance" (ya estaba declined, se confirma expiración)
- **Qué ve U10 (Javier)**:
  - "La propuesta ha expirado."
  - **NO se le dice explícitamente que Greta declinó**
  - Mensaje neutral: simplemente expiró
- **Qué NO ve**: "Tu propuesta fue rechazada", "La otra persona declinó"

#### Paso 4: Purga (24 horas desde declinar, 12/01 09:00)
- **Estado del sistema**:
  - CP3 purgado
  - W3 purgado
- **Qué ven**: Nada (purga automática)

#### Paso 5: Cooldown de Greta
- **Estado**: U7 en cooldown hasta 18/01
- **Efecto**: Greta NO puede recibir nuevas propuestas durante 7 días
- **Qué ve Greta**: Home normal, pero no recibe propuestas (internamente bloqueada)
- **Javier**: NO tiene cooldown (no declinó), puede recibir nuevas propuestas inmediatamente

**Observación crítica**: El rechazo NO es visible para Javier. Solo ve que la propuesta expiró. Mensaje neutral, sin sensación de rechazo explícito.

---

## 4. VALIDACIÓN CUALITATIVA

### 4.1 ¿Se entiende el flujo sin explicaciones?

**Análisis**:
- **Propuesta de ventana**: Clara. "Coincidencia en: cafés por la mañana" + fecha/hora es comprensible.
- **Ventana activa**: El botón "Creo que te he visto" es directo, pero podría generar duda inicial: "¿Qué pasa si me equivoco?"
- **Confirmación mutua**: Inmediata y obvia ("¡Confirmación mutua!").
- **No-mutuo silencioso**: Potencialmente confuso. El usuario que confirmó podría preguntarse "¿Por qué no pasó nada?" (aunque es intencional para evitar rechazo explícito).
- **Declinar**: Mensaje neutro ("propuesta expirada") funciona bien para evitar rechazo visible, pero podría parecer un fallo técnico si el usuario no entiende que la otra persona declinó.

**Conclusión**: Flujo mayormente claro, con pequeña área gris en no-mutuo (necesita educación en onboarding o primera experiencia).

### 4.2 ¿Hay momentos de ansiedad o presión?

**Análisis de puntos potenciales de ansiedad**:

1. **Ventana activa (45 minutos)**:
   - Presión temporal: "Tiempo restante: 45 minutos" podría generar urgencia.
   - Mitigación: La duración es razonable (no excesivamente corta), y el usuario sabe de antemano la hora exacta.
   - **Veredicto**: Presión temporal moderada (aceptable, es intrínseco al concepto).

2. **Después de confirmar unilateral**:
   - Si confirmo y espero durante 30 minutos sin respuesta, ¿siento rechazo?
   - Mitigación: El mensaje "Esperando respuesta..." es neutral, y al final no hay rechazo explícito.
   - **Veredicto**: Ansiedad baja durante la espera, bien mitigada al final.

3. **Cooldown de 7 días tras declinar**:
   - ¿El usuario siente que está "castigado" por declinar?
   - Mitigación: No hay notificación explícita del cooldown (invisible para el usuario).
   - **Veredicto**: Sin ansiedad (el usuario no sabe que está en cooldown).

4. **Conversación expira en 7 días**:
   - ¿Presión por "aprovechar" los 7 días?
   - Mitigación: El indicador "Expira en X días" podría generar presión leve, pero es razonable.
   - **Veredicto**: Presión temporal baja (aceptable).

**Conclusión**: El sistema minimiza ansiedad con éxito. Puntos de presión temporal son razonables y coherentes con el concepto.

### 4.3 ¿El no-mutuo es verdaderamente silencioso?

**Análisis**:
- **Usuario que confirmó**: Ve "La ventana ha terminado", NO ve rechazo explícito. ✓
- **Usuario que NO confirmó**: Ve "La ventana ha terminado", NO sabe que el otro confirmó. ✓
- **Sin notificaciones de rechazo**: Correcto. ✓
- **Purga en 24 horas**: Datos eliminados, sin rastro. ✓

**Potencial problema**:
- Si Clara confirma y luego no pasa nada, podría sentirse mal o confundida ("¿Hice algo mal?").
- **Solución posible** (sin modificar reglas): Mensaje educativo en onboarding: "Si confirmas pero el otro no lo hace, simplemente no habrá revelación. Esto es normal y no significa rechazo explícito."

**Conclusión**: El no-mutuo ES silencioso desde la perspectiva del sistema, pero requiere educación del usuario para evitar auto-culpa o confusión.

### 4.4 ¿Aparece impulso de "buscar" o "optimizar"?

**Análisis de vectores de engagement**:

1. **¿El usuario intenta "aumentar sus posibilidades"?**
   - ¿Podría el usuario crear eventos falsos para generar más patrones?
   - Mitigación: Requiere esfuerzo manual (no hay gamificación), y las ventanas son futuras (no inmediatas).
   - **Veredicto**: Impulso bajo.

2. **¿El usuario intenta "ir a más cafés" para encontrar gente?**
   - Riesgo: Si el usuario entiende que "ir a cafés por la mañana" genera matches, podría cambiar su comportamiento.
   - Mitigación: Los patrones requieren 3+ semanas de recurrencia (no se genera match con 1 visita), y las ventanas son futuras (no "ahora mismo").
   - **Veredicto**: Impulso moderado (posible, pero no incentivado explícitamente).

3. **¿Hay "feed" o "explorar" para ver más opciones?**
   - NO. Solo 1 propuesta activa máximo. ✓
   - **Veredicto**: Sin impulso de browsing.

4. **¿Hay ranking, popularidad o "mejores matches"?**
   - NO. ✓
   - **Veredicto**: Sin impulso de optimización.

**Conclusión**: El sistema evita con éxito la mayoría de vectores de engagement. Riesgo residual: usuario podría intentar "optimizar" su comportamiento físico (ir a más cafés), pero esto requiere esfuerzo sostenido y no es incentivado por la UI.

---

## 5. AJUSTES PROPUESTOS

Después de la simulación y validación, identifico los siguientes ajustes:

### 5.1 AJUSTES NECESARIOS

#### Ajuste 1: Timeout de respuesta a propuestas (CRÍTICO)
- **Documento afectado**: [04_PROPUESTAS_VENTANA.md](../fase0/04_PROPUESTAS_VENTANA.md), [05_DECISIONES_VENTADA.md](../fase0/05_DECISIONES_VENTADA.md)
- **Problema**: El timeout de respuesta a propuestas está marcado como TODO. Sin este valor, no se puede purgar propuestas expiradas.
- **Propuesta**: Definir timeout de 48 horas para aceptar/declinar propuesta.
- **Justificación**: 48 horas da margen razonable sin alargar demasiado la vida de la propuesta. Coherente con purga de 24h post-expiración (total: 72h máximo).

#### Ajuste 2: Duración exacta de ventana (CRÍTICO)
- **Documento afectado**: [04_PROPUESTAS_VENTANA.md](../fase0/04_PROPUESTAS_VENTANA.md), [06_VENTANA_ACTIVA.md](../fase0/06_VENTANA_ACTIVA.md)
- **Problema**: Duración de ventana definida como rango "30-45 minutos", pero no se especifica si es fijo o aleatorio.
- **Propuesta**: Duración fija de 40 minutos (punto medio del rango).
- **Justificación**: Predecibilidad para el usuario, evita decisiones técnicas innecesarias (aleatorio añade complejidad sin beneficio funcional).

#### Ajuste 3: Educación en onboarding sobre no-mutuo (RECOMENDADO)
- **Documento afectado**: [09_UI_SPEC.md](../fase0/09_UI_SPEC.md), pantalla 1 (Onboarding)
- **Problema**: Usuario podría confundirse o sentirse mal si confirma y no hay revelación.
- **Propuesta**: Añadir frase en onboarding: "Si confirmas pero la otra persona no lo hace, no habrá revelación. Esto es completamente normal y no significa un rechazo explícito."
- **Justificación**: Reduce ansiedad y confusión en caso de no-mutuo, sin modificar reglas de flujo.

#### Ajuste 4: Frecuencia de detección de co-presencias (CRÍTICO)
- **Documento afectado**: [03_COPRESENCIA_REGLAS.md](../fase0/03_COPRESENCIA_REGLAS.md)
- **Problema**: No se define cada cuánto tiempo se ejecuta el proceso de detección de co-presencias.
- **Propuesta**: Ejecutar detección 1 vez por día (ej: 03:00 AM hora local).
- **Justificación**: Evita tiempo real continuo (anti-engagement), reduce carga del sistema, mantiene baja frecuencia coherente con el concepto.

### 5.2 AJUSTES NO NECESARIOS (descartados tras simulación)

- **Límite de 2 co-presencias por usuario**: Funciona correctamente en la simulación. No requiere ajuste.
- **Purga de 24 horas para confirmaciones no mutuas**: Coherente y suficiente. No requiere ajuste.
- **Cooldown de 7 días tras declinar**: Bien calibrado, invisible para el usuario. No requiere ajuste.

### 5.3 CONCLUSIÓN GENERAL

**Fase 0 es CASI suficiente para pasar a implementación**, con 2 ajustes críticos obligatorios (timeout de propuestas, duración de ventana) y 2 ajustes recomendados (educación en onboarding, frecuencia de detección).

**Veredicto final**:
Las reglas de Fase 0 son funcionales y coherentes. Los TODOs identificados durante la simulación deben resolverse antes de implementación, pero NO requieren cambios estructurales en las reglas.

---

**Estado: FASE 1 COMPLETADA**
**Fecha de cierre**: 2026-01-10
