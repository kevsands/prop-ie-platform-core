#!/bin/bash

# Production database migration script with safety checks

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Configuration
ENVIRONMENT=${1:-production}
BACKUP_ENABLED=${BACKUP_ENABLED:-true}
DRY_RUN=${DRY_RUN:-false}
MIGRATION_TIMEOUT=300 # 5 minutes

# Logging
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Pre-flight checks
pre_flight_checks() {
    log "Running pre-flight checks..."
    
    # Check if DATABASE_URL is set
    if [ -z "$DATABASE_URL" ]; then
        error "DATABASE_URL is not set"
        exit 1
    fi
    
    # Check if prisma is installed
    if ! command -v prisma &> /dev/null; then
        error "Prisma CLI not found"
        exit 1
    fi
    
    # Check database connectivity
    log "Checking database connectivity..."
    if ! npx prisma db execute --stdin <<< "SELECT 1;" &> /dev/null; then
        error "Cannot connect to database"
        exit 1
    fi
    
    log "Pre-flight checks passed"
}

# Create database backup
create_backup() {
    if [ "$BACKUP_ENABLED" != "true" ]; then
        warning "Backup is disabled"
        return
    fi
    
    log "Creating database backup..."
    
    BACKUP_FILE="backup-$(date +'%Y%m%d-%H%M%S').sql"
    
    # Extract database connection details
    DB_HOST=$(echo $DATABASE_URL | grep -oP '(?<=@)[^:]+(?=:)')
    DB_PORT=$(echo $DATABASE_URL | grep -oP '(?<=:)[0-9]+(?=/)')
    DB_NAME=$(echo $DATABASE_URL | grep -oP '(?<=/)[^?]+')
    DB_USER=$(echo $DATABASE_URL | grep -oP '(?<=://)[^:]+(?=:)')
    DB_PASS=$(echo $DATABASE_URL | grep -oP '(?<=:)[^@]+(?=@)')
    
    # Create backup
    PGPASSWORD=$DB_PASS pg_dump \
        -h $DB_HOST \
        -p $DB_PORT \
        -U $DB_USER \
        -d $DB_NAME \
        -f $BACKUP_FILE \
        --verbose \
        --no-owner \
        --no-privileges
    
    if [ $? -eq 0 ]; then
        log "Backup created successfully: $BACKUP_FILE"
        
        # Upload to S3 if configured
        if [ -n "$BACKUP_S3_BUCKET" ]; then
            log "Uploading backup to S3..."
            aws s3 cp $BACKUP_FILE s3://$BACKUP_S3_BUCKET/database-backups/$BACKUP_FILE
            rm $BACKUP_FILE
        fi
    else
        error "Backup failed"
        exit 1
    fi
}

# Check for pending migrations
check_pending_migrations() {
    log "Checking for pending migrations..."
    
    PENDING=$(npx prisma migrate status --schema=./prisma/schema.prisma 2>&1)
    
    if echo "$PENDING" | grep -q "Database schema is up to date"; then
        log "No pending migrations"
        return 1
    else
        log "Found pending migrations:"
        echo "$PENDING"
        return 0
    fi
}

# Run migrations
run_migrations() {
    if [ "$DRY_RUN" == "true" ]; then
        log "DRY RUN: Would apply migrations"
        npx prisma migrate diff \
            --from-schema-datasource ./prisma/schema.prisma \
            --to-schema-datamodel ./prisma/schema.prisma \
            --script
        return
    fi
    
    log "Applying migrations..."
    
    # Set timeout
    timeout $MIGRATION_TIMEOUT npx prisma migrate deploy \
        --schema=./prisma/schema.prisma
    
    if [ $? -eq 0 ]; then
        log "Migrations applied successfully"
    else
        error "Migration failed"
        exit 1
    fi
}

# Verify migration
verify_migration() {
    log "Verifying migration..."
    
    # Check schema sync
    npx prisma db pull --schema=./prisma/schema.prisma --force
    
    if npx prisma validate --schema=./prisma/schema.prisma; then
        log "Schema validation passed"
    else
        error "Schema validation failed"
        exit 1
    fi
    
    # Run basic health check
    if npx prisma db execute --stdin <<< "SELECT COUNT(*) FROM _prisma_migrations;" &> /dev/null; then
        log "Database health check passed"
    else
        error "Database health check failed"
        exit 1
    fi
}

# Rollback procedure
rollback() {
    error "Rolling back migration..."
    
    if [ -n "$BACKUP_FILE" ] && [ -f "$BACKUP_FILE" ]; then
        log "Restoring from backup: $BACKUP_FILE"
        
        PGPASSWORD=$DB_PASS psql \
            -h $DB_HOST \
            -p $DB_PORT \
            -U $DB_USER \
            -d $DB_NAME \
            -f $BACKUP_FILE
        
        if [ $? -eq 0 ]; then
            log "Rollback completed successfully"
        else
            error "Rollback failed - manual intervention required!"
            exit 1
        fi
    else
        error "No backup file available for rollback"
        exit 1
    fi
}

# Main execution
main() {
    log "Starting production migration for environment: $ENVIRONMENT"
    
    # Set up error handling
    trap rollback ERR
    
    # Run pre-flight checks
    pre_flight_checks
    
    # Check if migrations are needed
    if ! check_pending_migrations; then
        log "No migrations to apply"
        exit 0
    fi
    
    # Create backup
    create_backup
    
    # Run migrations
    run_migrations
    
    # Verify migration
    verify_migration
    
    log "Migration completed successfully"
    
    # Clean up trap
    trap - ERR
}

# Show usage
if [ "$1" == "--help" ] || [ "$1" == "-h" ]; then
    echo "Usage: $0 [environment]"
    echo ""
    echo "Environment variables:"
    echo "  DATABASE_URL      - Database connection string (required)"
    echo "  BACKUP_ENABLED    - Enable database backup (default: true)"
    echo "  DRY_RUN          - Show what would be done without applying (default: false)"
    echo "  BACKUP_S3_BUCKET - S3 bucket for backup storage (optional)"
    exit 0
fi

# Execute main function
main