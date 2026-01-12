import pool from '../../../../src/infrastructure/database/client';
import { PostgresEventRepository } from '../../../../src/infrastructure/repositories/postgres/PostgresEventRepository';
import { PostgresUserRepository } from '../../../../src/infrastructure/repositories/postgres/PostgresUserRepository';
import { AbstractEvent } from '../../../../src/domain/types/AbstractEvent.types';
import { TimeBucket, PlaceCategory, DayType, DurationBucket, AbstractEventStatus, AccountStatus } from '../../../../src/domain/types/enums';
import { randomUUID } from 'crypto';

describe('PostgresEventRepository', () => {
  let repo: PostgresEventRepository;
  let userRepo: PostgresUserRepository;
  const userId = randomUUID();

  beforeAll(async () => {
    repo = new PostgresEventRepository(pool);
    userRepo = new PostgresUserRepository(pool);
    
    // Limpieza y setup de usuario
    await pool.query('DELETE FROM abstract_events');
    await pool.query('DELETE FROM users');
    
    await userRepo.save({
      user_id: userId,
      name: 'Event Tester',
      age: 30,
      observation_active: true,
      account_status: AccountStatus.ACTIVE,
      created_at: new Date()
    });
  });

  afterAll(async () => {
    await pool.end();
  });

  it('debe guardar y encontrar eventos de un usuario', async () => {
    const event: AbstractEvent = {
      id: randomUUID(),
      user_id: userId,
      time_bucket: TimeBucket.MORNING,
      place_category: PlaceCategory.CAFE,
      day_type: DayType.WEEKDAY,
      duration_bucket: DurationBucket.MEDIUM,
      week_id: '2026-01',
      status: AbstractEventStatus.PENDING,
      created_at: new Date()
    };

    await repo.save(event);
    const found = await repo.findById(event.id);
    const allUserEvents = await repo.findAllByUser(userId);

    expect(found).toBeDefined();
    expect(found?.id).toBe(event.id);
    expect(allUserEvents.length).toBeGreaterThan(0);
    expect(allUserEvents.some(e => e.id === event.id)).toBe(true);
  });

  it('debe borrar eventos por userId', async () => {
    await repo.deleteByUserId(userId);
    const allUserEvents = await repo.findAllByUser(userId);
    expect(allUserEvents.length).toBe(0);
  });
});
