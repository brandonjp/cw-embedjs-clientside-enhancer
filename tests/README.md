# CrowdWork Embed Enhancer Test Suite

This directory contains comprehensive tests for both the embed-enhancer.js script and the configurator tool.

## Structure

```
tests/
├── unit/                 # Unit tests for individual functions
├── integration/          # Integration tests for component interactions
├── e2e/                  # End-to-end tests for full user flows
├── fixtures/            # Test data and mock responses
└── utils/              # Test utilities and helpers
```

## Test Categories

### Unit Tests
- Filter state management
- Date handling and calculations
- Tag management
- URL parameter handling
- DOM manipulation utilities
- Configuration parsing
- API response processing

### Integration Tests
- Filter UI interaction with state
- Calendar view updates
- Card view updates
- Combined view functionality
- Tag system integration
- Date filter integration
- API data integration

### End-to-End Tests
- Complete user flows
- Configurator tool usage
- Widget embedding scenarios
- Filter application workflows
- URL sharing functionality

### Performance Tests
- Loading time measurements
- DOM update efficiency
- Memory usage monitoring
- Network request optimization

## Running Tests

1. Install dependencies:
```bash
npm install
```

2. Run all tests:
```bash
npm test
```

3. Run specific test categories:
```bash
npm run test:unit
npm run test:integration
npm run test:e2e
npm run test:performance
```

4. Run tests with coverage:
```bash
npm run test:coverage
```

## Test Environment Setup

The test suite uses:
- Jest as the test runner
- Puppeteer for E2E testing
- Jest-DOM for DOM assertions
- MSW for API mocking

## Writing Tests

Follow these guidelines when adding new tests:

1. Place tests in the appropriate category directory
2. Use descriptive test names that explain the scenario
3. Follow the AAA pattern (Arrange, Act, Assert)
4. Mock external dependencies appropriately
5. Include both positive and negative test cases
6. Test edge cases and error conditions
7. Add comments explaining complex test scenarios

## Coverage Goals

- Unit Tests: 90%+ coverage
- Integration Tests: 80%+ coverage
- E2E Tests: Cover all critical user paths
- Performance Tests: Establish and maintain baseline metrics
