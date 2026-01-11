# 09 — UI Spec funcional (texto)

## Pantallas obligatorias
Según [01_SPEC_FUNCIONAL.md](../01_SPEC_FUNCIONAL.md), las pantallas mínimas son:

1. Onboarding
2. Consentimientos
3. Perfil mínimo
4. Home (estado + ventanas)
5. Ventana activa
6. Revelación
7. Seguridad (bloquear/reportar)
8. Eliminar cuenta

---

## 1. Onboarding

### Elementos
- Título: "Bienvenido a LATENTE"
- Texto explicativo (3-4 frases máximo):
  - "LATENTE detecta patrones de co-presencia sin rastrear tu ubicación exacta"
  - "Solo te proponemos ventanas de sincronía basadas en coincidencias abstractas"
  - "La identidad solo se revela si ambos confirmáis haberos visto"
- Botón: "Continuar"

### Acción principal
- Tocar "Continuar" → avanza a pantalla de Consentimientos

### Estados vacíos / error
- N/A (pantalla estática informativa)

### Prohibiciones
- NO mostrar testimonios, valoraciones ni número de usuarios
- NO mostrar capturas de pantalla de perfiles o chats
- NO usar lenguaje de urgencia ("¡Únete ahora!", "Miles de usuarios esperando")
- NO incluir iconos de ubicación, mapas ni referencias geográficas

---

## 2. Consentimientos

### Elementos
- Título: "Necesitamos tu consentimiento"
- Lista de consentimientos (checkboxes obligatorios):
  1. "Acepto que el sistema detecte patrones basados en información temporal y categórica"
  2. "Entiendo que NO se guarda mi ubicación exacta"
  3. "Acepto recibir propuestas de ventanas de sincronía"
  4. TODO: Añadir consentimientos legales (GDPR, términos de servicio, política de privacidad)
- Botón: "Aceptar y continuar" (solo habilitado si todos los checkboxes están marcados)
- Enlace: "Leer más sobre cómo funciona" (opcional, abre explicación extendida)

### Acción principal
- Tocar "Aceptar y continuar" → avanza a pantalla de Perfil mínimo

### Estados vacíos / error
- Error: Si el usuario intenta continuar sin marcar todos los checkboxes obligatorios
  - Mensaje: "Debes aceptar todos los consentimientos para continuar"

### Prohibiciones
- NO preseleccionar checkboxes automáticamente
- NO ocultar texto legal en letra pequeña ilegible
- NO usar lenguaje confuso o ambiguo en los consentimientos

---

## 3. Perfil mínimo

### Elementos
- Título: "Completa tu perfil mínimo"
- Campos obligatorios:
  - Nombre (texto libre, máx 50 caracteres)
  - Edad (número o selector de rango - TODO: definir formato exacto)
- Campos opcionales:
  - Foto de perfil (subir imagen)
  - TODO: Definir si hay otros campos opcionales (género, bio corta, etc.)
- Botón: "Guardar y continuar"

### Acción principal
- Tocar "Guardar y continuar" → avanza a pantalla Home

### Estados vacíos / error
- Error: Si el usuario intenta continuar sin rellenar campos obligatorios
  - Mensaje: "Debes completar los campos obligatorios"
- Error: Si la imagen de perfil supera el tamaño máximo
  - Mensaje: "La imagen debe ser menor de X MB" (TODO: definir límite)

### Prohibiciones
- NO solicitar ubicación, dirección, código postal
- NO solicitar información de contacto externa (teléfono, email social, redes sociales)
- NO solicitar preferencias de "tipo de persona que buscas"
- NO incluir campos de "descripción detallada" o "sobre mí" extensos

---

## 4. Home (estado + ventanas)

### Elementos
- Título: "LATENTE"
- **Estado del usuario**:
  - Si observación activa: "Observación activa" + indicador verde
  - Si observación pausada: "Observación pausada" + botón "Reactivar"
  - Botón toggle: "Pausar observación" / "Reactivar observación"
- **Sección de propuestas pendientes**:
  - Si hay propuesta pendiente:
    - Título: "Nueva propuesta de ventana"
    - Patrón detectado: "Coincidencia en: [categoría] [franja temporal]"
    - Ventana propuesta: "[Día], [hora inicio] - [hora fin]"
    - Botones: "Aceptar" / "Declinar"
  - Si no hay propuestas:
    - Mensaje: "No hay propuestas activas"
- **Sección de ventanas activas**:
  - Si hay ventana activa:
    - Botón destacado: "Ir a ventana activa"
  - Si no hay ventana activa:
    - Mensaje: "No hay ventanas activas"
- **Sección de revelaciones activas** (conversaciones):
  - Si hay revelaciones activas (< 7 días):
    - Lista de conversaciones con nombre y foto de perfil
    - Indicador de tiempo restante: "Expira en X días"
  - Si no hay revelaciones:
    - Mensaje: "No hay conversaciones activas"
- Acceso a configuración (icono en esquina superior)

### Acción principal
- Tocar "Aceptar" en propuesta → activa ventana futura (ver [05_DECISIONES_VENTADA.md](05_DECISIONES_VENTADA.md))
- Tocar "Ir a ventana activa" → navega a pantalla de Ventana activa
- Tocar conversación → navega a pantalla de Revelación

### Estados vacíos / error
- Estado vacío inicial (nuevo usuario):
  - Mensaje educativo: "Cuando detectemos patrones de co-presencia, te propondremos una ventana de sincronía aquí"
- Estado: observación pausada
  - Mensaje: "La observación está pausada. No recibirás propuestas hasta que la reactives"

### Prohibiciones
- NO mostrar número de "matches" o "co-presencias detectadas"
- NO mostrar feed de actividad de otros usuarios
- NO mostrar ranking, puntuaciones ni "popularidad"
- NO mostrar notificaciones de "X personas están cerca" o similar
- NO incluir publicidad ni promociones de pago

---

## 5. Ventana activa

### Elementos
- Título: "Ventana activa ahora"
- Patrón: "Patrón: [categoría] [franja temporal]"
- Tiempo restante: "Tiempo restante: XX minutos" (actualización en tiempo real)
- Instrucción: "Si crees que estás viendo a la persona con la que compartes este patrón, toca el botón."
- Botón único (grande, centrado): "Creo que te he visto"
- Recordatorio (primera vez): "Solo se revelará la identidad si ambos lo confirmáis"

### Acción principal
- Tocar "Creo que te he visto" → registra confirmación (ver [07_RECONOCIMINETO.md](07_RECONOCIMINETO.md))
  - El botón cambia a "Confirmado" (deshabilitado)
  - Mensaje: "Confirmación enviada. Esperando respuesta..."

### Estados vacíos / error
- Estado: ventana expirada
  - Mensaje: "La ventana ha terminado"
  - Botón: "Volver a Home"
- Estado: confirmación mutua (inmediato)
  - Transición automática a pantalla de Revelación

### Prohibiciones
- NO mostrar ubicación, mapa ni "estás a X metros"
- NO mostrar "la otra persona está aquí" o indicadores de presencia
- NO incluir botón de "No lo he visto" (ausencia de confirmación es implícita)
- NO permitir deshacer la confirmación

---

## 6. Revelación

### Elementos
- Título: "¡Confirmación mutua!"
- Perfil revelado del otro usuario:
  - Foto de perfil (si disponible)
  - Nombre
  - Edad
- Contexto: "Coincidís en: [categoría] [franja temporal]"
- Imagen contextual (opcional, si alguno subió durante ventana activa)
- Tiempo restante de conversación: "Conversación disponible durante X días"
- Chat de texto (área principal de la pantalla)
  - Campo de entrada de texto
  - Botón "Enviar"
- Acciones de seguridad (menú o botones):
  - "Bloquear"
  - "Reportar"

### Acción principal
- Escribir mensaje y tocar "Enviar" → envía mensaje al otro usuario
- Tocar "Bloquear" → cierra conversación y bloquea usuario permanentemente
- Tocar "Reportar" → abre formulario de reporte

### Estados vacíos / error
- Estado vacío (conversación sin mensajes):
  - Mensaje de bienvenida: "¡Os habéis encontrado! Podéis conversar durante 7 días."
- Estado: conversación expirada (> 7 días)
  - Mensaje: "Esta conversación ha expirado"
  - TODO: Definir si el historial se muestra (solo lectura) o se purga completamente

### Prohibiciones
- NO mostrar indicadores de "escribiendo..."
- NO mostrar confirmaciones de lectura / "visto"
- NO mostrar "última conexión" o estado online/offline
- NO permitir envío de imágenes, videos o archivos (solo texto en v1 - TODO: confirmar)
- NO mostrar historial de patrones compartidos más allá del patrón que generó la revelación

---

## 7. Seguridad (bloquear/reportar)

### Elementos (pantalla de confirmación de bloqueo)
- Título: "¿Bloquear a [nombre]?"
- Texto explicativo: "Esta acción es permanente. No podrás deshacer el bloqueo ni volver a coincidir con esta persona."
- Botones:
  - "Cancelar"
  - "Bloquear" (rojo, destructivo)

### Elementos (pantalla de reporte)
- Título: "Reportar a [nombre]"
- Selector de categoría (radio buttons o dropdown):
  - TODO: Definir categorías exactas (ej: acoso, spam, contenido inapropiado, suplantación)
- Campo de texto opcional: "Detalles adicionales (opcional)"
- Checkbox opcional: "Bloquear automáticamente a este usuario"
- Botones:
  - "Cancelar"
  - "Enviar reporte"

### Acción principal
- Tocar "Bloquear" → ejecuta bloqueo permanente, cierra conversación, vuelve a Home
- Tocar "Enviar reporte" → envía reporte al sistema, vuelve a pantalla anterior

### Estados vacíos / error
- Error: si el reporte falla (problema de red)
  - Mensaje: "No se pudo enviar el reporte. Inténtalo de nuevo."

### Prohibiciones
- NO hacer el bloqueo reversible en v1
- NO notificar al usuario bloqueado/reportado inmediatamente
- NO solicitar justificación obligatoria para bloquear (solo para reportar)

---

## 8. Eliminar cuenta

### Elementos
- Título: "Eliminar cuenta"
- Advertencia (texto destacado): "Esta acción es permanente e irreversible. Se borrarán:"
  - Todos tus patrones detectados
  - Todas tus conversaciones
  - Tu perfil completo
  - TODO: Definir qué datos se conservan por requisitos legales (logs de moderación, etc.)
- Checkbox de confirmación: "Entiendo que esta acción es irreversible"
- Botones:
  - "Cancelar"
  - "Eliminar permanentemente" (rojo, destructivo, solo habilitado si checkbox marcado)

### Acción principal
- Tocar "Eliminar permanentemente" → solicita confirmación final (alert/dialog nativo)
  - "¿Estás seguro? Esta acción no se puede deshacer."
  - Confirmar → elimina cuenta, cierra sesión, vuelve a Onboarding (o pantalla de "Cuenta eliminada")

### Estados vacíos / error
- Error: si la eliminación falla
  - Mensaje: "No se pudo eliminar la cuenta. Contacta con soporte."

### Prohibiciones
- NO dificultar innecesariamente el proceso de eliminación
- NO ofrecer "pausar cuenta" como alternativa engañosa
- NO intentar retener al usuario con ofertas o descuentos (no aplica, no hay monetización)

---

**Estado: CERRADO (v1)**
