# Prompt: Enhanced Event Display Embed Script Development

## Project Overview
Create two JavaScript solutions that enhance an existing event display embed script:

1. A complete rewrite of the original embed.js with advanced filtering capabilities
2. A companion script that adds functionality to the original embed.js without modifying it

Both versions should add client-side filtering and display options without modifying the existing API or data source.

## Current Functionality
The existing embed.js:
- Fetches event data (shows and classes) from a server API
- Renders events as either calendar or card views
- Supports basic filtering by category/tag
- Provides modal pop-ups with event details
- Uses FullCalendar for calendar display
- Handles responsive layouts

## New Filtering Requirements
Add client-side filtering capabilities that enable:

- Multiple tag filtering (include events with ANY or ALL specified tags)
- Tag exclusion (exclude events with specified tags)
- Event count limitation (show only X number of events)
- Time-based filtering options:
  - Date range filtering (specific start/end dates)
  - Show events within X days/weeks/months from current date
  - Day of week filtering (e.g., only Mondays, weekends)
  - Special filters like "next weekend" or "this week"
- Combined view of different event types (shows AND classes in one display)

## Technical Requirements

### Version 1: Complete Rewrite
- Maintain all existing functionality of the original script
- Modularize code for better maintainability
- Add new filtering capabilities as client-side options
- Preserve the existing API endpoints and parameter structure
- Support backward compatibility with current embed script attributes
- Add new data attributes for advanced filtering options
- Optimize performance for large datasets

### Version 2: Companion Script
- Function as a separate script that loads after the original embed.js
- Target and enhance the DOM elements created by the original script
- Add UI controls for filtering (if appropriate)
- Implement client-side filtering without modifying the original script
- Handle calendar and card view enhancements separately
- Avoid conflicts with the original script's functionality

## Implementation Guidelines

### Data Handling
- Fetch complete dataset from API, then apply client-side filters
- Cache original data to allow dynamic filtering without additional API calls
- Implement efficient filtering algorithms for larger datasets
- Handle edge cases (empty results, filter combinations)

### User Interface
- Add clear, intuitive controls for filter options
- Support URL parameters for pre-filtered views
- Provide visual feedback during filtering operations
- Ensure responsive design for filter controls

### Code Quality
- Write clean, well-documented code
- Use modern JavaScript practices (ES6+)
- Include comprehensive error handling
- Minimize dependencies where possible
- Follow performance best practices

## Example Use Cases
Provide implementation examples for these specific scenarios:

1. "Here's what's happening next weekend" widget
2. Combined calendar showing both classes and shows
3. Card view of all upcoming events with tag filtering
4. Weekly view filtered to specific days (e.g., only Fridays)
5. Limited display of the next X upcoming events

## Deliverables
1. Complete rewritten embed.js with all enhancements
2. Companion script that works alongside the original embed.js
3. Documentation for both implementations including:
   - Installation instructions
   - Configuration options
   - Usage examples
   - Filtering API reference

Create production-ready code that balances feature richness with performance and usability. Ensure both versions are thoroughly tested across different browsers and implement graceful degradation for older browsers.
