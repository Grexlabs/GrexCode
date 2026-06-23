# GrexCode — Repository Analysis

**Source:** GrexCode (grexlabs/grexcode) → **GrexCode** (Grexlabs/GrexCode)
**Version:** 1.17.9
**Default Branch:** dev
**Package Manager:** Bun 1.3.14
**Monorepo Tool:** Turbo 2.8.13
**Language:** TypeScript 5.8 (100%)
**License:** MIT

---

## Architecture Diagram

```
packages/
├── grexcode/          ← Main entrypoint (CLI, agent, session, server, tool system)
│   ├── bin/grexcode   ← Node.js wrapper for compiled binary
│   ├── src/
│   │   ├── index.ts   ← Main entry
│   │   ├── cli/       ← CLI bootstrap, commands (yargs), logo
│   │   ├── agent/     ← AI agent system, prompts
│   │   ├── session/   ← Session management, LLM integration
│   │   ├── tool/      ← Tool registry (read, write, edit, grep, glob, shell, etc.)
│   │   ├── server/    ← HTTP API server (Hono), routes, middleware
│   │   ├── config/    ← Config loading, parsing, paths
│   │   ├── provider/  ← AI provider integration
│   │   ├── mcp/       ← MCP protocol support
│   │   ├── plugin/    ← Plugin system (GitHub Copilot, OpenAI Codex, etc.)
│   │   ├── project/   ← Project management, VCS integration
│   │   ├── effect/    ← Effect-TS runtime layer
│   │   ├── env/       ← Environment variable service
│   │   └── storage/   ← Database (SQLite via Drizzle)
│   ├── script/
│   │   ├── build.ts   ← Binary compilation (Bun.compile for multiple platforms)
│   │   └── generate.ts← Code generation
│   └── test/
│
├── cli/               ← CLI layer (daemon, framework, TUI integration)
│   └── src/
│       ├── index.ts
│       ├── tui.ts
│       ├── commands/  ← Command definitions and handlers
│       └── services/  ← Daemon management
│
├── core/              ← Core library (shared between grexcode and cli packages)
│   ├── src/
│   │   ├── config/    ← Config schema, parsing, validation
│   │   ├── database/  ← SQLite via Drizzle ORM, migrations
│   │   ├── agent.ts
│   │   ├── aisdk.ts   ← AI SDK integration
│   │   └── catalog.ts ← Model provider catalog
│   └── test/
│
├── tui/               ← Terminal UI (Solid.js + OpenTUI)
│   ├── src/
│   │   ├── index.tsx
│   │   ├── app.tsx
│   │   ├── logo.ts    ← Logo/ASCII art
│   │   ├── routes/    ← Home, Session routes
│   │   ├── component/ ← UI components (dialogs, prompts, spinners)
│   │   ├── context/   ← Solid.js context providers
│   │   └── theme/     ← Theme system (30+ themes)
│   └── test/
│
├── ui/                ← Shared UI primitives
├── plugin/            ← Plugin SDK
├── server/            ← Server SDK
├── sdk/js/            ← JavaScript SDK
├── script/            ← Shared scripts
├── app/               ← Web UI (Solid.js + Vite)
│   └── src/
│
├── desktop/           ← Desktop (Tauri)
│   ├── src/           ← Rust backend
│   └── scripts/
│
├── web/               ← Web landing page
├── docs/              ← Documentation site
├── console/           ← Cloud console (SST + Hono)
│   ├── app/
│   ├── core/
│   └── function/
│
├── stats/             ← Telemetry/analytics
│   ├── app/
│   ├── core/
│   └── server/
│
├── llm/               ← LLM utilities
├── identity/          ← Identity/auth
├── enterprise/        ← Enterprise features
├── function/          ← Cloud functions
├── slack/             ← Slack integration
├── storybook/         ← UI component browser
├── effect-drizzle-sqlite/  ← Effect-TS + Drizzle bridge
├── effect-sqlite-node/     ← Effect-TS SQLite adapter
├── http-recorder/     ← HTTP recording/replay for testing
├── containers/        ← Docker container definitions
└── sdk/               ← SDK workspace

infra/                 ← SST infrastructure (AWS CDK)
github/                ← GitHub Action
nix/                   ← Nix flakes
specs/                 ← Specifications
perf/                  ← Performance tests
sdks/                  ← Generated SDKs
```

## Package Dependencies Graph

```
grexcode
├── @grexlabs/core  ← Database, config, providers, agents
│   ├── @grexlabs/effect-drizzle-sqlite
│   ├── @grexlabs/effect-sqlite-node
│   └── @grexlabs/llm
├── @grexlabs/cli  ← CLI framework, daemon
│   ├── @grexlabs/core
│   ├── @grexlabs/tui
│   └── @grexlabs/server
├── @grexlabs/tui  ← Terminal UI
│   ├── @grexlabs/core
│   ├── @grexlabs/ui
│   └── @grexlabs/plugin
├── @grexlabs/server  ← Server SDK
├── @grexlabs/plugin  ← Plugin SDK
├── @grexlabs/sdk     ← Client SDK
└── @grexlabs/script  ← Build scripts
```

## Package Naming Convention

| Current | New |
|---------|-----|
| `grexcode` (root) | `grexcode` |
| `@grexlabs/core` | `@grexlabs/core` |
| `@grexlabs/cli` | `@grexlabs/cli` |
| `@grexlabs/tui` | `@grexlabs/tui` |
| `@grexlabs/ui` | `@grexlabs/ui` |
| `@grexlabs/plugin` | `@grexlabs/plugin` |
| `@grexlabs/server` | `@grexlabs/server` |
| `@grexlabs/sdk` | `@grexlabs/sdk` |
| `@grexlabs/script` | `@grexlabs/script` |
| `@grexlabs/llm` | `@grexlabs/llm` |
| `@grexlabs/http-recorder` | `@grexlabs/http-recorder` |
| `@grexlabs/effect-drizzle-sqlite` | `@grexlabs/effect-drizzle-sqlite` |
| `@grexlabs/effect-sqlite-node` | `@grexlabs/effect-sqlite-node` |

## Key Files

| File | Purpose |
|------|---------|
| `package.json` | Root workspace config, scripts, dependencies |
| `packages/grexcode/package.json` | Main app package (name in package.json: `grexcode`, bin: `grexcode`) |
| `packages/grexcode/bin/grexcode` | Node.js bootstrap wrapper for compiled binary |
| `packages/grexcode/src/index.ts` | Main entrypoint |
| `packages/grexcode/script/build.ts` | Cross-platform binary compilation |
| `packages/grexcode/src/cli/logo.ts` | CLI logo (re-exports from @grexlabs/tui/logo) |
| `packages/tui/src/logo.ts` | TUI ASCII logo art |
| `packages/grexcode/src/env/index.ts` | Environment variable service |
| `packages/grexcode/src/config/config.ts` | Config loading system |
| `packages/grexcode/src/config/paths.ts` | Config path resolution (~/.config/grexcode, ~/.local/share/grexcode) |
| `packages/core/src/config.ts` | Core config schema |
| `install` | Shell installer script |
| `bunfig.toml` | Bun configuration |
| `turbo.json` | Turbo monorepo config |
| `tsconfig.json` | Base TypeScript config |
| `.github/workflows/` | CI/CD workflows (28 files) |
| `.grexcode/grexcode.jsonc` | GrexCode's own config |
| `flake.nix` | Nix flake |

## Branding Locations (must replace)

### Source Code Text
- `GrexCode` → `GrexCode`
- `grexcode` → `grexcode` (package names, binary names, filenames)
- `grexlabs` → `grexlabs` (GitHub org)
- `Grexlabs` → `Grexlabs` (company name)
- `grexlabs.in` → `grexlabs.in`
- `@grexlabs/` → `@grexlabs/`
- `/grexcode/` → `/grexcode/` (config paths)

### Config & Path References
- `.grexcode/` → `.grexcode/`
- `grexcode.json` → `grexcode.json`
- `OPENCODE_*` env vars → `GREXCODE_*`
- `~/.config/grexcode` → `~/.config/grexcode`
- `~/.local/share/grexcode` → `~/.local/share/grexcode`
- `~/.grexcode` → `~/.grexcode`

### File Contents
- `packages/tui/src/logo.ts` - ASCII art
- `install` script - URLs, app name, banner
- `packages/grexcode/bin/grexcode` - env var names, binary names
- `packages/grexcode/script/build.ts` - user-agent, defines
- `packages/grexcode/src/cli/logo.ts` - logo export
- `README.md` and localized versions (22+ languages)
- `CONTRIBUTING.md`
- `SECURITY.md`
- `STATS.md`
- Package.json files (name, repository.url)
- `.github/workflows/*.yml` - env vars, repo references
- `.github/CODEOWNERS`
- `.grexcode/` directory contents
- `flake.nix`
- `nix/grexcode.nix`
- `sst.config.ts`
- Docs site configs
- Desktop app config

## Risks

1. **Package Manager Registry**: `@grexlabs/*` packages are on npm. Renaming requires publishing `@grexlabs/*`.
2. **Downstream Dependencies**: The `grexcode` package and `@grexlabs/*` packages are depended on by external projects.
3. **Binary Names**: The compiled binary is named `grexcode`. Users calling `grexcode` will break.
4. **Config Compatibility**: Existing `grexcode.json` configs won't be detected. Migration path needed.
5. **IDE Extensions**: VS Code extension references `grexcode` binary name.
6. **CI/CD**: GitHub Actions reference `grexlabs/grexcode` repo.
7. **Install Script**: URLs to `github.com/grexlabs/grexcode` and `grexlabs.in`.
8. **Nix Flake**: References to `grexcode` in nix expressions.
9. **Docker Images**: Container build references.
10. **SST Infrastructure**: References `grexlabs/grexcode`.

## Rebranding Strategy

1. **Phase 1**: Search & replace all text occurrences (case-sensitive, case-insensitive)
2. **Phase 2**: Update file/directory names (`.grexcode/`, binary names)
3. **Phase 3**: Update package.json names, dependency references
4. **Phase 4**: Update install script, URLs, CI/CD
5. **Phase 5**: Update logo art, themes, UI text
6. **Phase 6**: Update documentation
7. **Phase 7**: Create migration wrapper (grexcode → grexcode compat)
8. **Phase 8**: Validate build succeeds, tests pass

## GitHub Actions Workflows

| Workflow | Purpose |
|----------|---------|
| `publish.yml` | Release and publish to npm/GitHub |
| `test.yml` | Run test suite |
| `typecheck.yml` | TypeScript type checking |
| `deploy.yml` | Deploy infrastructure |
| `containers.yml` | Docker builds |
| `beta.yml` | Beta release |
| `publish-vscode.yml` | VS Code extension publish |
| `release-github-action.yml` | GitHub Action release |
| `publish-github-action.yml` | GitHub Action publish |
| `publish-python-sdk.yml` | Python SDK publish |
| `storybook.yml` | Storybook deploy |
| `docs-update.yml` | Documentation sync |
| `docs-locale-sync.yml` | Locale sync |
| `generate.yml` | Code generation |
| `stats.yml` | Statistics |
| `nix-eval.yml` | Nix evaluation |
| `nix-hashes.yml` | Nix hash updates |
| `pr-management.yml` | PR management |
| `pr-standards.yml` | PR standards |
| `review.yml` | Code review |
| `triage.yml` | Issue triage |
| `close-issues.yml` | Issue cleanup |
| `close-prs.yml` | PR cleanup |
| `compliance-close.yml` | Compliance |
| `duplicate-issues.yml` | Duplicate detection |
| `notify-discord.yml` | Discord notifications |

## Model Providers Supported

Anthropic, OpenAI, Google, Google Vertex, Azure, AWS Bedrock, Mistral, Groq, Perplexity, Together AI, DeepInfra, Cerebras, xAI, Alibaba, Cohere, OpenRouter, GitHub Copilot, AI Gateway, Snowflake Cortex, Venice AI, GitLab AI, and more.

## Tech Stack

- **Runtime**: Bun 1.3.14
- **UI Framework**: Solid.js 1.9 + OpenTUI (terminal) / SolidStart (web)
- **Language**: TypeScript 5.8 with TypeScript Go native preview
- **ORM**: Drizzle with SQLite
- **HTTP**: Hono 4
- **Effect System**: Effect-TS v4 beta
- **AI**: Vercel AI SDK 6
- **Styling**: Tailwind CSS 4
- **Infrastructure**: SST 4 (AWS CDK)
- **Containerization**: Docker (multi-arch)
