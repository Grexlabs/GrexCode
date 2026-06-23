# Contributing to GrexCode

Welcome! We're glad you're interested in contributing to GrexCode — a fork of OpenCode by Grexlabs with enhanced AI-powered development tooling.

## Code of Conduct

This project is governed by a **be excellent to each other** policy. All participants — contributors, maintainers, and community members — are expected to treat each other with respect and professionalism. Harassment, trolling, and other toxic behavior will not be tolerated.

If you encounter unacceptable behavior, please contact a maintainer via [Discord](https://grexlabs.in/discord) or open a private issue.

---

## How to Contribute

There are several ways to contribute:

- **Report bugs** — Open a bug report issue using the bug report template.
- **Suggest features** — Start with a feature request issue to discuss design before coding.
- **Submit pull requests** — Fix bugs, improve docs, add LSPs/formatters, or enhance LLM performance.
- **Participate in discussions** — Help answer questions and share ideas in our [Discord](https://grexlabs.in/discord) or GitHub Discussions.
- **Improve documentation** — Fix typos, clarify wording, or add missing docs.

The most common types of changes that get merged:

- Bug fixes
- Additional LSPs / Formatters
- Improvements to LLM performance
- Support for new providers
- Fixes for environment-specific quirks
- Missing standard behavior
- Documentation improvements

**UI or core product features** must go through a design review with the core team before implementation. If unsure, look for issues labeled [`help wanted`](https://github.com/grexlabs/grexcode/issues?q=is%3Aissue%20state%3Aopen%20label%3Ahelp-wanted), [`good first issue`](https://github.com/grexlabs/grexcode/issues?q=is%3Aissue%20state%3Aopen%20label%3A%22good%20first%20issue%22), [`bug`](https://github.com/grexlabs/grexcode/issues?q=is%3Aissue%20state%3Aopen%20label%3Abug), or [`perf`](https://github.com/grexlabs/grexcode/issues?q=is%3Aopen%20is%3Aissue%20label%3A%22perf%22).

> [!NOTE]
> PRs that ignore these guardrails will likely be closed.

Want to take on an issue? Leave a comment and a maintainer may assign it to you.

---

## Development Setup

### Prerequisites

- **Bun 1.3.14+** (the project uses `bun` as package manager and runtime)
- TypeScript 5.x

### Clone & Install

```bash
git clone https://github.com/grexlabs/grexcode.git
cd grexcode
bun install
```

### Start Dev Server

```bash
bun dev
```

By default this runs GrexCode in the `packages/grexcode` directory. To target a different directory:

```bash
bun dev <directory>
```

Run GrexCode against the repo itself:

```bash
bun dev .
```

### Dev Server Commands

```bash
bun dev --help           # Show all available commands
bun dev serve            # Start headless API server
bun dev web              # Start server + open web interface
bun dev <directory>      # Start TUI in specific directory
```

### Building a Standalone Binary

```bash
./packages/grexcode/script/build.ts --single
./packages/grexcode/dist/grexcode-<platform>/bin/grexcode
```

Replace `<platform>` with your platform (e.g., `darwin-arm64`, `linux-x64`).

### Running the API Server

```bash
bun dev serve --port 4096
```

### Running the Web App

Start the server first, then:

```bash
bun run --cwd packages/app dev
```

### Running the Desktop App

```bash
bun run --cwd packages/desktop dev     # Development
bun run --cwd packages/desktop build   # Production build
bun run --cwd packages/desktop package # Package for distribution
```

### Debugging

See [Debugging Setup](CONTRIBUTING.md#setting-up-a-debugger) below.

---

## Monorepo Structure

```
grexcode/
├── packages/
│   ├── grexcode/          # Core business logic & CLI server (TUI in src/cli/cmd/tui/)
│   ├── app/               # Shared web UI components (SolidJS)
│   ├── desktop/           # Native desktop app (Electron, wraps packages/app)
│   ├── plugin/            # Source for @grexlabs/plugin
│   ├── core/              # Core shared utilities
│   ├── sdk/               # Client SDKs
│   ├── console/           # Console app
│   └── stats/             # Stats app
├── packages/console/*     # Console sub-packages
├── packages/stats/*       # Stats sub-packages
├── packages/sdk/js        # JavaScript SDK
├── packages/slack         # Slack integration
├── docs/                  # Documentation
├── script/                # Build & utility scripts
├── specs/                 # Specifications
└── infra/                 # Infrastructure configs
```

---

## Coding Standards

### Language & Runtime

- **TypeScript** throughout (strict mode)
- **Bun** runtime — prefer Bun APIs like `Bun.file()` when they fit
- Use `type: "module"` ESM patterns

### Frameworks

- **Effect-TS** — functional effect system for core business logic
- **Solid.js** — UI framework (TUI uses [opentui](https://github.com/sst/opentui), web app uses SolidJS + Tailwind CSS)
- **Hono** — API server framework

### General Principles

| Rule | Guideline |
|------|-----------|
| Functions | Keep logic in one function unless breaking it out adds clear reuse or composition |
| Destructuring | Avoid unnecessary destructuring; prefer dot notation |
| Control flow | Avoid `else` statements; prefer early returns |
| Error handling | Prefer `.catch(...)` over `try`/`catch` |
| Types | Use precise types; avoid `any` |
| Variables | Prefer `const` over `let`; use ternaries instead of reassignment |
| Naming | Choose concise single-word identifiers that remain descriptive |
| Imports | Never alias or star-import; import named exports only |
| Inlining | Inline single-use values instead of creating intermediate variables |
| Schema (Drizzle) | Use snake_case for field names |

### Additional Conventions

- Follow the [style guide in AGENTS.md](./AGENTS.md) for detailed patterns
- Run `bun typecheck` from package directories (not `tsc` directly)
- Run `bun lint` (oxlint) before committing

---

## Commit Conventions

We follow **conventional commits**. Every commit message and PR title should use the format:

```
type(scope): summary
```

### Types

| Type     | Usage                         |
|----------|-------------------------------|
| `feat`   | New feature or functionality  |
| `fix`    | Bug fix                       |
| `docs`   | Documentation changes         |
| `chore`  | Maintenance, deps, tooling    |
| `refactor` | Code refactoring (no behavior change) |
| `test`   | Adding or updating tests      |

### Scopes (optional)

Use the affected package or area:

- `core` — core utilities
- `grexcode` — core CLI/server package
- `tui` — terminal UI
- `app` — web app UI
- `desktop` — Electron desktop app
- `sdk` — client SDKs
- `plugin` — plugin system

### Examples

```
feat(tui): add thinking toggle
fix: resolve crash on startup
docs: update contributing guide
chore(sdk): regenerate types
refactor(core): extract config validation
test(app): add provider selection tests
```

### Branch Naming

Use short (≤3 words) hyphen-separated names. No type prefixes:

- `session-recovery`
- `fix-scroll-state`
- `regenerate-sdk`

---

## Pull Request Process

### Issue First Policy

**All PRs must reference an existing issue.** Open an issue describing the bug or feature before submitting code. PRs without a linked issue may be closed without review.

- Use `Fixes #123` or `Closes #123` in the PR description
- For small fixes, a brief issue is sufficient

### General Requirements

- Keep PRs small and focused
- Explain what changed and why in your own words
- Check that the feature doesn't already exist elsewhere in the codebase
- Run `bun typecheck` and `bun lint` before submitting

### UI Changes

Include screenshots or videos showing before and after.

### Logic Changes

Explain how you verified the change works — what you tested and how a reviewer can reproduce it.

### PR Titles

Must follow conventional commit format (see above).

### No AI-Generated Walls of Text

Write short, focused PR descriptions. Long AI-generated text may be ignored.

---

## Testing Guidelines

- **Avoid mocks** — test real implementation paths where possible
- **Do not duplicate logic into tests** — test behavior, not implementation
- Tests **cannot run from repo root** — run from package directories:

```bash
bun run --cwd packages/grexcode test
```

- For UI changes, test manually via `bun dev web` or `bun run --cwd packages/app dev`
- For API changes, test via `bun dev serve` with HTTP requests
- If you modify the API or SDK (e.g. `packages/grexcode/src/server/server.ts`), regenerate the SDK:

```bash
./script/generate.ts
```

---

## Documentation Guidelines

- Keep docs concise and focused
- Use Markdown with GitHub-flavored syntax
- Update relevant README or docs when changing behavior
- Reference source files with `path/to/file:line` where helpful
- Place new documentation in the `docs/` directory or alongside the relevant package

---

## Community Channels

- **Discord**: [https://grexlabs.in/discord](https://grexlabs.in/discord)
- **GitHub Issues**: [https://github.com/grexlabs/grexcode/issues](https://github.com/grexlabs/grexcode/issues)
- **GitHub Discussions**: [https://github.com/grexlabs/grexcode/discussions](https://github.com/grexlabs/grexcode/discussions)

---

## Adding New Providers

New providers shouldn't require many code changes. First make a PR to the models registry:

[https://github.com/grexlabs/models.dev](https://github.com/grexlabs/models.dev)

---

## Feature Requests

For net-new functionality, start with a design conversation. Open an issue describing the problem, your proposed approach (optional), and why it belongs in GrexCode. Wait for core team approval before opening a feature PR directly.

---

## Trust & Vouch System

This project uses [vouch](https://github.com/mitchellh/vouch) to manage contributor trust. The vouch list is maintained in [`.github/VOUCHED.td`](.github/VOUCHED.td).

- **Vouched users** are explicitly trusted contributors
- **Denounced users** are automatically blocked
- **Everyone else** can participate normally

Maintainers can manage the vouch list by commenting `vouch`, `denounce`, or `unvouch` on issues.

Denouncement is reserved for users who repeatedly submit low-quality AI-generated contributions, spam, or bad-faith behavior.

---

## Issue Requirements

All issues must use the provided templates — **blank issues are not allowed**:

- **Bug report** — requires a description
- **Feature request** — requires verification checkbox and description
- **Question** — requires the question

Automated checks verify template usage. Issues not meeting requirements will be flagged and auto-closed after 2 hours if not corrected.

---

## Setting Up a Debugger

See the full [Debugging Setup](#debugging) section below.

### VSCode Setup

Example configurations are available in `.vscode/settings.example.json` and `.vscode/launch.example.json`.

The most reliable approach: run GrexCode with `bun run --inspect=<url> dev ...` and attach your debugger via that URL.

---

*Thank you for contributing to GrexCode!*
