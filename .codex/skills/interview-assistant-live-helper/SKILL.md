---
name: interview-assistant-live-helper
description: Build, improve, and troubleshoot a visible interview assistant web app that uses browser speech recognition, resizable chat UI, and OpenAI responses. Use when asked to add interview helper features (mic transcription, transcript-to-question flow, panel sizing, answer generation), fix frontend UX bugs, or document setup/run steps for this app.
---

# Interview Assistant Live Helper

Use this skill to iterate quickly on the local interview assistant frontend in this repository.

## Quick workflow

1. Confirm current UI state in `index.html`, `styles.css`, `script.js`, and `README.md`.
2. Implement requested UI/UX behavior with visible controls (no hidden/stealth behavior).
3. Run syntax and smoke checks with `scripts/check_frontend.sh`.
4. If a visual change was made, run a local server and attempt a screenshot with Playwright.
5. Update README usage steps when behavior changes.

## Implementation rules

- Keep the tool visible and ethical.
- Preserve panel resize options (`Small`, `Medium`, `Large`) and manual resizing unless explicitly asked otherwise.
- Keep speech transcription optional and editable before sending to OpenAI.
- Keep OpenAI model configurable via a top-level constant in `script.js`.
- Handle missing API key and speech-recognition unsupported browsers with user-facing status text.

## File map

- `index.html`: structure and controls (size presets, listening controls, transcript area, composer)
- `styles.css`: layout, theme, control states, responsive behavior
- `script.js`: panel sizing, speech recognition state machine, OpenAI request flow
- `README.md`: setup instructions and feature notes

## Resources

- Run `scripts/check_frontend.sh` for quick local checks.
- Use `references/qa-checklist.md` for completion criteria before commit.
