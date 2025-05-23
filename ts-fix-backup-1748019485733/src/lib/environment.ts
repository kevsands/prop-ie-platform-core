// src/lib/environment.ts
/**
 * Environment configuration and initialization
 * Sets up service connections and checks for required environment variables
 */

// Required environment variables for production
const REQUIRED_ENV_VARS = [
    'NEXT_PUBLIC_API_URL',
    'NEXT_PUBLIC_COGNITO_USER_POOL_ID',
    'NEXT_PUBLIC_COGNITO_CLIENT_ID'
  ];

  // Check if we're in a production environment
  const isProduction = process.env.NODE_ENV === 'production';

  /**
   * Gets an environment variable with a default fallback
   * @param name The name of the environment variable
   * @param defaultValue The default value to use if the environment variable is not set
   * @returns The value of the environment variable or the default value
   */
  export function getEnvironmentVariable(name: string, defaultValue: string = ''): string {
    return process.env[name] || defaultValue;
  }

  /**
   * Validates required environment variables
   * In production, this will throw errors if variables are missing
   * In development, it will log warnings but continue
   */
  export function validateEnvironment(): boolean {
    let isValid = true;
    const missingVars: string[] = [];

    REQUIRED_ENV_VARS.forEach(varName => {
      if (!process.env[varName]) {
        isValid = false;
        missingVars.push(varName);
      }
    });

    if (!isValid) {
      const message = `Missing required environment variables: ${missingVars.join(', ')}`;

      if (isProduction) {
        throw new Error(message);
      } else {

      }
    }

    return isValid;
  }

  /**
   * Initialize application environment
   * Call this during application startup
   */
  export function initializeEnvironment() {
    // Validate environment variables
    validateEnvironment();

    // Log environment info for debugging (never in production)
    if (process.env.NODE_ENV !== 'production') {

    }

    // Initialize global error handler
    if (typeof window !== 'undefined') {
      window.addEventListener('error', (event) => {

        // Could send to error reporting service here
      });
    }

    return true;
  }

  export default { validateEnvironment, initializeEnvironment, getEnvironmentVariable };