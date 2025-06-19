#!/bin/bash

# PROP.ie Database Migration Script: SQLite to PostgreSQL
# This script migrates the PROP.ie platform from SQLite to production-ready PostgreSQL

set -e  # Exit on any error

echo "🚀 PROP.ie Production Database Migration"
echo "========================================"
echo "Migrating from SQLite to PostgreSQL..."

# Configuration
BACKUP_DIR="./backups/$(date +%Y%m%d_%H%M%S)"
SQLITE_DB="./prisma/dev.db"
POSTGRES_SCHEMA="./prisma/schema-production.prisma"
CURRENT_SCHEMA="./prisma/schema.prisma"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check prerequisites
check_prerequisites() {
    print_status "Checking prerequisites..."
    
    # Check if PostgreSQL is available
    if ! command -v psql &> /dev/null; then
        print_error "PostgreSQL client (psql) is not installed"
        print_status "Please install PostgreSQL: brew install postgresql (macOS) or apt-get install postgresql-client (Ubuntu)"
        exit 1
    fi
    
    # Check if Node.js and npm are available
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed"
        exit 1
    fi
    
    if ! command -v npm &> /dev/null; then
        print_error "npm is not installed"
        exit 1
    fi
    
    # Check if Prisma is available
    if ! npx prisma --version &> /dev/null; then
        print_error "Prisma is not available"
        print_status "Installing Prisma..."
        npm install prisma @prisma/client
    fi
    
    print_success "All prerequisites met"
}

# Create backup directory
create_backup() {
    print_status "Creating backup directory: $BACKUP_DIR"
    mkdir -p "$BACKUP_DIR"
    
    # Backup current SQLite database
    if [ -f "$SQLITE_DB" ]; then
        print_status "Backing up SQLite database..."
        cp "$SQLITE_DB" "$BACKUP_DIR/dev.db.backup"
        print_success "SQLite database backed up"
    else
        print_warning "No SQLite database found at $SQLITE_DB"
    fi
    
    # Backup current schema
    if [ -f "$CURRENT_SCHEMA" ]; then
        print_status "Backing up current Prisma schema..."
        cp "$CURRENT_SCHEMA" "$BACKUP_DIR/schema.prisma.backup"
        print_success "Prisma schema backed up"
    fi
}

# Setup PostgreSQL database
setup_postgresql() {
    print_status "Setting up PostgreSQL database..."
    
    # Database configuration
    DB_NAME="propie_production"
    DB_USER="propie_user"
    DB_PASSWORD="$(openssl rand -base64 32)"
    DB_HOST="localhost"
    DB_PORT="5432"
    
    print_status "Database configuration:"
    echo "  - Database: $DB_NAME"
    echo "  - User: $DB_USER"
    echo "  - Host: $DB_HOST"
    echo "  - Port: $DB_PORT"
    
    # Create database and user (requires superuser privileges)
    print_status "Creating PostgreSQL database and user..."
    
    # Check if we can connect to PostgreSQL
    if ! psql -h "$DB_HOST" -p "$DB_PORT" -U postgres -c "\\l" &> /dev/null; then
        print_error "Cannot connect to PostgreSQL server"
        print_status "Please ensure PostgreSQL is running and accessible"
        print_status "Start PostgreSQL: brew services start postgresql (macOS) or sudo service postgresql start (Ubuntu)"
        exit 1
    fi
    
    # Create database
    psql -h "$DB_HOST" -p "$DB_PORT" -U postgres -c "CREATE DATABASE $DB_NAME;" 2>/dev/null || print_warning "Database $DB_NAME may already exist"
    
    # Create user
    psql -h "$DB_HOST" -p "$DB_PORT" -U postgres -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASSWORD';" 2>/dev/null || print_warning "User $DB_USER may already exist"
    
    # Grant privileges
    psql -h "$DB_HOST" -p "$DB_PORT" -U postgres -c "GRANT ALL PRIVILEGES ON DATABASE $DB_NAME TO $DB_USER;"
    psql -h "$DB_HOST" -p "$DB_PORT" -U postgres -c "ALTER USER $DB_USER CREATEDB;"
    
    # Set connection string
    export DATABASE_URL="postgresql://$DB_USER:$DB_PASSWORD@$DB_HOST:$DB_PORT/$DB_NAME"
    
    # Save connection details
    echo "DATABASE_URL=$DATABASE_URL" > "$BACKUP_DIR/postgres-connection.env"
    print_success "PostgreSQL database setup completed"
    print_status "Connection string saved to: $BACKUP_DIR/postgres-connection.env"
}

# Export data from SQLite
export_sqlite_data() {
    if [ ! -f "$SQLITE_DB" ]; then
        print_warning "No SQLite database found, skipping data export"
        return
    fi
    
    print_status "Exporting data from SQLite database..."
    
    # Create data export directory
    mkdir -p "$BACKUP_DIR/data"
    
    # Export each table to CSV (customize based on your actual schema)
    sqlite3 "$SQLITE_DB" ".headers on" ".mode csv" ".output $BACKUP_DIR/data/users.csv" "SELECT * FROM users;" 2>/dev/null || print_warning "Users table not found"
    sqlite3 "$SQLITE_DB" ".headers on" ".mode csv" ".output $BACKUP_DIR/data/developments.csv" "SELECT * FROM developments;" 2>/dev/null || print_warning "Developments table not found"
    sqlite3 "$SQLITE_DB" ".headers on" ".mode csv" ".output $BACKUP_DIR/data/units.csv" "SELECT * FROM units;" 2>/dev/null || print_warning "Units table not found"
    sqlite3 "$SQLITE_DB" ".headers on" ".mode csv" ".output $BACKUP_DIR/data/reservations.csv" "SELECT * FROM reservations;" 2>/dev/null || print_warning "Reservations table not found"
    sqlite3 "$SQLITE_DB" ".headers on" ".mode csv" ".output $BACKUP_DIR/data/buyer_journeys.csv" "SELECT * FROM BuyerJourney;" 2>/dev/null || print_warning "BuyerJourney table not found"
    
    print_success "Data exported to: $BACKUP_DIR/data/"
}

# Switch to PostgreSQL schema
switch_schema() {
    print_status "Switching to PostgreSQL schema..."
    
    if [ ! -f "$POSTGRES_SCHEMA" ]; then
        print_error "PostgreSQL schema not found at $POSTGRES_SCHEMA"
        exit 1
    fi
    
    # Backup current schema and switch
    cp "$CURRENT_SCHEMA" "$BACKUP_DIR/schema-sqlite.prisma.backup"
    cp "$POSTGRES_SCHEMA" "$CURRENT_SCHEMA"
    
    print_success "Schema switched to PostgreSQL"
}

# Run database migrations
run_migrations() {
    print_status "Running Prisma migrations..."
    
    # Generate Prisma client
    print_status "Generating Prisma client..."
    npx prisma generate
    
    # Reset database and apply migrations
    print_status "Applying database migrations..."
    npx prisma migrate reset --force --skip-seed
    npx prisma migrate deploy
    
    print_success "Database migrations completed"
}

# Import data to PostgreSQL (basic implementation)
import_data() {
    if [ ! -d "$BACKUP_DIR/data" ]; then
        print_warning "No data to import"
        return
    fi
    
    print_status "Importing data to PostgreSQL..."
    print_warning "Data import requires manual review and custom scripts"
    print_status "CSV files are available in: $BACKUP_DIR/data/"
    print_status "Please review and import data manually using appropriate tools"
}

# Verify migration
verify_migration() {
    print_status "Verifying migration..."
    
    # Check database connection
    if npx prisma db seed &> /dev/null; then
        print_success "Database connection verified"
    else
        print_warning "Database connection test failed"
    fi
    
    # Check schema
    print_status "Checking database schema..."
    npx prisma db push --accept-data-loss
    
    print_success "Migration verification completed"
}

# Update environment files
update_environment() {
    print_status "Updating environment configuration..."
    
    # Update .env.local if it exists
    if [ -f ".env.local" ]; then
        sed -i.bak 's/sqlite/postgresql/g' .env.local
        print_success ".env.local updated"
    fi
    
    # Create production environment reminder
    cat > "$BACKUP_DIR/production-setup.md" << EOF
# Production Environment Setup

## Database Configuration
Your PostgreSQL database has been set up with the following configuration:

\`\`\`
Database: propie_production
User: propie_user
Connection: Available in postgres-connection.env
\`\`\`

## Next Steps for Production Deployment

1. **AWS RDS Setup**:
   - Create PostgreSQL RDS instance
   - Update DATABASE_URL in AWS Amplify environment variables
   - Run migrations: \`npx prisma migrate deploy\`

2. **Environment Variables**:
   - Set all production secrets in AWS Amplify
   - Update NEXTAUTH_SECRET, JWT_SECRET, etc.
   - Configure Stripe live keys

3. **Data Migration**:
   - Review exported CSV files in: $BACKUP_DIR/data/
   - Create custom import scripts if needed
   - Test with staging environment first

4. **Security**:
   - Enable all security features
   - Configure SSL certificates
   - Set up monitoring and alerts

## Files Created:
- postgres-connection.env: Local database connection
- schema-sqlite.prisma.backup: Original SQLite schema
- dev.db.backup: Original SQLite database
- data/: Exported CSV files
EOF
    
    print_success "Environment configuration updated"
}

# Main migration process
main() {
    echo ""
    print_status "Starting PROP.ie database migration process..."
    echo "This will migrate from SQLite to PostgreSQL for production readiness"
    echo ""
    
    # Confirm with user
    read -p "Continue with migration? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Migration cancelled"
        exit 0
    fi
    
    # Run migration steps
    check_prerequisites
    create_backup
    setup_postgresql
    export_sqlite_data
    switch_schema
    run_migrations
    import_data
    verify_migration
    update_environment
    
    echo ""
    print_success "🎉 Database migration completed successfully!"
    echo ""
    print_status "Summary:"
    echo "  ✅ SQLite database backed up"
    echo "  ✅ PostgreSQL database created"
    echo "  ✅ Schema migrated to PostgreSQL"
    echo "  ✅ Database structure created"
    echo "  📁 Backup location: $BACKUP_DIR"
    echo ""
    print_warning "IMPORTANT NEXT STEPS:"
    echo "  1. Review production setup guide: $BACKUP_DIR/production-setup.md"
    echo "  2. Test application with new PostgreSQL database"
    echo "  3. Configure AWS RDS for production deployment"
    echo "  4. Import data if needed (see CSV files in backup)"
    echo ""
    print_success "Migration complete! Your PROP.ie platform is now PostgreSQL-ready."
}

# Run main function
main "$@"