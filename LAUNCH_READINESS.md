# Launch Readiness Checklist

**Project:** CrowdWork Event Display Embed Enhancer
**Target Version:** v2.2.0
**Last Updated:** 2026-01-21

This document outlines everything required for a rock-solid, production-ready launch for the first client.

---

## Phase 1: Critical Pre-Launch (MUST COMPLETE)

### 1.1 Code Stability & Error Handling

| Item | Status | Priority | Notes |
|------|--------|----------|-------|
| Graceful degradation when original embed.js fails to load | [ ] | CRITICAL | Script should not throw errors if parent script missing |
| Network timeout handling for API calls | [ ] | CRITICAL | Add timeout and retry logic to `fetchEvents()` |
| Invalid data attribute validation | [ ] | HIGH | Validate all `data-*` attributes before use |
| Console logging in production mode | [ ] | HIGH | Debug logs should only appear in development mode |
| MutationObserver cleanup on page unload | [ ] | MEDIUM | Prevent memory leaks on SPA navigation |

### 1.2 Browser Compatibility Testing

| Browser | Desktop | Mobile | Status |
|---------|---------|--------|--------|
| Chrome (latest 2 versions) | [ ] | [ ] | |
| Firefox (latest 2 versions) | [ ] | [ ] | |
| Safari (latest 2 versions) | [ ] | [ ] | |
| Edge (latest 2 versions) | [ ] | [ ] | |
| Safari iOS | N/A | [ ] | |
| Chrome Android | N/A | [ ] | |

### 1.3 Functional Testing Checklist

**Calendar View:**
- [ ] Events display correctly
- [ ] Date navigation works (prev/next month)
- [ ] Event click opens correct modal/link
- [ ] Filtering correctly hides/shows events
- [ ] Tags display when enabled
- [ ] Combined view shows SHOW/CLASS badges
- [ ] "No events" message appears when filters return empty

**Card View:**
- [ ] Cards display correctly with images
- [ ] Card click navigates to event URL
- [ ] Filtering correctly hides/shows cards
- [ ] Limit option correctly caps number of cards
- [ ] Tags display when enabled
- [ ] Combined view shows SHOW/CLASS badges
- [ ] "No events" message appears when filters return empty

**Filter Controls:**
- [ ] Filter button shows/hides panel
- [ ] Tag checkboxes filter correctly
- [ ] Date range inputs work
- [ ] Quick filters apply correct date ranges
- [ ] Days of week checkboxes filter correctly
- [ ] Limit input works
- [ ] Reset button clears all filters
- [ ] Active filter badges display and can be dismissed
- [ ] Clicking outside closes filter panel

**URL Parameters:**
- [ ] `include-tags` parameter works
- [ ] `exclude-tags` parameter works
- [ ] `tag-match` parameter works
- [ ] `start-date` parameter works
- [ ] `end-date` parameter works
- [ ] `days-of-week` parameter works
- [ ] `limit` parameter works
- [ ] `special-filter` parameter works
- [ ] Multiple parameters combine correctly

**JavaScript API:**
- [ ] `FWEnhancer.setFilter()` works
- [ ] `FWEnhancer.resetFilters()` works
- [ ] `FWEnhancer.applyQuickFilter()` works
- [ ] `FWEnhancer.getFilterState()` returns correct state

---

## Phase 2: Edge Cases & Reliability

### 2.1 Data Edge Cases

| Scenario | Status | Notes |
|----------|--------|-------|
| Empty event list from API | [ ] | Should show "No events" message gracefully |
| Events with no tags | [ ] | Should not break tag filtering |
| Events with special characters in tags | [ ] | Test: `&`, `<`, `>`, quotes, unicode |
| Events with very long titles | [ ] | UI should handle gracefully |
| Events with missing images | [ ] | Should display placeholder or handle gracefully |
| Events with past `display_until` dates | [ ] | Should be filtered out correctly |
| Invalid date formats in date range | [ ] | Should not crash script |
| Invalid day values in days-of-week | [ ] | Should validate 0-6 range |

### 2.2 Loading & Performance

| Scenario | Status | Notes |
|----------|--------|-------|
| Slow network conditions | [ ] | Loading spinner should display |
| Loading spinner removal | [ ] | Spinner should always be removed (5s safety timeout exists) |
| Large event datasets (100+ events) | [ ] | Performance should remain acceptable |
| Rapid filter changes | [ ] | Should debounce or handle gracefully |
| Multiple embeds on same page | [ ] | Each should work independently |

### 2.3 Integration Edge Cases

| Scenario | Status | Notes |
|----------|--------|-------|
| Original script loads slowly | [ ] | Enhancer waits with 20 retry attempts |
| Original script fails to load | [ ] | Should log error, not crash page |
| FullCalendar version compatibility | [ ] | Test with client's actual version |
| Bootstrap version conflicts | [ ] | Styles should not conflict |
| jQuery presence/absence | [ ] | Script should work either way |
| Content Security Policy (CSP) | [ ] | Verify script works with common CSP rules |

---

## Phase 3: Documentation & Client Support

### 3.1 Client Documentation

| Document | Status | Notes |
|----------|--------|-------|
| Installation guide | [ ] | Clear step-by-step instructions |
| Configuration options reference | [ ] | All data-* attributes documented |
| Troubleshooting guide | [ ] | Common issues and solutions |
| FAQ | [ ] | Address common questions |
| Known limitations | [ ] | Be transparent about what doesn't work |

### 3.2 Developer Documentation

| Document | Status | Notes |
|----------|--------|-------|
| Code architecture overview | [ ] | For future maintenance |
| API reference | [ ] | Public JavaScript API |
| Contributing guidelines | [ ] | If open source |
| Version upgrade notes | [ ] | Breaking changes between versions |

---

## Phase 4: Production Deployment

### 4.1 Hosting & CDN

| Item | Status | Notes |
|------|--------|-------|
| GitHub Pages hosting verified | [ ] | Currently at brandonjp.github.io |
| CDN caching configured | [ ] | Version query string for cache busting |
| HTTPS enforced | [ ] | GitHub Pages provides this |
| Uptime monitoring | [ ] | Consider adding monitoring |

### 4.2 Version Management

| Item | Status | Notes |
|------|--------|-------|
| Version synced across all files | [ ] | embed-enhancer.js, configurator, README |
| CHANGELOG updated | [ ] | Document all changes |
| Git tag created for release | [ ] | Tag with version number |
| Rollback plan documented | [ ] | How to revert if issues found |

### 4.3 Client Onboarding Checklist

- [ ] Provide client with embed code
- [ ] Verify code works on their staging environment
- [ ] Test with their actual data/theatre
- [ ] Document any client-specific configurations
- [ ] Provide support contact/escalation path
- [ ] Schedule post-launch check-in

---

## Phase 5: Post-Launch Monitoring

### 5.1 Monitoring Checklist

| Item | Status | Notes |
|------|--------|-------|
| Browser console error monitoring | [ ] | No errors should appear |
| API endpoint availability | [ ] | Monitor CrowdWork API |
| Client feedback channel | [ ] | Way to receive bug reports |
| Performance baseline established | [ ] | Load times documented |

### 5.2 Known Limitations (Document These)

1. **Calendar View Filtering**: The enhancer hides/shows events visually but doesn't update the FullCalendar's internal event store. Navigation between months may briefly show all events before filtering re-applies.

2. **Combined View Performance**: Loading both shows and classes requires two API calls, which may be slower on poor connections.

3. **Tag Matching**: Tags must match exactly (case-sensitive). "Comedy" and "comedy" are different tags.

4. **URL Parameters**: Filters from URL parameters override data attributes. This is intentional for link sharing but may surprise users.

5. **Multiple Instances**: While technically supported, multiple embeds with different configurations on the same page are not thoroughly tested.

---

## Quick Reference: Test Scenarios for First Client

### Minimum Viable Test Set (30 minutes)

1. **Basic Display**
   - Load embed with default settings
   - Verify events appear
   - Click an event (verify link works)

2. **Tag Filtering**
   - Add `data-include-tags="[client-tag]"`
   - Verify only matching events appear
   - Remove filter, verify all events return

3. **Date Filtering**
   - Add `data-special-filter="next-7-days"`
   - Verify only upcoming week events appear

4. **Limit**
   - Add `data-limit="3"`
   - Verify only 3 events appear

5. **URL Parameters**
   - Visit page with `?include-tags=[tag]`
   - Verify filter applies automatically

6. **Mobile**
   - Test on actual mobile device
   - Verify layout, touch interactions work

---

## Version History

| Version | Date | Status | Notes |
|---------|------|--------|-------|
| v2.1.7 | 2025-04-18 | Released | Added display tags option, fixed filtering issues |
| v2.2.0 | 2026-01-21 | Current | First client launch version - launch readiness documentation added |

---

## Sign-Off Checklist

Before going live with first client:

- [ ] All Phase 1 items completed
- [ ] Phase 2 edge cases tested
- [ ] Client documentation provided
- [ ] Production deployment verified
- [ ] Monitoring in place
- [ ] Rollback plan ready
- [ ] Support contact established

**Approved By:** ___________________
**Date:** ___________________
