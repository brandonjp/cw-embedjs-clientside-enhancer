/***************************************************************
 * Enhanced Event Display Embed Script v2.0.0
 * 
 * DESCRIPTION:
 * A modern, modular client-side JavaScript library for displaying event 
 * information with advanced filtering capabilities. This script fetches and 
 * displays events from the CrowdWork API in either card or calendar view.
 * 
 * USAGE:
 * 1. Include this script in your HTML:
 *    <script id="fw_script" src="https://crowdwork.com/embed-new.js" 
 *            data-theatre="your-theatre" data-view="cards"></script>
 * 
 * 2. Add a container div (optional):
 *    <div id="fourth_wall"></div>
 * 
 * CONFIGURATION OPTIONS:
 * - data-theatre: Your theatre subdomain (required)
 * - data-type: "shows" or "classes" (default: "shows")
 * - data-view: "cards" or "calendar" (default: calendar for shows, cards for classes)
 * - data-development: "true" for development mode
 * - data-category: Filter by specific category
 * - data-start-date: Initial calendar date
 * - data-start-dow: First day of week (0=Sunday, 1=Monday, default: 1)
 * - data-local: "true" to open links in same window
 * - data-limit: Maximum number of events to show
 * - data-include-tags: Comma-separated list of tags to include
 * - data-exclude-tags: Comma-separated list of tags to exclude
 * - data-tag-match: "any" or "all" for tag filtering (default: "any")
 * - data-date-range: "YYYY-MM-DD,YYYY-MM-DD" for date range filtering
 * - data-date-offset: "7d", "2w", "1m" for relative date filtering
 * - data-days-of-week: "0,1,5,6" for filtering by days of week (0=Sunday)
 * - data-special-filter: "this-week", "next-weekend", "next-7-days", etc.
 * - data-combined-view: "true" to show both shows and classes together
 * 
 * PUBLIC API:
 * After initialization, you can access these methods:
 * - FWEmbed.setFilter(filterType, value) - Set a specific filter
 * - FWEmbed.resetFilters() - Reset all filters to defaults
 * - FWEmbed.applySpecialFilter(filterName) - Apply a predefined filter
 * 
 * CHANGELOG:
 * See CHANGELOG.md for detailed version history
 ***************************************************************/

// Enhanced Event Display Embed Script with Advanced Filtering
{
  const FWEmbed = (function() {
    // Configuration and state
    const config = {
      script: document.currentScript,
      devMode: document.currentScript.getAttribute("data-development") === "true",
      dataType: document.currentScript.getAttribute("data-type") || "shows",
      dataView: document.currentScript.getAttribute("data-view"),
      dataCategory: document.currentScript.getAttribute("data-category"),
      dataStartDate: document.currentScript.getAttribute("data-start-date"),
      dataStartDow: parseInt(document.currentScript.getAttribute("data-start-dow") || "1", 10),
      dataLocal: document.currentScript.getAttribute("data-local") === "true",
      dataShowLimit: parseInt(document.currentScript.getAttribute("data-limit") || "0", 10),
      dataIncludeTags: document.currentScript.getAttribute("data-include-tags"),
      dataExcludeTags: document.currentScript.getAttribute("data-exclude-tags"),
      dataTagMatch: document.currentScript.getAttribute("data-tag-match") || "any", // "any" or "all"
      dataDateRange: document.currentScript.getAttribute("data-date-range"), // "YYYY-MM-DD,YYYY-MM-DD"
      dataDateOffset: document.currentScript.getAttribute("data-date-offset"), // "7d", "2w", "1m"
      dataDaysOfWeek: document.currentScript.getAttribute("data-days-of-week"), // "0,1,5,6" (0=Sunday)
      dataSpecialFilter: document.currentScript.getAttribute("data-special-filter"), // "this-week", "next-weekend", etc.
      dataCombinedView: document.currentScript.getAttribute("data-combined-view") === "true",
      embedUUID: generateID(12),
      timezone: "Central Time (US & Canada)" // Default timezone, updated from API
    };

    // Determine HTTP and main URL based on dev mode
    const http = config.devMode ? "http" : "https";
    const mainUrl = config.devMode ? "lvh.me:3000" : "crowdwork.com";
    
    // Determine render view
    let renderView = "calendar";
    if (config.dataView === "cards" && (!config.dataType || config.dataType === "shows")) {
      renderView = "cards";
    } else if ((!config.dataView || config.dataView === "cards") && config.dataType === "classes") {
      renderView = "cards";
    }

    // Define constants for loading states and CSS classes
    const EMBED_LOADING_CLASS = "fw-embed-loading";
    
    // Scripts to load
    const scripts = [
      `${http}://${mainUrl}/embed/bootstrap-modal.min.js`,
      `${http}://${mainUrl}/embed/bootstrap-modal.min.css`,
      "https://cdn.jsdelivr.net/npm/fullcalendar@6.0.2/index.global.min.js",
      `${http}://${mainUrl}/embed/embed.min.css?v=8`, // Load mine last
    ];

    // Modal HTML template
    const modalHTML = `
      <div id="fwCalendarModal" class="fw-modal fw-fade" tabindex="-1" aria-labelledby="calendarModalLabel" aria-hidden="true">
          <div class="fw-modal-dialog fw-modal-lg fw-modal-dialog-centered fw-modal-dialog-scrollable">
              <div class="fw-modal-content">
                  <div class="fw-modal-header">
                      <div class="fw-modal-header-text">
                          <h3 id="calendarModalLabel" class="fw-modal-title"></h3>
                          <p class="fw-modal-subtitle"><span class="fw-modal-date"></span> <span class="fw-modal-cost"></span></p>
                      </div>
                      <button type="button" class="btn-close" data-bs-dismiss="fw-modal" aria-label="Close"></button>
                  </div>
                  <div class="fw-modal-body">
                      <div class="left">
                          <div>
                              <img class="fw-modal-img img-fluid" src="#" alt="">
                          </div>
                      </div>
                      <div class="right">
                          <div class="fw-modal-description"></div>
                      </div>
                  </div>
                  <div class="fw-modal-footer">
                      <a class="btn btn-primary fw-modal-btn-purchase" href="#" ${
                        config.dataLocal ? "" : ' target="_blank"'
                      }>Purchase Tickets</a>
                  </div>
              </div>
          </div>
      </div>
    `;

    // Filter UI template
    const filterUITemplate = `
      <div class="fw-filter-controls">
        <div class="fw-filter-dropdown">
          <button class="fw-filter-toggle">Filter Events</button>
          <div class="fw-filter-panel">
            <div class="fw-filter-section">
              <label>Tags:</label>
              <div class="fw-tag-filters"></div>
            </div>
            <div class="fw-filter-section fw-date-filters">
              <label>Date Range:</label>
              <div class="fw-date-range">
                <input type="date" class="fw-date-start" placeholder="Start date">
                <span>to</span>
                <input type="date" class="fw-date-end" placeholder="End date">
              </div>
            </div>
            <div class="fw-filter-section">
              <label>Quick Filters:</label>
              <div class="fw-quick-filters">
                <button data-filter="this-week">This Week</button>
                <button data-filter="next-weekend">Next Weekend</button>
                <button data-filter="next-7-days">Next 7 Days</button>
                <button data-filter="next-30-days">Next 30 Days</button>
              </div>
            </div>
            <div class="fw-filter-section">
              <label>Days of Week:</label>
              <div class="fw-dow-filters">
                <label><input type="checkbox" value="0" /> Sun</label>
                <label><input type="checkbox" value="1" /> Mon</label>
                <label><input type="checkbox" value="2" /> Tue</label>
                <label><input type="checkbox" value="3" /> Wed</label>
                <label><input type="checkbox" value="4" /> Thu</label>
                <label><input type="checkbox" value="5" /> Fri</label>
                <label><input type="checkbox" value="6" /> Sat</label>
              </div>
            </div>
            <div class="fw-filter-section">
              <label>Show:</label>
              <input type="number" class="fw-limit-input" min="1" placeholder="Event limit">
            </div>
            <div class="fw-filter-actions">
              <button class="fw-apply-filters">Apply Filters</button>
              <button class="fw-reset-filters">Reset</button>
            </div>
          </div>
        </div>
      </div>
    `;

    // Cache for event data
    let cachedData = {
      shows: [],
      classes: []
    };

    // Current filter state
    let filterState = {
      includeTags: config.dataIncludeTags ? config.dataIncludeTags.split(',').map(tag => tag.trim()) : [],
      excludeTags: config.dataExcludeTags ? config.dataExcludeTags.split(',').map(tag => tag.trim()) : [],
      tagMatch: config.dataTagMatch,
      startDate: null,
      endDate: null,
      daysOfWeek: config.dataDaysOfWeek ? config.dataDaysOfWeek.split(',').map(day => parseInt(day.trim(), 10)) : [],
      limit: config.dataShowLimit || 0,
      specialFilter: config.dataSpecialFilter || ""
    };

    // Initialize filter state from URL parameters if present
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
    function initializeSpecialDateFilters() {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      // Handle date offset (e.g., "7d", "2w", "1m")
      if (config.dataDateOffset) {
        const value = parseInt(config.dataDateOffset.slice(0, -1), 10);
        const unit = config.dataDateOffset.slice(-1);
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
      if (config.dataDateRange) {
        const [startStr, endStr] = config.dataDateRange.split(',');
        if (startStr) filterState.startDate = new Date(startStr);
        if (endStr) filterState.endDate = new Date(endStr);
      }
      
      // Handle special filters
      if (config.dataSpecialFilter || filterState.specialFilter) {
        const filter = config.dataSpecialFilter || filterState.specialFilter;
        
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

    // Utility Functions
    function generateID(length) {
      let result = "";
      const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      const charactersLength = characters.length;
      let counter = 0;
      while (counter < length) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
        counter += 1;
      }
      return result;
    }

    function adjustMonths(dateStr, monthsToAdd) {
      const date = new Date(dateStr);
      date.setDate(1); // Set to the first day of the month
      date.setMonth(date.getMonth() + monthsToAdd);
      return date.toISOString().split("T")[0];
    }

    // DOM manipulation
    function getEmbeddedElement() {
      let el = document.getElementById(config.embedUUID);

      if (!el) {
        // Create wrapper for Wix/others to ensure full-width
        let elWrapper = document.createElement("div");
        elWrapper.style["width"] = "100%";
        elWrapper.style["position"] = "relative";

        el = document.createElement("div");
        el.id = config.embedUUID;
        el.className = "fw-embed";

        if (document.body.contains(config.script)) {
          config.script.parentNode.insertBefore(elWrapper, config.script);
          elWrapper.appendChild(el);
        } else {
          // This script has been loaded into the <head> section (i.e. Wix)
          document.body.appendChild(elWrapper);
          document.body.insertBefore(el, null);
        }
      }

      return el;
    }

    function getLoadingOverlayEl() {
      let calendarEl = getEmbeddedElement();
      let el = calendarEl.querySelector(`.${EMBED_LOADING_CLASS}`);

      if (!el) {
        let loadingDiv = document.createElement("div");
        loadingDiv.classList.add(EMBED_LOADING_CLASS);

        let spinnerDiv = document.createElement("div");
        spinnerDiv.classList.add("spinner");
        loadingDiv.appendChild(spinnerDiv);

        calendarEl.insertBefore(loadingDiv, calendarEl.children[0]);
        el = loadingDiv;
      }

      return el;
    }

    function insertLoadingEl() {
      let calendarEl = getEmbeddedElement();

      let h = document.createElement("H1");
      h.style.textAlign = "center";
      h.style.padding = "32px 16px";
      h.style.width = "100%";
      let t = document.createTextNode("Loading...");
      h.appendChild(t);
      calendarEl.appendChild(h);

      return h;
    }

    // Asset loading
    function assetLoader(files, callback) {
      let count = files.length;

      const urlCallback = (url) => {
        return function () {
          --count;
          if (count < 1) {
            callback();
          }
        };
      };

      const loadScript = (url) => {
        let s = document.createElement("script");
        s.setAttribute("src", url);
        s.onload = urlCallback(url);
        document.head.appendChild(s);
      };

      const loadStyle = (url) => {
        let s = document.createElement("link");
        s.setAttribute("href", url);
        s.setAttribute("type", "text/css");
        s.setAttribute("rel", "stylesheet");
        s.onload = urlCallback(url);
        document.head.appendChild(s);
      };

      for (let file of files) {
        if (file.slice(-2) == "js") {
          loadScript(file);
        } else {
          loadStyle(file);
        }
      }
    }

    // Data fetching
    async function fetchEvents(dataType, startStr, endStr) {
      // Get theatre name
      let fw_theatre = config.script.getAttribute("data-theatre");

      let fetchString = `${http}://${fw_theatre}.${mainUrl}/api/v1/${dataType}?cache=${new Date().getTime()}`;

      if (config.dataCategory) {
        fetchString += `&category=${encodeURIComponent(config.dataCategory)}`;
      }

      if (startStr || endStr) {
        fetchString += `&start=${startStr}&end=${endStr}`;
      }

      try {
        const res = await fetch(fetchString);
        const jsonData = await res.json();
        return processApiData(jsonData, dataType);
      } catch (err) {
        console.error(`Error fetching ${dataType}:`, err);
        return [];
      }
    }

    function processApiData(jsonData, dataType) {
      let events = [];
      
      // Loop through each item in the data
      Object.keys(jsonData["data"]).forEach((key) => {
        let item = jsonData["data"][key];
        let itemDates = item["dates"];

        // Display until specific date requested (for cards view)
        if (renderView === "cards") {
          let _beginningOfToday = new Date();
          _beginningOfToday.setHours(0, 0, 0, 0);
          if (new Date(item["display_until"]) < _beginningOfToday) return;
        }

        // Update timezone from API
        config.timezone = item["timezone"];

        // Each item has a dates array. Loop through each one and add to events array
        let _alreadyInserted = false;
        for (let i = 0; i < itemDates.length; i++) {
          // If we've already added the item for cards view, break
          if (renderView === "cards" && _alreadyInserted) break;
          _alreadyInserted = true;

          let description = "No description given.";
          if (item["description"]["body"]) {
            description = item["description"]["body"];
          }

          // Shim for dev/prod
          let imgURL = item["img"]["url"];
          if (config.devMode) {
            imgURL = `${http}://${mainUrl}${item["img"]["url"]}`;
          }

          // Extract tags for filtering purposes
          let tags = item["tags"] || [];
          if (item["category"]) {
            tags.push(item["category"]);
          }

          events.push({
            title: item["name"],
            start: itemDates[i],
            description: description,
            img: imgURL,
            cost: item["cost"]["formatted"],
            show_url: item["url"],
            grouped_dates: item["grouped_dates"],
            next_date: item["next_date"] || itemDates[itemDates.length - 1], // Default to last date if no "next_date"
            tags: tags,
            type: dataType, // Store the type (shows or classes) for combined view
          });
        }
      });
      
      return events;
    }

    // Filtering Functions
    function applyFilters(events) {
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

    // UI Rendering
    function setupFilterUI() {
      const embedEl = getEmbeddedElement();
      
      // Insert filter UI before other content
      const filterContainer = document.createElement('div');
      filterContainer.classList.add('fw-filter-container');
      filterContainer.innerHTML = filterUITemplate;
      embedEl.insertBefore(filterContainer, embedEl.firstChild);
      
      // Populate tag filters once we have data
      const populateTagFilters = () => {
        const tagFilterContainer = embedEl.querySelector('.fw-tag-filters');
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
          tagEl.classList.add('fw-tag-filter');
          
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
      const dateStartInput = embedEl.querySelector('.fw-date-start');
      const dateEndInput = embedEl.querySelector('.fw-date-end');
      
      if (dateStartInput && filterState.startDate) {
        dateStartInput.value = filterState.startDate.toISOString().split('T')[0];
      }
      
      if (dateEndInput && filterState.endDate) {
        dateEndInput.value = filterState.endDate.toISOString().split('T')[0];
      }
      
      // Set up days of week checkboxes
      filterState.daysOfWeek.forEach(day => {
        const checkbox = embedEl.querySelector(`.fw-dow-filters input[value="${day}"]`);
        if (checkbox) checkbox.checked = true;
      });
      
      // Set up limit input
      const limitInput = embedEl.querySelector('.fw-limit-input');
      if (limitInput && filterState.limit > 0) {
        limitInput.value = filterState.limit;
      }
      
      // Event listener for apply filters button
      const applyBtn = embedEl.querySelector('.fw-apply-filters');
      if (applyBtn) {
        applyBtn.addEventListener('click', () => {
          // Gather tag filters
          const includeTags = Array.from(embedEl.querySelectorAll('.fw-tag-filters input:checked'))
            .map(checkbox => checkbox.value);
          
          // Get date range filters
          const startDateStr = dateStartInput ? dateStartInput.value : '';
          const endDateStr = dateEndInput ? dateEndInput.value : '';
          
          // Get days of week filters
          const daysOfWeek = Array.from(embedEl.querySelectorAll('.fw-dow-filters input:checked'))
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
          
          // Re-render with filters
          renderWithFilters();
        });
      }
      
      // Event listener for reset filters button
      const resetBtn = embedEl.querySelector('.fw-reset-filters');
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
          embedEl.querySelectorAll('.fw-tag-filters input').forEach(checkbox => {
            checkbox.checked = false;
          });
          
          embedEl.querySelectorAll('.fw-dow-filters input').forEach(checkbox => {
            checkbox.checked = false;
          });
          
          if (dateStartInput) dateStartInput.value = '';
          if (dateEndInput) dateEndInput.value = '';
          if (limitInput) limitInput.value = '';
          
          // Update URL
          updateURLWithFilters();
          
          // Re-render with filters
          renderWithFilters();
        });
      }
      
      // Event listener for quick filters
      embedEl.querySelectorAll('.fw-quick-filters button').forEach(button => {
        button.addEventListener('click', () => {
          const filterType = button.getAttribute('data-filter');
          filterState.specialFilter = filterType;
          
          // Reset date inputs as they'll be calculated by the filter
          if (dateStartInput) dateStartInput.value = '';
          if (dateEndInput) dateEndInput.value = '';
          
          // Apply the special filter
          initializeSpecialDateFilters();
          
          // Update date inputs with the new calculated dates
          if (dateStartInput && filterState.startDate) {
            dateStartInput.value = filterState.startDate.toISOString().split('T')[0];
          }
          
          if (dateEndInput && filterState.endDate) {
            dateEndInput.value = filterState.endDate.toISOString().split('T')[0];
          }
          
          // Update URL
          updateURLWithFilters();
          
          // Re-render with filters
          renderWithFilters();
        });
      });
      
      // Toggle filter panel
      const toggleButton = embedEl.querySelector('.fw-filter-toggle');
      const filterPanel = embedEl.querySelector('.fw-filter-panel');
      
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

    function renderCards(events) {
      let cardEl = getEmbeddedElement();
      
      // Clear previous content
      while (cardEl.firstChild) {
        if (cardEl.firstChild.classList && cardEl.firstChild.classList.contains('fw-filter-container')) {
          cardEl.removeChild(cardEl.firstChild.nextSibling);
        } else {
          cardEl.removeChild(cardEl.firstChild);
        }
      }

      cardEl.classList.add("fw-cards");

      // Manually check for size of container
      let _breakpoint = "";
      let _clientWidth = cardEl.clientWidth;

      if (_clientWidth <= 991) {
        _breakpoint = "fw-bp-md";
      }

      if (_clientWidth <= 767) {
        _breakpoint = "fw-bp-sm";
      }
      
      // Display message if no events
      if (events.length === 0) {
        const noEvents = document.createElement('div');
        noEvents.classList.add('fw-no-events');
        noEvents.textContent = 'No events found matching your criteria.';
        cardEl.appendChild(noEvents);
        return;
      }

      events.forEach((e) => {
        let _upcomingDate = e.next_date || e.end;
        let _startDate = new Date(_upcomingDate);

        // Format date
        let formattedDate = _startDate.toLocaleString("en-US", {
          weekday: "long",
          year: "numeric",
          month: "short",
          day: "numeric",
          timeZone: config.timezone,
        });

        let formattedTime = _startDate.toLocaleString("en-US", {
          hour: "numeric",
          minute: "2-digit",
          timeZone: config.timezone,
        });

        // Format description
        let _cleanDesc = e.description.replace(/(<([^>]+)>)/gi, "");
        let _lengthDesc = 200;
        let _finalDesc =
          _cleanDesc.length > _lengthDesc ? _cleanDesc.substring(0, _lengthDesc - 3) + "..." : _cleanDesc;
          
        // Create type badge
        const typeBadge = e.type === 'classes' ? 
          '<div class="badge type-badge class-badge">Class</div>' : 
          '<div class="badge type-badge show-badge">Show</div>';

        // Create tag badges
        let tagBadges = '';
        if (e.tags && e.tags.length > 0) {
          tagBadges = '<div class="tag-badges">' + 
            e.tags.map(tag => `<span class="badge tag-badge">${tag}</span>`).join('') + 
            '</div>';
        }

        cardEl.innerHTML += `<a href="${e.show_url}" target="_blank" rel="noopener" class="${_breakpoint}">
                              <div class="fw-card">
                                  <div class="img-wrapper">
                                      ${config.dataCombinedView ? typeBadge : ''}
                                      ${e.cost ? `<div class="badge cost">${e.cost}</div>` : ""}
                                      <img class="card-img-top" src="${e.img}" alt="${e.title}">
                                  </div>
                                  <div class="card-body">
                                      <div class="card-date">${_upcomingDate ? `${formattedDate} @ ${formattedTime}` : "No upcoming date"}</div>
                                      <div class="card-title">${e.title}</div>
                                      ${tagBadges}
                                      <hr>
                                      <div class="card-subtitle description">
                                          ${_finalDesc}
                                      </div>
                                  </div>
                              </div>
                          </a>
                      `;
      });
    }

    function renderCalendar() {
      let calendarEl = getEmbeddedElement();
      calendarEl.classList.add("fw-calendar");
      
      // Clear previous content except filter container
      Array.from(calendarEl.children).forEach(child => {
        if (!child.classList || !child.classList.contains('fw-filter-container')) {
          calendarEl.removeChild(child);
        }
      });

      let calendar = new FullCalendar.Calendar(calendarEl, {
        initialView: getCalendarView(),
        initialDate: config.dataStartDate,
        headerToolbar: {
          left: "prev",
          center: "title",
          right: "next",
        },
        events: function (fetchInfo, successCallback, failureCallback) {
          const getAndFilterEvents = async () => {
            let startDate = fetchInfo.startStr;
            let endDate = fetchInfo.endStr;
            
            // If data is already cached for this range, use it
            if (cachedData.shows.length === 0 || cachedData.classes.length === 0) {
              // Fetch data types based on configuration
              if (config.dataCombinedView) {
                // Fetch both shows and classes
                const [showEvents, classEvents] = await Promise.all([
                  fetchEvents('shows', startDate, endDate),
                  fetchEvents('classes', startDate, endDate)
                ]);
                
                cachedData.shows = showEvents;
                cachedData.classes = classEvents;
              } else {
                // Fetch only the configured type
                const events = await fetchEvents(config.dataType, startDate, endDate);
                cachedData[config.dataType] = events;
              }
            }
            
            // Combine data if needed
            let allEvents = config.dataCombinedView ? 
              [...cachedData.shows, ...cachedData.classes] : 
              cachedData[config.dataType];
            
            // Apply filters to events
            const filteredEvents = applyFilters(allEvents);
            
            // Return filtered events to calendar
            successCallback(filteredEvents);
          };

          getAndFilterEvents();
        },
        height: "auto",
        timeZone: config.timezone,
        nowIndicator: true,
        nextDayThreshold: "08:00:00",
        firstDay: config.dataStartDow,
        eventContent: function (arg) {
          let arrayOfDomNodes = [];

          // Build time
          let timeText = document.createElement("div");
          if (arg.timeText) {
            timeText.innerHTML = arg.timeText;
            timeText.classList = "fc-event-time";
          }

          // Build title
          let titleText = document.createElement("div");
          if (arg.event._def.title) {
            titleText.innerHTML = arg.event._def.title;
            titleText.classList = "fc-event-title fc-sticky";
          }
          
          // Add type indicator for combined view
          if (config.dataCombinedView && arg.event.extendedProps.type) {
            const typeIndicator = document.createElement("span");
            typeIndicator.classList.add("event-type-indicator");
            typeIndicator.classList.add(arg.event.extendedProps.type === "classes" ? "class-indicator" : "show-indicator");
            typeIndicator.textContent = arg.event.extendedProps.type === "classes" ? "CLASS" : "SHOW";
            titleText.insertBefore(typeIndicator, titleText.firstChild);
          }

          // Append together
          let eventText = document.createElement("div");
          eventText.appendChild(timeText);
          eventText.appendChild(titleText);

          // Build image
          let imgEventWrap = document.createElement("div");
          if (arg.event.extendedProps.img) {
            let imgEvent = '<img width="32" height="32" src="' + arg.event.extendedProps.img + '">';
            imgEventWrap.classList = "fc-event-img";
            imgEventWrap.innerHTML = imgEvent;
          }

          // Add tag indicators
          if (arg.event.extendedProps.tags && arg.event.extendedProps.tags.length > 0) {
            const tagsContainer = document.createElement("div");
            tagsContainer.classList.add("event-tags-container");
            
            arg.event.extendedProps.tags.slice(0, 2).forEach(tag => {
              const tagEl = document.createElement("span");
              tagEl.classList.add("event-tag");
              tagEl.textContent = tag;
              tagsContainer.appendChild(tagEl);
            });
            
            if (arg.event.extendedProps.tags.length > 2) {
              const moreEl = document.createElement("span");
              moreEl.classList.add("event-tag", "more-tags");
              moreEl.textContent = "+" + (arg.event.extendedProps.tags.length - 2);
              tagsContainer.appendChild(moreEl);
            }
            
            eventText.appendChild(tagsContainer);
          }

          arrayOfDomNodes = [imgEventWrap, eventText];

          return { domNodes: arrayOfDomNodes };
        },
        eventClick: function (info) {
          let _startDate = info.event.start;

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

          let isoDate = new Date(_startDate.getTime()).toISOString().split(".")[0];
          let _show_url = info.event.extendedProps.show_url + `?date=${isoDate}`;

          let _classPrefix = "";
          if (info.event.extendedProps.type === "classes") _classPrefix = "Class starts ";

          let dateStr = `${_classPrefix}${formattedDate} @ ${formattedTime}`;

          if (info.event.extendedProps.grouped_dates && info.event.extendedProps.grouped_dates.grouped) {
            dateStr = dateStr + info.event.extendedProps.grouped_dates.message;
          }
          
          // Add tags to modal if available
          let tagsHTML = '';
          if (info.event.extendedProps.tags && info.event.extendedProps.tags.length > 0) {
            tagsHTML = '<div class="fw-modal-tags">' + 
              info.event.extendedProps.tags.map(tag => `<span class="fw-tag-badge">${tag}</span>`).join('') + 
              '</div>';
          }

          // Set modal info
          document.querySelector("#fwCalendarModal .fw-modal-title").textContent = info.event.title;
          document.querySelector("#fwCalendarModal .fw-modal-date").textContent = dateStr;

          // Type indicator for combined view
          if (config.dataCombinedView && info.event.extendedProps.type) {
            const typeText = info.event.extendedProps.type === "classes" ? "Class" : "Show";
            document.querySelector("#fwCalendarModal .fw-modal-title").insertAdjacentHTML(
              'afterbegin', 
              `<span class="fw-modal-type ${info.event.extendedProps.type}">${typeText}</span> `
            );
          }

          // Sometimes there isn't a price if all tiers are password-protected
          if (info.event.extendedProps.cost) {
            document.querySelector("#fwCalendarModal .fw-modal-cost").textContent =
              " • " + info.event.extendedProps.cost;
          }

          document.querySelector("#fwCalendarModal .fw-modal-img").setAttribute("src", info.event.extendedProps.img);
          document.querySelector("#fwCalendarModal .fw-modal-description").innerHTML =
            info.event.extendedProps.description + tagsHTML;
          document.querySelector("#fwCalendarModal .fw-modal-btn-purchase").setAttribute("href", _show_url);

          let calendarModal = new bootstrap.Modal(document.getElementById("fwCalendarModal"));
          calendarModal.show();
        },
        viewDidMount: function () {
          let loadingOverlayEl = getLoadingOverlayEl();
          loadingOverlayEl.classList.add("show");
        },
        eventTimeFormat: {
          hour: "numeric",
          minute: "2-digit",
          meridiem: "short",
        },
        loading: function (isLoading, view) {
          let loadingOverlayEl = getLoadingOverlayEl();

          if (isLoading) {
            loadingOverlayEl.classList.add("show");
          } else {
            loadingOverlayEl.classList.remove("show");
          }
        },
      });

      calendar.render();

      // Update Calendar on mobile
      window.onresize = function () {
        calendar.changeView(getCalendarView());
      };
      
      return calendar;
    }

    function getCalendarView() {
      let el = getEmbeddedElement();
      if (el.clientWidth <= 767) {
        return "listMonth";
      } else {
        return "dayGridMonth";
      }
    }
    
    // Function to re-render with filters
    function renderWithFilters() {
      const embedEl = getEmbeddedElement();
      const loadingOverlayEl = getLoadingOverlayEl();
      loadingOverlayEl.classList.add("show");
      
      // Get all events (combined if needed)
      let allEvents = config.dataCombinedView ? 
        [...cachedData.shows, ...cachedData.classes] : 
        cachedData[config.dataType];
      
      // Apply filters
      const filteredEvents = applyFilters(allEvents);
      
      // Render based on view type
      if (renderView === "cards") {
        renderCards(filteredEvents);
      } else {
        // For calendar view, we need to refresh the events
        // This is handled by the calendar's event refetching mechanism
        if (calendar) {
          calendar.refetchEvents();
        }
      }
      
      loadingOverlayEl.classList.remove("show");
    }

    // Main functions
    let calendar = null;
    
    async function main() {
      // Insert Modal HTML
      document.body.insertAdjacentHTML("beforeend", modalHTML);
      
      // Initialize from URL parameters if present
      initializeFromURLParams();
      
      // Initialize date ranges from special filters
      initializeSpecialDateFilters();
      
      // Set up filter UI
      const populateTagFilters = setupFilterUI();

      // Load everything based on view type
      if (renderView === "cards") {
        // For cards view, fetch all data at once
        
        let eventsPromises = [];
        
        if (config.dataCombinedView) {
          // Fetch both shows and classes
          eventsPromises = [
            fetchEvents('shows'),
            fetchEvents('classes')
          ];
          
          const [showEvents, classEvents] = await Promise.all(eventsPromises);
          cachedData.shows = showEvents;
          cachedData.classes = classEvents;
        } else {
          // Fetch only the configured type
          const events = await fetchEvents(config.dataType);
          cachedData[config.dataType] = events;
        }
        
        // Populate tag filters now that we have data
        populateTagFilters();
        
        // Get all events (combined if needed)
        let allEvents = config.dataCombinedView ? 
          [...cachedData.shows, ...cachedData.classes] : 
          cachedData[config.dataType];
        
        // Apply filters
        const filteredEvents = applyFilters(allEvents);
        
        // Render cards
        renderCards(filteredEvents);
      } else {
        // For calendar view, set up the calendar with dynamic events
        calendar = renderCalendar();
        
        // The calendar will load its own data as needed through the events function
        // We'll just set up additional event handlers here if needed
      }
    }

    function load() {
      // Insert loading message
      const loadingEl = insertLoadingEl();

      // Load dependencies and initialize
      assetLoader(scripts, function () {
        // Hide loading message
        loadingEl.style.display = "none";
        
        // Start main functionality
        main();
      });
    }

    // Initial load check
    let _bodyLoaded = false;
    function checkIfLoaded() {
      if (typeof document.body !== "undefined") {
        _bodyLoaded = true;
      }

      if (_bodyLoaded) {
        load();
      }
    }

    checkIfLoaded(); // Run on load
    const checkIfLoadedInterval = setInterval(() => {
      if (_bodyLoaded) {
        clearInterval(checkIfLoadedInterval);
      } else {
        checkIfLoaded();
      }
    }, 1000);

    // Return public API
    return {
      setFilter: function(filterType, value) {
        filterState[filterType] = value;
        renderWithFilters();
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
        renderWithFilters();
      },
      applySpecialFilter: function(filterName) {
        filterState.specialFilter = filterName;
        initializeSpecialDateFilters();
        renderWithFilters();
      }
    };
  })();
}