# Repository Guidelines

## Project Structure & Module Organization
- Root scripts: `extract-lm-studio.mjs` (MCP + Firecrawl extractor), `test-*.js`, `start-*.sh`.
- Tests: `Tests/` (Node integration tests hitting LM Studio on `localhost:1234`).
- Agents/Tools: `mcp/`, `mcp-firecrawl/` (Model Context Protocol clients/providers).
- Knowledge: `skills-catalog/` (output JSON/MD), `documents/`, `models/`, `memory/`.
- Config: `.env` (local), `.env.example` (template), `.codexrc`, `.github/` workflows.

## Build, Test, and Development Commands
- `npm run extract` — run `extract-lm-studio.mjs` to crawl docs and write to `skills-catalog/`.
- `npm run test:context` | `test:performance` | `test:concurrent` — run individual integration tests.
- `npm run test:all` — run all tests sequentially.
- `./start-lm-studio-server.sh` — start LM Studio’s OpenAI-compatible server (ensure model loaded).
- `./start-codex.sh` — launch the local Codex CLI harness.

## Coding Style & Naming Conventions
- Language: Node.js (ES Modules). Use 2-space indentation, semicolons, single quotes.
- File names: kebab-case for scripts (`extract-lm-studio.mjs`), `camelCase` for variables/functions.
- Imports: prefer ESM (`import … from`); keep relative paths tidy.
- Formatting: keep lines ≤ 100 chars; run Prettier defaults if available.

## Testing Guidelines
- Framework: plain Node scripts (no Jest). Place files in `Tests/` named `*-test.js`.
- Pre-req: LM Studio server running at `http://localhost:1234` with desired model (e.g., `qwen/qwen3-30b-a3b-2507`).
- Run: `npm run test:all`. Keep tests deterministic and under 60s each; log summary metrics.

## Commit & Pull Request Guidelines
- Commits: follow Conventional Commits, e.g., `feat: add concurrency test`, `fix: handle request error`.
- PRs: include purpose, key changes, how to run/reproduce, and links to issues. Add logs/screenshots for test output when relevant.
- Keep diffs focused; update docs/tests alongside code.

## Security & Configuration Tips
- Secrets: never commit keys. Use `.env` (copy from `.env.example`) and reference via `process.env`. Move any inline keys in scripts to env vars.
- Ports/Models: default server `:1234`; document model choices in PRs. Large crawls are network/CPU heavy—run locally and commit only outputs needed in `skills-catalog/`.

## Architecture Overview
- Node-based tools orchestrate MCP providers (e.g., Firecrawl) to extract docs and serialize skills into `skills-catalog/`.
- Tests validate LM Studio’s OpenAI-compatible API for context, performance, and concurrency.
