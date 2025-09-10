#!/usr/bin/env python3
"""Uninstall Shell MCP server from LM Studio configuration."""

import json
import os
import pathlib

def uninstall():
    conf = pathlib.Path(os.path.expanduser("~")) / ".lmstudio" / "mcp.json"
    
    try:
        data = json.loads(conf.read_text())
    except FileNotFoundError:
        print("No mcp.json found")
        return
    
    servers = data.get("mcpServers", {})
    
    if "shell-local" in servers:
        # Only remove shell-local, preserve all other MCP servers
        del servers["shell-local"]
        data["mcpServers"] = servers
        conf.write_text(json.dumps(data, indent=2))
        print("✅ Removed shell-local from mcp.json")
        print(f"   Preserved {len(servers)} other MCP server(s)")
    else:
        print("No shell-local entry found in mcp.json")

if __name__ == "__main__":
    uninstall()
