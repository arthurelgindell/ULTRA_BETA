#!/bin/bash
# AT-1: Execute sandbox test
# Tests command execution with sandboxing

set -e

echo "=== AT-1: Execute Sandbox Test ==="
echo "Testing: List files in /Volumes/DATA/ULTRA limited to *.md"

# Test using Python client
python3 - <<'EOF'
import json
import subprocess
import sys

# Simulate MCP tool call
test_request = {
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
        "name": "exec",
        "arguments": {
            "command": "fd -e md -t f .",
            "cwd": "/Volumes/DATA/ULTRA"
        }
    },
    "id": 1
}

# Run server and send request
proc = subprocess.Popen(
    ["python", "-m", "shell_mcp.server"],
    cwd="/Volumes/DATA/ULTRA/mcp/shell",
    env={"SHELL_ALLOWLIST": "fd", "SHELL_CWD": "/Volumes/DATA/ULTRA"},
    stdin=subprocess.PIPE,
    stdout=subprocess.PIPE,
    stderr=subprocess.PIPE,
    text=True
)

# Send request
proc.stdin.write(json.dumps(test_request) + "\n")
proc.stdin.flush()

# Wait for response (with timeout)
try:
    stdout, stderr = proc.communicate(timeout=5)
    if stdout:
        print("STDOUT:", stdout)
        result = json.loads(stdout.split('\n')[0])
        if 'result' in result:
            print("✅ PASS: Command executed successfully")
            print("Output preview:", result['result'].get('stdout', '')[:200])
            sys.exit(0)
        else:
            print("❌ FAIL: No result in response")
            sys.exit(1)
    else:
        print("❌ FAIL: No output from server")
        print("STDERR:", stderr)
        sys.exit(1)
except subprocess.TimeoutExpired:
    print("❌ FAIL: Server timeout")
    proc.kill()
    sys.exit(1)
except Exception as e:
    print(f"❌ FAIL: {e}")
    sys.exit(1)
EOF

echo "AT-1 Complete"
