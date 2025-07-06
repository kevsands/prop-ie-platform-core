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
      toBeChecked(): R;
      toBePartiallyChecked(): R;
      toHaveDescription(text: string | RegExp): R;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
      toContainElement(element: HTMLElement | null): R;
      toContainHTML(htmlText: string): R;
      toHaveFormValues(expectedValues: Record<string, any>): R;
      toHaveRole(role: string, options?: { hidden?: boolean }): R;

      // Jest Extended
      toBeEmpty(): R;
      toBeEmptyDOMElement(): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
      toBeOneOf(arr: any[]): R;
      toBeNil(): R;
      toBeDefined(): R;
      toBeTruthy(): R;
      toBeFalsy(): R;
      toBeObject(): R;
      toContainKey(key: string): R;
      toContainKeys(keys: string[]): R;
      toContainAllKeys(keys: string[]): R;
      toContainAnyKeys(keys: string[]): R;
      toContainValue(value: any): R;
      toContainValues(values: any[]): R;
      toContainAllValues(values: any[]): R;
      toContainAnyValues(values: any[]): R;
      toContainEntry(entry: [string, any]): R;
      toContainEntries(entries: [string, any][]): R;
      toContainAllEntries(entries: [string, any][]): R;
      toContainAnyEntries(entries: [string, any][]): R;
      toBeExtensible(): R;
      toBeFrozen(): R;
      toBeSealed(): R;
      toThrow(error?: string | RegExp | Error): R;
      toThrowError(error?: string | RegExp | Error): R;
      toBe(expected: any): R;
      toBeGreaterThan(expected: number | bigint): R;
      toBeGreaterThanOrEqual(expected: number | bigint): R;
      toBeLessThan(expected: number | bigint): R;
      toBeLessThanOrEqual(expected: number | bigint): R;
      toBeInstanceOf(expected: any): R;
      toMatch(expected: string | RegExp): R;
      toMatchObject(expected: any): R;
      toStrictEqual(expected: any): R;
      toContain(expected: any): R;
      toContainEqual(expected: any): R;
      toEqual(expected: any): R;
      toHaveLength(expected: number): R;
      toHaveProperty(propertyPath: string, value?: any): R;
      toBeCloseTo(expected: number, precision?: number): R;
      toHaveBeenCalled(): R;
      toHaveBeenCalledTimes(expected: number): R;
      toHaveBeenCalledWith(...args: any[]): R;
      toHaveBeenLastCalledWith(...args: any[]): R;
      toHaveBeenNthCalledWith(n: number, ...args: any[]): R;
      toHaveReturned(): R;
      toHaveReturnedTimes(expected: number): R;
      toHaveReturnedWith(expected: any): R;
      toHaveLastReturnedWith(expected: any): R;
      toHaveNthReturnedWith(n: number, expected: any): R;
      toHaveStatus(code: number): R;
      toHaveHeaders(headers: Record<string, string>): R;
      toBeNull(): R;
      toBeUndefined(): R;
      toBeCalled(): R;
      toBeCalledTimes(expected: number): R;
      toBeCalledWith(...args: any[]): R;
      toHaveAccessibleDescription(text?: string | RegExp): R;
      toHaveAccessibleName(text?: string | RegExp): R;
      toHaveErrorMessage(text?: string | RegExp): R;
    }

    // Custom Expect interface kept minimal to avoid conflicts with Jest types
    interface CustomExpect {
      objectContaining(obj: object): any;
      any(constructor: any): any;
      arrayContaining(array: any[]): any;
      stringContaining(str: string): any;
      stringMatching(str: string | RegExp): any;
    }
  }

  // Add compatibility for Chai assertions in Cypress tests
  namespace Chai {
    interface Assertion {
      // DOM Testing Library
      toBeInTheDocument(): Assertion;
      toHaveTextContent(text: string | RegExp): Assertion;
      toBeVisible(): Assertion;
      toBeDisabled(): Assertion;
      toBeEnabled(): Assertion;
      toHaveAttribute(attr: string, value?: string | RegExp): Assertion;
      toHaveClass(className: string | string[]): Assertion;
      toHaveFocus(): Assertion;
      toHaveStyle(css: Record<string, any>): Assertion;
      toHaveValue(value: string | string[] | number | null): Assertion;
      toBeChecked(): Assertion;
      toBePartiallyChecked(): Assertion;
      toHaveDescription(text: string | RegExp): Assertion;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): Assertion;
      toContainElement(element: HTMLElement | null): Assertion;
      
      // Jest style assertions for Cypress
      toHaveBeenCalled(): Assertion;
      toHaveBeenCalledWith(...args: any[]): Assertion;
      toBeTruthy(): Assertion;
      toBe(expected: any): Assertion;
      toBeDefined(): Assertion;
      toBeUndefined(): Assertion;
      toBeNull(): Assertion;
      toBeFalsy(): Assertion;
      toEqual(expected: any): Assertion;
      toMatchObject(expected: Record<string, any>): Assertion;
      toHaveLength(expected: number): Assertion;
      toHaveBeenCalledTimes(expected: number): Assertion;
      toContain(expected: any): Assertion;
      toContainEqual(expected: any): Assertion;
      
      // Numeric comparisons
      toBeGreaterThan(expected: number): Assertion;
      toBeGreaterThanOrEqual(expected: number): Assertion;
      toBeLessThan(expected: number): Assertion;
      toBeLessThanOrEqual(expected: number): Assertion;
      toBeCloseTo(expected: number, precision?: number): Assertion;
      
      // Additional matchers
      toBeEmpty(): Assertion;
      toBeEmptyDOMElement(): Assertion;
      toBeRequired(): Assertion;
      toBeInvalid(): Assertion;
      toBeValid(): Assertion;
      toBeOneOf(arr: any[]): Assertion;
      toBeNil(): Assertion;
      toBeObject(): Assertion;
      
      // Object matchers
      toContainKey(key: string): Assertion;
      toContainKeys(keys: string[]): Assertion;
      toContainAllKeys(keys: string[]): Assertion;
      toContainAnyKeys(keys: string[]): Assertion;
      toContainValue(value: any): Assertion;
      toContainValues(values: any[]): Assertion;
      toContainAllValues(values: any[]): Assertion;
      toContainAnyValues(values: any[]): Assertion;
      toContainEntry(entry: [string, any]): Assertion;
      toContainEntries(entries: [string, any][]): Assertion;
      toContainAllEntries(entries: [string, any][]): Assertion;
      toContainAnyEntries(entries: [string, any][]): Assertion;
      
      // Object property matchers
      toHaveProperty(propertyPath: string, value?: any): Assertion;
      
      // Function matchers
      toThrow(error?: string | RegExp | Error): Assertion;
      toThrowError(error?: string | RegExp | Error): Assertion;
      
      // Status matchers
      toHaveStatus(code: number): Assertion;
      toHaveHeaders(headers: Record<string, string>): Assertion;
    }
  }
}

export {};