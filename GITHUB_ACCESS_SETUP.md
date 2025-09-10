# GitHub ULTRA Project Access Setup Guide
## For Identical Mac Studio Configuration

This guide provides complete instructions for accessing the GitHub ULTRA repository on a new Mac Studio identical to the current development environment.

## Prerequisites

- Mac Studio with macOS 15.0+ (Darwin 25.0.0)
- Administrative access
- Internet connection

---

## Step 1: SSH Key Generation & GitHub Authentication

### 1.1 Generate SSH Key Pair

```bash
# Generate Ed25519 SSH key (recommended for GitHub)
ssh-keygen -t ed25519 -C "arthurdell@github-ultra-access" -f ~/.ssh/github_ultra

# Set appropriate permissions
chmod 600 ~/.ssh/github_ultra
chmod 644 ~/.ssh/github_ultra.pub
```

### 1.2 Add SSH Key to SSH Agent

```bash
# Start SSH agent
eval "$(ssh-agent -s)"

# Add SSH key to agent with keychain integration
ssh-add --apple-use-keychain ~/.ssh/github_ultra
```

### 1.3 Configure SSH for GitHub

Create SSH config file:

```bash
# Create/edit SSH config
nano ~/.ssh/config
```

Add this configuration:

```
Host github.com-ultra
    HostName github.com
    User git
    IdentityFile ~/.ssh/github_ultra
    AddKeysToAgent yes
    UseKeychain yes
    IdentitiesOnly yes
```

### 1.4 Add SSH Key to GitHub Account

```bash
# Display public key for copying
cat ~/.ssh/github_ultra.pub
```

**Manual Steps:**
1. Copy the entire output from above command
2. Go to GitHub.com → Settings → SSH and GPG keys
3. Click "New SSH key"
4. Title: "Mac Studio ULTRA - [DATE]"
5. Paste the key content
6. Click "Add SSH key"

---

## Step 2: Repository Clone & Setup

### 2.1 Create Project Directory

```bash
# Create the exact directory structure
sudo mkdir -p /Volumes/DATA
sudo chown -R $(whoami):admin /Volumes/DATA
cd /Volumes/DATA
```

### 2.2 Clone ULTRA Repository

```bash
# Clone using the SSH config alias
git clone git@github.com-ultra:arthurelgindell/ULTRA.git
cd ULTRA

# Verify remote configuration
git remote -v
```

**Expected Output:**
```
origin-deploy    git@github.com-ultra:arthurelgindell/ULTRA.git (fetch)
origin-deploy    git@github.com-ultra:arthurelgindell/ULTRA.git (push)
```

---

## Step 3: Environment Setup

### 3.1 Install Core Dependencies

```bash
# Install Homebrew if not present
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"

# Install essential tools
brew install python@3.11 node@20 git ripgrep fd-find

# Install Claude Code CLI
npm install -g @anthropic-ai/claude-code
```

### 3.2 Python Environment Setup

```bash
cd /Volumes/DATA/ULTRA

# Create main Python virtual environment
python3.11 -m venv .venv
source .venv/bin/activate

# Install Python dependencies (if requirements.txt exists)
pip install --upgrade pip
# pip install -r requirements.txt  # Uncomment when available
```

### 3.3 Node.js Environment Setup

```bash
# Install Node.js dependencies
npm install

# Verify Node.js setup
node --version  # Should be v20.x.x
npm --version
```

---

## Step 4: LM Studio Installation & Configuration

### 4.1 Download & Install LM Studio

1. Visit: https://lmstudio.ai/
2. Download LM Studio for macOS
3. Install to Applications folder
4. Launch and complete initial setup

### 4.2 LM Studio CLI Setup

```bash
# Install LM Studio CLI
npx lmstudio install-cli

# Verify installation
lms --version

# Bootstrap CLI to PATH (if needed)
lms bootstrap
```

---

## Step 5: MCP Server Setup

### 5.1 MCP Shell Server Installation

```bash
cd /Volumes/DATA/ULTRA/mcp/shell

# Create virtual environment and install dependencies
make venv

# Install MCP server to LM Studio
make install

# Verify installation
cat ~/.lmstudio/mcp.json | jq .mcpServers."shell-local"
```

### 5.2 MCP Firecrawl Server Setup

```bash
cd /Volumes/DATA/ULTRA/mcp-firecrawl

# Install TypeScript dependencies
npm install

# Build the server
npm run build

# Verify build
ls -la dist/
```

### 5.3 Create Required Directories

```bash
# Create logs directory for MCP server
mkdir -p /Volumes/DATA/ULTRA/logs

# Create skills catalog directories if missing
mkdir -p /Volumes/DATA/ULTRA/skills-catalog/{json,md}
```

---

## Step 6: Environment Variables & Configuration

### 6.1 Create Environment File

```bash
cd /Volumes/DATA/ULTRA

# Copy example environment file
cp .env.example .env

# Edit environment file with your specific values
nano .env
```

**Required Environment Variables:**
```bash
# API Keys (obtain from respective services)
FIRECRAWL_API_KEY=fc-your-api-key-here
OPENAI_API_KEY=your-openai-key-here

# Paths
SKILLS_PATH=/Volumes/DATA/ULTRA/skills-catalog
SHELL_LOG=/Volumes/DATA/ULTRA/logs/shell_mcp.log

# MCP Configuration
SHELL_ALLOWLIST=git,rg,fd,ls,cat,python,node,make,bash,zsh
SHELL_CWD=/Volumes/DATA/ULTRA
NO_NET=1
```

---

## Step 7: Verification & Testing

### 7.1 Test SSH Access

```bash
# Test GitHub SSH connection
ssh -T git@github.com-ultra
```

**Expected Output:**
```
Hi arthurelgindell! You've successfully authenticated, but GitHub does not provide shell access.
```

### 7.2 Test Git Operations

```bash
cd /Volumes/DATA/ULTRA

# Test fetch
git fetch origin-deploy

# Check status
git status

# Verify recent commits
git log --oneline -5
```

### 7.3 Test MCP Shell Server

```bash
cd /Volumes/DATA/ULTRA/mcp/shell

# Run server tests
make test

# Check logs
tail -f /Volumes/DATA/ULTRA/logs/shell_mcp.log | jq .
```

### 7.4 Test LM Studio Integration

```bash
# Start LM Studio server
lms server start

# In another terminal, check status
lms server status

# List available models
lms ls
```

---

## Step 8: Final Configuration

### 8.1 Configure Claude Code

```bash
# Initialize Claude Code in project
cd /Volumes/DATA/ULTRA
claude configure

# Create/update .claude directory if needed
mkdir -p .claude
```

### 8.2 Set File Permissions

```bash
# Ensure proper permissions for executable files
chmod +x /Volumes/DATA/ULTRA/mcp/shell/run_server.py
chmod +x /Volumes/DATA/ULTRA/mcp/shell/install_mcp.py
chmod +x /Volumes/DATA/ULTRA/extract-lm-studio.mjs
```

---

## Troubleshooting

### SSH Issues

```bash
# Debug SSH connection
ssh -v git@github.com-ultra

# Check SSH agent
ssh-add -l

# Re-add key if needed
ssh-add --apple-use-keychain ~/.ssh/github_ultra
```

### Python Environment Issues

```bash
# Recreate virtual environment
cd /Volumes/DATA/ULTRA
rm -rf .venv
python3.11 -m venv .venv
source .venv/bin/activate
```

### MCP Server Issues

```bash
# Check MCP server logs
tail -f /Volumes/DATA/ULTRA/logs/shell_mcp.log

# Reinstall MCP server
cd /Volumes/DATA/ULTRA/mcp/shell
make uninstall
make clean
make venv
make install
```

---

## Security Notes

1. **SSH Key Management**: Keep the private key (`~/.ssh/github_ultra`) secure
2. **Environment Variables**: Never commit `.env` file to repository
3. **MCP Security**: The shell server runs in a sandboxed environment with restricted commands
4. **API Keys**: Store securely and rotate regularly

---

## Success Indicators

✅ SSH authentication to GitHub works  
✅ Repository cloning successful  
✅ All dependencies installed  
✅ MCP servers running without errors  
✅ LM Studio CLI operational  
✅ Environment variables configured  
✅ Tests pass successfully  

---

## Support

For issues with this setup:
1. Check the troubleshooting section above
2. Verify all prerequisites are met
3. Ensure identical Mac Studio configuration
4. Review error logs in `/Volumes/DATA/ULTRA/logs/`

**Project Repository:** `git@github.com-ultra:arthurelgindell/ULTRA.git`  
**Setup Date:** $(date)  
**macOS Version:** Darwin 25.0.0  
**Architecture:** Mac Studio