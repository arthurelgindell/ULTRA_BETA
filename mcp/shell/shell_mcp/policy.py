"""Policy enforcement for Shell MCP server."""

import os
import shlex
from pathlib import Path
from typing import Optional, Dict, List
from .types import Policy


# Network binaries to block
NETWORK_BINARIES = {
    'curl', 'wget', 'nc', 'netcat', 'nmap', 'scp', 'ssh', 'sftp',
    'rsync', 'telnet', 'ftp', 'ping', 'traceroute', 'dig', 'nslookup',
    'host', 'whois', 'socat', 'lynx', 'w3m', 'links'
}


def get_policy() -> Policy:
    """Load policy from environment variables."""
    return Policy(
        allowlist=os.environ.get('SHELL_ALLOWLIST', 'git,rg,fd,ls,cat,python,node,make,bash,zsh').split(','),
        cwd=os.environ.get('SHELL_CWD', '/Volumes/DATA/ULTRA'),
        timeout_ms=int(os.environ.get('SHELL_TIMEOUT_MS', '10000')),
        max_bytes=int(os.environ.get('SHELL_MAX_BYTES', '2097152')),  # 2 MiB
        no_net=os.environ.get('NO_NET', '1') == '1',
        log_path=os.environ.get('SHELL_LOG', '/Volumes/DATA/ULTRA/logs/shell_mcp.log')
    )


def validate_command(command: str, policy: Policy) -> None:
    """Validate command against policy allowlist and network restrictions."""
    # Parse command to get the binary
    try:
        tokens = shlex.split(command)
        if not tokens:
            raise ValueError("Empty command")
        binary = Path(tokens[0]).name
    except Exception as e:
        raise ValueError(f"Failed to parse command: {e}")
    
    # Check allowlist
    if binary not in policy.allowlist:
        raise PermissionError(f"DENIED: binary '{binary}' not in allow-list")
    
    # Check network binaries if NO_NET is enabled
    if policy.no_net and binary in NETWORK_BINARIES:
        raise PermissionError(f"DENIED: network binary '{binary}' blocked (NO_NET=1)")


def ensure_cwd(cwd: Optional[str], policy: Policy) -> str:
    """Ensure CWD is within jail boundaries."""
    if cwd is None:
        return policy.cwd
    
    # Resolve path and check if it's under jail
    try:
        resolved = Path(cwd).resolve()
        jail_path = Path(policy.cwd).resolve()
        
        if not str(resolved).startswith(str(jail_path)):
            raise PermissionError(f"DENIED: path '{cwd}' escapes jail '{policy.cwd}'")
        
        if not resolved.exists():
            raise FileNotFoundError(f"CWD does not exist: {cwd}")
        
        if not resolved.is_dir():
            raise NotADirectoryError(f"CWD is not a directory: {cwd}")
        
        return str(resolved)
    except Exception as e:
        if isinstance(e, (PermissionError, FileNotFoundError, NotADirectoryError)):
            raise
        raise ValueError(f"Invalid CWD: {e}")


def sandbox_env(env: Optional[Dict[str, str]], policy: Policy) -> Dict[str, str]:
    """Sanitize environment variables for sandboxed execution."""
    # Start with current env
    sandboxed = dict(os.environ)
    
    # Apply user-provided env
    if env:
        sandboxed.update(env)
    
    # Remove network proxy variables if NO_NET
    if policy.no_net:
        for key in ['HTTP_PROXY', 'HTTPS_PROXY', 'ALL_PROXY', 'http_proxy', 
                   'https_proxy', 'all_proxy', 'NO_PROXY', 'no_proxy']:
            sandboxed.pop(key, None)
        sandboxed['NO_NET'] = '1'
    
    return sandboxed


def validate_path(path: str, policy: Policy) -> str:
    """Validate that a filesystem path is within jail."""
    try:
        resolved = Path(path).resolve()
        jail_path = Path(policy.cwd).resolve()
        
        if not str(resolved).startswith(str(jail_path)):
            raise PermissionError(f"DENIED: path '{path}' escapes jail '{policy.cwd}'")
        
        return str(resolved)
    except Exception as e:
        if isinstance(e, PermissionError):
            raise
        raise ValueError(f"Invalid path: {e}")
