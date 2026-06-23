# Building GrexCode

> Build instructions for GrexCode, a fork of OpenCode by Grexlabs.

---

## Prerequisites

- [Bun](https://bun.sh) **1.3.14** or later
- TypeScript 5.x

Verify your toolchain:

```bash
bun --version          # must be >= 1.3.14
bun --version | grep -q "1\." && echo "OK"
```

---

## Quick Start

Clone the repository and install dependencies:

```bash
git clone https://github.com/grexlabs/grexcode.git
cd grexcode
bun install
```

---

## Build Command

```bash
bun run script/build.ts
```

### Build Options

| Flag                  | Description                                    |
|-----------------------|------------------------------------------------|
| `--single`            | Build a single, self-contained binary          |
| `--baseline`          | Build for CPU baseline (no modern ISA ext.)    |
| `--skip-install`      | Skip `bun install` before building             |
| `--sourcemaps`        | Emit JavaScript source maps                    |
| `--skip-embed-web-ui` | Exclude the embedded Web UI from the binary    |

Example — production build with source maps, skipping dependency install:

```bash
bun run script/build.ts --sourcemaps --skip-install
```

---

## Platform Targets

GrexCode is compiled and distributed for the following platforms:

| OS      | Architectures                          | Notes                        |
|---------|----------------------------------------|------------------------------|
| Linux   | `x64`, `arm64`, `musl`                | glibc & musl builds          |
| macOS   | `x64`, `arm64`, `baseline`            | Intel, Apple Silicon, legacy |
| Windows | `x64`, `arm64`                        | -                            |

### All Build Targets

The full set of build targets is defined in `script/build.ts`. To list them:

```bash
bun run script/build.ts --help
```

Typical release bundles:

```
grexcode-linux-x64
grexcode-linux-arm64
grexcode-linux-musl-x64
grexcode-linux-musl-arm64
grexcode-macos-x64
grexcode-macos-arm64
grexcode-macos-baseline-x64
grexcode-macos-baseline-arm64
grexcode-windows-x64.exe
grexcode-windows-arm64.exe
```

---

## Smoke Test

After a successful build, verify the binary works:

```bash
./dist/grexcode --version
./dist/grexcode --help
./dist/grexcode doctor
```

For interactive testing:

```bash
echo "Hello from GrexCode" | ./dist/grexcode -
```

---

## Development

### Watch Mode (rebuild on changes)

```bash
bun run dev
```

This watches source files and recompiles automatically.

### Type Checking

```bash
bun run typecheck
```

Runs TypeScript's `tsc --noEmit` across the entire monorepo.

### Linting

```bash
bun run lint
```

Uses the configured ESLint/Biome ruleset defined in the project root.

### Testing

```bash
bun test
```

Run tests inside individual packages:

```bash
bun test --filter "@grexcode/cli"
bun test --filter "@grexcode/core"
```

---

## Building Sub-projects

GrexCode consists of several distributable components.

### Web UI

```bash
bun run dev:web
```

Builds the GrexCode Web UI (React/Vite frontend) for browser-based interactions.

### Desktop Application

```bash
bun run dev:desktop
```

Builds the GrexCode Desktop application (Tauri or Electron-based native client).

### Console / CLI

```bash
bun run dev:console
```

Builds the GrexCode Console — the terminal-based user interface.

---

## CI/CD

GrexCode uses GitHub Actions for continuous integration. The CI pipeline runs:

1. Install dependencies (`bun install`)
2. Type checking (`bun run typecheck`)
3. Linting (`bun run lint`)
4. Unit tests (`bun test`)
5. Build all platform targets
6. Smoke test each artifact
7. Upload release artifacts

---

## Troubleshooting

| Issue                          | Likely Fix                                    |
|--------------------------------|-----------------------------------------------|
| `bun: command not found`       | Install Bun: `curl -fsSL https://bun.sh/install \| bash` |
| Type errors after pull         | `bun install && bun run typecheck`            |
| Build fails on Windows         | Ensure you have build tools (MSVC) installed  |
| Source maps missing in release | Pass `--sourcemaps` to the build script       |

---

*GrexCode — maintained by Grexlabs.*
