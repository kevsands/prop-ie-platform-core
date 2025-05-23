/**
 * Mock Service Worker handlers for API mocking in tests
 */
import { http, graphql, HttpResponse } from 'msw';
import { userRepository, developmentRepository, unitRepository, documentRepository, financialRepository } from './repositories';

// Default mock data
import { User } from '@/types/core/user';

// API endpoint handlers
export const apiHandlers = [
  // User endpoints
  http.get('/api/users', () => {
    return HttpResponse.json(userRepository.findAll());
  }),
  
  http.get('/api/users/:id', ({ params }) => {
    const { id } = params;
    const user = userRepository.findById(id as string);
    
    if (!user) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(user);
  }),
  
  http.post('/api/users', async ({ request }) => {
    const userData = await request.json();
    const newUser = await userRepository.create(userData);
    return HttpResponse.json(newUser, { status: 201 });
  }),
  
  http.put('/api/users/:id', async ({ params, request }) => {
    const { id } = params;
    const userData = await request.json();
    const updatedUser = await userRepository.update(id as stringuserData);
    
    if (!updatedUser) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(updatedUser);
  }),
  
  http.delete('/api/users/:id', ({ params }) => {
    const { id } = params;
    const success = userRepository.delete(id as string);
    
    if (!success) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return new HttpResponse(null, { status: 204 });
  }),
  
  // Development endpoints
  http.get('/api/developments', () => {
    return HttpResponse.json(developmentRepository.findAll());
  }),
  
  http.get('/api/developments/:id', ({ params }) => {
    const { id } = params;
    const development = developmentRepository.findById(id as string);
    
    if (!development) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(development);
  }),
  
  // Unit endpoints
  http.get('/api/units', () => {
    return HttpResponse.json(unitRepository.findAll());
  }),
  
  http.get('/api/units/:id', ({ params }) => {
    const { id } = params;
    const unit = unitRepository.findById(id as string);
    
    if (!unit) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(unit);
  }),
  
  http.get('/api/developments/:id/units', ({ params }) => {
    const { id } = params;
    const units = unitRepository.findByDevelopmentId(id as string);
    return HttpResponse.json(units);
  }),
  
  // Document endpoints
  http.get('/api/documents', () => {
    return HttpResponse.json(documentRepository.findAll());
  }),
  
  http.get('/api/documents/:id', ({ params }) => {
    const { id } = params;
    const document = documentRepository.findById(id as string);
    
    if (!document) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(document);
  }),
  
  // Financial endpoints
  http.get('/api/financials', () => {
    return HttpResponse.json(financialRepository.findAll());
  }),
  
  http.get('/api/financials/:id', ({ params }) => {
    const { id } = params;
    const financial = financialRepository.findById(id as string);
    
    if (!financial) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(financial);
  }),
  
  http.get('/api/developments/:id/financials', ({ params }) => {
    const { id } = params;
    const financial = financialRepository.findByDevelopmentId(id as string);
    
    if (!financial) {
      return new HttpResponse(null, { status: 404 });
    }
    
    return HttpResponse.json(financial);
  })];

// GraphQL handlers
export const graphqlHandlers = [
  // User queries
  graphql.query('GetUsers', () => {
    return HttpResponse.json({
      data: {
        users: userRepository.findAll()});
  }),
  
  graphql.query('GetUser', ({ variables }) => {
    const user = userRepository.findById(variables.id);
    
    if (!user) {
      return HttpResponse.json({
        data: { user: null },
        errors: [{ message: 'User not found' }]});
    }
    
    return HttpResponse.json({
      data: { user });
  }),
  
  graphql.mutation('CreateUser', ({ variables }) => {
    const newUser = userRepository.create(variables.input);
    
    return HttpResponse.json({
      data: { createUser: newUser });
  }),
  
  graphql.mutation('UpdateUser', ({ variables }) => {
    const updatedUser = userRepository.update(variables.id, variables.input);
    
    if (!updatedUser) {
      return HttpResponse.json({
        data: { updateUser: null },
        errors: [{ message: 'User not found' }]});
    }
    
    return HttpResponse.json({
      data: { updateUser: updatedUser });
  }),
  
  graphql.mutation('DeleteUser', ({ variables }) => {
    const success = userRepository.delete(variables.id);
    
    if (!success) {
      return HttpResponse.json({
        data: { deleteUser: false },
        errors: [{ message: 'User not found' }]});
    }
    
    return HttpResponse.json({
      data: { deleteUser: true });
  }),
  
  // Development queries
  graphql.query('GetDevelopments', () => {
    return HttpResponse.json({
      data: {
        developments: developmentRepository.findAll()});
  }),
  
  graphql.query('GetDevelopment', ({ variables }) => {
    const development = developmentRepository.findById(variables.id);
    
    if (!development) {
      return HttpResponse.json({
        data: { development: null },
        errors: [{ message: 'Development not found' }]});
    }
    
    return HttpResponse.json({
      data: { development });
  }),
  
  // Unit queries
  graphql.query('GetUnits', () => {
    return HttpResponse.json({
      data: {
        units: unitRepository.findAll()});
  }),
  
  graphql.query('GetUnitsByDevelopment', ({ variables }) => {
    const units = unitRepository.findByDevelopmentId(variables.developmentId);
    
    return HttpResponse.json({
      data: { units });
  }),
  
  // Document queries
  graphql.query('GetDocuments', () => {
    return HttpResponse.json({
      data: {
        documents: documentRepository.findAll()});
  }),
  
  // Financial queries
  graphql.query('GetFinancialsByDevelopment', ({ variables }) => {
    const financial = financialRepository.findByDevelopmentId(variables.developmentId);
    
    if (!financial) {
      return HttpResponse.json({
        data: { financial: null },
        errors: [{ message: 'Financial data not found' }]});
    }
    
    return HttpResponse.json({
      data: { financial });
  })];

// Combined handlers for easy setup
export const handlers = [...apiHandlers, ...graphqlHandlers];