# LATENTUM

LATENTUM es una aplicación experimental de encuentros humanos basada en **copresencias latentes**, diseñada bajo un principio estricto de **privacidad, minimización de datos y anti-engagement**.

No hay GPS, no hay tracking continuo, no hay perfiles públicos clásicos. Solo coincidencias temporales y espaciales abstractas que, en caso de mutuo reconocimiento, permiten una revelación limitada y efímera.

---

## Principios del proyecto

- Privacy by design
  - Sin coordenadas GPS
  - Sin IPs persistidas
  - Sin PII innecesaria
- Anti-engagement
  - No feeds infinitos
  - No scroll adictivo
  - No métricas sociales
- Temporalidad
  - Todo expira
  - Las conversaciones desaparecen
- Simplicidad operativa
  - Infraestructura mínima
  - Costes controlados
  - Stack comprensible

---

## Arquitectura (producción actual)

Internet
  -> Nginx (TLS, headers)
  -> Fastify API (Node.js) [Docker]
  -> PostgreSQL 16 [Docker, localhost]

Datos reales:
- Dominio: latentum.app
- Servidor: OVH Public Cloud VM
- OS: Ubuntu
- Contenedores: Docker + docker compose
- Reverse proxy: Nginx
- Base de datos: PostgreSQL 16 (contenedor)

---

## Stack técnico

Backend:
- Node.js 22
- Fastify
- TypeScript
- JWT
- AJV (validación estricta)
- pg (PostgreSQL)

Infra:
- Docker
- docker compose
- Nginx
- cron (jobs)
- msmtp (alertas por email)

---

## Estructura del proyecto

src/
- application/        Servicios de aplicación
- domain/             Modelos y reglas de negocio
- infrastructure/     DB, repositorios Postgres
- interfaces/http/    API Fastify (routes, controllers)

scripts/
- jobs/               Purga y tareas programadas

tests/
- e2e/
- integration/
- infrastructure/

---

## Quick start dev

1) Instalar dependencias
```bash
npm install
```

2) Configurar variables de entorno
```bash
cp .env.example .env
# Ajustar JWT_SECRET (min 32 chars)
```

3) Ejecutar en desarrollo
```bash
npm run dev
```

Healthcheck:
```bash
curl http://localhost:3000/health
```

---

## Tests

El sistema de tests está dividido para permitir ejecución rápida sin dependencias externas por defecto.

### 1. Tests estándar (sin Postgres)
Ejecuta todos los tests unitarios y de integración que usan repositorios en memoria. No requiere base de datos.
```bash
npm test
```

### 2. Tests con Postgres
Ejecuta la suite completa incluyendo tests de infraestructura Postgres y tests E2E.

**Flujo recomendado para desarrollo local:**

```bash
# Levanta la DB de test y corre los tests
npm run test:postgres

# Limpiar infraestructura de test (opcional)
npm run test:postgres:down
```

**Detalles técnicos:**
- Levanta un contenedor Postgres en el puerto `55432`.
- Base de datos: `latentum_test`, Usuario: `latentum_app`.
- El script inyecta automáticamente `DATABASE_URL_TEST` y `ENABLE_POSTGRES_TESTS=true`.

---

## Env vars

| Variable | Descripción | Default |
|----------|-------------|---------|
| `PORT` | Puerto de la API | `3000` |
| `JWT_SECRET` | Secreto para JWT (min 32 chars) | - |
| `DATABASE_URL` | URL de Postgres (prod/dev) | - |
| `DATABASE_URL_TEST` | URL de Postgres para tests | `postgresql://latentum_app:latentum_test_pass@127.0.0.1:55432/latentum_test` |
| `ENABLE_POSTGRES_TESTS` | Activa tests contra Postgres | `false` |
| `CORS_ORIGIN` | Origin permitido para CORS | - |
| `ENABLE_METRICS` | Activa endpoint `/metrics` | `false` |
| `RL_GLOBAL_MAX` | Rate limit global (req/min) | `100` |

---

## Producción (VM OVH)

Arranque:
cd /opt/latentum/app
docker compose up -d

Comprobación:
docker ps
curl http://127.0.0.1:3000/health

---

## Seguridad

- Headers seguros en Nginx (X-Frame-Options, nosniff, Referrer-Policy, etc.)
- Rate limit activo en Fastify (sin persistencia de IP)
- API accesible vía Nginx
- DB solo en localhost (127.0.0.1:5432)

---

## Retención y purga

- Eventos: 4 semanas
- Patrones expirados: 4 semanas
- Ventanas no aceptadas: TTL por config
- Conversaciones: máximo 7 días
- Borrado físico (no soft delete)

---

## Estado del proyecto

- Fase 0: Dominio (OK)
- Fase 1: Modelo de datos (OK)
- Fase 2: Persistencia Postgres (OK)
- Fase 3: API mínima (OK)
- Fase 4: Operación (en curso)

---

## Nota

Este proyecto no busca maximizar retención ni engagement. Busca explorar una forma deliberada, ética y privada de conexión humana.
Deploy auto: test dissabte, 17 de gener de 2026, 14:26:48 CET
