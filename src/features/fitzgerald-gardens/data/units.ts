import { FitzgeraldPropertyUnit, FITZGERALD_UNIT_PRICES, FitzgeraldHouseDescription } from '@/core/types/fitzgerald';

// Helper function to find price and sqm based on description
const getUnitDetails = (description: FitzgeraldHouseDescription): { price: number; sqm: number } => {
  const details = FITZGERALD_UNIT_PRICES.find(p => p.description === description);
  if (!details) {
    // Fallback or error handling if a description doesn't match predefined prices
    // This shouldn't happen if all descriptions in mapHouseTypeToDetails are in FITZGERALD_UNIT_PRICES
    console.error(`No pricing found for description: ${description}`);
    return { price: 0, sqm: 0 };
  }
  return { price: details.basePrice, sqm: details.sqm };
};

// Helper function to map raw House Type and SubType from PDF to standardized Description
const mapHouseTypeToDetails = (houseTypeCol: string, houseSubTypeCol: string | null): { description: FitzgeraldHouseDescription; sqm: number; basePrice: number } => {
  let description: FitzgeraldHouseDescription;
  let sqm: number;
  let basePrice: number;

  // This mapping is based on the provided "Schedules of Accommodation" and pricing.
  // It will need careful verification.
  if (houseTypeCol === "1") {
    description = "1B / 2P Mid-Terrace Duplex";
  } else if (houseTypeCol === "2" && houseSubTypeCol === "A") {
    description = "2B / 4P Mid-Terrace Duplex"; // Assuming 79sqm based on pricing
  } else if (houseTypeCol === "2" && houseSubTypeCol === "B") {
    description = "2B / 4P Mid-Terrace Duplex"; // Assuming 81sqm
  } else if (houseTypeCol === "2A" && houseSubTypeCol === "A") {
    description = "2B / 4P End-Terrace Duplex"; // Assuming 81sqm
  } else if (houseTypeCol === "3") {
    description = "2B / 4P Terraced";
  } else if (houseTypeCol === "4" && houseSubTypeCol === "A") {
    description = "3B / 5P Terraced"; // Assuming 107sqm
  } else if (houseTypeCol === "4" && houseSubTypeCol === "B") {
    description = "3B / 5P Terraced"; // Assuming 116sqm
  } else if (houseTypeCol === "5") {
    description = "3B / 5P Mid-Terrace Duplex";
  } else if (houseTypeCol === "6" && houseSubTypeCol === "A") {
    description = "3B / 5P Semi-Detached";
  } else if (houseTypeCol === "6" && houseSubTypeCol === "B") {
    description = "3B / 5P Detached";
  } else if (houseTypeCol === "7") {
    description = "4B / 7P End-Terrace";
  } else if (houseTypeCol === "8") {
    description = "4B / 8P Semi-Detached";
  } else if (houseTypeCol === "D1") { // Assuming D1 from image refers to a specific type
    description = "1B / 2P Mid-Terrace Duplex"; // Placeholder - VERIFY
  } else if (houseTypeCol === "D2") { // Assuming D2 from image refers to a specific type
    description = "2B / 4P Mid-Terrace Duplex"; // Placeholder - VERIFY (e.g. 81sqm)
  } else if (houseTypeCol === "D3") { // Assuming D3 from image refers to a specific type
    description = "3B / 5P Mid-Terrace Duplex"; // Placeholder - VERIFY
  } else if (houseTypeCol === "D4") { // Assuming D4 from image refers to a specific type - this type has 81sqm as per pricing for 4B/8P Mid-Terrace Duplex
    description = "4B / 8P Mid-Terrace Duplex";
  } else {
    // Fallback for unmapped types - critical to map all types from the PDF
    console.error(`Unmapped houseTypeCol: ${houseTypeCol}, houseSubTypeCol: ${houseSubTypeCol}`);
    description = "1B / 2P Mid-Terrace Duplex"; // Default to prevent crashing, but indicates an issue
  }

  const details = getUnitDetails(description);
  sqm = details.sqm;
  basePrice = details.price;

  return { description, sqm, basePrice };
};


export const FITZGERALD_GARDENS_UNITS: FitzgeraldPropertyUnit[] = [
  // Manually transcribed from the "Schedules of Accommodation" PDF
  // Block A (Units 1-12)
  { houseNo: "1", streetName: "Fitzgerald Gardens", houseTypeCol: "6", houseSubTypeCol: "B", ...mapHouseTypeToDetails("6", "B"), status: "Available" }, // 3B Detached
  { houseNo: "2", streetName: "Fitzgerald Gardens", houseTypeCol: "6", houseSubTypeCol: "A", ...mapHouseTypeToDetails("6", "A"), status: "Available" }, // 3B Semi-D
  { houseNo: "3", streetName: "Fitzgerald Gardens", houseTypeCol: "6", houseSubTypeCol: "A", ...mapHouseTypeToDetails("6", "A"), status: "Available" }, // 3B Semi-D
  { houseNo: "4", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "B", ...mapHouseTypeToDetails("4", "B"), status: "Available" }, // 3B Terraced (116sqm)
  { houseNo: "5", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" }, // 3B Terraced (107sqm)
  { houseNo: "6", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" }, // 3B Terraced (107sqm)
  { houseNo: "7", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "B", ...mapHouseTypeToDetails("4", "B"), status: "Available" }, // 3B Terraced (116sqm)
  { houseNo: "8", streetName: "Fitzgerald Gardens", houseTypeCol: "6", houseSubTypeCol: "A", ...mapHouseTypeToDetails("6", "A"), status: "Available" }, // 3B Semi-D
  { houseNo: "9", streetName: "Fitzgerald Gardens", houseTypeCol: "6", houseSubTypeCol: "A", ...mapHouseTypeToDetails("6", "A"), status: "Available" }, // 3B Semi-D
  { houseNo: "10", streetName: "Fitzgerald Gardens", houseTypeCol: "8", houseSubTypeCol: null, ...mapHouseTypeToDetails("8", null), status: "Available" }, // 4B Semi-D
  { houseNo: "11", streetName: "Fitzgerald Gardens", houseTypeCol: "8", houseSubTypeCol: null, ...mapHouseTypeToDetails("8", null), status: "Available" }, // 4B Semi-D
  { houseNo: "12", streetName: "Fitzgerald Gardens", houseTypeCol: "6", houseSubTypeCol: "B", ...mapHouseTypeToDetails("6", "B"), status: "Available" }, // 3B Detached

  // Block B (Units 13-24)
  { houseNo: "13", streetName: "Fitzgerald Gardens", houseTypeCol: "6", houseSubTypeCol: "B", ...mapHouseTypeToDetails("6", "B"), status: "Available" },
  { houseNo: "14", streetName: "Fitzgerald Gardens", houseTypeCol: "6", houseSubTypeCol: "A", ...mapHouseTypeToDetails("6", "A"), status: "Available" },
  { houseNo: "15", streetName: "Fitzgerald Gardens", houseTypeCol: "6", houseSubTypeCol: "A", ...mapHouseTypeToDetails("6", "A"), status: "Available" },
  { houseNo: "16", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "B", ...mapHouseTypeToDetails("4", "B"), status: "Available" },
  { houseNo: "17", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" },
  { houseNo: "18", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" },
  { houseNo: "19", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "B", ...mapHouseTypeToDetails("4", "B"), status: "Available" },
  { houseNo: "20", streetName: "Fitzgerald Gardens", houseTypeCol: "6", houseSubTypeCol: "A", ...mapHouseTypeToDetails("6", "A"), status: "Available" },
  { houseNo: "21", streetName: "Fitzgerald Gardens", houseTypeCol: "6", houseSubTypeCol: "A", ...mapHouseTypeToDetails("6", "A"), status: "Available" },
  { houseNo: "22", streetName: "Fitzgerald Gardens", houseTypeCol: "8", houseSubTypeCol: null, ...mapHouseTypeToDetails("8", null), status: "Available" },
  { houseNo: "23", streetName: "Fitzgerald Gardens", houseTypeCol: "8", houseSubTypeCol: null, ...mapHouseTypeToDetails("8", null), status: "Available" },
  { houseNo: "24", streetName: "Fitzgerald Gardens", houseTypeCol: "6", houseSubTypeCol: "B", ...mapHouseTypeToDetails("6", "B"), status: "Available" },

  // Block C (Units 25-40) - Duplexes
  { houseNo: "C1", streetName: "Fitzgerald Gardens", houseTypeCol: "D1", houseSubTypeCol: null, ...mapHouseTypeToDetails("D1", null), status: "Available" }, // 1B Dup
  { houseNo: "C2", streetName: "Fitzgerald Gardens", houseTypeCol: "D1", houseSubTypeCol: null, ...mapHouseTypeToDetails("D1", null), status: "Available" }, // 1B Dup
  { houseNo: "C3", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" }, // 2B Dup (79)
  { houseNo: "C4", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" }, // 2B Dup (79)
  { houseNo: "C5", streetName: "Fitzgerald Gardens", houseTypeCol: "D3", houseSubTypeCol: null, ...mapHouseTypeToDetails("D3", null), status: "Available" }, // 3B Dup
  { houseNo: "C6", streetName: "Fitzgerald Gardens", houseTypeCol: "D3", houseSubTypeCol: null, ...mapHouseTypeToDetails("D3", null), status: "Available" }, // 3B Dup
  { houseNo: "C7", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "B", ...mapHouseTypeToDetails("D2", "B"), status: "Available" }, // 2B Dup (81)
  { houseNo: "C8", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "B", ...mapHouseTypeToDetails("D2", "B"), status: "Available" }, // 2B Dup (81)
  { houseNo: "C9", streetName: "Fitzgerald Gardens", houseTypeCol: "D1", houseSubTypeCol: null, ...mapHouseTypeToDetails("D1", null), status: "Available" },
  { houseNo: "C10", streetName: "Fitzgerald Gardens", houseTypeCol: "D1", houseSubTypeCol: null, ...mapHouseTypeToDetails("D1", null), status: "Available" },
  { houseNo: "C11", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" },
  { houseNo: "C12", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" },
  { houseNo: "C13", streetName: "Fitzgerald Gardens", houseTypeCol: "D3", houseSubTypeCol: null, ...mapHouseTypeToDetails("D3", null), status: "Available" },
  { houseNo: "C14", streetName: "Fitzgerald Gardens", houseTypeCol: "D3", houseSubTypeCol: null, ...mapHouseTypeToDetails("D3", null), status: "Available" },
  { houseNo: "C15", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "B", ...mapHouseTypeToDetails("D2", "B"), status: "Available" },
  { houseNo: "C16", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "B", ...mapHouseTypeToDetails("D2", "B"), status: "Available" },

  // Block D (Units 41-56) - Duplexes
  { houseNo: "D17", streetName: "Fitzgerald Gardens", houseTypeCol: "D1", houseSubTypeCol: null, ...mapHouseTypeToDetails("D1", null), status: "Available" },
  { houseNo: "D18", streetName: "Fitzgerald Gardens", houseTypeCol: "D1", houseSubTypeCol: null, ...mapHouseTypeToDetails("D1", null), status: "Available" },
  { houseNo: "D19", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" },
  { houseNo: "D20", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" },
  { houseNo: "D21", streetName: "Fitzgerald Gardens", houseTypeCol: "D3", houseSubTypeCol: null, ...mapHouseTypeToDetails("D3", null), status: "Available" },
  { houseNo: "D22", streetName: "Fitzgerald Gardens", houseTypeCol: "D3", houseSubTypeCol: null, ...mapHouseTypeToDetails("D3", null), status: "Available" },
  { houseNo: "D23", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "B", ...mapHouseTypeToDetails("D2", "B"), status: "Available" },
  { houseNo: "D24", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "B", ...mapHouseTypeToDetails("D2", "B"), status: "Available" },
  { houseNo: "D25", streetName: "Fitzgerald Gardens", houseTypeCol: "D1", houseSubTypeCol: null, ...mapHouseTypeToDetails("D1", null), status: "Available" },
  { houseNo: "D26", streetName: "Fitzgerald Gardens", houseTypeCol: "D1", houseSubTypeCol: null, ...mapHouseTypeToDetails("D1", null), status: "Available" },
  { houseNo: "D27", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" },
  { houseNo: "D28", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" },
  { houseNo: "D29", streetName: "Fitzgerald Gardens", houseTypeCol: "D3", houseSubTypeCol: null, ...mapHouseTypeToDetails("D3", null), status: "Available" },
  { houseNo: "D30", streetName: "Fitzgerald Gardens", houseTypeCol: "D3", houseSubTypeCol: null, ...mapHouseTypeToDetails("D3", null), status: "Available" },
  { houseNo: "D31", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "B", ...mapHouseTypeToDetails("D2", "B"), status: "Available" },
  { houseNo: "D32", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "B", ...mapHouseTypeToDetails("D2", "B"), status: "Available" },

  // Block E (Units 57-68)
  { houseNo: "57", streetName: "Fitzgerald Gardens", houseTypeCol: "3", houseSubTypeCol: null, ...mapHouseTypeToDetails("3", null), status: "Available" }, // 2B Terraced
  { houseNo: "58", streetName: "Fitzgerald Gardens", houseTypeCol: "3", houseSubTypeCol: null, ...mapHouseTypeToDetails("3", null), status: "Available" }, // 2B Terraced
  { houseNo: "59", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" }, // 3B Terraced (107)
  { houseNo: "60", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" }, // 3B Terraced (107)
  { houseNo: "61", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" }, // 3B Terraced (107)
  { houseNo: "62", streetName: "Fitzgerald Gardens", houseTypeCol: "7", houseSubTypeCol: null, ...mapHouseTypeToDetails("7", null), status: "Available" }, // 4B End-Terrace
  { houseNo: "63", streetName: "Fitzgerald Gardens", houseTypeCol: "3", houseSubTypeCol: null, ...mapHouseTypeToDetails("3", null), status: "Available" },
  { houseNo: "64", streetName: "Fitzgerald Gardens", houseTypeCol: "3", houseSubTypeCol: null, ...mapHouseTypeToDetails("3", null), status: "Available" },
  { houseNo: "65", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" },
  { houseNo: "66", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" },
  { houseNo: "67", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" },
  { houseNo: "68", streetName: "Fitzgerald Gardens", houseTypeCol: "7", houseSubTypeCol: null, ...mapHouseTypeToDetails("7", null), status: "Available" },

  // Block F (Units 69-80)
  { houseNo: "69", streetName: "Fitzgerald Gardens", houseTypeCol: "3", houseSubTypeCol: null, ...mapHouseTypeToDetails("3", null), status: "Available" },
  { houseNo: "70", streetName: "Fitzgerald Gardens", houseTypeCol: "3", houseSubTypeCol: null, ...mapHouseTypeToDetails("3", null), status: "Available" },
  { houseNo: "71", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" },
  { houseNo: "72", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" },
  { houseNo: "73", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" },
  { houseNo: "74", streetName: "Fitzgerald Gardens", houseTypeCol: "7", houseSubTypeCol: null, ...mapHouseTypeToDetails("7", null), status: "Available" },
  { houseNo: "75", streetName: "Fitzgerald Gardens", houseTypeCol: "3", houseSubTypeCol: null, ...mapHouseTypeToDetails("3", null), status: "Available" },
  { houseNo: "76", streetName: "Fitzgerald Gardens", houseTypeCol: "3", houseSubTypeCol: null, ...mapHouseTypeToDetails("3", null), status: "Available" },
  { houseNo: "77", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" },
  { houseNo: "78", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" },
  { houseNo: "79", streetName: "Fitzgerald Gardens", houseTypeCol: "4", houseSubTypeCol: "A", ...mapHouseTypeToDetails("4", "A"), status: "Available" },
  { houseNo: "80", streetName: "Fitzgerald Gardens", houseTypeCol: "7", houseSubTypeCol: null, ...mapHouseTypeToDetails("7", null), status: "Available" },

  // Block G (Units 81-96) - Duplexes
  // Assuming these are similar to C & D blocks but with different house numbers
  // The PDF shows House Nos G33-G48
  { houseNo: "G33", streetName: "Fitzgerald Gardens", houseTypeCol: "D4", houseSubTypeCol: null, ...mapHouseTypeToDetails("D4", null), status: "Available" }, // 4B Dup (81)
  { houseNo: "G34", streetName: "Fitzgerald Gardens", houseTypeCol: "D4", houseSubTypeCol: null, ...mapHouseTypeToDetails("D4", null), status: "Available" }, // 4B Dup (81)
  { houseNo: "G35", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" }, // 2B Dup (79)
  { houseNo: "G36", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" }, // 2B Dup (79)
  { houseNo: "G37", streetName: "Fitzgerald Gardens", houseTypeCol: "D3", houseSubTypeCol: null, ...mapHouseTypeToDetails("D3", null), status: "Available" }, // 3B Dup
  { houseNo: "G38", streetName: "Fitzgerald Gardens", houseTypeCol: "D3", houseSubTypeCol: null, ...mapHouseTypeToDetails("D3", null), status: "Available" }, // 3B Dup
  { houseNo: "G39", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" }, // 2B Dup (79) - Not B? Schedule implies A for G39/40
  { houseNo: "G40", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" }, // 2B Dup (79)
  { houseNo: "G41", streetName: "Fitzgerald Gardens", houseTypeCol: "D4", houseSubTypeCol: null, ...mapHouseTypeToDetails("D4", null), status: "Available" },
  { houseNo: "G42", streetName: "Fitzgerald Gardens", houseTypeCol: "D4", houseSubTypeCol: null, ...mapHouseTypeToDetails("D4", null), status: "Available" },
  { houseNo: "G43", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" },
  { houseNo: "G44", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" },
  { houseNo: "G45", streetName: "Fitzgerald Gardens", houseTypeCol: "D3", houseSubTypeCol: null, ...mapHouseTypeToDetails("D3", null), status: "Available" },
  { houseNo: "G46", streetName: "Fitzgerald Gardens", houseTypeCol: "D3", houseSubTypeCol: null, ...mapHouseTypeToDetails("D3", null), status: "Available" },
  { houseNo: "G47", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" }, // Not B?
  { houseNo: "G48", streetName: "Fitzgerald Gardens", houseTypeCol: "D2", houseSubTypeCol: "A", ...mapHouseTypeToDetails("D2", "A"), status: "Available" }, // Not B?
]; 