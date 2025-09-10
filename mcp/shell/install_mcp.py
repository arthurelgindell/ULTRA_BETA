#!/usr/bin/env python3
"""Install Shell MCP server to LM Studio configuration."""

import json
import os
import pathlib

def install():
    home = os.path.expanduser("~")
    conf = pathlib.Path(home) / ".lmstudio" / "mcp.json"
    conf.parent.mkdir(parents=True, exist_ok=True)
    
    try:
        data = json.loads(conf.read_text())
    except FileNotFoundError:
        data = {}
    
    servers = data.get("mcpServers", {})
    
    # Get absolute path to venv
    venv_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '.venv'))
    
    servers["shell-local"] = {
        "command": f"{venv_path}/bin/python",
        "args": ["-m", "shell_mcp.server"],
        "env": {
            "SHELL_ALLOWLIST": "git,rg,fd,ls,cat,python,node,make,bash,zsh",
            "SHELL_CWD": "/Volumes/DATA/ULTRA",
            "SHELL_TIMEOUT_MS": "10000",
            "SHELL_MAX_BYTES": "2097152",
            "NO_NET": "1",
            "SHELL_LOG": "/Volumes/DATA/ULTRA/logs/shell_mcp.log"
        }
    }
    
    data["mcpServers"] = servers
    conf.write_text(json.dumps(data, indent=2))
    print(f"✅ Installed shell-local MCP server")
    print(f"   Config: {conf}")
    print(f"   Python: {venv_path}/bin/python")

if __name__ == "__main__":
    install()
