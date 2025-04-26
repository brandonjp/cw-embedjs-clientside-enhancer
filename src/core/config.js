/**
 * Configuration module for CrowdWork Embed Enhancer
 * Handles parsing and managing configuration from script attributes
 */

export const DEFAULT_CONFIG = {
  includeTags: [],
  excludeTags: [],
  tagMatch: 'any',
  startDate: null,
  endDate: null,
  daysOfWeek: [],
  limit: 0,
  specialFilter: '',
  showFilters: false,
  showTags: false,
  combinedView: false
};

/**
 * Parse a comma-separated string into an array
 * @param {string} value - Comma-separated string
 * @returns {string[]} Array of trimmed values
 */
export function parseCommaSeparatedValue(value) {
  if (!value) return [];
  return value.split(',').map(item => item.trim()).filter(Boolean);
}

/**
 * Parse configuration from script attributes
 * @param {HTMLElement} scriptElement - The original script element
 * @returns {Object} Configuration object
 */
export function parseScriptConfig(scriptElement) {
  if (!scriptElement) {
    throw new Error('Script element not found');
  }

  const config = { ...DEFAULT_CONFIG };

  // Parse basic attributes
  config.theatre = scriptElement.getAttribute('data-theatre');
  if (!config.theatre) {
    throw new Error('Theatre name is required');
  }

  // Parse tag filters
  config.includeTags = parseCommaSeparatedValue(scriptElement.getAttribute('data-include-tags'));
  config.excludeTags = parseCommaSeparatedValue(scriptElement.getAttribute('data-exclude-tags'));
  config.tagMatch = scriptElement.getAttribute('data-tag-match') || DEFAULT_CONFIG.tagMatch;

  // Parse date range
  const dateRange = scriptElement.getAttribute('data-date-range');
  if (dateRange) {
    const [start, end] = dateRange.split(',').map(d => d.trim());
    config.startDate = start || null;
    config.endDate = end || null;
  }

  // Parse days of week
  const daysOfWeek = scriptElement.getAttribute('data-days-of-week');
  config.daysOfWeek = daysOfWeek ?
    parseCommaSeparatedValue(daysOfWeek).map(Number) :
    DEFAULT_CONFIG.daysOfWeek;

  // Parse numeric values
  config.limit = parseInt(scriptElement.getAttribute('data-limit')) || DEFAULT_CONFIG.limit;

  // Parse boolean values
  config.showFilters = scriptElement.getAttribute('data-show-filters') === 'true';
  config.showTags = scriptElement.getAttribute('data-show-tags') === 'true';
  config.combinedView = scriptElement.getAttribute('data-combined-view') === 'true';

  // Parse special filter
  config.specialFilter = scriptElement.getAttribute('data-special-filter') || DEFAULT_CONFIG.specialFilter;

  return config;
}

/**
 * Validate configuration object
 * @param {Object} config - Configuration object to validate
 * @throws {Error} If configuration is invalid
 */
export function validateConfig(config) {
  if (!config.theatre) {
    throw new Error('Theatre name is required');
  }

  if (config.tagMatch && !['any', 'all'].includes(config.tagMatch)) {
    throw new Error('Tag match must be either "any" or "all"');
  }

  if (config.daysOfWeek.some(day => day < 0 || day > 6)) {
    throw new Error('Days of week must be between 0 and 6');
  }

  if (config.limit < 0) {
    throw new Error('Limit must be a positive number');
  }
}
