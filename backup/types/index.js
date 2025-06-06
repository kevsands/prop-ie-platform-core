// src/types/index.ts
// Consolidated type definitions for your property platform
// Property Status Types
export var PropertyStatus;
(function (PropertyStatus) {
    PropertyStatus["Available"] = "Available";
    PropertyStatus["Reserved"] = "Reserved";
    PropertyStatus["Sold"] = "Sold";
    PropertyStatus["UnderConstruction"] = "Under Construction";
    PropertyStatus["ComingSoon"] = "Coming Soon";
    PropertyStatus["OffMarket"] = "Off Market";
})(PropertyStatus || (PropertyStatus = {}));
// Property Types
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
