#!/usr/bin/env bash
set -euo pipefail

# ── Install deps ─────────────────────────────────────────────────────────────
echo "Installing npm dependencies..."
(cd "$DEST" && npm install --silent 2>&1) || {
    echo "  WARNING: npm install failed"
}
