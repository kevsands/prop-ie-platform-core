// src/types/enums.ts
// Consolidated enum definitions for the PropIE platform
/**
 * Property Status Types
 * Represents the current status of a property in the sales process
 */
export var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["Available"] = "Available";
    PropertyStatus["Reserved"] = "Reserved";
    PropertyStatus["Sold"] = "Sold";
    PropertyStatus["UnderConstruction"] = "Under Construction";
    PropertyStatus["ComingSoon"] = "Coming Soon";
    PropertyStatus["OffMarket"] = "Off Market";
})(PropertyStatus || (PropertyStatus = {}));
/**
 * Property Types
 * Represents the type/category of a property
 */
export var PropertyType;
(function (PropertyType) {
    PropertyType["Apartment"] = "Apartment";
    PropertyType["House"] = "House";
    PropertyType["Townhouse"] = "Townhouse";
    PropertyType["Duplex"] = "Duplex";
    PropertyType["Villa"] = "Villa";
    PropertyType["Studio"] = "Studio";
    PropertyType["Penthouse"] = "Penthouse";
})(PropertyType || (PropertyType = {}));
/**
 * Development Status Types
 * Represents the current status of a development project
 */
export var DevelopmentStatus;
(function (DevelopmentStatus) {
    DevelopmentStatus["Planning"] = "Planning";
    DevelopmentStatus["Approved"] = "Approved";
    DevelopmentStatus["UnderConstruction"] = "Under Construction";
    DevelopmentStatus["Completed"] = "Completed";
    DevelopmentStatus["Selling"] = "Selling";
    DevelopmentStatus["SoldOut"] = "Sold Out";
})(DevelopmentStatus || (DevelopmentStatus = {}));
/**
 * User Roles
 * Defines the different roles users can have in the system
 */
export var UserRole;
(function (UserRole) {
    UserRole["Buyer"] = "buyer";
    UserRole["Investor"] = "investor";
    UserRole["Agent"] = "agent";
    UserRole["Developer"] = "developer";
    UserRole["Admin"] = "admin";
})(UserRole || (UserRole = {}));
/**
 * Customization Status
 * Represents the current status of a property customization
 */
export var CustomizationStatus;
(function (CustomizationStatus) {
    CustomizationStatus["Draft"] = "draft";
    CustomizationStatus["Submitted"] = "submitted";
    CustomizationStatus["Approved"] = "approved";
    CustomizationStatus["Rejected"] = "rejected";
})(CustomizationStatus || (CustomizationStatus = {}));
/**
 * Contract Status
 * Represents the current status of a contract document
 */
export var ContractStatus;
(function (ContractStatus) {
    ContractStatus["Draft"] = "draft";
    ContractStatus["Pending"] = "pending";
    ContractStatus["Signed"] = "signed";
    ContractStatus["Expired"] = "expired";
    ContractStatus["Canceled"] = "canceled";
})(ContractStatus || (ContractStatus = {}));
