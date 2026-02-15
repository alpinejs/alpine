#!/usr/bin/env bash
set -euo pipefail

# ── Resolve the repo root from this script's location ────────────────────────
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# ── Usage ────────────────────────────────────────────────────────────────────
if [[ $# -lt 1 ]]; then
    echo "Usage: $0 <destination> [branch]"
    echo ""
    echo "  destination  Path for the new worktree (relative or absolute)"
    echo "  branch       Optional branch/ref to base off (default: origin/main)"
    echo ""
    echo "Examples:"
    echo "  $0 ../alpine-fix-modal"
    echo "  $0 /tmp/alpine-experiment some-branch"
    exit 1
fi

DEST="$(cd "$(dirname "$1")" 2>/dev/null && pwd)/$(basename "$1")" || {
    # Parent dir doesn't exist yet — resolve what we can
    DEST="$(pwd)/$1"
}
BASE="${2:-origin/main}"

# ── Check if it already exists ───────────────────────────────────────────────
if [[ -d "$DEST" ]]; then
    echo "Worktree already exists at $DEST"
    echo ""
    echo "  cd $DEST"
    exit 0
fi

# ── Fetch & create ───────────────────────────────────────────────────────────
echo "Fetching latest from origin..."
git -C "$REPO_DIR" fetch origin

echo "Creating worktree at $DEST from $BASE..."
git -C "$REPO_DIR" worktree add --detach "$DEST" "$BASE"

# ── Install deps ─────────────────────────────────────────────────────────────
echo "Installing npm dependencies..."
(cd "$DEST" && npm install --silent 2>&1) || {
    echo "  WARNING: npm install failed"
}

# ── Done ─────────────────────────────────────────────────────────────────────
echo ""
echo "════════════════════════════════════════"
echo "  Worktree ready!"
echo ""
echo "  cd $DEST"
echo "════════════════════════════════════════"
