describe('My Test', () => {
    it('Visits my site', () => {
      cy.visit('http://localhost:3000')
      cy.contains('Welcome')  
    })
  })
  