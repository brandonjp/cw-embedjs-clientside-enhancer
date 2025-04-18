# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Build Commands
- No specific build commands as this is a vanilla JavaScript project
- For testing, open HTML file with the embed scripts to test functionality
- Use syntax checking with `npx eslint *.js` for code quality

## Code Style Guidelines
- Use modern ES6+ JavaScript with graceful degradation for older browsers
- Keep code modular with clear function naming and organization
- Maintain proper error handling via try/catch blocks for all API calls
- Follow self-documenting code principles with clear variable names
- Use IIFE patterns for encapsulation to avoid global namespace pollution
- Preserve existing naming conventions (camelCase for variables and functions)
- Maintain comprehensive JSDoc-style comments for all public functions
- Use consistent 2-space indentation
- Minimize external dependencies - project uses vanilla JS only

## After Making Changes
- After making several updates, always remember to do a version bump and update the README and CHANGELOG as appropriate.
- Document all changes in CHANGELOG.md following the established format