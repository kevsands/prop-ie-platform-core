// src/types/enums.ts
// Consolidated enum definitions for the PropIE platform

/**
 * Property Status Types
 * Represents the current status of a property in the sales process
 */
export enum PropertyStatus {
    Available = "Available",
    Reserved = "Reserved",
    Sold = "Sold",
    UnderConstruction = "Under Construction",
    ComingSoon = "Coming Soon",
    OffMarket = "Off Market"
  }
  
  /**
   * Property Types
   * Represents the type/category of a property
   */
  export enum PropertyType {
    Apartment = "Apartment",
    House = "House",
    Townhouse = "Townhouse",
    Duplex = "Duplex",
    Villa = "Villa",
    Studio = "Studio",
    Penthouse = "Penthouse"
  }
  
  /**
   * Development Status Types
   * Represents the current status of a development project
   */
  export enum DevelopmentStatus {
    Planning = "Planning",
    Approved = "Approved",
    UnderConstruction = "Under Construction",
    Completed = "Completed",
    Selling = "Selling",
    SoldOut = "Sold Out"
  }
  
  /**
   * User Roles
   * Defines the different roles users can have in the system
   */
  export enum UserRole {
    Buyer = "buyer",
    Investor = "investor",
    Agent = "agent",
    Developer = "developer",
    Admin = "admin"
  }
  
  /**
   * Customization Status
   * Represents the current status of a property customization
   */
  export enum CustomizationStatus {
    Draft = "draft",
    Submitted = "submitted",
    Approved = "approved",
    Rejected = "rejected"
  }
  
  /**
   * Contract Status
   * Represents the current status of a contract document
   */
  export enum ContractStatus {
    Draft = "draft",
    Pending = "pending",
    Signed = "signed",
    Expired = "expired",
    Canceled = "canceled"
  }