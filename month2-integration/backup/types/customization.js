// src/types/customization.ts
// Combines your existing helper functions with improved type definitions
// Your existing helper functions preserved exactly as they were
export const customizationHelpers = {
    // Safe getter for selectedOptions with proper type checking
    getSelectedOption: (selectedOptions, key) => {
        if (Array.isArray(selectedOptions)) {
            return selectedOptions.find(option => option.id === key);
        }
        else {
            return selectedOptions[key];
        }
    },
    // Convert array of options to a record keyed by ID for easier access
    optionsToRecord: (options) => {
        return options.reduce((acc, option) => {
            acc[option.id] = option;
            return acc;
        }, {});
    },
    // Total up the cost of all selected options
    calculateTotalCost: (selectedOptions) => {
        if (Array.isArray(selectedOptions)) {
            return selectedOptions.reduce((total, option) => total + option.price, 0);
        }
        else {
            return Object.values(selectedOptions).reduce((total, option) => total + option.price, 0);
        }
    }
};
