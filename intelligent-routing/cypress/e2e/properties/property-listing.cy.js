/// <reference types="cypress" />
describe('Property Listing Page', () => {
    beforeEach(() => {
        // Start from a clean slate for each test
        cy.clearLocalStorage();
        cy.clearCookies();
        // Visit the properties page
        cy.visit('/properties');
        // Intercept API calls for property data
        cy.intercept('GET', '**/api/properties').as('getProperties');
    });
    it('should display property listings', () => {
        // Wait for properties to load
        cy.wait('@getProperties');
        // Check that property cards are visible
        cy.get('[data-testid="property-card"]').should('be.visible');
        cy.get('[data-testid="property-card"]').should('have.length.greaterThan', 0);
        // Check property card contents
        cy.get('[data-testid="property-card"]').first().within(() => {
            cy.get('[data-testid="property-title"]').should('be.visible');
            cy.get('[data-testid="property-price"]').should('be.visible');
            cy.get('[data-testid="property-details"]').should('be.visible');
            cy.get('[data-testid="property-image"]').should('be.visible');
        });
    });
    it('should filter properties by type', () => {
        // Wait for properties to load
        cy.wait('@getProperties');
        // Click on filter for houses
        cy.get('[data-testid="filter-house"]').click();
        // Intercept filtered API call
        cy.intercept('GET', '**/api/properties?*type=house*').as('getFilteredProperties');
        // Wait for filtered properties to load
        cy.wait('@getFilteredProperties');
        // Check that only houses are displayed
        cy.get('[data-testid="property-card"]').each(($card) => {
            cy.wrap($card).find('[data-testid="property-type"]').should('contain', 'House');
        });
    });
    it('should filter properties by price range', () => {
        // Wait for properties to load
        cy.wait('@getProperties');
        // Set price filter if it exists
        cy.get('body').then(($body) => {
            if ($body.find('[data-testid="price-min"]').length) {
                cy.get('[data-testid="price-min"]').clear().type('200000');
                cy.get('[data-testid="price-max"]').clear().type('350000');
                // Apply filter
                cy.get('[data-testid="apply-filters"]').click();
                // Intercept filtered API call
                cy.intercept('GET', '**/api/properties?*minPrice=200000&maxPrice=350000*').as('getPriceFilteredProperties');
                // Wait for filtered properties to load
                cy.wait('@getPriceFilteredProperties');
                // Check that displayed properties are within price range
                cy.get('[data-testid="property-card"]').each(($card) => {
                    cy.wrap($card).find('[data-testid="property-price"]').invoke('text').then((text) => {
                        // Extract number from price text (e.g. "€250,000" -> 250000)
                        const price = parseInt(text.replace(/[^0-9]/g, ''));
                        expect(price).to.be.within(200000, 350000);
                    });
                });
            }
        });
    });
    it('should navigate to property detail page when clicking a property', () => {
        // Wait for properties to load
        cy.wait('@getProperties');
        // Click on the first property card
        cy.get('[data-testid="property-card"]').first().click();
        // Expect to be redirected to property detail page
        cy.url().should('include', '/properties/');
        // Check that property detail components are visible
        cy.get('[data-testid="property-detail"]').should('be.visible');
        cy.get('[data-testid="property-title"]').should('be.visible');
        cy.get('[data-testid="property-gallery"]').should('be.visible');
        cy.get('[data-testid="property-description"]').should('be.visible');
        cy.get('[data-testid="property-features"]').should('be.visible');
    });
    it('should display empty state when no properties match filters', () => {
        // Wait for properties to load
        cy.wait('@getProperties');
        // Set impossible filter combination
        cy.get('body').then(($body) => {
            if ($body.find('[data-testid="bedrooms-min"]').length) {
                cy.get('[data-testid="bedrooms-min"]').clear().type('10');
                cy.get('[data-testid="price-max"]').clear().type('100000');
                // Apply filter
                cy.get('[data-testid="apply-filters"]').click();
                // Check that empty state is displayed
                cy.get('[data-testid="no-results"]').should('be.visible');
                cy.get('[data-testid="no-results"]').should('contain', 'No properties found');
            }
        });
    });
    it('should maintain accessibility standards', () => {
        // Check accessibility after properties load
        cy.wait('@getProperties');
        cy.injectAxe();
        cy.checkA11y();
    });
    it('should support pagination if available', () => {
        // Wait for properties to load
        cy.wait('@getProperties');
        // Check for pagination elements
        cy.get('body').then(($body) => {
            if ($body.find('[data-testid="pagination"]').length) {
                // Click on the next page button
                cy.get('[data-testid="next-page"]').click();
                // Intercept next page API call
                cy.intercept('GET', '**/api/properties?*page=2*').as('getNextPage');
                // Wait for next page to load
                cy.wait('@getNextPage');
                // Check that page 2 is now active
                cy.get('[data-testid="page-2"]').should('have.class', 'active');
                // Properties should be different on page 2
                cy.get('[data-testid="property-card"]').should('be.visible');
            }
        });
    });
});
