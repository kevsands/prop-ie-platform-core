/**
 * Type Utilities for Tests
 * 
 * This file provides TypeScript utility types and helpers for testing.
 */

import { ReactElement } from 'react';
import { RenderResult } from '@testing-library/react';

/**
 * Utility type to extract the return type of a function
 */
export type ReturnTypeOf<T extends (...args: any[]) => any> = ReturnType<T>;

/**
 * Utility type to make all properties of a type optional
 */
export type PartialDeep<T> = {
  [P in keyof T]?: T[P] extends object ? PartialDeep<T[P]> : T[P];
};

/**
 * Utility type to make all properties required
 */
export type RequiredDeep<T> = {
  [P in keyof T]-?: T[P] extends object ? RequiredDeep<T[P]> : T[P];
};

/**
 * Type for a component under test
 */
export type ComponentUnderTest = ReactElement | JSX.Element;

/**
 * Type for a render result with helper functions
 */
export type TestRenderResult = RenderResult & {
  rerender: (ui: ReactElement) => void;
};

/**
 * Type for mock data generators
 */
export type MockGenerator<T> = (overrides?: Partial<T>) => T;

/**
 * Type for defining a set of test cases
 */
export type TestCase<T = any> = {
  name: string;
  input?: T;
  expected?: any;
  shouldThrow?: boolean;
  setup?: () => void;
  teardown?: () => void;
};

/**
 * Helper function to create a type-safe test case
 * @param testCase The test case definition
 * @returns The same test case with proper typing
 */
export function createTestCase<T>(testCase: TestCase<T>): TestCase<T> {
  return testCase;
}

/**
 * Helper function to create multiple test cases
 * @param testCases Array of test case definitions
 * @returns The same test cases with proper typing
 */
export function createTestCases<T>(testCases: TestCase<T>[]): TestCase<T>[] {
  return testCases;
}

/**
 * Helper to assert a value is not null or undefined
 * @param value The value to check
 * @param message Optional error message
 * @returns The value with null/undefined removed from its type
 */
export function assertDefined<T>(value: T, message?: string): NonNullable<T> {
  if (value === undefined || value === null) {
    throw new Error(message || 'Value is undefined or null');
  }
  return value as NonNullable<T>;
}

/**
 * Helper to assert a type at runtime
 * @param value The value to check
 * @param checker Function that checks if value is of the expected type
 * @param message Optional error message
 * @returns The value with the asserted type
 */
export function assertType<T>(
  value: any,
  checker: (val: any) => boolean,
  message?: string
): T {
  if (!checker(value)) {
    throw new Error(message || 'Value is not of the expected type');
  }
  return value as T;
}

/**
 * Helper function to create a typed mock function
 * @param returnValue The value the mock function should return
 * @returns A jest mock function with proper typing
 */
export function createTypedMock<T extends (...args: any[]) => any>(
  returnValue: ReturnType<T>
): jest.MockedFunction<T> {
  return jest.fn(() => returnValue) as jest.MockedFunction<T>;
}

/**
 * Creates a promise that resolves after the specified time
 * @param ms Time to wait in milliseconds
 * @returns A promise that resolves after the specified time
 */
export function wait(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Utility to make sure TypeScript can correctly infer types for assertion callbacks
 * @param callback The assertion callback
 * @returns The same callback with proper typing
 */
export function expectType<T>(callback: (value: T) => void): (value: T) => void {
  return callback;
}