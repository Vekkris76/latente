import { Adapter } from "../adapter";
import { CLI_USERS } from "../config";

export async function runSafetyFlow(adapter: Adapter, now: Date) {
  const A = CLI_USERS.A;
  const B = CLI_USERS.B;

  // Bloquear B desde A (usa tu SafetyService real; firma puede variar, por eso adapter hace as any)
  await adapter.block(A, B, now);

  // Intentar volver a detectar copresencias entre A y B
  const cps = await adapter.detectCoPresences([A, B]);

  return { blocked: { by: A, target: B }, copresencesAfterBlock: cps };
}