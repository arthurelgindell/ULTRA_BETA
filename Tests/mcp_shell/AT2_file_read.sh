#!/bin/bash
# AT-2: File read test
# Tests file reading with size limits

set -e

echo "=== AT-2: File Read Test ==="
echo "Testing: Read /Volumes/DATA/ULTRA/ULTRA.md and show first 40 lines"

# Create test file if it doesn't exist
if [ ! -f "/Volumes/DATA/ULTRA/ULTRA.md" ]; then
    echo "Creating test file..."
    cat > /Volumes/DATA/ULTRA/ULTRA.md <<'TESTFILE'
# ULTRA Project

This is a test file for the Shell MCP server.

## Features
- Line 1
- Line 2
- Line 3
- Line 4
- Line 5
- Line 6
- Line 7
- Line 8
- Line 9
- Line 10
- Line 11
- Line 12
- Line 13
- Line 14
- Line 15
- Line 16
- Line 17
- Line 18
- Line 19
- Line 20
- Line 21
- Line 22
- Line 23
- Line 24
- Line 25
- Line 26
- Line 27
- Line 28
- Line 29
- Line 30
- Line 31
- Line 32
- Line 33
- Line 34
- Line 35
- Line 36
- Line 37
- Line 38
- Line 39
- Line 40
- Line 41 (should be truncated)
- Line 42 (should be truncated)
TESTFILE
fi

# Test file read
python3 - <<'EOF'
import json
import subprocess
import sys

test_request = {
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
        "name": "read_file",
        "arguments": {
            "path": "/Volumes/DATA/ULTRA/ULTRA.md",
            "max_bytes": 1000
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
            content = result['result'].get('content', '')
            size = result['result'].get('size', 0)
            print(f"✅ PASS: File read successfully")
            print(f"File size: {size} bytes")
            print(f"Content preview (first 200 chars):")
            print(content[:200])
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

echo "AT-2 Complete"
