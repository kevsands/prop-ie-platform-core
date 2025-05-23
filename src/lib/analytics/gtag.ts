export const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || ''

// Initialize Google Analytics
export const pageview = (url: string) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('config', GA_MEASUREMENT_ID, {
      page_path: url})
  }
}

// Track custom events
export const event = ({
  action,
  category,
  label,
  value}: {
  action: string
  category: string
  label?: string
  value?: number
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', action, {
      event_category: category,
      event_label: label,
      value: value})
  }
}

// E-commerce tracking
export const trackPurchase = ({
  transactionId,
  value,
  currency = 'EUR',
  items}: {
  transactionId: string
  value: number
  currency?: string
  items: Array<{
    id: string
    name: string
    category?: string
    price: number
    quantity?: number
  }>
}) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'purchase', {
      transaction_id: transactionId,
      value: value,
      currency: currency,
      items: items})
  }
}

// User properties
export const setUserProperties = (properties: Record<string, any>) => {
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('set', 'user_properties', properties)
  }
}

// Track form submissions
export const trackFormSubmission = (formName: string, formData?: Record<string, any>) => {
  event({
    action: 'form_submit',
    category: 'engagement',
    label: formName})

  if (formData) {
    // Track additional form data as custom dimensions
    Object.entries(formData).forEach(([keyvalue]) => {
      event({
        action: `form_field_${key}`,
        category: 'form_data',
        label: String(value)})
    })
  }
}

// Track search
export const trackSearch = (searchTerm: string, resultsCount?: number) => {
  event({
    action: 'search',
    category: 'engagement',
    label: searchTerm,
    value: resultsCount})
}

// Track property views
export const trackPropertyView = (propertyId: string, propertyName: string, price?: number) => {
  event({
    action: 'view_item',
    category: 'property',
    label: propertyName,
    value: price})

  // Also track as e-commerce view_item event
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', 'view_item', {
      currency: 'EUR',
      value: price,
      items: [
        {
          item_id: propertyId,
          item_name: propertyName,
          price: price,
          quantity: 1}]})
  }
}

// Track user journey milestones
export const trackMilestone = (milestone: string, properties?: Record<string, any>) => {
  event({
    action: 'milestone_reached',
    category: 'user_journey',
    label: milestone})

  if (properties) {
    Object.entries(properties).forEach(([keyvalue]) => {
      event({
        action: `milestone_${milestone}_${key}`,
        category: 'milestone_properties',
        label: String(value)})
    })
  }
}

// A/B Testing
export const trackExperiment = (experimentId: string, variant: string) => {
  event({
    action: 'experiment_view',
    category: 'ab_testing',
    label: `${experimentId}:${variant}`})
}

// Performance tracking
export const trackWebVitals = ({
  name,
  value,
  rating}: {
  name: string
  value: number
  rating: 'good' | 'needs-improvement' | 'poor'
}) => {
  event({
    action: name,
    category: 'Web Vitals',
    label: rating,
    value: Math.round(name === 'CLS' ? value * 1000 : value)})
}