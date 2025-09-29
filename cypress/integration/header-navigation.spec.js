describe('Header Navigation Responsiveness and Dropdown Interactions', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('should display nav links properly on large screens', () => {
    cy.viewport(1280, 800);
    cy.get('.nav-links').should('be.visible');
    cy.get('.nav-link').should('have.length.greaterThan', 0);
  });

  it('should wrap nav links and adjust padding on medium screens', () => {
    cy.viewport(1024, 768);
    cy.get('.nav-links').should('have.css', 'flex-wrap', 'wrap');
    cy.get('.nav-link').each(($el) => {
      cy.wrap($el).should('have.css', 'padding').and('match', /0\.75rem/);
    });
  });

  it('should reduce nav link padding and font size on smaller screens', () => {
    cy.viewport(768, 600);
    cy.get('.nav-link').each(($el) => {
      cy.wrap($el).should('have.css', 'padding').and('match', /0\.6rem/);
      cy.wrap($el).should('have.css', 'font-size').and('match', /0\.85rem/);
    });
  });

  it('should further reduce nav link padding and font size on mobile screens', () => {
    cy.viewport(480, 800);
    cy.get('.nav-link').each(($el) => {
      cy.wrap($el).should('have.css', 'padding').and('match', /0\.5rem/);
      cy.wrap($el).should('have.css', 'font-size').and('match', /0\.8rem/);
    });
  });

  it('should show dropdown menu on nav item hover', () => {
    cy.get('.nav-item').first().trigger('mouseover');
    cy.get('.dropdown').should('be.visible');
  });

  it('should hide dropdown menu when not hovered', () => {
    cy.get('.nav-item').first().trigger('mouseout');
    cy.get('.dropdown').should('not.be.visible');
  });

  it('should toggle mobile menu on button click', () => {
    cy.viewport(375, 667);
    cy.get('.mobile-menu-btn').click();
    cy.get('.nav-links').should('have.class', 'active');
    cy.get('.mobile-menu-btn').click();
    cy.get('.nav-links').should('not.have.class', 'active');
  });
});
