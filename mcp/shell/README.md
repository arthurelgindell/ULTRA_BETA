# Shell MCP Server

A secure Model Context Protocol (MCP) server providing sandboxed shell and filesystem access for LM Studio integration.

## Features

- **Sandboxed Execution**: Commands run in a jailed environment (default: `/Volumes/DATA/ULTRA`)
- **Command Allowlist**: Only approved binaries can execute (git, rg, fd, ls, cat, python, node, make, bash, zsh)
- **Network Blocking**: Network access disabled by default (NO_NET=1)
- **Resource Limits**: Timeout (10s) and output size limits (2MB)
- **Secret Redaction**: Automatic scrubbing of API keys and sensitive data
- **Audit Logging**: All operations logged to `/Volumes/DATA/ULTRA/logs/shell_mcp.log`

## Installation

```bash
cd /Volumes/DATA/ULTRA/mcp/shell
make venv      # Create virtual environment and install dependencies
make install   # Register with LM Studio
```

## Configuration

The server is configured via environment variables in `~/.lmstudio/mcp.json`:

- `SHELL_ALLOWLIST`: Comma-separated list of allowed commands
- `SHELL_CWD`: Jail directory (default: `/Volumes/DATA/ULTRA`)
- `SHELL_TIMEOUT_MS`: Command timeout in milliseconds (default: 10000)
- `SHELL_MAX_BYTES`: Maximum output size in bytes (default: 2097152)
- `NO_NET`: Set to "1" to block network access
- `SHELL_LOG`: Path to audit log file

## Available Tools

### exec
Execute shell commands with policy enforcement.

```json
{
  "command": "ls -la",
  "cwd": "/Volumes/DATA/ULTRA/mcp",
  "timeout_ms": 5000,
  "env": {"CUSTOM_VAR": "value"},
  "stdin": "input data"
}
```

### read_file
Read file contents with size limits.

```json
{
  "path": "/Volumes/DATA/ULTRA/README.md",
  "max_bytes": 10000
}
```

### write_file
Write content to files.

```json
{
  "path": "/Volumes/DATA/ULTRA/output.txt",
  "content": "File content here",
  "mode": "w"
}
```

### list_dir
List directory contents with optional filtering.

```json
{
  "path": "/Volumes/DATA/ULTRA",
  "pattern": "*.md"
}
```

### path_info
Get filesystem path information.

```json
{
  "path": "/Volumes/DATA/ULTRA/mcp"
}
```

## Testing

Run acceptance tests:

```bash
make test
```

Individual tests:
- AT1: Execute commands with sandbox
- AT2: File read operations
- AT3: Firecrawl integration
- AT4: Security guardrails

## Uninstall

```bash
make uninstall  # Remove from LM Studio config
make clean      # Remove virtual environment and logs
```

## Security Notes

1. All paths are restricted to the jail directory
2. Network binaries (curl, wget, etc.) are blocked
3. Command binary must be in the allowlist
4. Secrets are automatically redacted from outputs
5. All operations are logged for audit

## Troubleshooting

Check the audit log for operation details:
```bash
tail -f /Volumes/DATA/ULTRA/logs/shell_mcp.log | jq .
```

Verify server is registered:
```bash
cat ~/.lmstudio/mcp.json | jq .mcpServers."shell-local"
```

Test server directly:
```bash
cd /Volumes/DATA/ULTRA/mcp/shell
.venv/bin/python -m shell_mcp.server
```
