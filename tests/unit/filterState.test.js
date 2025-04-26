const { FWEnhancer } = require('../../embed-enhancer.js');

describe('Filter State Management', () => {
  beforeEach(() => {
    setupTestEnvironment();
    // Reset URL parameters
    window.history.pushState({}, '', '/');
    // Initialize enhancer
    FWEnhancer.init();
  });

  describe('setFilter', () => {
    test('should update include tags filter', () => {
      FWEnhancer.setFilter('includeTags', ['comedy', 'improv']);
      const state = FWEnhancer.getFilterState();
      expect(state.includeTags).toEqual(['comedy', 'improv']);
    });

    test('should update exclude tags filter', () => {
      FWEnhancer.setFilter('excludeTags', ['18+', 'mature']);
      const state = FWEnhancer.getFilterState();
      expect(state.excludeTags).toEqual(['18+', 'mature']);
    });

    test('should update tag match mode', () => {
      FWEnhancer.setFilter('tagMatch', 'all');
      const state = FWEnhancer.getFilterState();
      expect(state.tagMatch).toBe('all');
    });

    test('should update date range', () => {
      const startDate = new Date('2025-04-01');
      const endDate = new Date('2025-04-30');
      FWEnhancer.setFilter('startDate', startDate);
      FWEnhancer.setFilter('endDate', endDate);
      const state = FWEnhancer.getFilterState();
      expect(state.startDate).toEqual(startDate);
      expect(state.endDate).toEqual(endDate);
    });

    test('should update days of week', () => {
      FWEnhancer.setFilter('daysOfWeek', [5, 6]); // Weekend days
      const state = FWEnhancer.getFilterState();
      expect(state.daysOfWeek).toEqual([5, 6]);
    });

    test('should update event limit', () => {
      FWEnhancer.setFilter('limit', 10);
      const state = FWEnhancer.getFilterState();
      expect(state.limit).toBe(10);
    });

    test('should update special filter', () => {
      FWEnhancer.setFilter('specialFilter', 'next-weekend');
      const state = FWEnhancer.getFilterState();
      expect(state.specialFilter).toBe('next-weekend');
    });
  });

  describe('resetFilters', () => {
    test('should reset all filters to default values', () => {
      // Set some filters first
      FWEnhancer.setFilter('includeTags', ['comedy']);
      FWEnhancer.setFilter('excludeTags', ['18+']);
      FWEnhancer.setFilter('limit', 5);

      // Reset filters
      FWEnhancer.resetFilters();

      // Check default state
      const state = FWEnhancer.getFilterState();
      expect(state).toEqual({
        includeTags: [],
        excludeTags: [],
        tagMatch: 'any',
        startDate: null,
        endDate: null,
        daysOfWeek: [],
        limit: 0,
        specialFilter: ''
      });
    });

    test('should update URL parameters after reset', () => {
      // Set some filters first
      FWEnhancer.setFilter('includeTags', ['comedy']);
      expect(window.location.search).toContain('include-tags=comedy');

      // Reset filters
      FWEnhancer.resetFilters();
      expect(window.location.search).toBe('');
    });
  });

  describe('URL Parameter Management', () => {
    test('should update URL when filters change', () => {
      FWEnhancer.setFilter('includeTags', ['comedy', 'improv']);
      expect(window.location.search).toContain('include-tags=comedy,improv');
    });

    test('should initialize filters from URL parameters', () => {
      // Set up URL with parameters
      window.history.pushState({}, '', '?include-tags=comedy,improv&limit=5');

      // Initialize enhancer
      FWEnhancer.init();

      // Check if filters were set from URL
      const state = FWEnhancer.getFilterState();
      expect(state.includeTags).toEqual(['comedy', 'improv']);
      expect(state.limit).toBe(5);
    });

    test('should handle invalid URL parameters gracefully', () => {
      // Set up URL with invalid parameters
      window.history.pushState({}, '', '?limit=invalid&days-of-week=8,9');

      // Initialize enhancer
      FWEnhancer.init();

      // Check if invalid values were handled properly
      const state = FWEnhancer.getFilterState();
      expect(state.limit).toBe(0);
      expect(state.daysOfWeek).toEqual([]);
    });
  });

  describe('Filter State Validation', () => {
    test('should validate date ranges', () => {
      const startDate = new Date('2025-04-30');
      const endDate = new Date('2025-04-01');

      // End date before start date should be adjusted
      FWEnhancer.setFilter('startDate', startDate);
      FWEnhancer.setFilter('endDate', endDate);

      const state = FWEnhancer.getFilterState();
      expect(state.startDate).toEqual(endDate);
      expect(state.endDate).toEqual(startDate);
    });

    test('should validate days of week values', () => {
      // Invalid day numbers should be filtered out
      FWEnhancer.setFilter('daysOfWeek', [-1, 0, 7, 8, 6]);

      const state = FWEnhancer.getFilterState();
      expect(state.daysOfWeek).toEqual([0, 6]);
    });

    test('should validate event limit', () => {
      // Negative limit should be converted to 0
      FWEnhancer.setFilter('limit', -5);

      const state = FWEnhancer.getFilterState();
      expect(state.limit).toBe(0);
    });
  });
});
