/**
 * Type definitions for Jest's expect function
 * This extends the @types/jest declarations to include all the matchers we use
 */

import '@types/jest';

declare global {
  namespace jest {
    interface Matchers<R> {
      toBeDefined(): R;
      toBe(expected: any): R;
      toBeNull(): R;
      toBeGreaterThan(expected: number): R;
      toEqual(expected: any): R;
      toHaveLength(expected: number): R;
      toContain(expected: any): R;
      toBeCalledWith(...args: any[]): R;
      toBeCalled(): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toThrow(expected?: any): R;
      toThrowError(expected?: any): R;
      toBeTruthy(): R;
      toBeFalsy(): R;
      toBeUndefined(): R;
      toMatch(expected: string | RegExp): R;
      toMatchObject(expected: object): R;
      toStrictEqual(expected: any): R;
      toHaveProperty(keyPath: string, value?: any): R;
      toBeInstanceOf(expected: any): R;
      toBeCloseTo(expected: number, precision?: number): R;
    }
  }
}

declare module 'expect' {
  interface Assertion {
    toBeDefined(): void;
    toBe(expected: any): void;
    toBeNull(): void;
    toBeGreaterThan(expected: number): void;
    toEqual(expected: any): void;
    toHaveLength(expected: number): void;
    toContain(expected: any): void;
    toBeCalledWith(...args: any[]): void;
    toBeCalled(): void;
    toHaveBeenCalled(): void;
    toHaveBeenCalledWith(...args: any[]): void;
    toThrow(expected?: any): void;
    toThrowError(expected?: any): void;
    toBeTruthy(): void;
    toBeFalsy(): void;
    toBeUndefined(): void;
    toMatch(expected: string | RegExp): void;
    toMatchObject(expected: object): void;
    toStrictEqual(expected: any): void;
    toHaveProperty(keyPath: string, value?: any): void;
    toBeInstanceOf(expected: any): void;
    toBeCloseTo(expected: number, precision?: number): void;
    
    // DOM-specific assertions
    toBeInTheDocument(): void;
    toHaveTextContent(text: string | RegExp): void;
    toBeVisible(): void;
    toBeDisabled(): void;
    toBeEnabled(): void;
    toHaveAttribute(attr: string, value?: string | RegExp): void;
    toHaveClass(className: string | string[]): void;
    toHaveFocus(): void;
    toHaveStyle(css: Record<string, any>): void;
    toHaveValue(value: string | string[] | number | null): void;
    toBeEmpty(): void;
    toBeInvalid(): void;
    toBeRequired(): void;
    toBeValid(): void;
    toContainElement(element: Element | null): void;
    toContainHTML(htmlText: string): void;
  }
}

// Export an empty object to make this a module
export {};