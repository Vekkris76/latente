import { FastifyInstance } from 'fastify';
import S from 'fluent-json-schema';
import { EventController } from '../controllers/EventController';
import { authenticate } from '../middlewares/auth';

export const eventRoutes = async (server: FastifyInstance) => {
  const controller = new EventController();

  server.post('/', {
    preHandler: [authenticate],
    config: {
      rateLimit: {
        max: 20,
        timeWindow: '1 minute'
      }
    },
    schema: {
      headers: {
        type: 'object',
        required: ['x-idempotency-key'],
        properties: {
          'x-idempotency-key': { type: 'string' }
        }
      },
      body: {
        type: 'object',
        required: ['time_bucket', 'place_category', 'day_type', 'duration_bucket'],
        properties: {
          time_bucket: { type: 'string' },
          place_category: { type: 'string' },
          day_type: { type: 'string' },
          duration_bucket: { type: 'string' }
        },
        additionalProperties: false
      }
    }
  }, controller.ingestEvent);
};
