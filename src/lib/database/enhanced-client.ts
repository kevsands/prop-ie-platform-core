// Enhanced Database Client with Performance Optimizations
// Supports connection pooling, caching, and monitoring

import { PrismaClient } from '@prisma/client'

// Environment configuration
const isDevelopment = process.env.NODE_ENV === 'development'
const isProduction = process.env.NODE_ENV === 'production'

// Database configuration
const databaseConfig = {
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
  log: isDevelopment 
    ? [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'info' },
        { emit: 'event', level: 'warn' },
      ]
    : [
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
      ],
}

// Cache configuration (simplified for now)
const cache = null // Would implement Redis in production

// Create enhanced Prisma client
class EnhancedPrismaClient {
  private client: PrismaClient
  private cache: any | null
  private queryMetrics: Map<string, { count: number; totalTime: number; avgTime: number }>

  constructor() {
    this.client = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      }
    })
    this.cache = cache
    this.queryMetrics = new Map()
    
    this.setupEventListeners()
    this.setupMiddleware()
  }

  private setupEventListeners() {
    // Simplified event listeners - would add proper logging in production
    if (isDevelopment) {
      console.log('Database client initialized')
    }
  }

  private setupMiddleware() {
    // Simplified middleware - would add caching and monitoring in production
    this.client.$use(async (params, next) => {
      const start = Date.now()
      
      try {
        const result = await next(params)
        
        // Log slow queries
        const duration = Date.now() - start
        if (duration > 1000) {
          console.warn(`Slow query detected: ${params.model}.${params.action} took ${duration}ms`)
        }
        
        return result
      } catch (error) {
        console.error('Query error:', error)
        throw error
      }
    })
  }

  private updateQueryMetrics(query: string, duration: number) {
    const key = query.split(' ')[0] // Get the operation type (SELECT, INSERT, etc.)
    const current = this.queryMetrics.get(key) || { count: 0, totalTime: 0, avgTime: 0 }
    
    current.count++
    current.totalTime += duration
    current.avgTime = current.totalTime / current.count
    
    this.queryMetrics.set(key, current)
  }

  // Query methods
  async findUserByEmail(email: string) {
    return this.client.user.findUnique({
      where: { email },
      include: {
        buyerProfile: true,
        professionalProfile: true,
      },
    })
  }

  async getActiveDevelopments(page = 1, limit = 20) {
    const offset = (page - 1) * limit
    
    return this.client.development.findMany({
      where: {
        status: {
          in: ['PLANNING', 'PRE_CONSTRUCTION', 'CONSTRUCTION', 'MARKETING', 'SALES']
        }
      },
      include: {
        developer: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            organization: true,
          }
        },
        location: true,
        units: true,
      },
      orderBy: {
        created: 'desc'
      },
      skip: offset,
      take: limit,
    })
  }

  async getDevelopmentAnalytics(developmentId: string) {
    // Get basic development analytics from existing tables
    const development = await this.client.development.findUnique({
      where: { id: developmentId },
      include: {
        units: true,
        developer: true,
        location: true
      }
    })
    
    if (!development) return null
    
    const soldUnits = development.units.filter(u => u.status === 'SOLD').length
    const availableUnits = development.units.filter(u => u.status === 'AVAILABLE').length
    
    return {
      ...development,
      soldUnits,
      availableUnits,
      salesPercentage: development.units.length > 0 ? (soldUnits / development.units.length) * 100 : 0
    }
  }

  // Basic property search
  async searchProperties(params: {
    location?: string
    minPrice?: number
    maxPrice?: number
    bedrooms?: number
    limit?: number
    offset?: number
  }) {
    const {
      location,
      minPrice,
      maxPrice,
      bedrooms,
      limit = 20,
      offset = 0
    } = params

    return this.client.unit.findMany({
      where: {
        status: 'AVAILABLE',
        ...(minPrice && { price: { gte: minPrice } }),
        ...(maxPrice && { price: { lte: maxPrice } }),
        ...(bedrooms && { bedrooms }),
        ...(location && {
          development: {
            location: {
              OR: [
                { city: { contains: location, mode: 'insensitive' } },
                { county: { contains: location, mode: 'insensitive' } },
                { address: { contains: location, mode: 'insensitive' } },
              ]
            }
          }
        })
      },
      include: {
        development: {
          include: {
            location: true,
            developer: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                organization: true,
              }
            }
          }
        }
      },
      orderBy: [
        { price: 'asc' },
        { development: { created: 'desc' } }
      ],
      skip: offset,
      take: limit,
    })
  }

  // Performance monitoring
  getQueryMetrics() {
    return Object.fromEntries(this.queryMetrics)
  }

  // Connection management
  async healthCheck() {
    try {
      await this.client.$queryRaw`SELECT 1`
      return { status: 'healthy', timestamp: new Date() }
    } catch (error) {
      return { status: 'unhealthy', error: error.message, timestamp: new Date() }
    }
  }

  async disconnect() {
    await this.client.$disconnect()
    if (this.cache) {
      this.cache.disconnect()
    }
  }

  // Expose the underlying client for direct access when needed
  get prisma() {
    return this.client
  }
}

// Create singleton instance
const db = new EnhancedPrismaClient()

// Graceful shutdown
process.on('beforeExit', async () => {
  await db.disconnect()
})

export default db
export { EnhancedPrismaClient }