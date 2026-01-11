# 02 — Definición de patrón

## Regla base
Existe un **patrón** cuando se detectan al menos **3 coincidencias** de eventos abstractos con los mismos valores de `place_category` y `time_bucket` dentro de una ventana de **4 semanas consecutivas** (medido por `week_id`).

Un patrón representa recurrencia temporal-categórica, NO proximidad geográfica ni identificación de lugares específicos.

**Cuándo NO existe un patrón:**
- Eventos únicos (sin repetición)
- Repeticiones insuficientes (< 3 coincidencias)
- Coincidencias fuera de la ventana temporal (> 4 semanas)
- Eventos en categorías o franjas temporales diferentes

## Umbrales
- **Repeticiones mínimas**: 3 eventos con coincidencia exacta en `place_category` y `time_bucket`.
- **Ventana temporal**: 4 semanas consecutivas (máximo span entre el primer y último evento con `week_id`).
- **Exclusiones**:
  - Categorías no recurrentes: eventos con `place_category: "transport"` (tránsito) NO generan patrones (alta variabilidad implícita).
  - Eventos aislados: un solo evento, independientemente de su `duration_bucket`, NO constituye patrón.
  - Acumulación en un solo día: múltiples eventos en la misma fecha (inferido por `day_type` + `week_id`) cuentan como **1 sola coincidencia**.
  - Duración irrelevante: `duration_bucket` NO es criterio para definir patrón (solo sirve para enriquecer contexto).

## Casos válidos
1. **Usuario A**: 3 eventos con `place_category: "cafe"` y `time_bucket: "morning"` en `week_id: ["2026-02", "2026-03", "2026-04"]`.
   - **Resultado**: Patrón detectado ("cafés por la mañana durante 3 semanas consecutivas").
   - Justificación: Cumple umbral de 3 repeticiones en ventana de 4 semanas.

2. **Usuario B**: 4 eventos con `place_category: "gym"` y `time_bucket: "evening"` distribuidos en `week_id: ["2026-01", "2026-02", "2026-03", "2026-04"]`.
   - **Resultado**: Patrón detectado ("gimnasio por la tarde-noche durante 4 semanas").
   - Justificación: Supera umbral mínimo (3 repeticiones) y está dentro de ventana temporal (4 semanas).

## Casos descartados
1. **Evento único prolongado**: Usuario pasa 3 horas (`duration_bucket: "long"`) en `place_category: "library"` un solo día.
   - **Descartado**: No hay repetición temporal. Un patrón requiere recurrencia en múltiples semanas, NO duración extendida en un solo evento.

2. **Repeticiones insuficientes**: 2 eventos con `place_category: "coworking"` y `time_bucket: "afternoon"` en `week_id: ["2026-02", "2026-03"]`.
   - **Descartado**: Solo 2 coincidencias (mínimo requerido: 3). No alcanza umbral para constituir patrón.

3. **Acumulación en un solo día**: Usuario registra 5 eventos con `place_category: "cafe"` y `time_bucket: "morning"` todos en la misma semana (`week_id: "2026-02"`) y mismo `day_type: "weekday"`.
   - **Descartado**: Múltiples eventos en la misma fecha cuentan como 1 sola coincidencia. No hay recurrencia semanal.

4. **Ventana temporal excedida**: 3 eventos con `place_category: "park"` y `time_bucket: "afternoon"` en `week_id: ["2026-01", "2026-03", "2026-06"]`.
   - **Descartado**: El span temporal (semanas 1 a 6) excede la ventana de 4 semanas consecutivas. No constituye patrón estable.

5. **Categoría excluida (transporte)**: 4 eventos con `place_category: "transport"` y `time_bucket: "morning"` en `week_id: ["2026-02", "2026-03", "2026-04", "2026-05"]`.
   - **Descartado**: La categoría "transport" está excluida de generación de patrones por su naturaleza transitoria y alta variabilidad.