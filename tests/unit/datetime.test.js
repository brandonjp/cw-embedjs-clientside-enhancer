import { formatDate, parseDate, validateDateRange, getDatesBetween } from '../../src/utils/datetime';

describe('Datetime Utilities', () => {
  describe('formatDate', () => {
    test('formats date to ISO string', () => {
      const date = new Date('2025-04-15T12:00:00Z');
      expect(formatDate(date)).toBe('2025-04-15T12:00:00Z');
    });

    test('handles null date', () => {
      expect(formatDate(null)).toBe('');
    });
  });

  describe('parseDate', () => {
    test('parses ISO date string', () => {
      const dateStr = '2025-04-15T12:00:00Z';
      const parsed = parseDate(dateStr);
      expect(parsed instanceof Date).toBe(true);
      expect(parsed.toISOString()).toBe(dateStr);
    });

    test('returns null for invalid date string', () => {
      expect(parseDate('invalid')).toBeNull();
    });
  });

  describe('validateDateRange', () => {
    test('validates valid date range', () => {
      const start = new Date('2025-04-15');
      const end = new Date('2025-04-20');
      expect(validateDateRange(start, end)).toBe(true);
    });

    test('invalidates when end date is before start date', () => {
      const start = new Date('2025-04-20');
      const end = new Date('2025-04-15');
      expect(validateDateRange(start, end)).toBe(false);
    });

    test('invalidates when either date is null', () => {
      const date = new Date('2025-04-15');
      expect(validateDateRange(null, date)).toBe(false);
      expect(validateDateRange(date, null)).toBe(false);
      expect(validateDateRange(null, null)).toBe(false);
    });
  });

  describe('getDatesBetween', () => {
    test('returns array of dates between start and end', () => {
      const start = new Date('2025-04-15');
      const end = new Date('2025-04-17');
      const dates = getDatesBetween(start, end);

      expect(dates).toHaveLength(3);
      expect(dates[0].toISOString()).toContain('2025-04-15');
      expect(dates[1].toISOString()).toContain('2025-04-16');
      expect(dates[2].toISOString()).toContain('2025-04-17');
    });

    test('returns empty array for invalid range', () => {
      const start = new Date('2025-04-17');
      const end = new Date('2025-04-15');
      expect(getDatesBetween(start, end)).toHaveLength(0);
    });

    test('returns single date when start equals end', () => {
      const date = new Date('2025-04-15');
      const dates = getDatesBetween(date, date);
      expect(dates).toHaveLength(1);
      expect(dates[0].toISOString()).toContain('2025-04-15');
    });
  });
});
