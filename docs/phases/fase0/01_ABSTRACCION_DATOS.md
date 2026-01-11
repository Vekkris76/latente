# 01 — Abstracción de datos permitidos

## Campos permitidos (lista cerrada)
- **time_bucket**: Franja temporal discreta (mañana, mediodía, tarde, noche). Valores: `morning`, `midday`, `afternoon`, `evening`, `night`.
- **place_category**: Categoría abstracta del tipo de lugar (sin identificador único). Valores: `cafe`, `library`, `park`, `gym`, `coworking`, `cultural`, `transport`, `education`, `other`.
- **day_type**: Clasificación del día según calendario. Valores: `weekday`, `weekend`, `holiday`.
- **duration_bucket**: Rango aproximado de duración de permanencia. Valores: `short` (< 30 min), `medium` (30-90 min), `long` (> 90 min).
- **week_id**: Identificador anónimo de semana (para detectar patrones recurrentes). Formato: `YYYY-WW` (año-semana ISO).

## Campos explícitamente prohibidos
- **latitude / longitude** (coordenadas GPS)
- **geohash** (codificación de ubicación)
- **address / street / postal_code** (dirección postal)
- **place_name / place_id / venue_id** (identificadores únicos de lugares)
- **zone / region / district / neighborhood** (delimitación geográfica)
- **radius / distance** (medidas de proximidad)
- **bluetooth_id / beacon_id** (identificadores de dispositivos cercanos)
- **wifi_ssid / wifi_bssid** (redes WiFi detectadas)
- **cell_tower_id / lac / cid** (torres de telefonía)
- **device_id / advertising_id / IMEI** (identificadores de dispositivo)
- **user_id_cleartext** (identificador de usuario en claro)
- **ip_address** (dirección IP)
- **exact_timestamp** (timestamp con precisión de segundos)
- **altitude / floor_level** (altura o piso exacto)
- **motion_vector / heading / speed** (vectores de movimiento)
- **social_graph_ids** (IDs de contactos o conexiones sociales)

## Ejemplos de evento válido
1. `{ time_bucket: "morning", place_category: "cafe", day_type: "weekday", duration_bucket: "medium", week_id: "2026-02" }`
   - Representa una permanencia matutina en un café durante un día laborable de duración media (30-90 min) en la semana 2 de 2026.

2. `{ time_bucket: "afternoon", place_category: "library", day_type: "weekend", duration_bucket: "long", week_id: "2026-03" }`
   - Representa una permanencia prolongada (>90 min) en una biblioteca durante una tarde de fin de semana en la semana 3 de 2026.

3. `{ time_bucket: "evening", place_category: "gym", day_type: "weekday", duration_bucket: "short", week_id: "2026-02" }`
   - Representa una visita breve (<30 min) a un gimnasio durante una tarde-noche de día laborable en la semana 2 de 2026.

## Ejemplos de evento inválido
1. `{ time_bucket: "morning", place_name: "Starbucks Gran Vía", latitude: 40.4168, longitude: -3.7038, day_type: "weekday" }`
   - **Inválido**: Contiene `place_name` (identificador único de lugar), `latitude` y `longitude` (coordenadas GPS exactas). Viola el principio anti-GPS.

2. `{ time_bucket: "afternoon", place_category: "cafe", geohash: "ezs42", wifi_bssid: "00:14:22:01:23:45", duration_bucket: "medium" }`
   - **Inválido**: Contiene `geohash` (codificación de ubicación) y `wifi_bssid` (identificador de red WiFi rastreable). Permite triangulación y tracking.

3. `{ timestamp: "2026-01-10T14:32:18Z", place_category: "library", device_id: "A1B2C3D4", bluetooth_id: "beacon_xyz_123" }`
   - **Inválido**: Contiene `timestamp` exacto (precisión de segundos), `device_id` (identificador de dispositivo) y `bluetooth_id` (beacon rastreable). Permite tracking continuo del usuario.