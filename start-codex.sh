#!/bin/bash

# Codex Initialization Script for ULTRA Project
# This script starts Codex with the correct working directory and configuration

echo "╔════════════════════════════════════════════════╗"
echo "║         Starting Codex for ULTRA Project      ║"
echo "╚════════════════════════════════════════════════╝"
echo ""

# Set working directory
WORK_DIR="/Volumes/DATA/ULTRA"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[0;33m'
NC='\033[0m' # No Color

# Check if we're in the correct directory
if [ "$PWD" != "$WORK_DIR" ]; then
    echo -e "${BLUE}📁 Changing to ULTRA directory...${NC}"
    cd "$WORK_DIR" || exit 1
fi

echo -e "${GREEN}✅ Working directory: $PWD${NC}"
echo ""

# Check if Codex is installed
if ! command -v codex &> /dev/null; then
    echo -e "${YELLOW}⚠️ Codex not found. Installing via Homebrew...${NC}"
    brew install codex
fi

# Check if API key is configured
if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "${YELLOW}📝 Note: OPENAI_API_KEY not set${NC}"
    echo "   You can:"
    echo "   1. Use ChatGPT account authentication (recommended)"
    echo "   2. Set API key: export OPENAI_API_KEY='your-key-here'"
    echo ""
fi

# Display configuration
echo -e "${BLUE}🔧 Configuration:${NC}"
echo "   Config file: .codexrc"
echo "   Model: gpt-4-turbo-preview"
echo "   Approval mode: required"
echo "   Working dir: $WORK_DIR"
echo ""

# Show available aliases
echo -e "${BLUE}📋 Available Codex aliases:${NC}"
echo "   test-all         - Run all LM Studio tests"
echo "   test-mcp         - Test MCP shell server"
echo "   check-lm         - Check LM Studio status"
echo "   build-firecrawl  - Build Firecrawl MCP"
echo "   activate-venv    - Activate Python environment"
echo ""

# Check LM Studio status
echo -e "${BLUE}🤖 Checking LM Studio status...${NC}"
if curl -s http://localhost:1234/v1/models > /dev/null 2>&1; then
    echo -e "${GREEN}✅ LM Studio is running${NC}"
else
    echo -e "${YELLOW}⚠️ LM Studio not detected on port 1234${NC}"
    echo "   Start LM Studio to enable local AI features"
fi
echo ""

# Launch Codex with configuration
echo -e "${GREEN}🚀 Launching Codex...${NC}"
echo "════════════════════════════════════════════════"
echo ""

# Start Codex with our configuration
# Codex will use the current directory as working directory
exec codex "$@"