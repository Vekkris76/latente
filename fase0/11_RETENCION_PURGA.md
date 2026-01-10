# 11 — Retención y purga

## Tabla de retención
La siguiente tabla define el tiempo máximo de retención para cada tipo de dato en LATENTE v1, siguiendo los principios de minimización de datos y anti-engagement.

| Tipo de dato | Condición | Tiempo máximo de retención | Acción de purga |
|--------------|-----------|----------------------------|-----------------|
| **AbstractEvent** | Evento procesado y fuera de ventana de detección | 4 semanas desde creación | Purga automática (hard delete) |
| **Pattern** | Patrón expirado (span > 4 semanas) | 4 semanas desde last_week_id | Purga automática |
| **LatentCoPresence** | Co-presencia no propuesta | 7 días desde detección | Purga automática |
| **LatentCoPresence** | Propuesta declinada o expirada sin aceptación | 24 horas desde declinar/expirar | Purga automática |
| **SyncWindow** | Ventana expirada sin confirmación mutua | 24 horas desde fin de ventana | Purga automática |
| **Recognition** | Confirmación unilateral (no mutua) | 24 horas desde fin de ventana (según [00_DECISIONES_V1.md](00_DECISIONES_V1.md)) | Purga automática |
| **Revelation** | Conversación expirada | 7 días desde revealed_at (según [00_DECISIONES_V1.md](00_DECISIONES_V1.md)) | Purga de mensajes, conservar metadata mínima para Block (TODO: definir exactamente qué se conserva) |
| **Block** | Bloqueo activo | Permanente mientras la cuenta exista | Se purga solo al eliminar cuenta |
| **Report** | Reporte pendiente o bajo revisión | Hasta resolución + 90 días (TODO: confirmar periodo legal) | Purga tras periodo de auditoría |
| **ConsentState** | Usuario activo | Permanente mientras la cuenta exista | Se purga solo al eliminar cuenta |
| **User** | Cuenta eliminada por el usuario | Purga inmediata de datos personales, conservar logs de moderación por requisitos legales (TODO: definir exactamente qué se conserva) | Soft delete → hard delete tras periodo legal |

## Principios

### Anti-engagement
- **No acumulación histórica**: Los patrones y eventos NO se acumulan indefinidamente
- **Ventanas temporales estrictas**: Todo dato tiene un TTL máximo definido
- **Purga proactiva**: La purga es automática, NO requiere acción del usuario
- **Sin "historial de matches"**: No se conserva registro de revelaciones pasadas más allá del periodo activo (7 días)

### Minimización de datos
- **Retención mínima necesaria**: Solo se retiene lo estrictamente necesario para el funcionamiento del sistema
- **Purga de confirmaciones no mutuas**: Las confirmaciones unilaterales se purgan en 24 horas (dignidad del usuario)
- **Purga de propuestas no aceptadas**: Las propuestas declinadas/expiradas se purgan en 24 horas
- **Sin almacenamiento indefinido de mensajes**: Las conversaciones expiran y se purgan después de 7 días

### Excepciones para cumplimiento legal
- **Bloqueos**: Se conservan permanentemente para evitar futuras co-presencias entre usuarios bloqueados
- **Reportes**: Se conservan por periodo de auditoría legal (TODO: definir periodo exacto según jurisdicción)
- **Logs de moderación**: Se conservan datos mínimos de usuarios suspendidos/baneados (TODO: definir alcance exacto)

## Proceso de purga automática

### Frecuencia de ejecución
- TODO: Definir frecuencia del proceso de purga (diario, cada 12 horas, etc.)
- Justificación para baja frecuencia: Evitar sobrecarga del sistema, la purga no necesita ser en tiempo real

### Orden de purga
1. AbstractEvent expirados (> 4 semanas)
2. Pattern expirados (span > 4 semanas)
3. LatentCoPresence no propuestas (> 7 días)
4. SyncWindow expiradas (> 24 horas desde fin)
5. Recognition unilaterales (> 24 horas desde fin de ventana)
6. Revelation expiradas (> 7 días desde revealed_at)

### Notificación al usuario
- **NO se notifica al usuario de purgas automáticas** (reduce ansiedad)
- Excepción: Cuando una conversación está próxima a expirar (< 24 horas), se muestra indicador en UI (ver [09_UI_SPEC.md](09_UI_SPEC.md))

## Eliminación de cuenta

### Proceso
1. Usuario solicita eliminación desde [09_UI_SPEC.md](09_UI_SPEC.md) pantalla 8
2. Confirmación explícita requerida
3. Purga inmediata de:
   - Perfil (nombre, foto, edad)
   - Eventos abstractos
   - Patrones
   - Co-presencias latentes
   - Ventanas
   - Reconocimientos
   - Revelaciones y mensajes
4. Conservación mínima por requisitos legales:
   - Bloqueos (para evitar futuras co-presencias)
   - Reportes activos (para auditoría)
   - Logs de moderación si aplica
   - TODO: Definir exactamente qué metadata se conserva y por cuánto tiempo

### Efecto en otros usuarios
- Si el usuario tenía conversaciones activas: se cierran inmediatamente
- El otro usuario ve mensaje: "Esta conversación ya no está disponible"
- NO se notifica explícitamente que el usuario eliminó su cuenta (discreción)

---

**Estado: CERRADO (v1)**
