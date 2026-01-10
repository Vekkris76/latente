FASE 0 (REESCRITA Y CERRADA) — LATENTE

Propósito de Fase 0: dejar el producto funcionalmente “cerrado” para que ninguna IA invente señales, mapas, zonas ni mecánicas de engagement.

0.0 Decisiones v1 (valores por defecto)

Dependencias: ninguna
Descripción: Fijar valores que Claude dejó abiertos para evitar ambigüedad.
Valores v1 (cerrados):
	•	TTL reconocimiento no mutuo: 24h
	•	TTL revelación/chat: 7 días
	•	Cooldown tras declinar: 7 días
	•	Máximo propuestas activas por usuario: 1
	•	Máximo co-presencias internas por usuario: 2
	•	Ventana propuesta: 30–45 min
	•	Horas “no vulnerables”: 08:00–22:00 (hora local)
	•	Imagen contextual: opcional
Criterio de hecho: documento 00_DECISIONES_V1.md con esta lista exacta.

⸻

0.1 Modelo de detección sin GPS (ABSTRACCIÓN PERMITIDA)

Dependencias: 0.0
Descripción: Definir qué datos usa LATENTE para “detectar” sin ubicación exacta ni señales identificables.
Regla funcional: LATENTE trabaja con eventos abstractos, no con coordenadas ni identificadores rastreables.

Payload permitido (único):
	•	time_bucket (p.ej., “18:00–19:00”)
	•	place_category (cerrado): quiet_indoor | social_indoor | outdoor_green | transit | work_like | home_like
	•	day_type: weekday | weekend
	•	duration_bucket: 15-30 | 30-60 | 60+
	•	week_id: ISO week (“2026-W02”)

Explícitamente NO permitido:
	•	GPS, lat/lon, mapas, direcciones
	•	“zonas” de ciudad, radios, geohash
	•	BSSID/SSID Wi-Fi, Bluetooth IDs, cell tower IDs, device identifiers de proximidad

Criterio de hecho: documento 01_ABSTRACCION_DATOS.md con:
	•	lista de campos permitidos (exacta)
	•	lista de campos prohibidos (exacta)
	•	3 ejemplos de evento válido y 3 inválidos

⸻

0.2 Definición de “patrón” (no evento suelto)

Dependencias: 0.1
Descripción: Definir cuándo un conjunto de eventos abstractos constituye un patrón estable.

Regla v1 (cerrada):
	•	Un patrón existe si se repite ≥ 3 veces en ≥ 2 semanas para la misma combinación:
(time_bucket, place_category, day_type)
	•	Un patrón se considera “estable” si su repetición no depende de un solo día (p.ej. no todo en una única fecha).
	•	Los eventos en home_like no generan propuestas de ventana (solo pueden existir como contexto interno).

Criterio de hecho: documento 02_DEFINICION_PATRONES.md con reglas + 5 casos de ejemplo (2 válidos, 3 descartados).

⸻

0.3 Reglas de co-presencia (matching interno)

Dependencias: 0.2
Descripción: Definir cuándo dos usuarios se consideran co-presentes “latentes” a nivel funcional.

Regla v1 (cerrada):
	•	Co-presencia latente si hay solape de patrones en:
	•	mismo time_bucket
	•	mismo place_category (excepto home_like)
	•	mismo day_type
	•	dentro de las últimas 6–8 semanas (rolling)
	•	Máximo 2 co-presencias activas internas por usuario.

Criterio de hecho: documento 03_COPRESENCIA_REGLAS.md con:
	•	condiciones mínimas
	•	límites (2 por usuario)
	•	criterios de descarte (bloqueos, cooldown, pausar)

⸻

0.4 Propuesta de ventana futura (sin “dónde”)

Dependencias: 0.3
Descripción: Definir cómo se propone una ventana futura sin aportar localización, zona ni mapa.

Regla v1 (cerrada):
	•	La propuesta solo incluye: fecha + franja (start/end) y copy neutral.
	•	La ventana se calcula tomando el próximo slot compatible con el patrón, siempre:
	•	futuro
	•	30–45 min
	•	entre 08:00–22:00
	•	No se muestra ninguna pista espacial.

Criterio de hecho: documento 04_PROPUESTA_VENTANA.md con:
	•	reglas de cálculo
	•	10 ejemplos de propuestas válidas (solo tiempo)
	•	ejemplo de propuesta inválida (por incluir ubicación/zona)

⸻

0.5 Aceptar/declinar (dignidad y silencio)

Dependencias: 0.4
Descripción: Cerrar el comportamiento cuando el usuario responde a una propuesta.

Regla v1 (cerrada):
	•	Aceptar: “pendiente de activarse” (sin indicar estado del otro)
	•	Declinar: se cierra sin feedback social
	•	Si no se activa (porque el otro no acepta o expira): mensaje neutral
“Esta coincidencia no se activó.”
	•	Cooldown tras declinar: 7 días para esa pareja/patrón.

Criterio de hecho: documento 05_DECISIONES_VENTANA.md con tabla de estados:
	•	ambos aceptan
	•	uno acepta
	•	ninguno
	•	timeout
y el resultado en cada caso.

⸻

0.6 Ventana activa + botón único

Dependencias: 0.5
Descripción: Definir el comportamiento durante la ventana activa (núcleo del producto).

Regla v1 (cerrada):
	•	Durante ventana activa hay una acción:
	•	“Creo que te he visto”
	•	El texto de instrucciones es fijo (neutral) y no incluye mapas ni “radar”.
	•	Si nadie confirma: se cierra sin feedback negativo.

Criterio de hecho: documento 06_VENTANA_ACTIVA.md con:
	•	texto exacto de instrucciones (3 líneas)
	•	estados (active/closed/expired)
	•	comportamiento si no hay confirmación

⸻

0.7 Reconocimiento y no-mutuo (purga silenciosa)

Dependencias: 0.6
Descripción: Cerrar el flujo cuando uno confirma y el otro no.

Regla v1 (cerrada):
	•	Confirmación de A sin B:
	•	no revela nada
	•	no notifica “rechazo”
	•	se purga tras 24h
	•	Opción “Deshacer” (recomendada) disponible mientras no sea mutuo y dentro de TTL.

Criterio de hecho: documento 07_RECONOCIMIENTO.md con:
	•	timeline
	•	mensaje exacto al usuario
	•	regla de purga 24h

⸻

0.8 Revelación mutua (qué se revela y qué no)

Dependencias: 0.7
Descripción: Definir qué aparece cuando hay mutuo.

Revelación v1 (cerrada):
	•	Se revela: display_name + contextual_image (si existe)
	•	Se habilita conversación limitada con TTL 7 días
	•	No se habilita multimedia al inicio (texto simple)
	•	Siempre hay acciones: Bloquear y Reportar

Criterio de hecho: documento 08_REVELACION.md con:
	•	lista exacta de campos
	•	TTL 7 días
	•	limitaciones de chat
	•	post-acciones

⸻

0.9 Wireframes textuales (8 pantallas mínimas)

Dependencias: 0.1–0.8
Descripción: Especificación pantalla por pantalla, a nivel de componentes y copy funcional.

Pantallas (cerradas):
	1.	Onboarding Intro
	2.	Consentimientos
	3.	Perfil mínimo
	4.	Home
	5.	Propuesta detalle (opcional si no se usa card directa)
	6.	Ventana activa
	7.	Revelación
	8.	Seguridad / Cuenta / Eliminar cuenta (puede ser 2 pantallas si prefieres)

Criterio de hecho: documento 09_UI_SPEC.md con:
	•	elementos por pantalla
	•	acciones
	•	estados vacíos/errores
	•	prohibiciones visibles (sin feed/mapas)

⸻

0.10 Modelo conceptual de datos (funcional, no técnico)

Dependencias: 0.1–0.8
Descripción: Entidades y estados a nivel de producto (sin BD).

Entidades mínimas:
	•	User
	•	ConsentState
	•	AbstractEvent
	•	Pattern
	•	LatentCoPresence
	•	SyncWindow
	•	Recognition
	•	Revelation
	•	Block/Report

Criterio de hecho: documento 10_MODELO_DATOS_FUNCIONAL.md con:
	•	entidades + atributos (conceptuales)
	•	estados principales
	•	campos prohibidos explícitos

⸻

0.11 Política de retención y purga (anti-engagement)

Dependencias: 0.10
Descripción: Tabla de retención por tipo de dato (rolling).

Regla v1 (cerrada):
	•	Abstract events: rolling 6–8 semanas
	•	Co-presencias no usadas: purga
	•	Reconocimientos no mutuos: 24h
	•	Revelación/chat: 7 días
	•	Eliminación cuenta: purga inmediata

Criterio de hecho: documento 11_RETENCION_PURGA.md con tabla:
tipo → condición → máximo tiempo → acción.

⸻

0.12 Consentimientos mínimos (texto legal funcional)

Dependencias: 0.11
Descripción: Qué consientes y cómo se revoca, con textos en lenguaje claro (no legalese).

Criterio de hecho: documento 12_CONSENTIMIENTOS.md con:
	•	lista de consentimientos
	•	texto corto para UI
	•	qué ocurre si revoca (pausa funcional inmediata)

⸻

Ajuste clave respecto a la propuesta de Claude

Claude propuso señales (Bluetooth/Wi-Fi/celdas) y “zonas” de ciudad. En LATENTE v1, eso se elimina porque:
	•	incrementa riesgo de re-identificación
	•	reintroduce “dónde”, aunque sea aproximado
	•	complica permisos y percepción del usuario
	•	no es necesario para el flujo funcional

LATENTE v1 se sostiene con abstracción por categorías + tiempo, y el “encuentro” ocurre por sincronía, no por guía espacial.

⸻

Próximo paso inmediato (único)

Empieza por 0.0 y 0.1.