#!/usr/bin/env bash
set -euo pipefail

repo_root="$(cd "$(dirname "$0")/../../.." && pwd)"
cd "$repo_root"

node --check script.js
python -m http.server --help >/dev/null

echo "Frontend checks passed."
