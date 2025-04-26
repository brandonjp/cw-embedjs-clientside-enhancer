# Project Brief: CrowdWork Embed Enhancer & Configurator

---

## 1. Core Problem

The current `embed.js` script enables theaters to display events/classes on their websites, but is limited in flexibility, filtering, and customization. Theaters increasingly require advanced, user-friendly filtering, display, and styling options that cannot be supported by the current embed.js alone, and the original script cannot be modified due to widespread adoption and legacy dependencies.

---

## 2. Goals

**Primary Goals:**
- Enable theaters to offer richer, more flexible, and customizable event/class displays on their websites without modifying the original embed.js.
- Allow both theater admins (via configuration) and, optionally, end-users (via UI controls) to filter, search, and customize event/class views.
- Provide basic and advanced style customization options for seamless integration with diverse theater website designs.
- Ensure backward compatibility and non-disruption for existing embed.js users.

**Secondary Goals:**
- Deliver a robust, intuitive configurator UI for theater admins to generate embed/enhancer code, including live preview and copy-to-clipboard.
- Support URL-based pre-filtering for marketing and deep-linking use cases.
- Begin transition from legacy "FW/FWT" class names to new "CW/CrowdWork" class names for future-proofing.
- Collect analytics on usage of the configurator and enhancer features for product insights.
- **NEW:** Provide an advanced analytics dashboard for real-time and historical usage stats, adoption, and feature interaction, to inform stakeholders and guide product direction.

---

## 3. Audience

- **Primary:** Theater admins and webmasters integrating event/class listings into their websites.
- **Secondary:** Website visitors (end-users) who interact with the embedded listings and may use search/filter controls (if enabled by admin).
- **Internal:** Product, engineering, and business stakeholders who need analytics and adoption data.

---

## 4. Core Concept/Features (High-Level)

### **Enhancer.js Script:**
- Loads alongside (preferably before, but supports both orders) the existing embed.js.
- Reads configuration from script attributes, container div, or JSON config.
- Intercepts or augments the data fetched by embed.js, applying additional client-side filtering, sorting, and display logic.
- Adds new class names (CW/CrowdWork) to elements for future-proofing and easier custom CSS.
- Optionally injects filter/search UI for end-users, only if enabled by admin.
- Supports advanced filtering, combined data sources, and new display options.
- Optionally injects custom CSS for basic style customizations.
- **Tracks usage, feature adoption, and user interactions for analytics.**

### **Configurator Webpage:**
- Standalone, unofficial tool (hosted on GitHub Pages or similar).
- Allows theater admins to visually configure all available options (including new enhancer features and style customizations).
- Generates a single, copy-paste code block including:
  - The original embed script tag (with all relevant data attributes)
  - The enhancer script tag
  - The required container div
  - (If style customizations are set) a `<style>` block with minified CSS
- Provides a **Live Preview** button (not auto-updating) to show what the configured embed will look like.
- Provides a **Click to Copy** button for the generated code.
- Brief, clear instructions for use, plus links to full help/support articles.
- Option for raw CSS entry for advanced users, with documentation on new class names.

### **Analytics Dashboard:**
- Real-time and historical stats on:
  - Number of theaters using the enhancer
  - Which theaters are using it
  - Number of loads, clicks, and filter/interactions
  - Feature adoption (e.g., how many use tag filtering, price filtering, custom styles, etc.)
  - Configurator usage stats
- Secure, internal-only dashboard (initially, can be simple, e.g., Google Data Studio, Metabase, or custom page)
- Data collection via Google Analytics, custom endpoint, or both

---

## 5. MVP Scope

### **IN SCOPE (MVP):**

#### **A. Enhancer.js Features**
- **Multi-tag Filtering:**
  - Filter by multiple tags (AND/OR logic selectable).
  - Tag exclusion (exclude events with certain tags).
- **Event Limiting:**
  - Limit number of displayed events (e.g., "next 3 events").
- **Time-based Filtering:**
  - Show events for "this week", "today", "tomorrow", "this weekend", "next weekend", or custom date ranges.
  - "Happening this weekend" logic (with time window generosity).
- **Day-of-Week Filtering:**
  - Show only events on specific days of the week (e.g., only Wednesdays for the next month).
- **Combined Views:**
  - Fetch and combine both "shows" and "classes" in a single view.
- **Price-based Filtering:**
  - Filter events by price (e.g., "free", "$10 and under").
- **Force List View:**
  - Option to force list view regardless of container width.
- **URL Parameter Pre-filtering:**
  - Support query string parameters to pre-filter views (e.g., `?range=2025-01-01-to-2025-04-13&tags=improv,awards,jam`).
- **Configurable Display Controls:**
  - Option to show/hide search/filter UI for end-users (default: off).
  - Search box for event name/type/tag.
  - Date picker and tag selector for end-user filtering.
- **Display Event Tags:**
  - Option to display event tags as small badges/labels on event cards and calendar events.
- **Class Name Transition:**
  - Add new "CW/CrowdWork" class names to elements, in addition to legacy "FW/FWT" classes.
- **Basic Style Customization:**
  - UI for setting background color, text color, button color, etc. for the container and key elements.
  - Option for raw CSS entry for advanced users.
  - Configurator outputs a `<style>` block with minified CSS if custom styles are set.
- **Analytics Tracking:**
  - Track script loads, feature usage, filter interactions, and user engagement.

#### **B. Configurator Webpage**
- **Account ID Input:**
  - Enter theater account/subdomain.
- **Full Option Set:**
  - UI for all enhancer.js options (multi-tag, exclusions, price, date ranges, combined views, day-of-week, etc.).
- **Preview & Code Generation:**
  - **Live Preview** button to render the configured embed (not auto-updating).
  - **Click to Copy** button for the full code block.
  - Generates script tags, container div, and (if needed) a `<style>` block for custom CSS.
- **Instructions & Support:**
  - Brief instructions for use.
  - Links to full help/support articles.
  - Documentation on new class names for custom CSS.

#### **C. Analytics Dashboard**
- Real-time and historical stats on usage, adoption, and feature interaction.
- Secure, internal-only dashboard (initially, can be simple, e.g., Google Data Studio, Metabase, or custom page).

### **OUT OF SCOPE (MVP):**
- Modifying the original embed.js file.
- Server/API changes (all filtering is client-side).
- Deep customization of card/calendar UI beyond filtering and view toggles.
- Multi-language/localization support (unless already present).
- Accessibility enhancements beyond current baseline.
- Advanced analytics dashboards (beyond basic tracking and reporting).

---

## 6. Initial Technical Leanings

- **Enhancer.js** will be a standalone script, loaded alongside embed.js, with a preference for loading *before* embed.js, but will attempt to support both orders for robustness.
- All advanced filtering and view logic will be performed client-side, post-fetch. If the enhancer cannot modify the original fetch, it will perform its own fetch as needed (e.g., for combined views or broader filtering).
- The script will be designed to be non-intrusive and backward compatible.
- The configurator will be a modern, responsive web app (framework TBD, likely React or Vue for rapid UI iteration).
- URL parameter parsing will be robust and extensible for future filter types.
- Custom CSS will be injected via a `<style>` block, generated by the configurator as needed.
- Analytics will be implemented via Google Analytics, a custom endpoint, or both.
- Analytics dashboard will be internal-only, with secure access.

---

## 7. Open Questions / Clarifications (with Responses)

**Script Load Order:**
- *Response:* We have full control over the embed code, so enhancer.js will be loaded before embed.js by default, but will attempt to support both orders for robustness.

**Data Fetching:**
- *Response:* Enhancer.js will attempt to modify the original fetch if possible; if not, it will perform its own fetch as needed (e.g., for combined views or broader filtering).

**UI/UX for End-User Controls:**
- *Response:* No strong preference; initial implementation will use a flexible, non-intrusive UI (e.g., dropdown, toolbar, or floating panel), with future options for more advanced placement/customization.

**Configurator Hosting:**
- *Response:* The new configurator will be a separate, unofficial tool, hosted on GitHub Pages ([see current beta](https://brandonjp.github.io/cw-embedjs-clientside-enhancer/configurator)).

**Accessibility/Internationalization:**
- *Response:* No specific requirements for MVP beyond accessibility basics.

**Analytics:**
- *Response:* Analytics are required for both the configurator and enhancer script. Guidance needed on best practices for implementation. Advanced dashboard is now in scope for MVP.

---

## 8. Additional Considerations

- **Legacy Class Names:**
  - The original embed.js uses "FW/FWT" class names due to legacy branding. The enhancer will add new "CW/CrowdWork" class names to elements for future-proofing and easier custom CSS.
  - Documentation and the configurator will inform users about the new class names and how to use them for custom styling.

- **Configurator Features (from current beta):**
  - [Configurator Demo](https://brandonjp.github.io/cw-embedjs-clientside-enhancer/configurator) already includes many advanced filtering options, live preview, and code generation with both scripts and container div.
  - The next version will add: basic style customization UI, raw CSS entry, minified `<style>` output, and improved instructions/support links.

---

## 9. Next Steps

1. **Finalize MVP feature list and boundaries (see above).**
2. **Design wireframes for configurator and end-user controls.**
3. **Begin technical planning and architecture for enhancer.js and configurator.**
4. **Implement analytics tracking for both tools.**
5. **Develop and test enhancer.js in parallel with configurator.**
6. **Draft documentation/help articles, especially for new class names and custom CSS.**
7. **Design and implement the analytics dashboard for internal use.**

---

## 10. Action Required

- **Review this Project Brief and confirm all requirements and boundaries.**
- **Flag any additional requirements or constraints not captured here.**
- **Provide any preferences for analytics implementation.**
- **Confirm if you want to prioritize any features for the first release.**

---

### References

- [Configurator Beta Demo](https://brandonjp.github.io/cw-embedjs-clientside-enhancer/configurator)

---

*Prepared for internal use and stakeholder review.*
