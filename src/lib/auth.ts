import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import AzureADProvider from "next-auth/providers/azure-ad";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { randomBytes } from "crypto";
import { verifyMfaCode } from './mfa';

// Types for authentication
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  roles: string[];
  mfaEnabled?: boolean;
  mfaSecret?: string;
}

export interface AuthSession {
  user: AuthUser;
  accessToken: string;
  refreshToken: string;
  accessTokenExpires: number;
  error?: string;
}

// Rate limiting store
const loginAttempts = new Map<string, { count: number; lastAttempt: Date }>();

// Helper function to check rate limiting
async function checkRateLimit(identifier: string): Promise<boolean> {
  const now = new Date();
  const attempt = loginAttempts.get(identifier);

  if (!attempt) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }

  // Reset if last attempt was more than 15 minutes ago
  const timeDiff = now.getTime() - attempt.lastAttempt.getTime();
  if (timeDiff> 15 * 60 * 1000) {
    loginAttempts.set(identifier, { count: 1, lastAttempt: now });
    return true;
  }

  // Block if more than 5 attempts in 15 minutes
  if (attempt.count>= 5) {
    return false;
  }

  attempt.count++;
  attempt.lastAttempt = now;
  return true;
}

// Log authentication events
async function logAuthEvent(
  eventType: 'LOGIN' | 'LOGOUT' | 'LOGIN_FAILED' | 'TOKEN_REFRESH' | 'MFA_CHALLENGE' | 'MFA_SUCCESS' | 'MFA_FAILED',
  userId?: string,
  email?: string,
  metadata?: any
) {
  try {
    await prisma.authLog.create({
      data: {
        eventType,
        userId,
        email,
        metadata: metadata || {},
        ipAddress: metadata?.ipAddress,
        userAgent: metadata?.userAgent,
        timestamp: new Date()
      }
    });
  } catch (error) {

  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  debug: process.env.NODE_ENV === 'development',
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        mfaCode: { label: "MFA Code", type: "text" }
      },
      async authorize(credentialsreq) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Invalid credentials");
        }

        // Check rate limiting
        const canProceed = await checkRateLimit(credentials.email);
        if (!canProceed) {
          await logAuthEvent('LOGIN_FAILED', undefined, credentials.email, {
            reason: 'Rate limit exceeded',
            ipAddress: req.headers?.['x-forwarded-for'] || req.headers?.['x-real-ip']
          });
          throw new Error("Too many login attempts. Please try again later.");
        }

        // For development mode, allow test logins
        if (process.env.NODE_ENV === 'development' && credentials.email.includes('@example.com')) {
          const mockRole = credentials.email.includes('admin') ? 'ADMIN' :
                          credentials.email.includes('developer') ? 'DEVELOPER' :
                          credentials.email.includes('solicitor') ? 'SOLICITOR' :
                          credentials.email.includes('agent') ? 'AGENT' : 'BUYER';

          await logAuthEvent('LOGIN', `dev-user-${Date.now()}`, credentials.email, {
            provider: 'credentials',
            environment: 'development'
          });

          return {
            id: `dev-user-${Math.random().toString(36).substring(29)}`,
            email: credentials.email,
            name: credentials.email.split('@')[0],
            roles: [mockRole],
            mfaEnabled: false
          };
        }

        // Production mode - real user lookup
        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
          include: {
            mfaSettings: true,
            sessions: {
              where: {
                expiresAt: { gt: new Date() }
              },
              orderBy: { createdAt: 'desc' },
              take: 5
            }
          }
        });

        if (!user || !user.password) {
          await logAuthEvent('LOGIN_FAILED', undefined, credentials.email, {
            reason: 'User not found'
          });
          throw new Error("Invalid email or password");
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        );

        if (!isPasswordValid) {
          await logAuthEvent('LOGIN_FAILED', user.id, credentials.email, {
            reason: 'Invalid password'
          });
          throw new Error("Invalid email or password");
        }

        // Check if MFA is enabled
        if (user.mfaSettings?.enabled) {
          if (!credentials.mfaCode) {
            await logAuthEvent('MFA_CHALLENGE', user.id, credentials.email);
            throw new Error("MFA_REQUIRED");
          }

          // Verify MFA code (implement your MFA verification logic)
          const isMfaValid = await verifyMfaCode(user.id, credentials.mfaCode);
          if (!isMfaValid) {
            await logAuthEvent('MFA_FAILED', user.id, credentials.email);
            throw new Error("Invalid MFA code");
          }

          await logAuthEvent('MFA_SUCCESS', user.id, credentials.email);
        }

        // Update last login
        await prisma.user.update({
          where: { id: user.id },
          data: { lastLogin: new Date() }
        });

        await logAuthEvent('LOGIN', user.id, credentials.email, {
          provider: 'credentials'
        });

        return {
          id: user.id,
          email: user.email,
          name: `${user.firstName} ${user.lastName}`,
          roles: user.roles || ['BUYER'],
          mfaEnabled: user.mfaSettings?.enabled || false
        };
      }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code"
        }
      }
    }),
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID!,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET!,
      tenantId: process.env.AZURE_AD_TENANT_ID!})],
  callbacks: {
    async jwt({ token, user, account, trigger, session }) {
      // Initial sign in
      if (account && user) {
        const accessTokenExpires = Date.now() + (15 * 60 * 1000); // 15 minutes
        const refreshToken = randomBytes(32).toString('hex');

        // Store refresh token in database
        await prisma.refreshToken.create({
          data: {
            token: refreshToken,
            userId: user.id,
            expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
          }
        });

        return {
          ...token,
          id: user.id,
          email: user.email,
          roles: user.roles || ['BUYER'],
          role: user.roles?.[0] || 'BUYER',
          mfaEnabled: user.mfaEnabled || false,
          accessToken: createAccessToken(user.id, user.email, user.roles),
          refreshToken,
          accessTokenExpires,
          provider: account.provider
        };
      }

      // Handle session updates
      if (trigger === "update" && session) {
        return { ...token, ...session.user };
      }

      // Return previous token if the access token has not expired
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      // Access token has expired, try to update it
      return await refreshAccessToken(token);
    },
    async session({ session, token, trigger }) {
      if (token) {
        session.user = {
          id: token.id as string,
          email: token.email as string,
          name: token.name as string,
          roles: token.roles as string[],
          role: token.role as string,
          mfaEnabled: token.mfaEnabled as boolean
        };
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.error = token.error as string | undefined;
      }

      // Log session access
      if (trigger === "update") {
        await logAuthEvent('TOKEN_REFRESH', session.user.id, session.user.email);
      }

      return session;
    },
    async signIn({ user, account, profile }) {
      // Handle OAuth sign in
      if (account?.provider !== 'credentials') {
        const email = user.email!;

        // Check if user exists
        let dbUser = await prisma.user.findUnique({
          where: { email }
        });

        if (!dbUser) {
          // Create new user from OAuth
          dbUser = await prisma.user.create({
            data: {
              email,
              firstName: profile?.name?.split(' ')[0] || '',
              lastName: profile?.name?.split(' ').slice(1).join(' ') || '',
              roles: ['BUYER'],
              status: 'ACTIVE',
              kycStatus: 'NOT_STARTED'
            }
          });
        }

        await logAuthEvent('LOGIN', dbUser.id, email, {
          provider: account.provider
        });
      }

      return true;
    },
    async redirect({ url, baseUrl }) {
      // Allows relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`;
      // Allows callback URLs on the same origin
      else if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    }
  },
  events: {
    async signOut({ token }) {
      if (token?.id) {
        // Invalidate refresh tokens
        await prisma.refreshToken.deleteMany({
          where: { userId: token.id as string }
        });

        await logAuthEvent('LOGOUT', token.id as string, token.email as string);
      }
    },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' 
        ? `__Secure-next-auth.session-token`
        : `next-auth.session-token`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    secret: process.env.NEXTAUTH_SECRET},
  pages: {
    signIn: "/auth/login",
    signOut: "/auth/logout",
    error: "/auth/error",
    verifyRequest: "/auth/verify-request",
    newUser: "/auth/new-user"
  },
  secret: process.env.NEXTAUTH_SECRET};

// Create access token
export function createAccessToken(userId: string, email: string, roles: string[]) {
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET is not defined');
  }

  return jwt.sign(
    { 
      id: userId,
      email: email,
      roles: roles,
      type: 'access',
      iat: Date.now() / 1000,
      exp: Date.now() / 1000 + (15 * 60) // 15 minutes
    },
    process.env.NEXTAUTH_SECRET
  );
}

// Create refresh token
export function createRefreshToken(userId: string) {
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET is not defined');
  }

  return jwt.sign(
    { 
      id: userId,
      type: 'refresh',
      iat: Date.now() / 1000,
      exp: Date.now() / 1000 + (30 * 24 * 60 * 60) // 30 days
    },
    process.env.NEXTAUTH_SECRET
  );
}

// Refresh access token
async function refreshAccessToken(token: any) {
  try {
    // Check if refresh token is valid
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token: token.refreshToken },
      include: { user: true }
    });

    if (!refreshToken || refreshToken.expiresAt <new Date()) {
      throw new Error("Refresh token expired");
    }

    const user = refreshToken.user;
    const accessTokenExpires = Date.now() + (15 * 60 * 1000); // 15 minutes

    await logAuthEvent('TOKEN_REFRESH', user.id, user.email);

    return {
      ...token,
      accessToken: createAccessToken(user.id, user.email, user.roles),
      accessTokenExpires,
      error: null
    };
  } catch (error) {

    return {
      ...token,
      error: "RefreshAccessTokenError"
    };
  }
}

// Verify JWT token
export function verifyJWT(token: string) {
  if (!process.env.NEXTAUTH_SECRET) {
    throw new Error('NEXTAUTH_SECRET is not defined');
  }

  try {
    return jwt.verify(token, process.env.NEXTAUTH_SECRET);
  } catch (error) {
    throw new Error('Invalid token');
  }
}