#!/usr/bin/env bash
set -euo pipefail

# ── Resolve the repo root from this script's location ────────────────────────
REPO_DIR="$(cd "$(dirname "$0")/.." && pwd)"

# ── Usage ────────────────────────────────────────────────────────────────────
if [[ $# -lt 1 ]]; then
    echo "Usage: $0 <worktree-path>"
    echo ""
    echo "  Removes a worktree and cleans up its directory."
    echo ""
    echo "Examples:"
    echo "  $0 ../alpine-fix-modal"
    echo "  $0 /tmp/alpine-experiment"
    exit 1
fi

DEST="$(cd "$(dirname "$1")" 2>/dev/null && pwd)/$(basename "$1")" || {
    DEST="$(pwd)/$1"
}

# ── Validate ─────────────────────────────────────────────────────────────────
if [[ ! -d "$DEST" ]]; then
    echo "Directory does not exist: $DEST"
    exit 1
fi

# ── Remove ───────────────────────────────────────────────────────────────────
echo "Removing worktree at $DEST..."
git -C "$REPO_DIR" worktree remove --force "$DEST"

# ── Prune any stale worktree references ──────────────────────────────────────
git -C "$REPO_DIR" worktree prune

echo ""
echo "Worktree removed: $DEST"
