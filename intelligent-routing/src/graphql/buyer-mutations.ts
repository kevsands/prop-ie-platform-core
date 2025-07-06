/**
 * First-Time Buyer GraphQL Mutations
 * 
 * Client-side mutation definitions for First-Time Buyer features.
 */

// Buyer Profile Mutations
export const createBuyerProfile = /* GraphQL */ `
  mutation CreateBuyerProfile($input: CreateBuyerProfileInput!) {
    createBuyerProfile(input: $input) {
      id
      currentJourneyPhase
      financialDetails
      preferences
      governmentSchemes
      createdAt
      updatedAt
      user {
        id
        fullName
        email
      }
    }
  }
`;

export const updateBuyerProfile = /* GraphQL */ `
  mutation UpdateBuyerProfile($id: ID!, $input: UpdateBuyerProfileInput!) {
    updateBuyerProfile(id: $id, input: $input) {
      id
      currentJourneyPhase
      financialDetails
      preferences
      governmentSchemes
      updatedAt
    }
  }
`;

// Reservation Mutations
export const createReservation = /* GraphQL */ `
  mutation CreateReservation($input: CreateReservationInput!) {
    createReservation(input: $input) {
      id
      status
      depositAmount
      depositPaid
      reservationDate
      agreementSigned
      expiryDate
      property {
        id
        name
      }
      user {
        id
        fullName
      }
    }
  }
`;

export const updateReservation = /* GraphQL */ `
  mutation UpdateReservation($id: ID!, $input: UpdateReservationInput!) {
    updateReservation(id: $id, input: $input) {
      id
      status
      depositPaid
      agreementSigned
      agreementDocument
      completionDate
      updatedAt
    }
  }
`;

export const cancelReservation = /* GraphQL */ `
  mutation CancelReservation($id: ID!, $reason: String) {
    cancelReservation(id: $id, reason: $reason) {
      id
      status
      updatedAt
    }
  }
`;

export const completeReservation = /* GraphQL */ `
  mutation CompleteReservation($id: ID!) {
    completeReservation(id: $id) {
      id
      status
      completionDate
      updatedAt
    }
  }
`;

// Mortgage Tracking Mutations
export const createMortgageTracking = /* GraphQL */ `
  mutation CreateMortgageTracking($input: CreateMortgageTrackingInput!) {
    createMortgageTracking(input: $input) {
      id
      status
      lenderName
      amount
      aipDate
      aipExpiryDate
      notes
      createdAt
      user {
        id
        fullName
      }
    }
  }
`;

export const updateMortgageTracking = /* GraphQL */ `
  mutation UpdateMortgageTracking($id: ID!, $input: UpdateMortgageTrackingInput!) {
    updateMortgageTracking(id: $id, input: $input) {
      id
      status
      lenderName
      amount
      aipDate
      aipExpiryDate
      formalOfferDate
      conditions
      notes
      updatedAt
    }
  }
`;

export const addMortgageDocument = /* GraphQL */ `
  mutation AddMortgageDocument($mortgageTrackingId: ID!, $documentId: ID!) {
    addMortgageDocument(mortgageTrackingId: $mortgageTrackingId, documentId: $documentId) {
      id
      mortgageDocuments {
        id
        title
        url
        type
      }
    }
  }
`;

export const removeMortgageDocument = /* GraphQL */ `
  mutation RemoveMortgageDocument($mortgageTrackingId: ID!, $documentId: ID!) {
    removeMortgageDocument(mortgageTrackingId: $mortgageTrackingId, documentId: $documentId) {
      id
      mortgageDocuments {
        id
        title
        url
        type
      }
    }
  }
`;

// Snag List Mutations
export const createSnagList = /* GraphQL */ `
  mutation CreateSnagList($input: CreateSnagListInput!) {
    createSnagList(input: $input) {
      id
      status
      createdAt
      property {
        id
        name
      }
      user {
        id
        fullName
      }
    }
  }
`;

export const updateSnagList = /* GraphQL */ `
  mutation UpdateSnagList($id: ID!, $input: UpdateSnagListInput!) {
    updateSnagList(id: $id, input: $input) {
      id
      status
      updatedAt
    }
  }
`;

export const createSnagItem = /* GraphQL */ `
  mutation CreateSnagItem($input: CreateSnagItemInput!) {
    createSnagItem(input: $input) {
      id
      description
      location
      status
      images
      createdAt
      snagList {
        id
      }
    }
  }
`;

export const updateSnagItem = /* GraphQL */ `
  mutation UpdateSnagItem($id: ID!, $input: UpdateSnagItemInput!) {
    updateSnagItem(id: $id, input: $input) {
      id
      description
      location
      status
      images
      developerNotes
      fixedDate
      updatedAt
    }
  }
`;

// Home Pack Item Mutations
export const createHomePackItem = /* GraphQL */ `
  mutation CreateHomePackItem($input: CreateHomePackItemInput!) {
    createHomePackItem(input: $input) {
      id
      title
      category
      documentUrl
      expiryDate
      issuer
      createdAt
      property {
        id
        name
      }
    }
  }
`;

export const updateHomePackItem = /* GraphQL */ `
  mutation UpdateHomePackItem($id: ID!, $input: UpdateHomePackItemInput!) {
    updateHomePackItem(id: $id, input: $input) {
      id
      title
      category
      documentUrl
      expiryDate
      issuer
      updatedAt
    }
  }
`;

export const deleteHomePackItem = /* GraphQL */ `
  mutation DeleteHomePackItem($id: ID!) {
    deleteHomePackItem(id: $id)
  }
`;