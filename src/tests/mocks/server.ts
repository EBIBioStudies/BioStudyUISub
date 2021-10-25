import { rest } from 'msw';
import { setupServer } from 'msw/node';
import { OK } from 'http-status-codes';

// This configures a request mocking server with the given request handlers.
const server = setupServer(
  rest.post(`/api/auth/activate/:key`, (_, res, ctx) => {
    return res(ctx.status(OK));
  })
);

export { server, rest };
