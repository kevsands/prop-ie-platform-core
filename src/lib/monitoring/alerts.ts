import { CloudWatchClient, PutMetricAlarmCommand } from '@aws-sdk/client-cloudwatch'
import { SNSClient, PublishCommand } from '@aws-sdk/client-sns'

const cloudWatchClient = new CloudWatchClient({ region: process.env.AWS_REGION })
const snsClient = new SNSClient({ region: process.env.AWS_REGION })

export interface AlertConfig {
  name: string
  description: string
  metric: string
  threshold: number
  evaluationPeriods: number
  comparisonOperator: 'GreaterThanThreshold' | 'LessThanThreshold' | 'GreaterThanOrEqualToThreshold' | 'LessThanOrEqualToThreshold'
  treatMissingData?: 'breaching' | 'notBreaching' | 'ignore' | 'missing'
}

export class AlertingService {
  private readonly snsTopicArn = process.env.SNS_ALERT_TOPIC_ARN || ''

  async createAlerts() {
    const alerts: AlertConfig[] = [
      // Application Health
      {
        name: 'HighErrorRate',
        description: 'Application error rate is too high',
        metric: 'ErrorRate',
        threshold: 5, // 5% error rate
        evaluationPeriods: 2,
        comparisonOperator: 'GreaterThanThreshold'},
      {
        name: 'HighResponseTime',
        description: 'API response time is too high',
        metric: 'ResponseTime',
        threshold: 1000, // 1 second
        evaluationPeriods: 3,
        comparisonOperator: 'GreaterThanThreshold'},
      {
        name: 'LowAvailability',
        description: 'Application availability is below threshold',
        metric: 'Availability',
        threshold: 99.5,
        evaluationPeriods: 2,
        comparisonOperator: 'LessThanThreshold'},

      // Database
      {
        name: 'HighDatabaseCPU',
        description: 'Database CPU usage is too high',
        metric: 'DatabaseCPUUtilization',
        threshold: 80,
        evaluationPeriods: 2,
        comparisonOperator: 'GreaterThanThreshold'},
      {
        name: 'LowDatabaseStorage',
        description: 'Database storage space is running low',
        metric: 'FreeStorageSpace',
        threshold: 10737418240, // 10GB in bytes
        evaluationPeriods: 1,
        comparisonOperator: 'LessThanThreshold'},
      {
        name: 'HighDatabaseConnections',
        description: 'Too many database connections',
        metric: 'DatabaseConnectionCount',
        threshold: 80, // 80% of max connections
        evaluationPeriods: 2,
        comparisonOperator: 'GreaterThanThreshold'},

      // Business Metrics
      {
        name: 'LowDailySignups',
        description: 'Daily signup rate is below expected',
        metric: 'DailySignups',
        threshold: 10,
        evaluationPeriods: 1,
        comparisonOperator: 'LessThanThreshold',
        treatMissingData: 'breaching'},
      {
        name: 'HighPaymentFailureRate',
        description: 'Payment failure rate is too high',
        metric: 'PaymentFailureRate',
        threshold: 5, // 5% failure rate
        evaluationPeriods: 2,
        comparisonOperator: 'GreaterThanThreshold'},
      {
        name: 'LowTransactionCompletion',
        description: 'Transaction completion rate is low',
        metric: 'TransactionCompletionRate',
        threshold: 70, // 70% completion rate
        evaluationPeriods: 3,
        comparisonOperator: 'LessThanThreshold'},

      // Security
      {
        name: 'HighFailedLoginAttempts',
        description: 'Too many failed login attempts detected',
        metric: 'FailedLoginAttempts',
        threshold: 100,
        evaluationPeriods: 1,
        comparisonOperator: 'GreaterThanThreshold'},
      {
        name: 'SuspiciousActivity',
        description: 'Suspicious activity pattern detected',
        metric: 'SuspiciousActivityScore',
        threshold: 80,
        evaluationPeriods: 1,
        comparisonOperator: 'GreaterThanThreshold'}]

    for (const alert of alerts) {
      await this.createCloudWatchAlarm(alert)
    }
  }

  private async createCloudWatchAlarm(config: AlertConfig) {
    const command = new PutMetricAlarmCommand({
      AlarmName: `PropIE-${config.name}`,
      AlarmDescription: config.description,
      ActionsEnabled: true,
      AlarmActions: [this.snsTopicArn],
      MetricName: config.metric,
      Namespace: 'PropIE/Application',
      Statistic: 'Average',
      Dimensions: [
        {
          Name: 'Environment',
          Value: process.env.NODE_ENV || 'production'}],
      Period: 300, // 5 minutes
      EvaluationPeriods: config.evaluationPeriods,
      Threshold: config.threshold,
      ComparisonOperator: config.comparisonOperator,
      TreatMissingData: config.treatMissingData || 'notBreaching'})

    try {
      await cloudWatchClient.send(command)
      } catch (error) {
      }
  }

  async sendAlert(subject: string, message: string, severity: 'info' | 'warning' | 'critical' = 'warning') {
    const formattedMessage = `
🚨 ${severity.toUpperCase()} ALERT

Subject: ${subject}
Time: ${new Date().toISOString()}
Environment: ${process.env.NODE_ENV}

${message}

---
This is an automated alert from Prop.ie monitoring system.
    `.trim()

    const command = new PublishCommand({
      TopicArn: this.snsTopicArn,
      Subject: `[${severity.toUpperCase()}] ${subject}`,
      Message: formattedMessage,
      MessageAttributes: {
        severity: {
          DataType: 'String',
          StringValue: severity},
        environment: {
          DataType: 'String',
          StringValue: process.env.NODE_ENV || 'production'})

    try {
      await snsClient.send(command)
      } catch (error) {
      }
  }

  // Real-time alert triggers
  async checkAndAlert() {
    // Check error rate
    const errorRate = await this.getMetric('ErrorRate')
    if (errorRate> 5) {
      await this.sendAlert(
        'High Error Rate Detected',
        `Current error rate: ${errorRate}%\nThreshold: 5%`,
        'critical'
      )
    }

    // Check response time
    const responseTime = await this.getMetric('ResponseTime')
    if (responseTime> 1000) {
      await this.sendAlert(
        'High Response Time',
        `Current response time: ${responseTime}ms\nThreshold: 1000ms`,
        'warning'
      )
    }

    // Check payment failures
    const paymentFailureRate = await this.getMetric('PaymentFailureRate')
    if (paymentFailureRate> 5) {
      await this.sendAlert(
        'High Payment Failure Rate',
        `Current failure rate: ${paymentFailureRate}%\nThreshold: 5%`,
        'critical'
      )
    }
  }

  private async getMetric(metricName: string): Promise<number> {
    // Implementation would fetch actual metrics from CloudWatch
    // This is a placeholder
    return 0
  }
}