# Codex CLI Setup and Configuration for ULTRA

## Overview
Codex CLI v0.31.0 has been installed and configured for the ULTRA project, providing an AI-powered command-line interface for code generation and project management.

## Installation Details

### System Requirements
- macOS (ARM64/Apple Silicon)
- Homebrew package manager
- ChatGPT account (Plus, Pro, Team, Edu, or Enterprise) OR OpenAI API key

### Installed Components
- **Codex CLI**: v0.31.0 (via Homebrew)
- **Location**: `/opt/homebrew/bin/codex`
- **Dependencies**: ripgrep, pcre2 (automatically installed)

## Configuration

### Working Directory
All Codex operations are configured to work from:
```
/Volumes/DATA/ULTRA
```

### Configuration File: `.codexrc`
Located at `/Volumes/DATA/ULTRA/.codexrc`, contains:
- Model settings (GPT-4 Turbo Preview)
- System prompt with ULTRA project context
- File inclusion/exclusion patterns
- Custom aliases for common tasks
- Safety settings (approval mode, backup before modify)
- Integration endpoints for LM Studio and MCP servers

### Environment Variables
Codex respects the following environment variables:
- `OPENAI_API_KEY` - API authentication (optional if using ChatGPT account)
- `SHELL_ALLOWLIST` - Allowed commands for MCP shell
- `SHELL_CWD` - Shell working directory
- `NO_NET` - Network isolation flag
- `ULTRA_HOME` - Project home directory

## Usage

### Starting Codex

#### Quick Start
```bash
cd /Volumes/DATA/ULTRA
codex
```

#### Using Startup Script (Recommended)
```bash
./start-codex.sh
```
This script:
- Sets correct working directory
- Checks LM Studio status
- Displays available aliases
- Shows configuration details

### Authentication

#### Option 1: ChatGPT Account (Recommended)
```bash
codex login
# Follow browser authentication flow
```

#### Option 2: API Key
```bash
export OPENAI_API_KEY='your-api-key-here'
codex
```

### Available Commands

#### Interactive Mode
```bash
codex                    # Start interactive session
codex "your prompt"      # Start with initial prompt
```

#### Non-Interactive Execution
```bash
codex exec "create a Python function to process JSON"
codex e "fix the syntax error in test.js"
```

#### Custom Aliases (Defined in .codexrc)
- `test-all` - Run all LM Studio tests
- `test-mcp` - Test MCP shell server
- `check-lm` - Check LM Studio status
- `build-firecrawl` - Build Firecrawl MCP
- `activate-venv` - Activate Python environment

### Approval Modes
```bash
codex -c approval_mode=required  # Require approval (default)
codex -c approval_mode=auto      # Auto-approve changes
codex -c approval_mode=disabled  # No approval needed
```

### Working with Git
```bash
codex apply    # Apply latest diff as git patch
codex a        # Short form of apply
```

## Integration with ULTRA Components

### LM Studio Integration
Codex is aware of:
- LM Studio API endpoint: `http://localhost:1234`
- Available models: Qwen3 30B, Devstral Small
- Can check status and run tests

### MCP Server Integration
Codex knows about:
- Shell MCP path: `/Volumes/DATA/ULTRA/mcp/shell`
- Firecrawl MCP path: `/Volumes/DATA/ULTRA/mcp-firecrawl`
- Python 3.11 environment location

## Safety Features

1. **Approval Mode**: Set to `required` by default
2. **Backup Before Modify**: Enabled
3. **Safe Mode**: Enabled
4. **Confirm Destructive**: Enabled
5. **Sandboxed Operations**: Via MCP shell server

## Troubleshooting

### Issue: "OPENAI_API_KEY not set"
**Solution**: Either:
- Run `codex login` to use ChatGPT account
- Set API key: `export OPENAI_API_KEY='your-key'`

### Issue: "Command not found: codex"
**Solution**: Install via Homebrew:
```bash
brew install codex
```

### Issue: "LM Studio not detected"
**Solution**: Start LM Studio and ensure it's running on port 1234:
```bash
./start-lm-studio-server.sh
```

## Best Practices

1. **Always work from ULTRA directory**:
   ```bash
   cd /Volumes/DATA/ULTRA
   ```

2. **Use startup script for consistency**:
   ```bash
   ./start-codex.sh
   ```

3. **Review changes before applying**:
   - Keep approval_mode as `required`
   - Use `codex apply` carefully

4. **Leverage custom aliases** for common tasks

5. **Maintain context** by keeping .codexrc updated with project changes

## Files Created

1. **`.codexrc`** - Main configuration file
2. **`start-codex.sh`** - Startup script with environment checks
3. **`documents/CODEX_SETUP.md`** - This documentation

## Verification

To verify Codex is working correctly:
```bash
# Check version
codex --version

# Test with simple prompt
codex exec "echo 'Hello from Codex'"

# Check configuration
cat .codexrc

# Run startup script
./start-codex.sh
```

---
*Setup completed: September 10, 2025*
*Codex CLI v0.31.0 configured for ULTRA project*