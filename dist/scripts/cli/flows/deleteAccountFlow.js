"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.runDeleteAccountFlow = runDeleteAccountFlow;
const config_1 = require("../config");
async function runDeleteAccountFlow(adapter, now) {
    const A = config_1.CLI_USERS.A;
    await adapter.deleteAccount(A, now);
    // Tras delete, no debería devolver revelaciones activas para A
    const revs = await adapter.getRevelations(A, now);
    return { deletedUser: A, revelationsAfterDelete: revs };
}
//# sourceMappingURL=deleteAccountFlow.js.map