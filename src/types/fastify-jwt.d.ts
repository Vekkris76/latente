import '@fastify/jwt';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    payload: { id: string }; // lo que firmamos en jwtSign
    user: { id: string };    // lo que tendremos en request.user tras jwtVerify
  }
}

declare module 'fastify' {
  interface FastifyRequest {
    user: { id: string };
  }
}