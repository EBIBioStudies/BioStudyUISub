import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { OK } from 'http-status-codes';
import { userProfile } from './fixtures/user-profile';
import { collections } from './fixtures/collections';

// This configures a request mocking server with the given request handlers.
const server = setupServer(
  rest.post('/api/auth/register', (_, res, ctx) => res(ctx.status(OK))),
  rest.post('/api/auth/login', (_, res, ctx) => res(ctx.status(OK), ctx.json(userProfile))),
  rest.post('/api/auth/activate/:key', (_, res, ctx) => res(ctx.status(OK))),
  rest.get('/api/auth/profile', (_, res, ctx) => res(ctx.status(OK), ctx.json(userProfile))),
  rest.get('/api/collections', (_, res, ctx) => res(ctx.status(OK), ctx.json(collections)))
);

export { server, rest };
