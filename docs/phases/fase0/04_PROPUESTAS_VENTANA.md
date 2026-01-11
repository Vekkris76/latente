# 04 — Propuesta de ventana futura

## Información mostrada al usuario
Cuando se genera una propuesta de ventana, el usuario recibe la siguiente información (y **SOLO** esta):

1. **Patrón abstracto detectado**:
   - Categoría: traducción legible de `place_category` (ej: "cafés", "bibliotecas", "gimnasios")
   - Franja temporal: traducción legible de `time_bucket` (ej: "por la mañana", "por la tarde")
   - Ejemplo de mensaje: "Hemos detectado una coincidencia de patrones: cafés por la mañana"

2. **Ventana propuesta**:
   - Fecha: día específico (ej: "Martes 15 de enero")
   - Hora de inicio: hora exacta (ej: "09:00")
   - Hora de fin: hora exacta (ej: "09:45")
   - Duración implícita: 30-45 minutos (según decisión de [00_DECISIONES_V1.md](00_DECISIONES_V1.md))

3. **Acciones disponibles**:
   - "Aceptar" (activar la ventana)
   - "Declinar" (rechazar la propuesta)

4. **Contexto educativo** (solo primera vez):
   - Breve explicación de qué significa una ventana activa
   - Recordatorio: "Solo se revela identidad si ambos confirman haber coincidido"

## Información NO mostrada
La siguiente información **NUNCA** se muestra al usuario en esta fase:

- Identidad de la otra persona (nombre, foto, perfil)
- Número de co-presencias latentes detectadas
- Ubicación exacta, nombre del lugar, dirección o mapa
- Distancia, zona o región geográfica
- Probabilidad, score o ranking de compatibilidad
- Cuántas personas han aceptado/declinado
- Historial de patrones del otro usuario
- Información sobre cuántos usuarios más comparten el patrón
- Razón específica de por qué se generó la propuesta
- Datos del patrón subyacente (número de repeticiones, semanas específicas)

## Reglas de cálculo temporal
La ventana propuesta se calcula según las siguientes reglas:

1. **Día de la semana**:
   - Se propone un día dentro de los próximos 7 días naturales desde la detección de la co-presencia.
   - Se prioriza un día del mismo tipo (`day_type`) que el patrón detectado (weekday/weekend/holiday).

2. **Hora de inicio**:
   - Se calcula el punto medio del `time_bucket` del patrón detectado.
   - Ejemplos:
     - `morning` (06:00-12:00) → punto medio: 09:00
     - `afternoon` (12:00-18:00) → punto medio: 15:00
     - `evening` (18:00-22:00) → punto medio: 20:00
   - La hora propuesta debe estar dentro del rango permitido: 08:00 - 22:00 (hora local).

3. **Duración**:
   - Fija: entre 30 y 45 minutos (valor exacto: TODO — definir si es aleatorio en ese rango o fijo a 30 min).

4. **Restricciones**:
   - No se proponen ventanas en el mismo día de la generación de la propuesta (mínimo: día siguiente).
   - No se proponen ventanas fuera del horario permitido (08:00 - 22:00).
   - TODO: Definir si se respetan zonas horarias locales del usuario o se asume una única zona horaria.

5. **Timeout de respuesta**:
   - TODO: Definir cuánto tiempo tiene el usuario para aceptar/declinar antes de que la propuesta expire automáticamente.

## Ejemplos válidos
1. **Co-presencia detectada**: Patrón `cafe + morning` en común.
   - Mensaje mostrado: "Hemos detectado una coincidencia de patrones: cafés por la mañana"
   - Ventana propuesta: "Miércoles 15 de enero, 09:00 - 09:45"
   - Justificación: Día laborable (weekday), punto medio de `morning`, duración 45 min.

2. **Co-presencia detectada**: Patrón `gym + evening` en común.
   - Mensaje mostrado: "Hemos detectado una coincidencia de patrones: gimnasios por la tarde-noche"
   - Ventana propuesta: "Jueves 16 de enero, 20:00 - 20:30"
   - Justificación: Día laborable (weekday), punto medio de `evening`, duración 30 min.

## Ejemplo inválido
1. **Propuesta con ubicación explícita**:
   - Mensaje: "Hemos detectado que coincides con alguien en el Starbucks de Gran Vía, mañana a las 09:00"
   - **Inválido**: Revela ubicación exacta (nombre del lugar), viola principio anti-GPS y anonimato de la fase de propuesta.

---

**Estado: CERRADO (v1)**