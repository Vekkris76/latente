MVP_TECNICO_MINIMO.md — LATENTE (v1)

Estado: CERRADO
Origen: Fase 0 (CERRADA) + Fase 1 (APROBADA)
Propósito: Delimitar exactamente qué se construye y qué NO en el primer MVP.

⸻

1. PRINCIPIOS DEL MVP
	•	El MVP valida el flujo completo extremo a extremo.
	•	Se prioriza corrección funcional sobre rendimiento.
	•	Se evita cualquier funcionalidad no imprescindible.
	•	No se optimiza engagement ni retención.
	•	Todo lo no crítico se excluye explícitamente.

⸻

2. FUNCIONALIDADES INCLUIDAS (IN SCOPE)

Estas SÍ se implementan en el MVP.

2.1 Núcleo funcional
	•	Ingesta de eventos abstractos (solo campos permitidos).
	•	Detección de patrones según reglas cerradas.
	•	Detección de co-presencias con límites.
	•	Propuesta de ventanas futuras (solo tiempo).
	•	Flujo de aceptar / declinar.
	•	Ventana activa con acción única.
	•	Reconocimiento mutuo / no-mutuo.
	•	Revelación mínima (display_name + imagen opcional).
	•	Conversación limitada con TTL.
	•	Purga automática según políticas.
	•	Consentimientos obligatorios.
	•	Bloqueo / reporte.
	•	Eliminación de cuenta.

⸻

3. FUNCIONALIDADES EXCLUIDAS (OUT OF SCOPE)

Estas NO se implementan en el MVP, aunque sean tentadoras.

3.1 Engagement / social
	•	Feed
	•	Ranking
	•	Likes
	•	Match score
	•	Boosts
	•	Notificaciones push avanzadas
	•	Gamificación

3.2 Localización / señales
	•	GPS
	•	Mapas
	•	Zonas
	•	Radios
	•	Geohash
	•	Bluetooth / WiFi / proximidad técnica
	•	Cualquier señal cruda del dispositivo

3.3 Comunicación avanzada
	•	Multimedia (fotos, audio, vídeo en chat)
	•	Reacciones
	•	Historial permanente de conversaciones
	•	Compartir ubicación
	•	Compartir redes sociales

3.4 Crecimiento / monetización
	•	Pagos
	•	Suscripciones
	•	Publicidad
	•	Métricas de retención
	•	A/B testing

⸻

4. SERVICIOS MÍNIMOS DEL MVP (LÓGICOS)

Sin decidir tecnología, el MVP necesita estos bloques lógicos:
	1.	Auth & Cuenta
	•	registro
	•	login
	•	consentimientos
	•	eliminación de cuenta
	2.	Event Ingestion
	•	recibe eventos abstractos
	•	valida campos permitidos
	3.	Pattern Engine
	•	agrega eventos
	•	detecta patrones
	4.	Co-Presence Engine
	•	cruza patrones
	•	aplica límites
	5.	Window Engine
	•	propone ventanas
	•	gestiona aceptar/declinar
	•	activa ventanas
	6.	Recognition & Revelation
	•	maneja confirmaciones
	•	aplica purga no-mutua
	•	revela información mínima
	7.	Retention & Purge
	•	jobs de limpieza
	•	enforcement de TTL

Nota: Estos bloques pueden vivir juntos o separados técnicamente.
El MVP no obliga a microservicios.

⸻

5. DATOS DEL MVP

5.1 Datos que se almacenan
	•	Usuarios (mínimos)
	•	Eventos abstractos (rolling)
	•	Patrones
	•	Co-presencias
	•	Ventanas
	•	Reconocimientos
	•	Revelaciones
	•	Consentimientos
	•	Bloqueos / reportes

5.2 Datos que NO existen
	•	Coordenadas
	•	Historial infinito
	•	Scores
	•	Afinidades
	•	Métricas de uso individual

⸻

6. CRITERIOS DE “MVP COMPLETO”

El MVP se considera completo cuando:
	•	Se puede simular un flujo real extremo a extremo.
	•	Un usuario puede:
	•	recibir una propuesta
	•	aceptarla
	•	vivir una ventana activa
	•	confirmar
	•	revelar (o purgar silenciosamente)
	•	No existe ningún camino que:
	•	genere spam
	•	genere rechazo explícito
	•	permita tracking

⸻

7. CRITERIOS DE ÉXITO DEL MVP
	•	Pocas propuestas (baja frecuencia).
	•	Comprensión sin explicación.
	•	No-mutuo verdaderamente silencioso.
	•	Sensación de calma, no de búsqueda.
	•	Ausencia total de GPS / mapas.

⸻

8. LÍMITES DEL MVP

El MVP no intenta:
	•	escalar
	•	optimizar latencia
	•	maximizar DAU
	•	retener usuarios

Eso es fase posterior, si procede.

⸻

Estado del documento

Estado: CERRADO (v1)
