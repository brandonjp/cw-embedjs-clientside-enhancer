# CrowdWork Embed Enhancer & Configurator PRD

## Status: Draft

## Intro

The CrowdWork Embed Enhancer & Configurator project aims to empower partners (theatres and other organizations) to display, filter, and customize event/class listings on their websites with far greater flexibility and control than the legacy embed.js script allows. Without modifying the original embed.js, this solution introduces a new enhancer.js script and a modern configurator web app, enabling advanced filtering, combined views, and style customization. The project also introduces analytics for both partners and internal stakeholders, supporting data-driven product evolution.

## Goals and Context

- **Project Objectives:**
  - Enable partners to offer richer, more flexible, and customizable event/class displays on their websites.
  - Allow both partner admins (via configuration) and, optionally, patrons (via UI controls) to filter, search, and customize event/class views.
  - Provide style customization options for seamless integration with diverse website designs.
  - Ensure backward compatibility for existing embed.js users while introducing new CrowdWork (CW) class names for future-proofing.
  - Deliver analytics for usage, adoption, and feature interaction.
- **Measurable Outcomes:**
  - Successful deployment of enhancer.js and configurator with all MVP features.
  - Partners can generate and deploy enhanced embeds without developer intervention.
  - Analytics dashboard provides actionable insights.
- **Success Criteria:**
  - Partners report increased satisfaction and adoption.
  - No disruption to existing embed.js users.
  - Analytics data is accessible and useful for product decisions.
- **KPIs:**
  - Number of partners using enhancer.js
  - Number of generated embed codes/configurations
  - Feature adoption rates (e.g., filtering, combined views)
  - Performance metrics (API request volume, load times)

## Features and Requirements

### Functional Requirements
- Enhancer.js loads alongside embed.js, reading configuration from script attributes, container div, or JSON config.
- Advanced client-side filtering: multi-tag (AND/OR), tag exclusion, event limiting, time-based, day-of-week, price-based, combined views.
- URL parameter pre-filtering for marketing/deep-linking.
- Option to force list view.
- Adds new CW/CrowdWork class names to elements (in addition to legacy names).
- Optionally injects custom CSS for style customization.
- Analytics tracking: script loads, feature usage, filter interactions, user engagement, and ticket button clicks.
- Configurator web app for partners to visually configure all options, generate code, and preview embeds.
- Live Preview and Click to Copy for generated code.
- Instructions, support links, and documentation on new class names.

### Non-Functional Requirements
- Performance-optimized: minimize API requests, fast load times.
- Modern, tight UI (minimal spacing, clean layout).
- Uses CrowdWork brand colors (see `cw-colors.css`), but otherwise flexible.
- Desktop-only for MVP.
- Modern browser support only.
- Basic accessibility (labels, keyboard navigation, color contrast).
- Maintainability and extensibility prioritized.

### User Experience Requirements
- Configurator is intuitive, responsive (for desktop), and visually aligned with CrowdWork branding.
- Toolbar above embedded events for filter/search UI (sticky optional, not required for MVP).
- Clear instructions and support for partners.
- Documentation encourages use of new CW class names for custom CSS.

### Integration Requirements
- Enhancer.js and configurator hosted on GitHub Pages (or similar) for MVP.
- No server/API changes required; all filtering is client-side.
- Analytics via Google Analytics (or alternative if recommended).

### Testing Requirements
- Use real partner subdomains for testing (e.g., dynamiceldorado, risecomedy, lsi, flyingpigimprov, mockingbirdimprovsandiego).
- Automated and manual tests for all filtering, configuration, and analytics features.
- Performance testing to ensure minimal API load.

## Epic Story List

### Epic 0: Initial Manual Set Up or Provisioning
- Set up GitHub Pages hosting for configurator and enhancer.js.
- Prepare sample data and test partner subdomains.
- Document initial setup and usage instructions.

### Epic 1: Enhancer.js Core Functionality
#### Story 1: Script Loading and Configuration
- Load enhancer.js alongside embed.js, supporting both load orders.
- Read configuration from script attributes, container div, or JSON config.

#### Story 2: Advanced Filtering Logic
- Implement multi-tag filtering (AND/OR), tag exclusion, event limiting.
- Add time-based, day-of-week, and price-based filtering.
- Support combined views (shows and classes).
- Implement URL parameter pre-filtering.
- Option to force list view.

#### Story 3: Class Name Enhancement
- Add new CW/CrowdWork class names to all relevant elements, in addition to legacy names.
- Document new class names for partner use.

#### Story 4: Style Customization
- Support basic style customization via injected <style> block.
- Allow raw CSS entry for advanced users.

#### Story 5: Analytics Tracking
- Track script loads, feature usage, filter interactions, and ticket button clicks.
- Integrate with Google Analytics (or alternative).

### Epic 2: Configurator Web App
#### Story 1: UI for All Enhancer Options
- Build UI for all enhancer.js options (multi-tag, exclusions, price, date ranges, combined views, day-of-week, etc.).
- Use CrowdWork color palette and modern, tight layout.

#### Story 2: Code Generation and Preview
- Generate full embed code (script tags, container div, <style> block if needed).
- Implement Live Preview and Click to Copy features.

#### Story 3: Instructions and Documentation
- Provide clear instructions, support links, and documentation on new class names.

#### Story 4: Analytics for Configurator
- Track configurator usage and feature adoption.

### Epic 3: Analytics Dashboard (Internal)
- Set up basic analytics dashboard (Google Data Studio, Metabase, or custom page).
- Provide real-time and historical stats on usage, adoption, and feature interaction.
- Ensure secure, internal-only access.

## Technology Stack

| Technology         | Version | Description                                                      |
|-------------------|---------|------------------------------------------------------------------|
| JavaScript        | ES6+    | Primary language for enhancer.js and configurator                 |
| React/Vue/JS      | Latest  | UI framework for configurator (no strict preference)              |
| Google Analytics  | Latest  | Analytics tracking for both enhancer.js and configurator          |
| GitHub Pages      | N/A     | Hosting for configurator and enhancer.js                          |
| CSS (custom vars) | N/A     | Styling, using cw-colors.css and sample-assets/styles.md          |
| Node.js           | Latest  | For local development, testing, and build tooling                 |
| Testing Framework | Any     | Jest, Cypress, Playwright, or similar (no strict preference)      |

## Project Structure

```
cw-embedjs-clientside-enhancer/
  ├── src/
  │   ├── core/
  │   ├── ui/
  │   ├── utils/
  ├── ai/
  │   ├── stories/
  │   ├── templates/
  ├── configurator/           # Configurator web app source
  ├── sample-assets/
  │   ├── styles.md           # Reference to primary style sheets
  │   ├── cw-colors.css       # CrowdWork color palette
  ├── embed-enhancer.js       # Enhancer script
  ├── embed.js                # Original embed script (legacy)
  ├── tests/
  │   ├── core/
  │   ├── e2e/
  │   ├── integration/
  │   ├── performance/
  │   ├── unit/
  │   ├── utils/
  ├── .cursor/
  │   ├── rules/
  ├── README.md
  ├── package.json
  ├── ...
```

## POST MVP / PRD Features
- End-user filter controls in widgets (e.g., toolbar, sidebar, dropdown, or other placements selectable by partners)
- Mobile device support for configurator
- Advanced analytics dashboards (beyond basic tracking and reporting)
- Multi-language/localization support
- Accessibility enhancements beyond current baseline
- Deep customization of card/calendar UI beyond filtering and view toggles
- System for partners to save and name widget customizations (e.g., for annual events/festivals) and retrieve them later
- Migration of configurator to company dashboard
- Additional hosting/CDN options for enhancer.js

## Change Log

| Change               | Story ID | Description                                                   |
|----------------------|----------|---------------------------------------------------------------|
| Initial draft        | N/A      | Initial draft PRD                                             |
| MVP scope finalized  | N/A      | Clarified MVP vs. post-MVP features, analytics requirements   |
| Terminology updated  | N/A      | Adopted "CrowdWork", "theatre", "partners", "patrons"        |
| Color palette added  | N/A      | Referenced cw-colors.css and style guidelines                 |
