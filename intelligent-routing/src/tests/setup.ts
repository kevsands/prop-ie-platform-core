// Setup file for Jest tests
import '@testing-library/jest-dom';
import 'jest-extended';
import { Assertion, expect as chaiExpect } from 'chai';
import { Mock } from 'jest-mock';
import type { JestExpect } from '@jest/expect';

// Extend global types
declare global {
  namespace NodeJS {
    interface Global {
      expect: JestExpect & {
        extend: (matchers: Record<string, any>) => void;
      };
      chai: typeof import('chai');
    }
  }
}

// Add Jest-like assertion methods to Chai for test compatibility
if (typeof global.expect !== 'undefined') {
  // This is a Jest environment
  
  // Make sure the expect object has all the expected methods
  if (typeof global.expect.extend === 'function') {
    global.expect.extend({
      toBeUndefined: (received: unknown) => ({
        message: () => `expected ${received} to be undefined`,
        pass: received === undefined,
      }),
      toBeCalled: (received: Mock | unknown) => ({
        message: () => `expected ${received} to have been called`,
        pass: received && typeof (received as Mock).mock === 'object' && (received as Mock).mock.calls.length > 0,
      }),
      toBeCalledWith: (received: Mock | unknown, ...args: unknown[]) => ({
        message: () => `expected ${received} to have been called with ${args}`,
        pass: received && 
          typeof (received as Mock).mock === 'object' && 
          (received as Mock).mock.calls.some(call => 
            JSON.stringify(call) === JSON.stringify(args)
          ),
      }),
    });
  }
} else if (typeof global.chai !== 'undefined') {
  // This is a Chai environment (likely Cypress)
  const chai = global.chai;

  // Add Jest-style assertion methods to Chai for compatibility
  chai.Assertion.addMethod('toBe', function(this: any, expected: unknown) {
    this.assert(
      this._obj === expected,
      `expected #{this} to be #{exp}`,
      `expected #{this} not to be #{exp}`,
      expected
    );
  });

  chai.Assertion.addMethod('toEqual', function(this: any, expected: unknown) {
    this.deep.equal(expected);
  });

  chai.Assertion.addMethod('toMatchObject', function(this: any, expected: Record<string, unknown>) {
    Object.keys(expected).forEach(key => {
      this.property(key).deep.equal(expected[key]);
    });
  });

  chai.Assertion.addMethod('toBeDefined', function(this: any) {
    this.is.not.undefined;
  });

  chai.Assertion.addMethod('toBeUndefined', function(this: any) {
    this.is.undefined;
  });

  chai.Assertion.addMethod('toBeNull', function(this: any) {
    this.is.null;
  });

  chai.Assertion.addMethod('toHaveLength', function(this: any, expected: number) {
    this.property('length').equal(expected);
  });

  chai.Assertion.addMethod('toHaveBeenCalled', function(this: any) {
    this.called;
  });

  chai.Assertion.addMethod('toHaveBeenCalledWith', function(this: any, ...args: unknown[]) {
    this.calledWith(...args);
  });

  chai.Assertion.addMethod('toHaveBeenCalledTimes', function(this: any, expected: number) {
    this.callCount(expected);
  });
}

export {};