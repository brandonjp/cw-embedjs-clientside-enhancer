# Roadmap - CrowdWork Event Display Enhancer

## Current Status: Phase 3.0 - Production Hardening

**Version:** 2.2.0
**Last Updated:** 2026-01-21

---

## Phase Structure

Development follows a phased approach where each phase represents a coherent set of functionality building toward a production-ready product.

**Phase Status Legend:**
- **Complete** - Work finished and released
- **In Progress** - Currently being worked on
- **Planned** - Scheduled for future development
- **Future** - Under consideration

---

## Phases

### Phase 1.0 - Foundation (Complete)

**Objective:** Create the core enhancer architecture with basic filtering capabilities.

**Completed in v2.0.0 - 2025-04-17**

- Complete refactoring into modular, maintainable code structure
- IIFE pattern for encapsulation
- Tag filtering with "any" or "all" matching logic
- Date range filtering
- Days of week filtering
- Special filters (this week, next weekend, etc.)
- Event limit filtering
- Visual filtering UI with controls
- Filter state persisted in URL parameters
- Combined view (shows + classes)
- Client-side event caching
- "No events found" message
- Tag badges on cards and calendar
- Type indicators for combined view
- Public JavaScript API

---

### Phase 2.0 - Feature Complete (Complete)

**Objective:** Polish all features and create the configurator tool.

**Completed in v2.1.7 - 2025-04-18**

- Enhanced loading overlay with spinner
- Configurator tool for building embed code
- Better error handling for API requests
- One-sided date range support
- Display tags option (`data-show-tags`)
- Filter controls toggle (`data-show-filters`)
- Improved badge positioning
- URL parameter documentation
- Live preview in configurator

---

### Phase 2.5 - Launch Preparation (Complete)

**Objective:** Prepare comprehensive documentation for first client deployment.

**Completed in v2.2.0 - 2026-01-21**

- Created `LAUNCH_READINESS.md` checklist
- Documented all critical pre-launch requirements
- Created testing scenarios for all features
- Added edge case testing guidelines
- Documented known limitations
- Created client onboarding checklist
- Established rollback procedures
- Code review identifying technical debt

---

### Phase 3.0 - Production Hardening (In Progress)

**Objective:** Address code quality issues and complete first client deployment.

**Target Version:** 2.3.0

**Completed:**
- Created comprehensive development workflow documentation
- Added `docs/ROADMAP.md` for phase tracking
- Enhanced `.claude/commands/dev.md` with full workflow
- Added `.claude/commands/setup-dev-guide.md` for future setup

**In Progress:**
- Address code review notes from v2.2.0

**Remaining:**

| Task | Priority | Status |
|------|----------|--------|
| Make console.log conditional on development mode | High | Pending |
| Disconnect MutationObserver on page unload | High | Pending |
| Add network timeout/retry logic for API calls | Medium | Pending |
| Complete browser compatibility testing | High | Pending |
| Complete functional testing checklist | High | Pending |
| First client deployment | High | Pending |
| Post-deployment monitoring | Medium | Pending |

---

### Phase 4.0 - Client Feedback (Planned)

**Objective:** Iterate based on production usage and client feedback.

**Target Version:** 2.4.0
**Prerequisites:** Complete Phase 3.0, first client live

**Planned Work:**
- Address issues discovered in production
- Performance optimizations based on real usage
- Feature requests from first client
- Improved error messaging
- Analytics/usage tracking (if requested)

---

### Phase 5.0 - Enhanced Features (Future)

**Objective:** Expand functionality based on demand.

**Under Consideration:**
- Case-insensitive tag matching option
- Multiple embed instance support
- Custom styling/theming options
- Additional special filters
- Event search functionality
- Saved filter presets
- Mobile-optimized filter UI

---

## Version History

| Version | Phase | Date | Highlights |
|---------|-------|------|------------|
| 2.0.0 | 1.0 | 2025-04-17 | Core architecture, all filter types, JavaScript API |
| 2.1.0 | 2.0 | 2025-04-18 | Configurator tool, loading overlay |
| 2.1.1 | 2.0 | 2025-04-18 | Configurator fixes |
| 2.1.2 | 2.0 | 2025-04-18 | Live preview, tooltips |
| 2.1.3 | 2.0 | 2025-04-18 | Filter button toggle |
| 2.1.4 | 2.0 | 2025-04-18 | Spinner improvements |
| 2.1.5 | 2.0 | 2025-04-18 | Embed detection rewrite |
| 2.1.6 | 2.0 | 2025-04-18 | One-sided date ranges |
| 2.1.7 | 2.0 | 2025-04-18 | Display tags option |
| 2.2.0 | 2.5 | 2026-01-21 | Launch readiness documentation |
| 2.3.0 | 3.0 | TBD | Production hardening, first client |

---

## Known Issues & Technical Debt

| Issue | Impact | Planned Resolution |
|-------|--------|-------------------|
| Debug console.log not conditional | Clutters production console | Phase 3.0 |
| MutationObserver not disconnected | Memory leak on SPA navigation | Phase 3.0 |
| No network timeout/retry | API calls can hang | Phase 3.0 |
| Calendar filtering visual only | Brief flicker on navigation | Documented limitation |
| Case-sensitive tag matching | May surprise users | Phase 5.0 (optional) |

---

## How to Use This Roadmap

### For AI Developers

When starting a session, reference this roadmap:
```
"Follow the dev guide and work on phase 3.0"
"What's the current phase status?"
"Work on the highest priority item in phase 3.0"
```

### For Human Developers

1. Check "Current Status" section for active phase
2. Review "In Progress" and "Remaining" items
3. Pick highest priority pending item
4. Follow development workflow in `.claude/commands/dev.md`
5. Update this roadmap when completing milestones

### Updating This Document

- Update "In Progress" items as work begins
- Move completed items to "Completed" section
- Add discovered tasks to "Remaining"
- Create new phase when current phase completes
- Update version history with each release

---

*Last Updated: 2026-01-21*
