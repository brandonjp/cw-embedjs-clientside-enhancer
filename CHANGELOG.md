# Changelog

## Version 2.1.3 (2025-04-18)

### Important Feature Additions
- Added filter button toggle option:
  - New `data-show-filters` attribute to control visibility of filter controls
  - Default is true (filters shown) for backward compatibility
  - Added in configurator as checkbox in basic settings
  - Updated documentation to reflect new attribute

### Bug Fixes
- Fixed preview loading spinner:
  - Added smart detection of calendar/card elements to remove spinner
  - Added fallback timer to ensure spinner is removed
  - Fixed CORS issues by removing unnecessary stylesheet references
  - More reliable preview experience with better load handling

## Version 2.1.2 (2025-04-18)

### Configurator Tool Enhancements
- Added live preview functionality:
  - New "Preview Live" button to see the widget in action
  - Loading spinner while preview loads
  - Interactive workflow to preview, edit, and generate code
- Improved user experience:
  - Added tooltips and help text for all configuration options
  - Added form reset button to start over
  - Improved mobile responsiveness with better button layouts
  - Added visual feedback during preview loading
- Added documentation for online configurator:
  - Added prominent links to the hosted version at GitHub Pages
  - Updated README with badge and direct links to online configurator
  - Added instructions for using the online version

## Version 2.1.1 (2025-04-18)

### Configurator Tool Fixes
- Fixed UI issues in the configurator tool:
  - Added sans-serif font styling throughout the interface
  - Fixed script tag rendering issues in the generated code
  - Fixed form submission to properly display generated code without page reload
  - Updated enhancer script path to use relative path for easier testing
- Improved day of week selector to correctly capture selected days

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