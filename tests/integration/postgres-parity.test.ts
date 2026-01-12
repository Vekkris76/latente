import pool from '../../src/infrastructure/database/client';
import { PostgresUserRepository } from '../../src/infrastructure/repositories/postgres/PostgresUserRepository';
import { UserRepository as MemoryUserRepository } from '../../src/infrastructure/repositories/memory/UserRepository';
import { User } from '../../src/domain/models/User';
import { AccountStatus } from '../../src/domain/types/enums';
import { randomUUID } from 'crypto';

describe('Paridad Memory vs Postgres - UserRepository', () => {
  let pgRepo: PostgresUserRepository;
  let memRepo: MemoryUserRepository;

  beforeAll(async () => {
    pgRepo = new PostgresUserRepository(pool);
    memRepo = new MemoryUserRepository();
    await pool.query('DELETE FROM users');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('debe comportarse igual al guardar y recuperar un usuario', async () => {
    const user: User = {
      user_id: randomUUID(),
      name: 'Parity User',
      age: 20,
      observation_active: true,
      account_status: AccountStatus.ACTIVE,
      created_at: new Date()
    };

    // Guardar en ambos
    const pgSaved = await pgRepo.save(user);
    const memSaved = await memRepo.save(user);

    expect(pgSaved.user_id).toBe(memSaved.user_id);
    expect(pgSaved.name).toBe(memSaved.name);

    // Recuperar de ambos
    const pgFound = await pgRepo.findById(user.user_id);
    const memFound = await memRepo.findById(user.user_id);

    expect(pgFound).toBeDefined();
    expect(memFound).toBeDefined();
    expect(pgFound?.name).toBe(memFound?.name);
    expect(pgFound?.age).toBe(memFound?.age);
  });
});
