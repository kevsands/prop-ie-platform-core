/**
 * Performance Regression Test Suite
 *
 * This test suite runs automated performance regression tests for the critical
 * components and journeys in the application. It establishes performance baselines
 * and detects any performance degradation against these baselines.
 *
 * Features:
 * - Tracks render times for key components
 * - Measures API response times
 * - Captures critical user journey performance
 * - Reports performance regressions against historical baselines
 * - Includes configurable thresholds for warnings and failures
 */
import { render, screen, waitFor, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from '../../src/context/AuthContext';
import fs from 'fs';
import path from 'path';
// Component imports
import { BuyerDashboard } from '../../src/components/buyer/BuyerDashboard';
import { PropertyListing } from '../../src/components/property/PropertyListing';
import { CustomizationPageContent } from '../../src/components/buyer/CustomizationPageContent';
import { HomePage } from '../../src/components/HomePage';
import { PropertyDetail } from '../../src/components/property/PropertyDetail';
import { LoginForm } from '../../src/components/auth/LoginForm';
import { RegisterForm } from '../../src/components/auth/RegisterForm';
// Mock modules
jest.mock('next/router', () => ({
    useRouter: () => ({
        push: jest.fn(),
        pathname: '/',
        query: {},
        asPath: '/',
    }),
}));
// Mock AWS Amplify auth
jest.mock('aws-amplify/auth', () => ({
    getCurrentUser: jest.fn().mockResolvedValue({
        userId: 'test-user',
        username: 'testuser',
    }),
    signIn: jest.fn(),
    signOut: jest.fn(),
}));
// Path to performance baseline file
const BASELINE_PATH = path.join(__dirname, '../../performance-baselines.json');
// Performance regression thresholds (percentages)
const THRESHOLDS = {
    WARNING: 20, // 20% slower than baseline triggers warning
    FAILURE: 50, // 50% slower than baseline fails the test
};
// Default baseline values for new tests (milliseconds)
const DEFAULT_BASELINES = {
    'HomePage-render': 200,
    'PropertyListing-render': 300,
    'PropertyDetail-render': 400,
    'BuyerDashboard-render': 500,
    'CustomizationPage-render': 600,
    'LoginForm-render': 150,
    'RegisterForm-render': 200,
    'PropertySearch-journey': 800,
    'Auth-journey': 600,
    'Customization-journey': 1200,
};
// Initialize or load baselines
function getBaselines() {
    try {
        if (fs.existsSync(BASELINE_PATH)) {
            const baselineData = fs.readFileSync(BASELINE_PATH, 'utf8');
            return JSON.parse(baselineData);
        }
    }
    catch (error) {
        console.warn('Could not load performance baselines:', error);
    }
    // Return default baselines if no file exists
    return DEFAULT_BASELINES;
}
// Update baselines with new measurements
function updateBaselines(baselines, newMeasurements) {
    // Calculate new baseline values - simple moving average (75% old, 25% new)
    const updatedBaselines = { ...baselines };
    for (const [key, value] of Object.entries(newMeasurements)) {
        if (updatedBaselines[key]) {
            updatedBaselines[key] = Math.round(updatedBaselines[key] * 0.75 + value * 0.25);
        }
        else {
            updatedBaselines[key] = value;
        }
    }
    // Write updated baselines to file
    try {
        fs.writeFileSync(BASELINE_PATH, JSON.stringify(updatedBaselines, null, 2), 'utf8');
    }
    catch (error) {
        console.error('Could not update performance baselines:', error);
    }
    return updatedBaselines;
}
// Format percentage change with colors for console
function formatChange(change) {
    const sign = change >= 0 ? '+' : '';
    if (change > THRESHOLDS.FAILURE) {
        return `\x1b[31m${sign}${change.toFixed(1)}%\x1b[0m`; // Red
    }
    else if (change > THRESHOLDS.WARNING) {
        return `\x1b[33m${sign}${change.toFixed(1)}%\x1b[0m`; // Yellow
    }
    else if (change < -10) {
        return `\x1b[32m${sign}${change.toFixed(1)}%\x1b[0m`; // Green for improvement
    }
    else {
        return `${sign}${change.toFixed(1)}%`;
    }
}
// Test wrapper with providers
const renderWithProviders = (ui) => {
    const queryClient = new QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                cacheTime: 0,
            },
        },
    });
    return render(<QueryClientProvider client={queryClient}>
      <AuthProvider>
        {ui}
      </AuthProvider>
    </QueryClientProvider>);
};
// Main test suite
// Mock performance monitor
jest.mock('../../src/utils/performance', () => ({
  performanceMonitor: {
    startTiming: jest.fn(() => performance.now()),
    endTiming: jest.fn(() => performance.now()),
    recordComponentRenderTime: jest.fn(),
    recordUserJourneyStep: jest.fn()
  }
}));

// Import performance monitor after mocking
const { performanceMonitor } = require('../../src/utils/performance');

describe('Performance Regression Tests', () => {
    // Load baseline values
    let baselines = getBaselines();
    // Store new measurements for baseline updates
    const newMeasurements = {};
    beforeAll(() => {
        // Enable more precise timing
        jest.spyOn(performance, 'now').mockImplementation(() => {
            return process.hrtime.bigint() / BigInt(1000000);
        });
        console.log('\nPerformance Regression Test Suite');
        console.log('================================');
        console.log('Current baselines:');
        console.table(baselines);
    });
    afterAll(() => {
        // Update baselines with new measurements
        const updatedBaselines = updateBaselines(baselines, newMeasurements);
        console.log('\nUpdated baselines:');
        console.table(updatedBaselines);
        // Restore mocks
        jest.restoreAllMocks();
    });
    beforeEach(() => {
        // Clear mocks and monitoring data between tests
        jest.clearAllMocks();
        performanceMonitor.clearMetrics();
    });
    describe('Component Render Performance', () => {
        it('should render HomePage within performance thresholds', async () => {
            // Measure performance
            const startTime = performanceMonitor.startTiming('HomePage-render');
            renderWithProviders(<HomePage />);
            // Wait for component to fully render
            await waitFor(() => {
                expect(screen.getByText(/welcome/i)).toBeInTheDocument();
            });
            const duration = performanceMonitor.endTiming('HomePage-render');
            // Store for baseline update
            newMeasurements['HomePage-render'] = duration;
            // Calculate percentage change from baseline
            const baseline = baselines['HomePage-render'];
            const percentChange = ((duration - baseline) / baseline) * 100;
            console.log(`HomePage render time: ${duration.toFixed(2)}ms (baseline: ${baseline}ms, change: ${formatChange(percentChange)})`);
            // Assert against thresholds
            expect(duration).toBeLessThan(baseline * (1 + THRESHOLDS.FAILURE / 100));
        });
        it('should render PropertyListing within performance thresholds', async () => {
            // Measure performance
            const startTime = performanceMonitor.startTiming('PropertyListing-render');
            renderWithProviders(<PropertyListing />);
            // Wait for component to fully render (adjust selector as needed)
            await waitFor(() => {
                expect(screen.getByText(/properties/i)).toBeInTheDocument();
            });
            const duration = performanceMonitor.endTiming('PropertyListing-render');
            // Store for baseline update
            newMeasurements['PropertyListing-render'] = duration;
            // Calculate percentage change from baseline
            const baseline = baselines['PropertyListing-render'];
            const percentChange = ((duration - baseline) / baseline) * 100;
            console.log(`PropertyListing render time: ${duration.toFixed(2)}ms (baseline: ${baseline}ms, change: ${formatChange(percentChange)})`);
            // Assert against thresholds
            expect(duration).toBeLessThan(baseline * (1 + THRESHOLDS.FAILURE / 100));
        });
        it('should render PropertyDetail within performance thresholds', async () => {
            // Measure performance
            const startTime = performanceMonitor.startTiming('PropertyDetail-render');
            renderWithProviders(<PropertyDetail id="property-1"/>);
            // Wait for component to fully render (adjust selector as needed)
            await waitFor(() => {
                expect(screen.getByText(/details/i)).toBeInTheDocument();
            });
            const duration = performanceMonitor.endTiming('PropertyDetail-render');
            // Store for baseline update
            newMeasurements['PropertyDetail-render'] = duration;
            // Calculate percentage change from baseline
            const baseline = baselines['PropertyDetail-render'];
            const percentChange = ((duration - baseline) / baseline) * 100;
            console.log(`PropertyDetail render time: ${duration.toFixed(2)}ms (baseline: ${baseline}ms, change: ${formatChange(percentChange)})`);
            // Assert against thresholds
            expect(duration).toBeLessThan(baseline * (1 + THRESHOLDS.FAILURE / 100));
        });
        it('should render BuyerDashboard within performance thresholds', async () => {
            // Measure performance
            const startTime = performanceMonitor.startTiming('BuyerDashboard-render');
            renderWithProviders(<BuyerDashboard />);
            // Wait for component to fully render (adjust selector as needed)
            await waitFor(() => {
                expect(screen.getByText(/dashboard/i)).toBeInTheDocument();
            });
            const duration = performanceMonitor.endTiming('BuyerDashboard-render');
            // Store for baseline update
            newMeasurements['BuyerDashboard-render'] = duration;
            // Calculate percentage change from baseline
            const baseline = baselines['BuyerDashboard-render'];
            const percentChange = ((duration - baseline) / baseline) * 100;
            console.log(`BuyerDashboard render time: ${duration.toFixed(2)}ms (baseline: ${baseline}ms, change: ${formatChange(percentChange)})`);
            // Assert against thresholds
            expect(duration).toBeLessThan(baseline * (1 + THRESHOLDS.FAILURE / 100));
        });
        it('should render CustomizationPage within performance thresholds', async () => {
            // Measure performance
            const startTime = performanceMonitor.startTiming('CustomizationPage-render');
            renderWithProviders(<CustomizationPageContent propertyId="property-1"/>);
            // Wait for component to fully render (adjust selector as needed)
            await waitFor(() => {
                expect(screen.getByText(/customization/i)).toBeInTheDocument();
            });
            const duration = performanceMonitor.endTiming('CustomizationPage-render');
            // Store for baseline update
            newMeasurements['CustomizationPage-render'] = duration;
            // Calculate percentage change from baseline
            const baseline = baselines['CustomizationPage-render'];
            const percentChange = ((duration - baseline) / baseline) * 100;
            console.log(`CustomizationPage render time: ${duration.toFixed(2)}ms (baseline: ${baseline}ms, change: ${formatChange(percentChange)})`);
            // Assert against thresholds
            expect(duration).toBeLessThan(baseline * (1 + THRESHOLDS.FAILURE / 100));
        });
        it('should render LoginForm within performance thresholds', async () => {
            // Measure performance
            const startTime = performanceMonitor.startTiming('LoginForm-render');
            renderWithProviders(<LoginForm />);
            // Wait for component to fully render (adjust selector as needed)
            await waitFor(() => {
                expect(screen.getByText(/login/i)).toBeInTheDocument();
            });
            const duration = performanceMonitor.endTiming('LoginForm-render');
            // Store for baseline update
            newMeasurements['LoginForm-render'] = duration;
            // Calculate percentage change from baseline
            const baseline = baselines['LoginForm-render'];
            const percentChange = ((duration - baseline) / baseline) * 100;
            console.log(`LoginForm render time: ${duration.toFixed(2)}ms (baseline: ${baseline}ms, change: ${formatChange(percentChange)})`);
            // Assert against thresholds
            expect(duration).toBeLessThan(baseline * (1 + THRESHOLDS.FAILURE / 100));
        });
        it('should render RegisterForm within performance thresholds', async () => {
            // Measure performance
            const startTime = performanceMonitor.startTiming('RegisterForm-render');
            renderWithProviders(<RegisterForm />);
            // Wait for component to fully render (adjust selector as needed)
            await waitFor(() => {
                expect(screen.getByText(/register/i)).toBeInTheDocument();
            });
            const duration = performanceMonitor.endTiming('RegisterForm-render');
            // Store for baseline update
            newMeasurements['RegisterForm-render'] = duration;
            // Calculate percentage change from baseline
            const baseline = baselines['RegisterForm-render'];
            const percentChange = ((duration - baseline) / baseline) * 100;
            console.log(`RegisterForm render time: ${duration.toFixed(2)}ms (baseline: ${baseline}ms, change: ${formatChange(percentChange)})`);
            // Assert against thresholds
            expect(duration).toBeLessThan(baseline * (1 + THRESHOLDS.FAILURE / 100));
        });
    });
    describe('User Journey Performance', () => {
        it('should complete property search journey within performance thresholds', async () => {
            // Measure full journey performance
            const startTime = performanceMonitor.startTiming('PropertySearch-journey');
            // Step 1: Load the property listing page
            const { getByText, getByLabelText } = renderWithProviders(<PropertyListing />);
            // Wait for properties to load
            await waitFor(() => {
                expect(screen.getByText(/properties/i)).toBeInTheDocument();
            });
            // Step 2: Filter properties (simulate user interaction)
            if (screen.getByLabelText) {
                const priceFilter = screen.getByLabelText(/price/i);
                if (priceFilter) {
                    await act(async () => {
                        fireEvent.change(priceFilter, { target: { value: '300000' } });
                    });
                }
            }
            // Step 3: Select a property (would normally navigate to detail)
            // End timing for full journey
            const duration = performanceMonitor.endTiming('PropertySearch-journey');
            // Store for baseline update
            newMeasurements['PropertySearch-journey'] = duration;
            // Calculate percentage change from baseline
            const baseline = baselines['PropertySearch-journey'];
            const percentChange = ((duration - baseline) / baseline) * 100;
            console.log(`Property Search journey time: ${duration.toFixed(2)}ms (baseline: ${baseline}ms, change: ${formatChange(percentChange)})`);
            // Assert against thresholds
            expect(duration).toBeLessThan(baseline * (1 + THRESHOLDS.FAILURE / 100));
        });
        it('should complete authentication journey within performance thresholds', async () => {
            // Measure full journey performance
            const startTime = performanceMonitor.startTiming('Auth-journey');
            // Step 1: Load the login form
            const { getByLabelText, getByText } = renderWithProviders(<LoginForm />);
            // Wait for form to load
            await waitFor(() => {
                expect(screen.getByText(/login/i)).toBeInTheDocument();
            });
            // Step 2: Fill out and submit the form
            if (screen.getByLabelText) {
                const emailField = screen.getByLabelText(/email/i);
                const passwordField = screen.getByLabelText(/password/i);
                if (emailField && passwordField) {
                    await act(async () => {
                        fireEvent.change(emailField, { target: { value: 'test@example.com' } });
                        fireEvent.change(passwordField, { target: { value: 'password123' } });
                    });
                }
                // Find and click submit button
                const submitButton = screen.getByText(/sign in/i);
                if (submitButton) {
                    await act(async () => {
                        fireEvent.click(submitButton);
                    });
                }
            }
            // End timing for full journey
            const duration = performanceMonitor.endTiming('Auth-journey');
            // Store for baseline update
            newMeasurements['Auth-journey'] = duration;
            // Calculate percentage change from baseline
            const baseline = baselines['Auth-journey'];
            const percentChange = ((duration - baseline) / baseline) * 100;
            console.log(`Authentication journey time: ${duration.toFixed(2)}ms (baseline: ${baseline}ms, change: ${formatChange(percentChange)})`);
            // Assert against thresholds
            expect(duration).toBeLessThan(baseline * (1 + THRESHOLDS.FAILURE / 100));
        });
        it('should complete customization journey within performance thresholds', async () => {
            // Measure full journey performance
            const startTime = performanceMonitor.startTiming('Customization-journey');
            // Step 1: Load the customization page
            const { getByText, getAllByRole } = renderWithProviders(<CustomizationPageContent propertyId="property-1"/>);
            // Wait for customization options to load
            await waitFor(() => {
                expect(screen.getByText(/customization/i)).toBeInTheDocument();
            });
            // Step 2: Select customization options (simulate user interactions)
            const options = screen.getAllByRole ? screen.getAllByRole('radio') : [];
            if (options.length > 0) {
                await act(async () => {
                    fireEvent.click(options[0]);
                });
            }
            // Step 3: Advance to next step
            const nextButton = screen.getByText ? screen.getByText(/next/i) : null;
            if (nextButton) {
                await act(async () => {
                    fireEvent.click(nextButton);
                });
            }
            // End timing for full journey
            const duration = performanceMonitor.endTiming('Customization-journey');
            // Store for baseline update
            newMeasurements['Customization-journey'] = duration;
            // Calculate percentage change from baseline
            const baseline = baselines['Customization-journey'];
            const percentChange = ((duration - baseline) / baseline) * 100;
            console.log(`Customization journey time: ${duration.toFixed(2)}ms (baseline: ${baseline}ms, change: ${formatChange(percentChange)})`);
            // Assert against thresholds
            expect(duration).toBeLessThan(baseline * (1 + THRESHOLDS.FAILURE / 100));
        });
    });
});
