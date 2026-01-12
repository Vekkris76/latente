import { FastifyInstance } from 'fastify';
import S from 'fluent-json-schema';
import { RevelationController } from '../controllers/RevelationController';
import { authenticate } from '../middlewares/auth';

export const revelationRoutes = async (server: FastifyInstance) => {
  const controller = new RevelationController();

  server.get('/active', {
    preHandler: [authenticate]
  }, controller.getActiveRevelations);

  server.post('/conversations/:revelationId/messages', {
    preHandler: [authenticate],
    schema: {
      params: S.object()
        .prop('revelationId', S.string().format('uuid').required()),
      body: S.object()
        .prop('content', S.string().minLength(1).maxLength(1000).required())
    }
  }, controller.sendMessage);

  server.get('/conversations/:revelationId/messages', {
    preHandler: [authenticate],
    schema: {
      params: S.object()
        .prop('revelationId', S.string().format('uuid').required())
    }
  }, controller.getMessages);
};
