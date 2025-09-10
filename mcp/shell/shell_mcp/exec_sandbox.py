"""Sandboxed execution for Shell MCP server."""

import subprocess
import time
import signal
import os
from typing import Optional, Dict
from .types import ExecResult


def run_exec(
    command: str,
    cwd: str,
    timeout_ms: int,
    env: Dict[str, str],
    stdin: Optional[str] = None,
    max_bytes: int = 2097152
) -> ExecResult:
    """Execute command in sandboxed subprocess with limits."""
    
    start_time = time.time()
    timeout_sec = timeout_ms / 1000.0
    
    try:
        # Create process with new session for better isolation
        # Note: start_new_session already creates a new session, don't use preexec_fn
        process = subprocess.Popen(
            command,
            shell=True,
            cwd=cwd,
            env=env,
            stdin=subprocess.PIPE if stdin else None,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True,
            start_new_session=True if os.name != 'nt' else False
        )
        
        # Send stdin if provided
        if stdin:
            stdin_data = stdin[:max_bytes]  # Cap stdin too
        else:
            stdin_data = None
        
        try:
            # Run with timeout
            stdout, stderr = process.communicate(input=stdin_data, timeout=timeout_sec)
            exit_code = process.returncode
        except subprocess.TimeoutExpired:
            # Kill process group on timeout
            if os.name != 'nt':
                os.killpg(os.getpgid(process.pid), signal.SIGTERM)
            else:
                process.terminate()
            
            # Try to get partial output
            try:
                stdout, stderr = process.communicate(timeout=0.5)
            except:
                stdout, stderr = "", "Process killed due to timeout"
            
            exit_code = -1
    
    except Exception as e:
        stdout = ""
        stderr = f"Execution error: {e}"
        exit_code = -1
    
    # Calculate duration
    duration_ms = int((time.time() - start_time) * 1000)
    
    # Truncate output if needed
    truncated = False
    if len(stdout) > max_bytes:
        stdout = stdout[:max_bytes]
        truncated = True
    if len(stderr) > max_bytes:
        stderr = stderr[:max_bytes]
        truncated = True
    
    return ExecResult(
        stdout=stdout,
        stderr=stderr,
        exit_code=exit_code,
        duration_ms=duration_ms,
        truncated=truncated
    )
