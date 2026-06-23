#!/usr/bin/env bash
set -euo pipefail

# grexcode Korean IME Fix Installer
# https://github.com/grexlabs/grexcode/issues/14371
#
# Patches grexcode to prevent Korean (and other CJK) IME last character
# truncation when pressing Enter in Kitty and other terminals.
#
# Usage:
#   curl -fsSL https://raw.githubusercontent.com/claudianus/grexcode/fix-zhipuai-coding-plan-thinking/patches/install-korean-ime-fix.sh | bash
#   # or from a cloned repo:
#   ./patches/install-korean-ime-fix.sh

RED='\033[0;31m'
GREEN='\033[0;32m'
ORANGE='\033[38;5;214m'
MUTED='\033[0;2m'
NC='\033[0m'

GREXCODE_DIR="${GREXCODE_DIR:-$HOME/.grexcode}"
GREXCODE_SRC="${GREXCODE_SRC:-$HOME/.grexcode-src}"
FORK_REPO="${FORK_REPO:-https://github.com/claudianus/grexcode.git}"
FORK_BRANCH="${FORK_BRANCH:-fix-zhipuai-coding-plan-thinking}"

info()  { echo -e "${MUTED}$*${NC}"; }
warn()  { echo -e "${ORANGE}$*${NC}"; }
err()   { echo -e "${RED}$*${NC}" >&2; }
ok()    { echo -e "${GREEN}$*${NC}"; }

need() {
  if ! command -v "$1" >/dev/null 2>&1; then
    err "Error: $1 is required but not installed."
    exit 1
  fi
}

need git
need bun

# ── 1. Clone or update fork ────────────────────────────────────────────
if [ -d "$GREXCODE_SRC/.git" ]; then
  info "Updating existing source at $GREXCODE_SRC ..."
  git -C "$GREXCODE_SRC" fetch origin "$FORK_BRANCH"
  git -C "$GREXCODE_SRC" checkout "$FORK_BRANCH"
  git -C "$GREXCODE_SRC" reset --hard "origin/$FORK_BRANCH"
else
  info "Cloning fork (shallow) to $GREXCODE_SRC ..."
  git clone --depth 1 --branch "$FORK_BRANCH" "$FORK_REPO" "$GREXCODE_SRC"
fi

# ── 2. Verify the IME fix is present in source ────────────────────────
PROMPT_FILE="$GREXCODE_SRC/packages/grexcode/src/cli/cmd/tui/component/prompt/index.tsx"
if [ ! -f "$PROMPT_FILE" ]; then
  err "Prompt file not found: $PROMPT_FILE"
  exit 1
fi

if grep -q "setTimeout(() => setTimeout" "$PROMPT_FILE"; then
  ok "IME fix already present in source."
else
  warn "IME fix not found. Applying patch ..."
  # Apply the fix: replace onSubmit={submit} with double-deferred version
  sed -i 's|onSubmit={submit}|onSubmit={() => {\n                // IME: double-defer so the last composed character (e.g. Korean\n                // hangul) is flushed to plainText before we read it for submission.\n                setTimeout(() => setTimeout(() => submit(), 0), 0)\n              }}|' "$PROMPT_FILE"
  if grep -q "setTimeout(() => setTimeout" "$PROMPT_FILE"; then
    ok "Patch applied."
  else
    err "Failed to apply patch. The source may have changed."
    exit 1
  fi
fi

# ── 3. Install dependencies ────────────────────────────────────────────
info "Installing dependencies (this may take a minute) ..."
cd "$GREXCODE_SRC"
bun install --frozen-lockfile 2>/dev/null || bun install

# ── 4. Build (current platform only) ──────────────────────────────────
info "Building grexcode for current platform ..."
cd "$GREXCODE_SRC/packages/grexcode"
bun run build --single

# ── 5. Install binary ──────────────────────────────────────────────────
mkdir -p "$GREXCODE_DIR/bin"

PLATFORM=$(uname -s | tr '[:upper:]' '[:lower:]')
ARCH=$(uname -m)
[ "$ARCH" = "aarch64" ] && ARCH="arm64"
[ "$ARCH" = "x86_64" ] && ARCH="x64"
[ "$PLATFORM" = "darwin" ] && true
[ "$PLATFORM" = "linux" ] && true

BUILT_BINARY="$GREXCODE_SRC/packages/grexcode/dist/grexcode-${PLATFORM}-${ARCH}/bin/grexcode"

if [ ! -f "$BUILT_BINARY" ]; then
  BUILT_BINARY=$(find "$GREXCODE_SRC/packages/grexcode/dist" -name "grexcode" -type f -executable 2>/dev/null | head -1)
fi

if [ -f "$BUILT_BINARY" ]; then
  if [ -f "$GREXCODE_DIR/bin/grexcode" ]; then
    cp "$GREXCODE_DIR/bin/grexcode" "$GREXCODE_DIR/bin/grexcode.bak.$(date +%Y%m%d%H%M%S)"
  fi
  cp "$BUILT_BINARY" "$GREXCODE_DIR/bin/grexcode"
  chmod +x "$GREXCODE_DIR/bin/grexcode"
  ok "Installed to $GREXCODE_DIR/bin/grexcode"
else
  err "Build failed - binary not found in dist/"
  info "Try running manually:"
  echo "  cd $GREXCODE_SRC/packages/grexcode && bun run build --single"
  exit 1
fi

echo ""
ok "Done! Korean IME fix is now active."
echo ""
info "To uninstall and revert to the official release:"
echo "  curl -fsSL https://grexlabs.in/install | bash"
echo ""
info "To update (re-pull and rebuild):"
echo "  $0"
