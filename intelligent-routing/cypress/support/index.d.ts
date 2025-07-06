/// <reference types="cypress" />

declare namespace Cypress {
  interface SinonSpyProxy {
    getCalls(): Array<{
      args: any[];
      returnValue: any;
    }>;
  }

  interface Chainable<Subject = any> {
    // Add types for custom commands in commands.ts
    restoreLocalStorage(): void;
    saveLocalStorage(): void;
    stubAmplifySignIn(options: { isSuccess: boolean; user: any }): void;
  }
}