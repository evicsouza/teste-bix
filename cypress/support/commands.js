Cypress.Commands.add('login', (email, password) => {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').type(email)
    cy.get('[data-cy=password-input]').type(password)
    cy.get('[data-cy=login-button]').click()
  })
  
  Cypress.Commands.add('logout', () => {
    cy.get('[data-cy=logout-button]').click()
  })
  
  Cypress.Commands.add('addProductToCart', (productId) => {
    cy.visit(`/products/${productId}`)
    cy.get('[data-cy=add-to-cart]').click()
  })
  