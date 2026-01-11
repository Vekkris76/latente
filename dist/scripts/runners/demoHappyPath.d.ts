/**
 * LATENTE — Demo E2E (Sad Paths) sin HTTP
 *
 * Escenarios:
 * S1: Decline explícito -> cooldown (7 días) al que declina
 * S2: Timeout propuesta (TTL=48h) -> expira sin cooldown
 * S3: No-mutual en ventana activa -> purge silenciosa tras 24h (TTL)
 *
 * Sin cron: simulamos el paso del tiempo y llamamos a los servicios/métodos disponibles.
 */
export {};
//# sourceMappingURL=demoHappyPath.d.ts.map