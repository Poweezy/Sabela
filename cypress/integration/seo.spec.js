describe('SEO and Accessibility Tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000'); // Adjust URL as needed
  });

  it('should have meta description tags for each section', () => {
    cy.get('meta[name="description"]').should('exist');
  });

  it('should have canonical URL', () => {
    cy.get('link[rel="canonical"]').should('exist');
  });

  it('should have structured data JSON-LD script', () => {
    cy.get('script[type="application/ld+json"]').should('exist');
  });

  it('should have alt text for all images', () => {
    cy.get('img').each(($img) => {
      cy.wrap($img).should('have.attr', 'alt').and('not.be.empty');
    });
  });

  it('should have ARIA labels where needed', () => {
    cy.get('[aria-label]').should('exist');
  });

  it('should have focus indicators on interactive elements', () => {
    cy.get('a, button, input, textarea').each(($el) => {
      cy.wrap($el).focus().should('have.css', 'outline-style').and('not.eq', 'none');
    });
  });
});
