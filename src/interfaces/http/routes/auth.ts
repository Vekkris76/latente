import { FastifyInstance } from 'fastify';
import S from 'fluent-json-schema';
import { AuthController } from '../controllers/AuthController';

export const authRoutes = async (server: FastifyInstance) => {
  const controller = new AuthController();

  server.post('/request-code', {
    schema: {
      body: S.object()
        .prop('email', S.string().format('email').required())
    }
  }, controller.requestCode);

  server.post('/verify-code', {
    schema: {
      body: S.object()
        .prop('email', S.string().format('email').required())
        .prop('code', S.string().minLength(6).maxLength(6).required())
    }
  }, controller.verifyCode);

  server.post('/refresh', {
    schema: {
      body: S.object()
        .prop('refresh_token', S.string().required())
    }
  }, controller.refresh);
};
