/// <reference types="jest" />
/// <reference types="@testing-library/jest-dom" />

// Extending Jest matchers for both Jest and Cypress compatibility
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

      // Jest Extended
      toBeEmpty(): R;
      toBeEmptyDOMElement(): R;
      toBeRequired(): R;
      toBeInvalid(): R;
      toBeValid(): R;
      toHaveDescription(text: string | RegExp): R;
      toHaveDisplayValue(value: string | RegExp | Array<string | RegExp>): R;
      toBePartiallyChecked(): R;
      toContainElement(element: HTMLElement | null): R;
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
      toContainEntry(entry: [stringany]): R;
      toContainEntries(entries: [stringany][]): R;
      toContainAllEntries(entries: [stringany][]): R;
      toContainAnyEntries(entries: [stringany][]): R;
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
      toEqual(expected: any): R;
      toBeNull(): R;
      toBeCalled(): R;
      toBeCalledTimes(expected: number): R;
      toBeCalledWith(...args: any[]): R;
      toHaveBeenCalledTimes(expected: number): R;
    }

    interface ExpectStatic {
      objectContaining<T = any>(obj: object): T;
      any(constructor: Function | string): any;
      arrayContaining<T = any>(arr: Array<T>): T[];
      stringContaining(str: string): string;
      stringMatching(str: string | RegExp): string;
      not: {
        objectContaining(obj: object): any;
        arrayContaining(arr: any[]): any;
      };
      assertions(count: number): void;
      extend(matchers: Record<string, any>): void;
      addSnapshotSerializer(serializer: any): void;
      hasAssertions(): void;
      setState(state: object): void;
      getState(): any;
    }
  }
}

// For Chai assertions from Cypress, declare compatibility with Jest syntax
// This provides compatibility between Cypress' chai assertions and Jest's expect assertions
declare global {
  namespace Chai {
    interface Assertion {
      // Jest assertion methods that need to be available in Chai context
      toBe(expected: any): Assertion;
      toEqual(expected: any): Assertion;
      toMatchObject(expected: any): Assertion;
      toContain(expected: any): Assertion;
      toBeDefined(): Assertion;
      toBeUndefined(): Assertion;
      toBeNull(): Assertion;
      toBeTruthy(): Assertion;
      toBeFalsy(): Assertion;
      toHaveLength(expected: number): Assertion;
      toHaveBeenCalled(): Assertion;
      toHaveBeenCalledWith(...args: any[]): Assertion;
      toHaveBeenCalledTimes(expected: number): Assertion;
      // Add more Jest-style assertion methods that may be used in Cypress
    }
  }

  // Cypress extends expect differently than Jest, so we need to augment it
  interface ExpectStatic {
    objectContaining<T = any>(obj: object): T;
    any(constructor: Function | string): any;
    arrayContaining<T = any>(arr: Array<T>): T[];
    stringContaining(str: string): string;
    stringMatching(str: string | RegExp): string;
  }
}

// This exports an empty object, but it's needed to make this a module
export {};