# Footer Component

A modern, responsive footer component for the PropIE real estate platform built with React, TypeScript, and Tailwind CSS.

## Features

- **Responsive Design**: Optimized for all screen sizes with adaptive grid layouts
- **Dark Theme**: Gradient background from slate-800 to slate-900
- **Accessibility**: Full keyboard navigation and screen reader support
- **Micro-interactions**: Subtle hover animations and focus states
- **Mobile Newsletter**: Newsletter subscription form that appears only on mobile
- **Social Links**: Integrated social media icons with proper aria labels
- **2026 Design Principles**: Clean spacing, fluid typography, and modern aesthetics

## Component Structure

```
Footer/
├── Footer.tsx          # Main footer component
├── FooterColumn.tsx    # Column component for navigation sections
├── FooterLink.tsx      # Individual link component with hover states
├── SocialLinks.tsx     # Social media links component
├── types.ts           # TypeScript interfaces
├── Footer.module.css  # Additional CSS animations
├── index.ts           # Component exports
└── __tests__/         # Unit tests
```

## Usage

```tsx
import Footer from '@/components/layout/Footer';

function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">
        {/* Your content */}
      </main>
      <Footer />
    </div>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| className | string | '' | Additional CSS classes to apply to the footer |

## Customization

### Modifying Footer Links

Edit the `footerColumns` array in `Footer.tsx`:

```tsx
const footerColumns: FooterColumn[] = [
  {
    title: 'Solutions',
    links: [
      { label: 'Home Buyers', href: '/buyers', ariaLabel: 'Solutions for home buyers' },
      // Add or modify links here
    ],
  },
  // Add more columns
];
```

### Changing Social Links

Edit the `socialLinks` array in `Footer.tsx`:

```tsx
const socialLinks: SocialLink[] = [
  { name: 'Facebook', href: 'https://facebook.com/propie', icon: 'Facebook', ariaLabel: 'Follow us on Facebook' },
  // Add or modify social links
];
```

### Styling

The component uses Tailwind CSS for styling. To customize:

1. Modify Tailwind classes directly in the components
2. Add custom CSS in `Footer.module.css`
3. Override styles using the `className` prop

## Accessibility

- Semantic HTML5 structure with `<footer>`, `<nav>`, and proper heading hierarchy
- ARIA labels for all interactive elements
- Keyboard navigation support with visible focus indicators
- Skip links compatibility
- Screen reader friendly navigation structure

## Performance

- Lazy loading with Intersection Observer for appear animations
- Optimized hover states using CSS transforms
- Minimal JavaScript for interactions
- Component-based architecture for code splitting

## Testing

Run tests with:

```bash
npm test Footer.test.tsx
```

The component includes comprehensive unit tests covering:
- Rendering of all sections
- Accessibility attributes
- Responsive behavior
- Custom className support

## Browser Support

- Chrome/Edge (latest 2 versions)
- Firefox (latest 2 versions)
- Safari (latest 2 versions)
- iOS Safari (latest 2 versions)
- Chrome for Android (latest)

## Future Enhancements

- [ ] Add language selector for internationalization
- [ ] Implement dark/light mode toggle
- [ ] Add animation preferences based on `prefers-reduced-motion`
- [ ] Create variants for different page types
- [ ] Add A/B testing support for footer layouts