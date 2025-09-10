"""Logging utilities for Shell MCP server."""

import json
import time
from pathlib import Path
from typing import Dict, Any


def audit(tool: str, args: Dict[str, Any], result: Dict[str, Any], log_path: str) -> None:
    """Log tool invocation to audit log."""
    try:
        # Create log entry
        entry = {
            'ts': time.time(),
            'tool': tool,
            'args_summary': _summarize_args(args),
            'cwd': args.get('cwd', 'N/A'),
            'exit_code': result.get('exit_code', 0),
            'out_bytes': len(result.get('stdout', '')),
            'err_bytes': len(result.get('stderr', '')),
            'duration_ms': result.get('duration_ms', 0),
            'truncated': result.get('truncated', False)
        }
        
        # Ensure log directory exists
        log_file = Path(log_path)
        log_file.parent.mkdir(parents=True, exist_ok=True)
        
        # Append to log file (JSONL format)
        with open(log_file, 'a') as f:
            f.write(json.dumps(entry) + '\n')
    
    except Exception as e:
        # Logging should not fail the operation
        print(f"Warning: Failed to write audit log: {e}")


def _summarize_args(args: Dict[str, Any]) -> Dict[str, Any]:
    """Create a summary of arguments for logging."""
    summary = {}
    
    for key, value in args.items():
        if key in ['command', 'path', 'pattern']:
            # Include these directly but truncate if too long
            if isinstance(value, str) and len(value) > 200:
                summary[key] = value[:200] + '...'
            else:
                summary[key] = value
        elif key == 'content':
            # Don't log file contents, just size
            if isinstance(value, str):
                summary['content_size'] = len(value)
            else:
                summary[key] = 'non-string'
        elif key == 'stdin':
            # Don't log stdin, just indicate presence
            if value:
                summary['stdin_provided'] = True
        elif key == 'env':
            # Just log env var count
            if isinstance(value, dict):
                summary['env_vars'] = len(value)
        else:
            # Include other args as-is
            summary[key] = value
    
    return summary
