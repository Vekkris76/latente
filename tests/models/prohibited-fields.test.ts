/**
 * Tests críticos de validación según IMPLEMENTACION_CONTRACT.md sección 8
 *
 * Estos tests DEBEN FALLAR si aparecen campos prohibidos
 */

import {
  validateUserNoProhibitedFields,
  validateAbstractEventNoProhibitedFields,
  validatePatternNoProhibitedFields,
  validateLatentCoPresenceNoProhibitedFields,
  validateSyncWindowNoProhibitedFields,
  validateRecognitionNoProhibitedFields,
  validateRevelationNoProhibitedFields,
  validateBlockNotSelfBlock,
  validateReportNotSelfReport,
} from '../../src/domain/models';

import {
  TimeBucket,
  PlaceCategory,
  DayType,
  DurationBucket,
  AccountStatus,
  AbstractEventStatus,
  PatternStatus,
  LatentCoPresenceStatus,
  SyncWindowStatus,
  RecognitionStatus,
  RevelationStatus,
  BlockStatus,
  ReportStatus
} from '../../src/domain/types/enums';

describe('Prohibited Fields Validation', () => {
  describe('User - GPS and location fields', () => {
    it('should FAIL if User contains latitude', () => {
      const invalidUser = {
        user_id: 'u1',
        name: 'Test',
        age: 25,
        observation_active: true,
        created_at: new Date(),
        account_status: AccountStatus.ACTIVE,
        latitude: 40.4168  // PROHIBIDO
      } as any;

      expect(() => validateUserNoProhibitedFields(invalidUser))
        .toThrow('CRÍTICO: User contiene campos prohibidos');
    });

    it('should FAIL if User contains device_id', () => {
      const invalidUser = {
        user_id: 'u1',
        name: 'Test',
        age: 25,
        observation_active: true,
        created_at: new Date(),
        account_status: AccountStatus.ACTIVE,
        device_id: 'abc123'  // PROHIBIDO
      } as any;

      expect(() => validateUserNoProhibitedFields(invalidUser))
        .toThrow('CRÍTICO: User contiene campos prohibidos');
    });

    it('should PASS if User has only allowed fields', () => {
      const validUser = {
        user_id: 'u1',
        name: 'Test',
        age: 25,
        observation_active: true,
        created_at: new Date(),
        account_status: AccountStatus.ACTIVE
      };

      expect(validateUserNoProhibitedFields(validUser)).toBe(true);
    });
  });

  describe('AbstractEvent - GPS and tracking fields', () => {
    it('should FAIL if AbstractEvent contains latitude', () => {
      const invalidEvent = {
        user_id: 'u1',
        time_bucket: TimeBucket.MORNING,
        place_category: PlaceCategory.CAFE,
        day_type: DayType.WEEKDAY,
        duration_bucket: DurationBucket.MEDIUM,
        week_id: '2026-02',
        created_at: new Date(),
        status: AbstractEventStatus.PENDING,
        latitude: 40.4168  // PROHIBIDO
      } as any;

      expect(() => validateAbstractEventNoProhibitedFields(invalidEvent))
        .toThrow('CRÍTICO: AbstractEvent contiene campos prohibidos');
    });

    it('should FAIL if AbstractEvent contains place_name', () => {
      const invalidEvent = {
        user_id: 'u1',
        time_bucket: TimeBucket.MORNING,
        place_category: PlaceCategory.CAFE,
        day_type: DayType.WEEKDAY,
        duration_bucket: DurationBucket.MEDIUM,
        week_id: '2026-02',
        created_at: new Date(),
        status: AbstractEventStatus.PENDING,
        place_name: 'Starbucks Gran Vía'  // PROHIBIDO
      } as any;

      expect(() => validateAbstractEventNoProhibitedFields(invalidEvent))
        .toThrow('CRÍTICO: AbstractEvent contiene campos prohibidos');
    });

    it('should FAIL if AbstractEvent contains wifi_bssid', () => {
      const invalidEvent = {
        user_id: 'u1',
        time_bucket: TimeBucket.MORNING,
        place_category: PlaceCategory.CAFE,
        day_type: DayType.WEEKDAY,
        duration_bucket: DurationBucket.MEDIUM,
        week_id: '2026-02',
        created_at: new Date(),
        status: AbstractEventStatus.PENDING,
        wifi_bssid: '00:14:22:01:23:45'  // PROHIBIDO
      } as any;

      expect(() => validateAbstractEventNoProhibitedFields(invalidEvent))
        .toThrow('CRÍTICO: AbstractEvent contiene campos prohibidos');
    });

    it('should PASS if AbstractEvent has only allowed fields', () => {
      const validEvent = {
        user_id: 'u1',
        time_bucket: TimeBucket.MORNING,
        place_category: PlaceCategory.CAFE,
        day_type: DayType.WEEKDAY,
        duration_bucket: DurationBucket.MEDIUM,
        week_id: '2026-02',
        created_at: new Date(),
        status: AbstractEventStatus.PENDING
      };

      expect(validateAbstractEventNoProhibitedFields(validEvent)).toBe(true);
    });
  });

  describe('Pattern - score and ranking fields', () => {
    it('should FAIL if Pattern contains affinity_score', () => {
      const invalidPattern = {
        pattern_id: 'p1',
        user_id: 'u1',
        place_category: PlaceCategory.CAFE,
        time_bucket: TimeBucket.MORNING,
        day_type: DayType.WEEKDAY,
        occurrences_count: 3,
        first_week_id: '2026-02',
        last_week_id: '2026-04',
        pattern_status: PatternStatus.ACTIVE,
        detected_at: new Date(),
        affinity_score: 0.85  // PROHIBIDO
      } as any;

      expect(() => validatePatternNoProhibitedFields(invalidPattern))
        .toThrow('CRÍTICO: Pattern contiene campos prohibidos');
    });

    it('should FAIL if Pattern has less than 3 events', () => {
      const invalidPattern = {
        pattern_id: 'p1',
        user_id: 'u1',
        place_category: PlaceCategory.CAFE,
        time_bucket: TimeBucket.MORNING,
        day_type: DayType.WEEKDAY,
        occurrences_count: 2,  // Mínimo: 3
        first_week_id: '2026-02',
        last_week_id: '2026-03',
        pattern_status: PatternStatus.ACTIVE,
        detected_at: new Date()
      } as any;

      expect(() => validatePatternNoProhibitedFields(invalidPattern))
        .toThrow('Pattern must have at least 3 events');
    });

    it('should PASS if Pattern has only allowed fields', () => {
      const validPattern = {
        pattern_id: 'p1',
        user_id: 'u1',
        place_category: PlaceCategory.CAFE,
        time_bucket: TimeBucket.MORNING,
        day_type: DayType.WEEKDAY,
        occurrences_count: 3,
        first_week_id: '2026-02',
        last_week_id: '2026-04',
        pattern_status: PatternStatus.ACTIVE,
        detected_at: new Date()
      } as any;

      expect(validatePatternNoProhibitedFields(validPattern)).toBe(true);
    });
  });

  describe('LatentCoPresence - score and engagement fields', () => {
    it('should FAIL if LatentCoPresence contains compatibility_percentage', () => {
      const invalidCopresence = {
        copresence_id: 'cp1',
        user_a_id: 'u1',
        user_b_id: 'u2',
        pattern_id_a: 'p1',
        pattern_id_b: 'p2',
        shared_place_category: PlaceCategory.CAFE,
        shared_time_bucket: TimeBucket.MORNING,
        detected_at: new Date(),
        status: LatentCoPresenceStatus.DETECTED,
        compatibility_percentage: 0.92  // PROHIBIDO
      } as any;

      expect(() => validateLatentCoPresenceNoProhibitedFields(invalidCopresence))
        .toThrow('CRÍTICO: LatentCoPresence contiene campos prohibidos');
    });

    it('should PASS if LatentCoPresence has only allowed fields', () => {
      const validCopresence = {
        copresence_id: 'cp1',
        user_a_id: 'u1',
        user_b_id: 'u2',
        pattern_id_a: 'p1',
        pattern_id_b: 'p2',
        shared_place_category: PlaceCategory.CAFE,
        shared_time_bucket: TimeBucket.MORNING,
        overlap_week_ids: ['2026-W01'],
        detected_at: new Date(),
        status: LatentCoPresenceStatus.DETECTED
      } as any;

      expect(validateLatentCoPresenceNoProhibitedFields(validCopresence)).toBe(true);
    });
  });

  describe('SyncWindow - location fields', () => {
    it('should FAIL if SyncWindow contains location', () => {
      const invalidWindow = {
        window_id: 'w1',
        copresence_id: 'cp1',
        user_a_id: 'u1',
        user_b_id: 'u2',
        proposed_date: '2026-01-13',
        start_time: '09:00',
        end_time: '09:45',
        duration_minutes: 45,
        window_status: SyncWindowStatus.PROPOSED,
        user_a_accepted: false,
        user_b_accepted: false,
        location: 'Starbucks Gran Vía'  // PROHIBIDO
      } as any;

      expect(() => validateSyncWindowNoProhibitedFields(invalidWindow))
        .toThrow('CRÍTICO: SyncWindow contiene campos prohibidos');
    });

    it('should FAIL if SyncWindow duration is less than 30 minutes', () => {
      const invalidWindow = {
        window_id: 'w1',
        copresence_id: 'cp1',
        user_a_id: 'u1',
        user_b_id: 'u2',
        proposed_date: '2026-01-13',
        start_time: '09:00',
        end_time: '09:20',
        duration_minutes: 20,  // Mínimo: 30
        window_status: SyncWindowStatus.PROPOSED,
        user_a_accepted: false,
        user_b_accepted: false
      };

      expect(() => validateSyncWindowNoProhibitedFields(invalidWindow))
        .toThrow('Window duration must be 30-45 minutes');
    });

    it('should PASS if SyncWindow has only allowed fields', () => {
      const validWindow = {
        window_id: 'w1',
        copresence_id: 'cp1',
        user_a_id: 'u1',
        user_b_id: 'u2',
        proposed_date: '2026-01-13',
        start_time: '09:00',
        end_time: '09:45',
        duration_minutes: 45,
        window_status: SyncWindowStatus.PROPOSED,
        user_a_accepted: false,
        user_b_accepted: false
      };

      expect(validateSyncWindowNoProhibitedFields(validWindow)).toBe(true);
    });
  });
});
