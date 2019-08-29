describe('Login', () => {
  it('should fail with invalid credentials', () => {
    cy.visit('/');

    cy.get('#login').type('pep@ebi.ac.uk');
    cy.get('#password').type('123456');
    cy.get('form').submit();
    cy.get('.alert-danger')
      .should('contain', 'Invalid user name or password. Please check the fields below and try again.')
  });

  it('should login user with valid credentials', () => {
    const username = Cypress.env('TEST_USERNAME');
    const password = Cypress.env('TEST_PASSWORD');

    cy.get('#login')
      .clear()
      .type(username)
      .should('have.value', username);

    cy.get('#password')
      .clear()
      .type(password)
      .should('have.value', password);

    cy.get('form')
      .submit();
  });
});
