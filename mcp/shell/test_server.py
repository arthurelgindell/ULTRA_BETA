#!/usr/bin/env python3
"""Test Shell MCP server functionality."""

import json
import os
import sys
import time
from pathlib import Path

# Add parent to path
sys.path.insert(0, '/Volumes/DATA/ULTRA/mcp/shell')

# Set up environment
os.environ['SHELL_ALLOWLIST'] = 'ls,cat,echo,pwd'
os.environ['SHELL_CWD'] = '/Volumes/DATA/ULTRA'
os.environ['SHELL_LOG'] = '/Volumes/DATA/ULTRA/logs/shell_mcp.log'
os.environ['NO_NET'] = '1'

def test_exec():
    """Test exec tool."""
    print("Testing exec tool...")
    from shell_mcp.policy import get_policy, validate_command, ensure_cwd, sandbox_env
    from shell_mcp.exec_sandbox import run_exec
    
    pol = get_policy()
    
    # Test ls command
    validate_command("ls -la", pol)
    cwd = ensure_cwd("/Volumes/DATA/ULTRA", pol)
    env = sandbox_env(None, pol)
    
    result = run_exec(
        command="ls -la | head -5",
        cwd=cwd,
        timeout_ms=5000,
        env=env,
        stdin=None,
        max_bytes=pol.max_bytes
    )
    
    if result.exit_code == 0 and result.stdout:
        print(f"✅ exec test PASSED")
        print(f"   Output preview: {result.stdout[:100]}...")
        return True
    else:
        print(f"❌ exec test FAILED: exit={result.exit_code}")
        return False

def test_read_file():
    """Test read_file tool."""
    print("\nTesting read_file tool...")
    from shell_mcp.fs_ops import read_file
    
    # Create test file
    test_file = Path("/Volumes/DATA/ULTRA/test_read.txt")
    test_file.write_text("Test content for Shell MCP\nLine 2\nLine 3")
    
    try:
        result = read_file(str(test_file), max_bytes=100)
        if result['content'] == test_file.read_text():
            print(f"✅ read_file test PASSED")
            print(f"   File size: {result['size']} bytes")
            return True
        else:
            print(f"❌ read_file test FAILED: content mismatch")
            return False
    finally:
        test_file.unlink()

def test_write_file():
    """Test write_file tool."""
    print("\nTesting write_file tool...")
    from shell_mcp.fs_ops import write_file
    
    test_file = Path("/Volumes/DATA/ULTRA/test_write.txt")
    content = "Written by Shell MCP\nMultiline content"
    
    try:
        result = write_file(str(test_file), content)
        if test_file.exists() and test_file.read_text() == content:
            print(f"✅ write_file test PASSED")
            print(f"   Bytes written: {result['bytes_written']}")
            return True
        else:
            print(f"❌ write_file test FAILED")
            return False
    finally:
        if test_file.exists():
            test_file.unlink()

def test_list_dir():
    """Test list_dir tool."""
    print("\nTesting list_dir tool...")
    from shell_mcp.fs_ops import list_dir
    
    result = list_dir("/Volumes/DATA/ULTRA", pattern="*.md")
    
    if 'entries' in result and isinstance(result['entries'], list):
        print(f"✅ list_dir test PASSED")
        print(f"   Found {len(result['entries'])} .md files")
        return True
    else:
        print(f"❌ list_dir test FAILED")
        return False

def test_guardrails():
    """Test security guardrails."""
    print("\nTesting security guardrails...")
    from shell_mcp.policy import validate_command, validate_path, get_policy
    
    pol = get_policy()
    
    # Test command blocking
    try:
        validate_command("curl https://example.com", pol)
        print(f"❌ Guardrails test FAILED: curl should be blocked")
        return False
    except PermissionError as e:
        if "not in allow-list" in str(e):
            print(f"✅ Command blocking works: {e}")
        else:
            print(f"❌ Wrong error: {e}")
            return False
    
    # Test path escape
    try:
        validate_path("/etc/passwd", pol)
        print(f"❌ Guardrails test FAILED: /etc/passwd should be blocked")
        return False
    except PermissionError as e:
        if "escapes jail" in str(e):
            print(f"✅ Path jail works: {e}")
            return True
        else:
            print(f"❌ Wrong error: {e}")
            return False

if __name__ == "__main__":
    print("=== Shell MCP Server Tests ===\n")
    
    tests = [
        test_exec,
        test_read_file,
        test_write_file,
        test_list_dir,
        test_guardrails
    ]
    
    passed = 0
    failed = 0
    
    for test in tests:
        try:
            if test():
                passed += 1
            else:
                failed += 1
        except Exception as e:
            print(f"❌ {test.__name__} raised exception: {e}")
            failed += 1
    
    print(f"\n=== Results ===")
    print(f"✅ Passed: {passed}")
    print(f"❌ Failed: {failed}")
    
    # Check log file
    log_path = Path("/Volumes/DATA/ULTRA/logs/shell_mcp.log")
    if log_path.exists():
        lines = log_path.read_text().strip().split('\n')
        print(f"📝 Audit log entries: {len(lines)}")
    
    sys.exit(0 if failed == 0 else 1)
