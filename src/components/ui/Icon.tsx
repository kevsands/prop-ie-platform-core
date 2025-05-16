import React, { memo } from 'react';
import type { IconBaseProps } from 'react-icons';
import { ErrorBoundary } from 'react-error-boundary';
import { iconRegistry, isIconRegistered, useIconMetadata } from './IconRegistry';

export interface IconProps extends Omit<IconBaseProps, 'ref'> {
  name: string;
  label?: string;
  fallback?: React.ReactNode;
  testId?: string;
  variant?: 'solid' | 'outline' | 'duotone';
  color?: 'primary' | 'secondary' | 'success' | 'danger' | 'warning' | 'info' | 'light' | 'dark';
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
}

// Icon size mapping
const ICON_SIZES = {
  xs: 12,
  sm: 16,
  md: 20,
  lg: 24,
  xl: 32,
  '2xl': 48,
} as const;

// Icon color mapping
const ICON_COLORS = {
  primary: 'text-[#2B5273]',
  secondary: 'text-gray-600',
  success: 'text-green-600',
  danger: 'text-red-600',
  warning: 'text-yellow-600',
  info: 'text-blue-600',
  light: 'text-gray-400',
  dark: 'text-gray-800',
} as const;

// Icon variant mapping
const ICON_VARIANTS = {
  solid: 'fill-current',
  outline: 'stroke-current fill-none',
  duotone: 'stroke-current fill-current fill-opacity-20',
} as const;

const IconErrorFallback = ({ error }: { error: Error }) => {
  console.error('Icon rendering error:', error);
  return (
    <span 
      className="inline-flex items-center justify-center bg-gray-100 text-gray-400 rounded"
      role="img"
      aria-label="Icon error"
    >
      ⚠️
    </span>
  );
};

const IconComponent = memo<IconProps>(({ 
  name,
  label,
  fallback,
  testId,
  className = '',
  variant = 'solid',
  color = 'primary',
  size = 'md',
  ...props 
}) => {
  if (!isIconRegistered(name)) {
    console.warn(`Icon "${name}" is not registered in the icon registry`);
    return fallback || null;
  }

  const metadata = useIconMetadata(name);
  const IconComponent = iconRegistry[name].component;
  
  const ariaLabel = label || metadata?.name || 'Icon';
  const sizeValue = ICON_SIZES[size];
  const colorClass = ICON_COLORS[color];
  const variantClass = ICON_VARIANTS[variant];
  
  const combinedClassName = [
    'inline-flex items-center justify-center',
    colorClass,
    variantClass,
    className
  ].filter(Boolean).join(' ');

  return (
    <span 
      className={combinedClassName}
      role="img"
      aria-label={ariaLabel}
      data-testid={testId}
    >
      <IconComponent size={sizeValue} {...props} />
    </span>
  );
});

IconComponent.displayName = 'Icon';

export const Icon = (props: IconProps) => (
  <ErrorBoundary FallbackComponent={IconErrorFallback}>
    <IconComponent {...props} />
  </ErrorBoundary>
);

// Export constants for external use
export { ICON_SIZES, ICON_COLORS, ICON_VARIANTS }; 