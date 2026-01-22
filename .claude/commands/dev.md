# Development Workflow Guide

This document provides comprehensive guidance for developers (human or AI) working on the CrowdWork Event Display Enhancer project.

---

## Project Overview

**CrowdWork Event Display Enhancer** is a client-side JavaScript enhancement script that adds advanced filtering capabilities to CrowdWork's event display embed system.

- **Language:** Vanilla JavaScript (ES6+)
- **Build System:** None (plain JS files served directly)
- **Dependencies:** None for the main script; Bootstrap 5.2.3 for the configurator UI
- **Current Version:** 2.2.0
- **Hosting:** GitHub Pages (brandonjp.github.io)

---

## Quick Start

### Local Development

1. Clone the repository
2. Open `configurator/index.html` in a browser to test the configurator
3. Create a test HTML file with the embed code to test the enhancer script
4. Use `npx eslint embed-enhancer.js` for code quality checks

### Key Files

| File | Description |
|------|-------------|
| `embed-enhancer.js` | Main enhancer script (~64KB) - the core deliverable |
| `configurator/index.html` | Visual configuration tool for generating embed code |
| `embed-orig.js` | Reference copy of original CrowdWork script (do not modify) |
| `README.md` | User-facing documentation |
| `CHANGELOG.md` | Version history |
| `LAUNCH_READINESS.md` | Production launch checklist |
| `CLAUDE.md` | AI assistant coding instructions |

---

## Development Standards

### Code Style

- Use modern ES6+ JavaScript
- 2-space indentation
- IIFE pattern for encapsulation
- Clear, self-documenting variable names
- Comprehensive JSDoc-style comments for public functions
- Graceful degradation for older browsers

### Error Handling

- Use try/catch blocks for all API calls
- Provide helpful user-facing error messages
- Log debug information only in development mode

### Testing

1. **Manual Browser Testing:**
   - Test in Chrome, Firefox, Safari, Edge (latest 2 versions)
   - Test on mobile devices (iOS Safari, Chrome Android)

2. **Functional Testing:**
   - Calendar view: event display, navigation, filtering
   - Card view: display, click actions, filtering
   - Filter controls: all filter types, combinations
   - URL parameters: all supported parameters
   - JavaScript API: setFilter, resetFilters, applyQuickFilter, getFilterState

3. **Code Quality:**
   ```bash
   npx eslint embed-enhancer.js
   ```

---

## Version Management

### Version Locations (Keep Synchronized)

When updating the version, update ALL of these locations:

1. `embed-enhancer.js` - Header comment (line 2)
2. `configurator/index.html` - Version display (search for "Version v")
3. `README.md` - Version badge and recent updates section
4. `CHANGELOG.md` - Add new version entry at top
5. `.cursor/rules/project-structure.mdc` - Version reference

### Versioning Strategy

Follow semantic versioning (MAJOR.MINOR.PATCH):
- **MAJOR (x.0.0):** Breaking changes
- **MINOR (0.x.0):** New features, backward compatible
- **PATCH (0.0.x):** Bug fixes, documentation updates

### Version Bump Checklist

1. Update version in all locations listed above
2. Add CHANGELOG.md entry with date and description
3. Update README.md "Recent Updates" section if significant
4. Commit with message: `Version X.Y.Z: Brief description`
5. Consider creating a git tag: `git tag -a vX.Y.Z -m "Version X.Y.Z"`

---

## Common Development Tasks

### Adding a New Filter Option

1. Add data attribute parsing in `embed-enhancer.js` (look for `parseConfig()`)
2. Add filter logic in the appropriate filter function
3. Update URL parameter support if needed
4. Add to configurator UI in `configurator/index.html`
5. Update README.md Configuration Options table
6. Add tests for the new filter
7. Update CHANGELOG.md

### Fixing a Bug

1. Reproduce the issue
2. Identify the root cause in the code
3. Implement the fix
4. Test the fix across browsers
5. Update CHANGELOG.md with bug fix entry
6. Consider if version bump is needed

### Updating Documentation

1. Make changes to relevant markdown files
2. Verify all links work
3. Update CHANGELOG.md if significant documentation change
4. Keep version numbers synchronized

---

## Launch Readiness

Before deploying to a new client, review `LAUNCH_READINESS.md` which contains:

- Phase 1: Critical pre-launch requirements
- Phase 2: Edge cases and reliability testing
- Phase 3: Documentation and client support
- Phase 4: Production deployment checklist
- Phase 5: Post-launch monitoring

### Minimum Test Scenarios (30 minutes)

1. Basic display with default settings
2. Tag filtering with `data-include-tags`
3. Date filtering with `data-special-filter`
4. Event limiting with `data-limit`
5. URL parameter filtering
6. Mobile device testing

---

## Architecture Overview

```
embed-enhancer.js
├── Configuration Parsing
│   └── parseConfig() - reads data-* attributes
├── Event Caching
│   └── cachedData - stores fetched events
├── Filter State Management
│   └── filterState - current filter settings
├── Filtering Logic
│   ├── filterByTags()
│   ├── filterByDateRange()
│   ├── filterByDaysOfWeek()
│   └── applySpecialFilter()
├── View Enhancement
│   ├── enhanceCalendarView()
│   └── enhanceCardView()
├── UI Components
│   ├── Filter Panel
│   └── Filter Badges
└── Public API (FWEnhancer)
    ├── setFilter()
    ├── resetFilters()
    ├── applyQuickFilter()
    └── getFilterState()
```

---

## Known Issues & Technical Debt

From CHANGELOG v2.2.0 review notes:
- [ ] Debug console.log statements should be conditional on development mode
- [ ] MutationObserver should be disconnected on page unload (memory leak prevention)
- [ ] Consider adding network timeout/retry logic for API calls

---

## Continuing Development

### Current Status

Version 2.2.0 is the "Launch Readiness Release" with comprehensive documentation for first client deployment.

### Next Steps (Suggested Priorities)

1. **Address Code Review Notes** - Clean up debug logging, fix memory leak potential
2. **Complete Launch Readiness Testing** - Work through LAUNCH_READINESS.md checklist
3. **Client Deployment** - Deploy to first client and gather feedback
4. **Feature Enhancements** - Based on client feedback

### How to Resume Work

To continue development in a new session:

```
"Continue development on the CrowdWork Event Display Enhancer.
Current version is 2.2.0. Check LAUNCH_READINESS.md for pending items
and CHANGELOG.md for recent history."
```

---

## Resources

- **GitHub Repository:** https://github.com/brandonjp/cw-embedjs-clientside-enhancer
- **Live Configurator:** https://brandonjp.github.io/cw-embedjs-clientside-enhancer/configurator
- **Hosted Script:** https://brandonjp.github.io/cw-embedjs-clientside-enhancer/embed-enhancer.js

---

## Commit Message Format

Follow conventional commit format:
```
Type: Brief description

Detailed description if needed.

https://claude.ai/code/session_ID
```

Types: `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

Examples:
- `feat: Add date offset filtering option`
- `fix: Resolve calendar view flickering on filter change`
- `docs: Update README with new configuration options`
