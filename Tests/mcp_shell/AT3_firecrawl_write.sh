#!/bin/bash
# AT-3: Firecrawl write test
# Tests writing files from Firecrawl extraction

set -e

echo "=== AT-3: Firecrawl Write Test ==="
echo "Testing: Write markdown content to /Volumes/DATA/ULTRA/ingest/notes/"

# Create test directory
mkdir -p /Volumes/DATA/ULTRA/ingest/notes

# Test write operation
python3 - <<'EOF'
import json
import subprocess
import sys

test_content = """# Extracted Content from Firecrawl

This content was extracted using Firecrawl and saved via Shell MCP.

## Section 1
Lorem ipsum dolor sit amet, consectetur adipiscing elit.

## Section 2
Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
"""

test_request = {
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
        "name": "write_file",
        "arguments": {
            "path": "/Volumes/DATA/ULTRA/ingest/notes/extracted_content.md",
            "content": test_content,
            "mode": "w"
        }
    },
    "id": 1
}

proc = subprocess.Popen(
    ["python", "-m", "shell_mcp.server"],
    cwd="/Volumes/DATA/ULTRA/mcp/shell",
    env={"SHELL_CWD": "/Volumes/DATA/ULTRA"},
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

proc.stdin.write(json.dumps(test_request) + "\n")
proc.stdin.flush()

try:
    stdout, stderr = proc.communicate(timeout=5)
    if stdout:
        result = json.loads(stdout.split('\n')[0])
        if 'result' in result:
            bytes_written = result['result'].get('bytes_written', 0)
            print(f"✅ PASS: File written successfully")
            print(f"Bytes written: {bytes_written}")
            
            # Verify file exists
            import os
            path = "/Volumes/DATA/ULTRA/ingest/notes/extracted_content.md"
            if os.path.exists(path):
                print(f"✅ File verified at: {path}")
                with open(path, 'r') as f:
                    print(f"Content preview: {f.read(100)}...")
            sys.exit(0)
        else:
            print("❌ FAIL: No result in response")
            sys.exit(1)
    else:
        print("❌ FAIL: No output from server")
        sys.exit(1)
except Exception as e:
    print(f"❌ FAIL: {e}")
    sys.exit(1)
EOF

echo "AT-3 Complete"
