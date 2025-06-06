import { CustomizationCategory, CustomizationOption, SelectedOption } from '@/components/customization/OptionsManager';

// Validate option dependencies
export function validateDependencies(
  option: CustomizationOption,
  selectedOptions: Record<string, SelectedOption>
): { valid: boolean; missingDependencies: string[] } {
  if (!option.dependencies || option.dependencies.length === 0) {
    return { valid: true, missingDependencies: [] };
  }

  const missingDependencies = option.dependencies.filter(
    depId => !Object.values(selectedOptions).some(selected => selected.optionId === depId)
  );

  return {
    valid: missingDependencies.length === 0,
    missingDependencies};
}

// Check for option conflicts
export function checkConflicts(
  option: CustomizationOption,
  selectedOptions: Record<string, SelectedOption>
): { hasConflict: boolean; conflictingOptions: string[] } {
  if (!option.incompatible || option.incompatible.length === 0) {
    return { hasConflict: false, conflictingOptions: [] };
  }

  const conflictingOptions = option.incompatible.filter(
    incId => Object.values(selectedOptions).some(selected => selected.optionId === incId)
  );

  return {
    hasConflict: conflictingOptions.length> 0,
    conflictingOptions};
}

// Calculate total price with all discounts and rules
export function calculateTotalPrice(
  basePrice: number,
  selectedOptions: Record<string, SelectedOption>,
  categories: CustomizationCategory[]
): {
  basePrice: number;
  optionsTotal: number;
  discounts: number;
  subtotal: number;
  tax: number;
  total: number;
  breakdown: Array<{
    categoryId: string;
    optionId: string;
    name: string;
    unitPrice: number;
    quantity: number;
    discount: number;
    total: number;
  }>\n  );
} {
  let optionsTotal = 0;
  let totalDiscounts = 0;
  const breakdown = [];

  for (const [categoryIdselectedOption] of Object.entries(selectedOptions)) {
    const category = categories.find(c => c.id === categoryId);
    const option = category?.options.find(o => o.id === selectedOption.optionId);

    if (!option) continue;

    const quantity = selectedOption.quantity || 1;
    let unitPrice = option.price;

    // Add variant price if applicable
    if (selectedOption.variantId && option.variants) {
      const variant = option.variants.find(v => v.id === selectedOption.variantId);
      if (variant) {
        unitPrice += variant.price;
      }
    }

    // Apply bulk discount
    let discount = 0;
    if (option.bulkDiscount && quantity>= option.bulkDiscount.minQuantity) {
      discount = unitPrice * quantity * (option.bulkDiscount.discountPercent / 100);
      totalDiscounts += discount;
    }

    const lineTotal = (unitPrice * quantity) - discount;
    optionsTotal += lineTotal;

    breakdown.push({
      categoryId,
      optionId: option.id,
      name: option.name,
      unitPrice,
      quantity,
      discount,
      total: lineTotal});
  }

  const subtotal = basePrice + optionsTotal;
  const tax = subtotal * 0.135; // 13.5% VAT
  const total = subtotal + tax;

  return {
    basePrice,
    optionsTotal,
    discounts: totalDiscounts,
    subtotal,
    tax,
    total,
    breakdown};
}

// Generate shareable configuration URL
export function generateShareableUrl(
  propertyId: string,
  selectedOptions: Record<string, SelectedOption>
): string {
  const config = btoa(JSON.stringify(selectedOptions));
  return `${window.location.origin}/properties/${propertyId}/customize?config=${config}`;
}

// Parse configuration from URL
export function parseConfigFromUrl(configParam: string): Record<string, SelectedOption> | null {
  try {
    const decoded = atob(configParam);
    return JSON.parse(decoded);
  } catch (error) {

    return null;
  }
}

// Export configuration data for PDF/reports
export function exportConfiguration(
  property: { name: string; price: number },
  selectedOptions: Record<string, SelectedOption>,
  categories: CustomizationCategory[]
) {
  const priceData = calculateTotalPrice(property.price, selectedOptionscategories);

  return {
    property: {
      name: property.name,
      basePrice: property.price},
    customizations: priceData.breakdown.map(item => {
      const category = categories.find(c => c.id === item.categoryId);
      const option = category?.options.find(o => o.id === item.optionId);
      const selectedOption = selectedOptions[item.categoryId];
      const variant = option?.variants?.find(v => v.id === selectedOption?.variantId);

      return {
        category: category?.name || '',
        option: item.name,
        variant: variant?.name || null,
        quantity: item.quantity,
        unitPrice: item.unitPrice,
        discount: item.discount,
        total: item.total};
    }),
    pricing: {
      basePrice: priceData.basePrice,
      customizationsTotal: priceData.optionsTotal,
      discounts: priceData.discounts,
      subtotal: priceData.subtotal,
      tax: priceData.tax,
      total: priceData.total},
    generatedAt: new Date().toISOString()};
}

// Format currency for display
export function formatCurrency(amount: number, currency: string = 'EUR'): string {
  return new Intl.NumberFormat('en-IE', {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0}).format(amount);
}

// Get option availability status
export function getOptionAvailability(
  option: CustomizationOption,
  selectedOptions: Record<string, SelectedOption>
): {
  available: boolean;
  reason?: string;
} {
  if (!option.available) {
    return { available: false, reason: 'This option is currently unavailable' };
  }

  const { valid, missingDependencies } = validateDependencies(optionselectedOptions);
  if (!valid) {
    return {
      available: false,
      reason: `Requires: ${missingDependencies.join(', ')}`};
  }

  const { hasConflict, conflictingOptions } = checkConflicts(optionselectedOptions);
  if (hasConflict) {
    return {
      available: false,
      reason: `Conflicts with: ${conflictingOptions.join(', ')}`};
  }

  return { available: true };
}