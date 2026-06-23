# GrexCode Installation

## Quick Install

```bash
curl -fsSL https://grexlabs.in/install | bash
```

## Prerequisites

- **OS**: Linux (x64/ARM64), macOS (x64/ARM64), or Windows (x64/ARM64)
- **curl**: Required for downloading the binary
- **tar** (Linux) or **unzip** (macOS/Windows): Required for extracting the archive

## Install Options

```bash
# Install specific version
curl -fsSL https://grexlabs.in/install | bash -s -- --version 1.0.180

# Install from local binary
curl -fsSL https://grexlabs.in/install | bash -s -- --binary /path/to/grexcode

# Skip PATH modification
curl -fsSL https://grexlabs.in/install | bash -s -- --no-modify-path

# Set version via environment variable
GREXCODE_VERSION=1.0.180 curl -fsSL https://grexlabs.in/install | bash
```

## Manual Installation

### Linux / macOS

1. Download the latest release for your platform from [GitHub Releases](https://github.com/grexlabs/grexcode/releases)
2. Extract the archive:
   ```bash
   # Linux
   tar -xzf grexcode-*.tar.gz

   # macOS
   unzip grexcode-*.zip
   ```
3. Move the binary to a directory in your PATH:
   ```bash
   sudo mv grexcode /usr/local/bin/
   ```

### Windows

1. Download the latest `grexcode-windows-x64.zip` from [GitHub Releases](https://github.com/grexlabs/grexcode/releases)
2. Extract the zip file
3. Add the extracted directory to your PATH

## Platform Support

| Platform | Architectures | Binary Name |
|----------|--------------|-------------|
| Linux (glibc) | x64, ARM64 | `grexcode-linux-x64`, `grexcode-linux-arm64` |
| Linux (musl) | x64, ARM64 | `grexcode-linux-x64-musl`, `grexcode-linux-arm64-musl` |
| macOS | x64, ARM64 | `grexcode-darwin-x64`, `grexcode-darwin-arm64` |
| Windows | x64, ARM64 | `grexcode-windows-x64`, `grexcode-windows-arm64` |

**Note**: x64 binaries include AVX2-optimized builds. If your CPU doesn't support AVX2, use the `-baseline` variant.

## Package Managers

### Homebrew (macOS/Linux)

```bash
brew install grexlabs/tap/grexcode
```

### Nix / NixOS

```bash
nix profile install github:grexlabs/grexcode
```

### Docker

```bash
docker run -it --rm ghcr.io/grexlabs/grexcode
```

## Verifying Installation

```bash
grexcode --version
grexcode --help
```

## Updating

### Via installer

Simply run the install command again — it will detect the current version and upgrade if needed.

```bash
curl -fsSL https://grexlabs.in/install | bash
```

### Via grexcode

```bash
grexcode upgrade
```

## Uninstalling

```bash
rm -rf ~/.grexcode
rm $(which grexcode)
```

Remove the PATH addition from your shell config (`.zshrc`, `.bashrc`, etc.) if desired.

## Configuration

GrexCode stores its configuration at:

- **Config**: `~/.config/grexcode/grexcode.json` or `~/.grexcode/grexcode.jsonc`
- **Data**: `~/.local/share/grexcode/`
- **Cache**: `~/.cache/grexcode/`

## Environment Variables

| Variable | Description |
|----------|-------------|
| `GREXCODE_VERSION` | Pin a specific version for the installer |
| `GREXCODE_CONFIG_DIR` | Override config directory path |
| `GREXCODE_DATA_DIR` | Override data directory path |
| `GREXCODE_BIN_PATH` | Path to the grexcode binary |
| `GREXCODE_CHANNEL` | Release channel (stable, beta) |

## Troubleshooting

### "grexcode: command not found"

Ensure `~/.grexcode/bin` is in your PATH:

```bash
export PATH="$HOME/.grexcode/bin:$PATH"
```

Add this line to your shell config (`.zshrc`, `.bashrc`, etc.) to make it permanent.

### "Unsupported OS/Arch"

GrexCode supports Linux (x64, ARM64), macOS (x64, ARM64), and Windows (x64, ARM64). If you're on a different platform, you can try building from source.

### Binary fails to run

Ensure your system meets the minimum requirements:
- Linux: glibc 2.28+ or musl 1.2+
- macOS: 11.0+ (Big Sur or later)
- Windows: Windows 10+ or Windows Server 2019+
