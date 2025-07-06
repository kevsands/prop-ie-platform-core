import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import OptimizedSecurityDashboard from '../../src/components/security/OptimizedSecurityDashboard';
import { LazySecurityDashboard } from '../../src/lib/security/lazySecurityFeatures';
import { cachedSecurityApi } from '../../src/lib/security/cachedSecurityApi';
// Mock the dependencies
jest.mock('../../src/components/security/SecurityDashboard', () => ({
    SecurityDashboard: jest.fn(() => <div data-testid="security-dashboard">Security Dashboard</div>)
}));
jest.mock('../../src/utils/performance', () => ({
    usePerformance: jest.fn(() => ({
        measureRender: jest.fn()
    })),
    performanceMonitor: {
        startTiming: jest.fn().mockReturnValue(1),
        endTiming: jest.fn(),
        getPerformanceMetrics: jest.fn().mockReturnValue({}),
        getComponentTimings: jest.fn().mockReturnValue([])
    }
}));
jest.mock('../../src/lib/security/cachedSecurityApi', () => ({
    cachedSecurityApi: {
        getSecurityEvents: jest.fn().mockResolvedValue([]),
        getSecurityStats: jest.fn().mockResolvedValue({}),
        getFeatureFlags: jest.fn().mockResolvedValue([])
    }
}));
describe('Security Components with Performance Optimizations', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });
    describe('OptimizedSecurityDashboard', () => {
        it('should render the security dashboard', () => {
            render(<OptimizedSecurityDashboard />);
            expect(screen.getByTestId('security-dashboard')).toBeInTheDocument();
        });
        it('should use performance monitoring', () => {
            const { usePerformance } = require('../../src/utils/performance');
            render(<OptimizedSecurityDashboard />);
            expect(usePerformance).toHaveBeenCalledWith('SecurityDashboard');
        });
        it('should re-render only when necessary props change', () => {
            const { rerender } = render(<OptimizedSecurityDashboard user={{ id: '123' }}/>);
            // Get the current render count
            const { SecurityDashboard } = require('../../src/components/security/SecurityDashboard');
            const initialRenderCount = SecurityDashboard.mock.calls.length;
            // Re-render with same props - should not trigger a re-render of the underlying component
            rerender(<OptimizedSecurityDashboard user={{ id: '123' }}/>);
            expect(SecurityDashboard.mock.calls.length).toBe(initialRenderCount);
            // Re-render with different props - should trigger a re-render
            rerender(<OptimizedSecurityDashboard user={{ id: '456' }}/>);
            expect(SecurityDashboard.mock.calls.length).toBe(initialRenderCount + 1);
        });
    });
    describe('LazySecurityDashboard', () => {
        it('should lazy load the security dashboard', async () => {
            // Mock React.lazy with a simpler implementation for testing
            jest.mock('react', () => ({
                ...jest.requireActual('react'),
                lazy: (factory) => {
                    const Component = factory();
                    return Component;
                },
                Suspense: ({ children }) => children,
            }));
            render(<LazySecurityDashboard />);
            expect(screen.getByTestId('security-dashboard')).toBeInTheDocument();
        });
    });
    describe('cachedSecurityApi', () => {
        it('should cache API responses', async () => {
            const testEvents = [{ id: '1', description: 'test' }];
            cachedSecurityApi.getSecurityEvents.mockResolvedValueOnce(testEvents);
            // First call should use the API
            const result1 = await cachedSecurityApi.getSecurityEvents('user123');
            expect(result1).toEqual(testEvents);
            expect(cachedSecurityApi.getSecurityEvents).toHaveBeenCalledTimes(1);
            // Reset mock to return different value
            cachedSecurityApi.getSecurityEvents.mockResolvedValueOnce([{ id: '2', description: 'different' }]);
            // Second call with same parameters should use cached result
            const result2 = await cachedSecurityApi.getSecurityEvents('user123');
            expect(result2).toEqual(testEvents); // Should match first result, not mock's new value
            expect(cachedSecurityApi.getSecurityEvents).toHaveBeenCalledTimes(1); // Should not call API again
            // Call with different parameters should call API
            await cachedSecurityApi.getSecurityEvents('user456');
            expect(cachedSecurityApi.getSecurityEvents).toHaveBeenCalledTimes(2);
        });
    });
    describe('preloadCriticalSecurityComponents', () => {
        it('should preload security components', () => {
            // Mock the preload methods
            const mockPreload = jest.fn();
            jest.mock('../../src/lib/security/lazySecurityFeatures', () => ({
                LazySecurityDashboard: { preload: mockPreload },
                LazyEnhancedSecurityDashboard: { preload: mockPreload },
                preloadCriticalSecurityComponents: jest.requireActual('../../src/lib/security/lazySecurityFeatures').preloadCriticalSecurityComponents
            }));
            // Import the real implementation
            const { preloadCriticalSecurityComponents } = jest.requireActual('../../src/lib/security/lazySecurityFeatures');
            // Call the preload function
            preloadCriticalSecurityComponents();
            // Each component's preload should be called
            expect(mockPreload).toHaveBeenCalledTimes(2);
        });
    });
});
