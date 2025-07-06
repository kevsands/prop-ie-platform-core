#!/bin/bash

echo "🔍 Checking PropIE Platform Status..."
echo "====================================="

# Check if server is running
if curl -s http://localhost:3000 > /dev/null; then
    echo "✅ Server is running on port 3000"
else
    echo "❌ Server is not responding"
fi

# Check key pages
echo ""
echo "📱 Checking Key Pages:"

pages=(
    "/"
    "/buyer"
    "/developer"
    "/solicitor"
    "/admin"
    "/properties"
    "/developments"
    "/dashboard"
)

for page in "${pages[@]}"; do
    if curl -s http://localhost:3000$page > /dev/null; then
        echo "✅ $page is accessible"
    else
        echo "❌ $page is not accessible"
    fi
done

echo ""
echo "📂 Component Status:"

# Check key components exist
components=(
    "src/components/navigation/EnhancedMainNavigation.tsx"
    "src/components/HomePage.tsx"
    "src/components/layout/Footer/Footer.tsx"
    "src/context/AuthContext.tsx"
    "src/context/TransactionContext.tsx"
    "src/context/UserRoleContext.tsx"
)

for component in "${components[@]}"; do
    if [ -f "$component" ]; then
        echo "✅ $component exists"
    else
        echo "❌ $component missing"
    fi
done

echo ""
echo "====================================="
echo "Platform status check complete!"