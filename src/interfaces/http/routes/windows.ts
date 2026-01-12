import { FastifyInstance } from 'fastify';
import S from 'fluent-json-schema';
import { WindowController } from '../controllers/WindowController';
import { authenticate } from '../middlewares/auth';

export const windowRoutes = async (server: FastifyInstance) => {
  const controller = new WindowController();

  server.post('/:id/decision', {
    preHandler: [authenticate],
    schema: {
      params: S.object()
        .prop('id', S.string().format('uuid').required()),
      body: S.object()
        .prop('decision', S.string().enum(['accept', 'decline']).required())
    }
  }, controller.makeDecision);
};
