# Changelog

## Version 2.1.0 (2025-04-18)

### Major Improvements
- Added enhanced loading overlay with spinner to improve user experience
- Created configurator tool to easily build custom embed code
- Simplified project by focusing on the enhancer add-on script
- Better error handling for failed API requests

### Enhancements
- Improved loading state management to prevent flickering
- Added clear error messages when data fetching fails
- Updated API endpoint URLs to use appropriate versioning
- Better UI consistency in filter controls and badges
- Enhanced documentation with clearer usage examples

### Code Improvements
- Removed unneeded combined script version to reduce maintenance
- Better error state handling with helpful user messages
- Improved positioning and styling of loading indicators
- Updated inline documentation and code comments
- Added version number to script header

## Version 2.0.0 (2025-04-17)

### Major Improvements
- Complete refactoring into modular, maintainable code structure with proper namespacing
- Added new filtering capabilities:
  - Tag filtering with "any" or "all" matching logic
  - Date range filtering
  - Days of week filtering
  - Special filters (this week, next weekend, next 7/30 days)
  - Event limit filtering
- Added visual filtering UI with intuitive controls
- Filter state is persisted in URL parameters for easy sharing
- Added support for combined view (shows + classes in one display)
- Implemented client-side caching of events for improved performance
- Added "no events found" message for empty search results

### New Features
- Tag badges displayed on cards and in calendar events
- Type indicators for combined view (distinguishing shows vs classes)
- Responsive filter panel that works on all device sizes
- Public JavaScript API for programmatic filter control
- URL parameter support for deep linking to specific filtered views

### Enhancements
- Improved error handling throughout the application
- Better responsive design and mobile experience
- More consistent date/time formatting across views
- Optimized API requests with intelligent caching
- More accessible event display with improved contrast

### Code Improvements
- Implemented module pattern for better code organization
- Reduced duplicated code through helper functions
- Improved variable naming for better readability
- Added more robust error handling
- Better separation of concerns (data/view/control logic)
- Proper closures to prevent global namespace pollution
- Added comprehensive documentation in code