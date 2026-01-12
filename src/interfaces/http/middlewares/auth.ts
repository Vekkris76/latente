import { FastifyReply, FastifyRequest } from 'fastify';

export const authenticate = async (request: FastifyRequest, reply: FastifyReply) => {
  try {
    await request.jwtVerify();
  } catch (err) {
    reply.status(401).send({ error: 'Unauthorized', message: 'Invalid or missing token' });
  }
};

declare module 'fastify' {
  interface FastifyRequest {
    jwtVerify(): Promise<void>;
  }
}

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string }; // user_id
    user: { id: string };
  }
}
