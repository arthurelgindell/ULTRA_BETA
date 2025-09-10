"""Redaction utilities for Shell MCP server."""

import re
from typing import List


# Patterns for common secrets
SECRET_PATTERNS = [
    # AWS keys
    (r'AKIA[0-9A-Z]{16}', '[AWS_ACCESS_KEY_REDACTED]'),
    (r'aws_secret_access_key\s*=\s*[^\s]+', 'aws_secret_access_key=[REDACTED]'),
    
    # API keys (generic)
    (r'[Aa][Pp][Ii][-_]?[Kk][Ee][Yy]\s*[:=]\s*["\']?[A-Za-z0-9\-_]{20,}["\']?', 'API_KEY=[REDACTED]'),
    (r'[Ss][Ee][Cc][Rr][Ee][Tt][-_]?[Kk][Ee][Yy]\s*[:=]\s*["\']?[A-Za-z0-9\-_]{20,}["\']?', 'SECRET_KEY=[REDACTED]'),
    
    # OpenAI
    (r'sk-[A-Za-z0-9]{48}', '[OPENAI_KEY_REDACTED]'),
    
    # GitHub tokens
    (r'ghp_[A-Za-z0-9]{36}', '[GITHUB_TOKEN_REDACTED]'),
    (r'gho_[A-Za-z0-9]{36}', '[GITHUB_OAUTH_REDACTED]'),
    
    # Generic tokens
    (r'[Tt][Oo][Kk][Ee][Nn]\s*[:=]\s*["\']?[A-Za-z0-9\-_\.]{20,}["\']?', 'TOKEN=[REDACTED]'),
    
    # Bearer tokens
    (r'[Bb]earer\s+[A-Za-z0-9\-_\.]+', 'Bearer [REDACTED]'),
    
    # Private keys (multiline)
    (r'-----BEGIN [A-Z ]+ PRIVATE KEY-----[\s\S]+?-----END [A-Z ]+ PRIVATE KEY-----', 
     '[PRIVATE_KEY_REDACTED]'),
    
    # Database URLs with passwords
    (r'(postgres|mysql|mongodb|redis)://[^:]+:[^@]+@[^\s]+', '[DATABASE_URL_REDACTED]'),
    
    # Email passwords
    (r'[Pp][Aa][Ss][Ss][Ww][Oo][Rr][Dd]\s*[:=]\s*["\']?[^\s"\']+["\']?', 'PASSWORD=[REDACTED]'),
]


def redact(text: str) -> str:
    """Redact sensitive information from text."""
    if not text:
        return text
    
    result = text
    for pattern, replacement in SECRET_PATTERNS:
        result = re.sub(pattern, replacement, result)
    
    return result


def redact_dict(data: dict) -> dict:
    """Redact sensitive information from dictionary values."""
    result = {}
    for key, value in data.items():
        if isinstance(value, str):
            result[key] = redact(value)
        elif isinstance(value, dict):
            result[key] = redact_dict(value)
        elif isinstance(value, list):
            result[key] = [redact(item) if isinstance(item, str) else item for item in value]
        else:
            result[key] = value
    
    return result
