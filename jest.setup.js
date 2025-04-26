import '@testing-library/jest-dom';
import { jest } from '@jest/globals';

// Mock the CrowdWork embed.js script
global.FourthWall = {
  init: jest.fn(),
  getEvents: jest.fn(),
  // Add other FourthWall methods as needed
};

// Setup common test utilities
beforeEach(() => {
  // Clear all mocks before each test
  jest.clearAllMocks();

  // Reset the DOM
  document.body.innerHTML = '';

  // Reset URL parameters
  window.history.pushState({}, '', '/');
});
