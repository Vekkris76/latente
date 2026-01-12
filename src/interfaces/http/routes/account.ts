import { FastifyInstance } from 'fastify';
import { AccountController } from '../controllers/AccountController';
import { authenticate } from '../middlewares/auth';

export const accountRoutes = async (server: FastifyInstance) => {
  const controller = new AccountController();

  server.post('/delete', {
    preHandler: [authenticate]
  }, controller.deleteAccount);
};
