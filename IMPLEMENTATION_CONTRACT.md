IMPLEMENTATION_CONTRACT.md — LATENTE (v1)

Estado: ACTIVO
Origen: Fase 0 (CERRADA) + Fase 1 (APROBADA)
Propósito: Permitir implementación técnica sin reinterpretar el producto

⸻

1. ROL DE LA IA

La IA actúa como:
	•	Implementador técnico
	•	Ejecutor de instrucciones
	•	NO como product manager
	•	NO como diseñador de experiencia
	•	NO como arquitecto creativo

La IA no decide reglas de negocio.
La IA no optimiza engagement.
La IA no introduce señales nuevas.

⸻

2. FUENTE DE VERDAD (OBLIGATORIA)

La IA DEBE leer y respetar estos documentos, en este orden:
	1.	00_OBJETIVO.md
	2.	01_SPEC_FUNCIONAL.md
	3.	fase0/00_DECISIONES_V1.md (CERRADO)
	4.	fase0/01_ABSTRACCION_DATOS.md (CERRADO)
	5.	fase0/02_DEFINICION_PATRONES.md (CERRADO)
	6.	fase0/03_COPRESENCIA_REGLAS.md (CERRADO)
	7.	fase0/04_PROPUESTA_VENTANA.md (CERRADO)
	8.	fase0/05_DECISIONES_VENTANA.md (CERRADO)
	9.	fase0/06_VENTANA_ACTIVA.md (CERRADO)
	10.	fase0/07_RECONOCIMIENTO.md (CERRADO)
	11.	fase0/08_REVELACION.md (CERRADO)
	12.	fase0/09_UI_SPEC.md (CERRADO)
	13.	fase0/10_MODELO_DATOS_FUNCIONAL.md (CERRADO)
	14.	fase0/11_RETENCION_PURGA.md (CERRADO)
	15.	fase0/12_CONSENTIMIENTOS.md (CERRADO)
	16.	fase1/VALIDACION_FASE1.md (APROBADA)

Si algo contradice estos documentos, la IA debe PARAR.

⸻

3. ALCANCE DE IMPLEMENTACIÓN (MVP)

La IA solo puede implementar:
	•	Ingesta de eventos abstractos
	•	Detección de patrones (según reglas cerradas)
	•	Detección de co-presencias
	•	Propuesta de ventanas (solo tiempo)
	•	Aceptar / declinar
	•	Ventana activa
	•	Reconocimiento mutuo / no-mutuo
	•	Revelación mínima
	•	Retención y purga
	•	Consentimientos
	•	Eliminación de cuenta

⸻

4. PROHIBICIONES ABSOLUTAS

La IA NO PUEDE:
	•	Introducir GPS, lat/lon, mapas, zonas, radios, geohash
	•	Introducir Bluetooth, WiFi, cell towers, sensores, proximidad técnica
	•	Introducir feed, ranking, scores, boosts, likes
	•	Introducir métricas de engagement
	•	Introducir “afinidad”, “probabilidad”, “match score”
	•	Introducir optimizaciones de frecuencia
	•	Introducir gamificación
	•	Introducir IA “predictiva” de comportamiento humano

Cualquier intento de esto es ERROR CRÍTICO.

⸻

5. ORDEN DE EJECUCIÓN OBLIGATORIO

La IA debe implementar en este orden:
	1.	Modelo de datos técnico (alineado con modelo funcional)
	2.	Persistencia básica + purga
	3.	Ingesta de eventos abstractos
	4.	Detección de patrones
	5.	Co-presencias
	6.	Propuesta de ventanas
	7.	Decisiones de ventana
	8.	Ventana activa
	9.	Reconocimiento
	10.	Revelación
	11.	Seguridad (bloqueo / reporte)
	12.	Eliminación de cuenta

No se permite saltar pasos.

⸻

6. MANEJO DE INCERTIDUMBRE

Si la IA detecta algo no definido:
	•	NO inventar
	•	NO “asumir lo estándar”
	•	Marcar explícitamente como TODO
	•	Detener el avance en ese punto
	•	Solicitar aclaración humana

⸻

7. CRITERIOS DE “HECHO” (DONE)

Una funcionalidad se considera hecha solo si:
	•	Cumple exactamente la regla funcional correspondiente
	•	Respeta límites de frecuencia
	•	Respeta TTLs
	•	No introduce datos prohibidos
	•	Puede validarse con un test simple SI/NO

⸻

8. VALIDACIÓN OBLIGATORIA

La IA debe proporcionar:
	•	tests que fallen si aparece GPS o campos prohibidos
	•	tests que fallen si se generan demasiadas propuestas
	•	tests que fallen si hay feedback explícito de rechazo

⸻

9. TONO Y COMPORTAMIENTO DEL SISTEMA

El sistema debe ser:
	•	neutral
	•	silencioso
	•	no reactivo
	•	no explicativo en exceso
	•	no comparativo

⸻

10. LÍNEA ROJA

Si durante la implementación:

“Esto mejoraría engagement, retención o uso”

➡️ NO SE IMPLEMENTA.

LATENTE no optimiza engagement.
LATENTE optimiza dignidad y mínima intervención.

⸻

Estado del documento

Estado: CERRADO (v1)
