"""Type definitions for Shell MCP server."""

from dataclasses import dataclass
from typing import Optional, List, Dict, Any
from enum import Enum


class FileType(Enum):
    FILE = "file"
    DIRECTORY = "directory"
    SYMLINK = "symlink"
    OTHER = "other"


@dataclass
class ExecResult:
    stdout: str
    stderr: str
    exit_code: int
    duration_ms: int
    truncated: bool


@dataclass
class FileEntry:
    name: str
    type: FileType
    size: int


@dataclass
class FileInfo:
    exists: bool
    type: Optional[FileType]
    size: Optional[int]
    mtime: Optional[float]


@dataclass
class Policy:
    allowlist: List[str]
    cwd: str
    timeout_ms: int
    max_bytes: int
    no_net: bool
    log_path: str
