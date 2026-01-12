import { FastifyInstance } from 'fastify';
import S from 'fluent-json-schema';
import { RecognitionController } from '../controllers/RecognitionController';
import { authenticate } from '../middlewares/auth';

export const recognitionRoutes = async (server: FastifyInstance) => {
  const controller = new RecognitionController();

  server.post('/', {
    preHandler: [authenticate],
    schema: {
      body: S.object()
        .prop('active_window_id', S.string().format('uuid').required())
    }
  }, controller.createRecognition);
};
