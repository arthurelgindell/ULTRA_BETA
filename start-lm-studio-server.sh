#!/bin/bash

# LM Studio Server Startup Helper
# This script helps you start the LM Studio API server

echo "========================================="
echo "LM Studio Server Startup Guide"
echo "========================================="
echo ""
echo "To start the LM Studio API server:"
echo ""
echo "1. Open LM Studio application"
echo "2. Go to the 'Local Server' tab (icon looks like <>)"
echo "3. Select your model from the dropdown:"
echo "   - Devstral-Small-2507-MLX-4bit"
echo "   - Qwen3-30B-A3B-Instruct-2507-MLX-4bit"
echo "4. Click 'Start Server'"
echo "5. Verify it's running on http://localhost:1234"
echo ""
echo "========================================="
echo "Checking current status..."
echo ""

# Check if server is running
if curl -s http://localhost:1234/v1/models > /dev/null 2>&1; then
    echo "✅ LM Studio server is running!"
    echo ""
    echo "Available models:"
    curl -s http://localhost:1234/v1/models | python3 -c "import sys, json; data = json.load(sys.stdin); [print(f'  - {model[\"id\"]}') for model in data.get('data', [])]"
else
    echo "❌ LM Studio server is not running on port 1234"
    echo "   Please follow the steps above to start it."
fi

echo ""
echo "========================================="