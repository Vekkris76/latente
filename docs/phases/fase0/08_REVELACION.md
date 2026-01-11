# 08 — Revelación mutua

## Campos revelados
Cuando ambos usuarios confirman durante la ventana activa, se produce la **revelación mutua**. Los siguientes campos (y **SOLO** estos) se hacen visibles para ambos usuarios:

### Campos obligatorios revelados:
1. **Nombre** (nombre de usuario o nombre real, según configuración del perfil mínimo)
2. **Edad** (rango o número exacto, según configuración del perfil mínimo - TODO: definir si es rango o exacto)
3. **Foto de perfil** (opcional, si el usuario la ha proporcionado)

### Contexto de la coincidencia:
4. **Patrón compartido**: Categoría y franja temporal (ej: "Coincidís en: cafés por la mañana")
5. **Imagen contextual** (opcional, según [00_DECISIONES_V1.md](00_DECISIONES_V1.md)):
   - Si alguno de los usuarios subió una imagen durante la ventana activa (funcionalidad opcional)
   - TODO: Definir si esta funcionalidad está habilitada en v1

### Campos explícitamente NO revelados:
- Ubicación exacta, dirección, nombre del lugar específico
- Historial completo de patrones o lugares visitados
- Otros usuarios con los que comparte patrones
- Número de co-presencias previas
- Datos demográficos adicionales no especificados en perfil mínimo
- Información de contacto externa (teléfono, email, redes sociales) - solo chat interno

## Conversación

- **Permitida**: SÍ
  - Se abre un canal de conversación privada entre los dos usuarios
  - Funcionalidad: chat de texto básico (sin multimedia en v1 - TODO: confirmar)

- **Duración**: 7 días (según [00_DECISIONES_V1.md](00_DECISIONES_V1.md))
  - Desde el momento de la revelación mutua
  - Después de 7 días, el canal de conversación se cierra automáticamente
  - TODO: Definir si el historial de conversación se purga o se archiva (solo lectura)

- **Limitaciones**:
  - NO hay notificaciones push agresivas (anti-engagement)
  - NO hay indicadores de "escribiendo..." (reduce ansiedad)
  - NO hay confirmaciones de lectura / "visto" (reduce presión)
  - TODO: Definir si hay límite de mensajes por día o restricciones de contenido

## Acciones posteriores
Durante y después de la revelación, los usuarios tienen acceso a las siguientes acciones de seguridad:

### Bloquear
- **Funcionalidad**: Bloquear al otro usuario permanentemente
- **Efecto**:
  - Se cierra inmediatamente el canal de conversación
  - Los dos usuarios NUNCA volverán a generar co-presencias latentes entre sí
  - El usuario bloqueado NO recibe notificación de que fue bloqueado (discreción)
  - El historial de conversación se purga inmediatamente para el usuario que bloqueó
- **Reversible**: NO (decisión permanente en v1)

### Reportar
- **Funcionalidad**: Reportar comportamiento inapropiado del otro usuario
- **Efecto**:
  - Se envía un reporte al sistema de moderación (TODO: definir proceso de moderación)
  - El reporte incluye contexto mínimo (usuarios involucrados, timestamp)
  - Opcionalmente: bloqueo automático al reportar (TODO: definir si es automático o opcional)
  - El usuario reportado NO recibe notificación inmediata (para seguridad del reportante)
- **Categorías de reporte**: TODO
  - Ejemplos: acoso, spam, contenido inapropiado, suplantación de identidad
- **Proceso posterior**: TODO
  - Revisión manual vs. automatizada
  - Consecuencias para el usuario reportado (advertencia, suspensión, baneado)

---

**Estado: CERRADO (v1)**