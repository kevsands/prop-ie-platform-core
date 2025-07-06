#!/bin/bash
# dev-start.sh

# Make the script exit if any command fails
set -e

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
  echo "❌ Docker is not running. Please start Docker first."
  exit 1
fi

# Function to check if a directory exists and create it if it doesn't
ensure_directory() {
  if [ ! -d "$1" ]; then
    echo "📂 Creating directory: $1"
    mkdir -p "$1"
  fi
}

# Create necessary directories
ensure_directory "mock-server"
ensure_directory "localstack-data"

# Check if mock-server/package.json exists, and create basic one if it doesn't
if [ ! -f "mock-server/package.json" ]; then
  echo "📄 Creating basic package.json for mock server..."
  cat > mock-server/package.json << EOF
{
  "name": "prop-ie-mock-server",
  "version": "1.0.0",
  "description": "Mock API server for PropIE development",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "start:mock-server": "node index.js"
  },
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "body-parser": "^1.20.2",
    "json-server": "^0.17.3"
  }
}
EOF
fi

# Check if mock-server/index.js exists, and create basic one if it doesn't
if [ ! -f "mock-server/index.js" ]; then
  echo "📄 Creating basic index.js for mock server..."
  cat > mock-server/index.js << EOF
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
const PORT = process.env.PORT || 4000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Mock data
const developments = [
  { id: '1', name: 'Ballymakenny View', status: 'Active', location: 'Drogheda' },
  { id: '2', name: 'Fitzgerald Gardens', status: 'Active', location: 'Dublin' },
  { id: '3', name: 'Riverside Manor', status: 'Coming Soon', location: 'Cork' }
];

const properties = [
  { id: '101', developmentId: '1', type: 'House', bedrooms: 3, price: 350000 },
  { id: '102', developmentId: '1', type: 'Apartment', bedrooms: 2, price: 275000 },
  { id: '201', developmentId: '2', type: 'House', bedrooms: 4, price: 450000 },
  { id: '301', developmentId: '3', type: 'Apartment', bedrooms: 1, price: 200000 }
];

// Routes
app.get('/api/developments', (req, res) => {
  res.json(developments);
});

app.get('/api/developments/:id', (req, res) => {
  const development = developments.find(d => d.id === req.params.id);
  if (development) {
    res.json(development);
  } else {
    res.status(404).json({ error: 'Development not found' });
  }
});

app.get('/api/properties', (req, res) => {
  const { developmentId } = req.query;
  if (developmentId) {
    res.json(properties.filter(p => p.developmentId === developmentId));
  } else {
    res.json(properties);
  }
});

app.get('/api/properties/:id', (req, res) => {
  const property = properties.find(p => p.id === req.params.id);
  if (property) {
    res.json(property);
  } else {
    res.status(404).json({ error: 'Property not found' });
  }
});

// Auth mock endpoints
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (email && password) {
    res.json({
      token: 'mock-jwt-token',
      user: {
        id: '123',
        email,
        name: 'Test User',
        role: 'buyer'
      }
    });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

app.post('/api/auth/register', (req, res) => {
  const { email, password, name } = req.body;
  if (email && password && name) {
    res.status(201).json({
      id: '123',
      email,
      name,
      role: 'buyer'
    });
  } else {
    res.status(400).json({ error: 'Missing required fields' });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(\`Mock API server running on port \${PORT}\`);
});
EOF
fi

# Install dependencies for mock server
echo "📦 Installing mock server dependencies..."
cd mock-server && npm install && cd ..

# Build and start containers
echo "🚀 Starting development environment..."
docker-compose up -d

echo "⏳ Waiting for services to start..."
sleep 5

# Check if all services are running
if [ "$(docker-compose ps -q app)" ] && [ "$(docker ps -q --no-trunc | grep $(docker-compose ps -q app))" ]; then
  echo "✅ App service is running"
else
  echo "❌ App service failed to start. Check the logs with 'docker-compose logs app'"
  exit 1
fi

if [ "$(docker-compose ps -q api-mock)" ] && [ "$(docker ps -q --no-trunc | grep $(docker-compose ps -q api-mock))" ]; then
  echo "✅ API Mock service is running"
else
  echo "❌ API Mock service failed to start. Check the logs with 'docker-compose logs api-mock'"
  exit 1
fi

if [ "$(docker-compose ps -q localstack)" ] && [ "$(docker ps -q --no-trunc | grep $(docker-compose ps -q localstack))" ]; then
  echo "✅ LocalStack service is running"
else
  echo "❌ LocalStack service failed to start. Check the logs with 'docker-compose logs localstack'"
  exit 1
fi

# Initialize LocalStack with mock AWS resources
echo "☁️ Setting up AWS mocks in LocalStack..."
docker-compose exec localstack awslocal s3 mb s3://prop-ie-app-assets
docker-compose exec localstack awslocal dynamodb create-table \
  --table-name Properties \
  --attribute-definitions AttributeName=id,AttributeType=S \
  --key-schema AttributeName=id,KeyType=HASH \
  --provisioned-throughput ReadCapacityUnits=5,WriteCapacityUnits=5

echo "✨ Development environment started successfully!"
echo "📱 App is running at: http://localhost:3000"
echo "🔌 API Mock is running at: http://localhost:4000"
echo "☁️ LocalStack is running at: http://localhost:4566"

# Open browser
if command -v open > /dev/null; then
  echo "🌐 Opening application in browser..."
  open http://localhost:3000
elif command -v xdg-open > /dev/null; then
  echo "🌐 Opening application in browser..."
  xdg-open http://localhost:3000
elif command -v start > /dev/null; then
  echo "🌐 Opening application in browser..."
  start http://localhost:3000
else
  echo "🌐 Please open your browser and navigate to: http://localhost:3000"
fi

echo "🛠 To view logs, run: docker-compose logs -f"
echo "🛑 To stop the environment, run: docker-compose down"