import { fireEvent } from '@testing-library/dom';
import '@testing-library/jest-dom';

describe('Filter UI Integration', () => {
  beforeEach(() => {
    setupTestEnvironment();
    // Add the filter UI to the DOM
    document.body.innerHTML += `
      <div class="fw-enhancer-filter-container">
        <div class="fw-enhancer-filter-controls">
          <div class="fw-enhancer-filter-dropdown">
            <button class="fw-enhancer-filter-toggle">Filter Events</button>
            <div class="fw-enhancer-filter-panel">
              <!-- Tag filters -->
              <div class="fw-enhancer-tag-filters">
                <label><input type="checkbox" value="comedy"> Comedy</label>
                <label><input type="checkbox" value="improv"> Improv</label>
              </div>
              <!-- Date range -->
              <div class="fw-enhancer-date-range">
                <input type="date" class="fw-enhancer-date-start">
                <input type="date" class="fw-enhancer-date-end">
              </div>
              <!-- Days of week -->
              <div class="fw-enhancer-dow-filters">
                <label><input type="checkbox" value="5"> Friday</label>
                <label><input type="checkbox" value="6"> Saturday</label>
              </div>
              <!-- Limit input -->
              <input type="number" class="fw-enhancer-limit-input">
              <!-- Action buttons -->
              <button class="fw-enhancer-apply-filters">Apply</button>
              <button class="fw-enhancer-reset-filters">Reset</button>
            </div>
          </div>
        </div>
      </div>
    `;
  });

  describe('Filter Panel Visibility', () => {
    test('should show filter panel when toggle is clicked', () => {
      const toggle = document.querySelector('.fw-enhancer-filter-toggle');
      const panel = document.querySelector('.fw-enhancer-filter-panel');

      fireEvent.click(toggle);
      expect(panel).toHaveClass('show');
    });

    test('should hide filter panel when clicking outside', () => {
      const toggle = document.querySelector('.fw-enhancer-filter-toggle');
      const panel = document.querySelector('.fw-enhancer-filter-panel');

      // Show panel
      fireEvent.click(toggle);
      expect(panel).toHaveClass('show');

      // Click outside
      fireEvent.click(document.body);
      expect(panel).not.toHaveClass('show');
    });
  });

  describe('Tag Filter Interaction', () => {
    test('should update filter state when tag checkboxes are changed', () => {
      const comedyCheckbox = document.querySelector('input[value="comedy"]');
      const improvCheckbox = document.querySelector('input[value="improv"]');

      // Check comedy tag
      fireEvent.click(comedyCheckbox);
      expect(comedyCheckbox.checked).toBe(true);

      // Check improv tag
      fireEvent.click(improvCheckbox);
      expect(improvCheckbox.checked).toBe(true);

      // Apply filters
      const applyButton = document.querySelector('.fw-enhancer-apply-filters');
      fireEvent.click(applyButton);

      // Verify filter state
      const state = FWEnhancer.getFilterState();
      expect(state.includeTags).toContain('comedy');
      expect(state.includeTags).toContain('improv');
    });

    test('should clear tag filters when reset is clicked', () => {
      const comedyCheckbox = document.querySelector('input[value="comedy"]');

      // Check comedy tag and apply
      fireEvent.click(comedyCheckbox);
      const applyButton = document.querySelector('.fw-enhancer-apply-filters');
      fireEvent.click(applyButton);

      // Reset filters
      const resetButton = document.querySelector('.fw-enhancer-reset-filters');
      fireEvent.click(resetButton);

      // Verify checkboxes are unchecked
      expect(comedyCheckbox.checked).toBe(false);

      // Verify filter state
      const state = FWEnhancer.getFilterState();
      expect(state.includeTags).toEqual([]);
    });
  });

  describe('Date Range Interaction', () => {
    test('should update filter state when date range is changed', () => {
      const startInput = document.querySelector('.fw-enhancer-date-start');
      const endInput = document.querySelector('.fw-enhancer-date-end');

      // Set date range
      fireEvent.change(startInput, { target: { value: '2025-04-01' } });
      fireEvent.change(endInput, { target: { value: '2025-04-30' } });

      // Apply filters
      const applyButton = document.querySelector('.fw-enhancer-apply-filters');
      fireEvent.click(applyButton);

      // Verify filter state
      const state = FWEnhancer.getFilterState();
      expect(state.startDate).toEqual(new Date('2025-04-01'));
      expect(state.endDate).toEqual(new Date('2025-04-30'));
    });

    test('should clear date range when reset is clicked', () => {
      const startInput = document.querySelector('.fw-enhancer-date-start');
      const endInput = document.querySelector('.fw-enhancer-date-end');

      // Set and apply date range
      fireEvent.change(startInput, { target: { value: '2025-04-01' } });
      fireEvent.change(endInput, { target: { value: '2025-04-30' } });
      const applyButton = document.querySelector('.fw-enhancer-apply-filters');
      fireEvent.click(applyButton);

      // Reset filters
      const resetButton = document.querySelector('.fw-enhancer-reset-filters');
      fireEvent.click(resetButton);

      // Verify inputs are cleared
      expect(startInput.value).toBe('');
      expect(endInput.value).toBe('');

      // Verify filter state
      const state = FWEnhancer.getFilterState();
      expect(state.startDate).toBeNull();
      expect(state.endDate).toBeNull();
    });
  });

  describe('Days of Week Interaction', () => {
    test('should update filter state when day checkboxes are changed', () => {
      const fridayCheckbox = document.querySelector('input[value="5"]');
      const saturdayCheckbox = document.querySelector('input[value="6"]');

      // Check weekend days
      fireEvent.click(fridayCheckbox);
      fireEvent.click(saturdayCheckbox);

      // Apply filters
      const applyButton = document.querySelector('.fw-enhancer-apply-filters');
      fireEvent.click(applyButton);

      // Verify filter state
      const state = FWEnhancer.getFilterState();
      expect(state.daysOfWeek).toEqual([5, 6]);
    });
  });

  describe('Event Limit Interaction', () => {
    test('should update filter state when limit is changed', () => {
      const limitInput = document.querySelector('.fw-enhancer-limit-input');

      // Set limit
      fireEvent.change(limitInput, { target: { value: '10' } });

      // Apply filters
      const applyButton = document.querySelector('.fw-enhancer-apply-filters');
      fireEvent.click(applyButton);

      // Verify filter state
      const state = FWEnhancer.getFilterState();
      expect(state.limit).toBe(10);
    });
  });

  describe('Active Filter Badges', () => {
    test('should display active filter badges when filters are applied', () => {
      // Apply some filters
      const comedyCheckbox = document.querySelector('input[value="comedy"]');
      fireEvent.click(comedyCheckbox);

      const applyButton = document.querySelector('.fw-enhancer-apply-filters');
      fireEvent.click(applyButton);

      // Check for badge
      const badges = document.querySelectorAll('.fw-enhancer-active-filter');
      expect(badges.length).toBeGreaterThan(0);
      expect(badges[0].textContent).toContain('comedy');
    });

    test('should remove filter badge when its remove button is clicked', () => {
      // Apply a filter
      const comedyCheckbox = document.querySelector('input[value="comedy"]');
      fireEvent.click(comedyCheckbox);

      const applyButton = document.querySelector('.fw-enhancer-apply-filters');
      fireEvent.click(applyButton);

      // Find and click the remove button on the badge
      const removeButton = document.querySelector('.fw-enhancer-active-filter button');
      fireEvent.click(removeButton);

      // Verify badge is removed
      const badges = document.querySelectorAll('.fw-enhancer-active-filter');
      expect(badges.length).toBe(0);

      // Verify filter state
      const state = FWEnhancer.getFilterState();
      expect(state.includeTags).toEqual([]);
    });
  });
});
