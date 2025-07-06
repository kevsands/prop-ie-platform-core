// __tests__/mocks/handlers.js
import { rest, graphql } from 'msw';

// Mock base URLs
const API_BASE_URL = 'https://api.prop-ie-app.com';
const GRAPHQL_URL = 'https://api.prop-ie-app.com/graphql';

// Mock user data
const mockUsers = [
  {
    id: 'user-1',
    email: 'buyer@example.com',
    username: 'buyer',
    role: 'buyer',
    firstName: 'John',
    lastName: 'Buyer'
  },
  {
    id: 'user-2',
    email: 'agent@example.com',
    username: 'agent',
    role: 'agent',
    firstName: 'Sarah',
    lastName: 'Agent'
  },
  {
    id: 'user-3',
    email: 'developer@example.com',
    username: 'developer',
    role: 'developer',
    firstName: 'Mike',
    lastName: 'Developer'
  }
];

// Mock properties data
const mockProperties = [
  {
    id: 'property-1',
    title: 'Modern 3-Bedroom Home',
    description: 'A beautiful modern home with 3 bedrooms',
    price: 350000,
    address: '123 Main St, Dublin',
    bedrooms: 3,
    bathrooms: 2,
    type: 'house',
    status: 'available',
    developmentId: 'dev-1'
  },
  {
    id: 'property-2',
    title: 'City Center Apartment',
    description: 'Luxury apartment in the heart of the city',
    price: 275000,
    address: '45 City Lane, Dublin',
    bedrooms: 2,
    bathrooms: 1,
    type: 'apartment',
    status: 'reserved',
    developmentId: 'dev-1'
  },
  {
    id: 'property-3',
    title: 'Family Suburban Home',
    description: 'Spacious family home in a quiet suburb',
    price: 425000,
    address: '78 Oak Road, Galway',
    bedrooms: 4,
    bathrooms: 3,
    type: 'house',
    status: 'available',
    developmentId: 'dev-2'
  }
];

// Mock developments data
const mockDevelopments = [
  {
    id: 'dev-1',
    name: 'FitzGerald Gardens',
    description: 'A new development of modern homes in Dublin',
    location: 'Dublin, Ireland',
    status: 'selling',
    unitsTotal: 45,
    unitsSold: 22,
    unitsAvailable: 23,
    mainImage: '/public/images/developments/fitzgerald-gardens/hero.jpeg'
  },
  {
    id: 'dev-2',
    name: 'Riverside Manor',
    description: 'Luxury riverside properties in Galway',
    location: 'Galway, Ireland',
    status: 'selling',
    unitsTotal: 30,
    unitsSold: 10,
    unitsAvailable: 20,
    mainImage: '/public/images/developments/riverside-manor/hero.jpg'
  },
  {
    id: 'dev-3',
    name: 'Ballymakenny View',
    description: 'Contemporary homes with stunning views',
    location: 'Drogheda, Ireland',
    status: 'coming_soon',
    unitsTotal: 50,
    unitsSold: 0,
    unitsAvailable: 50,
    mainImage: '/public/images/developments/ballymakenny-view/hero.jpg'
  }
];

// Mock customization options
const mockCustomizationOptions = [
  {
    id: 'opt-1',
    category: 'kitchen',
    name: 'Kitchen Countertops',
    options: [
      { id: 'k-ct-1', name: 'Granite', price: 3000 },
      { id: 'k-ct-2', name: 'Quartz', price: 4500 },
      { id: 'k-ct-3', name: 'Marble', price: 6000 }
    ]
  },
  {
    id: 'opt-2',
    category: 'flooring',
    name: 'Living Room Flooring',
    options: [
      { id: 'f-lr-1', name: 'Hardwood', price: 5000 },
      { id: 'f-lr-2', name: 'Engineered Wood', price: 3500 },
      { id: 'f-lr-3', name: 'Luxury Vinyl', price: 2500 }
    ]
  },
  {
    id: 'opt-3',
    category: 'bathroom',
    name: 'Bathroom Fixtures',
    options: [
      { id: 'b-fix-1', name: 'Standard Package', price: 1500 },
      { id: 'b-fix-2', name: 'Premium Package', price: 3000 },
      { id: 'b-fix-3', name: 'Luxury Package', price: 4500 }
    ]
  }
];

// Helper to simulate authentication token
const getTokenFromRequest = (req) => {
  const authHeader = req.headers.get('Authorization');
  return authHeader?.replace('Bearer ', '');
};

// Helper to get mock user from token
const getUserFromToken = (token) => {
  if (!token) return null;
  // In real app, would validate JWT. For testing, we use a simple mapping
  const tokenToUserMap = {
    'buyer-token': mockUsers[0],
    'agent-token': mockUsers[1],
    'developer-token': mockUsers[2]
  };
  return tokenToUserMap[token] || null;
};

// REST API handlers
export const handlers = [
  // Authentication endpoints
  rest.post(`${API_BASE_URL}/api/auth/login`, (req, res, ctx) => {
    return req.json().then(data => {
      const { email, password } = data;
      
      // Simple mock authentication
      if (email === 'buyer@example.com' && password === 'password') {
        return res(
          ctx.status(200),
          ctx.json({
            user: mockUsers[0],
            token: 'buyer-token'
          })
        );
      } else if (email === 'agent@example.com' && password === 'password') {
        return res(
          ctx.status(200),
          ctx.json({
            user: mockUsers[1],
            token: 'agent-token'
          })
        );
      } else if (email === 'developer@example.com' && password === 'password') {
        return res(
          ctx.status(200),
          ctx.json({
            user: mockUsers[2],
            token: 'developer-token'
          })
        );
      } else {
        return res(
          ctx.status(401),
          ctx.json({
            message: 'Invalid email or password'
          })
        );
      }
    });
  }),

  rest.post(`${API_BASE_URL}/api/auth/register`, (req, res, ctx) => {
    return req.json().then(data => {
      // Simple validation
      if (!data.email || !data.password) {
        return res(
          ctx.status(400),
          ctx.json({
            message: 'Email and password are required'
          })
        );
      }
      
      // Check if email is already used
      const emailExists = mockUsers.some(user => user.email === data.email);
      if (emailExists) {
        return res(
          ctx.status(409),
          ctx.json({
            message: 'Email already registered'
          })
        );
      }
      
      // Success case - would create user in real app
      return res(
        ctx.status(201),
        ctx.json({
          message: 'User registered successfully',
          user: {
            id: 'new-user-id',
            email: data.email,
            role: 'buyer',
            firstName: data.firstName || '',
            lastName: data.lastName || ''
          }
        })
      );
    });
  }),

  // User endpoints
  rest.get(`${API_BASE_URL}/api/users/me`, (req, res, ctx) => {
    const token = getTokenFromRequest(req);
    const user = getUserFromToken(token);
    
    if (!user) {
      return res(
        ctx.status(401),
        ctx.json({
          message: 'Unauthorized'
        })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        user
      })
    );
  }),

  // Properties endpoints
  rest.get(`${API_BASE_URL}/api/properties`, (req, res, ctx) => {
    // Optional query parameters for filtering
    const status = req.url.searchParams.get('status');
    const type = req.url.searchParams.get('type');
    const developmentId = req.url.searchParams.get('developmentId');
    
    let filteredProperties = [...mockProperties];
    
    if (status) {
      filteredProperties = filteredProperties.filter(p => p.status === status);
    }
    
    if (type) {
      filteredProperties = filteredProperties.filter(p => p.type === type);
    }
    
    if (developmentId) {
      filteredProperties = filteredProperties.filter(p => p.developmentId === developmentId);
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        properties: filteredProperties
      })
    );
  }),

  rest.get(`${API_BASE_URL}/api/properties/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const property = mockProperties.find(p => p.id === id);
    
    if (!property) {
      return res(
        ctx.status(404),
        ctx.json({
          message: 'Property not found'
        })
      );
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        property
      })
    );
  }),

  // Developments endpoints
  rest.get(`${API_BASE_URL}/api/developments`, (req, res, ctx) => {
    // Optional query parameters for filtering
    const status = req.url.searchParams.get('status');
    
    let filteredDevelopments = [...mockDevelopments];
    
    if (status) {
      filteredDevelopments = filteredDevelopments.filter(d => d.status === status);
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        developments: filteredDevelopments
      })
    );
  }),

  rest.get(`${API_BASE_URL}/api/developments/:id`, (req, res, ctx) => {
    const { id } = req.params;
    const development = mockDevelopments.find(d => d.id === id);
    
    if (!development) {
      return res(
        ctx.status(404),
        ctx.json({
          message: 'Development not found'
        })
      );
    }
    
    // Get properties for this development
    const properties = mockProperties.filter(p => p.developmentId === id);
    
    return res(
      ctx.status(200),
      ctx.json({
        development,
        properties
      })
    );
  }),

  // Customization endpoints
  rest.get(`${API_BASE_URL}/api/customization/options`, (req, res, ctx) => {
    const propertyId = req.url.searchParams.get('propertyId');
    
    // In a real app, we'd filter options based on property type
    // For mock purposes, we return all options
    
    return res(
      ctx.status(200),
      ctx.json({
        options: mockCustomizationOptions
      })
    );
  }),

  rest.post(`${API_BASE_URL}/api/customization/save`, (req, res, ctx) => {
    return req.json().then(data => {
      const token = getTokenFromRequest(req);
      const user = getUserFromToken(token);
      
      if (!user) {
        return res(
          ctx.status(401),
          ctx.json({
            message: 'Unauthorized'
          })
        );
      }
      
      if (!data.propertyId || !data.selections) {
        return res(
          ctx.status(400),
          ctx.json({
            message: 'Property ID and selections are required'
          })
        );
      }
      
      // In a real app, save selections to database
      return res(
        ctx.status(200),
        ctx.json({
          message: 'Customization options saved successfully',
          customizationId: 'custom-123'
        })
      );
    });
  }),

  // HTB (Help to Buy) endpoints
  rest.post(`${API_BASE_URL}/api/htb-claims/initiate`, (req, res, ctx) => {
    return req.json().then(data => {
      const token = getTokenFromRequest(req);
      const user = getUserFromToken(token);
      
      if (!user) {
        return res(
          ctx.status(401),
          ctx.json({
            message: 'Unauthorized'
          })
        );
      }
      
      if (!data.propertyId || !data.amount) {
        return res(
          ctx.status(400),
          ctx.json({
            message: 'Property ID and amount are required'
          })
        );
      }
      
      // In a real app, initiate HTB claim process
      return res(
        ctx.status(200),
        ctx.json({
          message: 'HTB claim initiated successfully',
          claimId: 'htb-claim-123',
          status: 'initiated',
          nextSteps: [
            'Upload identification documents',
            'Complete eligibility form'
          ]
        })
      );
    });
  }),

  rest.get(`${API_BASE_URL}/api/htb-claims/:id/status`, (req, res, ctx) => {
    const { id } = req.params;
    const token = getTokenFromRequest(req);
    const user = getUserFromToken(token);
    
    if (!user) {
      return res(
        ctx.status(401),
        ctx.json({
          message: 'Unauthorized'
        })
      );
    }
    
    // Mock HTB claim status
    return res(
      ctx.status(200),
      ctx.json({
        claimId: id,
        status: 'in_progress',
        stage: 'document_verification',
        completedSteps: ['initiation', 'application_submission'],
        pendingSteps: ['document_verification', 'approval', 'payment'],
        estimatedCompletionDate: '2025-06-15'
      })
    );
  }),

  // Developer endpoints (protected by role)
  rest.get(`${API_BASE_URL}/api/developer/projects`, (req, res, ctx) => {
    const token = getTokenFromRequest(req);
    const user = getUserFromToken(token);
    
    if (!user) {
      return res(
        ctx.status(401),
        ctx.json({
          message: 'Unauthorized'
        })
      );
    }
    
    if (user.role !== 'developer') {
      return res(
        ctx.status(403),
        ctx.json({
          message: 'Forbidden - Developer role required'
        })
      );
    }
    
    // Return developer projects (using mock developments)
    return res(
      ctx.status(200),
      ctx.json({
        projects: mockDevelopments
      })
    );
  }),

  // Documents endpoints
  rest.get(`${API_BASE_URL}/api/documents`, (req, res, ctx) => {
    const token = getTokenFromRequest(req);
    const user = getUserFromToken(token);
    
    if (!user) {
      return res(
        ctx.status(401),
        ctx.json({
          message: 'Unauthorized'
        })
      );
    }
    
    // Mock documents based on user role
    let documents = [];
    
    if (user.role === 'buyer') {
      documents = [
        { id: 'doc-1', name: 'Purchase Agreement', status: 'signed', type: 'legal', createdAt: '2025-05-01' },
        { id: 'doc-2', name: 'Mortgage Approval', status: 'pending', type: 'financial', createdAt: '2025-05-02' }
      ];
    } else if (user.role === 'agent') {
      documents = [
        { id: 'doc-3', name: 'Client Contracts', status: 'active', type: 'legal', createdAt: '2025-04-15' },
        { id: 'doc-4', name: 'Property Listings', status: 'active', type: 'marketing', createdAt: '2025-04-20' }
      ];
    } else if (user.role === 'developer') {
      documents = [
        { id: 'doc-5', name: 'Development Plans', status: 'approved', type: 'planning', createdAt: '2025-03-10' },
        { id: 'doc-6', name: 'Construction Timeline', status: 'active', type: 'project', createdAt: '2025-03-15' }
      ];
    }
    
    return res(
      ctx.status(200),
      ctx.json({
        documents
      })
    );
  })
];

// GraphQL handlers
export const graphqlHandlers = [
  graphql.query('GetUserProfile', (req, res, ctx) => {
    const token = getTokenFromRequest(req);
    const user = getUserFromToken(token);
    
    if (!user) {
      return res(
        ctx.errors([
          {
            message: 'Unauthorized',
            extensions: {
              code: 'UNAUTHORIZED'
            }
          }
        ])
      );
    }
    
    return res(
      ctx.data({
        getUserProfile: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role
        }
      })
    );
  }),
  
  graphql.query('GetProperties', (req, res, ctx) => {
    const { status, type, limit } = req.variables;
    
    let filteredProperties = [...mockProperties];
    
    if (status) {
      filteredProperties = filteredProperties.filter(p => p.status === status);
    }
    
    if (type) {
      filteredProperties = filteredProperties.filter(p => p.type === type);
    }
    
    if (limit) {
      filteredProperties = filteredProperties.slice(0, limit);
    }
    
    return res(
      ctx.data({
        properties: filteredProperties
      })
    );
  }),
  
  graphql.query('GetDevelopments', (req, res, ctx) => {
    const { status, limit } = req.variables;
    
    let filteredDevelopments = [...mockDevelopments];
    
    if (status) {
      filteredDevelopments = filteredDevelopments.filter(d => d.status === status);
    }
    
    if (limit) {
      filteredDevelopments = filteredDevelopments.slice(0, limit);
    }
    
    return res(
      ctx.data({
        developments: filteredDevelopments
      })
    );
  }),
  
  graphql.mutation('SaveCustomization', (req, res, ctx) => {
    const { propertyId, selections } = req.variables;
    const token = getTokenFromRequest(req);
    const user = getUserFromToken(token);
    
    if (!user) {
      return res(
        ctx.errors([
          {
            message: 'Unauthorized',
            extensions: {
              code: 'UNAUTHORIZED'
            }
          }
        ])
      );
    }
    
    if (!propertyId || !selections || !selections.length) {
      return res(
        ctx.errors([
          {
            message: 'Invalid input data',
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          }
        ])
      );
    }
    
    return res(
      ctx.data({
        saveCustomization: {
          id: 'custom-123',
          propertyId,
          selections,
          createdAt: new Date().toISOString(),
          userId: user.id
        }
      })
    );
  })
];

// Combine REST and GraphQL handlers
export const allHandlers = [...handlers, ...graphqlHandlers];