// src/app/api/auth/session-postgresql/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { userServicePostgreSQL } from '@/lib/services/users-postgresql';

/**
 * PostgreSQL-enabled Session Check API
 * 
 * This endpoint checks authentication status using the migrated PostgreSQL database
 */
export async function GET(request: NextRequest) {
  try {
    console.log(`[PostgreSQL Auth] Session check requested`);

    // Test PostgreSQL connection first
    const connectionTest = await userServicePostgreSQL.testConnection();
    if (!connectionTest) {
      return NextResponse.json(
        { 
          authenticated: false, 
          error: 'Database connection failed',
          databaseInfo: {
            type: 'PostgreSQL',
            status: 'connection_failed'
          }
        },
        { status: 500 }
      );
    }

    // Check for auth token in cookies
    const authToken = request.cookies.get('auth-token')?.value;
    
    if (!authToken) {
      return NextResponse.json({
        authenticated: false,
        message: 'No authentication token found',
        databaseInfo: {
          type: 'PostgreSQL',
          status: 'no_token'
        }
      });
    }

    console.log(`[PostgreSQL Auth] Auth token found: ${authToken.substring(0, 20)}...`);

    // In development mode with mock auth, extract user ID from token
    if (process.env.NODE_ENV === 'development' && process.env.ALLOW_MOCK_AUTH === 'true') {
      // Extract user ID from PostgreSQL dev token (format: postgresql-dev-token-{userId})
      if (authToken.startsWith('postgresql-dev-token-')) {
        const userId = authToken.replace('postgresql-dev-token-', '');
        
        try {
          const user = await userServicePostgreSQL.getUserById(userId);
          
          if (user) {
            // Update last active timestamp
            await userServicePostgreSQL.updateLastActive(user.id);

            return NextResponse.json({
              authenticated: true,
              user: {
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName,
                roles: user.roles,
                status: user.status,
                kycStatus: user.kycStatus,
                organization: user.organization,
                position: user.position,
                lastActive: user.lastActive,
                lastLogin: user.lastLogin
              },
              session: {
                tokenType: 'postgresql-dev-token',
                isValid: true,
                authMethod: 'mock-auth-enabled'
              },
              databaseInfo: {
                type: 'PostgreSQL',
                userTable: 'users',
                idType: 'UUID',
                authMethod: 'mock-auth-dev-mode'
              }
            });
          } else {
            return NextResponse.json({
              authenticated: false,
              error: 'User not found in PostgreSQL database',
              databaseInfo: {
                type: 'PostgreSQL',
                status: 'user_not_found'
              }
            }, { status: 401 });
          }
        } catch (error) {
          console.error('Error getting user from PostgreSQL:', error);
          return NextResponse.json({
            authenticated: false,
            error: 'Database error while checking session',
            databaseInfo: {
              type: 'PostgreSQL',
              status: 'database_error'
            }
          }, { status: 500 });
        }
      }
      
      // Handle old SQLite tokens for backward compatibility
      if (authToken.startsWith('dev-token-')) {
        return NextResponse.json({
          authenticated: false,
          message: 'Legacy SQLite token detected. Please log in again with PostgreSQL',
          databaseInfo: {
            type: 'PostgreSQL',
            status: 'legacy_token_rejected'
          }
        }, { status: 401 });
      }
    }

    // Production mode: validate JWT token and check user in PostgreSQL
    // For now, return not authenticated for production tokens
    return NextResponse.json({
      authenticated: false,
      message: 'Production token validation not implemented yet',
      databaseInfo: {
        type: 'PostgreSQL',
        status: 'production_validation_pending'
      }
    }, { status: 401 });

  } catch (error: any) {
    console.error('PostgreSQL Session check error:', error);
    
    return NextResponse.json(
      { 
        authenticated: false,
        error: 'Session check failed', 
        details: error.message,
        databaseInfo: {
          type: 'PostgreSQL',
          status: 'error'
        }
      },
      { status: 500 }
    );
  }
}