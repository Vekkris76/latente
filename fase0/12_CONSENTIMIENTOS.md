# 12 — Consentimientos

## Consentimientos requeridos
Los siguientes consentimientos son **obligatorios** para usar LATENTE. Todos deben ser otorgados explícitamente por el usuario antes de acceder al sistema.

### 1. Observación pasiva y detección de patrones
- **Propósito**: Permitir que el sistema detecte patrones de co-presencia basados en información temporal y categórica
- **Alcance**: El sistema procesará eventos abstractos (time_bucket, place_category, day_type, duration_bucket, week_id) para identificar patrones recurrentes
- **Limitación**: NO se guarda ubicación exacta, coordenadas GPS, ni se rastrean dispositivos

### 2. Reconocimiento de abstracción de ubicación
- **Propósito**: Confirmar que el usuario entiende que LATENTE NO guarda su ubicación exacta
- **Alcance**: El usuario reconoce que solo se almacenan categorías abstractas de lugares (ej: "cafés", "bibliotecas"), NO nombres específicos ni direcciones
- **Justificación**: Transparencia y minimización de datos

### 3. Recepción de propuestas de ventanas de sincronía
- **Propósito**: Permitir que el sistema envíe propuestas de ventanas futuras cuando detecte co-presencias latentes
- **Alcance**: El usuario recibirá notificaciones de propuestas de ventanas (máximo 1 activa a la vez)
- **Limitación**: El usuario puede pausar la observación en cualquier momento desde Home

### 4. Retención limitada de datos
- **Propósito**: Confirmar que el usuario entiende las políticas de retención y purga automática
- **Alcance**: Los datos se purgan automáticamente según la tabla de retención ([11_RETENCION_PURGA.md](11_RETENCION_PURGA.md))
- **Justificación**: Minimización de datos y anti-engagement

### 5. Términos de servicio (TODO: redactar documento legal)
- **Propósito**: Aceptación de las condiciones de uso del servicio
- **Alcance**: Reglas de uso, prohibiciones, responsabilidades
- **Requisito**: Debe estar disponible en lenguaje claro, accesible en cualquier momento

### 6. Política de privacidad (TODO: redactar documento legal conforme a GDPR)
- **Propósito**: Aceptación del tratamiento de datos personales
- **Alcance**: Qué datos se recogen, cómo se procesan, con quién se comparten (si aplica), derechos del usuario
- **Requisito**: Cumplimiento GDPR, disponible en lenguaje claro

---

## Texto UI (lenguaje claro)
El siguiente texto se muestra en la pantalla de Consentimientos ([09_UI_SPEC.md](09_UI_SPEC.md) pantalla 2):

### Checkbox 1
**"Acepto que el sistema detecte patrones basados en información temporal y categórica"**

Explicación expandible (opcional):
> "LATENTE detecta cuándo visitas ciertos tipos de lugares (cafés, bibliotecas, gimnasios) en franjas horarias similares, de forma recurrente. Solo guardamos esta información abstracta, NO tu ubicación exacta."

### Checkbox 2
**"Entiendo que NO se guarda mi ubicación exacta"**

Explicación expandible (opcional):
> "LATENTE no guarda coordenadas GPS, direcciones, nombres de lugares específicos ni rastrea tu dispositivo. Solo procesamos categorías generales como 'cafés' o 'bibliotecas' y franjas temporales como 'mañana' o 'tarde'."

### Checkbox 3
**"Acepto recibir propuestas de ventanas de sincronía"**

Explicación expandible (opcional):
> "Cuando detectemos que coincides con alguien en patrones similares, te propondremos una ventana futura (30-45 minutos) donde podríais encontraros. Puedes aceptar o declinar cada propuesta. Solo tendrás una propuesta activa a la vez."

### Checkbox 4
**"Entiendo que los datos se purgan automáticamente según las políticas de retención"**

Explicación expandible (opcional):
> "Tus datos se eliminan automáticamente después de un tiempo limitado. Por ejemplo, las conversaciones expiran a los 7 días, y los eventos abstractos se borran después de 4 semanas. Esto reduce la cantidad de información almacenada y evita acumulación histórica."

### Checkbox 5
**"He leído y acepto los Términos de Servicio"**

Enlace: "Leer Términos de Servicio" (abre documento completo)

### Checkbox 6
**"He leído y acepto la Política de Privacidad"**

Enlace: "Leer Política de Privacidad" (abre documento completo)

---

## Revocación

### Qué ocurre al revocar consentimientos

Si el usuario revoca alguno de los consentimientos obligatorios:

1. **Revocación desde configuración**:
   - El usuario accede a configuración y desmarca algún consentimiento obligatorio
   - Se muestra advertencia: "Si revocas este consentimiento, no podrás usar LATENTE"
   - Opciones:
     - "Cancelar" (mantener consentimiento)
     - "Revocar y pausar cuenta" (pausar observación)
     - "Revocar y eliminar cuenta" (eliminar cuenta completamente)

2. **Efecto de revocar y pausar cuenta**:
   - La observación se pausa automáticamente
   - NO se detectan nuevos patrones
   - NO se generan nuevas co-presencias ni propuestas
   - Las conversaciones activas (< 7 días) permanecen disponibles hasta expirar
   - El usuario puede reactivar consentimientos y volver a usar el sistema

3. **Efecto de revocar y eliminar cuenta**:
   - Se ejecuta proceso de eliminación de cuenta ([11_RETENCION_PURGA.md](11_RETENCION_PURGA.md))
   - Purga inmediata de datos personales
   - Conversaciones activas se cierran
   - Acción irreversible (el usuario debe crear una nueva cuenta para volver)

### Acceso a datos (derecho GDPR)
El usuario puede solicitar:
- **Exportación de datos** (TODO: definir formato y contenido del export - probablemente JSON con eventos abstractos, patrones, conversaciones)
- **Rectificación de datos** (limitado a perfil: nombre, edad, foto)
- **Eliminación de datos** (proceso de eliminación de cuenta)

### Modificación de consentimientos no obligatorios
En v1, todos los consentimientos listados son obligatorios. En futuras versiones, podrían existir consentimientos opcionales (ej: notificaciones push, análisis de uso anónimo).

---

**Estado: CERRADO (v1)**
