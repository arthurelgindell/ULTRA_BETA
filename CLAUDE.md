# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ULTRA is a local-first AI integration project combining LM Studio with MCP (Model Context Protocol) servers for secure, on-device AI processing on Apple Silicon Macs. The system prioritizes privacy, portability, and bulletproof operation.

## Critical Operating Principles (from CONSTITUTION.md)

- **Prime Directive**: Execute with precision. Report with accuracy. Never fabricate success.
- **Verification Rules**: NEVER claim success without proof. Default state = FAILED until proven otherwise.
- **Failure Protocol**: State clearly "TASK FAILED" - no minimization, stop on failure.
- **Documentation**: One document per solution in /documents folder with detailed operations guide.
- **Portability**: ALL components MUST be contained in /Volumes/DATA/ULTRA folder.
- **Testing**: Test files go in /Tests folder - periodically cleaned to avoid incomplete functionality references.

## Architecture

### Core Components

1. **LM Studio Integration** (`localhost:1234`)
   - Models: `qwen3-30b-a3b-instruct-2507-mlx`, `devstral-small-2507-mlx`
   - OpenAI-compatible API for local inference
   - MLX-optimized models for Apple Silicon

2. **MCP Shell Server** (`mcp/shell/`)
   - Python 3.11+ virtual environment at `.venv`
   - Sandboxed command execution with security guardrails
   - File operations (read/write/list) with path jail
   - Environment: `SHELL_ALLOWLIST`, `SHELL_CWD`, `NO_NET=1`

3. **MCP Firecrawl Server** (`mcp-firecrawl/`)
   - TypeScript/Node.js implementation
   - Web scraping and document extraction
   - Built with `@modelcontextprotocol/sdk`

## Essential Commands

### Environment Setup
```bash
# Activate Python environment for MCP
source mcp/shell/.venv/bin/activate

# Verify Python version (must be 3.11+)
python --version
```

### Build Commands
```bash
# Build Firecrawl MCP server
cd mcp-firecrawl && npm run build

# Install Python dependencies for shell MCP
cd mcp/shell && pip install -e .
```

### Testing
```bash
# Run all LM Studio tests
npm run test:all

# Individual test suites
npm run test:context     # Context handling limits
npm run test:performance # Performance benchmarks
npm run test:concurrent   # Concurrent request handling

# Test MCP shell server
python mcp/shell/test_server.py

# Test complete workflow
./test-complete-workflow.sh

# Test MCP-LM integration
node test-mcp-lm-integration.js
```

### Server Operations
```bash
# Check LM Studio status
./start-lm-studio-server.sh

# Start MCP shell server
cd mcp/shell && python run_server.py

# Start Firecrawl MCP
cd mcp-firecrawl && npm start
```

## Key Configuration Files

- `.env` - Environment variables (API keys, paths, model configs)
- `LM-Studio.json` - LM Studio configuration
- `mcp/shell/pyproject.toml` - Python MCP dependencies
- `mcp-firecrawl/package.json` - Node MCP dependencies

## Development Workflow

### Before Making Changes
1. Verify LM Studio is running: `curl http://localhost:1234/v1/models`
2. Check Python environment: `source mcp/shell/.venv/bin/activate && python --version`
3. Ensure working directory: Always operate from `/Volumes/DATA/ULTRA`

### Testing Requirements
- Run relevant test suite BEFORE claiming task completion
- Verify with actual output, not assumptions
- Document test results in workflow-test/ directory

### MCP Server Security Model
- Shell MCP uses allowlist for commands (ls, cat, echo, pwd by default)
- Path jail prevents access outside project directory
- Network operations disabled with NO_NET=1
- All operations logged to `/Volumes/DATA/ULTRA/logs/shell_mcp.log`

## Model Performance Characteristics
- **Qwen3 30B**: ~200ms response time, handles up to 4000 tokens reliably
- **Devstral Small**: ~4s response time, optimized for code generation
- Context limit safe zone: 4000 tokens (fails at ~8000)

## Project File Structure Requirements
- Models: `/Volumes/DATA/ULTRA/models/lmstudio-community/`
- Tests: `/Volumes/DATA/ULTRA/Tests/`
- Documentation: `/Volumes/DATA/ULTRA/documents/`
- Skills catalog: `/Volumes/DATA/ULTRA/skills-catalog/`
- MCP servers: `/Volumes/DATA/ULTRA/mcp/` and `/Volumes/DATA/ULTRA/mcp-firecrawl/`

## Critical Dependencies
- Python 3.11+ (installed via Homebrew at `/opt/homebrew/bin/python3.11`)
- Node.js v20+
- LM Studio application
- MCP package (v1.13.1+)

## Verification Checklist
When claiming a task is complete, verify:
- [ ] Actual command output confirms success
- [ ] Test scripts pass without errors
- [ ] No assumptions - only verified facts
- [ ] Documentation updated if new functionality added
- [ ] All components remain portable in /Volumes/DATA/ULTRA