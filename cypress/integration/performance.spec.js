describe('Website Performance and Loading Tests', () => {
  beforeEach(() => {
    cy.visit('index.html');
  });

  it('should load main page within acceptable time', () => {
    cy.window().then((win) => {
      const timing = win.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      expect(loadTime).to.be.lessThan(15000); // 15 seconds threshold for local development
    });
  });

  it('should lazy load images in resources section', () => {
    cy.get('.resources img').each(($img) => {
      cy.wrap($img).should('have.attr', 'loading', 'lazy');
    });
  });

  it('should have CSS and JS files loaded', () => {
    cy.request('style.css').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.length).to.be.greaterThan(1000); // Basic size check
    });
    cy.request('script.js').then((response) => {
      expect(response.status).to.eq(200);
      expect(response.body.length).to.be.greaterThan(1000);
    });
  });

  it('should have lazy loading on images where applicable', () => {
    cy.get('img[loading="lazy"]').should('exist');
  });
});
