import { defineConfig } from 'cypress';
export default defineConfig({
    e2e: {
        baseUrl: 'http://localhost:3000',
        setupNodeEvents(on, config) {
            // implement node event listeners here
            on('task', {
                // Add custom task to log messages during test runs
                log(message) {
                    console.log(message);
                    return null;
                },
                // Add custom task to store and retrieve test data
                setTestData({ key, value }) {
                    global.__testData = global.__testData || {};
                    global.__testData[key] = value;
                    return null;
                },
                getTestData(key) {
                    global.__testData = global.__testData || {};
                    return global.__testData[key] || null;
                },
                // Reset test data between tests
                resetTestData() {
                    global.__testData = {};
                    return null;
                }
            });
        },
        viewportWidth: 1280,
        viewportHeight: 720,
        video: false,
        screenshotOnRunFailure: true,
        chromeWebSecurity: false,
        env: {
            // Environment-specific configuration
            apiUrl: 'http://localhost:3000/api',
            environment: 'test',
            // Auth credentials for testing
            testBuyerEmail: 'test-buyer@example.com',
            testBuyerPassword: 'Test@123',
            testAgentEmail: 'test-agent@example.com',
            testAgentPassword: 'Test@123',
            testDeveloperEmail: 'test-developer@example.com',
            testDeveloperPassword: 'Test@123',
        },
        // Define test retries for flaky tests
        retries: {
            runMode: 2,
            openMode: 0,
        },
        defaultCommandTimeout: 10000,
        pageLoadTimeout: 60000,
        experimentalMemoryManagement: true
    },
    component: {
        devServer: {
            framework: 'next',
            bundler: 'webpack',
        },
        viewportWidth: 1280,
        viewportHeight: 720,
        specPattern: 'cypress/component/**/*.cy.{js,jsx,ts,tsx}',
        supportFile: 'cypress/support/component.ts',
        video: false,
        screenshotOnRunFailure: true,
    },
});
