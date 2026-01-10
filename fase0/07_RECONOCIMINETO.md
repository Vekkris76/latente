# 07 — Reconocimiento

## Qué ocurre al confirmar
Cuando un usuario toca el botón "Creo que te he visto" durante una ventana activa:

1. **Registro interno**:
   - Se registra la confirmación del usuario con timestamp exacto
   - Se marca la co-presencia latente asociada con estado "confirmado_por_[usuario]"

2. **Feedback inmediato al usuario**:
   - El botón cambia visualmente a estado "Confirmado" (deshabilitado)
   - Mensaje en pantalla: "Confirmación enviada. Esperando respuesta..."
   - El usuario permanece en la pantalla de ventana activa hasta que:
     - La otra persona también confirme (revelación inmediata)
     - O la ventana expire por tiempo (sin revelación)

3. **NO se revela información**:
   - El usuario NO sabe si la otra persona ya confirmó o no
   - NO hay indicador de "la otra persona está esperando" o similar
   - Justificación: Evitar presión social y ansiedad

4. **Evaluación de mutualidad**:
   - El sistema verifica constantemente si ambos usuarios han confirmado
   - Si ambos confirman (en cualquier orden durante la ventana): se activa revelación inmediata (ver [08_REVELACION.md](08_REVELACION.md))
   - Si solo uno confirma: se espera hasta el fin de la ventana, luego se descarta

## Caso no mutuo
Cuando solo uno de los dos usuarios confirma durante la ventana activa:

- **TTL de la confirmación no mutua**: 24 horas (según [00_DECISIONES_V1.md](00_DECISIONES_V1.md))
  - Después de 24 horas, la confirmación unilateral se purga del sistema
  - Justificación: Minimizar almacenamiento de datos sensibles

- **Mensaje al usuario que confirmó**:
  - Ningún mensaje explícito de rechazo
  - La ventana simplemente termina con: "La ventana ha terminado."
  - NO se indica que la otra persona no confirmó
  - Justificación: Preservar dignidad del usuario, evitar sensación de rechazo explícito

- **Mensaje al usuario que NO confirmó**:
  - "La ventana ha terminado."
  - El usuario NO sabe que la otra persona confirmó
  - Justificación: Evitar culpa o presión retroactiva

- **Efecto en la co-presencia latente**:
  - La co-presencia latente se marca como "no confirmada" y se purga
  - Ambos usuarios vuelven a estar disponibles para nuevas co-presencias (si no han alcanzado otros límites)

## Opción deshacer

- **Disponible**: NO
  - Una vez que el usuario toca "Creo que te he visto", NO puede deshacer la confirmación

- **Condiciones**: N/A
  - No existen condiciones porque la funcionalidad no está disponible

- **Justificación**:
  - Evitar ansiedad de "¿debería cancelar?"
  - Fomentar compromiso con la acción (si confirmas, es porque estás seguro)
  - Simplificar la lógica del sistema
  - Reducir oportunidades de manipulación o spam

- **Alternativa**:
  - Si el usuario confirmó por error, simplemente espera a que la ventana termine
  - Si la otra persona no confirma, no hay consecuencias (no hay revelación)

---

**Estado: CERRADO (v1)**