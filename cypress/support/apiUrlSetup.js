import { format } from 'url';

const hostname = Cypress.env('BACKEND_HOST_NAME');
const port = Cypress.env('BACKEND_PORT');
const protocol = Cypress.env('BACKEND_PROTOCOL');

Cypress.config('apiUrl', format({ hostname, port, protocol }));
