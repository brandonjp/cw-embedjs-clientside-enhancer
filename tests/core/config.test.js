import { parseCommaSeparatedValue, parseScriptConfig, validateConfig, DEFAULT_CONFIG } from '../../src/core/config';

describe('Configuration Module', () => {
  describe('parseCommaSeparatedValue', () => {
    test('should parse comma-separated string into array', () => {
      expect(parseCommaSeparatedValue('a,b,c')).toEqual(['a', 'b', 'c']);
    });

    test('should trim whitespace from values', () => {
      expect(parseCommaSeparatedValue(' a , b , c ')).toEqual(['a', 'b', 'c']);
    });

    test('should handle empty string', () => {
      expect(parseCommaSeparatedValue('')).toEqual([]);
    });

    test('should handle null or undefined', () => {
      expect(parseCommaSeparatedValue(null)).toEqual([]);
      expect(parseCommaSeparatedValue(undefined)).toEqual([]);
    });

    test('should filter out empty values', () => {
      expect(parseCommaSeparatedValue('a,,b,  ,c')).toEqual(['a', 'b', 'c']);
    });
  });

  describe('parseScriptConfig', () => {
    let scriptElement;

    beforeEach(() => {
      scriptElement = document.createElement('script');
      scriptElement.id = 'fw_script';
      scriptElement.setAttribute('data-theatre', 'test-theatre');
    });

    test('should throw error if script element is not provided', () => {
      expect(() => parseScriptConfig(null)).toThrow('Script element not found');
    });

    test('should throw error if theatre is not provided', () => {
      scriptElement.removeAttribute('data-theatre');
      expect(() => parseScriptConfig(scriptElement)).toThrow('Theatre name is required');
    });

    test('should parse basic configuration with defaults', () => {
      const config = parseScriptConfig(scriptElement);
      expect(config).toEqual({
        ...DEFAULT_CONFIG,
        theatre: 'test-theatre'
      });
    });

    test('should parse tag filters correctly', () => {
      scriptElement.setAttribute('data-include-tags', 'comedy,improv');
      scriptElement.setAttribute('data-exclude-tags', 'workshop');
      scriptElement.setAttribute('data-tag-match', 'all');

      const config = parseScriptConfig(scriptElement);
      expect(config.includeTags).toEqual(['comedy', 'improv']);
      expect(config.excludeTags).toEqual(['workshop']);
      expect(config.tagMatch).toBe('all');
    });

    test('should parse date range correctly', () => {
      scriptElement.setAttribute('data-date-range', '2025-04-01,2025-04-30');

      const config = parseScriptConfig(scriptElement);
      expect(config.startDate).toBe('2025-04-01');
      expect(config.endDate).toBe('2025-04-30');
    });

    test('should parse days of week correctly', () => {
      scriptElement.setAttribute('data-days-of-week', '1,3,5');

      const config = parseScriptConfig(scriptElement);
      expect(config.daysOfWeek).toEqual([1, 3, 5]);
    });

    test('should parse boolean attributes correctly', () => {
      scriptElement.setAttribute('data-show-filters', 'true');
      scriptElement.setAttribute('data-show-tags', 'true');
      scriptElement.setAttribute('data-combined-view', 'true');

      const config = parseScriptConfig(scriptElement);
      expect(config.showFilters).toBe(true);
      expect(config.showTags).toBe(true);
      expect(config.combinedView).toBe(true);
    });
  });

  describe('validateConfig', () => {
    let validConfig;

    beforeEach(() => {
      validConfig = {
        ...DEFAULT_CONFIG,
        theatre: 'test-theatre'
      };
    });

    test('should not throw for valid config', () => {
      expect(() => validateConfig(validConfig)).not.toThrow();
    });

    test('should throw if theatre is missing', () => {
      delete validConfig.theatre;
      expect(() => validateConfig(validConfig)).toThrow('Theatre name is required');
    });

    test('should throw for invalid tag match', () => {
      validConfig.tagMatch = 'invalid';
      expect(() => validateConfig(validConfig)).toThrow('Tag match must be either "any" or "all"');
    });

    test('should throw for invalid days of week', () => {
      validConfig.daysOfWeek = [0, 7];
      expect(() => validateConfig(validConfig)).toThrow('Days of week must be between 0 and 6');
    });

    test('should throw for negative limit', () => {
      validConfig.limit = -1;
      expect(() => validateConfig(validConfig)).toThrow('Limit must be a positive number');
    });
  });
});
