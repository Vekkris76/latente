import pool from '../../../../src/infrastructure/database/client';
import { PostgresUserRepository } from '../../../../src/infrastructure/repositories/postgres/PostgresUserRepository';
import { User } from '../../../../src/domain/models/User';
import { AccountStatus } from '../../../../src/domain/types/enums';
import { randomUUID } from 'crypto';

describe('PostgresUserRepository', () => {
  let repo: PostgresUserRepository;

  beforeAll(async () => {
    repo = new PostgresUserRepository(pool);
    // Limpieza inicial
    await pool.query('DELETE FROM users');
  });

  afterAll(async () => {
    await pool.end();
  });

  it('debe guardar y encontrar un usuario', async () => {
    const user: User = {
      user_id: randomUUID(),
      name: 'Test User',
      age: 25,
      observation_active: true,
      account_status: AccountStatus.ACTIVE,
      created_at: new Date()
    };

    await repo.save(user);
    const found = await repo.findById(user.user_id);

    expect(found).toBeDefined();
    expect(found?.user_id).toBe(user.user_id);
    expect(found?.name).toBe(user.name);
    expect(found?.age).toBe(user.age);
  });

  it('debe actualizar un usuario existente (upsert)', async () => {
    const userId = randomUUID();
    const user: User = {
      user_id: userId,
      name: 'Original Name',
      age: 30,
      observation_active: true,
      account_status: AccountStatus.ACTIVE,
      created_at: new Date()
    };

    await repo.save(user);
    
    const updatedUser = { ...user, name: 'Updated Name' };
    await repo.save(updatedUser);

    const found = await repo.findById(userId);
    expect(found?.name).toBe('Updated Name');
  });

  it('debe retornar null si el usuario no existe', async () => {
    const found = await repo.findById(randomUUID());
    expect(found).toBeNull();
  });
});
