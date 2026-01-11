# LATENTE — Demo E2E (Happy Path) sin HTTP

Este documento describe y ejecuta el flujo funcional mínimo del MVP v1 sin endpoints HTTP, usando repositorios in-memory y servicios de dominio.

## Objetivo
Demostrar, de punta a punta, el flujo:

events → patterns → copresences → proposals → accept/accept → active window → confirm/confirm → revelation

## Restricciones cumplidas (v1)
- Anti-GPS: no se aceptan ni almacenan campos prohibidos.
- Anti-engagement: sin feed, sin ranking, sin boosts.
- Datos minimizados: eventos abstractos + TTLs en servicios (según decisiones v1).
- Sin DB, sin cron, sin HTTP.

## Pre-requisitos
- Node + TS configurado en el repo.
- `npm install` ejecutado.
- Scripts de package.json:
  - `runner:demo` (ejecuta `scripts/runners/demoHappyPath.ts`)
  - `test:unit`, `test:integration` (Jest)

## Ejecución
Ejecuta:

```bash
npm run runner:demo