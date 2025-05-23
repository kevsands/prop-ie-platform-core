/**
 * GraphQL resolver index
 * 
 * This file merges all resolvers for the PropIE GraphQL API.
 */

import { baseResolvers } from './base';
import userResolvers from './user';
import developmentResolvers from './development';
import buyerResolvers from './buyer';

// Merge all resolvers
const resolvers = {
  ...baseResolvers,
  Query: {
    ...baseResolvers.Query,
    ...userResolvers.Query,
    ...developmentResolvers.Query,
    ...buyerResolvers.Query},
  Mutation: {
    ...userResolvers.Mutation,
    ...developmentResolvers.Mutation,
    ...buyerResolvers.Mutation},
  User: userResolvers.User,
  Development: developmentResolvers.Development,
  BuyerProfile: buyerResolvers.BuyerProfile,
  Reservation: buyerResolvers.Reservation,
  MortgageTracking: buyerResolvers.MortgageTracking,
  SnagList: buyerResolvers.SnagList,
  SnagItem: buyerResolvers.SnagItem,
  HomePackItem: buyerResolvers.HomePackItem};

export default resolvers;