/**
 * environment-mock.ts
 * Mock implementation of the environment module for tests
 */
import { getEnvironmentVariable } from '../helpers/environment-test-utils';
export { getEnvironmentVariable };
// Export any other functions from the real environment module that might be needed
export function validateEnvironment() {
    return true;
}
export function initializeEnvironment() {
    return true;
}
export default {
    getEnvironmentVariable,
    validateEnvironment,
    initializeEnvironment
};
