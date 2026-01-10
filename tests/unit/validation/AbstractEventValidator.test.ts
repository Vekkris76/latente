import { AbstractEventValidator } from '../../../src/validation/AbstractEventValidator';

describe('AbstractEventValidator', () => {
  let validator: AbstractEventValidator;

  beforeEach(() => {
    validator = new AbstractEventValidator();
  });

  const validEvent = {
    time_bucket: 'morning',
    place_category: 'cafe',
    day_type: 'weekday',
    duration_bucket: 'medium',
    week_id: '2026-W02'
  };

  test('debe pasar con un evento válido (solo 5 campos)', () => {
    expect(() => validator.validate(validEvent)).not.toThrow();
  });

  test('falla si contiene latitude', () => {
    const event = { ...validEvent, latitude: 40.4168 };
    expect(() => validator.validate(event)).toThrow(/campos prohibidos/);
  });

  test('falla si contiene place_name', () => {
    const event = { ...validEvent, place_name: 'Starbucks' };
    expect(() => validator.validate(event)).toThrow(/campos prohibidos/);
  });

  test('falla si contiene wifi_bssid', () => {
    const event = { ...validEvent, wifi_bssid: '00:11:22' };
    expect(() => validator.validate(event)).toThrow(/campos prohibidos/);
  });

  test('falla si hay campo extra (p.ej. "foo")', () => {
    const event = { ...validEvent, foo: 'bar' };
    expect(() => validator.validate(event)).toThrow(/campos no permitidos/);
  });

  test('falla si week_id es 2026-02 (sin W)', () => {
    const event = { ...validEvent, week_id: '2026-02' };
    expect(() => validator.validate(event)).toThrow(/week_id debe tener formato YYYY-Www/);
  });

  test('falla si week_id tiene semana fuera de rango (99)', () => {
    const event = { ...validEvent, week_id: '2026-W99' };
    expect(() => validator.validate(event)).toThrow(/week_id debe tener formato YYYY-Www/);
  });

  test('falla si falta un campo obligatorio', () => {
    const { time_bucket, ...incompleteEvent } = validEvent;
    expect(() => validator.validate(incompleteEvent)).toThrow(/Campo obligatorio faltante/);
  });
});
