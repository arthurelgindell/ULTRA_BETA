#!/bin/bash

# Launch script for opcode GUI application
# This script launches the opcode app built from source

APP_PATH="/Volumes/DATA/ULTRA/opcode/src-tauri/target/release/bundle/macos/opcode.app"

# Check if the app exists
if [ ! -d "$APP_PATH" ]; then
    echo "Error: opcode.app not found at $APP_PATH"
    echo "Please run the build process first:"
    echo "  cd /Volumes/DATA/ULTRA/opcode && bun run tauri build"
    exit 1
fi

echo "Launching opcode..."
open "$APP_PATH"
