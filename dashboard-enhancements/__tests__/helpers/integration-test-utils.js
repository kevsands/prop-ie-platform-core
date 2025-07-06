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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MockStorage = void 0;
exports.renderForIntegration = renderForIntegration;
exports.mockFetch = mockFetch;
exports.clearFetchMocks = clearFetchMocks;
exports.setupMockStorage = setupMockStorage;
exports.waitForToast = waitForToast;
exports.simulateApiError = simulateApiError;
exports.trackRenderChanges = trackRenderChanges;
exports.mockAmplifyApi = mockAmplifyApi;
exports.testComponentStates = testComponentStates;
/**
 * integration-test-utils.tsx
 * Utilities for integration testing that extend the app-router-test-utils
 * with additional capabilities for testing component interactions.
 */
var react_1 = __importDefault(require("react"));
var react_2 = require("@testing-library/react");
// Import the necessary mocks and types from app-router-test-utils
// Import each function individually to avoid issues
var app_router_test_utils_1 = require("./app-router-test-utils");
var app_router_test_utils_2 = require("./app-router-test-utils");
// Use the same imports as other files in the project
var query_core_1 = require("@tanstack/query-core");
var react_query_1 = require("@tanstack/react-query");
var sonner_1 = require("sonner");
// Mock external dependencies
jest.mock('sonner', function () { return ({
    toast: {
        success: jest.fn(),
        error: jest.fn(),
        loading: jest.fn(),
        dismiss: jest.fn(),
    },
    Toaster: function () { return react_1.default.createElement("div", { "data-testid": "mock-toaster" }); },
}); });
/**
 * Provider wrapper that includes all necessary context providers for integration tests
 */
var AllProviders = function (_a) {
    var children = _a.children, _b = _a.queryClient, queryClient = _b === void 0 ? new query_core_1.QueryClient({
        defaultOptions: {
            queries: {
                retry: false,
                staleTime: 0,
            },
        },
    }) : _b, _c = _a.routerOptions, routerOptions = _c === void 0 ? {} : _c, _d = _a.authOptions, authOptions = _d === void 0 ? {} : _d;
    // Setup router and auth mocks
    (0, app_router_test_utils_1.setupAppRouterMocks)(routerOptions);
    (0, app_router_test_utils_2.setupAuthMock)(authOptions);
    // Reset history for toast mocks
    jest.clearAllMocks();
    return (react_1.default.createElement(react_query_1.QueryClientProvider, { client: queryClient }, children));
};
/**
 * Enhanced render function for integration tests
 * Includes all necessary providers and mocks for testing component interactions
 */
function renderForIntegration(ui, _a) {
    if (_a === void 0) { _a = {}; }
    var _b = _a.routerOptions, routerOptions = _b === void 0 ? {} : _b, _c = _a.authOptions, authOptions = _c === void 0 ? {} : _c, queryClient = _a.queryClient, renderOptions = __rest(_a, ["routerOptions", "authOptions", "queryClient"]);
    return (0, react_2.render)(ui, __assign({ wrapper: function (_a) {
            var children = _a.children;
            return (react_1.default.createElement(AllProviders, { queryClient: queryClient, routerOptions: routerOptions, authOptions: authOptions, children: children }));
        } }, renderOptions));
}
/**
 * Mock for fetch API to use in integration tests
 * @param mockResponse Response object to return
 * @param status HTTP status code
 */
function mockFetch(mockResponse, status) {
    if (status === void 0) { status = 200; }
    global.fetch = jest.fn().mockImplementation(function () {
        return Promise.resolve({
            status: status,
            ok: status >= 200 && status < 300,
            json: function () { return Promise.resolve(mockResponse); },
            text: function () { return Promise.resolve(JSON.stringify(mockResponse)); },
            headers: new Headers({ 'Content-Type': 'application/json' }),
        });
    });
}
/**
 * Clear all mocked fetch implementations
 */
function clearFetchMocks() {
    global.fetch = jest.fn();
}
/**
 * Mock storage for testing local storage interactions
 */
var MockStorage = /** @class */ (function () {
    function MockStorage() {
        this.store = {};
    }
    MockStorage.prototype.getItem = function (key) {
        return this.store[key] || null;
    };
    MockStorage.prototype.setItem = function (key, value) {
        this.store[key] = value;
    };
    MockStorage.prototype.removeItem = function (key) {
        delete this.store[key];
    };
    MockStorage.prototype.clear = function () {
        this.store = {};
    };
    Object.defineProperty(MockStorage.prototype, "length", {
        get: function () {
            return Object.keys(this.store).length;
        },
        enumerable: false,
        configurable: true
    });
    MockStorage.prototype.key = function (index) {
        return Object.keys(this.store)[index] || null;
    };
    return MockStorage;
}());
exports.MockStorage = MockStorage;
/**
 * Setup mock storage for tests
 */
function setupMockStorage() {
    var mockLocalStorage = new MockStorage();
    var mockSessionStorage = new MockStorage();
    Object.defineProperty(window, 'localStorage', { value: mockLocalStorage });
    Object.defineProperty(window, 'sessionStorage', { value: mockSessionStorage });
    return { mockLocalStorage: mockLocalStorage, mockSessionStorage: mockSessionStorage };
}
/**
 * Wait for toast notifications
 * @param type Type of toast to wait for
 */
function waitForToast(type) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, (0, react_2.waitFor)(function () {
                        expect(sonner_1.toast[type]).toHaveBeenCalled();
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/, sonner_1.toast[type]];
            }
        });
    });
}
/**
 * Simulate an API error response
 * @param message Error message
 * @param status HTTP status code
 */
function simulateApiError(message, status) {
    if (status === void 0) { status = 400; }
    mockFetch({ error: { message: message } }, status);
}
/**
 * Helper to test data flows between components
 * Tracks changes to a value across renders
 */
function trackRenderChanges(initialValue) {
    var history = [initialValue];
    var trackChange = function (newValue) {
        history.push(newValue);
        return newValue;
    };
    return {
        trackChange: trackChange,
        getHistory: function () { return history; },
        getLastValue: function () { return history[history.length - 1]; },
    };
}
/**
 * Mock Amplify API request for testing
 */
function mockAmplifyApi(operation, mockResponse) {
    var mockApiCall = jest.fn().mockResolvedValue(mockResponse);
    // Mock the AWS Amplify API module
    jest.mock('aws-amplify/api', function () { return (__assign(__assign({}, jest.requireActual('aws-amplify/api')), { get: jest.fn().mockImplementation(function (params) {
            if (params.operation === operation) {
                return mockApiCall(params);
            }
            return jest.requireActual('aws-amplify/api').get(params);
        }), post: jest.fn().mockImplementation(function (params) {
            if (params.operation === operation) {
                return mockApiCall(params);
            }
            return jest.requireActual('aws-amplify/api').post(params);
        }) })); });
    return mockApiCall;
}
/**
 * Helper to test component transition states
 * e.g., loading -> error or loading -> success
 */
function testComponentStates(renderCallback, states, setupTestCase) {
    return __awaiter(this, void 0, void 0, function () {
        var view, triggerSuccess, triggerError;
        var _this = this;
        return __generator(this, function (_a) {
            view = renderCallback();
            // Check initial state if provided
            if (states.initial) {
                states.initial(view);
            }
            triggerSuccess = function () { };
            triggerError = function () { };
            // Provide these callbacks to the test case setup
            setupTestCase(function () { return triggerSuccess(); }, function (error) { return triggerError(error); });
            // Return functions to drive the test
            return [2 /*return*/, {
                    simulateLoading: function () { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            if (states.loading) {
                                states.loading(view);
                            }
                            return [2 /*return*/];
                        });
                    }); },
                    simulateSuccess: function (data) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    triggerSuccess();
                                    if (!states.success) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, react_2.waitFor)(function () { return states.success(view, data); })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); },
                    simulateError: function (error) { return __awaiter(_this, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                            switch (_a.label) {
                                case 0:
                                    triggerError(error);
                                    if (!states.error) return [3 /*break*/, 2];
                                    return [4 /*yield*/, (0, react_2.waitFor)(function () { return states.error(view, error); })];
                                case 1:
                                    _a.sent();
                                    _a.label = 2;
                                case 2: return [2 /*return*/];
                            }
                        });
                    }); },
                    cleanup: function () {
                        // Clean up any mocks that might have been created
                        clearFetchMocks();
                    },
                }];
        });
    });
}
