#!/bin/bash
# Screen recording script for Prop.ie investor demo
# This script creates a backup recording of the demo in case you need it later

# Check if ffmpeg is installed
if ! command -v ffmpeg &> /dev/null; then
    echo "Error: ffmpeg is not installed. Please install it first."
    echo "On macOS: brew install ffmpeg"
    echo "On Ubuntu: sudo apt-get install ffmpeg"
    exit 1
fi

# Set variables
TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
OUTPUT_DIR="./demo-recordings"
OUTPUT_FILE="$OUTPUT_DIR/prop_ie_demo_$TIMESTAMP.mp4"

# Create output directory if it doesn't exist
mkdir -p "$OUTPUT_DIR"

# Determine operating system and set screen recording command
OS=$(uname)
if [[ "$OS" == "Darwin" ]]; then
    # macOS
    echo "Detected macOS system"
    echo "Starting screen recording to $OUTPUT_FILE"
    echo "Press Control+C to stop recording"
    
    # Record screen with audio using ffmpeg
    ffmpeg -f avfoundation -i "1:0" -c:v h264 -crf 18 -preset ultrafast -r 30 "$OUTPUT_FILE"
elif [[ "$OS" == "Linux" ]]; then
    # Linux
    echo "Detected Linux system"
    echo "Starting screen recording to $OUTPUT_FILE"
    echo "Press Control+C to stop recording"
    
    # Record screen with audio using ffmpeg
    ffmpeg -f x11grab -i :0.0 -f pulse -i default -c:v h264 -crf 18 -preset ultrafast -r 30 "$OUTPUT_FILE"
else
    # Windows or other OS
    echo "Unsupported operating system: $OS"
    echo "Please record your screen manually using your system's screen recording tool"
    exit 1
fi

# After recording is complete
echo "Recording saved to $OUTPUT_FILE"
echo "You can play it with: ffplay $OUTPUT_FILE" 