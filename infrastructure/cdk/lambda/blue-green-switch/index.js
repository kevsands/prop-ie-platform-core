/**
 * AWS Lambda function for Blue-Green deployment switching
 * This function updates Route53 DNS records to switch between blue and green environments
 */

const AWS = require('aws-sdk');
const route53 = new AWS.Route53();
const amplify = new AWS.Amplify();

exports.handler = async (event) => {
  console.log('Starting blue-green environment switch');
  console.log('Event:', JSON.stringify(event, null, 2));
  
  // Get environment variables
  const blueAppId = process.env.BLUE_APP_ID;
  const greenAppId = process.env.GREEN_APP_ID;
  const hostedZoneId = process.env.HOSTED_ZONE_ID;
  const domainName = process.env.DOMAIN_NAME;
  
  if (!blueAppId || !greenAppId || !hostedZoneId || !domainName) {
    throw new Error('Missing required environment variables');
  }
  
  try {
    // Determine which environment is currently active
    const currentActiveEnv = event.targetEnvironment || await determineCurrentActiveEnvironment(hostedZoneId, domainName);
    console.log(`Current active environment: ${currentActiveEnv}`);
    
    // Switch to the other environment
    const targetEnv = currentActiveEnv === 'blue' ? 'green' : 'blue';
    console.log(`Switching to ${targetEnv} environment`);
    
    // Get the target app domain URL
    const targetAppId = targetEnv === 'blue' ? blueAppId : greenAppId;
    const targetDomainUrl = await getAmplifyAppDomain(targetAppId);
    
    if (!targetDomainUrl) {
      throw new Error(`Failed to get domain URL for ${targetEnv} environment`);
    }
    
    // Update Route53 record to point to the new environment
    await updateDnsRecord(hostedZoneId, domainName, targetDomainUrl);
    
    // Record the switch in a DynamoDB table for tracking (if configured)
    if (process.env.DEPLOYMENT_HISTORY_TABLE) {
      await recordDeploymentSwitch(targetEnv, event.switchReason || 'Manual switch');
    }
    
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: `Successfully switched to ${targetEnv} environment`,
        previousEnvironment: currentActiveEnv,
        newEnvironment: targetEnv,
        domainName,
        switchTime: new Date().toISOString()
      })
    };
  } catch (error) {
    console.error('Error during blue-green switch:', error);
    throw error;
  }
};

async function determineCurrentActiveEnvironment(hostedZoneId, domainName) {
  // Get current DNS record
  const params = {
    HostedZoneId: hostedZoneId,
    StartRecordName: domainName,
    StartRecordType: 'A',
    MaxItems: '1'
  };
  
  try {
    const response = await route53.listResourceRecordSets(params).promise();
    
    if (response.ResourceRecordSets.length === 0) {
      console.log('No DNS record found, assuming blue is active');
      return 'blue';
    }
    
    const record = response.ResourceRecordSets[0];
    
    if (record.AliasTarget && record.AliasTarget.DNSName) {
      const dnsName = record.AliasTarget.DNSName;
      
      // Determine if blue or green based on the DNS name
      if (dnsName.includes('-blue-')) {
        return 'blue';
      } else if (dnsName.includes('-green-')) {
        return 'green';
      } else {
        console.log(`DNS name doesn't contain blue/green identifier: ${dnsName}`);
        return 'blue'; // Default to blue if unable to determine
      }
    } else {
      console.log('No alias target found in DNS record, assuming blue is active');
      return 'blue';
    }
  } catch (error) {
    console.error('Error determining current active environment:', error);
    // Default to blue if there's an error
    return 'blue';
  }
}

async function getAmplifyAppDomain(appId) {
  try {
    // Get Amplify app info
    const appInfo = await amplify.getApp({ appId }).promise();
    
    // Get production branch
    const branches = await amplify.listBranches({ appId }).promise();
    const productionBranch = branches.branches.find(branch => branch.branchName === 'production');
    
    if (!productionBranch) {
      throw new Error('Production branch not found');
    }
    
    // Construct the Amplify domain URL
    const appDomain = `${productionBranch.branchName}.${appInfo.app.defaultDomain}`;
    return appDomain;
  } catch (error) {
    console.error('Error getting Amplify app domain:', error);
    throw error;
  }
}

async function updateDnsRecord(hostedZoneId, domainName, targetDomainUrl) {
  const params = {
    HostedZoneId: hostedZoneId,
    ChangeBatch: {
      Changes: [
        {
          Action: 'UPSERT',
          ResourceRecordSet: {
            Name: domainName,
            Type: 'A',
            AliasTarget: {
              HostedZoneId: 'Z2FDTNDATAQYW2', // CloudFront hosted zone ID (always the same)
              DNSName: `${targetDomainUrl}.`,
              EvaluateTargetHealth: false
            }
          }
        }
      ]
    }
  };
  
  try {
    const response = await route53.changeResourceRecordSets(params).promise();
    console.log('DNS record updated successfully:', JSON.stringify(response, null, 2));
    return response;
  } catch (error) {
    console.error('Error updating DNS record:', error);
    throw error;
  }
}

async function recordDeploymentSwitch(targetEnv, switchReason) {
  const dynamoDB = new AWS.DynamoDB.DocumentClient();
  
  const params = {
    TableName: process.env.DEPLOYMENT_HISTORY_TABLE,
    Item: {
      id: `switch-${Date.now()}`,
      targetEnvironment: targetEnv,
      switchReason: switchReason,
      timestamp: new Date().toISOString(),
      operator: process.env.AWS_LAMBDA_FUNCTION_NAME,
      isAutomated: event.isAutomated || false
    }
  };
  
  try {
    await dynamoDB.put(params).promise();
    console.log('Deployment switch recorded in history table');
  } catch (error) {
    console.error('Error recording deployment switch:', error);
    // Don't fail the function if this fails
    console.log('Continuing with switch despite recording failure');
  }
}