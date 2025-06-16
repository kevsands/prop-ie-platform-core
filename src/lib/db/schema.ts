import { Pool } from "pg";
import { drizzle } from "drizzle-orm/node-postgres";
import { pgTable, text, integer, timestamp } from "drizzle-orm/pg-core";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";

// Define users table
export const users = pgTable("users", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  role: text("role").notNull().default("buyer"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()});

// Define properties table
export const properties = pgTable("properties", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  location: text("location").notNull(),
  price: integer("price").notNull(),
  bedrooms: integer("bedrooms").notNull(),
  bathrooms: integer("bathrooms").notNull(),
  area: integer("area").notNull(),
  developerId: text("developer_id")
    .notNull()
    .references(() => users.id),
  status: text("status").notNull().default("available"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()});

// Define HTB claims table
export const htbClaims = pgTable("htb_claims", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id),
  claimCode: text("claim_code").notNull(),
  status: text("status").notNull().default("pending"),
  amount: integer("amount").notNull(),
  submissionDate: timestamp("submission_date")
    .notNull()
    .defaultNow(),
  approvalDate: timestamp("approval_date"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()});

// Define customizations table
export const customizations = pgTable("customizations", {
  id: text("id").primaryKey(),
  userId: text("user_id")
    .notNull()
    .references(() => users.id),
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id),
  options: text("options").notNull(),
  totalCost: integer("total_cost").notNull(),
  status: text("status").notNull().default("draft"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()});

// Define documents table
export const documents = pgTable("documents", {
  id: text("id").primaryKey(),
  title: text("title").notNull(),
  type: text("type").notNull(),
  url: text("url").notNull(),
  propertyId: text("property_id")
    .notNull()
    .references(() => properties.id),
  uploadedBy: text("uploaded_by")
    .notNull()
    .references(() => users.id),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()});

// Define contractors table
export const contractors = pgTable("contractors", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  specialty: text("specialty").notNull(),
  contactEmail: text("contact_email").notNull(),
  contactPhone: text("contact_phone").notNull(),
  rating: integer("rating"),
  developerId: text("developer_id")
    .notNull()
    .references(() => users.id),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow()});

let dbClient: NodePgDatabase<any>
  );
export function initializeDb(): NodePgDatabase<any> {
  if (!dbClient) {
    const pool = new Pool({ connectionString: process.env.DATABASE_URL! });
    dbClient = drizzle(pool);
  }
  return dbClient;
}
