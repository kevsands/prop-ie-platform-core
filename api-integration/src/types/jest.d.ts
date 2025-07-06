/**
 * Extended type definitions for Jest to fix assertion errors
 * This file combines declarations for both Jest and Testing Library assertions
 */

/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

declare global {
  namespace jest {
    interface Matchers<R> {
      // DOM Testing Library
      toBeInTheDocument(): R;
      toHaveTextContent(text: string | RegExp): R;
      toBeVisible(): R;
      toBeDisabled(): R;
      toBeEnabled(): R;
      toHaveAttribute(attr: string, value?: string | RegExp): R;
      toHaveClass(className: string | string[]): R;
      toHaveFocus(): R;
      toHaveStyle(css: Record<string, any>): R;
      toHaveValue(value: string | string[] | number | null): R;
      toBeEmpty(): R;
      toBeInvalid(): R;
      toBeRequired(): R;
      toBeValid(): R;
      toContainElement(element: Element | null): R;
      toContainHTML(htmlText: string): R;
      toHaveAccessibleDescription(description?: string | RegExp): R;
      toHaveAccessibleName(name?: string | RegExp): R;
      toHaveDisplayValue(value: string | RegExp | (string | RegExp)[]): R;
      toHaveErrorMessage(message?: string | RegExp): R;
      toHaveFormValues(expectedValues: Record<string, any>): R;
      toBeChecked(): R;
      toBePartiallyChecked(): R;
      
      // Standard Jest matchers
      toBe(expected: any): R;
      toBeCloseTo(expected: number, precision?: number): R;
      toBeDefined(): R;
      toBeFalsy(): R;
      toBeGreaterThan(expected: number): R;
      toBeGreaterThanOrEqual(expected: number): R;
      toBeInstanceOf(expected: Function): R;
      toBeLessThan(expected: number): R;
      toBeLessThanOrEqual(expected: number): R;
      toBeNull(): R;
      toBeTruthy(): R;
      toBeUndefined(): R;
      toContain(expected: any): R;
      toEqual(expected: any): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledTimes(expected: number): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toHaveBeenLastCalledWith(...args: any[]): R;
      toHaveBeenNthCalledWith(n: number, ...args: any[]): R;
      toHaveLength(expected: number): R;
      toHaveProperty(property: string, value?: any): R;
      toMatch(expected: string | RegExp): R;
      toMatchObject(expected: object | object[]): R;
      toStrictEqual(expected: any): R;
      toThrow(error?: string | Error | RegExp): R;
      toThrowError(error?: string | Error | RegExp): R;
      
      // Alias matchers
      toBeCalled(): R;
      toBeCalledTimes(expected: number): R;
      toBeCalledWith(...args: any[]): R;
    }

    // Add expect static methods
    interface ExpectStatic {
      // Creation of special matchers
      anything(): any;
      any(constructor: Function): any;
      arrayContaining(array: Array<any>): any;
      objectContaining(object: object): any;
      stringContaining(string: string): any;
      stringMatching(string: string | RegExp): any;
      
      // Extending Jest
      addSnapshotSerializer(serializer: any): void;
      assertions(count: number): void;
      extend(matchers: object): void;
      hasAssertions(): void;
      
      // Module mocking
      restoreAllMocks(): void;
      resetAllMocks(): void;
      clearAllMocks(): void;
      spyOn(object: any, method: string): jest.SpyInstance;
    }
  }
}

// For Chai assertions in Cypress
declare global {
  namespace Chai {
    interface Assertion {
      // Standard Jest matchers for Chai
      toBe(expected: any): Assertion;
      toBeCloseTo(expected: number, precision?: number): Assertion;
      toBeDefined(): Assertion;
      toBeFalsy(): Assertion;
      toBeGreaterThan(expected: number): Assertion;
      toBeGreaterThanOrEqual(expected: number): Assertion;
      toBeInstanceOf(expected: Function): Assertion;
      toBeLessThan(expected: number): Assertion;
      toBeLessThanOrEqual(expected: number): Assertion;
      toBeNull(): Assertion;
      toBeTruthy(): Assertion;
      toBeUndefined(): Assertion;
      toContain(expected: any): Assertion;
      toEqual(expected: any): Assertion;
      toHaveBeenCalled(): Assertion;
      toHaveBeenCalledTimes(expected: number): Assertion;
      toHaveBeenCalledWith(...args: any[]): Assertion;
      toHaveLength(expected: number): Assertion;
      toHaveProperty(property: string, value?: any): Assertion;
      toMatch(expected: string | RegExp): Assertion;
      toMatchObject(expected: object): Assertion;
      toStrictEqual(expected: any): Assertion;
      toThrow(error?: string | Error | RegExp): Assertion;
    }
  }
}

export {};