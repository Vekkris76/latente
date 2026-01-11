"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runSafetyFlow = runSafetyFlow;
const config_1 = require("../config");
async function runSafetyFlow(adapter, now) {
    const A = config_1.CLI_USERS.A;
    const B = config_1.CLI_USERS.B;
    // Bloquear B desde A (usa tu SafetyService real; firma puede variar, por eso adapter hace as any)
    await adapter.block(A, B, now);
    // Intentar volver a detectar copresencias entre A y B
    const cps = await adapter.detectCoPresences([A, B]);
    return { blocked: { by: A, target: B }, copresencesAfterBlock: cps };
}
//# sourceMappingURL=safetyFlow.js.map