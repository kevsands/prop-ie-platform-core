#!/bin/bash
# Quick script to update .env with secure values

echo "=== Updating .env with secure secrets ==="

# Backup current .env
cp .env .env.backup.$(date +%s)
echo "✓ Backed up current .env"

# Generate new secrets
NEXTAUTH_SECRET=$(openssl rand -base64 64 | tr -d '\n' | tr -d '=' | tr -d '+' | tr -d '/' | cut -c1-64)
JWT_SECRET=$(openssl rand -base64 64 | tr -d '\n' | tr -d '=' | tr -d '+' | tr -d '/' | cut -c1-64)
JWT_REFRESH_SECRET=$(openssl rand -base64 64 | tr -d '\n' | tr -d '=' | tr -d '+' | tr -d '/' | cut -c1-64)
CSRF_SECRET=$(openssl rand -base64 32 | tr -d '\n' | tr -d '=' | tr -d '+' | tr -d '/' | cut -c1-32)
ENCRYPTION_KEY=$(openssl rand -base64 32 | tr -d '\n' | tr -d '=' | tr -d '+' | tr -d '/' | cut -c1-32)

# Update .env file
sed -i.bak "s/NEXTAUTH_SECRET=.*/NEXTAUTH_SECRET=$NEXTAUTH_SECRET/" .env
sed -i.bak "s/JWT_SECRET=.*/JWT_SECRET=$JWT_SECRET/" .env
sed -i.bak "s/JWT_REFRESH_SECRET=.*/JWT_REFRESH_SECRET=$JWT_REFRESH_SECRET/" .env
sed -i.bak "s/CSRF_SECRET=.*/CSRF_SECRET=$CSRF_SECRET/" .env
sed -i.bak "s/ENCRYPTION_KEY=.*/ENCRYPTION_KEY=$ENCRYPTION_KEY/" .env

echo "✓ Generated new secure secrets"

# Remove exposed Anthropic API key
sed -i.bak 's/ANTHROPIC_API_KEY=sk-[^"]*/ANTHROPIC_API_KEY=/' .env
echo "✓ Removed exposed API key (please add new one from environment)"

# Clean up shell scripts
echo ""
echo "=== Cleaning shell scripts ==="
files=("claude-test.sh" "claude-focused-security.sh" "claude-review-auth.sh" "claude-code-quickstart.sh")

for file in "${files[@]}"; do
  if [ -f "$file" ]; then
    cp "$file" "$file.backup"
    sed -i 's/ANTHROPIC_API_KEY="sk-[^"]*"/ANTHROPIC_API_KEY="$ANTHROPIC_API_KEY"/' "$file"
    echo "✓ Cleaned $file"
  fi
done

echo ""
echo "=== Security Update Complete ==="
echo ""
echo "IMPORTANT NEXT STEPS:"
echo "1. Get a new Anthropic API key from https://console.anthropic.com"
echo "2. Set it as an environment variable: export ANTHROPIC_API_KEY='your-new-key'"
echo "3. Run: npm audit fix"
echo "4. Commit these changes immediately"
echo ""
echo "Old files backed up with .backup extension"