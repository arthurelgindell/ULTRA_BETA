#!/bin/bash
# AT-4: Guardrails test
# Tests security restrictions (network blocking)

set -e

echo "=== AT-4: Guardrails Test ==="
echo "Testing: Attempt to run curl (should be DENIED)"

# Test network command blocking
python3 - <<'EOF'
import json
import subprocess
import sys

test_request = {
    "jsonrpc": "2.0",
    "method": "tools/call",
    "params": {
        "name": "exec",
        "arguments": {
            "command": "curl https://example.com",
            "cwd": "/Volumes/DATA/ULTRA"
        }
    },
    "id": 1
}

proc = subprocess.Popen(
    ["python", "-m", "shell_mcp.server"],
    cwd="/Volumes/DATA/ULTRA/mcp/shell",
    env={
        "SHELL_ALLOWLIST": "git,rg,fd,ls,cat,python,node,make,bash,zsh",
        "SHELL_CWD": "/Volumes/DATA/ULTRA",
        "NO_NET": "1"
    },
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
        if 'error' in result:
            error_msg = str(result.get('error', ''))
            if 'DENIED' in error_msg or 'not in allow-list' in error_msg:
                print("✅ PASS: Network command was properly DENIED")
                print(f"Error message: {error_msg}")
                sys.exit(0)
            else:
                print(f"❌ FAIL: Unexpected error: {error_msg}")
                sys.exit(1)
        else:
            print("❌ FAIL: Command should have been blocked")
            sys.exit(1)
    else:
        # Check stderr for policy denial
        if stderr and ('DENIED' in stderr or 'not in allow-list' in stderr):
            print("✅ PASS: Network command was properly DENIED")
            print(f"Stderr: {stderr}")
            sys.exit(0)
        else:
            print("❌ FAIL: No proper denial message")
            sys.exit(1)
except Exception as e:
    print(f"Test error: {e}")
    # Still pass if the error indicates denial
    if 'DENIED' in str(e):
        print("✅ PASS: Command was denied as expected")
        sys.exit(0)
    sys.exit(1)
EOF

echo ""
echo "Testing: Path escape attempt (should be DENIED)"

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
            "path": "/etc/passwd"
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
        if 'error' in result:
            error_msg = str(result.get('error', ''))
            if 'DENIED' in error_msg or 'escapes jail' in error_msg:
                print("✅ PASS: Path escape was properly DENIED")
                print(f"Error message: {error_msg}")
                sys.exit(0)
            else:
                print(f"❌ FAIL: Unexpected error: {error_msg}")
                sys.exit(1)
        else:
            print("❌ FAIL: Path escape should have been blocked")
            sys.exit(1)
    else:
        if stderr and ('DENIED' in stderr or 'escapes jail' in stderr):
            print("✅ PASS: Path escape was properly DENIED")
            sys.exit(0)
        else:
            print("❌ FAIL: No proper denial message")
            sys.exit(1)
except Exception as e:
    if 'DENIED' in str(e) or 'escapes jail' in str(e):
        print("✅ PASS: Path escape was denied as expected")
        sys.exit(0)
    print(f"❌ FAIL: {e}")
    sys.exit(1)
EOF

echo "AT-4 Complete"
