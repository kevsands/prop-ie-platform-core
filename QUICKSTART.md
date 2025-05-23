# PropPlatform Quick Start Guide

## 🚀 Getting Started in 5 Minutes

### Prerequisites
- Node.js 18+ installed
- PostgreSQL database
- Git

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/your-org/prop-platform.git
cd prop-platform

# Install dependencies
npm install
```

### 2. Environment Setup

Create a `.env.local` file:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/propplatform"

# Authentication
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"

# AWS S3 (optional for file uploads)
AWS_ACCESS_KEY_ID="your-access-key"
AWS_SECRET_ACCESS_KEY="your-secret-key"
AWS_REGION="eu-west-1"
AWS_S3_BUCKET="propplatform-uploads"
```

### 3. Database Setup

```bash
# Create database
createdb propplatform

# Run migrations
npx prisma migrate dev

# Seed the database
npx prisma db seed
```

### 4. Start Development Server

```bash
npm run dev
```

Your platform is now running at [http://localhost:3000](http://localhost:3000)!

## 🔑 Default Login Credentials

After seeding, you can login with:

```
Admin:
Email: admin@propplatform.com
Password: admin123

Estate Agent:
Email: agent@propplatform.com
Password: agent123

Solicitor:
Email: solicitor@propplatform.com
Password: solicitor123

Architect:
Email: architect@propplatform.com
Password: architect123
```

## 🗺️ Platform Navigation

### Main Areas

1. **Landing Page**: [http://localhost:3000](http://localhost:3000)
   - Public homepage
   - Platform overview
   - Login/Register

2. **Platform Dashboard**: [http://localhost:3000/platform](http://localhost:3000/platform)
   - Unified dashboard
   - Real-time metrics
   - Quick access to all modules

3. **Estate Agency**: [http://localhost:3000/agent/dashboard](http://localhost:3000/agent/dashboard)
   - CRM system
   - Property management
   - Lead tracking
   - Viewing scheduler

4. **Legal Services**: [http://localhost:3000/solicitor/dashboard](http://localhost:3000/solicitor/dashboard)
   - Case management
   - Document handling
   - Conveyancing workflow
   - Compliance tracking

5. **Architecture Hub**: [http://localhost:3000/architect/dashboard](http://localhost:3000/architect/dashboard)
   - Project management
   - Drawing version control
   - 3D model viewer
   - Collaboration tools

## 📁 Project Structure

```
prop-platform/
├── src/
│   ├── app/              # Next.js app router pages
│   ├── components/       # React components
│   ├── lib/             # Utilities and services
│   ├── hooks/           # Custom React hooks
│   └── types/           # TypeScript definitions
├── prisma/
│   ├── schema.prisma    # Database schema
│   └── seed.ts         # Database seeder
├── public/             # Static assets
└── docs/              # Documentation
```

## 🛠️ Common Tasks

### Add a New Property

```typescript
// Using the API
const response = await fetch('/api/properties', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`
  },
  body: JSON.stringify({
    title: 'Modern 3-Bed House',
    address: '123 Main Street',
    price: 450000,
    type: 'HOUSE',
    bedrooms: 3,
    bathrooms: 2
  })
});
```

### Create a Legal Case

```typescript
// Using the data service
import { dataService } from '@/lib/services/dataService';

const newCase = await dataService.conveyancing.createCase({
  propertyId: 'prop_123',
  clientId: 'client_456',
  type: 'PURCHASE',
  purchasePrice: 450000
});
```

### Schedule a Viewing

```typescript
// Using the CRM service
import { crmService } from '@/lib/crm';

const viewing = await crmService.scheduleViewing({
  propertyId: 'prop_123',
  clientId: 'client_456',
  dateTime: new Date('2024-01-25 14:00'),
  notes: 'First-time buyer'
});
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run E2E tests
npm run test:e2e
```

## 📱 Mobile Development

The platform is mobile-responsive. For native apps:

```bash
# Future React Native apps
cd mobile
npm install
npm run ios      # iOS
npm run android  # Android
```

## 🚢 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

### Docker

```bash
# Build image
docker build -t propplatform .

# Run container
docker run -p 3000:3000 propplatform
```

## 🐛 Troubleshooting

### Database Connection Issues

```bash
# Check if PostgreSQL is running
pg_isready

# Verify connection string
psql $DATABASE_URL
```

### Build Errors

```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

### Authentication Issues

1. Verify `NEXTAUTH_SECRET` is set
2. Check `NEXTAUTH_URL` matches your domain
3. Clear browser cookies and retry

## 📚 Resources

- [Full Documentation](./docs/README.md)
- [API Reference](./API_DOCUMENTATION.md)
- [Architecture Guide](./SYSTEM_ARCHITECTURE.md)
- [Contributing Guide](./CONTRIBUTING.md)

## 🤝 Getting Help

- GitHub Issues: [Report bugs](https://github.com/your-org/prop-platform/issues)
- Discord: [Join our community](https://discord.gg/propplatform)
- Email: support@propplatform.com

## ✅ Next Steps

1. Explore the platform dashboards
2. Create some test properties
3. Try the conveyancing workflow
4. Test the collaboration tools
5. Review the API documentation
6. Customize for your needs

Welcome to PropPlatform! 🎉