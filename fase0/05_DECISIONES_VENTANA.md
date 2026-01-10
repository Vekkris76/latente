# 05 — Decisiones sobre propuesta

## Estados posibles
Después de enviar una propuesta de ventana a dos usuarios, existen los siguientes estados posibles:

1. **Ambos aceptan**:
   - Ambos usuarios hacen clic en "Aceptar" antes del timeout.

2. **Solo uno acepta**:
   - Un usuario acepta, el otro declina explícitamente.
   - Un usuario acepta, el otro no responde (timeout).

3. **Uno o ambos declinan explícitamente**:
   - Un usuario declina, el otro acepta o no responde.
   - Ambos usuarios declinan.

4. **Timeout (ninguno responde)**:
   - Ninguno de los dos usuarios acepta ni declina antes del límite de tiempo.
   - TODO: Definir el tiempo límite para responder (ej: 24 horas, 48 horas).

## Resultado por estado

| Estado | Resultado | Notificación al usuario | Consecuencias |
|--------|-----------|-------------------------|---------------|
| **Ambos aceptan** | Se activa la ventana futura | "La ventana ha sido activada. Te notificaremos cuando comience." | Ambos usuarios entran en fase de ventana activa (ver [06_VENTANA_ACTIVA.md](06_VENTANA_ACTIVA.md)) |
| **Solo uno acepta** | La propuesta se cancela silenciosamente | Al que aceptó: Ninguna notificación explícita de rechazo. La propuesta simplemente no avanza. <br> Al que declinó: "Has declinado la propuesta." | - No hay rechazo explícito visible<br>- La co-presencia latente se purga<br>- Se aplica cooldown al usuario que declinó (7 días) |
| **Uno o ambos declinan** | La propuesta se cancela | "Has declinado la propuesta." (solo al que declinó) | - La co-presencia latente se purga<br>- Se aplica cooldown (7 días) al usuario que declinó |
| **Timeout (ninguno responde)** | La propuesta expira automáticamente | "La propuesta ha expirado." | - La co-presencia latente se purga<br>- NO se aplica cooldown (no hubo rechazo explícito)<br>- Ambos usuarios pueden recibir nuevas propuestas inmediatamente |

## Cooldowns

1. **Cooldown tras declinar explícitamente**:
   - Duración: **7 días**
   - Aplica a: El usuario que hizo clic en "Declinar"
   - Efecto: Durante 7 días, ese usuario NO puede recibir nuevas propuestas de ventana
   - Justificación: Reducir ansiedad y presión, respetar la decisión del usuario

2. **Sin cooldown tras timeout**:
   - Si un usuario no responde (timeout), NO se aplica cooldown
   - Justificación: No penalizar la inacción, solo las decisiones explícitas

3. **Sin cooldown tras aceptar**:
   - Si un usuario acepta pero el otro no, el que aceptó NO recibe cooldown
   - Justificación: No penalizar la disposición a participar

4. **Límite de propuestas activas**:
   - Recordatorio: Un usuario solo puede tener **1 propuesta activa** a la vez (según [00_DECISIONES_V1.md](00_DECISIONES_V1.md))
   - Mientras una propuesta esté pendiente, no se generan nuevas propuestas para ese usuario

---

**Estado: CERRADO (v1)**