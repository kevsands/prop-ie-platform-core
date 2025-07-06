#!/bin/bash

# Script to generate placeholder images for all missing paths
# For prop-ie-aws-app Next.js migration
# Usage: ./create-placeholder-images.sh

# Set base directory for public folder
PUBLIC_DIR="$(pwd)/public"
PLACEHOLDER_SERVICE="https://placehold.co"
PLACEHOLDER_TEXT="Placeholder"
DEFAULT_COLOR="3498db"  # Blue background
TEXT_COLOR="ffffff"     # White text
WIDTH=800
HEIGHT=600
SMALL_WIDTH=400
SMALL_HEIGHT=300

# ANSI color codes for terminal output
GREEN="\033[0;32m"
RED="\033[0;31m"
YELLOW="\033[0;33m"
BLUE="\033[0;34m"
RESET="\033[0m"

# Log functions with colored output
log_info() {
  echo -e "${BLUE}[INFO]${RESET} $1"
}

log_success() {
  echo -e "${GREEN}[SUCCESS]${RESET} $1"
}

log_warning() {
  echo -e "${YELLOW}[WARNING]${RESET} $1"
}

log_error() {
  echo -e "${RED}[ERROR]${RESET} $1"
}

# Create directory if it doesn't exist
create_dir() {
  if [ ! -d "$1" ]; then
    mkdir -p "$1"
    if [ $? -eq 0 ]; then
      log_success "Created directory: $1"
    else
      log_error "Failed to create directory: $1"
      return 1
    fi
  else
    log_info "Directory already exists: $1"
  fi
  return 0
}

# Download placeholder image
download_placeholder() {
  local dest_path="$1"
  local img_text="$2"
  local width="${3:-$WIDTH}"
  local height="${4:-$HEIGHT}"
  local color="${5:-$DEFAULT_COLOR}"
  
  # Check if file already exists
  if [ -f "$dest_path" ]; then
    log_info "Image already exists: $dest_path"
    return 0
  fi
  
  # Create the directory for the image if it doesn't exist
  local dir_path=$(dirname "$dest_path")
  create_dir "$dir_path" || return 1
  
  # Format the image text (replace spaces with + for URL)
  local formatted_text=$(echo "$img_text" | sed 's/ /+/g')
  
  # Download the placeholder image
  log_info "Downloading: $dest_path"
  curl -s "$PLACEHOLDER_SERVICE/${width}x${height}/${color}/${TEXT_COLOR}?text=${formatted_text}" -o "$dest_path"
  
  if [ $? -eq 0 ] && [ -f "$dest_path" ]; then
    log_success "Created placeholder image: $dest_path"
    return 0
  else
    log_error "Failed to download placeholder image: $dest_path"
    return 1
  fi
}

# Check if curl is installed
check_dependencies() {
  if ! command -v curl &> /dev/null; then
    log_error "curl is not installed. Please install it first."
    exit 1
  fi
  log_success "Dependencies checked successfully"
}

# Check if running from project root
check_project_root() {
  if [ ! -d "$PUBLIC_DIR" ]; then
    log_error "Public directory not found. Make sure you're running this script from the project root."
    exit 1
  fi
  log_success "Running from project root directory"
}

# Main function to create all required placeholder images
create_all_placeholders() {
  local success_count=0
  local fail_count=0
  local total_count=0
  
  log_info "Starting placeholder image generation..."
  
  # Development hero images
  log_info "Creating development hero images..."
  
  # Fitzgerlad Gardens hero
  if download_placeholder "$PUBLIC_DIR/images/fitzgerald-gardens/hero.jpg" "FitzGerald Gardens Hero"; then
    ((success_count++))
  else
    ((fail_count++))
  fi
  ((total_count++))
  
  # Riverside Manor hero
  if download_placeholder "$PUBLIC_DIR/images/riverside-manor/hero.jpg" "Riverside Manor Hero"; then
    ((success_count++))
  else
    ((fail_count++))
  fi
  ((total_count++))
  
  # Ballymakenny View hero
  if download_placeholder "$PUBLIC_DIR/images/ballymakenny-view/hero.jpg" "Ballymakenny View Hero"; then
    ((success_count++))
  else
    ((fail_count++))
  fi
  ((total_count++))
  
  # Development image sets
  log_info "Creating development image sets..."
  
  # Development sets array (to avoid repetition)
  local developments=("fitzgerald-gardens" "riverside-manor" "ballymakenny-view")
  local image_types=("main" "1" "2" "3" "site-plan")
  
  for dev in "${developments[@]}"; do
    for img_type in "${image_types[@]}"; do
      local display_name=$(echo "$dev" | sed 's/-/ /g' | sed 's/\b\(.\)/\u\1/g')
      local img_text="$display_name $img_type"
      
      if [ "$img_type" == "site-plan" ]; then
        # Site plans have different dimensions
        if download_placeholder "$PUBLIC_DIR/images/developments/$dev/$img_type.jpg" "$img_text" 1000 800; then
          ((success_count++))
        else
          ((fail_count++))
        fi
      else
        if download_placeholder "$PUBLIC_DIR/images/developments/$dev/$img_type.jpg" "$img_text"; then
          ((success_count++))
        else
          ((fail_count++))
        fi
      fi
      ((total_count++))
    done
  done
  
  # Property images
  log_info "Creating property images..."
  
  local property_images=("10-maple-ave-1" "10-maple-ave-2" "10-maple-ave-3")
  
  for img in "${property_images[@]}"; do
    local img_text=$(echo "$img" | sed 's/-/ /g')
    if download_placeholder "$PUBLIC_DIR/images/properties/$img.jpg" "$img_text"; then
      ((success_count++))
    else
      ((fail_count++))
    fi
    ((total_count++))
  done
  
  # Floor plans
  log_info "Creating floor plan images..."
  
  local floor_plans=("type-a" "type-b" "type-c")
  
  for plan in "${floor_plans[@]}"; do
    local img_text="Floor Plan $(echo "$plan" | sed 's/type-//g' | tr '[:lower:]' '[:upper:]')"
    # Floor plans are typically wider
    if download_placeholder "$PUBLIC_DIR/images/floor-plans/$plan.jpg" "$img_text" 1200 900; then
      ((success_count++))
    else
      ((fail_count++))
    fi
    ((total_count++))
  done
  
  # Summary
  echo ""
  log_info "Placeholder image generation completed"
  log_success "$success_count out of $total_count images created successfully"
  
  if [ $fail_count -gt 0 ]; then
    log_warning "$fail_count images failed to generate"
  fi
}

# Main execution
echo "===== Next.js Migration Placeholder Image Generator ====="
echo "This script will create placeholder images for all missing paths."
echo "Images will be created in: $PUBLIC_DIR"
echo ""

# Run checks
check_dependencies
check_project_root

# Create all placeholder images
create_all_placeholders

echo ""
echo "===== Script Completed ====="

# Make the script executable
chmod +x "$0"