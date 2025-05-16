#!/bin/bash

# Create a virtual environment for njsscan
python -m venv njsscan-env

# Activate virtual environment
source njsscan-env/bin/activate

# Install njsscan
pip install njsscan

# Create a wrapper script to run njsscan from project
cat > njsscan-wrapper.sh << 'EOF'
#!/bin/bash
# Activate virtual environment and run njsscan
source "$(dirname "$0")/njsscan-env/bin/activate"
njsscan "$@"
EOF

# Make wrapper script executable
chmod +x njsscan-wrapper.sh

echo "njsscan installed in a virtual environment. Use ./njsscan-wrapper.sh to run it."