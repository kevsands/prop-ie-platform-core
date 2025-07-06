/// <reference types="cypress" />
describe('Buyer - Property Customization Flow', () => {
    beforeEach(() => {
        // Login as a buyer user for all tests in this block
        cy.fixture('users').then((users) => {
            const buyer = users.buyers[0];
            cy.login(buyer.email, buyer.password);
        });
        // Visit the buyer customization page
        cy.visitAuth('/buyer/customization');
        // Intercept API calls for customization data
        cy.intercept('GET', '**/api/customization/options').as('getCustomizationOptions');
    });
    it('should display customization options', () => {
        // Wait for customization options to load
        cy.wait('@getCustomizationOptions');
        // Check that customization options are visible
        cy.get('[data-testid="customization-options"]').should('be.visible');
        // Check for category tabs/sections
        cy.get('[data-testid="customization-category"]').should('have.length.greaterThan', 0);
        // Check for selectable options within first category
        cy.get('[data-testid="customization-category"]').first().click();
        cy.get('[data-testid="customization-option"]').should('be.visible');
        cy.get('[data-testid="customization-option"]').should('have.length.greaterThan', 0);
    });
    it('should allow selecting customization options', () => {
        // Wait for customization options to load
        cy.wait('@getCustomizationOptions');
        // Select an option from the first category
        cy.get('[data-testid="customization-category"]').first().click();
        cy.get('[data-testid="customization-option"]').first().within(() => {
            cy.get('[data-testid="select-option"]').click();
        });
        // Check that option is selected
        cy.get('[data-testid="customization-option"]').first().should('have.class', 'selected');
        // Check that selection is reflected in the summary
        cy.get('[data-testid="customization-summary"]').should('contain', 'Selected');
    });
    it('should update total price when selecting options', () => {
        // Wait for customization options to load
        cy.wait('@getCustomizationOptions');
        // Get initial total price
        cy.get('[data-testid="total-price"]').invoke('text').then((initialPrice) => {
            const initialPriceValue = parseInt(initialPrice.replace(/[^0-9]/g, ''));
            // Select a premium option
            cy.get('[data-testid="customization-category"]').first().click();
            cy.get('[data-testid="customization-option"]').last().within(() => {
                // Get option price
                cy.get('[data-testid="option-price"]').invoke('text').then((optionPrice) => {
                    const optionPriceValue = parseInt(optionPrice.replace(/[^0-9]/g, ''));
                    // Select the option
                    cy.get('[data-testid="select-option"]').click();
                    // Check that total price is updated correctly
                    cy.get('[data-testid="total-price"]').invoke('text').then((updatedPrice) => {
                        const updatedPriceValue = parseInt(updatedPrice.replace(/[^0-9]/g, ''));
                        expect(updatedPriceValue).to.equal(initialPriceValue + optionPriceValue);
                    });
                });
            });
        });
    });
    it('should navigate between customization steps', () => {
        // Wait for customization options to load
        cy.wait('@getCustomizationOptions');
        // Check navigation between categories
        cy.get('[data-testid="customization-category"]').each(($category, index, $list) => {
            // Skip if there's only one category
            if ($list.length > 1 && index < $list.length - 1) {
                // Click on category
                cy.wrap($category).click();
                // Check that category content is visible
                cy.get('[data-testid="category-content"]').should('be.visible');
                // Select an option if available
                cy.get('[data-testid="customization-option"]').first().within(() => {
                    cy.get('[data-testid="select-option"]').click();
                });
                // Navigate to next category if button exists
                cy.get('body').then(($body) => {
                    if ($body.find('[data-testid="next-category"]').length) {
                        cy.get('[data-testid="next-category"]').click();
                    }
                });
            }
        });
    });
    it('should allow saving customization selections', () => {
        // Wait for customization options to load
        cy.wait('@getCustomizationOptions');
        // Make a selection in each category
        cy.get('[data-testid="customization-category"]').each(($category) => {
            cy.wrap($category).click();
            cy.get('[data-testid="customization-option"]').first().within(() => {
                cy.get('[data-testid="select-option"]').click();
            });
        });
        // Intercept save API call
        cy.intercept('POST', '**/api/customization/save').as('saveCustomization');
        // Click save/submit button
        cy.get('[data-testid="save-customization"]').click();
        // Wait for save API call
        cy.wait('@saveCustomization').its('response.statusCode').should('eq', 200);
        // Check for success message
        cy.get('[data-testid="success-message"]').should('be.visible');
        cy.get('[data-testid="success-message"]').should('contain', 'saved');
    });
    it('should display visualization if available', () => {
        // Wait for customization options to load
        cy.wait('@getCustomizationOptions');
        // Check if visualization is available
        cy.get('body').then(($body) => {
            if ($body.find('[data-testid="visualization"]').length) {
                cy.get('[data-testid="visualization"]').should('be.visible');
                // Make a selection that affects visualization
                cy.get('[data-testid="customization-category"]').first().click();
                cy.get('[data-testid="customization-option"]').first().within(() => {
                    cy.get('[data-testid="select-option"]').click();
                });
                // Check that visualization is updated
                cy.get('[data-testid="visualization"]').should('have.attr', 'data-updated', 'true');
            }
        });
    });
    it('should maintain accessibility standards', () => {
        // Wait for customization options to load
        cy.wait('@getCustomizationOptions');
        // Check accessibility
        cy.injectAxe();
        cy.checkA11y();
    });
    it('should allow viewing summary of selections', () => {
        // Wait for customization options to load
        cy.wait('@getCustomizationOptions');
        // Make selections in multiple categories
        cy.get('[data-testid="customization-category"]').each(($category) => {
            cy.wrap($category).click();
            cy.get('[data-testid="customization-option"]').first().within(() => {
                cy.get('[data-testid="select-option"]').click();
            });
        });
        // View summary if summary button exists
        cy.get('body').then(($body) => {
            if ($body.find('[data-testid="view-summary"]').length) {
                cy.get('[data-testid="view-summary"]').click();
                // Check that summary is displayed
                cy.get('[data-testid="customization-summary"]').should('be.visible');
                cy.get('[data-testid="summary-item"]').should('have.length.greaterThan', 0);
            }
        });
    });
});
