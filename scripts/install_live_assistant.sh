#!/usr/bin/env bash
set -euo pipefail

REPO_ROOT="$(cd "$(dirname "$0")/.." && pwd)"
PORT="${1:-4175}"

cd "$REPO_ROOT"

echo "[1/5] Checking required tools..."
command -v python >/dev/null 2>&1 || {
  echo "Error: python is required but not found. Install Python 3 first." >&2
  exit 1
}

echo "[2/5] Verifying frontend script syntax..."
if command -v node >/dev/null 2>&1; then
  node --check script.js
else
  echo "Warning: node not found; skipping JS syntax check."
fi

echo "[3/5] Preparing local launch instructions..."
cat <<'MSG'
Before using live answers, set your OpenAI API key in browser localStorage:
  localStorage.setItem('OPENAI_API_KEY', 'sk-...')
MSG

echo "[4/5] Starting local server on http://127.0.0.1:${PORT} ..."
python -m http.server "$PORT"

echo "[5/5] Done."
