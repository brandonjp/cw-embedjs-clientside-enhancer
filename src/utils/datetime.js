/**
 * Format a date object to ISO string
 * @param {Date|null} date - The date to format
 * @returns {string} The formatted date string
 */
export function formatDate(date) {
  if (!date) return '';
  return date.toISOString();
}

/**
 * Parse an ISO date string into a Date object
 * @param {string} dateStr - The date string to parse
 * @returns {Date|null} The parsed Date object or null if invalid
 */
export function parseDate(dateStr) {
  try {
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  } catch (e) {
    return null;
  }
}

/**
 * Validate a date range
 * @param {Date|null} startDate - The start date
 * @param {Date|null} endDate - The end date
 * @returns {boolean} Whether the range is valid
 */
export function validateDateRange(startDate, endDate) {
  if (!startDate || !endDate) return false;
  return startDate.getTime() <= endDate.getTime();
}

/**
 * Get an array of dates between start and end dates (inclusive)
 * @param {Date} startDate - The start date
 * @param {Date} endDate - The end date
 * @returns {Date[]} Array of dates between start and end
 */
export function getDatesBetween(startDate, endDate) {
  if (!validateDateRange(startDate, endDate)) return [];

  const dates = [];
  const currentDate = new Date(startDate);

  while (currentDate <= endDate) {
    dates.push(new Date(currentDate));
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return dates;
}
