/**
 * Validador de AbstractEvent según fase0/01_ABSTRACCION_DATOS.md
 *
 * Responsabilidades:
 * 1. Validar que SOLO existan campos permitidos (Input vs Stored)
 * 2. Rechazar explícitamente campos prohibidos (anti-GPS)
 * 3. Validar que valores estén en catálogos cerrados
 * 4. Validar formato de week_id
 */

import {
  TIME_BUCKETS,
  PLACE_CATEGORIES,
  DAY_TYPES,
  DURATION_BUCKETS,
  PROHIBITED_FIELDS,
} from '../types/catalogs';
import { AbstractEventInput } from '../types/AbstractEvent.types';
import { validateWeekIdFormat } from '../../utils/weekIdUtils';

/**
 * Campos permitidos en AbstractEventInput según Iteración 1
 * user_id NO está permitido en el input
 */
const ALLOWED_FIELDS = [
  'time_bucket',
  'place_category',
  'day_type',
  'duration_bucket',
  'week_id'
] as const;

export class AbstractEventValidator {
  /**
   * Valida un AbstractEventInput
   *
   * Lanza error si:
   * - Contiene campos prohibidos (anti-GPS)
   * - Contiene campos no permitidos (incluyendo user_id)
   * - Valores no están en catálogos cerrados
   * - week_id tiene formato incorrecto
   */
  validate(input: any): asserts input is AbstractEventInput {
    // 1. Validar campos prohibidos (CRÍTICO - anti-GPS)
    this.validateNoProhibitedFields(input);

    // 2. Validar solo campos permitidos
    this.validateOnlyAllowedFields(input);

    // 3. Validar campos obligatorios
    this.validateRequiredFields(input);

    // 4. Validar valores en catálogos cerrados
    this.validateCatalogValues(input);

    // 5. Validar formato week_id
    this.validateWeekId(input.week_id);
  }

  /**
   * Validación anti-GPS: rechaza cualquier campo prohibido
   */
  private validateNoProhibitedFields(input: any): void {
    const inputKeys = Object.keys(input);
    const foundProhibited = inputKeys.filter(key =>
      PROHIBITED_FIELDS.includes(key as any)
    );

    if (foundProhibited.length > 0) {
      throw new Error(
        `CRÍTICO: AbstractEvent contiene campos prohibidos: ${foundProhibited.join(', ')}`
      );
    }
  }

  /**
   * Validar que solo existan campos permitidos
   */
  private validateOnlyAllowedFields(input: any): void {
    const inputKeys = Object.keys(input);
    const unexpectedFields = inputKeys.filter(
      key => !ALLOWED_FIELDS.includes(key as any)
    );

    if (unexpectedFields.length > 0) {
      throw new Error(
        `AbstractEvent contiene campos no permitidos: ${unexpectedFields.join(', ')}`
      );
    }
  }

  /**
   * Validar campos obligatorios
   */
  private validateRequiredFields(input: any): void {
    const required: (keyof AbstractEventInput)[] = [
      'time_bucket',
      'place_category',
      'day_type',
      'duration_bucket',
      'week_id'
    ];

    for (const field of required) {
      if (!(field in input) || input[field] === null || input[field] === undefined) {
        throw new Error(`Campo obligatorio faltante: ${field}`);
      }
    }
  }

  /**
   * Validar valores en catálogos cerrados
   */
  private validateCatalogValues(input: any): void {
    // time_bucket
    if (!TIME_BUCKETS.includes(input.time_bucket)) {
      throw new Error(
        `time_bucket debe ser uno de: ${TIME_BUCKETS.join(', ')}. Recibido: ${input.time_bucket}`
      );
    }

    // place_category
    if (!PLACE_CATEGORIES.includes(input.place_category)) {
      throw new Error(
        `place_category debe ser uno de: ${PLACE_CATEGORIES.join(', ')}. Recibido: ${input.place_category}`
      );
    }

    // day_type
    if (!DAY_TYPES.includes(input.day_type)) {
      throw new Error(
        `day_type debe ser uno de: ${DAY_TYPES.join(', ')}. Recibido: ${input.day_type}`
      );
    }

    // duration_bucket
    if (!DURATION_BUCKETS.includes(input.duration_bucket)) {
      throw new Error(
        `duration_bucket debe ser uno de: ${DURATION_BUCKETS.join(', ')}. Recibido: ${input.duration_bucket}`
      );
    }
  }

  /**
   * Validar formato week_id
   */
  private validateWeekId(week_id: string): void {
    if (!validateWeekIdFormat(week_id)) {
      throw new Error(
        `week_id debe tener formato YYYY-Www (ej: "2026-W02"). Recibido: ${week_id}`
      );
    }
  }
}
