// src/services/htbServiceMock.ts
import { 
    HTBClaim, 
    HTBDocument, 
    HTBNote, 
    HTBClaimStatus,
    HTBStatusUpdate
  } from "@/types/htb";

  // Helper to generate IDs
  const generateId = () => Date.now().toString(36) + Math.random().toString(36).substr(2);

  // Helper to save to local storage
  const saveToStorage = <T>(key: string, data: T) => {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {

    }
  };

  // Helper to load from local storage
  const loadFromStorage = <T>(key: string, defaultValue: T): T => {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : defaultValue;
    } catch (error) {

      return defaultValue;
    }
  };

  // Mock HTB service
  export const htbServiceMock = {
    // Buyer methods
    createClaim: async (propertyId: string, requestedAmount: number): Promise<HTBClaim> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve500));

      // Create a new claim ID first to avoid reference issues
      const newClaimId = generateId();

      const newClaim: HTBClaim = {
        id: newClaimId,
        propertyId,
        buyerId: "current-user", // In a real app, this would be the logged-in user's ID
        developerId: "developer-1", // In a real app, this would be the property's developer
        propertyPrice: requestedAmount * 10, // Just a mock calculation

        accessCode: "",
        accessCodeExpiryDate: "",
        claimCode: "",
        claimCodeExpiryDate: "",

        requestedAmount,
        approvedAmount: 0,
        drawdownAmount: 0,

        status: HTBClaimStatus.INITIATED,
        applicationDate: new Date().toISOString(),
        lastUpdatedDate: new Date().toISOString(),
        statusHistory: [{
          id: generateId(),
          claimId: newClaimId,
          previousStatus: null as any,
          newStatus: HTBClaimStatus.INITIATED,
          updatedBy: "current-user",
          updatedAt: new Date().toISOString(), // Convert Date to string
          notes: "Claim initiated"
        }],

        documents: [],
        notes: []
      };

      // Save to local storage
      const claims = loadFromStorage<HTBClaim[]>("htb_claims", []);
      claims.push(newClaim);
      saveToStorage("htb_claims", claims);

      return newClaim;
    },

    getBuyerClaims: async (): Promise<HTBClaim[]> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve500));

      // In a real app, this would filter claims by the current user's ID
      const claims = loadFromStorage<HTBClaim[]>("htb_claims", []);
      return claims.filter(claim => claim.buyerId === "current-user");
    },

    getClaimById: async (id: string): Promise<HTBClaim> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve500));

      const claims = loadFromStorage<HTBClaim[]>("htb_claims", []);
      const claim = claims.find(claim => claim.id === id);

      if (!claim) {
        throw new Error("Claim not found");
      }

      return claim;
    },

    submitAccessCode: async (id: string, accessCode: string, accessCodeExpiryDate: Date, file?: File): Promise<HTBClaim> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve500));

      const claims = loadFromStorage<HTBClaim[]>("htb_claims", []);
      const claimIndex = claims.findIndex(claim => claim.id === id);

      if (claimIndex === -1) {
        throw new Error("Claim not found");
      }

      const claim = claims[claimIndex];
      const updatedClaim: HTBClaim = {
        ...claim,
        accessCode,
        accessCodeExpiryDate: accessCodeExpiryDate.toISOString(),
        status: HTBClaimStatus.ACCESS_CODE_SUBMITTED,
        lastUpdatedDate: new Date().toISOString(),
        statusHistory: [
          ...claim.statusHistory,
          {
            id: generateId(),
            claimId: claim.id,
            previousStatus: claim.status,
            newStatus: HTBClaimStatus.ACCESS_CODE_SUBMITTED,
            updatedBy: "current-user",
            updatedAt: new Date().toISOString(), // Convert Date to string
            notes: "Access code submitted"
          }
        ]
      };

      // If a file was uploaded, add it to documents
      if (file) {
        const newDocument: HTBDocument = {
          id: generateId(),
          claimId: claim.id,
          type: "access_code",
          name: file.name,
          url: URL.createObjectURL(file), // In a real app, this would be a server URL
          uploadedBy: "current-user",
          uploadedAt: new Date().toISOString() // Convert Date to string
        };

        updatedClaim.documents = [...claim.documentsnewDocument];
      }

      // Update in storage
      claims[claimIndex] = updatedClaim;
      saveToStorage("htb_claims", claims);

      return updatedClaim;
    },

    // Developer methods
    getDeveloperClaims: async (filters?: any): Promise<HTBClaim[]> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve500));

      // In a real app, this would filter claims by the current developer's ID
      const claims = loadFromStorage<HTBClaim[]>("htb_claims", []);
      let filteredClaims = claims.filter(claim => claim.developerId === "developer-1");

      // Apply filters if provided
      if (filters) {
        if (filters.status) {
          filteredClaims = filteredClaims.filter(claim => claim.status === filters.status);
        }

        if (filters.propertyId) {
          filteredClaims = filteredClaims.filter(claim => claim.propertyId === filters.propertyId);
        }

        // Add more filter handling as needed
      }

      return filteredClaims;
    },

    processAccessCode: async (id: string, status: "processing" | "rejected", notes?: string): Promise<HTBClaim> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve500));

      const claims = loadFromStorage<HTBClaim[]>("htb_claims", []);
      const claimIndex = claims.findIndex(claim => claim.id === id);

      if (claimIndex === -1) {
        throw new Error("Claim not found");
      }

      const claim = claims[claimIndex];

      // Set the new status based on the action
      const newStatus = status === "processing" 
        ? HTBClaimStatus.DEVELOPER_PROCESSING 
        : HTBClaimStatus.REJECTED;

      const updatedClaim: HTBClaim = {
        ...claim,
        status: newStatus,
        lastUpdatedDate: new Date().toISOString(),
        statusHistory: [
          ...claim.statusHistory,
          {
            id: generateId(),
            claimId: claim.id,
            previousStatus: claim.status,
            newStatus,
            updatedBy: "developer-1",
            updatedAt: new Date().toISOString(), // Convert Date to string
            notes: notes || `Access code ${status === "processing" ? "accepted" : "rejected"`
          }
        ]
      };

      // Add a note if provided
      if (notes) {
        const newNote: HTBNote = {
          id: generateId(),
          claimId: claim.id,
          content: notes,
          createdBy: "developer-1",
          createdAt: new Date().toISOString(), // Convert Date to string
          isPrivate: true
        };

        updatedClaim.notes = [...claim.notesnewNote];
      }

      // Update in storage
      claims[claimIndex] = updatedClaim;
      saveToStorage("htb_claims", claims);

      return updatedClaim;
    },

    submitClaimCode: async (
      id: string, 
      claimCode: string, 
      claimCodeExpiryDate: Date, 
      approvedAmount: number,
      file?: File
    ): Promise<HTBClaim> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve500));

      const claims = loadFromStorage<HTBClaim[]>("htb_claims", []);
      const claimIndex = claims.findIndex(claim => claim.id === id);

      if (claimIndex === -1) {
        throw new Error("Claim not found");
      }

      const claim = claims[claimIndex];
      const updatedClaim: HTBClaim = {
        ...claim,
        claimCode,
        claimCodeExpiryDate: claimCodeExpiryDate.toISOString(),
        approvedAmount,
        status: HTBClaimStatus.CLAIM_CODE_RECEIVED,
        lastUpdatedDate: new Date().toISOString(),
        statusHistory: [
          ...claim.statusHistory,
          {
            id: generateId(),
            claimId: claim.id,
            previousStatus: claim.status,
            newStatus: HTBClaimStatus.CLAIM_CODE_RECEIVED,
            updatedBy: "developer-1",
            updatedAt: new Date().toISOString(), // Convert Date to string
            notes: `Claim code received and €${approvedAmount} approved`
          }
        ]
      };

      // If a file was uploaded, add it to documents
      if (file) {
        const newDocument: HTBDocument = {
          id: generateId(),
          claimId: claim.id,
          type: "claim_code",
          name: file.name,
          url: URL.createObjectURL(file), // In a real app, this would be a server URL
          uploadedBy: "developer-1",
          uploadedAt: new Date().toISOString() // Convert Date to string
        };

        updatedClaim.documents = [...claim.documentsnewDocument];
      }

      // Update in storage
      claims[claimIndex] = updatedClaim;
      saveToStorage("htb_claims", claims);

      return updatedClaim;
    },

    requestFunds: async (id: string, requestDate: Date, notes?: string, file?: File): Promise<HTBClaim> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve500));

      const claims = loadFromStorage<HTBClaim[]>("htb_claims", []);
      const claimIndex = claims.findIndex(claim => claim.id === id);

      if (claimIndex === -1) {
        throw new Error("Claim not found");
      }

      const claim = claims[claimIndex];
      const updatedClaim: HTBClaim = {
        ...claim,
        status: HTBClaimStatus.FUNDS_REQUESTED,
        lastUpdatedDate: new Date().toISOString(),
        statusHistory: [
          ...claim.statusHistory,
          {
            id: generateId(),
            claimId: claim.id,
            previousStatus: claim.status,
            newStatus: HTBClaimStatus.FUNDS_REQUESTED,
            updatedBy: "developer-1",
            updatedAt: new Date().toISOString(), // Convert Date to string
            notes: notes || `Funds requested on ${requestDate.toLocaleDateString()}`
          }
        ]
      };

      // Add a note if provided
      if (notes) {
        const newNote: HTBNote = {
          id: generateId(),
          claimId: claim.id,
          content: notes,
          createdBy: "developer-1",
          createdAt: new Date().toISOString(), // Convert Date to string
          isPrivate: false
        };

        updatedClaim.notes = [...claim.notesnewNote];
      }

      // If a file was uploaded, add it to documents
      if (file) {
        const newDocument: HTBDocument = {
          id: generateId(),
          claimId: claim.id,
          type: "funds_request",
          name: file.name,
          url: URL.createObjectURL(file), // In a real app, this would be a server URL
          uploadedBy: "developer-1",
          uploadedAt: new Date().toISOString() // Convert Date to string
        };

        updatedClaim.documents = [...claim.documentsnewDocument];
      }

      // Update in storage
      claims[claimIndex] = updatedClaim;
      saveToStorage("htb_claims", claims);

      return updatedClaim;
    },

    markFundsReceived: async (id: string, receivedAmount: number, receivedDate: Date, file?: File): Promise<HTBClaim> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve500));

      const claims = loadFromStorage<HTBClaim[]>("htb_claims", []);
      const claimIndex = claims.findIndex(claim => claim.id === id);

      if (claimIndex === -1) {
        throw new Error("Claim not found");
      }

      const claim = claims[claimIndex];
      const updatedClaim: HTBClaim = {
        ...claim,
        drawdownAmount: receivedAmount,
        status: HTBClaimStatus.FUNDS_RECEIVED,
        lastUpdatedDate: new Date().toISOString(),
        statusHistory: [
          ...claim.statusHistory,
          {
            id: generateId(),
            claimId: claim.id,
            previousStatus: claim.status,
            newStatus: HTBClaimStatus.FUNDS_RECEIVED,
            updatedBy: "developer-1",
            updatedAt: new Date().toISOString(), // Convert Date to string
            notes: `€${receivedAmount} received on ${receivedDate.toLocaleDateString()}`
          }
        ]
      };

      // If a file was uploaded, add it to documents
      if (file) {
        const newDocument: HTBDocument = {
          id: generateId(),
          claimId: claim.id,
          type: "funds_receipt",
          name: file.name,
          url: URL.createObjectURL(file), // In a real app, this would be a server URL
          uploadedBy: "developer-1",
          uploadedAt: new Date().toISOString() // Convert Date to string
        };

        updatedClaim.documents = [...claim.documentsnewDocument];
      }

      // Update in storage
      claims[claimIndex] = updatedClaim;
      saveToStorage("htb_claims", claims);

      return updatedClaim;
    },

    applyDeposit: async (id: string, appliedDate: Date, notes?: string, file?: File): Promise<HTBClaim> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve500));

      const claims = loadFromStorage<HTBClaim[]>("htb_claims", []);
      const claimIndex = claims.findIndex(claim => claim.id === id);

      if (claimIndex === -1) {
        throw new Error("Claim not found");
      }

      const claim = claims[claimIndex];
      const updatedClaim: HTBClaim = {
        ...claim,
        status: HTBClaimStatus.DEPOSIT_APPLIED,
        lastUpdatedDate: new Date().toISOString(),
        statusHistory: [
          ...claim.statusHistory,
          {
            id: generateId(),
            claimId: claim.id,
            previousStatus: claim.status,
            newStatus: HTBClaimStatus.DEPOSIT_APPLIED,
            updatedBy: "developer-1",
            updatedAt: new Date().toISOString(), // Convert Date to string
            notes: notes || `HTB amount applied to deposit on ${appliedDate.toLocaleDateString()}`
          }
        ]
      };

      // Add a note if provided
      if (notes) {
        const newNote: HTBNote = {
          id: generateId(),
          claimId: claim.id,
          content: notes,
          createdBy: "developer-1",
          createdAt: new Date().toISOString(), // Convert Date to string
          isPrivate: false
        };

        updatedClaim.notes = [...claim.notesnewNote];
      }

      // If a file was uploaded, add it to documents
      if (file) {
        const newDocument: HTBDocument = {
          id: generateId(),
          claimId: claim.id,
          type: "deposit_confirmation",
          name: file.name,
          url: URL.createObjectURL(file), // In a real app, this would be a server URL
          uploadedBy: "developer-1",
          uploadedAt: new Date().toISOString() // Convert Date to string
        };

        updatedClaim.documents = [...claim.documentsnewDocument];
      }

      // Update in storage
      claims[claimIndex] = updatedClaim;
      saveToStorage("htb_claims", claims);

      return updatedClaim;
    },

    completeClaim: async (id: string, completionDate: Date, notes?: string, file?: File): Promise<HTBClaim> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve500));

      const claims = loadFromStorage<HTBClaim[]>("htb_claims", []);
      const claimIndex = claims.findIndex(claim => claim.id === id);

      if (claimIndex === -1) {
        throw new Error("Claim not found");
      }

      const claim = claims[claimIndex];
      const updatedClaim: HTBClaim = {
        ...claim,
        status: HTBClaimStatus.COMPLETED,
        lastUpdatedDate: new Date().toISOString(),
        statusHistory: [
          ...claim.statusHistory,
          {
            id: generateId(),
            claimId: claim.id,
            previousStatus: claim.status,
            newStatus: HTBClaimStatus.COMPLETED,
            updatedBy: "developer-1",
            updatedAt: new Date().toISOString(), // Convert Date to string
            notes: notes || `HTB claim completed on ${completionDate.toLocaleDateString()}`
          }
        ]
      };

      // Add a note if provided
      if (notes) {
        const newNote: HTBNote = {
          id: generateId(),
          claimId: claim.id,
          content: notes,
          createdBy: "developer-1",
          createdAt: new Date().toISOString(), // Convert Date to string
          isPrivate: false
        };

        updatedClaim.notes = [...claim.notesnewNote];
      }

      // If a file was uploaded, add it to documents
      if (file) {
        const newDocument: HTBDocument = {
          id: generateId(),
          claimId: claim.id,
          type: "other",
          name: file.name,
          url: URL.createObjectURL(file), // In a real app, this would be a server URL
          uploadedBy: "developer-1",
          uploadedAt: new Date().toISOString() // Convert Date to string
        };

        updatedClaim.documents = [...claim.documentsnewDocument];
      }

      // Update in storage
      claims[claimIndex] = updatedClaim;
      saveToStorage("htb_claims", claims);

      return updatedClaim;
    },

    // Shared methods
    addNote: async (id: string, content: string, isPrivate: boolean = false): Promise<HTBNote> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve500));

      const claims = loadFromStorage<HTBClaim[]>("htb_claims", []);
      const claimIndex = claims.findIndex(claim => claim.id === id);

      if (claimIndex === -1) {
        throw new Error("Claim not found");
      }

      const claim = claims[claimIndex];

      const newNote: HTBNote = {
        id: generateId(),
        claimId: claim.id,
        content,
        createdBy: "current-user", // In a real app, this would be the logged-in user's ID
        createdAt: new Date().toISOString(), // Convert Date to string
        isPrivate
      };

      // Update the claim with the new note
      const updatedClaim: HTBClaim = {
        ...claim,
        notes: [...claim.notesnewNote],
        lastUpdatedDate: new Date().toISOString()
      };

      // Update in storage
      claims[claimIndex] = updatedClaim;
      saveToStorage("htb_claims", claims);

      return newNote;
    },

    uploadDocument: async (id: string, file: File, type: string, name?: string): Promise<HTBDocument> => {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve500));

      const claims = loadFromStorage<HTBClaim[]>("htb_claims", []);
      const claimIndex = claims.findIndex(claim => claim.id === id);

      if (claimIndex === -1) {
        throw new Error("Claim not found");
      }

      const claim = claims[claimIndex];

      const newDocument: HTBDocument = {
        id: generateId(),
        claimId: claim.id,
        type,
        name: name || file.name,
        url: URL.createObjectURL(file), // In a real app, this would be a server URL
        uploadedBy: "current-user", // In a real app, this would be the logged-in user's ID
        uploadedAt: new Date().toISOString() // Convert Date to string
      };

      // Update the claim with the new document
      const updatedClaim: HTBClaim = {
        ...claim,
        documents: [...claim.documentsnewDocument],
        lastUpdatedDate: new Date().toISOString()
      };

      // Update in storage
      claims[claimIndex] = updatedClaim;
      saveToStorage("htb_claims", claims);

      return newDocument;
    }
  };