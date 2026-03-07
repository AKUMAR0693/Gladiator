# Live Interview Assistant (Visible + Ethical)

This project provides a visible interview helper UI with ChatGPT-powered answer suggestions.

## Features

- Chat-style answer suggestions for interview questions.
- **Resizable panel** with one-click size presets:
  - Small
  - Medium
  - Large
- Manual resize support using the panel drag handle.
- **Single-button Live Mode** using browser speech recognition:
  - Click **Start Live Mode** to begin listening
  - Transcript is auto-captured and auto-filled into the question box
  - Questions are auto-sent after a short pause (no extra send click needed)
  - Click **Stop Live Mode** to pause live listening

## Install / run tool (one command)

Use the installer helper script:

```bash
./scripts/install_live_assistant.sh
```

Optional custom port:

```bash
./scripts/install_live_assistant.sh 8080
```

The script validates basics and starts a local server.

## Quick start (manual)

1. Open `index.html` in a modern browser (Chrome/Edge recommended for speech recognition support).
2. Set your OpenAI key in browser local storage (DevTools Console):

```js
localStorage.setItem('OPENAI_API_KEY', 'sk-...');
```

3. Click **Start Live Mode** and allow microphone permission.
4. Speak the interviewer question.
5. Pause briefly; the app automatically sends the recognized question and returns an answer.

## Notes

- This tool is intentionally visible/ethical and not designed to hide usage during interviews.
- Default model in `script.js` is `gpt-4o-mini` for speed/cost balance.
- Speech recognition availability depends on browser support.
