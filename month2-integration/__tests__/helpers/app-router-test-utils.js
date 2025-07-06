"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.setupAppRouterMocks = setupAppRouterMocks;
exports.setupAuthMock = setupAuthMock;
exports.setupTestEnvironment = setupTestEnvironment;
exports.getTestId = getTestId;
var environment_test_utils_1 = require("./environment-test-utils");
// Mock Next.js modules without directly requiring them
// to avoid issues when they aren't available
var mockNextNavigation = function () {
    jest.mock('next/navigation', function () { return ({
        useRouter: jest.fn().mockReturnValue({
            push: jest.fn(),
            replace: jest.fn(),
            back: jest.fn(),
            forward: jest.fn(),
            refresh: jest.fn(),
            prefetch: jest.fn(),
            pathname: '',
        }),
        useSearchParams: jest.fn().mockReturnValue({
            get: jest.fn(),
            getAll: jest.fn(),
            has: jest.fn(),
            entries: jest.fn(),
            keys: jest.fn(),
            values: jest.fn(),
            toString: jest.fn(),
        }),
        useParams: jest.fn().mockReturnValue({}),
    }); });
};
// Only call this if the module is available
try {
    mockNextNavigation();
}
catch (error) {
    console.warn('Could not mock next/navigation. This is expected in non-Next.js environments.');
}
/**
 * Sets up router mocks for testing app router functionality
 * @param options Router mock configuration options
 */
function setupAppRouterMocks(options) {
    if (options === void 0) { options = {}; }
    var _a = options.params, params = _a === void 0 ? {} : _a, _b = options.searchParams, searchParams = _b === void 0 ? {} : _b, _c = options.pathname, pathname = _c === void 0 ? '' : _c, _d = options.customRouterMethods, customRouterMethods = _d === void 0 ? {} : _d;
    // Get the mocked modules
    var nextNavigation = jest.requireMock('next/navigation');
    // Setup useParams mock
    nextNavigation.useParams.mockReturnValue(params);
    // Setup useSearchParams mock
    var searchParamsObj = {
        get: jest.fn(function (key) { return searchParams[key] || null; }),
        getAll: jest.fn(function (key) { return searchParams[key] ? [searchParams[key]] : []; }),
        has: jest.fn(function (key) { return key in searchParams; }),
        entries: jest.fn(function () { return Object.entries(searchParams)[Symbol.iterator](); }),
        keys: jest.fn(function () { return Object.keys(searchParams)[Symbol.iterator](); }),
        values: jest.fn(function () { return Object.values(searchParams)[Symbol.iterator](); }),
        toString: jest.fn(function () {
            return Object.entries(searchParams)
                .map(function (_a) {
                var key = _a[0], value = _a[1];
                return "".concat(key, "=").concat(value);
            })
                .join('&');
        }),
    };
    nextNavigation.useSearchParams.mockReturnValue(searchParamsObj);
    // Setup useRouter mock
    var routerObj = __assign({ push: jest.fn(), replace: jest.fn(), back: jest.fn(), forward: jest.fn(), refresh: jest.fn(), prefetch: jest.fn(), pathname: pathname }, customRouterMethods);
    nextNavigation.useRouter.mockReturnValue(routerObj);
    return {
        router: routerObj,
        searchParams: searchParamsObj,
        params: params,
    };
}
/**
 * Sets up authentication mocks for testing authenticated components
 * @param options Auth mock configuration options
 */
function setupAuthMock(options) {
    if (options === void 0) { options = {}; }
    var _a = options.isAuthenticated, isAuthenticated = _a === void 0 ? true : _a, _b = options.user, user = _b === void 0 ? {
        id: 'test-user-id',
        email: 'test@example.com',
        name: 'Test User',
        role: 'user'
    } : _b, _c = options.token, token = _c === void 0 ? 'mock-jwt-token' : _c, _d = options.customAuthMethods, customAuthMethods = _d === void 0 ? {} : _d;
    // Mock the auth hook
    jest.mock('../../src/hooks/useAuth', function () { return ({
        __esModule: true,
        default: jest.fn().mockReturnValue(__assign({ isAuthenticated: isAuthenticated, user: user, token: token, login: jest.fn().mockResolvedValue({}), logout: jest.fn(), register: jest.fn().mockResolvedValue({}) }, customAuthMethods)),
    }); });
    // Mock localStorage for JWT token
    if (typeof window !== 'undefined') {
        Object.defineProperty(window, 'localStorage', {
            value: {
                getItem: jest.fn(function (key) {
                    if (key === 'auth_token' && isAuthenticated)
                        return token;
                    return null;
                }),
                setItem: jest.fn(),
                removeItem: jest.fn(),
                clear: jest.fn(),
                length: isAuthenticated ? 1 : 0,
                key: jest.fn(),
            },
            writable: true
        });
    }
    return {
        isAuthenticated: isAuthenticated,
        user: user,
        token: token,
    };
}
/**
 * Sets up test environment variables for testing
 */
function setupTestEnvironment(variables) {
    if (variables === void 0) { variables = {}; }
    // Default test environment variables
    var defaultTestVars = {
        NODE_ENV: 'test',
        POSTGRES_HOST: 'localhost',
        POSTGRES_PORT: '5432',
        POSTGRES_DB: 'propie_test',
        POSTGRES_USER: 'postgres',
        POSTGRES_PASSWORD: 'postgres',
        POSTGRES_POOL_MAX: '5',
        POSTGRES_IDLE_TIMEOUT: '10000',
        POSTGRES_CONNECT_TIMEOUT: '1000',
        POSTGRES_SSL: 'false',
    };
    // Merge default with provided variables (provided takes precedence)
    return (0, environment_test_utils_1.mockEnvironmentVariables)(__assign(__assign({}, defaultTestVars), variables));
}
// Export other functions only if required
function getTestId(componentName, identifier) {
    return "".concat(componentName, "-").concat(identifier);
}
