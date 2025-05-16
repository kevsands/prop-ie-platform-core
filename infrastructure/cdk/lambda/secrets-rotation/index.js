/**
 * AWS Lambda function for API key rotation
 * This function rotates API keys stored in Secrets Manager
 */

const AWS = require('aws-sdk');
const https = require('https');
const secretsManager = new AWS.SecretsManager();

// Generate a secure random API key
const generateApiKey = (length = 32) => {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  
  // Use secure random source if available
  if (crypto && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
  } else {
    // Fall back to less secure random for environments without crypto
    for (let i = 0; i < length; i++) {
      randomValues[i] = Math.floor(Math.random() * charset.length);
    }
  }
  
  for (let i = 0; i < length; i++) {
    result += charset[randomValues[i] % charset.length];
  }
  
  return result;
};

// Make HTTPS requests to external services
const makeHttpsRequest = (url, method, headers, body) => {
  return new Promise((resolve, reject) => {
    const options = {
      method: method || 'GET',
      headers: headers || {}
    };
    
    const req = https.request(url, options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({
            statusCode: res.statusCode,
            body: data
          });
        } else {
          reject(new Error(`Request failed with status code ${res.statusCode}: ${data}`));
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    if (body) {
      req.write(typeof body === 'string' ? body : JSON.stringify(body));
    }
    
    req.end();
  });
};

// Update key with external service (if needed)
const updateExternalApiKey = async (username, currentKey, newKey) => {
  const apiEndpoint = process.env.EXTERNAL_API_ENDPOINT;
  if (!apiEndpoint) {
    console.log('No external API endpoint configured, skipping external update');
    return true;
  }
  
  try {
    // First authenticate with current key
    const authResponse = await makeHttpsRequest(
      `${apiEndpoint}/auth`,
      'POST',
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${currentKey}`
      },
      { username }
    );
    
    const { token } = JSON.parse(authResponse.body);
    
    // Then update with new key
    await makeHttpsRequest(
      `${apiEndpoint}/keys/rotate`,
      'POST',
      {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      { 
        username,
        newApiKey: newKey
      }
    );
    
    return true;
  } catch (error) {
    console.error('Error updating external API key:', error);
    return false;
  }
};

exports.handler = async (event) => {
  console.log('Starting API key rotation process');
  const secretArn = process.env.SECRET_ARN;
  
  if (!secretArn) {
    throw new Error('SECRET_ARN environment variable is required');
  }
  
  try {
    // Retrieve current secret
    const currentSecretResponse = await secretsManager.getSecretValue({
      SecretId: secretArn
    }).promise();
    
    let secretData;
    if ('SecretString' in currentSecretResponse) {
      secretData = JSON.parse(currentSecretResponse.SecretString);
    } else {
      throw new Error('Binary secrets not supported for API keys');
    }
    
    // Extract information from current secret
    const username = secretData.username;
    const currentApiKey = secretData.api_key;
    
    if (!username || !currentApiKey) {
      throw new Error('Secret must contain username and api_key fields');
    }
    
    // Generate new API key
    const newApiKey = generateApiKey(48);
    
    // Update external service first (if applicable)
    const externalUpdateSuccess = await updateExternalApiKey(
      username, 
      currentApiKey, 
      newApiKey
    );
    
    if (!externalUpdateSuccess) {
      throw new Error('Failed to update API key with external service');
    }
    
    // Update secret in Secrets Manager
    const newSecretData = {
      ...secretData,
      api_key: newApiKey,
      last_rotated: new Date().toISOString()
    };
    
    await secretsManager.putSecretValue({
      SecretId: secretArn,
      SecretString: JSON.stringify(newSecretData)
    }).promise();
    
    console.log('API key rotation completed successfully');
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: 'API key rotated successfully',
        username,
        rotationTime: newSecretData.last_rotated
      })
    };
  } catch (error) {
    console.error('Error during API key rotation:', error);
    throw error;
  }
};