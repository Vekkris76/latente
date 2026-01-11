# 06 — Ventana activa

## Duración
- **Duración de la ventana activa**: 30-45 minutos (según [00_DECISIONES_V1.md](00_DECISIONES_V1.md))
- **Momento de inicio**: Hora exacta definida en la propuesta aceptada
- **Momento de fin**: Hora de inicio + duración (30-45 min)

Durante este periodo, y **SOLO** durante este periodo, los usuarios tienen acceso a la acción de reconocimiento.

## Texto mostrado al usuario
Cuando la ventana activa comienza, el usuario ve lo siguiente en su pantalla:

**Línea 1 (título)**: "Ventana activa ahora"

**Línea 2 (contexto)**: "Patrón: [categoría] [franja temporal]"
- Ejemplo: "Patrón: cafés por la mañana"

**Línea 3 (tiempo restante)**: "Tiempo restante: XX minutos"
- Actualización en tiempo real (o cada minuto)

**Línea 4 (instrucción)**: "Si crees que estás viendo a la persona con la que compartes este patrón, toca el botón."

**Recordatorio visual** (opcional, primera vez): "Solo se revelará la identidad si ambos lo confirman."

## Acciones disponibles
Durante la ventana activa, existe **UNA SOLA ACCIÓN** disponible:

**Botón único**: "Creo que te he visto"

- **Comportamiento al tocar**:
  - Se registra la confirmación del usuario
  - El botón cambia a estado "Confirmado" (deshabilitado, no se puede volver atrás)
  - Mensaje de feedback: "Confirmación enviada. Esperando respuesta..."

- **NO existe botón de "No lo he visto"**:
  - La ausencia de confirmación es implícita (no hay acción negativa)
  - Justificación: Evitar rechazo explícito y ansiedad

- **NO se puede deshacer**:
  - Una vez tocado el botón, no se puede cancelar la confirmación
  - Justificación: Compromiso con la acción, evitar ansiedad de "¿debería cancelar?"

## Estados finales
Al finalizar la ventana activa (por tiempo agotado), existen tres estados posibles:

### 1. Confirmación mutua (ambos confirmaron)
- **Condición**: Ambos usuarios tocaron "Creo que te he visto" durante la ventana activa
- **Resultado**: Se activa la revelación mutua (ver [08_REVELACION.md](08_REVELACION.md))
- **Mensaje mostrado**: "¡Confirmación mutua! Se ha revelado la identidad."
- **Consecuencias**:
  - Ambos usuarios ven el perfil mínimo del otro
  - Se abre canal de comunicación temporal (7 días según [00_DECISIONES_V1.md](00_DECISIONES_V1.md))
  - La co-presencia latente se marca como "resuelta exitosamente"

### 2. Confirmación simple (solo uno confirmó)
- **Condición**: Solo uno de los dos usuarios tocó "Creo que te he visto"
- **Resultado**: NO hay revelación
- **Mensaje mostrado**:
  - Al que confirmó: Ningún mensaje explícito de rechazo. La ventana simplemente termina sin revelación.
  - Al que NO confirmó: La ventana termina normalmente.
- **Consecuencias**:
  - NO se revela identidad de ninguno de los dos
  - La confirmación no mutua se purga después de 24 horas (según [00_DECISIONES_V1.md](00_DECISIONES_V1.md))
  - La co-presencia latente se marca como "no confirmada"
  - NO hay notificación de rechazo explícito (dignidad del usuario)

### 3. Sin confirmaciones (ninguno confirmó)
- **Condición**: Ninguno de los dos usuarios tocó el botón durante la ventana activa
- **Resultado**: La ventana expira sin consecuencias
- **Mensaje mostrado**: "La ventana ha terminado."
- **Consecuencias**:
  - La co-presencia latente se purga
  - Ambos usuarios vuelven a estar disponibles para nuevas co-presencias latentes
  - No hay registro de rechazo (simplemente no hubo coincidencia física)

---

**Estado: CERRADO (v1)**