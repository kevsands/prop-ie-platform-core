'use client';

import { BuyerJourney, BuyerPhase, AffordabilityCheck, MortgageApplication } from '@/types/buyer-journey';

// Real database connection for buyer journey data
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database helper functions
const getDatabase = () => {
  const dbPath = path.join(process.cwd(), 'prisma/dev.db');
  return new sqlite3.Database(dbPath);
};

class JourneyService {
  // Get the buyer's journey data from real database
  async getBuyerJourney(buyerId: string): Promise<BuyerJourney> {
    const db = getDatabase();
    
    return new Promise((resolve, reject) => {
      // Check if buyer journey exists in database
      db.get(`
        SELECT bj.*, u.email, u.firstName, u.lastName 
        FROM BuyerJourney bj 
        LEFT JOIN User u ON bj.userId = u.id 
        WHERE bj.userId = ?
      `, [buyerId], (err: any, journey: any) => {
        if (err) {
          // If no journey exists or error, create a new one
          const newJourney: BuyerJourney = {
            id: `journey-${buyerId}`,
            buyerId,
            currentPhase: 'PLANNING' as BuyerPhase,
            startDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            targetMoveInDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(), // 90 days from now
            phaseHistory: [
              {
                id: `phase-planning-${Date.now()}`,
                journeyId: `journey-${buyerId}`,
                phase: 'PLANNING' as BuyerPhase,
                startDate: new Date().toISOString(),
                completedTasks: {
                  profileCompleted: false,
                  budgetCalculated: false,
                  preferencesSet: false
                }
              }
            ]
          };
          
          db.close();
          resolve(newJourney);
          return;
        }

        if (!journey) {
          // Create new journey for first-time user
          const newJourney: BuyerJourney = {
            id: `journey-${buyerId}`,
            buyerId,
            currentPhase: 'PLANNING' as BuyerPhase,
            startDate: new Date().toISOString(),
            lastUpdated: new Date().toISOString(),
            targetMoveInDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            phaseHistory: [
              {
                id: `phase-planning-${Date.now()}`,
                journeyId: `journey-${buyerId}`,
                phase: 'PLANNING' as BuyerPhase,
                startDate: new Date().toISOString(),
                completedTasks: {
                  profileCompleted: false,
                  budgetCalculated: false,
                  preferencesSet: false
                }
              }
            ]
          };
          
          db.close();
          resolve(newJourney);
          return;
        }

        // Get any reservations for this buyer to determine current phase
        db.all(`
          SELECT r.*, u.name as unitName, u.price, d.name as developmentName
          FROM Reservation r
          LEFT JOIN Unit u ON r.unitId = u.id
          LEFT JOIN Development d ON u.developmentId = d.id
          WHERE r.userId = ?
          ORDER BY r.createdAt DESC
        `, [buyerId], (err: any, reservations: any[]) => {
          if (err) {
            console.error('Error fetching reservations:', err);
          }

          // Determine current phase based on reservations and journey data
          let currentPhase: BuyerPhase = journey.stage || 'PLANNING';
          let phaseHistory = [];

          if (reservations && reservations.length > 0) {
            const latestReservation = reservations[0];
            
            // Update phase based on reservation status
            switch (latestReservation.status) {
              case 'ACTIVE':
                currentPhase = 'LEGAL_PROCESS';
                break;
              case 'PENDING':
                currentPhase = 'PROPERTY_RESERVED';
                break;
              default:
                currentPhase = 'PROPERTY_SEARCH';
            }

            // Build phase history based on progress
            phaseHistory = [
              {
                id: 'phase-planning',
                journeyId: journey.id,
                phase: 'PLANNING' as BuyerPhase,
                startDate: journey.createdAt,
                endDate: journey.createdAt,
                completedTasks: {
                  profileCompleted: true,
                  budgetCalculated: true,
                  preferencesSet: true
                }
              },
              {
                id: 'phase-financing',
                journeyId: journey.id,
                phase: 'FINANCING' as BuyerPhase,
                startDate: journey.createdAt,
                endDate: journey.createdAt,
                completedTasks: {
                  lendersResearched: true,
                  htbChecked: latestReservation.price <= 500000 // HTB eligible if under €500k
                }
              },
              {
                id: 'phase-search',
                journeyId: journey.id,
                phase: 'PROPERTY_SEARCH' as BuyerPhase,
                startDate: journey.createdAt,
                endDate: latestReservation.createdAt,
                completedTasks: {
                  propertiesViewed: true,
                  shortlistCreated: true,
                  viewingsScheduled: true
                }
              }
            ];

            if (latestReservation.status === 'ACTIVE' || latestReservation.status === 'PENDING') {
              phaseHistory.push({
                id: 'phase-reserved',
                journeyId: journey.id,
                phase: 'PROPERTY_RESERVED' as BuyerPhase,
                startDate: latestReservation.createdAt,
                completedTasks: {
                  propertySelected: true,
                  reservationCompleted: true,
                  depositPaid: true
                }
              });
            }
          } else {
            // No reservations - still in early stages
            phaseHistory = [
              {
                id: 'phase-planning',
                journeyId: journey.id,
                phase: 'PLANNING' as BuyerPhase,
                startDate: journey.createdAt,
                completedTasks: {
                  profileCompleted: true,
                  budgetCalculated: false,
                  preferencesSet: false
                }
              }
            ];
          }

          const buyerJourney: BuyerJourney = {
            id: journey.id,
            buyerId: journey.userId,
            currentPhase,
            startDate: journey.createdAt,
            lastUpdated: journey.updatedAt,
            targetMoveInDate: journey.targetMoveInDate || new Date(Date.now() + 90 * 24 * 60 * 60 * 1000).toISOString(),
            phaseHistory,
            currentReservation: reservations && reservations.length > 0 ? {
              unitId: reservations[0].unitId,
              unitName: reservations[0].unitName,
              price: reservations[0].price,
              developmentName: reservations[0].developmentName,
              status: reservations[0].status,
              reservationDate: reservations[0].createdAt
            } : undefined
          };

          db.close();
          resolve(buyerJourney);
        });
      });
    });
  }
  
  // Update the buyer's current phase
  async updateBuyerPhase(journeyId: string, phase: BuyerPhase): Promise<BuyerJourney> {
    // This would make an API call in production
    // return fetch(`/api/buyer/journey/${journeyId}/phase`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ phase })
    // }).then(res => res.json());
    
    // Mock response
    return {
      id: journeyId,
      buyerId: 'user-123',
      currentPhase: phase,
      startDate: new Date('2025-05-01').toISOString(),
      lastUpdated: new Date().toISOString(),
      targetMoveInDate: new Date('2025-08-15').toISOString()
    };
  }
  
  // Add an affordability check
  async addAffordabilityCheck(check: Omit<AffordabilityCheck, 'id' | 'created'>): Promise<AffordabilityCheck> {
    // Mock response
    return {
      ...check,
      id: 'check-' + Math.random().toString(36).substr(2, 9),
      created: new Date().toISOString()
    };
  }
  
  // Add a mortgage application
  async addMortgageApplication(application: Omit<MortgageApplication, 'id' | 'created' | 'updated'>): Promise<MortgageApplication> {
    // Mock response
    return {
      ...application,
      id: 'mortgage-' + Math.random().toString(36).substr(2, 9),
      created: new Date().toISOString(),
      updated: new Date().toISOString()
    };
  }
  
  // Get completed tasks for a specific phase
  async getPhaseCompletedTasks(journeyId: string, phase: BuyerPhase): Promise<string[]> {
    // Mock data
    const mockTasksByPhase: Record<BuyerPhase, string[]> = {
      'PLANNING': ['Create account', 'Complete initial assessment'],
      'FINANCING': ['Research mortgage options', 'Calculate affordability'],
      'PROPERTY_SEARCH': [],
      'RESERVATION': [],
      'LEGAL_PROCESS': [],
      'CONSTRUCTION': [],
      'COMPLETION': [],
      'POST_PURCHASE': []
    };
    
    return mockTasksByPhase[phase] || [];
  }
  
  // Get next steps for a specific phase
  async getPhaseNextSteps(journeyId: string, phase: BuyerPhase): Promise<string[]> {
    // Mock data
    const mockNextStepsByPhase: Record<BuyerPhase, string[]> = {
      'PLANNING': [
        'Complete your financial profile',
        'Set your budget and preferences',
        'Learn about the home buying process'
      ],
      'FINANCING': [
        'Submit mortgage application',
        'Gather supporting financial documents',
        'Apply for Help-to-Buy scheme'
      ],
      'PROPERTY_SEARCH': [
        'Schedule property viewings',
        'Compare developments and units',
        'Explore customization options'
      ],
      'RESERVATION': [
        'Pay reservation fee',
        'Confirm property details',
        'Review customization options'
      ],
      'LEGAL_PROCESS': [
        'Appoint a solicitor',
        'Review and sign contracts',
        'Complete legal checks'
      ],
      'CONSTRUCTION': [
        'Track building progress',
        'Attend site inspections',
        'Prepare for snagging'
      ],
      'COMPLETION': [
        'Prepare final payment',
        'Schedule move-in date',
        'Plan your move'
      ],
      'POST_PURCHASE': [
        'Complete snagging list',
        'Set up utilities',
        'Register for local services'
      ]
    };
    
    return mockNextStepsByPhase[phase] || [];
  }
}

// Export as a singleton
export const journeyService = new JourneyService();