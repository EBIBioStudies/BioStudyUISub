import { Cookie } from 'ng2-cookies/ng2-cookies';

const COOKIE_NAME = 'BioStudiesToken';
const COOKIE_PATH = '/';

const loginCommand = () => {
  const apiUrl = Cypress.config('apiUrl');
  const user = {
    login: Cypress.env('TEST_USERNAME'),
    password: Cypress.env('TEST_PASSWORD')
  };

  cy.request({
    url: `${apiUrl}/auth/signin`,
    method: 'POST',
    body: user
  })
  .its('body')
  .then((body) => {
    const { sessid } = body;

    Cookie.set(COOKIE_NAME, sessid, 365, COOKIE_PATH);
  })
};

export default loginCommand;
