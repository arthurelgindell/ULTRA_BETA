#!/usr/bin/env /Volumes/DATA/ULTRA/mcp/shell/.venv/bin/python
"""Shell MCP Server wrapper for LM Studio."""

import sys
import os

# Ensure the module is in the path
sys.path.insert(0, '/Volumes/DATA/ULTRA/mcp/shell')

# Import and run the server
from shell_mcp.server import main
import asyncio

if __name__ == "__main__":
    asyncio.run(main())
