# Production Database Setup Guide

This guide covers setting up the production PostgreSQL database for the Prop.ie Irish property platform on AWS RDS.

## Overview

The application uses:
- **PostgreSQL 15+** on AWS RDS
- **Prisma ORM** for database access
- **Connection pooling** for production scalability
- **SSL encryption** for security
- **Health monitoring** for reliability

## Prerequisites

1. **AWS RDS PostgreSQL Instance**
   - PostgreSQL 15 or higher
   - Multi-AZ deployment recommended
   - Instance class: `db.t3.medium` or higher
   - Storage: 100GB+ with auto-scaling enabled

2. **Security Configuration**
   - VPC security group allowing port 5432
   - Database subnet group properly configured
   - SSL certificates enabled

3. **Environment Variables**
   ```bash
   DATABASE_URL=postgresql://username:password@endpoint:5432/database
   DB_PASSWORD=your-secure-password
   ```

## Production Setup

### 1. Database Configuration

Update `.env.production` with your RDS details:

```env
# Database Configuration (AWS RDS PostgreSQL)
DATABASE_URL=postgresql://prop_admin:${DB_PASSWORD}@your-rds-endpoint.amazonaws.com:5432/prop_ie_production?schema=public&sslmode=require&connection_limit=20&pool_timeout=20

# Connection Settings
DB_CONNECTION_LIMIT=100
DB_CONNECTION_TIMEOUT=10000
DB_IDLE_TIMEOUT=30000
DB_SSL=true
DB_POOL_MIN=5
DB_POOL_MAX=20
```

### 2. Run Production Setup

Execute the automated setup script:

```bash
npm run db:setup:prod
```

This script will:
- ✅ Validate prerequisites
- ✅ Test database connection
- ✅ Generate Prisma client
- ✅ Deploy migrations
- ✅ Seed initial data (optional)
- ✅ Verify setup

### 3. Health Monitoring

Check database health anytime:

```bash
npm run db:health
```

## Database Schema

The platform includes comprehensive models for:

### Core Entities
- **Users** - Buyers, developers, agents, solicitors
- **Properties** - Units, developments, customizations
- **Transactions** - Sales, reservations, payments
- **Documents** - KYC, contracts, compliance files

### Irish Property Features
- **Help-to-Buy (HTB)** integration
- **BER ratings** and energy efficiency
- **Planning permissions** tracking
- **Solicitor workflow** management

### Business Intelligence
- **Analytics** - Property performance, market trends
- **Metrics** - User engagement, conversion rates
- **Audit trails** - GDPR compliance tracking

## Performance Optimization

### Connection Pooling
```typescript
// Optimized for production workload
const config = {
  connectionLimit: 100,
  poolMin: 5,
  poolMax: 20,
  connectionTimeout: 10000,
  idleTimeout: 30000
};
```

### Query Optimization
- **Indexes** on all foreign keys and search fields
- **Materialized views** for complex analytics
- **Query caching** for frequently accessed data

### Monitoring
- CloudWatch metrics integration
- Slow query logging enabled
- Connection pool monitoring

## Security Features

### Data Protection
- **SSL/TLS encryption** in transit
- **Row-level security** for multi-tenant data
- **Audit logging** for compliance

### GDPR Compliance
- **Data retention policies** implemented
- **Personal data tracking** system
- **Right to erasure** automation

### Access Control
- **Role-based permissions** (RBAC)
- **API rate limiting** for protection
- **Query parameterization** to prevent SQL injection

## Backup & Recovery

### Automated Backups
- **Daily snapshots** with 7-day retention
- **Point-in-time recovery** enabled
- **Cross-region replication** for disaster recovery

### Manual Backup
```bash
# Create manual backup
aws rds create-db-snapshot \\
  --db-instance-identifier prop-ie-production \\
  --db-snapshot-identifier prop-ie-manual-$(date +%Y%m%d)
```

## Troubleshooting

### Common Issues

1. **Connection Timeouts**
   ```bash
   # Check security groups
   aws ec2 describe-security-groups --group-ids sg-xxxxxxxxx
   
   # Test connectivity
   telnet your-rds-endpoint.amazonaws.com 5432
   ```

2. **SSL Connection Errors**
   ```bash
   # Download RDS certificate
   wget https://truststore.pki.rds.amazonaws.com/global/global-bundle.pem
   ```

3. **Migration Failures**
   ```bash
   # Reset migration state
   npx prisma migrate reset --force
   npx prisma migrate deploy
   ```

### Health Check Commands

```bash
# Database connection test
npm run db:health

# Performance analysis
npx prisma studio

# Query logging
tail -f /var/log/postgresql/postgresql.log
```

## Scaling Considerations

### Read Replicas
- Configure read replicas for analytics workload
- Route read-only queries to replicas
- Monitor replication lag

### Connection Limits
```sql
-- Check current connections
SELECT count(*) FROM pg_stat_activity;

-- Monitor connection pool
SELECT state, count(*) 
FROM pg_stat_activity 
GROUP BY state;
```

### Performance Tuning
```sql
-- Recommended settings for production
ALTER SYSTEM SET shared_buffers = '1GB';
ALTER SYSTEM SET effective_cache_size = '3GB';
ALTER SYSTEM SET maintenance_work_mem = '256MB';
SELECT pg_reload_conf();
```

## API Endpoints

The database supports these key API operations:

- **Properties API** - `/api/properties/*`
- **Users API** - `/api/users/*`  
- **Transactions API** - `/api/transactions/*`
- **Analytics API** - `/api/analytics/*`
- **Documents API** - `/api/documents/*`

## Support

For database-related issues:
1. Check the health dashboard
2. Review CloudWatch metrics
3. Examine application logs
4. Contact the development team

---

**Note**: This database handles transactions worth billions of euros. Always follow security best practices and test changes in staging first.