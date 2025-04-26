# UI - Claude/Cursor Code Generation Prompt

Design a modern, highly user-friendly "Embed Configurator" web app for desktop, using React, Tailwind CSS, shadcn/ui components, and lucide-react icons. Do not use any company logos or official branding—use only the provided color palette (see below). The configurator should allow users to visually configure all options for the CrowdWork embed-enhancer.js script, generate the full embed code, preview the result, and copy the code easily.

**Key requirements:**
- Use only these colors: coral (#FF9A8A), teal (#49BCAB), purple (#A09BD7), mint (#A4DBC0), sun (#FAD46B), rose (#FFCAD1), ocean (#4C98E6), amber (#FFA200), dark (#1A1A2B), gray (#6B6B7B), light-gray (#9898A3), coral-light, teal-light, purple-light (see CSS variables).
- No company logos or branding.
- Layout: Clean, minimal, desktop-focused, with tight spacing and clear typography.
- Main sections:
  1. **Configuration Panel**: All options for embed-enhancer.js, including:
     - Multi-tag filtering (AND/OR), tag exclusion, event limiting, time-based, day-of-week, price-based, combined views.
     - URL parameter pre-filtering.
     - Option to force list view.
     - Style customization: color pickers (from palette), raw CSS input (advanced users).
     - Analytics opt-in (if configurable).
  2. **Live Preview Panel**: Shows a real-time preview of the embed as options are changed.
  3. **Embed Code Generator**: Displays the full code (script tags, container div, style block if needed) with a prominent "Copy to Clipboard" button.
  4. **Instructions & Support**: Step-by-step usage instructions, links to documentation/support, and a list of new CW class names for custom CSS.
- All controls must be clearly labeled, accessible, and keyboard-navigable.
- Use shadcn/ui components for all inputs, buttons, dialogs, etc.
- Use lucide-react icons for actions (copy, info, warning, etc.).
- Prominent, always-visible "Copy Code" and "Preview" actions.
- No hidden features; all options should be discoverable and easy to use.
- Track analytics events for: feature usage, which options are selected, and every time the code is copied (via button or keyboard shortcut).
- Do not use any official branding or logos—only the provided color palette.

**Color palette CSS variables:**
--coral: #FF9A8A; --teal: #49BCAB; --purple: #A09BD7; --mint: #A4DBC0; --sun: #FAD46B; --rose: #FFCAD1; --ocean: #4C98E6; --amber: #FFA200; --dark: #1A1A2B; --gray: #6B6B7B; --light-gray: #9898A3; --coral-light: rgba(255, 154, 138, 0.1); --teal-light: rgba(73, 188, 171, 0.1); --purple-light: rgba(160, 155, 215, 0.1);

Focus on excellent UX, clear instructions, and easy access to all features.
