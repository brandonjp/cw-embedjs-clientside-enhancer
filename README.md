# CrowdWork Event Display Enhancer

[![Version](https://img.shields.io/badge/version-2.2.0-blue.svg)](https://github.com/brandonjp/cw-embedjs-clientside-enhancer)
[![Try the Configurator](https://img.shields.io/badge/Try%20the%20Configurator-blue?style=for-the-badge)](https://brandonjp.github.io/cw-embedjs-clientside-enhancer/configurator)

A JavaScript enhancer that adds advanced client-side filtering capabilities to CrowdWork's event display embed script. Filter events by tags, dates, days of the week, and more—all without modifying the original embed or data source.

> **Disclaimer:** This is an unofficial, community-created tool. It is **not affiliated with, endorsed by, or connected to CrowdWork** in any way. Use at your own discretion.

---

## Table of Contents

- [Features](#features)
- [Quick Start](#quick-start)
- [Installation](#installation)
- [Configuration Options](#configuration-options)
  - [Base Configuration](#base-configuration-original-options)
  - [Advanced Filtering Options](#advanced-filtering-options)
- [URL Parameter Support](#url-parameter-support)
- [Special Filters](#special-filters)
- [JavaScript API](#javascript-api)
- [Example Use Cases](#example-use-cases)
- [Using the Configurator](#using-the-configurator)
- [Project Structure](#project-structure)
- [Browser Compatibility](#browser-compatibility)
- [Known Limitations](#known-limitations)
- [Development](#development)
- [Changelog](#changelog)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **Tag-Based Filtering**: Include or exclude events by tags with "any" or "all" matching logic
- **Date Range Filtering**: Filter events within specific date ranges or time periods
- **Day of Week Filtering**: Show only events on specific days (e.g., weekends only)
- **Special Filters**: Pre-built filters like "this weekend", "next 7 days", etc.
- **Event Limiting**: Cap the number of displayed events
- **Combined View**: Display both shows and classes in a single view
- **Interactive Filter UI**: Optional filter controls for visitors to filter events themselves
- **URL Parameter Support**: Create shareable links with filters pre-applied
- **JavaScript API**: Programmatically control filters from your own scripts
- **Tag Display**: Optionally show event tags directly on cards and calendar events
- **Fully Client-Side**: Works without any backend changes—just add the enhancer script

---

## Quick Start

Add the following code to your HTML where you want the event display to appear:

```html
<!-- CrowdWork Event Display with Enhancer -->
<script id="fw_script" src="https://crowdwork.com/embed.js?v=BETA-2025-04"
        data-theatre="your-theatre"></script>
<script src="https://brandonjp.github.io/cw-embedjs-clientside-enhancer/embed-enhancer.js"></script>
<div id="fourth_wall"></div>
```

Replace `your-theatre` with your CrowdWork theatre subdomain.

For customized configurations, use our **[Online Configurator](https://brandonjp.github.io/cw-embedjs-clientside-enhancer/configurator)** to generate your embed code.

---

## Installation

### Method 1: Using the Online Configurator (Recommended)

1. Visit the **[Online Configurator](https://brandonjp.github.io/cw-embedjs-clientside-enhancer/configurator)**
2. Enter your theatre name and configure your desired options
3. Click "Preview Live" to see how it will look
4. Make adjustments and preview again as needed
5. When satisfied, click "Generate Embed Code"
6. Copy the generated code to your website

### Method 2: Manual Installation

Include the original CrowdWork embed script followed by the enhancer script:

```html
<script id="fw_script" src="https://crowdwork.com/embed.js?v=BETA-2025-04"
        data-theatre="your-theatre"
        data-type="shows"
        data-view="calendar"></script>
<script src="https://brandonjp.github.io/cw-embedjs-clientside-enhancer/embed-enhancer.js"></script>
<div id="fourth_wall"></div>
```

Add any additional data attributes from the configuration options below to customize the display.

---

## Configuration Options

Configuration is done via `data-*` attributes on the original script tag.

### Base Configuration (Original Options)

These are the standard CrowdWork embed options:

| Attribute | Type | Description | Default |
|-----------|------|-------------|---------|
| `data-theatre` | string | Your CrowdWork theatre subdomain | **Required** |
| `data-type` | string | Type of events: `"shows"` or `"classes"` | `"shows"` |
| `data-view` | string | Display mode: `"calendar"` or `"cards"` | `"calendar"` for shows, `"cards"` for classes |
| `data-category` | string | Filter events by category name | None |
| `data-start-date` | string | Initial calendar date (YYYY-MM-DD) | Current date |
| `data-start-dow` | number | First day of week (0=Sunday, 1=Monday, etc.) | 1 (Monday) |
| `data-local` | boolean | Open links in same window | `false` |
| `data-development` | boolean | Use development API endpoints | `false` |

### Advanced Filtering Options

These options are provided by the enhancer script:

| Attribute | Type | Description | Default |
|-----------|------|-------------|---------|
| `data-show-filters` | boolean | Show filter button for visitors | `false` |
| `data-show-tags` | boolean | Display event tags on cards/calendar | `false` |
| `data-include-tags` | string | Comma-separated tags to include | None |
| `data-exclude-tags` | string | Comma-separated tags to exclude | None |
| `data-tag-match` | string | Tag matching: `"any"` or `"all"` | `"any"` |
| `data-limit` | number | Maximum events to display | 0 (no limit) |
| `data-date-range` | string | Date range: `"start,end"` (YYYY-MM-DD) | None |
| `data-date-offset` | string | Time period from today: `"7d"`, `"2w"`, `"1m"` | None |
| `data-days-of-week` | string | Days to include (0-6, 0=Sunday) | None |
| `data-special-filter` | string | Predefined filter name | None |
| `data-combined-view` | boolean | Show both shows and classes | `false` |

#### Date Range Examples

```html
<!-- Events from May 1-31, 2025 -->
data-date-range="2025-05-01,2025-05-31"

<!-- Events from a specific date forward -->
data-date-range="2025-05-01,"

<!-- Events from today until a specific date -->
data-date-range=",2025-05-31"
```

#### Date Offset Examples

```html
<!-- Events in the next 7 days -->
data-date-offset="7d"

<!-- Events in the next 2 weeks -->
data-date-offset="2w"

<!-- Events in the next month -->
data-date-offset="1m"
```

---

## URL Parameter Support

The enhancer automatically detects and applies filters from URL parameters, enabling:

- **Shareable filtered views**: Create links to specific filtered event listings
- **Targeted landing pages**: Build category-specific pages without separate embeds
- **Marketing campaigns**: Generate direct links to specific event types

### How It Works

When someone visits a page with your embed, the enhancer checks the URL for filter parameters and automatically applies those filters.

### Supported Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `include-tags` | Comma-separated tags to include | `?include-tags=comedy,music` |
| `exclude-tags` | Comma-separated tags to exclude | `?exclude-tags=18+,mature` |
| `tag-match` | Matching strategy: `"any"` or `"all"` | `?tag-match=all` |
| `start-date` | Filter start date (YYYY-MM-DD) | `?start-date=2025-05-01` |
| `end-date` | Filter end date (YYYY-MM-DD) | `?end-date=2025-05-31` |
| `days-of-week` | Days to include (0-6) | `?days-of-week=5,6` |
| `limit` | Maximum events to show | `?limit=5` |
| `special-filter` | Predefined filter name | `?special-filter=next-weekend` |

### Example URLs

```
# Weekend events only
https://yoursite.com/events?days-of-week=5,6

# Comedy shows
https://yoursite.com/events?include-tags=comedy

# Events this week (max 5)
https://yoursite.com/events?special-filter=next-7-days&limit=5

# Comedy shows next weekend
https://yoursite.com/events?include-tags=comedy&special-filter=next-weekend
```

---

## Special Filters

Pre-built date filters available via `data-special-filter` attribute or `special-filter` URL parameter:

| Value | Description |
|-------|-------------|
| `this-week` | Events from the current week (Monday to Sunday) |
| `next-week` | Events from next week |
| `this-weekend` | Events from the upcoming/current weekend (Saturday-Sunday) |
| `next-weekend` | Events from the next weekend |
| `next-7-days` | Events in the next 7 days |
| `next-30-days` | Events in the next 30 days |

---

## JavaScript API

The `FWEnhancer` object is exposed globally for programmatic filter control:

```javascript
// Set a filter
FWEnhancer.setFilter('includeTags', ['comedy', 'music']);
FWEnhancer.setFilter('limit', 5);
FWEnhancer.setFilter('daysOfWeek', [5, 6]); // Friday, Saturday

// Apply a quick/special filter
FWEnhancer.applyQuickFilter('next-weekend');

// Reset all filters to defaults
FWEnhancer.resetFilters();

// Get current filter state
const state = FWEnhancer.getFilterState();
console.log(state.includeTags);  // ['comedy', 'music']
console.log(state.limit);        // 5
```

### Available Filter Properties

| Property | Type | Description |
|----------|------|-------------|
| `includeTags` | Array | Tags to include |
| `excludeTags` | Array | Tags to exclude |
| `tagMatch` | String | `"any"` or `"all"` |
| `startDate` | Date | Start date for filtering |
| `endDate` | Date | End date for filtering |
| `daysOfWeek` | Array | Days to include (0-6) |
| `limit` | Number | Maximum events |
| `specialFilter` | String | Current special filter name |

---

## Example Use Cases

### "What's Happening This Weekend" Widget

```html
<script id="fw_script" src="https://crowdwork.com/embed.js?v=BETA-2025-04"
        data-theatre="your-theatre"
        data-special-filter="next-weekend"
        data-limit="3"
        data-view="cards"></script>
<script src="https://brandonjp.github.io/cw-embedjs-clientside-enhancer/embed-enhancer.js"></script>
<div id="fourth_wall"></div>
```

### Combined Calendar (Shows + Classes)

```html
<script id="fw_script" src="https://crowdwork.com/embed.js?v=BETA-2025-04"
        data-theatre="your-theatre"
        data-combined-view="true"></script>
<script src="https://brandonjp.github.io/cw-embedjs-clientside-enhancer/embed-enhancer.js"></script>
<div id="fourth_wall"></div>
```

### Comedy Events Only (with Tags Visible)

```html
<script id="fw_script" src="https://crowdwork.com/embed.js?v=BETA-2025-04"
        data-theatre="your-theatre"
        data-view="cards"
        data-include-tags="comedy,improv"
        data-tag-match="any"
        data-show-tags="true"></script>
<script src="https://brandonjp.github.io/cw-embedjs-clientside-enhancer/embed-enhancer.js"></script>
<div id="fourth_wall"></div>
```

### Friday Night Shows Only

```html
<script id="fw_script" src="https://crowdwork.com/embed.js?v=BETA-2025-04"
        data-theatre="your-theatre"
        data-days-of-week="5"></script>
<script src="https://brandonjp.github.io/cw-embedjs-clientside-enhancer/embed-enhancer.js"></script>
<div id="fourth_wall"></div>
```

### Events with Interactive Filters for Visitors

```html
<script id="fw_script" src="https://crowdwork.com/embed.js?v=BETA-2025-04"
        data-theatre="your-theatre"
        data-show-filters="true"></script>
<script src="https://brandonjp.github.io/cw-embedjs-clientside-enhancer/embed-enhancer.js"></script>
<div id="fourth_wall"></div>
```

### Family-Friendly Events (Exclude Adult Content)

```html
<script id="fw_script" src="https://crowdwork.com/embed.js?v=BETA-2025-04"
        data-theatre="your-theatre"
        data-exclude-tags="18+,mature,adult"
        data-view="cards"></script>
<script src="https://brandonjp.github.io/cw-embedjs-clientside-enhancer/embed-enhancer.js"></script>
<div id="fourth_wall"></div>
```

---

## Using the Configurator

The **[Online Configurator](https://brandonjp.github.io/cw-embedjs-clientside-enhancer/configurator)** provides a visual interface to:

1. **Configure all options** - Set theatre name, view type, filters, and more
2. **Preview live** - See exactly how the embed will appear before deployment
3. **Generate code** - Get ready-to-use HTML code for your website

### Configurator Features

- **Basic Configuration**: Theatre name, event type, view type, category filter
- **Advanced Filtering**: Tags, date ranges, special filters, event limits
- **Live Preview**: Test your configuration with real data
- **Code Generation**: Copy-paste ready embed code

You can also run the configurator locally by opening `/configurator/index.html` in your browser.

---

## Project Structure

```
cw-embedjs-clientside-enhancer/
├── embed-enhancer.js      # Main enhancer script
├── embed-orig.js          # Original embed script (reference only)
├── configurator/
│   └── index.html         # Visual configurator tool
├── README.md              # This documentation
├── CHANGELOG.md           # Version history and changes
├── LAUNCH_READINESS.md    # Production deployment checklist
└── CLAUDE.md              # AI assistant instructions
```

### File Descriptions

| File | Description |
|------|-------------|
| `embed-enhancer.js` | The main enhancer script (~64KB). Include this after the original CrowdWork embed script. |
| `embed-orig.js` | A reference copy of the original CrowdWork embed script. **Do not use directly**—always load from CrowdWork's servers. |
| `configurator/index.html` | A standalone HTML tool for configuring and previewing embed options. Hosted at GitHub Pages. |

---

## Browser Compatibility

The enhancer is compatible with modern browsers:

| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome | Latest 2 versions | Latest 2 versions |
| Firefox | Latest 2 versions | Latest 2 versions |
| Safari | Latest 2 versions | iOS Safari |
| Edge | Latest 2 versions | - |

The code uses ES6+ features with graceful degradation where possible.

---

## Known Limitations

1. **Calendar View Filtering**: The enhancer hides/shows events visually but doesn't update FullCalendar's internal event store. Navigating between months may briefly show all events before filtering re-applies.

2. **Tag Matching is Case-Sensitive**: Tags must match exactly. `"Comedy"` and `"comedy"` are treated as different tags.

3. **URL Parameters Override Attributes**: Filters from URL parameters take precedence over `data-*` attributes. This is intentional for link sharing but may be unexpected.

4. **Combined View Performance**: Loading both shows and classes requires two API calls, which may be slower on poor connections.

5. **Multiple Embeds**: While technically supported, multiple embeds with different configurations on the same page are not thoroughly tested.

6. **Original Script Dependency**: The enhancer requires the original CrowdWork embed script to load first. If it fails, the enhancer will log an error but not crash the page.

---

## Development

### Running Locally

1. Clone the repository
2. Open the configurator: `configurator/index.html`
3. Or create a test HTML file with the embed code

### Development Mode

To use development API endpoints, add the `data-development` attribute:

```html
<script id="fw_script" src="https://crowdwork.com/embed.js?v=BETA-2025-04"
        data-theatre="one"
        data-development="true"></script>
```

This will use `http://lvh.me:3000` as the base URL instead of the production domain.

### Code Quality

Run ESLint for code quality checks:

```bash
npx eslint embed-enhancer.js
```

---

## Changelog

See the [CHANGELOG.md](CHANGELOG.md) file for a detailed list of changes between versions.

### Recent Updates

- **v2.2.0** (2026-01-21): Launch readiness documentation, version bump
- **v2.1.7** (2025-04-18): Added display tags option, fixed filtering issues
- **v2.1.6** (2025-04-18): Enhanced date range filtering with one-sided ranges
- **v2.1.5** (2025-04-18): Rewrote embed detection, fixed loading spinner issues

---

## Contributing

Contributions are welcome! Please:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Guidelines

- Follow existing code style (ES6+, 2-space indentation)
- Maintain comprehensive JSDoc comments
- Test across multiple browsers
- Update documentation for new features
- Add entries to CHANGELOG.md

---

## License

This project is provided as-is for testing and educational purposes. It is **not an official CrowdWork product**.

Use at your own risk. The enhanced script may cause increased API usage and load times on CrowdWork's servers.

---

## Support

For issues, questions, or feature requests, please [open an issue](https://github.com/brandonjp/cw-embedjs-clientside-enhancer/issues) on GitHub.
