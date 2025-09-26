describe('Website Performance and Loading Tests', () => {
  beforeEach(() => {
    cy.visit('file:///c:/Users/nsiba/Desktop/Sabela/index.html');
  });

  it('should load main page within acceptable time', () => {
    cy.window().then((win) => {
      const timing = win.performance.timing;
      const loadTime = timing.loadEventEnd - timing.navigationStart;
      expect(loadTime).to.be.lessThan(3000); // 3 seconds threshold
    });
  });

  it('should lazy load images in resources section', () => {
    cy.get('.resources img').each(($img) => {
      cy.wrap($img).should('have.attr', 'loading', 'lazy');
    });
  });

  it('should have minified CSS and JS files', () => {
    cy.request('style.css').then((response) => {
      expect(response.body.length).to.be.lessThan(50000); // Example size check
      expect(response.body).to.not.include('\n\n'); // Minified check
    });
    cy.request('script.js').then((response) => {
      expect(response.body.length).to.be.lessThan(100000);
      expect(response.body).to.not.include('\n\n');
    });
  });

  it('should convert images to WebP format where applicable', () => {
    cy.get('img').each(($img) => {
      const src = $img.attr('src');
      if (src) {
        expect(src).to.match(/\.webp$/);
      }
    });
  });
});
