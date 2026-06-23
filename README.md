# GrexCode

**AI-powered development tool — Built by Grexlabs**

```
██████╗ ██████╗ ███████╗██╗  ██╗
██╔══██╗██╔══██╗██╔════╝╚██╗██╔╝
██║  ██║██████╔╝█████╗   ╚███╔╝
██║  ██║██╔══██╗██╔══╝   ██╔██╗
██████╔╝██║  ██║███████╗██╔╝ ██╗
╚═════╝ ╚═╝  ╚═╝╚══════╝╚═╝  ╚═╝
```

GrexCode is an open-source AI coding agent that operates in your terminal. It reads your codebase, understands your project structure, and executes tasks — editing files, running commands, searching code, and orchestrating complex multi-step workflows — all through natural language conversation.

- **Context-aware**: Understands your entire project, including file contents, git history, and directory structure.
- **Tool-equipped**: Shell execution, file editing, code search, web fetch, and more.
- **Multi-provider**: Works with OpenAI, Anthropic, Google, Groq, and 30+ AI providers.
- **Extensible**: Custom tools, plugins, skills, and MCP server support.
- **Cross-platform**: macOS, Linux, and Windows.

---

## Features

- **Interactive TUI** — Full-featured terminal user interface with session history, scrollback, and inline editing.
- **Agent System** — Built-in agents for development (`build`) and analysis (`plan`), switchable at runtime.
- **Multi-Provider Support** — 30+ AI providers with unified authentication management.
- **Tool Ecosystem** — Shell commands, file Read/Write/Edit, Glob/Grep search, web fetch/search, task orchestration, and LSP integration.
- **MCP Compatible** — Connect Model Context Protocol servers for extended tool capabilities.
- **Custom Plugins** — Extend GrexCode with plugins, custom tools, and skills.
- **Web Interface** — Browser-based UI for remote access.
- **Desktop App** — Native Electron application (beta).
- **Headless Server** — API server mode for CI/CD integration.
- **Session Management** — Continue, fork, and replay sessions.
- **Multi-language** — Supports 20+ translated READMEs and internationalized UI.

---

## Quick Start

### Install

```bash
curl -fsSL https://grexlabs.in/install | bash
```

### Package Managers

```bash
npm i -g grexcode-ai           # npm / bun / pnpm / yarn
brew install grexlabs/tap/grexcode  # macOS (recommended)
scoop install grexcode         # Windows
choco install grexcode         # Windows
sudo pacman -S grexcode        # Arch Linux
paru -S grexcode-bin           # Arch Linux (AUR)
mise use -g grexcode           # Version manager
nix run nixpkgs#grexcode       # Nix
```

### Desktop App (Beta)

Download from the [releases page](https://github.com/grexlabs/grexcode/releases) or [grexlabs.in/download](https://grexlabs.in/download).

| Platform              | Download                           |
| --------------------- | ---------------------------------- |
| macOS (Apple Silicon) | `grexcode-desktop-mac-arm64.dmg`   |
| macOS (Intel)         | `grexcode-desktop-mac-x64.dmg`     |
| Windows               | `grexcode-desktop-windows-x64.exe` |
| Linux                 | `.deb`, `.rpm`, or `.AppImage`     |

### First Run

```bash
# Start GrexCode in the current directory
grexcode

# Start in a specific project
grexcode /path/to/project

# Authenticate with a provider
grexcode providers login
```

---

## CLI Usage

### Commands

| Command               | Description                                |
| --------------------- | ------------------------------------------ |
| `grexcode`            | Start the TUI in the current directory     |
| `grexcode <dir>`      | Start the TUI in a specified directory     |
| `grexcode serve`      | Start headless API server                  |
| `grexcode web`        | Start server and open web interface        |
| `grexcode run`        | Run a single prompt in non-interactive mode|
| `grexcode providers`  | Manage AI provider credentials             |
| `grexcode models`     | List available models per provider         |
| `grexcode mcp`        | Manage MCP server connections              |
| `grexcode agent`      | List and manage agents                     |
| `grexcode session`    | Manage sessions                            |
| `grexcode upgrade`    | Upgrade GrexCode to the latest version     |
| `grexcode uninstall`  | Remove GrexCode from the system            |
| `grexcode debug`      | Debug tools for troubleshooting            |
| `grexcode github`     | GitHub integration commands                |
| `grexcode pr`         | Pull request management                    |
| `grexcode export`     | Export sessions and data                   |
| `grexcode import`     | Import sessions and data                   |
| `grexcode attach`     | Attach to a running GrexCode server        |
| `grexcode generate`   | Generate shell completions                 |
| `grexcode stats`      | View usage statistics                      |
| `grexcode completion` | Generate shell completion script           |

### Options

| Option              | Description                              |
| ------------------- | ---------------------------------------- |
| `-m, --model`       | Model to use (`provider/model`)          |
| `-c, --continue`    | Continue the last session                |
| `-s, --session`     | Continue a specific session              |
| `--fork`            | Fork a session when continuing           |
| `--prompt`          | Provide an initial prompt                |
| `--agent`           | Select an agent                          |
| `--mini`            | Start minimal interactive interface      |
| `--port`            | Server port (default: 4096)              |
| `--hostname`        | Server hostname                          |
| `--print-logs`      | Print logs to stderr                     |
| `--log-level`       | Log level (DEBUG, INFO, WARN, ERROR)     |
| `--pure`            | Run without external plugins             |
| `-h, --help`        | Show help                                |
| `-v, --version`     | Show version number                      |

---

## Providers

GrexCode supports 30+ AI providers. Authenticate with any provider using `grexcode providers login`.

| Provider              | Auth Type     |
| --------------------- | ------------- |
| Anthropic (Claude)    | API key       |
| OpenAI (GPT)          | API key       |
| Google (Gemini)       | API key       |
| Groq                  | API key       |
| Mistral               | API key       |
| Amazon Bedrock        | AWS credentials / Bearer token |
| Azure OpenAI          | API key       |
| GitHub Copilot        | OAuth         |
| OpenRouter            | API key       |
| Vercel AI Gateway     | API key       |
| Perplexity            | API key       |
| Together AI           | API key       |
| DeepInfra             | API key       |
| Cerebras              | API key       |
| Cohere                | API key       |
| xAI (Grok)            | API key       |
| Cloudflare AI Gateway | API key + Account ID |
| Alibaba (Qwen)        | API key       |
| GrexCode (first-party)| API key       |
| Venice AI             | API key       |
| GitLab AI             | API key       |
| Open AI Compatible    | Custom endpoint URL |

Providers are discovered from [grexlabs/models.dev](https://github.com/grexlabs/models.dev). New providers can be added without code changes by contributing to that repository.

### Environment Variables

Many providers can be configured via environment variables instead of interactive login:

```bash
export ANTHROPIC_API_KEY=sk-ant-...
export OPENAI_API_KEY=sk-proj-...
export GOOGLE_GENERATIVE_AI_API_KEY=...
```

Run `grexcode providers list` to see which environment variables are active.

---

## Tools

GrexCode equips the AI agent with a rich set of tools to interact with your codebase and environment:

| Tool              | Description                                        |
| ----------------- | -------------------------------------------------- |
| **Shell**         | Execute arbitrary shell commands                   |
| **Read**          | Read file contents with syntax highlighting        |
| **Write**         | Write content to files                             |
| **Edit**          | Apply exact string replacements in files           |
| **Apply Patch**   | Apply unified diff patches to files                |
| **Glob**          | Pattern-match file paths                           |
| **Grep**          | Search file contents with regex                    |
| **Task**          | Delegate sub-tasks to subagents                    |
| **Web Fetch**     | Retrieve content from URLs                         |
| **Web Search**    | Search the web (when provider supports it)         |
| **Skill**         | Execute loaded skills                              |
| **Todo**          | Track and manage todo items                        |
| **Question**      | Ask the user for clarification                     |
| **LSP**           | Query Language Server Protocol for code intelligence|
| **Plan**          | Read-only planning mode (experimental)             |

Custom tools can be added by placing `.ts` or `.js` files in a `tool/` or `tools/` directory inside your project or GrexCode config directory.

---

## Configuration

GrexCode is configured via `grexcode.jsonc` or `grexcode.json`. Configuration is resolved from the project directory (or `.grexcode/` subdirectory) and merged with global configuration.

### Config File Locations

1. Project-level: `<project>/.grexcode/grexcode.jsonc`
2. Project-level: `<project>/grexcode.jsonc`
3. Global: `~/.config/grexcode/grexcode.jsonc`

### Schema Reference

```jsonc
{
  "$schema": "https://grexlabs.in/config.json",

  // Provider-specific settings (name overrides, base URLs, etc.)
  "provider": {
    "openai": {
      "name": "My OpenAI"
    },
    "anthropic": {
      "baseURL": "https://custom-anthropic-proxy.example.com"
    }
  },

  // Enable or disable specific providers
  "enabled_providers": ["openai", "anthropic", "google"],
  "disabled_providers": [],

  // Default model selection
  "model": {
    "default": "anthropic/claude-sonnet-4-20250514",
    "plan": "google/gemini-2.5-flash"
  },

  // Agent configuration
  "agent": {
    "build": {
      "permission": "default"
    }
  },

  // Permission rules
  "permission": {
    "bash": "allow",
    "read": "allow",
    "edit": "ask",
    "glob": "allow",
    "grep": "allow"
  },

  // MCP server configuration
  "mcp": {
    "my-server": {
      "type": "local",
      "command": ["npx", "-y", "@modelcontextprotocol/server-filesystem", "."]
    },
    "remote-api": {
      "type": "remote",
      "url": "https://mcp.example.com",
      "headers": {
        "Authorization": "Bearer token"
      }
    }
  },

  // Custom tools directory
  "tools": {
    "my-custom-tool": true
  },

  // Project references for additional context
  "references": {
    "my-lib": {
      "repository": "github.com/org/repo",
      "description": "Additional context hints"
    }
  },

  // Tab-autocomplete configuration
  "tabAutocomplete": {
    "enabled": true,
    "model": "copilot"
  }
}
```

---

## Development

### Prerequisites

- [Bun](https://bun.sh) 1.3+

### Setup

```bash
# Clone the repository
git clone https://github.com/grexlabs/grexcode.git
cd grexcode

# Install dependencies
bun install

# Start development server
bun dev
```

### Project Structure

```
grexcode/
├── packages/
│   ├── grexcode/          # Core business logic, CLI, server, TUI
│   ├── app/               # Shared web UI components (SolidJS)
│   ├── desktop/           # Electron desktop app wrapper
│   ├── console/           # Web console app
│   ├── core/              # Core shared libraries
│   ├── tui/               # TUI rendering layer (opentui)
│   ├── server/            # Server runtime
│   ├── sdk/               # Client SDK
│   ├── plugin/            # Plugin system
│   ├── llm/               # LLM abstraction layer
│   ├── cli/               # Standalone CLI
│   ├── ui/                # UI component library
│   ├── web/               # Web resources
│   ├── script/            # Build and utility scripts
│   └── storybook/         # UI component showcase
├── docs/                  # Documentation
├── .grexcode/             # GrexCode's own configuration
├── script/                # Project-level scripts
├── infra/                 # Infrastructure (SST/AWS)
└── specs/                 # Specifications
```

### Dev vs Production

```bash
# Development (from project root)
bun dev              # Equivalent to `grexcode` in dev mode
bun dev --help       # Show all commands
bun dev <directory>  # Start TUI in a directory
bun dev serve        # Start headless server
bun dev web          # Start server + web interface

# Production (after build)
grexcode             # Run the compiled binary
grexcode <directory> # Start TUI in a directory
```

### Running the API Server

```bash
bun dev serve                    # Default port 4096
bun dev serve --port 8080        # Custom port
bun dev serve --hostname 0.0.0.0 # Listen on all interfaces
```

### Running the Web App

```bash
# Terminal 1: Start the API server
bun dev serve

# Terminal 2: Start the web dev server
bun run --cwd packages/app dev
```

### Running the Desktop App

```bash
bun run --cwd packages/desktop dev     # Development
bun run --cwd packages/desktop build   # Production build
bun run --cwd packages/desktop package # Package for distribution
```

### Running Against a Different Directory

```bash
bun dev /path/to/other/project
bun dev .   # Run GrexCode in the grexcode repo itself
```

---

## Build Process

### Building a Standalone Executable

```bash
./packages/grexcode/script/build.ts --single
```

The compiled binary will be available at:

```bash
./packages/grexcode/dist/grexcode-<platform>/bin/grexcode
```

Where `<platform>` is one of: `darwin-arm64`, `darwin-x64`, `linux-x64`, `linux-arm64`, `win32-x64`.

### Build Targets

| Target          | Platform       | Architecture |
| --------------- | -------------- | ------------ |
| `darwin-arm64`  | macOS          | ARM64        |
| `darwin-x64`    | macOS          | x86_64       |
| `linux-x64`     | Linux          | x86_64       |
| `linux-arm64`   | Linux          | ARM64        |
| `win32-x64`     | Windows        | x86_64       |

### CI/CD

The project uses GitHub Actions for continuous integration and delivery. See `.github/workflows/publish.yml` for the full pipeline definition.

### Verifying a Build

```bash
# Run linting
bun lint

# Type checking across all packages
bun typecheck

# Run tests
bun run --cwd packages/grexcode test
```

---

## Release Process

### Versioning

GrexCode follows [Semantic Versioning](https://semver.org/). The current version is tracked in `packages/grexcode/package.json`.

### Release Channels

- **Dev** (`dev` branch) — Latest development build, may be unstable.
- **Stable** (`main` branch) — Production-ready releases.
- **npm** — Published as `grexcode-ai` on the npm registry.

### Publishing

Releases are automated through GitHub Actions. The pipeline:

1. Runs full test suite and type checking
2. Builds standalone binaries for all platforms
3. Publishes to npm, Homebrew, Scoop, AUR, and other package managers
4. Creates a GitHub release with platform-specific artifacts

### Release Artifacts

Each release includes:

- Standalone binaries for all platforms
- npm package (`grexcode-ai`)
- Desktop app installers (DMG, EXE, DEB, RPM, AppImage)
- Updated package manager formulae

---

## Troubleshooting

### Common Issues

**"Command not found" after install**
Ensure the installation directory is in your `PATH`. The install script prints the directory it used — add it to your shell profile if needed.

**Provider login fails**
Run `grexcode providers login` interactively. For API key-based providers, verify the key is valid and has appropriate model access.

**MCP server connection errors**
- For local servers, verify the command is correct and dependencies are installed.
- For remote servers, check the URL is reachable and authentication is configured.
- Use `grexcode mcp debug <name>` to diagnose OAuth and connectivity issues.

**Performance issues**
- Reduce the number of files in your project directory or add patterns to `.gitignore`.
- Use the `--mini` flag for a lighter TUI.
- Check system resource usage with `grexcode debug`.

### Debug Commands

```bash
grexcode debug config       # Show resolved configuration
grexcode debug agent        # Debug agent state
grexcode debug lsp          # Check LSP server status
grexcode debug snapshot     # Capture debug snapshot
grexcode debug ripgrep      # Test ripgrep search
grexcode debug file         # File operations debug
```

### Logs

Logs are stored in the GrexCode data directory:

- **Linux/macOS**: `~/.local/share/grexcode/`
- **Windows**: `%LOCALAPPDATA%/grexcode/`

Enable verbose logging:

```bash
grexcode --print-logs --log-level DEBUG
```

---

## FAQ

**What is GrexCode?**
GrexCode is an open-source AI-powered coding agent that runs in your terminal. It understands your codebase and can autonomously perform development tasks through natural language conversation.

**How is GrexCode different from other AI coding tools?**
GrexCode is fully open-source, works with 30+ AI providers (not locked to any single vendor), provides a rich terminal TUI, and has a powerful plugin/tool extension system.

**Which AI models are supported?**
Anthropic Claude, OpenAI GPT, Google Gemini, Groq, Mistral, Amazon Bedrock, and 25+ others. Use `grexcode models` to see all available models.

**Is GrexCode free?**
GrexCode is open-source (MIT license). You only pay for the AI provider API usage you choose to use.

**Can I use GrexCode offline?**
GrexCode requires a connection to an AI provider API. You can use local models through providers like Ollama if configured via an OpenAI-compatible endpoint.

**Does GrexCode store my code?**
Code is processed by the AI provider you select. GrexCode stores session data locally for history and continuation. You can choose to use providers that offer data privacy guarantees.

**Can I use GrexCode in CI/CD?**
Yes. Use `grexcode serve` for headless API server mode, or `grexcode run` for single-prompt non-interactive execution.

**How do I create custom tools?**
Place `.ts` or `.js` files in a `tool/` directory. Each file exports tool definitions with `args`, `description`, and `execute` functions. See the [docs](https://grexlabs.in/docs) for details.

**How do I contribute?**
See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines. Start by opening an issue for the feature or bug you want to address.

**Where can I get help?**
- [Documentation](https://grexlabs.in/docs)
- [Discord Community](https://grexlabs.in/discord)
- [GitHub Issues](https://github.com/grexlabs/grexcode/issues)

---

## License

GrexCode is released under the [MIT License](./LICENSE).

```
MIT License

Copyright (c) 2025 Grexlabs

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

---

Built with by [Grexlabs](https://grexlabs.in)

[Join our Discord](https://grexlabs.in/discord) | [X / Twitter](https://x.com/grexcode) | [GitHub](https://github.com/grexlabs/grexcode)
