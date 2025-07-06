const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const AWS = require('aws-sdk');

class MonitoringManager {
    constructor() {
        this.projectRoot = path.resolve(__dirname, '..');
        this.monitoringConfigPath = path.join(this.projectRoot, 'monitoring-config.json');
        this.loadConfigurations();
    }

    loadConfigurations() {
        try {
            this.config = JSON.parse(fs.readFileSync(this.monitoringConfigPath, 'utf8'));
        } catch (error) {
            this.config = {
                cloudwatch: {
                    logGroupName: '/prop-ie-aws-app',
                    retentionInDays: 30,
                    metrics: {
                        errors: true,
                        latency: true,
                        requests: true,
                        memory: true,
                        cpu: true
                    }
                },
                xray: {
                    enabled: true,
                    sampling: true,
                    samplingRate: 0.1
                },
                alarms: {
                    errorRate: {
                        threshold: 1,
                        period: 300,
                        evaluationPeriods: 2
                    },
                    latency: {
                        threshold: 1000,
                        period: 300,
                        evaluationPeriods: 2
                    },
                    memory: {
                        threshold: 80,
                        period: 300,
                        evaluationPeriods: 2
                    }
                },
                logging: {
                    level: 'info',
                    format: 'json',
                    destinations: ['cloudwatch', 'console']
                }
            };
            this.saveConfigurations();
        }
    }

    saveConfigurations() {
        fs.writeFileSync(this.monitoringConfigPath, JSON.stringify(this.config, null, 2));
    }

    async setupMonitoring() {
        try {
            await this.setupCloudWatch();
            await this.setupXRay();
            await this.setupAlarms();
            await this.setupLogging();
        } catch (error) {
            console.error('Error setting up monitoring:', error);
        }
    }

    async setupCloudWatch() {
        const cloudwatch = new AWS.CloudWatch();
        const logs = new AWS.CloudWatchLogs();

        try {
            // Create log group
            await logs.createLogGroup({
                logGroupName: this.config.cloudwatch.logGroupName,
                retentionInDays: this.config.cloudwatch.retentionInDays
            }).promise();

            // Set up metrics
            for (const [metric, enabled] of Object.entries(this.config.cloudwatch.metrics)) {
                if (enabled) {
                    await cloudwatch.putMetricAlarm({
                        AlarmName: `prop-ie-aws-app-${metric}`,
                        MetricName: metric,
                        Namespace: 'PropIEAWSApp',
                        Statistic: 'Average',
                        Period: 300,
                        EvaluationPeriods: 2,
                        Threshold: this.getMetricThreshold(metric),
                        ComparisonOperator: 'GreaterThanThreshold',
                        AlarmActions: [this.config.cloudwatch.alarmActions]
                    }).promise();
                }
            }
        } catch (error) {
            console.error('Error setting up CloudWatch:', error);
        }
    }

    async setupXRay() {
        const xray = new AWS.XRay();

        try {
            if (this.config.xray.enabled) {
                await xray.putEncryptionConfig({
                    Type: 'KMS',
                    KeyId: this.config.xray.kmsKeyId
                }).promise();

                await xray.putSamplingRule({
                    SamplingRule: {
                        RuleName: 'prop-ie-aws-app',
                        Priority: 1,
                        FixedRate: this.config.xray.samplingRate,
                        ReservoirSize: 1,
                        Host: '*',
                        ServiceName: 'prop-ie-aws-app',
                        ServiceType: '*',
                        HTTPMethod: '*',
                        URLPath: '*',
                        Version: 1
                    }
                }).promise();
            }
        } catch (error) {
            console.error('Error setting up X-Ray:', error);
        }
    }

    async setupAlarms() {
        const cloudwatch = new AWS.CloudWatch();

        try {
            for (const [alarm, config] of Object.entries(this.config.alarms)) {
                await cloudwatch.putMetricAlarm({
                    AlarmName: `prop-ie-aws-app-${alarm}`,
                    MetricName: this.getAlarmMetric(alarm),
                    Namespace: 'PropIEAWSApp',
                    Statistic: 'Average',
                    Period: config.period,
                    EvaluationPeriods: config.evaluationPeriods,
                    Threshold: config.threshold,
                    ComparisonOperator: 'GreaterThanThreshold',
                    AlarmActions: [this.config.cloudwatch.alarmActions]
                }).promise();
            }
        } catch (error) {
            console.error('Error setting up alarms:', error);
        }
    }

    async setupLogging() {
        const logs = new AWS.CloudWatchLogs();

        try {
            for (const destination of this.config.logging.destinations) {
                if (destination === 'cloudwatch') {
                    await logs.putRetentionPolicy({
                        logGroupName: this.config.cloudwatch.logGroupName,
                        retentionInDays: this.config.cloudwatch.retentionInDays
                    }).promise();
                }
            }
        } catch (error) {
            console.error('Error setting up logging:', error);
        }
    }

    getMetricThreshold(metric) {
        const thresholds = {
            errors: 1,
            latency: 1000,
            requests: 1000,
            memory: 80,
            cpu: 80
        };
        return thresholds[metric] || 0;
    }

    getAlarmMetric(alarm) {
        const metrics = {
            errorRate: 'ErrorRate',
            latency: 'Latency',
            memory: 'MemoryUtilization'
        };
        return metrics[alarm] || alarm;
    }

    async generateMonitoringReport() {
        try {
            const report = {
                timestamp: new Date().toISOString(),
                cloudwatch: await this.getCloudWatchMetrics(),
                xray: await this.getXRayTraces(),
                alarms: await this.getAlarmStatus(),
                logs: await this.getLogStats()
            };

            const reportPath = path.join(this.projectRoot, 'reports', `monitoring-report-${new Date().toISOString().split('T')[0]}.json`);
            fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
            return report;
        } catch (error) {
            console.error('Error generating monitoring report:', error);
            return null;
        }
    }

    async getCloudWatchMetrics() {
        const cloudwatch = new AWS.CloudWatch();
        const metrics = {};

        try {
            for (const metric of Object.keys(this.config.cloudwatch.metrics)) {
                const result = await cloudwatch.getMetricStatistics({
                    Namespace: 'PropIEAWSApp',
                    MetricName: metric,
                    StartTime: new Date(Date.now() - 3600000),
                    EndTime: new Date(),
                    Period: 300,
                    Statistics: ['Average']
                }).promise();
                metrics[metric] = result;
            }
        } catch (error) {
            console.error('Error getting CloudWatch metrics:', error);
        }

        return metrics;
    }

    async getXRayTraces() {
        const xray = new AWS.XRay();

        try {
            const result = await xray.getTraceSummaries({
                StartTime: new Date(Date.now() - 3600000),
                EndTime: new Date()
            }).promise();
            return result;
        } catch (error) {
            console.error('Error getting X-Ray traces:', error);
            return null;
        }
    }

    async getAlarmStatus() {
        const cloudwatch = new AWS.CloudWatch();

        try {
            const result = await cloudwatch.describeAlarms({
                AlarmNames: Object.keys(this.config.alarms).map(alarm => `prop-ie-aws-app-${alarm}`)
            }).promise();
            return result;
        } catch (error) {
            console.error('Error getting alarm status:', error);
            return null;
        }
    }

    async getLogStats() {
        const logs = new AWS.CloudWatchLogs();

        try {
            const result = await logs.describeLogGroups({
                logGroupNamePrefix: this.config.cloudwatch.logGroupName
            }).promise();
            return result;
        } catch (error) {
            console.error('Error getting log stats:', error);
            return null;
        }
    }
}

// CLI interface
if (require.main === module) {
    const manager = new MonitoringManager();
    const command = process.argv[2];
    const args = process.argv.slice(3);

    switch (command) {
        case 'setup':
            manager.setupMonitoring();
            break;
        case 'generate-report':
            manager.generateMonitoringReport();
            break;
        default:
            console.log('Unknown command');
    }
}

module.exports = MonitoringManager; 