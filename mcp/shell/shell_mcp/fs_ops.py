"""Filesystem operations for Shell MCP server."""

import os
import glob
from pathlib import Path
from typing import List, Optional, Dict, Any
from .types import FileEntry, FileInfo, FileType


def read_file(path: str, max_bytes: Optional[int] = None) -> Dict[str, Any]:
    """Read file with size limit."""
    try:
        file_path = Path(path)
        
        if not file_path.exists():
            raise FileNotFoundError(f"File not found: {path}")
        
        if not file_path.is_file():
            raise ValueError(f"Not a file: {path}")
        
        size = file_path.stat().st_size
        
        # Read with limit
        if max_bytes:
            with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read(max_bytes)
        else:
            with open(file_path, 'r', encoding='utf-8', errors='replace') as f:
                content = f.read()
        
        return {
            'content': content,
            'size': size,
            'truncated': max_bytes and size > max_bytes
        }
    
    except Exception as e:
        raise IOError(f"Failed to read file: {e}")


def write_file(path: str, content: str, mode: str = 'w') -> Dict[str, int]:
    """Write file, creating parent directories as needed."""
    try:
        file_path = Path(path)
        
        # Create parent directories
        file_path.parent.mkdir(parents=True, exist_ok=True)
        
        # Write file
        if mode == 'a':
            with open(file_path, 'a', encoding='utf-8') as f:
                bytes_written = f.write(content)
        else:
            with open(file_path, 'w', encoding='utf-8') as f:
                bytes_written = f.write(content)
        
        return {'bytes_written': bytes_written}
    
    except Exception as e:
        raise IOError(f"Failed to write file: {e}")


def list_dir(path: str, pattern: Optional[str] = None) -> Dict[str, List[FileEntry]]:
    """List directory contents with optional pattern matching."""
    try:
        dir_path = Path(path)
        
        if not dir_path.exists():
            raise FileNotFoundError(f"Directory not found: {path}")
        
        if not dir_path.is_dir():
            raise NotADirectoryError(f"Not a directory: {path}")
        
        entries = []
        
        if pattern:
            # Use glob for pattern matching
            for item in dir_path.glob(pattern):
                try:
                    stat = item.stat()
                    if item.is_dir():
                        file_type = FileType.DIRECTORY
                    elif item.is_file():
                        file_type = FileType.FILE
                    elif item.is_symlink():
                        file_type = FileType.SYMLINK
                    else:
                        file_type = FileType.OTHER
                    
                    entries.append(FileEntry(
                        name=item.name,
                        type=file_type,
                        size=stat.st_size
                    ))
                except:
                    continue
        else:
            # List all entries
            for item in dir_path.iterdir():
                try:
                    stat = item.stat()
                    if item.is_dir():
                        file_type = FileType.DIRECTORY
                    elif item.is_file():
                        file_type = FileType.FILE
                    elif item.is_symlink():
                        file_type = FileType.SYMLINK
                    else:
                        file_type = FileType.OTHER
                    
                    entries.append(FileEntry(
                        name=item.name,
                        type=file_type,
                        size=stat.st_size
                    ))
                except:
                    continue
        
        return {
            'entries': [
                {
                    'name': e.name,
                    'type': e.type.value,
                    'size': e.size
                } for e in entries
            ]
        }
    
    except Exception as e:
        raise IOError(f"Failed to list directory: {e}")


def path_info(path: str) -> FileInfo:
    """Get information about a path."""
    try:
        file_path = Path(path)
        
        if not file_path.exists():
            return FileInfo(
                exists=False,
                type=None,
                size=None,
                mtime=None
            )
        
        stat = file_path.stat()
        
        if file_path.is_dir():
            file_type = FileType.DIRECTORY
        elif file_path.is_file():
            file_type = FileType.FILE
        elif file_path.is_symlink():
            file_type = FileType.SYMLINK
        else:
            file_type = FileType.OTHER
        
        return FileInfo(
            exists=True,
            type=file_type,
            size=stat.st_size,
            mtime=stat.st_mtime
        )
    
    except Exception as e:
        raise IOError(f"Failed to get path info: {e}")
