require('@testing-library/jest-dom');
const { setupServer } = require('msw/node');
const { rest } = require('msw');
const { performance } = require('perf_hooks');

// Mock window properties and functions
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor() {
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
};

// Mock ResizeObserver
global.ResizeObserver = class ResizeObserver {
  constructor() {
    this.observe = jest.fn();
    this.unobserve = jest.fn();
    this.disconnect = jest.fn();
  }
};

// Mock fetch API responses
const mockApiResponses = {
  shows: {
    data: {
      show1: {
        name: "Test Show 1",
        dates: ["2025-04-01T20:00:00Z"],
        display_until: "2025-12-31",
        description: { body: "Test show description" },
        img: { url: "/images/test-show.jpg" },
        cost: { formatted: "$20.00" },
        url: "/shows/test-show-1",
        tags: ["comedy", "improv"],
        category: "comedy"
      }
    }
  },
  classes: {
    data: {
      class1: {
        name: "Test Class 1",
        dates: ["2025-04-02T18:00:00Z"],
        display_until: "2025-12-31",
        description: { body: "Test class description" },
        img: { url: "/images/test-class.jpg" },
        cost: { formatted: "$100.00" },
        url: "/classes/test-class-1",
        tags: ["beginner", "improv"],
        category: "classes"
      }
    }
  }
};

// Create MSW server for API mocking
const server = setupServer(
  rest.get('*/api/v1/shows', (req, res, ctx) => {
    return res(ctx.json(mockApiResponses.shows));
  }),
  rest.get('*/api/v1/classes', (req, res, ctx) => {
    return res(ctx.json(mockApiResponses.classes));
  })
);

// Start MSW server before tests
beforeAll(() => server.listen());

// Reset handlers after each test
afterEach(() => {
  server.resetHandlers();
  document.body.innerHTML = '';
  jest.clearAllMocks();
});

// Clean up after all tests
afterAll(() => server.close());

// Global test utilities
global.setupTestEnvironment = () => {
  // Create basic DOM structure
  document.body.innerHTML = `
    <div id="fourth_wall">
      <div class="fw-embed fw-calendar"></div>
    </div>
  `;

  // Add original script tag
  const script = document.createElement('script');
  script.id = 'fw_script';
  script.src = 'https://crowdwork.com/embed.js?v=BETA-2025-04';
  script.setAttribute('data-theatre', 'test-theatre');
  document.head.appendChild(script);
};

// Performance measurement utilities
global.measureTime = async (fn) => {
  const start = performance.now();
  await fn();
  return performance.now() - start;
};

// Custom matchers
expect.extend({
  toBeWithinRange(received, floor, ceiling) {
    const pass = received >= floor && received <= ceiling;
    if (pass) {
      return {
        message: () => `expected ${received} not to be within range ${floor} - ${ceiling}`,
        pass: true,
      };
    } else {
      return {
        message: () => `expected ${received} to be within range ${floor} - ${ceiling}`,
        pass: false,
      };
    }
  },
});
