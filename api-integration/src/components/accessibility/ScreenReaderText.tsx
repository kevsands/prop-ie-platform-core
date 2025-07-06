'use client';

import React from 'react';

interface ScreenReaderTextProps {
  /** Content only visible to screen readers */
  children: React.ReactNode;
  /**
   * Optional ID attribute for the element,
   * useful when you need to reference this element
   */
  id?: string;
  /**
   * Element to render (defaults to span)
   */
  as?: keyof JSX.IntrinsicElements;
}

/**
 * ScreenReaderText component renders content that is only visible to screen readers.
 * 
 * This component creates visually hidden text that remains accessible to assistive
 * technologies, providing additional context when visual cues alone are insufficient.
 * 
 * @example
 * // Basic usage
 * <ScreenReaderText>This text is only announced by screen readers</ScreenReaderText>
 * 
 * @example
 * // With a button that has only an icon
 * <button aria-label="Close">
 *   <IconX />
 *   <ScreenReaderText>Close dialog</ScreenReaderText>
 * </button>
 */
export const ScreenReaderText: React.FC<ScreenReaderTextProps> = ({
  children,
  id,
  as: Element = 'span',
}) => {
  return (
    <Element
      id={id}
      className="sr-only"
      // Additional styles can be applied directly if needed for edge cases
      style={{
        position: 'absolute',
        width: '1px',
        height: '1px',
        padding: '0',
        margin: '-1px',
        overflow: 'hidden',
        clip: 'rect(0, 0, 0, 0)',
        whiteSpace: 'nowrap',
        borderWidth: '0',
      }}
    >
      {children}
    </Element>
  );
};

/**
 * LiveRegion component creates an ARIA live region that announces content changes
 * to screen reader users.
 * 
 * @example
 * // For important updates that should interrupt the user
 * <LiveRegion politeness="assertive">
 *   Form submitted successfully!
 * </LiveRegion>
 * 
 * @example
 * // For non-critical updates
 * <LiveRegion>
 *   3 new messages received
 * </LiveRegion>
 */
interface LiveRegionProps {
  /** Content to be announced by screen readers */
  children: React.ReactNode;
  /** 
   * ARIA live politeness setting
   * - polite: Wait until user is idle before announcing (default)
   * - assertive: Interrupt user immediately with announcement
   */
  politeness?: 'polite' | 'assertive';
  /** Whether content is relevant despite being identical to previous content */
  atomic?: boolean;
  /** Additional CSS classes */
  className?: string;
}

export const LiveRegion: React.FC<LiveRegionProps> = ({
  children,
  politeness = 'polite',
  atomic = false,
  className,
}) => {
  return (
    <div
      className={`sr-only ${className || ''}`}
      aria-live={politeness}
      aria-atomic={atomic}
      role={politeness === 'assertive' ? 'alert' : 'status'}
    >
      {children}
    </div>
  );
};

export default ScreenReaderText;