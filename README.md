# Enhanced Event Display Embed Scripts (v2.1.1)

This project provides a JavaScript enhancer that adds advanced filtering capabilities to the original event display embed script.

## Overview

1. **Enhancer Script (`embed-enhancer.js`)**: Works alongside the original embed script to add advanced filtering
2. **Configurator Tool**: A web-based tool to help build custom embed codes with the desired options
3. **Original Script Reference** (`embed-orig.js`): The original embed script for reference

The enhancer enables client-side filtering and display options without changing the existing API or data source.

## Installation

### Using the Enhancer Script

Include the original embed script followed by the enhancer script:

```html
<script id="fw_script" src="https://crowdwork.com/embed.js?v=BETA-2025-04" data-theatre="your-theatre"></script>
<script src="path/to/embed-enhancer.js"></script>
<div id="fourth_wall"></div>
```

### Using the Configurator

For an easier setup, use the configurator tool to generate your embed code:

1. Open the configurator tool at `/configurator/index.html`
2. Configure your desired options
3. Copy the generated code to your website

## Configuration Options

The script supports the following configuration options via data attributes:

### Base Configuration (Original Options)

| Attribute | Type | Description | Default |
|-----------|------|-------------|---------|
| `data-theatre` | string | The theatre subdomain to fetch data from | Required |
| `data-type` | string | Type of events to display: "shows" or "classes" | "shows" |
| `data-view` | string | Display mode: "calendar" or "cards" | "calendar" for shows, "cards" for classes |
| `data-category` | string | Filter events by category | None |
| `data-start-date` | string | Initial calendar date (YYYY-MM-DD) | Current date |
| `data-start-dow` | number | First day of week (0=Sunday, 1=Monday, etc.) | 1 (Monday) |
| `data-local` | boolean | Whether to open links in same window | false |
| `data-development` | boolean | Enable development mode | false |

### Advanced Filtering Options (New)

| Attribute | Type | Description | Default |
|-----------|------|-------------|---------|
| `data-include-tags` | string | Comma-separated list of tags to include | None |
| `data-exclude-tags` | string | Comma-separated list of tags to exclude | None |
| `data-tag-match` | string | Tag matching strategy: "any" or "all" | "any" |
| `data-limit` | number | Maximum number of events to show | 0 (no limit) |
| `data-date-range` | string | Date range (format: "YYYY-MM-DD,YYYY-MM-DD") | None |
| `data-date-offset` | string | Show events within period (e.g., "7d", "2w", "1m") | None |
| `data-days-of-week` | string | Comma-separated days to include (0-6, where 0=Sunday) | None |
| `data-special-filter` | string | Predefined filter (see Special Filters) | None |
| `data-combined-view` | boolean | Show both shows and classes in one view | false |

## URL Parameter Support

The script supports the following URL parameters for sharing filtered views:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `include-tags` | Comma-separated list of tags to include | `?include-tags=comedy,music` |
| `exclude-tags` | Comma-separated list of tags to exclude | `?exclude-tags=18+,mature` |
| `tag-match` | Tag matching strategy: "any" or "all" | `?tag-match=all` |
| `start-date` | Filter start date (YYYY-MM-DD) | `?start-date=2025-05-01` |
| `end-date` | Filter end date (YYYY-MM-DD) | `?end-date=2025-05-31` |
| `days-of-week` | Comma-separated days to include (0-6) | `?days-of-week=5,6` (weekends) |
| `limit` | Maximum number of events to show | `?limit=5` |
| `special-filter` | Predefined filter | `?special-filter=next-weekend` |

## Special Filters

The following special filters are available via the `data-special-filter` attribute or `special-filter` URL parameter:

| Value | Description |
|-------|-------------|
| `this-week` | Events from the current week (Monday to Sunday) |
| `next-week` | Events from next week |
| `this-weekend` | Events from the upcoming/current weekend |
| `next-weekend` | Events from the next weekend |
| `next-7-days` | Events in the next 7 days |
| `next-30-days` | Events in the next 30 days |

## JavaScript API

The FWEmbed object is exposed in the global scope and provides methods for manipulating filters:

```javascript
// Set a specific filter
FWEmbed.setFilter('includeTags', ['comedy', 'music']);

// Reset all filters
FWEmbed.resetFilters();

// Apply a special filter
FWEmbed.applySpecialFilter('next-weekend');
```

## Example Use Cases

### "Here's what's happening next weekend" widget

```html
<script id="fw_script" src="embed-new.js" data-theatre="your-theatre" data-special-filter="next-weekend" data-limit="3"></script>
<div id="fourth_wall"></div>
```

### Combined calendar showing both classes and shows

```html
<script id="fw_script" src="embed-new.js" data-theatre="your-theatre" data-combined-view="true"></script>
<div id="fourth_wall"></div>
```

### Card view of all upcoming events with tag filtering

```html
<script id="fw_script" src="embed-new.js" data-theatre="your-theatre" data-view="cards" data-include-tags="comedy,improv" data-tag-match="any"></script>
<div id="fourth_wall"></div>
```

### Weekly view filtered to specific days (e.g., only Fridays)

```html
<script id="fw_script" src="embed-new.js" data-theatre="your-theatre" data-days-of-week="5"></script>
<div id="fourth_wall"></div>
```

### Limited display of the next X upcoming events

```html
<script id="fw_script" src="embed-new.js" data-theatre="your-theatre" data-view="cards" data-limit="5"></script>
<div id="fourth_wall"></div>
```

## Browser Compatibility

The script is compatible with modern browsers (Chrome, Firefox, Safari, Edge). The code uses ES6+ features with graceful degradation for older browsers.

## Development

To run in development mode, add the `data-development` attribute:

```html
<script id="fw_script" src="embed-new.js" data-theatre="one" data-development="true"></script>
```

This will use `http://lvh.me:3000` as the base URL instead of the production domain.

## Changelog

See the [CHANGELOG.md](CHANGELOG.md) file for a detailed list of changes between versions.