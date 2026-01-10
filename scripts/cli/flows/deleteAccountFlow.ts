import { Adapter } from "../adapter";
import { CLI_USERS } from "../config";

export async function runDeleteAccountFlow(adapter: Adapter, now: Date) {
  const A = CLI_USERS.A;

  await adapter.deleteAccount(A, now);

  // Tras delete, no debería devolver revelaciones activas para A
  const revs = await adapter.getRevelations(A, now);

  return { deletedUser: A, revelationsAfterDelete: revs };
}