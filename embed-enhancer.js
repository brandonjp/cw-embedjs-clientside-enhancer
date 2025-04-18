/**
 * CrowdWork Event Display Embed Script Enhancer v2.1.6
 * 
 * This script enhances the original embed.js with advanced filtering capabilities
 * without modifying the original script. It adds client-side filtering and display options
 * to both calendar and card views.
 * 
 * Usage:
 * 1. First include the original embed.js with your desired configuration
 * 2. Then include this script right after it
 * 
 * <script id="fw_script" src="https://crowdwork.com/embed.js?v=BETA-2025-04" data-theatre="your-theatre"></script>
 * <script src="https://path-to/embed-enhancer.js"></script>
 * 
 * Additional data attributes for enhanced filtering:
 * - data-include-tags: Comma-separated list of tags to include
 * - data-exclude-tags: Comma-separated list of tags to exclude
 * - data-tag-match: "any" (default) or "all" - whether to match any or all included tags
 * - data-date-range: Comma-separated start and end dates in YYYY-MM-DD format
 * - data-date-offset: Time period from today, e.g. "7d", "2w", "1m"
 * - data-days-of-week: Comma-separated days (0-6, 0=Sunday) to include
 * - data-special-filter: Predefined filters like "this-week", "next-weekend", etc.
 * - data-limit: Maximum number of events to display
 * - data-combined-view: "true" to show both shows and classes in one view
 * - data-show-filters: "false" to hide the filter button (default is "true")
 */

(function() {
  // Constants
  const SCRIPT_ID = "fw_enhancer";
  const FILTER_PANEL_CLASS = "fw-enhancer-filter-panel";
  const ORIGINAL_SCRIPT_SELECTOR = "#fw_script";
  
  // Cache for event data
  let cachedData = {
    shows: [],
    classes: []
  };
  
  // Current filter state
  let filterState = {
    includeTags: [],
    excludeTags: [],
    tagMatch: "any",
    startDate: null,
    endDate: null,
    daysOfWeek: [],
    limit: 0,
    specialFilter: ""
  };
  
  // Filter UI template
  const filterUITemplate = `
    <div class="fw-enhancer-filter-container">
      <div class="fw-enhancer-filter-controls">
        <div class="fw-enhancer-filter-dropdown">
          <button class="fw-enhancer-filter-toggle">Filter Events</button>
          <div class="fw-enhancer-filter-panel">
            <div class="fw-enhancer-filter-section">
              <label>Tags:</label>
              <div class="fw-enhancer-tag-filters"></div>
            </div>
            <div class="fw-enhancer-filter-section fw-enhancer-date-filters">
              <label>Date Range:</label>
              <div class="fw-enhancer-date-range">
                <input type="date" class="fw-enhancer-date-start" placeholder="Start date">
                <span>to</span>
                <input type="date" class="fw-enhancer-date-end" placeholder="End date">
              </div>
            </div>
            <div class="fw-enhancer-filter-section">
              <label>Quick Filters:</label>
              <div class="fw-enhancer-quick-filters">
                <button data-filter="this-week">This Week</button>
                <button data-filter="next-weekend">Next Weekend</button>
                <button data-filter="next-7-days">Next 7 Days</button>
                <button data-filter="next-30-days">Next 30 Days</button>
              </div>
            </div>
            <div class="fw-enhancer-filter-section">
              <label>Days of Week:</label>
              <div class="fw-enhancer-dow-filters">
                <label><input type="checkbox" value="0" /> Sun</label>
                <label><input type="checkbox" value="1" /> Mon</label>
                <label><input type="checkbox" value="2" /> Tue</label>
                <label><input type="checkbox" value="3" /> Wed</label>
                <label><input type="checkbox" value="4" /> Thu</label>
                <label><input type="checkbox" value="5" /> Fri</label>
                <label><input type="checkbox" value="6" /> Sat</label>
              </div>
            </div>
            <div class="fw-enhancer-filter-section">
              <label>Show:</label>
              <input type="number" class="fw-enhancer-limit-input" min="1" placeholder="Event limit">
            </div>
            <div class="fw-enhancer-filter-actions">
              <button class="fw-enhancer-apply-filters">Apply Filters</button>
              <button class="fw-enhancer-reset-filters">Reset</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // Add styles for the enhancer
  function addStyles() {
    const styleEl = document.createElement('style');
    styleEl.id = `${SCRIPT_ID}-styles`;
    styleEl.textContent = `
      .fw-enhancer-filter-container {
        margin-bottom: 20px;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      
      .fw-enhancer-filter-dropdown {
        position: relative;
        display: inline-block;
      }
      
      .fw-enhancer-filter-toggle {
        background-color: #4a6cf7;
        color: white;
        padding: 8px 16px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 14px;
      }
      
      .fw-enhancer-filter-panel {
        display: none;
        position: absolute;
        background-color: #f9f9f9;
        min-width: 300px;
        box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        padding: 12px;
        z-index: 100;
        border-radius: 4px;
        margin-top: 5px;
        max-height: 80vh;
        overflow-y: auto;
      }
      
      .fw-enhancer-filter-panel.show {
        display: block;
      }
      
      .fw-enhancer-filter-section {
        margin-bottom: 12px;
        padding-bottom: 12px;
        border-bottom: 1px solid #eee;
      }
      
      .fw-enhancer-filter-section label {
        display: block;
        margin-bottom: 6px;
        font-weight: bold;
        font-size: 14px;
      }
      
      .fw-enhancer-tag-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .fw-enhancer-tag-filter {
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
      }
      
      .fw-enhancer-date-range {
        display: flex;
        gap: 8px;
        align-items: center;
      }
      
      .fw-enhancer-date-range input {
        padding: 6px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .fw-enhancer-quick-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .fw-enhancer-quick-filters button {
        background-color: #f0f0f0;
        border: 1px solid #ddd;
        border-radius: 4px;
        padding: 4px 8px;
        font-size: 12px;
        cursor: pointer;
      }
      
      .fw-enhancer-quick-filters button:hover {
        background-color: #e0e0e0;
      }
      
      .fw-enhancer-dow-filters {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .fw-enhancer-dow-filters label {
        font-weight: normal;
        display: flex;
        align-items: center;
        gap: 4px;
        font-size: 13px;
      }
      
      .fw-enhancer-limit-input {
        width: 80px;
        padding: 6px;
        border: 1px solid #ddd;
        border-radius: 4px;
      }
      
      .fw-enhancer-filter-actions {
        display: flex;
        justify-content: space-between;
        margin-top: 12px;
      }
      
      .fw-enhancer-filter-actions button {
        padding: 6px 12px;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-size: 13px;
      }
      
      .fw-enhancer-apply-filters {
        background-color: #4a6cf7;
        color: white;
      }
      
      .fw-enhancer-reset-filters {
        background-color: #f0f0f0;
      }
      
      .fw-enhancer-tag-badge {
        display: inline-block;
        background-color: #e9ecef;
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        margin-right: 4px;
        margin-bottom: 4px;
      }
      
      .fw-enhancer-event-tag {
        display: inline-block;
        background-color: rgba(0,0,0,0.1);
        color: #333;
        padding: 0 4px;
        border-radius: 3px;
        font-size: 10px;
        margin-right: 2px;
      }
      
      .fw-enhancer-type-badge {
        position: absolute;
        top: 10px;
        left: 10px;
        z-index: 2;
        padding: 3px 8px;
        font-size: 11px;
        border-radius: 3px;
      }
      
      .fw-enhancer-class-badge {
        background-color: #28a745;
        color: white;
      }
      
      .fw-enhancer-show-badge {
        background-color: #007bff;
        color: white;
      }
      
      .fw-cards a .fw-card .tag-badges {
        display: flex;
        flex-wrap: wrap;
        margin-top: 8px;
      }
      
      .fw-no-events {
        text-align: center;
        padding: 30px;
        font-size: 16px;
        color: #666;
      }
      
      .fw-enhancer-filter-badge-container {
        margin-top: 16px;
        margin-bottom: 8px;
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      
      .fw-enhancer-active-filter {
        display: inline-flex;
        align-items: center;
        background-color: #e6f3ff;
        padding: 3px 10px;
        border-radius: 12px;
        font-size: 12px;
        gap: 5px;
      }
      
      .fw-enhancer-active-filter button {
        border: none;
        background: none;
        color: #666;
        cursor: pointer;
        font-size: 14px;
        padding: 0;
        display: flex;
        align-items: center;
      }
      
      /* New loading overlay styles */
      .fw-enhancer-loading-overlay {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        padding-top: 70px;
        background-color: rgba(255, 255, 255, 0.9);
        z-index: 1000;
        font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      }
      
      .fw-enhancer-loading-overlay .spinner {
        width: 70px;
        height: 70px;
        margin-bottom: 20px;
      }
      
      .fw-enhancer-loading-overlay .spinner:after {
        content: " ";
        display: block;
        width: 64px;
        height: 64px;
        border-radius: 50%;
        border: 6px solid #4a6cf7;
        border-color: #4a6cf7 transparent #4a6cf7 transparent;
        animation: fw-enhancer-spinner 1.2s linear infinite;
      }
      
      .fw-enhancer-loading-overlay .message {
        font-size: 18px;
        color: #333;
        text-align: center;
      }
      
      @keyframes fw-enhancer-spinner {
        0% {
          transform: rotate(0deg);
        }
        100% {
          transform: rotate(360deg);
        }
      }
      
      .fw-enhancer-loading {
        display: inline-block;
        position: relative;
        width: 80px;
        height: 80px;
      }
      
      .fw-enhancer-loading .spinner {
        box-sizing: border-box;
        display: block;
        position: absolute;
        width: 64px;
        height: 64px;
        margin: 8px;
        border: 8px solid #4a6cf7;
        border-radius: 50%;
        border-color: #4a6cf7 transparent transparent transparent;
        animation: fw-enhancer-spinner 1.2s cubic-bezier(0.5, 0, 0.5, 1) infinite;
      }
    `;
    document.head.appendChild(styleEl);
  }
  
  // Read configuration from original script
  function getOriginalScriptConfig() {
    const originalScript = document.querySelector(ORIGINAL_SCRIPT_SELECTOR);
    if (!originalScript) {
      console.error("Enhancer Error: Original script not found. Please make sure the original embed script is loaded with id 'fw_script'.");
      return null;
    }
    
    return {
      theatre: originalScript.getAttribute("data-theatre"),
      type: originalScript.getAttribute("data-type") || "shows",
      view: originalScript.getAttribute("data-view"),
      category: originalScript.getAttribute("data-category"),
      development: originalScript.getAttribute("data-development") === "true",
      // Enhancer-specific attributes
      includeTags: originalScript.getAttribute("data-include-tags"),
      excludeTags: originalScript.getAttribute("data-exclude-tags"),
      tagMatch: originalScript.getAttribute("data-tag-match") || "any",
      dateRange: originalScript.getAttribute("data-date-range"),
      dateOffset: originalScript.getAttribute("data-date-offset"),
      daysOfWeek: originalScript.getAttribute("data-days-of-week"),
      specialFilter: originalScript.getAttribute("data-special-filter"),
      limit: parseInt(originalScript.getAttribute("data-limit") || "0", 10),
      combinedView: originalScript.getAttribute("data-combined-view") === "true",
      showFilters: originalScript.getAttribute("data-show-filters") === "true" // default to false
    };
  }
  
  // Initialize filter state from configuration
  function initializeFilterState(config) {
    // Initialize tag filters
    if (config.includeTags) {
      filterState.includeTags = config.includeTags.split(',').map(tag => tag.trim());
    }
    
    if (config.excludeTags) {
      filterState.excludeTags = config.excludeTags.split(',').map(tag => tag.trim());
    }
    
    // Set tag match mode
    filterState.tagMatch = config.tagMatch;
    
    // Set limit
    filterState.limit = config.limit;
    
    // Set days of week filter
    if (config.daysOfWeek) {
      filterState.daysOfWeek = config.daysOfWeek.split(',').map(day => parseInt(day.trim(), 10));
    }
    
    // Set special filter
    filterState.specialFilter = config.specialFilter || "";
    
    // Process date filters
    initializeSpecialDateFilters(config);
  }
  
  // Initialize filter state from URL parameters
  function initializeFromURLParams() {
    const urlParams = new URLSearchParams(window.location.search);
    
    if (urlParams.has('include-tags')) {
      filterState.includeTags = urlParams.get('include-tags').split(',').map(tag => tag.trim());
    }
    
    if (urlParams.has('exclude-tags')) {
      filterState.excludeTags = urlParams.get('exclude-tags').split(',').map(tag => tag.trim());
    }
    
    if (urlParams.has('tag-match')) {
      filterState.tagMatch = urlParams.get('tag-match');
    }
    
    if (urlParams.has('start-date')) {
      filterState.startDate = new Date(urlParams.get('start-date'));
    }
    
    if (urlParams.has('end-date')) {
      filterState.endDate = new Date(urlParams.get('end-date'));
    }
    
    if (urlParams.has('days-of-week')) {
      filterState.daysOfWeek = urlParams.get('days-of-week').split(',').map(day => parseInt(day.trim(), 10));
    }
    
    if (urlParams.has('limit')) {
      filterState.limit = parseInt(urlParams.get('limit'), 10);
    }
    
    if (urlParams.has('special-filter')) {
      filterState.specialFilter = urlParams.get('special-filter');
    }
  }
  
  // Initialize date ranges from special filters
  function initializeSpecialDateFilters(config) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    // Handle date offset (e.g., "7d", "2w", "1m")
    if (config.dateOffset) {
      const value = parseInt(config.dateOffset.slice(0, -1), 10);
      const unit = config.dateOffset.slice(-1);
      const endDate = new Date(today);
      
      switch(unit) {
        case 'd': // days
          endDate.setDate(today.getDate() + value);
          break;
        case 'w': // weeks
          endDate.setDate(today.getDate() + (value * 7));
          break;
        case 'm': // months
          endDate.setMonth(today.getMonth() + value);
          break;
      }
      
      filterState.startDate = today;
      filterState.endDate = endDate;
    }
    
    // Handle explicit date range (e.g., "2025-04-01,2025-04-30")
    if (config.dateRange) {
      const [startStr, endStr] = config.dateRange.split(',');
      
      // First date only: from that date to forever
      if (startStr && !endStr) {
        filterState.startDate = new Date(startStr);
        filterState.endDate = null;
      }
      // End date only: from today to that date
      else if (!startStr && endStr) {
        filterState.startDate = new Date(); // Today
        filterState.endDate = new Date(endStr);
      }
      // Both dates: use the specified range
      else if (startStr && endStr) {
        filterState.startDate = new Date(startStr);
        filterState.endDate = new Date(endStr);
      }
    }
    
    // Handle special filters
    if (config.specialFilter || filterState.specialFilter) {
      const filter = config.specialFilter || filterState.specialFilter;
      
      switch(filter) {
        case 'this-week': {
          const startDate = new Date(today);
          const day = startDate.getDay();
          startDate.setDate(startDate.getDate() - day + (day === 0 ? -6 : 1)); // Start with Monday
          
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6); // End with Sunday
          
          filterState.startDate = startDate;
          filterState.endDate = endDate;
          break;
        }
        case 'next-week': {
          const startDate = new Date(today);
          const day = startDate.getDay();
          startDate.setDate(startDate.getDate() - day + (day === 0 ? -6 : 1) + 7); // Next Monday
          
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 6); // End with Sunday
          
          filterState.startDate = startDate;
          filterState.endDate = endDate;
          break;
        }
        case 'this-weekend': {
          const startDate = new Date(today);
          const day = startDate.getDay();
          if (day === 6) { // Saturday
            // Weekend starts today
          } else if (day === 0) { // Sunday
            startDate.setDate(startDate.getDate() - 1); // Yesterday was start of weekend
          } else {
            startDate.setDate(startDate.getDate() + (5 - day + 1)); // Next Saturday
          }
          
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 1); // Sunday
          
          filterState.startDate = startDate;
          filterState.endDate = endDate;
          break;
        }
        case 'next-weekend': {
          const startDate = new Date(today);
          const day = startDate.getDay();
          
          if (day >= 1 && day <= 5) { // Monday-Friday
            startDate.setDate(startDate.getDate() + (6 - day)); // This coming Saturday
          } else {
            startDate.setDate(startDate.getDate() + (6 + (7 - day))); // Next Saturday
          }
          
          const endDate = new Date(startDate);
          endDate.setDate(startDate.getDate() + 1); // Sunday
          
          filterState.startDate = startDate;
          filterState.endDate = endDate;
          break;
        }
        case 'next-7-days': {
          const endDate = new Date(today);
          endDate.setDate(today.getDate() + 7);
          
          filterState.startDate = today;
          filterState.endDate = endDate;
          break;
        }
        case 'next-30-days': {
          const endDate = new Date(today);
          endDate.setDate(today.getDate() + 30);
          
          filterState.startDate = today;
          filterState.endDate = endDate;
          break;
        }
      }
    }
  }
  
  // Update URL with current filter state for sharing
  function updateURLWithFilters() {
    if (!history.pushState) return; // Check browser support
    
    const url = new URL(window.location.href);
    const params = url.searchParams;
    
    // Clear existing filter params
    ['include-tags', 'exclude-tags', 'tag-match', 'start-date', 'end-date', 
     'days-of-week', 'limit', 'special-filter'].forEach(param => {
      params.delete(param);
    });
    
    // Add current filter state to URL
    if (filterState.includeTags.length > 0) {
      params.set('include-tags', filterState.includeTags.join(','));
    }
    
    if (filterState.excludeTags.length > 0) {
      params.set('exclude-tags', filterState.excludeTags.join(','));
    }
    
    if (filterState.tagMatch !== 'any') {
      params.set('tag-match', filterState.tagMatch);
    }
    
    if (filterState.startDate) {
      params.set('start-date', filterState.startDate.toISOString().split('T')[0]);
    }
    
    if (filterState.endDate) {
      params.set('end-date', filterState.endDate.toISOString().split('T')[0]);
    }
    
    if (filterState.daysOfWeek.length > 0) {
      params.set('days-of-week', filterState.daysOfWeek.join(','));
    }
    
    if (filterState.limit > 0) {
      params.set('limit', filterState.limit.toString());
    }
    
    if (filterState.specialFilter) {
      params.set('special-filter', filterState.specialFilter);
    }
    
    // Update URL without reloading the page
    history.pushState({}, '', url.toString());
  }
  
  // Helper functions for API calls
  function getApiBaseUrl(config) {
    const http = config.development ? "http" : "https";
    const mainUrl = config.development ? "lvh.me:3000" : "crowdwork.com";
    return `${http}://${config.theatre}.${mainUrl}/api/v1`;
  }
  
  // Fetch events from API
  async function fetchEvents(config, dataType) {
    const baseUrl = getApiBaseUrl(config);
    const url = `${baseUrl}/${dataType}?cache=${new Date().getTime()}`;
    
    // Add category filter if set
    const urlWithParams = config.category ? 
      `${url}&category=${encodeURIComponent(config.category)}` : url;
    
    try {
      const response = await fetch(urlWithParams);
      const data = await response.json();
      return processApiData(data, dataType);
    } catch (error) {
      console.error(`Error fetching ${dataType}:`, error);
      return [];
    }
  }
  
  // Process API data into standardized event objects
  function processApiData(jsonData, dataType) {
    const events = [];
    const http = getOriginalScriptConfig().development ? "http" : "https";
    const mainUrl = getOriginalScriptConfig().development ? "lvh.me:3000" : "crowdwork.com";
    
    // Loop through each item in the data
    Object.keys(jsonData.data).forEach((key) => {
      const item = jsonData.data[key];
      const itemDates = item.dates;
      
      // Skip if the item is past the display until date
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      if (new Date(item.display_until) < today) return;
      
      // Each item has a dates array. Loop through each one and add to events array
      let alreadyInserted = false;
      
      for (let i = 0; i < itemDates.length; i++) {
        // If this is a card view and we've already added one date for this item, skip
        // Only one card per event is needed
        if (getOriginalScriptConfig().view === "cards" && alreadyInserted) break;
        alreadyInserted = true;
        
        let description = "No description given.";
        if (item.description && item.description.body) {
          description = item.description.body;
        }
        
        // Format image URL for dev/prod
        let imgURL = item.img.url;
        if (getOriginalScriptConfig().development) {
          imgURL = `${http}://${mainUrl}${item.img.url}`;
        }
        
        // Extract tags for filtering purposes
        let tags = item.tags || [];
        if (item.category) {
          tags.push(item.category);
        }
        
        events.push({
          title: item.name,
          start: itemDates[i],
          description,
          img: imgURL,
          cost: item.cost ? item.cost.formatted : null,
          show_url: item.url,
          grouped_dates: item.grouped_dates,
          next_date: item.next_date || itemDates[itemDates.length - 1], // Default to last date if no "next_date"
          tags,
          type: dataType
        });
      }
    });
    
    return events;
  }
  
  // Apply filters to events
  function applyFilters(events, filterState) {
    let filteredEvents = [...events];
    
    // Apply tag inclusion filter
    if (filterState.includeTags.length > 0) {
      filteredEvents = filteredEvents.filter(event => {
        const eventTags = event.tags || [];
        
        if (filterState.tagMatch === "all") {
          // Event must have ALL specified tags
          return filterState.includeTags.every(tag => eventTags.includes(tag));
        } else {
          // Event must have ANY of the specified tags
          return filterState.includeTags.some(tag => eventTags.includes(tag));
        }
      });
    }
    
    // Apply tag exclusion filter
    if (filterState.excludeTags.length > 0) {
      filteredEvents = filteredEvents.filter(event => {
        const eventTags = event.tags || [];
        // Event must not have ANY of the excluded tags
        return !filterState.excludeTags.some(tag => eventTags.includes(tag));
      });
    }
    
    // Apply date range filter
    if (filterState.startDate || filterState.endDate) {
      filteredEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.start);
        
        if (filterState.startDate && filterState.endDate) {
          return eventDate >= filterState.startDate && eventDate <= filterState.endDate;
        } else if (filterState.startDate) {
          return eventDate >= filterState.startDate;
        } else if (filterState.endDate) {
          return eventDate <= filterState.endDate;
        }
        
        return true;
      });
    }
    
    // Apply day of week filter
    if (filterState.daysOfWeek.length > 0) {
      filteredEvents = filteredEvents.filter(event => {
        const eventDate = new Date(event.start);
        const dayOfWeek = eventDate.getDay(); // 0 = Sunday, 1 = Monday, etc.
        return filterState.daysOfWeek.includes(dayOfWeek);
      });
    }
    
    // Sort events by date
    filteredEvents.sort((a, b) => new Date(a.start) - new Date(b.start));
    
    // Apply limit if needed
    if (filterState.limit > 0 && filteredEvents.length > filterState.limit) {
      filteredEvents = filteredEvents.slice(0, filterState.limit);
    }
    
    return filteredEvents;
  }
  
  // DOM manipulation functions
  function setupFilterUI(embedElement, config) {
    if (!embedElement) return;
    
    // Only show filter UI if config.showFilters is true
    if (!config.showFilters) {
      return () => {}; // Return an empty function if filters shouldn't be shown
    }
    
    // Insert filter UI above the embed
    const filterContainer = document.createElement('div');
    filterContainer.id = `${SCRIPT_ID}-filter-container`;
    filterContainer.innerHTML = filterUITemplate;
    
    // Insert before the embed element
    embedElement.parentNode.insertBefore(filterContainer, embedElement);
    
    // Populate tag filters once we have data
    const populateTagFilters = () => {
      const tagFilterContainer = document.querySelector('.fw-enhancer-tag-filters');
      if (!tagFilterContainer) return;
      
      // Get unique tags from all events
      const allTags = new Set();
      
      [...cachedData.shows, ...cachedData.classes].forEach(event => {
        if (event.tags && Array.isArray(event.tags)) {
          event.tags.forEach(tag => allTags.add(tag));
        }
      });
      
      // Create tag filter UI
      Array.from(allTags).sort().forEach(tag => {
        const tagEl = document.createElement('label');
        tagEl.classList.add('fw-enhancer-tag-filter');
        
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.value = tag;
        checkbox.checked = filterState.includeTags.includes(tag);
        
        tagEl.appendChild(checkbox);
        tagEl.appendChild(document.createTextNode(tag));
        tagFilterContainer.appendChild(tagEl);
      });
    };
    
    // Set up date range inputs
    const dateStartInput = document.querySelector('.fw-enhancer-date-start');
    const dateEndInput = document.querySelector('.fw-enhancer-date-end');
    
    if (dateStartInput && filterState.startDate) {
      dateStartInput.value = filterState.startDate.toISOString().split('T')[0];
    }
    
    if (dateEndInput && filterState.endDate) {
      dateEndInput.value = filterState.endDate.toISOString().split('T')[0];
    }
    
    // Set up days of week checkboxes
    filterState.daysOfWeek.forEach(day => {
      const checkbox = document.querySelector(`.fw-enhancer-dow-filters input[value="${day}"]`);
      if (checkbox) checkbox.checked = true;
    });
    
    // Set up limit input
    const limitInput = document.querySelector('.fw-enhancer-limit-input');
    if (limitInput && filterState.limit > 0) {
      limitInput.value = filterState.limit;
    }
    
    // Event listener for apply filters button
    const applyBtn = document.querySelector('.fw-enhancer-apply-filters');
    if (applyBtn) {
      applyBtn.addEventListener('click', () => {
        // Gather tag filters
        const includeTags = Array.from(document.querySelectorAll('.fw-enhancer-tag-filters input:checked'))
          .map(checkbox => checkbox.value);
        
        // Get date range filters
        const startDateStr = dateStartInput ? dateStartInput.value : '';
        const endDateStr = dateEndInput ? dateEndInput.value : '';
        
        // Get days of week filters
        const daysOfWeek = Array.from(document.querySelectorAll('.fw-enhancer-dow-filters input:checked'))
          .map(checkbox => parseInt(checkbox.value, 10));
        
        // Get limit
        const limit = limitInput ? parseInt(limitInput.value, 10) || 0 : 0;
        
        // Update filter state
        filterState.includeTags = includeTags;
        filterState.startDate = startDateStr ? new Date(startDateStr) : null;
        filterState.endDate = endDateStr ? new Date(endDateStr) : null;
        filterState.daysOfWeek = daysOfWeek;
        filterState.limit = limit;
        
        // Update URL
        updateURLWithFilters();
        
        // Apply filtering
        applyFilteringToOriginalElements(config);
        
        // Add active filter badges
        updateActiveFilterBadges(embedElement);
      });
    }
    
    // Event listener for reset filters button
    const resetBtn = document.querySelector('.fw-enhancer-reset-filters');
    if (resetBtn) {
      resetBtn.addEventListener('click', () => {
        // Reset filter state
        filterState = {
          includeTags: [],
          excludeTags: [],
          tagMatch: "any",
          startDate: null,
          endDate: null,
          daysOfWeek: [],
          limit: 0,
          specialFilter: ""
        };
        
        // Reset UI
        document.querySelectorAll('.fw-enhancer-tag-filters input').forEach(checkbox => {
          checkbox.checked = false;
        });
        
        document.querySelectorAll('.fw-enhancer-dow-filters input').forEach(checkbox => {
          checkbox.checked = false;
        });
        
        if (dateStartInput) dateStartInput.value = '';
        if (dateEndInput) dateEndInput.value = '';
        if (limitInput) limitInput.value = '';
        
        // Update URL
        updateURLWithFilters();
        
        // Apply filtering
        applyFilteringToOriginalElements(config);
        
        // Remove filter badges
        const badgeContainer = document.querySelector('.fw-enhancer-filter-badge-container');
        if (badgeContainer) {
          badgeContainer.remove();
        }
      });
    }
    
    // Event listener for quick filters
    document.querySelectorAll('.fw-enhancer-quick-filters button').forEach(button => {
      button.addEventListener('click', () => {
        const filterType = button.getAttribute('data-filter');
        filterState.specialFilter = filterType;
        
        // Reset date inputs as they'll be calculated by the filter
        if (dateStartInput) dateStartInput.value = '';
        if (dateEndInput) dateEndInput.value = '';
        
        // Apply the special filter
        initializeSpecialDateFilters(config);
        
        // Update date inputs with the new calculated dates
        if (dateStartInput && filterState.startDate) {
          dateStartInput.value = filterState.startDate.toISOString().split('T')[0];
        }
        
        if (dateEndInput && filterState.endDate) {
          dateEndInput.value = filterState.endDate.toISOString().split('T')[0];
        }
        
        // Update URL
        updateURLWithFilters();
        
        // Apply filtering
        applyFilteringToOriginalElements(config);
        
        // Add active filter badges
        updateActiveFilterBadges(embedElement);
      });
    });
    
    // Toggle filter panel
    const toggleButton = document.querySelector('.fw-enhancer-filter-toggle');
    const filterPanel = document.querySelector('.fw-enhancer-filter-panel');
    
    if (toggleButton && filterPanel) {
      toggleButton.addEventListener('click', () => {
        filterPanel.classList.toggle('show');
      });
      
      // Close panel when clicking outside
      document.addEventListener('click', (event) => {
        if (!filterContainer.contains(event.target)) {
          filterPanel.classList.remove('show');
        }
      });
    }
    
    return populateTagFilters;
  }
  
  // Show currently active filters as badges
  function updateActiveFilterBadges(embedElement) {
    // Check if filters should be shown
    const config = getOriginalScriptConfig();
    if (!config || !config.showFilters) {
      return; // Don't show filter badges if filters are disabled
    }
    
    // Remove existing badges
    const existingBadges = document.querySelector('.fw-enhancer-filter-badge-container');
    if (existingBadges) {
      existingBadges.remove();
    }
    
    // If no filters are active, don't show badges
    if (
      filterState.includeTags.length === 0 &&
      filterState.excludeTags.length === 0 &&
      !filterState.startDate &&
      !filterState.endDate &&
      filterState.daysOfWeek.length === 0 &&
      filterState.limit === 0 &&
      !filterState.specialFilter
    ) {
      return;
    }
    
    // Create badge container
    const badgeContainer = document.createElement('div');
    badgeContainer.classList.add('fw-enhancer-filter-badge-container');
    
    // Add "Active Filters:" label
    const label = document.createElement('div');
    label.textContent = 'Active Filters:';
    label.style.fontWeight = 'bold';
    badgeContainer.appendChild(label);
    
    // Add badges for each active filter
    
    // Tag filters
    if (filterState.includeTags.length > 0) {
      const badge = document.createElement('div');
      badge.classList.add('fw-enhancer-active-filter');
      badge.innerHTML = `Tags (${filterState.tagMatch}): ${filterState.includeTags.join(', ')} <button data-filter="includeTags">×</button>`;
      badge.querySelector('button').addEventListener('click', () => {
        filterState.includeTags = [];
        document.querySelectorAll('.fw-enhancer-tag-filters input').forEach(checkbox => {
          checkbox.checked = false;
        });
        updateURLWithFilters();
        applyFilteringToOriginalElements(getOriginalScriptConfig());
        updateActiveFilterBadges(embedElement);
      });
      badgeContainer.appendChild(badge);
    }
    
    // Excluded tags
    if (filterState.excludeTags.length > 0) {
      const badge = document.createElement('div');
      badge.classList.add('fw-enhancer-active-filter');
      badge.innerHTML = `Exclude Tags: ${filterState.excludeTags.join(', ')} <button data-filter="excludeTags">×</button>`;
      badge.querySelector('button').addEventListener('click', () => {
        filterState.excludeTags = [];
        updateURLWithFilters();
        applyFilteringToOriginalElements(getOriginalScriptConfig());
        updateActiveFilterBadges(embedElement);
      });
      badgeContainer.appendChild(badge);
    }
    
    // Date range
    if (filterState.startDate || filterState.endDate) {
      const startStr = filterState.startDate ? filterState.startDate.toLocaleDateString() : 'Any';
      const endStr = filterState.endDate ? filterState.endDate.toLocaleDateString() : 'Any';
      
      const badge = document.createElement('div');
      badge.classList.add('fw-enhancer-active-filter');
      badge.innerHTML = `Date: ${startStr} to ${endStr} <button data-filter="dates">×</button>`;
      badge.querySelector('button').addEventListener('click', () => {
        filterState.startDate = null;
        filterState.endDate = null;
        document.querySelector('.fw-enhancer-date-start').value = '';
        document.querySelector('.fw-enhancer-date-end').value = '';
        updateURLWithFilters();
        applyFilteringToOriginalElements(getOriginalScriptConfig());
        updateActiveFilterBadges(embedElement);
      });
      badgeContainer.appendChild(badge);
    }
    
    // Days of week
    if (filterState.daysOfWeek.length > 0) {
      const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
      const dayString = filterState.daysOfWeek.map(day => dayNames[day]).join(', ');
      
      const badge = document.createElement('div');
      badge.classList.add('fw-enhancer-active-filter');
      badge.innerHTML = `Days: ${dayString} <button data-filter="daysOfWeek">×</button>`;
      badge.querySelector('button').addEventListener('click', () => {
        filterState.daysOfWeek = [];
        document.querySelectorAll('.fw-enhancer-dow-filters input').forEach(checkbox => {
          checkbox.checked = false;
        });
        updateURLWithFilters();
        applyFilteringToOriginalElements(getOriginalScriptConfig());
        updateActiveFilterBadges(embedElement);
      });
      badgeContainer.appendChild(badge);
    }
    
    // Limit
    if (filterState.limit > 0) {
      const badge = document.createElement('div');
      badge.classList.add('fw-enhancer-active-filter');
      badge.innerHTML = `Limit: ${filterState.limit} <button data-filter="limit">×</button>`;
      badge.querySelector('button').addEventListener('click', () => {
        filterState.limit = 0;
        document.querySelector('.fw-enhancer-limit-input').value = '';
        updateURLWithFilters();
        applyFilteringToOriginalElements(getOriginalScriptConfig());
        updateActiveFilterBadges(embedElement);
      });
      badgeContainer.appendChild(badge);
    }
    
    // Special filter
    if (filterState.specialFilter) {
      const specialFilterText = filterState.specialFilter.replace(/-/g, ' ');
      
      const badge = document.createElement('div');
      badge.classList.add('fw-enhancer-active-filter');
      badge.innerHTML = `Quick Filter: ${specialFilterText} <button data-filter="specialFilter">×</button>`;
      badge.querySelector('button').addEventListener('click', () => {
        filterState.specialFilter = '';
        filterState.startDate = null;
        filterState.endDate = null;
        document.querySelector('.fw-enhancer-date-start').value = '';
        document.querySelector('.fw-enhancer-date-end').value = '';
        updateURLWithFilters();
        applyFilteringToOriginalElements(getOriginalScriptConfig());
        updateActiveFilterBadges(embedElement);
      });
      badgeContainer.appendChild(badge);
    }
    
    // Add "Clear All" button
    const clearAllBtn = document.createElement('button');
    clearAllBtn.classList.add('fw-enhancer-reset-all');
    clearAllBtn.textContent = 'Clear All';
    clearAllBtn.addEventListener('click', () => {
      // Reset filter state
      filterState = {
        includeTags: [],
        excludeTags: [],
        tagMatch: "any",
        startDate: null,
        endDate: null,
        daysOfWeek: [],
        limit: 0,
        specialFilter: ""
      };
      
      // Reset UI
      document.querySelectorAll('.fw-enhancer-tag-filters input').forEach(checkbox => {
        checkbox.checked = false;
      });
      
      document.querySelectorAll('.fw-enhancer-dow-filters input').forEach(checkbox => {
        checkbox.checked = false;
      });
      
      const dateStartInput = document.querySelector('.fw-enhancer-date-start');
      const dateEndInput = document.querySelector('.fw-enhancer-date-end');
      const limitInput = document.querySelector('.fw-enhancer-limit-input');
      
      if (dateStartInput) dateStartInput.value = '';
      if (dateEndInput) dateEndInput.value = '';
      if (limitInput) limitInput.value = '';
      
      // Update URL
      updateURLWithFilters();
      
      // Apply filtering
      applyFilteringToOriginalElements(getOriginalScriptConfig());
      
      // Remove filter badges
      badgeContainer.remove();
    });
    badgeContainer.appendChild(clearAllBtn);
    
    // Insert after filter controls
    const filterControls = document.querySelector('.fw-enhancer-filter-container');
    if (filterControls) {
      filterControls.parentNode.insertBefore(badgeContainer, filterControls.nextSibling);
    }
  }
  
  // Main function to enhance calendar view
  function enhanceCalendarView(embedElement, filteredEvents) {
    // Locate the FullCalendar instance
    const fcCanvas = embedElement.querySelector('.fc');
    if (!fcCanvas) return;
    
    // Find current calendar events
    const eventElements = fcCanvas.querySelectorAll('.fc-event');
    
    // Hide all current events
    eventElements.forEach(eventEl => {
      eventEl.style.display = 'none';
    });
    
    // Show only the filtered events
    // We need to match events by title and date
    filteredEvents.forEach(filteredEvent => {
      const eventDate = new Date(filteredEvent.start);
      
      // For calendar events, we match by title and date
      eventElements.forEach(eventEl => {
        const titleEl = eventEl.querySelector('.fc-event-title');
        if (!titleEl) return;
        
        const title = titleEl.textContent.trim();
        
        // If title matches
        if (title === filteredEvent.title) {
          // Try to match the date
          const dateAttr = eventEl.getAttribute('data-date');
          if (dateAttr) {
            const elementDate = new Date(dateAttr);
            if (elementDate.toDateString() === eventDate.toDateString()) {
              eventEl.style.display = ''; // Show this event
              
              // Add tags to event element if not already present
              if (filteredEvent.tags && filteredEvent.tags.length > 0) {
                const existingTags = eventEl.querySelector('.event-tags-container');
                if (!existingTags) {
                  const tagsContainer = document.createElement('div');
                  tagsContainer.classList.add('event-tags-container');
                  
                  // Only show first 2 tags + a +X more indicator
                  filteredEvent.tags.slice(0, 2).forEach(tag => {
                    const tagEl = document.createElement('span');
                    tagEl.classList.add('fw-enhancer-event-tag');
                    tagEl.textContent = tag;
                    tagsContainer.appendChild(tagEl);
                  });
                  
                  if (filteredEvent.tags.length > 2) {
                    const moreEl = document.createElement('span');
                    moreEl.classList.add('fw-enhancer-event-tag', 'more-tags');
                    moreEl.textContent = "+" + (filteredEvent.tags.length - 2);
                    tagsContainer.appendChild(moreEl);
                  }
                  
                  // Add to event element
                  const eventContent = eventEl.querySelector('.fc-event-title');
                  if (eventContent) {
                    eventContent.appendChild(tagsContainer);
                  }
                }
              }
              
              // For combined view, add type indicator
              if (getOriginalScriptConfig().combinedView && filteredEvent.type) {
                const existingIndicator = eventEl.querySelector('.event-type-indicator');
                if (!existingIndicator) {
                  const typeIndicator = document.createElement('span');
                  typeIndicator.classList.add('event-type-indicator');
                  typeIndicator.classList.add(filteredEvent.type === 'classes' ? 'class-indicator' : 'show-indicator');
                  typeIndicator.textContent = filteredEvent.type === 'classes' ? 'CLASS' : 'SHOW';
                  
                  const eventTitle = eventEl.querySelector('.fc-event-title');
                  if (eventTitle) {
                    eventTitle.insertBefore(typeIndicator, eventTitle.firstChild);
                  }
                }
              }
            }
          }
        }
      });
    });
    
    // If no events visible after filtering, show a message
    let visibleEvents = 0;
    eventElements.forEach(eventEl => {
      if (eventEl.style.display !== 'none') {
        visibleEvents++;
      }
    });
    
    if (visibleEvents === 0) {
      const noEventsMsg = document.createElement('div');
      noEventsMsg.classList.add('fw-no-events');
      noEventsMsg.textContent = 'No events found matching your criteria.';
      
      // Find the appropriate container to add the message
      const dayGrid = fcCanvas.querySelector('.fc-daygrid-body');
      if (dayGrid) {
        dayGrid.appendChild(noEventsMsg);
      } else {
        fcCanvas.appendChild(noEventsMsg);
      }
    } else {
      // Remove any existing "no events" message
      const existingMsg = fcCanvas.querySelector('.fw-no-events');
      if (existingMsg) {
        existingMsg.remove();
      }
    }
  }
  
  // Main function to enhance card view
  function enhanceCardView(embedElement, filteredEvents) {
    // Find card container
    const cardContainer = embedElement;
    if (!cardContainer) return;
    
    // Find all cards
    const cards = cardContainer.querySelectorAll('a');
    
    // Hide all cards first
    cards.forEach(card => {
      card.style.display = 'none';
    });
    
    // If no events to show, display a message
    if (filteredEvents.length === 0) {
      const noEventsMsg = document.createElement('div');
      noEventsMsg.classList.add('fw-no-events');
      noEventsMsg.textContent = 'No events found matching your criteria.';
      cardContainer.appendChild(noEventsMsg);
      return;
    }
    
    // Remove any existing "no events" message
    const existingMsg = cardContainer.querySelector('.fw-no-events');
    if (existingMsg) {
      existingMsg.remove();
    }
    
    // Create new cards for the filtered events
    filteredEvents.forEach(event => {
      // Look for existing card for this event first
      let found = false;
      
      cards.forEach(card => {
        const titleEl = card.querySelector('.card-title');
        if (titleEl && titleEl.textContent === event.title) {
          // Show this card
          card.style.display = '';
          found = true;
          
          // Add tags if not already present
          if (event.tags && event.tags.length > 0) {
            const existingTags = card.querySelector('.tag-badges');
            if (!existingTags) {
              const tagBadges = document.createElement('div');
              tagBadges.classList.add('tag-badges');
              
              event.tags.forEach(tag => {
                const badge = document.createElement('span');
                badge.classList.add('badge', 'fw-enhancer-tag-badge');
                badge.textContent = tag;
                tagBadges.appendChild(badge);
              });
              
              // Insert after title
              const cardTitle = card.querySelector('.card-title');
              if (cardTitle) {
                cardTitle.after(tagBadges);
              }
            }
          }
          
          // For combined view, add type indicator
          if (getOriginalScriptConfig().combinedView && event.type) {
            const imgWrapper = card.querySelector('.img-wrapper');
            if (imgWrapper) {
              const existingBadge = imgWrapper.querySelector('.fw-enhancer-type-badge');
              if (!existingBadge) {
                const typeBadge = document.createElement('div');
                typeBadge.classList.add('badge', 'fw-enhancer-type-badge');
                typeBadge.classList.add(event.type === 'classes' ? 'fw-enhancer-class-badge' : 'fw-enhancer-show-badge');
                typeBadge.textContent = event.type === 'classes' ? 'Class' : 'Show';
                imgWrapper.appendChild(typeBadge);
              }
            }
          }
        }
      });
      
      // If event not found, create new card
      if (!found) {
        let _upcomingDate = event.next_date || event.end;
        let _startDate = new Date(_upcomingDate);
        
        // Format date
        let formattedDate = _startDate.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: "UTC",
        });
        
        let formattedTime = _startDate.toLocaleString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: "UTC",
        });
        
        // Format description
        let _cleanDesc = event.description.replace(/(<([^>]+)>)/gi, "");
        let _lengthDesc = 200;
        let _finalDesc =
          _cleanDesc.length > _lengthDesc ? _cleanDesc.substring(0, _lengthDesc - 3) + "..." : _cleanDesc;
        
        // Create type badge
        const typeBadge = (getOriginalScriptConfig().combinedView && event.type) ? 
          `<div class="badge fw-enhancer-type-badge ${event.type === 'classes' ? 'fw-enhancer-class-badge' : 'fw-enhancer-show-badge'}">${event.type === 'classes' ? 'Class' : 'Show'}</div>` : '';
        
        // Create tag badges
        let tagBadges = '';
        if (event.tags && event.tags.length > 0) {
          tagBadges = '<div class="tag-badges">' + 
            event.tags.map(tag => `<span class="badge fw-enhancer-tag-badge">${tag}</span>`).join('') + 
            '</div>';
        }
        
        // Calculate breakpoint for responsive design
        let _breakpoint = "";
        let _clientWidth = cardContainer.clientWidth;
        
        if (_clientWidth <= 991) {
          _breakpoint = "fw-bp-md";
        }
        
        if (_clientWidth <= 767) {
          _breakpoint = "fw-bp-sm";
        }
        
        // Create new card element
        const newCard = document.createElement('a');
        newCard.href = event.show_url;
        newCard.target = "_blank";
        newCard.rel = "noopener";
        newCard.className = _breakpoint;
        
        newCard.innerHTML = `
          <div class="fw-card">
            <div class="img-wrapper">
              ${typeBadge}
              ${event.cost ? `<div class="badge cost">${event.cost}</div>` : ""}
              <img class="card-img-top" src="${event.img}" alt="${event.title}">
            </div>
            <div class="card-body">
              <div class="card-date">${_upcomingDate ? `${formattedDate} @ ${formattedTime}` : "No upcoming date"}</div>
              <div class="card-title">${event.title}</div>
              ${tagBadges}
              <hr>
              <div class="card-subtitle description">
                ${_finalDesc}
              </div>
            </div>
          </div>
        `;
        
        cardContainer.appendChild(newCard);
      }
    });
  }
  
  // Create a loading overlay that covers the entire embed element
  function createLoadingOverlay(embedElement) {
    // Create overlay container
    const overlay = document.createElement('div');
    overlay.classList.add('fw-enhancer-loading-overlay');
    
    // Add spinner
    const spinner = document.createElement('div');
    spinner.classList.add('spinner');
    overlay.appendChild(spinner);
    
    // Add loading message
    const message = document.createElement('div');
    message.classList.add('message');
    message.textContent = 'Loading events...';
    overlay.appendChild(message);
    
    // Position the overlay relative to the embed element
    embedElement.style.position = 'relative';
    
    // Add overlay to the embed element
    embedElement.appendChild(overlay);
    
    return overlay;
  }
  
  // Apply filters to the original embed elements
  function applyFilteringToOriginalElements(config) {
    // Find the embed element
    const embedElement = document.querySelector('.fw-embed');
    if (!embedElement) {
      console.error('Enhancer Error: Cannot find the embed element.');
      return;
    }
    
    // If we don't have data yet, fetch it
    if (cachedData.shows.length === 0 || (config.combinedView && cachedData.classes.length === 0)) {
      // Show a loading overlay
      const loadingOverlay = createLoadingOverlay(embedElement);
      
      // Fetch data
      const fetchPromises = [];
      
      if (config.type === 'shows' || config.combinedView) {
        fetchPromises.push(
          fetchEvents(config, 'shows').then(events => {
            cachedData.shows = events;
          })
        );
      }
      
      if (config.type === 'classes' || config.combinedView) {
        fetchPromises.push(
          fetchEvents(config, 'classes').then(events => {
            cachedData.classes = events;
          })
        );
      }
      
      // When all data is fetched, apply filters
      Promise.all(fetchPromises).then(() => {
        // Remove loading overlay
        if (loadingOverlay) {
          loadingOverlay.remove();
        }
        
        // Apply filters based on view type
        applyFilteringBasedOnViewType(embedElement, config);
      }).catch(error => {
        console.error('Enhancer Error: Failed to fetch event data:', error);
        
        // Remove loading overlay on error
        if (loadingOverlay) {
          loadingOverlay.remove();
        }
        
        // Display error message
        const errorMessage = document.createElement('div');
        errorMessage.classList.add('fw-no-events');
        errorMessage.innerHTML = 'Error loading events. Please try again later.';
        embedElement.appendChild(errorMessage);
      });
    } else {
      // We already have data, just apply filters
      applyFilteringBasedOnViewType(embedElement, config);
    }
  }
  
  // Apply filtering based on view type
  function applyFilteringBasedOnViewType(embedElement, config) {
    // Get all events based on configuration
    let allEvents;
    
    if (config.combinedView) {
      allEvents = [...cachedData.shows, ...cachedData.classes];
    } else if (config.type === 'shows') {
      allEvents = cachedData.shows;
    } else if (config.type === 'classes') {
      allEvents = cachedData.classes;
    } else {
      allEvents = []; // Default to empty if no type specified
    }
    
    // Apply filters to get filtered events
    const filteredEvents = applyFilters(allEvents, filterState);
    
    // Apply filters based on view type
    if (embedElement.classList.contains('fw-calendar')) {
      enhanceCalendarView(embedElement, filteredEvents);
    } else if (embedElement.classList.contains('fw-cards')) {
      enhanceCardView(embedElement, filteredEvents);
    }
  }
  
  // Initialize the enhancer
  function initEnhancer() {
    // Add CSS styles
    addStyles();
    
    // Get configuration from original script
    const config = getOriginalScriptConfig();
    if (!config) return;
    
    // Initialize filter state
    initializeFilterState(config);
    
    // Initialize from URL parameters
    initializeFromURLParams();
    
    // Better detection for embed element
    let embedElement = null;
    let checkAttempts = 0;
    const maxAttempts = 20;
    
    function attemptToFindEmbed() {
      // Try multiple selectors to find the embed
      embedElement = document.querySelector('.fw-embed') || 
                    document.querySelector('.fw-calendar') || 
                    document.querySelector('.fw-cards') ||
                    document.querySelector('#fourth_wall > div');
      
      checkAttempts++;
      
      if (embedElement) {
        // Success! We found the embed element
        console.log("Enhancer: Found embed element");
        initializeWithEmbed(embedElement);
      } else if (checkAttempts < maxAttempts) {
        // Try again in 500ms
        setTimeout(attemptToFindEmbed, 500);
      } else {
        // Give up after max attempts
        console.error("Enhancer Error: Embed element not found after multiple attempts");
        
        // Last resort - try to find any element that looks like it might be the embed
        const fourthWall = document.getElementById('fourth_wall');
        if (fourthWall && fourthWall.children.length > 0) {
          console.log("Enhancer: Using fallback embed detection");
          initializeWithEmbed(fourthWall.children[0]);
        } else {
          // Nothing worked, force remove any spinner that might be there
          const spinners = document.querySelectorAll('.fw-enhancer-loading-overlay');
          spinners.forEach(spinner => spinner.remove());
        }
      }
    }
    
    function initializeWithEmbed(embedElement) {
      // Show loading overlay immediately
      const loadingOverlay = createLoadingOverlay(embedElement);
      
      // Set up filter UI if enabled
      const populateTagFilters = setupFilterUI(embedElement, config);
      
      // Apply filtering based on initial configuration
      applyFilteringToOriginalElements(config);
      
      // Initialize active filter badges
      updateActiveFilterBadges(embedElement);
      
      // Safety timeout to ensure spinner is removed even if something goes wrong
      setTimeout(() => {
        const spinners = document.querySelectorAll('.fw-enhancer-loading-overlay');
        spinners.forEach(spinner => spinner.remove());
      }, 5000);
      
      // Set up observer to watch for changes to the DOM
      // This handles cases where the original script updates the display
      const observer = new MutationObserver((mutations) => {
        // If cards or calendar content changes, re-apply filters
        const shouldReapply = mutations.some(mutation => {
          // Check if elements have been added
          if (mutation.addedNodes.length > 0) {
            for (let i = 0; i < mutation.addedNodes.length; i++) {
              const node = mutation.addedNodes[i];
              if (node.nodeType === 1) { // Element node
                if (
                  node.classList.contains('fw-card') ||
                  node.classList.contains('fc-event') ||
                  node.classList.contains('fc-daygrid-day-events')
                ) {
                  return true;
                }
              }
            }
          }
          return false;
        });
        
        if (shouldReapply) {
          // Only reapply if there's no loading overlay already
          if (!document.querySelector('.fw-enhancer-loading-overlay')) {
            applyFilteringToOriginalElements(config);
          }
        }
      });
      
      // Start observing
      observer.observe(embedElement, {
        childList: true,
        subtree: true
      });
    }
    
    // Start checking for the embed element
    attemptToFindEmbed();
  }
  
  // Start the enhancer when the page is fully loaded
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEnhancer);
  } else {
    initEnhancer();
  }
  
  // Expose public API
  window.FWEnhancer = {
    setFilter: function(filterType, value) {
      filterState[filterType] = value;
      const config = getOriginalScriptConfig();
      if (config) {
        applyFilteringToOriginalElements(config);
        updateActiveFilterBadges(document.querySelector('.fw-embed'));
        updateURLWithFilters();
      }
    },
    resetFilters: function() {
      filterState = {
        includeTags: [],
        excludeTags: [],
        tagMatch: "any",
        startDate: null,
        endDate: null,
        daysOfWeek: [],
        limit: 0,
        specialFilter: ""
      };
      
      const config = getOriginalScriptConfig();
      if (config) {
        // Reset UI elements
        document.querySelectorAll('.fw-enhancer-tag-filters input').forEach(checkbox => {
          checkbox.checked = false;
        });
        
        document.querySelectorAll('.fw-enhancer-dow-filters input').forEach(checkbox => {
          checkbox.checked = false;
        });
        
        const dateStartInput = document.querySelector('.fw-enhancer-date-start');
        const dateEndInput = document.querySelector('.fw-enhancer-date-end');
        const limitInput = document.querySelector('.fw-enhancer-limit-input');
        
        if (dateStartInput) dateStartInput.value = '';
        if (dateEndInput) dateEndInput.value = '';
        if (limitInput) limitInput.value = '';
        
        // Apply changes
        applyFilteringToOriginalElements(config);
        
        // Remove filter badges
        const badgeContainer = document.querySelector('.fw-enhancer-filter-badge-container');
        if (badgeContainer) {
          badgeContainer.remove();
        }
        
        // Update URL
        updateURLWithFilters();
      }
    },
    applyQuickFilter: function(filterName) {
      filterState.specialFilter = filterName;
      
      const config = getOriginalScriptConfig();
      if (config) {
        initializeSpecialDateFilters(config);
        
        // Update date inputs
        const dateStartInput = document.querySelector('.fw-enhancer-date-start');
        const dateEndInput = document.querySelector('.fw-enhancer-date-end');
        
        if (dateStartInput && filterState.startDate) {
          dateStartInput.value = filterState.startDate.toISOString().split('T')[0];
        }
        
        if (dateEndInput && filterState.endDate) {
          dateEndInput.value = filterState.endDate.toISOString().split('T')[0];
        }
        
        // Apply changes
        applyFilteringToOriginalElements(config);
        updateActiveFilterBadges(document.querySelector('.fw-embed'));
        updateURLWithFilters();
      }
    },
    getFilterState: function() {
      return JSON.parse(JSON.stringify(filterState)); // Return a copy
    }
  };
})();