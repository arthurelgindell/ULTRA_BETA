"""Shell MCP Server - Main entry point."""

import asyncio
import json
import sys
from typing import Optional, Dict, Any, List

from mcp.server import Server, NotificationOptions
from mcp.server.models import InitializationOptions
import mcp.server.stdio
import mcp.types as types

from .policy import get_policy, validate_command, ensure_cwd, sandbox_env, validate_path
from .exec_sandbox import run_exec
from .fs_ops import read_file as read_file_impl, write_file as write_file_impl, list_dir as list_dir_impl, path_info as path_info_impl
from .redaction import redact, redact_dict
from .logging_utils import audit


# Initialize server
server = Server("shell-local")


async def handle_exec(
    command: str,
    cwd: Optional[str] = None,
    timeout_ms: Optional[int] = None,
    env: Optional[Dict[str, str]] = None,
    stdin: Optional[str] = None,
    **kwargs
) -> types.CallToolResult:
    """Execute a shell command with sandboxing and policy enforcement."""
    pol = get_policy()
    
    try:
        # Validate command against policy
        validate_command(command, pol)
        
        # Ensure CWD is within jail
        safe_cwd = ensure_cwd(cwd, pol)
        
        # Sandbox environment variables
        safe_env = sandbox_env(env, pol)
        
        # Execute with limits
        result = run_exec(
            command=command,
            cwd=safe_cwd,
            timeout_ms=timeout_ms or pol.timeout_ms,
            env=safe_env,
            stdin=stdin,
            max_bytes=pol.max_bytes
        )
        
        # Convert to dict for JSON serialization
        result_dict = {
            'stdout': redact(result.stdout),
            'stderr': redact(result.stderr),
            'exit_code': result.exit_code,
            'duration_ms': result.duration_ms,
            'truncated': result.truncated
        }
        
        # Audit log
        audit('exec', {
            'command': command,
            'cwd': safe_cwd,
            'timeout_ms': timeout_ms or pol.timeout_ms,
            'stdin': stdin
        }, result_dict, pol.log_path)
        
        return types.CallToolResult(
            content=[types.TextContent(
                type="text",
                text=json.dumps(result_dict, indent=2)
            )]
        )
    
    except Exception as e:
        error_result = {
            'stdout': '',
            'stderr': str(e),
            'exit_code': -1,
            'duration_ms': 0,
            'truncated': False
        }
        
        audit('exec', {
            'command': command,
            'cwd': cwd,
            'error': str(e)
        }, error_result, pol.log_path)
        
        return types.CallToolResult(
            content=[types.TextContent(
                type="text",
                text=json.dumps(error_result, indent=2)
            )],
            isError=True
        )


async def handle_read_file(
    path: str,
    max_bytes: Optional[int] = None,
    **kwargs
) -> types.CallToolResult:
    """Read a file from the filesystem."""
    pol = get_policy()
    
    try:
        # Validate path is within jail
        safe_path = validate_path(path, pol)
        
        # Read file with limit
        result = read_file_impl(safe_path, max_bytes or pol.max_bytes)
        
        # Redact sensitive content
        result['content'] = redact(result['content'])
        
        # Audit log
        audit('read_file', {
            'path': safe_path,
            'max_bytes': max_bytes
        }, {
            'size': result['size'],
            'truncated': result.get('truncated', False)
        }, pol.log_path)
        
        return types.CallToolResult(
            content=[types.TextContent(
                type="text",
                text=json.dumps(result, indent=2)
            )]
        )
    
    except Exception as e:
        audit('read_file', {
            'path': path,
            'error': str(e)
        }, {}, pol.log_path)
        
        return types.CallToolResult(
            content=[types.TextContent(
                type="text",
                text=json.dumps({'error': str(e)}, indent=2)
            )],
            isError=True
        )


async def handle_write_file(
    path: str,
    content: str,
    mode: str = "w",
    **kwargs
) -> types.CallToolResult:
    """Write content to a file."""
    pol = get_policy()
    
    try:
        # Validate path is within jail
        safe_path = validate_path(path, pol)
        
        # Write file
        result = write_file_impl(safe_path, content, mode)
        
        # Audit log
        audit('write_file', {
            'path': safe_path,
            'mode': mode,
            'content_size': len(content)
        }, result, pol.log_path)
        
        return types.CallToolResult(
            content=[types.TextContent(
                type="text",
                text=json.dumps(result, indent=2)
            )]
        )
    
    except Exception as e:
        audit('write_file', {
            'path': path,
            'error': str(e)
        }, {}, pol.log_path)
        
        return types.CallToolResult(
            content=[types.TextContent(
                type="text",
                text=json.dumps({'error': str(e)}, indent=2)
            )],
            isError=True
        )


async def handle_list_dir(
    path: str,
    pattern: Optional[str] = None,
    **kwargs
) -> types.CallToolResult:
    """List directory contents."""
    pol = get_policy()
    
    try:
        # Validate path is within jail
        safe_path = validate_path(path, pol)
        
        # List directory
        result = list_dir_impl(safe_path, pattern)
        
        # Audit log
        audit('list_dir', {
            'path': safe_path,
            'pattern': pattern
        }, {
            'entries_count': len(result['entries'])
        }, pol.log_path)
        
        return types.CallToolResult(
            content=[types.TextContent(
                type="text",
                text=json.dumps(result, indent=2)
            )]
        )
    
    except Exception as e:
        audit('list_dir', {
            'path': path,
            'error': str(e)
        }, {}, pol.log_path)
        
        return types.CallToolResult(
            content=[types.TextContent(
                type="text",
                text=json.dumps({'error': str(e)}, indent=2)
            )],
            isError=True
        )


async def handle_path_info(
    path: str,
    **kwargs
) -> types.CallToolResult:
    """Get information about a filesystem path."""
    pol = get_policy()
    
    try:
        # Validate path is within jail
        safe_path = validate_path(path, pol)
        
        # Get path info
        info = path_info_impl(safe_path)
        
        result = {
            'exists': info.exists,
            'type': info.type.value if info.type else None,
            'size': info.size,
            'mtime': info.mtime
        }
        
        # Audit log
        audit('path_info', {
            'path': safe_path
        }, result, pol.log_path)
        
        return types.CallToolResult(
            content=[types.TextContent(
                type="text",
                text=json.dumps(result, indent=2)
            )]
        )
    
    except Exception as e:
        audit('path_info', {
            'path': path,
            'error': str(e)
        }, {}, pol.log_path)
        
        return types.CallToolResult(
            content=[types.TextContent(
                type="text",
                text=json.dumps({'error': str(e)}, indent=2)
            )],
            isError=True
        )


# Register handlers
@server.list_tools()
async def handle_list_tools() -> list[types.Tool]:
    """Return the list of available tools."""
    return [
        types.Tool(
            name="exec",
            description="Execute a shell command with sandboxing and policy enforcement",
            inputSchema={
                "type": "object",
                "properties": {
                    "command": {"type": "string", "description": "Shell command to execute"},
                    "cwd": {"type": "string", "description": "Working directory (must be under jail)"},
                    "timeout_ms": {"type": "integer", "description": "Command timeout in milliseconds"},
                    "env": {"type": "object", "description": "Additional environment variables"},
                    "stdin": {"type": "string", "description": "Input to send to the command"}
                },
                "required": ["command"]
            }
        ),
        types.Tool(
            name="read_file",
            description="Read a file from the filesystem",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "File path (must be under jail)"},
                    "max_bytes": {"type": "integer", "description": "Maximum bytes to read"}
                },
                "required": ["path"]
            }
        ),
        types.Tool(
            name="write_file",
            description="Write content to a file",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "File path (must be under jail)"},
                    "content": {"type": "string", "description": "Content to write"},
                    "mode": {"type": "string", "enum": ["w", "a"], "description": "Write mode ('w' for overwrite, 'a' for append)"}
                },
                "required": ["path", "content"]
            }
        ),
        types.Tool(
            name="list_dir",
            description="List directory contents",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Directory path (must be under jail)"},
                    "pattern": {"type": "string", "description": "Optional glob pattern for filtering"}
                },
                "required": ["path"]
            }
        ),
        types.Tool(
            name="path_info",
            description="Get information about a filesystem path",
            inputSchema={
                "type": "object",
                "properties": {
                    "path": {"type": "string", "description": "Path to check (must be under jail)"}
                },
                "required": ["path"]
            }
        )
    ]


@server.call_tool()
async def handle_call_tool(
    name: str,
    arguments: dict
) -> types.CallToolResult:
    """Handle tool execution requests."""
    handlers = {
        "exec": handle_exec,
        "read_file": handle_read_file,
        "write_file": handle_write_file,
        "list_dir": handle_list_dir,
        "path_info": handle_path_info
    }
    
    handler = handlers.get(name)
    if not handler:
        return types.CallToolResult(
            content=[types.TextContent(
                type="text",
                text=f"Unknown tool: {name}"
            )],
            isError=True
        )
    
    return await handler(**arguments)


async def main():
    """Main entry point for the MCP server."""
    # Print startup info to stderr (stdout is for MCP protocol)
    pol = get_policy()
    print(f"Shell MCP Server starting...", file=sys.stderr)
    print(f"  Jail: {pol.cwd}", file=sys.stderr)
    print(f"  Allowlist: {','.join(pol.allowlist)}", file=sys.stderr)
    print(f"  Timeout: {pol.timeout_ms}ms", file=sys.stderr)
    print(f"  Max bytes: {pol.max_bytes}", file=sys.stderr)
    print(f"  Network: {'BLOCKED' if pol.no_net else 'ALLOWED'}", file=sys.stderr)
    print(f"  Log: {pol.log_path}", file=sys.stderr)
    
    # Run the server using stdio
    async with mcp.server.stdio.stdio_server() as (read_stream, write_stream):
        await server.run(
            read_stream,
            write_stream,
            InitializationOptions(
                server_name="shell-local",
                server_version="0.1.0",
                capabilities=server.get_capabilities(
                    notification_options=NotificationOptions(),
                    experimental_capabilities={},
                )
            )
        )


if __name__ == "__main__":
    asyncio.run(main())
