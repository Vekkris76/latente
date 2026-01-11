# 03 — Reglas de co-presencia latente

## Condiciones mínimas
Existe una **co-presencia latente** entre dos usuarios cuando se cumplen **TODAS** las siguientes condiciones:

1. **Ambos usuarios tienen patrones válidos detectados** (según reglas de [02_DEFINICION_PATRONES.md](02_DEFINICION_PATRONES.md)):
   - Cada usuario tiene al menos 1 patrón con 3+ coincidencias en ventana de 4 semanas.

2. **Coincidencia exacta en `place_category` y `time_bucket`**:
   - Los patrones de ambos usuarios comparten los mismos valores de `place_category` y `time_bucket`.

3. **Solapamiento temporal en `week_id`**:
   - Al menos 1 semana (`week_id`) en común donde ambos usuarios han registrado eventos del patrón coincidente.

4. **No existe bloqueo mutuo**:
   - Ninguno de los dos usuarios ha bloqueado o reportado al otro.

5. **Límites no excedidos**:
   - Ninguno de los dos usuarios ha alcanzado su máximo de co-presencias latentes internas (2).
   - Ninguno de los dos usuarios tiene una propuesta activa pendiente.

## Límites
- **Máximo de co-presencias latentes internas por usuario**: 2
  - Si un usuario ya tiene 2 co-presencias latentes activas, no puede detectar nuevas hasta que alguna se resuelva (propuesta, rechazo o purga).

- **Máximo de propuestas activas simultáneas por usuario**: 1
  - Solo puede existir 1 propuesta de ventana activa a la vez por usuario.
  - Mientras haya una propuesta activa, no se generan nuevas co-presencias latentes.

- **Cooldown tras declinar propuesta**: 7 días
  - Si un usuario declina una propuesta, no puede recibir nuevas propuestas durante 7 días.

- **Exclusiones categóricas**:
  - Patrones basados en `place_category: "transport"` NO generan co-presencias (categoría excluida por alta variabilidad).

- **Frecuencia de detección**: TODO
  - (Definir cada cuánto tiempo se ejecuta el proceso de detección de co-presencias. No es tiempo real continuo por principio anti-engagement).

## Motivos de descarte
Una co-presencia latente potencial es **descartada automáticamente** si se cumple cualquiera de las siguientes condiciones:

1. **Patrón inválido o inexistente**:
   - Al menos uno de los usuarios NO tiene un patrón válido (< 3 repeticiones o fuera de ventana de 4 semanas).

2. **Sin coincidencia exacta**:
   - Los patrones NO comparten exactamente el mismo `place_category` y `time_bucket`.
   - Ejemplo descartado: Usuario A tiene patrón `cafe + morning`, Usuario B tiene `cafe + afternoon` → NO hay co-presencia.

3. **Sin solapamiento temporal**:
   - No existe ninguna semana (`week_id`) en común donde ambos usuarios hayan registrado eventos del patrón.

4. **Bloqueo o reporte**:
   - Alguno de los usuarios ha bloqueado o reportado al otro previamente.

5. **Límite de co-presencias excedido**:
   - Alguno de los dos usuarios ya tiene 2 co-presencias latentes internas activas.

6. **Propuesta activa pendiente**:
   - Alguno de los dos usuarios tiene una propuesta de ventana activa pendiente (aceptar/declinar).

7. **Cooldown activo**:
   - Alguno de los dos usuarios está dentro del periodo de cooldown de 7 días tras haber declinado una propuesta.

8. **Categoría excluida**:
   - El patrón coincidente está basado en `place_category: "transport"`.

9. **Usuarios ya conectados**:
   - Los usuarios ya se han revelado mutuamente en el pasado (existe un reconocimiento mutuo previo).
   - Nota: TODO — Definir si usuarios con revelación expirada (>7 días) pueden volver a generar co-presencias.

10. **Mismo usuario**:
    - Trivial: un usuario NO puede tener co-presencia consigo mismo.