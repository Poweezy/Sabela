describe('Accessibility Focus Indicators', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.injectAxe();
  });

  it('should have proper focus indicators on contact form', () => {
    // Navigate to contact section
    cy.scrollTo('bottom');
    
    // Tab to contact form inputs
    cy.get('input[name="name"]').focus();
    cy.get('input[name="name"]').should('have.css', 'outline', '2px solid #10b981'); // Assuming green outline from changes
    
    cy.tab(); // Next input
    cy.get('input[name="email"]').should('have.css', 'outline', '2px solid #10b981');
    
    cy.tab(); // Textarea
    cy.get('textarea[name="message"]').should('have.css', 'outline', '2px solid #10b981');
    
    cy.tab(); // Submit button
    cy.get('button[type="submit"]').should('have.css', 'outline', '2px solid #10b981');
  });

  it('should have proper focus indicators on newsletter form', () => {
    // Navigate to newsletter section
    cy.get('#newsletterForm').scrollIntoView();
    
    // Tab to newsletter input
    cy.get('#newsletterEmail').focus();
    cy.get('#newsletterEmail').should('have.css', 'outline', '2px solid #10b981');
    
    cy.tab(); // Submit button
    cy.get('button[type="submit"]').should('have.css', 'outline', '2px solid #10b981');
  });

  it('should have proper focus indicators on navigation links', () => {
    // Test nav links
    cy.get('.nav-link').first().focus();
    cy.get('.nav-link').first().should('have.css', 'outline', '2px solid #10b981');
    
    cy.tab();
    cy.get('.nav-link').eq(1).should('have.css', 'outline', '2px solid #10b981');
  });

  it('should have proper focus indicators on buttons throughout the site', () => {
    // Hero buttons
    cy.get('#discover-mission-btn').focus();
    cy.get('#discover-mission-btn').should('have.css', 'outline', '2px solid #10b981');
    
    cy.tab();
    cy.get('#take-action-btn').should('have.css', 'outline', '2px solid #10b981');
    
    // Donate button
    cy.get('#donate-now-btn-header').focus();
    cy.get('#donate-now-btn-header').should('have.css', 'outline', '2px solid #10b981');
    
    // Volunteer form
    cy.get('#volunteerForm input[name="name"]').focus();
    cy.get('#volunteerForm input[name="name"]').should('have.css', 'outline', '2px solid #10b981');
    
    // Resource search
    cy.get('#resourceSearch').focus();
    cy.get('#resourceSearch').should('have.css', 'outline', '2px solid #10b981');
  });

  it('should pass WCAG AA accessibility standards', () => {
    cy.checkA11y();
  });

  it('should have no visual regressions in form styling', () => {
    // Check contact form styling
    cy.get('.contact-form input').should('have.css', 'border', '1px solid #d1d5db');
    cy.get('.contact-form textarea').should('have.css', 'border', '1px solid #d1d5db');
    
    // Check newsletter form
    cy.get('#newsletterEmail').should('have.css', 'border', '1px solid #d1d5db');
    
    // Ensure focus doesn't change other styles unexpectedly
    cy.get('.contact-form input:focus').should('not.have.css', 'border-color', 'transparent');
  });
});
