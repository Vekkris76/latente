import { FastifyInstance } from 'fastify';
import S from 'fluent-json-schema';
import { SafetyController } from '../controllers/SafetyController';
import { authenticate } from '../middlewares/auth';

export const safetyRoutes = async (server: FastifyInstance) => {
  const controller = new SafetyController();

  server.post('/block', {
    preHandler: [authenticate],
    config: {
      rateLimit: {
        max: 10,
        timeWindow: '1 minute'
      }
    },
    schema: {
      body: S.object()
        .prop('blocked_user_id', S.string().format('uuid').required())
    }
  }, controller.blockUser);
};
