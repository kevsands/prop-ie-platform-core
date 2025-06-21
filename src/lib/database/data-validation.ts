// Data Validation Service
// Comprehensive validation framework for all database operations

import { z } from 'zod'
import db from './enhanced-client'

// Validation schemas
export const userValidationSchema = z.object({
  email: z.string().email('Invalid email format').max(320, 'Email too long'),
  firstName: z.string().min(1, 'First name required').max(100, 'First name too long'),
  lastName: z.string().min(1, 'Last name required').max(100, 'Last name too long'),
  phone: z.string().regex(/^\+[1-9]\d{1,14}$/, 'Phone must be in E.164 format').optional().nullable(),
  roles: z.array(z.enum([
    'DEVELOPER', 'BUYER', 'INVESTOR', 'ARCHITECT', 'ENGINEER', 
    'QUANTITY_SURVEYOR', 'LEGAL', 'PROJECT_MANAGER', 'AGENT', 
    'SOLICITOR', 'CONTRACTOR', 'ADMIN', 'SUPER_ADMIN', 
    'DATA_ANALYST', 'FINANCIAL_ANALYST'
  ])).min(1, 'At least one role required'),
  organization: z.string().max(200, 'Organization name too long').optional().nullable(),
  position: z.string().max(100, 'Position title too long').optional().nullable(),
})

export const locationValidationSchema = z.object({
  address: z.string().min(1, 'Address required').max(500, 'Address too long'),
  city: z.string().min(1, 'City required').max(100, 'City name too long'),
  county: z.string().min(1, 'County required').max(100, 'County name too long'),
  eircode: z.string().regex(/^[A-Z0-9]{3} [A-Z0-9]{4}$/, 'Invalid Eircode format'),
  country: z.string().max(100, 'Country name too long').default('Ireland'),
  latitude: z.number().min(-90).max(90).optional().nullable(),
  longitude: z.number().min(-180).max(180).optional().nullable(),
})

export const developmentValidationSchema = z.object({
  name: z.string().min(1, 'Development name required').max(200, 'Name too long'),
  slug: z.string().min(1, 'Slug required').max(200, 'Slug too long').regex(/^[a-z0-9-]+$/, 'Slug must contain only lowercase letters, numbers, and hyphens'),
  totalUnits: z.number().int().min(1, 'Must have at least 1 unit').max(1000, 'Maximum 1000 units'),
  description: z.string().max(5000, 'Description too long').optional().nullable(),
  totalProjectValue: z.number().positive('Project value must be positive').max(1000000000, 'Project value too large').optional().nullable(),
  totalProjectCost: z.number().positive('Project cost must be positive').max(1000000000, 'Project cost too large').optional().nullable(),
})

export const unitValidationSchema = z.object({
  price: z.number().min(1000, 'Minimum price €1,000').max(10000000, 'Maximum price €10,000,000').optional().nullable(),
  bedrooms: z.number().int().min(0, 'Bedrooms cannot be negative').max(10, 'Maximum 10 bedrooms').optional().nullable(),
  bathrooms: z.number().min(0, 'Bathrooms cannot be negative').max(10, 'Maximum 10 bathrooms').optional().nullable(),
  floorArea: z.number().positive('Floor area must be positive').max(10000, 'Maximum 10,000 sq ft').optional().nullable(),
})

export const transactionValidationSchema = z.object({
  amount: z.number().positive('Amount must be positive').max(100000000, 'Amount too large'),
  currency: z.enum(['EUR', 'USD', 'GBP', 'CAD', 'AUD', 'JPY', 'CHF', 'CNY', 'SEK', 'NZD', 'DKK', 'NOK']),
  transactionType: z.enum(['DEPOSIT', 'PAYMENT', 'REFUND', 'FEE', 'ADJUSTMENT', 'TRANSFER', 'CHARGE', 'CREDIT']),
  description: z.string().min(1, 'Description required').max(500, 'Description too long'),
})

// Data validation service
export class DataValidationService {
  
  // User validation
  static async validateUser(userData: any): Promise<ValidationResult> {
    try {
      const validated = userValidationSchema.parse(userData)
      
      // Check for duplicate email
      if (userData.id) {
        const existingUser = await db.prisma.user.findFirst({
          where: {
            email: validated.email,
            id: { not: userData.id }
          }
        })
        if (existingUser) {
          return {
            isValid: false,
            errors: ['Email already exists'],
            validatedData: null
          }
        }
      } else {
        const existingUser = await db.findUserByEmail(validated.email)
        if (existingUser) {
          return {
            isValid: false,
            errors: ['Email already exists'],
            validatedData: null
          }
        }
      }
      
      return {
        isValid: true,
        errors: [],
        validatedData: validated
      }
    } catch (error) {
      return {
        isValid: false,
        errors: this.formatZodErrors(error),
        validatedData: null
      }
    }
  }

  // Location validation
  static async validateLocation(locationData: any): Promise<ValidationResult> {
    try {
      const validated = locationValidationSchema.parse(locationData)
      
      // Validate coordinates if provided
      if (validated.latitude !== null && validated.longitude !== null) {
        if (validated.latitude === undefined || validated.longitude === undefined) {
          return {
            isValid: false,
            errors: ['Both latitude and longitude must be provided together'],
            validatedData: null
          }
        }
      }
      
      return {
        isValid: true,
        errors: [],
        validatedData: validated
      }
    } catch (error) {
      return {
        isValid: false,
        errors: this.formatZodErrors(error),
        validatedData: null
      }
    }
  }

  // Development validation
  static async validateDevelopment(developmentData: any): Promise<ValidationResult> {
    try {
      const validated = developmentValidationSchema.parse(developmentData)
      
      // Check for duplicate slug
      if (developmentData.id) {
        const existingDev = await db.prisma.development.findFirst({
          where: {
            slug: validated.slug,
            id: { not: developmentData.id }
          }
        })
        if (existingDev) {
          return {
            isValid: false,
            errors: ['Slug already exists'],
            validatedData: null
          }
        }
      } else {
        const existingDev = await db.prisma.development.findUnique({
          where: { slug: validated.slug }
        })
        if (existingDev) {
          return {
            isValid: false,
            errors: ['Slug already exists'],
            validatedData: null
          }
        }
      }
      
      return {
        isValid: true,
        errors: [],
        validatedData: validated
      }
    } catch (error) {
      return {
        isValid: false,
        errors: this.formatZodErrors(error),
        validatedData: null
      }
    }
  }

  // Unit validation
  static async validateUnit(unitData: any): Promise<ValidationResult> {
    try {
      const validated = unitValidationSchema.parse(unitData)
      
      return {
        isValid: true,
        errors: [],
        validatedData: validated
      }
    } catch (error) {
      return {
        isValid: false,
        errors: this.formatZodErrors(error),
        validatedData: null
      }
    }
  }

  // Transaction validation
  static async validateTransaction(transactionData: any): Promise<ValidationResult> {
    try {
      const validated = transactionValidationSchema.parse(transactionData)
      
      return {
        isValid: true,
        errors: [],
        validatedData: validated
      }
    } catch (error) {
      return {
        isValid: false,
        errors: this.formatZodErrors(error),
        validatedData: null
      }
    }
  }

  // Business rule validations
  static async validateBusinessRules(entityType: string, data: any): Promise<ValidationResult> {
    const errors: string[] = []
    
    switch (entityType) {
      case 'development':
        // Check if developer exists and is active
        if (data.developerId) {
          const developer = await db.prisma.user.findUnique({
            where: { id: data.developerId }
          })
          if (!developer || !developer.roles.includes('DEVELOPER') || developer.status !== 'ACTIVE') {
            errors.push('Invalid or inactive developer')
          }
        }
        
        // Check project value vs cost ratio
        if (data.totalProjectValue && data.totalProjectCost) {
          const margin = (data.totalProjectValue - data.totalProjectCost) / data.totalProjectCost
          if (margin < 0.1) { // Less than 10% margin
            errors.push('Project margin appears too low (less than 10%)')
          }
          if (margin > 5) { // More than 500% margin
            errors.push('Project margin appears unrealistic (more than 500%)')
          }
        }
        break
        
      case 'unit':
        // Check if unit price is reasonable for the location
        if (data.price && data.developmentId) {
          const avgPrice = await db.prisma.$queryRaw`
            SELECT AVG(u.price) as avg_price
            FROM units u
            JOIN developments d ON u.development_id = d.id
            JOIN locations l ON d.location_id = l.id
            WHERE l.county = (
              SELECT l2.county 
              FROM developments d2 
              JOIN locations l2 ON d2.location_id = l2.id 
              WHERE d2.id = ${data.developmentId}
            )
            AND u.price IS NOT NULL
            AND u.bedrooms = ${data.bedrooms || 0}
          `
          
          const avgPriceValue = Array.isArray(avgPrice) && avgPrice[0] ? avgPrice[0].avg_price : null
          if (avgPriceValue && data.price > avgPriceValue * 2) {
            errors.push('Unit price is significantly higher than area average')
          }
          if (avgPriceValue && data.price < avgPriceValue * 0.5) {
            errors.push('Unit price is significantly lower than area average')
          }
        }
        break
        
      case 'transaction':
        // Check daily transaction limits
        if (data.amount > 50000) { // Large transaction
          const dailyTotal = await db.prisma.$queryRaw`
            SELECT COALESCE(SUM(amount), 0) as daily_total
            FROM financial_transactions
            WHERE user_id = ${data.userId}
              AND date >= CURRENT_DATE
              AND status = 'COMPLETED'
          `
          
          const dailyTotalValue = Array.isArray(dailyTotal) && dailyTotal[0] ? dailyTotal[0].daily_total : 0
          if (dailyTotalValue + data.amount > 500000) {
            errors.push('Daily transaction limit exceeded')
          }
        }
        break
    }
    
    return {
      isValid: errors.length === 0,
      errors,
      validatedData: data
    }
  }

  // Comprehensive validation combining schema and business rules
  static async validateEntity(entityType: string, data: any): Promise<ValidationResult> {
    let schemaResult: ValidationResult
    
    switch (entityType) {
      case 'user':
        schemaResult = await this.validateUser(data)
        break
      case 'location':
        schemaResult = await this.validateLocation(data)
        break
      case 'development':
        schemaResult = await this.validateDevelopment(data)
        break
      case 'unit':
        schemaResult = await this.validateUnit(data)
        break
      case 'transaction':
        schemaResult = await this.validateTransaction(data)
        break
      default:
        return {
          isValid: false,
          errors: ['Unknown entity type'],
          validatedData: null
        }
    }
    
    if (!schemaResult.isValid) {
      return schemaResult
    }
    
    // Check business rules
    const businessResult = await this.validateBusinessRules(entityType, schemaResult.validatedData)
    
    return {
      isValid: businessResult.isValid,
      errors: [...schemaResult.errors, ...businessResult.errors],
      validatedData: schemaResult.validatedData
    }
  }

  // Data quality monitoring
  static async runDataQualityChecks(): Promise<DataQualityReport> {
    // Simplified data quality checks for existing schema
    const violations: any[] = []
    
    // Check for users without email
    const usersWithoutEmail = await db.prisma.user.count({
      where: { email: { equals: null } }
    })
    
    if (usersWithoutEmail > 0) {
      violations.push({
        table: 'users',
        field: 'email',
        count: usersWithoutEmail,
        type: 'MISSING_REQUIRED_FIELD'
      })
    }
    
    // Check for developments without units
    const developmentsWithoutUnits = await db.prisma.development.count({
      where: { units: { none: {} } }
    })
    
    if (developmentsWithoutUnits > 0) {
      violations.push({
        table: 'developments',
        field: 'units',
        count: developmentsWithoutUnits,
        type: 'MISSING_RELATED_DATA'
      })
    }
    
    return {
      totalRules: 2, // Simplified rule count
      violationCount: violations.length,
      violations: violations.slice(0, 20),
      timestamp: new Date()
    }
  }

  // Simplified quality check helper
  private static async checkBasicDataIntegrity() {
    const issues = []
    
    // Check for orphaned units
    const orphanedUnits = await db.prisma.unit.count({
      where: {
        development: null
      }
    })
    
    if (orphanedUnits > 0) {
      issues.push({
        type: 'ORPHANED_RECORDS',
        table: 'units',
        count: orphanedUnits
      })
    }
    
    return issues
  }

  // Utility methods
  private static formatZodErrors(error: any): string[] {
    if (error.errors && Array.isArray(error.errors)) {
      return error.errors.map((err: any) => {
        if (err.path && err.path.length > 0) {
          return `${err.path.join('.')}: ${err.message}`
        }
        return err.message
      })
    }
    return [error.message || 'Validation error']
  }
}

// Types
export interface ValidationResult {
  isValid: boolean
  errors: string[]
  validatedData: any
}

export interface DataQualityReport {
  totalRules: number
  violationCount: number
  violations: any[]
  timestamp: Date
}

// Export validation functions for direct use
export const validateUser = DataValidationService.validateUser.bind(DataValidationService)
export const validateLocation = DataValidationService.validateLocation.bind(DataValidationService)
export const validateDevelopment = DataValidationService.validateDevelopment.bind(DataValidationService)
export const validateUnit = DataValidationService.validateUnit.bind(DataValidationService)
export const validateTransaction = DataValidationService.validateTransaction.bind(DataValidationService)
export const validateEntity = DataValidationService.validateEntity.bind(DataValidationService)
export const runDataQualityChecks = DataValidationService.runDataQualityChecks.bind(DataValidationService)