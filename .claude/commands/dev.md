# /dev - CrowdWork Event Display Enhancer Development Workflow

> A vanilla JavaScript enhancer adding client-side filtering capabilities to CrowdWork's event display embed system.

---

## Quick Start

**Clone & Setup:**
```bash
git clone https://github.com/brandonjp/cw-embedjs-clientside-enhancer.git
cd cw-embedjs-clientside-enhancer
```

**Test Locally:**
```bash
# Open configurator in browser
open configurator/index.html
# Or create a test HTML file with the embed code
```

**Lint/Check Code:**
```bash
npx eslint embed-enhancer.js
```

**No build process required** - vanilla JS served directly.

---

## Project Overview

**Type:** Client-side JavaScript library (embed enhancer)
**Stack:** Vanilla JavaScript (ES6+), no runtime dependencies
**Version:** 2.2.0 (Semantic Versioning)
**Package Manager:** npm (dev tools only - eslint)
**Deployment:** GitHub Pages (brandonjp.github.io)

### Project Structure

```
cw-embedjs-clientside-enhancer/
├── embed-enhancer.js          # Main enhancer script (the deliverable)
├── embed-orig.js              # Reference copy of CrowdWork script (read-only)
├── configurator/
│   └── index.html             # Visual configuration tool
├── docs/
│   ├── ORIGINAL_REQUIREMENTS.md  # Original project requirements
│   └── ROADMAP.md             # Development roadmap & phases
├── .claude/
│   └── commands/
│       ├── dev.md             # This file
│       ├── setup-dev-guide.md # Workflow setup prompt
│       └── audit.md           # Audit command
├── .cursor/
│   └── rules/                 # Cursor IDE rules
├── CLAUDE.md                  # AI coding instructions
├── README.md                  # User documentation
├── CHANGELOG.md               # Version history
├── LAUNCH_READINESS.md        # Production deployment checklist
├── LICENSE                    # MIT License
└── .gitignore                 # Git ignore rules
```

### Key Configuration Files

| File | Purpose |
|------|---------|
| `CLAUDE.md` | AI assistant coding guidelines |
| `.gitignore` | Git ignore patterns |
| `.cursor/rules/*.mdc` | Cursor IDE configuration |

---

## Development Phases & Roadmap

### Phase Status Legend
- **Complete** - Work finished and released
- **In Progress** - Currently being worked on
- **Planned** - Scheduled for future development
- **Future** - Under consideration

### Current Focus: Phase 3.0 - Production Hardening

Preparing for first client deployment by addressing code quality issues and completing launch readiness testing.

### Phase History

| Phase | Status | Version | Description |
|-------|--------|---------|-------------|
| 1.0 - Foundation | Complete | 2.0.0 | Core filtering functionality, modular architecture |
| 2.0 - Feature Complete | Complete | 2.1.7 | All filter types, configurator tool, JavaScript API |
| 2.5 - Launch Prep | Complete | 2.2.0 | Launch readiness documentation, checklist |
| 3.0 - Production Hardening | In Progress | 2.3.0 | Code cleanup, memory leak fixes, first client |
| 4.0 - Client Feedback | Planned | 2.4.0 | Enhancements based on production usage |

**Full details:** See `docs/ROADMAP.md`

---

## What to Work On

### Priority Order (Phase 3.0)

1. **Address Code Review Notes** (High)
   - Make debug console.log conditional on development mode
   - Disconnect MutationObserver on page unload (memory leak)
   - Consider network timeout/retry logic for API calls

2. **Complete Launch Readiness Testing** (High)
   - Work through `LAUNCH_READINESS.md` Phase 1-2 checklists
   - Browser compatibility testing
   - Edge case validation

3. **First Client Deployment** (Medium)
   - Deploy to production client
   - Monitor for issues
   - Gather feedback

### Quick Links

- See `docs/ROADMAP.md` for detailed phases
- See `CHANGELOG.md` for version history
- See `LAUNCH_READINESS.md` for deployment checklist

---

## Development Standards

### Code Style

- **Language:** Modern ES6+ JavaScript
- **Indentation:** 2 spaces
- **Pattern:** IIFE for encapsulation, avoid global namespace pollution
- **Naming:** camelCase for variables and functions
- **Comments:** JSDoc-style for public functions
- **Browser Support:** Graceful degradation for older browsers

### Error Handling

- Use try/catch blocks for all API calls
- Provide helpful user-facing error messages
- Log debug information only when `data-development="true"`

### Code Quality Checks

```bash
# Run ESLint
npx eslint embed-enhancer.js

# Check for common issues
npx eslint embed-enhancer.js --fix
```

### Testing Strategy

**Manual Browser Testing:**
| Browser | Desktop | Mobile |
|---------|---------|--------|
| Chrome (latest 2) | Required | Required |
| Firefox (latest 2) | Required | Required |
| Safari (latest 2) | Required | iOS Safari |
| Edge (latest 2) | Required | - |

**Functional Testing Checklist:**
1. Calendar view: event display, navigation, filtering
2. Card view: display, click actions, filtering
3. Filter controls: all filter types, combinations
4. URL parameters: all supported parameters
5. JavaScript API: setFilter, resetFilters, applyQuickFilter, getFilterState

**Quick Test (30 minutes):**
1. Basic display with default settings
2. Tag filtering with `data-include-tags`
3. Date filtering with `data-special-filter`
4. Event limiting with `data-limit`
5. URL parameter filtering
6. Mobile device testing

### Version Management

**Strategy:** Semantic Versioning (MAJOR.MINOR.PATCH)
- **MAJOR:** Breaking changes
- **MINOR:** New features, backward compatible
- **PATCH:** Bug fixes, documentation

**Version Locations (Keep Synchronized):**
1. `embed-enhancer.js` - Header comment (line 2)
2. `configurator/index.html` - Version display text
3. `README.md` - Version badge and "Recent Updates" section
4. `CHANGELOG.md` - New version entry at top
5. `.cursor/rules/project-structure.mdc` - Version reference

**Bump version when:**
- Any code change to `embed-enhancer.js`
- Significant configurator changes
- Bug fixes (patch)
- New features (minor)

### Git Workflow

**Commit Format:** Conventional commits
```
type: Brief description

Detailed description if needed.
```

**Types:** `feat`, `fix`, `docs`, `style`, `refactor`, `test`, `chore`

**Examples:**
- `feat: Add date offset filtering option`
- `fix: Resolve calendar view flickering on filter change`
- `docs: Update README with new configuration options`

**Before Committing:**
- [ ] ESLint passes
- [ ] Manual testing completed
- [ ] Version bumped (if code changed)
- [ ] CHANGELOG updated
- [ ] Documentation updated

---

## Key Files & Directories

| Path | Purpose | When to Modify |
|------|---------|----------------|
| `embed-enhancer.js` | Main script (~64KB) | Any feature/fix work |
| `configurator/index.html` | Visual config tool | UI changes, new options |
| `README.md` | User documentation | New features, usage changes |
| `CHANGELOG.md` | Version history | Every release |
| `docs/ROADMAP.md` | Development phases | Phase transitions |
| `LAUNCH_READINESS.md` | Deploy checklist | Pre-launch verification |
| `CLAUDE.md` | AI instructions | Coding standard changes |

---

## Development Workflow Steps

### Starting a Work Session

1. **Review current state:**
   ```bash
   # Check current version
   head -5 embed-enhancer.js

   # Review CHANGELOG for recent work
   head -50 CHANGELOG.md
   ```

2. **Check priorities:**
   - Review `docs/ROADMAP.md` for current phase
   - Check `LAUNCH_READINESS.md` for pending items
   - Look at "What to Work On" section above

3. **Choose work item:**
   - Follow priority order above
   - Or specify: "work on phase 3.0"
   - Or: "work on the highest priority item"

### During Development

1. **Make changes following standards above**
2. **Test frequently:** Open configurator, test with real theatre
3. **Lint code:** `npx eslint embed-enhancer.js`
4. **Test in multiple browsers**
5. **Update documentation in same commit**

### Completing Work

1. **Verify testing complete**
2. **Update version number** (all locations)
3. **Update CHANGELOG.md**
4. **Update ROADMAP.md** (if phase milestone)
5. **Commit with descriptive message**
6. **Summarize what was done and suggest next steps**

---

## Common Tasks

### Adding a New Filter Option

1. **Add data attribute parsing** in `getOriginalScriptConfig()` (~line 409)
2. **Add filter state property** in `filterState` object (~line 42)
3. **Initialize from config** in `initializeFilterState()` (~line 438)
4. **Add filtering logic** in `applyFilters()` (~line 775)
5. **Add URL parameter support** in `initializeFromURLParams()` (~line 470)
6. **Update configurator UI** in `configurator/index.html`
7. **Update README** Configuration Options table
8. **Add to CHANGELOG** under Unreleased
9. **Bump minor version**

### Fixing a Bug

1. **Reproduce the issue** (note browser, configuration)
2. **Identify root cause** in the code
3. **Implement the fix**
4. **Test across browsers**
5. **Update CHANGELOG** under Fixed
6. **Bump patch version**

### Updating Documentation

1. Make changes to relevant markdown files
2. Verify all links work
3. Keep version numbers synchronized
4. Update CHANGELOG if significant

---

## Architecture Overview

```
embed-enhancer.js
├── Constants & State
│   ├── SCRIPT_ID, FILTER_PANEL_CLASS, etc.
│   ├── cachedData - stores fetched events
│   └── filterState - current filter settings
│
├── Configuration
│   ├── getOriginalScriptConfig() - reads data-* attributes
│   ├── initializeFilterState() - set initial filters
│   └── initializeFromURLParams() - URL parameter support
│
├── Data Fetching
│   ├── getApiBaseUrl() - build API URL
│   ├── fetchEvents() - API call
│   └── processApiData() - normalize event data
│
├── Filtering
│   ├── applyFilters() - main filter logic
│   ├── initializeSpecialDateFilters() - special filter dates
│   └── updateURLWithFilters() - sync URL state
│
├── View Enhancement
│   ├── enhanceCalendarView() - FullCalendar integration
│   ├── enhanceCardView() - card display
│   └── createLoadingOverlay() - loading state
│
├── UI Components
│   ├── setupFilterUI() - filter panel
│   ├── updateActiveFilterBadges() - active filter display
│   └── addStyles() - inject CSS
│
├── Initialization
│   ├── initEnhancer() - main entry point
│   └── attemptToFindEmbed() - DOM detection
│
└── Public API (window.FWEnhancer)
    ├── setFilter(type, value)
    ├── resetFilters()
    ├── applyQuickFilter(name)
    └── getFilterState()
```

---

## Known Issues & Technical Debt

**From Code Review (v2.2.0):**

| Issue | Priority | Impact |
|-------|----------|--------|
| Debug console.log not conditional | Medium | Clutters production console |
| MutationObserver not disconnected | Medium | Potential memory leak on SPA |
| No network timeout/retry | Low | API calls can hang |

**Known Limitations:**

1. **Calendar Filtering:** Hides events visually but doesn't update FullCalendar's internal store. Month navigation may briefly show all events.

2. **Tag Matching:** Case-sensitive. "Comedy" and "comedy" are different.

3. **URL Parameters Override Attributes:** By design for link sharing.

4. **Combined View Performance:** Two API calls required.

5. **Multiple Embeds:** Not thoroughly tested.

---

## Troubleshooting

### Common Issues

**Embed not loading:**
- Check browser console for errors
- Verify `data-theatre` attribute is correct
- Ensure original CrowdWork script loads first

**Filters not working:**
- Check console for filter state logs
- Verify data attribute syntax (comma-separated, no spaces)
- Test with development mode: `data-development="true"`

**Loading spinner stuck:**
- Safety timeout (5s) should remove it
- Check if API endpoint is accessible
- Review console for fetch errors

**Calendar events flickering:**
- Known limitation - FullCalendar internal state
- Events re-filter on each navigation

---

## Resources & References

- **Repository:** https://github.com/brandonjp/cw-embedjs-clientside-enhancer
- **Live Configurator:** https://brandonjp.github.io/cw-embedjs-clientside-enhancer/configurator
- **Hosted Script:** https://brandonjp.github.io/cw-embedjs-clientside-enhancer/embed-enhancer.js
- **FullCalendar Docs:** https://fullcalendar.io/docs (for calendar view understanding)

---

## How to Continue Development

### Resume Work Examples

```
"Follow the dev guide and continue current phase"
"Follow the dev guide and work on phase 3.0"
"Follow the dev guide and address the console.log code review note"
"Follow the dev guide and complete the launch readiness checklist"
```

### Quick Status Check

```bash
# Current version
grep "v2" embed-enhancer.js | head -1

# Recent changes
head -30 CHANGELOG.md

# Current phase
head -30 docs/ROADMAP.md
```

---

*Last Updated: 2026-01-21*
*Version: 2.2.0*
*Phase: 3.0 - Production Hardening (In Progress)*
