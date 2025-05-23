#!/bin/bash

# Deployment rollback script with automated recovery

set -e

# Configuration
CLUSTER=${ECS_CLUSTER:-prop-ie-cluster}
SERVICE=${ECS_SERVICE:-prop-ie-service}
REGION=${AWS_REGION:-eu-west-1}
MAX_ROLLBACK_VERSIONS=5

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Logging functions
log() {
    echo -e "${GREEN}[$(date +'%Y-%m-%d %H:%M:%S')]${NC} $1"
}

error() {
    echo -e "${RED}[$(date +'%Y-%m-%d %H:%M:%S')] ERROR:${NC} $1" >&2
}

warning() {
    echo -e "${YELLOW}[$(date +'%Y-%m-%d %H:%M:%S')] WARNING:${NC} $1"
}

# Get deployment history
get_deployment_history() {
    log "Fetching deployment history..."
    
    aws ecs describe-services \
        --cluster $CLUSTER \
        --services $SERVICE \
        --region $REGION \
        --query 'services[0].deployments[*].[taskDefinition,status,createdAt]' \
        --output table
}

# Get previous stable version
get_previous_version() {
    aws ecs describe-services \
        --cluster $CLUSTER \
        --services $SERVICE \
        --region $REGION \
        --query 'services[0].deployments[?status==`PRIMARY`].taskDefinition' \
        --output text | head -n 1
}

# Perform rollback
rollback_to_version() {
    local TASK_DEFINITION=$1
    
    if [ -z "$TASK_DEFINITION" ]; then
        error "No task definition specified"
        exit 1
    fi
    
    log "Rolling back to task definition: $TASK_DEFINITION"
    
    # Update service with previous version
    aws ecs update-service \
        --cluster $CLUSTER \
        --service $SERVICE \
        --task-definition $TASK_DEFINITION \
        --force-new-deployment \
        --region $REGION
    
    # Wait for rollback to complete
    log "Waiting for rollback to complete..."
    aws ecs wait services-stable \
        --cluster $CLUSTER \
        --services $SERVICE \
        --region $REGION
    
    log "Rollback completed successfully"
}

# Verify rollback
verify_rollback() {
    log "Verifying rollback..."
    
    # Check service health
    RUNNING_COUNT=$(aws ecs describe-services \
        --cluster $CLUSTER \
        --services $SERVICE \
        --region $REGION \
        --query 'services[0].runningCount' \
        --output text)
    
    DESIRED_COUNT=$(aws ecs describe-services \
        --cluster $CLUSTER \
        --services $SERVICE \
        --region $REGION \
        --query 'services[0].desiredCount' \
        --output text)
    
    if [ "$RUNNING_COUNT" -eq "$DESIRED_COUNT" ]; then
        log "Service is healthy: $RUNNING_COUNT/$DESIRED_COUNT tasks running"
    else
        warning "Service may be unhealthy: $RUNNING_COUNT/$DESIRED_COUNT tasks running"
    fi
    
    # Check application health
    if [ -n "$HEALTH_CHECK_URL" ]; then
        log "Checking application health..."
        if curl -f -s $HEALTH_CHECK_URL > /dev/null; then
            log "Application health check passed"
        else
            warning "Application health check failed"
        fi
    fi
}

# Create rollback report
create_rollback_report() {
    local REASON=$1
    local FROM_VERSION=$2
    local TO_VERSION=$3
    
    REPORT_FILE="rollback-$(date +'%Y%m%d-%H%M%S').json"
    
    cat > $REPORT_FILE <<EOF
{
  "timestamp": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "reason": "$REASON",
  "from_version": "$FROM_VERSION",
  "to_version": "$TO_VERSION",
  "cluster": "$CLUSTER",
  "service": "$SERVICE",
  "region": "$REGION",
  "initiated_by": "$USER",
  "status": "completed"
}
EOF
    
    log "Rollback report created: $REPORT_FILE"
    
    # Upload to S3 if configured
    if [ -n "$ROLLBACK_REPORTS_BUCKET" ]; then
        aws s3 cp $REPORT_FILE s3://$ROLLBACK_REPORTS_BUCKET/rollback-reports/$REPORT_FILE
    fi
}

# Interactive rollback
interactive_rollback() {
    log "Available deployment versions:"
    
    # Get recent task definitions
    TASK_DEFINITIONS=$(aws ecs list-task-definitions \
        --family-prefix prop-ie \
        --max-items $MAX_ROLLBACK_VERSIONS \
        --sort DESC \
        --region $REGION \
        --query 'taskDefinitionArns[*]' \
        --output json | jq -r '.[]')
    
    # Display options
    echo "Select a version to rollback to:"
    select TASK_DEF in $TASK_DEFINITIONS "Cancel"; do
        case $TASK_DEF in
            "Cancel")
                log "Rollback cancelled"
                exit 0
                ;;
            *)
                if [ -n "$TASK_DEF" ]; then
                    rollback_to_version $TASK_DEF
                    break
                fi
                ;;
        esac
    done
}

# Automated rollback based on metrics
automated_rollback() {
    log "Checking deployment metrics..."
    
    # Check error rate
    ERROR_RATE=$(aws cloudwatch get-metric-statistics \
        --namespace AWS/ECS \
        --metric-name HTTPCode_Target_5XX_Count \
        --dimensions Name=ServiceName,Value=$SERVICE \
        --start-time $(date -u -d '5 minutes ago' +%Y-%m-%dT%H:%M:%S) \
        --end-time $(date -u +%Y-%m-%dT%H:%M:%S) \
        --period 300 \
        --statistics Sum \
        --region $REGION \
        --query 'Datapoints[0].Sum' \
        --output text)
    
    if [ "$ERROR_RATE" -gt "${ERROR_THRESHOLD:-100}" ]; then
        warning "High error rate detected: $ERROR_RATE errors in last 5 minutes"
        
        PREVIOUS_VERSION=$(get_previous_version)
        if [ -n "$PREVIOUS_VERSION" ]; then
            log "Initiating automated rollback..."
            rollback_to_version $PREVIOUS_VERSION
            create_rollback_report "High error rate: $ERROR_RATE" "current" "$PREVIOUS_VERSION"
        fi
    else
        log "Metrics are within acceptable range"
    fi
}

# Main execution
main() {
    case "${1:-interactive}" in
        "auto")
            automated_rollback
            ;;
        "history")
            get_deployment_history
            ;;
        "interactive")
            interactive_rollback
            ;;
        "to")
            if [ -z "$2" ]; then
                error "Task definition required"
                exit 1
            fi
            rollback_to_version $2
            ;;
        *)
            echo "Usage: $0 [auto|history|interactive|to <task-definition>]"
            echo ""
            echo "Commands:"
            echo "  auto         - Automated rollback based on metrics"
            echo "  history      - Show deployment history"
            echo "  interactive  - Interactive rollback selection"
            echo "  to           - Rollback to specific task definition"
            exit 1
            ;;
    esac
    
    # Verify rollback if performed
    if [ "$1" != "history" ]; then
        verify_rollback
    fi
}

# Execute
main "$@"