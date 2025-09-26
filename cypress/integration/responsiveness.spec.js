describe('Website Mobile Responsiveness and UI Tests', () => {
  beforeEach(() => {
    cy.visit('index.html');
  });

  it('should display the header and navigation correctly on desktop', () => {
    cy.viewport(1280, 800);
    cy.get('header').should('be.visible');
    cy.get('nav').should('be.visible');
    cy.get('.nav-link').should('have.length.greaterThan', 0);
  });

  it('should display the mobile menu button on small screens', () => {
    cy.viewport(375, 667); // iPhone 6/7/8 size
    cy.get('.mobile-menu-btn').should('be.visible');
  });

  it('should not have horizontal scroll on mobile', () => {
    cy.viewport(375, 667);
    cy.document().then((doc) => {
      const scrollWidth = doc.documentElement.scrollWidth;
      const clientWidth = doc.documentElement.clientWidth;
      expect(scrollWidth).to.be.lte(clientWidth);
    });
  });

  it('should have touch-friendly buttons on mobile', () => {
    cy.viewport(375, 667);
    cy.get('.btn').each(($btn) => {
      cy.wrap($btn).should('have.css', 'min-height').and('match', /44px/);
    });
  });

  it('should display all main sections on mobile', () => {
    cy.viewport(375, 667);
    cy.get('section').each(($section) => {
      cy.wrap($section).should('be.visible');
    });
  });

  it('should allow newsletter signup form submission', () => {
    cy.viewport(375, 667);
    cy.get('form.newsletter-form').within(() => {
      cy.get('input[name="email"]').type('test@example.com');
      cy.get('button[type="submit"]').click();
    });
    cy.get('.form-message').should('be.visible');
  });

  it('should load images efficiently', () => {
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'loading', 'lazy');
    });
  });
});
