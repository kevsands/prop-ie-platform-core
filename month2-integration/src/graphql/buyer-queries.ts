/**
 * First-Time Buyer GraphQL Queries
 * 
 * Client-side query definitions for First-Time Buyer features.
 */

// Buyer Profile Queries
export const getMyBuyerProfile = /* GraphQL */ `
  query GetMyBuyerProfile {
    myBuyerProfile {
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

export const getBuyerProfile = /* GraphQL */ `
  query GetBuyerProfile($id: ID!) {
    buyerProfile(id: $id) {
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
      reservations {
        id
        status
        depositAmount
        depositPaid
        reservationDate
      }
    }
  }
`;

export const listBuyerProfiles = /* GraphQL */ `
  query ListBuyerProfiles(
    $filter: BuyerProfileFilterInput
    $pagination: PaginationInput
  ) {
    buyerProfiles(filter: $filter, pagination: $pagination) {
      buyerProfiles {
        id
        currentJourneyPhase
        createdAt
        user {
          id
          fullName
          email
        }
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

// Reservation Queries
export const getReservation = /* GraphQL */ `
  query GetReservation($id: ID!) {
    reservation(id: $id) {
      id
      status
      depositAmount
      depositPaid
      reservationDate
      agreementSigned
      agreementDocument
      expiryDate
      completionDate
      createdAt
      updatedAt
      property {
        id
        name
        type
        price
        bedrooms
        bathrooms
        squareFeet
      }
      user {
        id
        fullName
        email
      }
      documents {
        id
        title
        url
        type
      }
    }
  }
`;

export const listReservations = /* GraphQL */ `
  query ListReservations(
    $filter: ReservationFilterInput
    $pagination: PaginationInput
  ) {
    reservations(filter: $filter, pagination: $pagination) {
      reservations {
        id
        status
        depositAmount
        depositPaid
        reservationDate
        property {
          id
          name
        }
        user {
          id
          fullName
        }
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const getMyReservations = /* GraphQL */ `
  query GetMyReservations {
    myReservations {
      id
      status
      depositAmount
      depositPaid
      reservationDate
      agreementSigned
      agreementDocument
      expiryDate
      completionDate
      property {
        id
        name
        type
        price
        bedrooms
        bathrooms
      }
      documents {
        id
        title
        url
        type
      }
    }
  }
`;

// Mortgage Tracking Queries
export const getMortgageTracking = /* GraphQL */ `
  query GetMortgageTracking($userId: ID!) {
    mortgageTracking(userId: $userId) {
      id
      status
      lenderName
      amount
      aipDate
      aipExpiryDate
      formalOfferDate
      conditions
      notes
      createdAt
      updatedAt
      user {
        id
        fullName
      }
      mortgageDocuments {
        id
        title
        url
        type
      }
    }
  }
`;

export const getMyMortgageTracking = /* GraphQL */ `
  query GetMyMortgageTracking {
    myMortgageTracking {
      id
      status
      lenderName
      amount
      aipDate
      aipExpiryDate
      formalOfferDate
      conditions
      notes
      createdAt
      updatedAt
      mortgageDocuments {
        id
        title
        url
        type
      }
    }
  }
`;

// Snag List Queries
export const getSnagList = /* GraphQL */ `
  query GetSnagList($id: ID!) {
    snagList(id: $id) {
      id
      status
      createdAt
      updatedAt
      property {
        id
        name
      }
      user {
        id
        fullName
      }
      items {
        id
        description
        location
        status
        images
        developerNotes
        fixedDate
        createdAt
        updatedAt
      }
    }
  }
`;

export const listSnagLists = /* GraphQL */ `
  query ListSnagLists(
    $filter: SnagListFilterInput
    $pagination: PaginationInput
  ) {
    snagLists(filter: $filter, pagination: $pagination) {
      snagLists {
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
        items {
          id
          status
        }
      }
      totalCount
      pageInfo {
        hasNextPage
        hasPreviousPage
        startCursor
        endCursor
      }
    }
  }
`;

export const getMySnagLists = /* GraphQL */ `
  query GetMySnagLists {
    mySnagLists {
      id
      status
      createdAt
      updatedAt
      property {
        id
        name
      }
      items {
        id
        description
        location
        status
        images
        developerNotes
        fixedDate
        createdAt
      }
    }
  }
`;

export const getSnagItem = /* GraphQL */ `
  query GetSnagItem($id: ID!) {
    snagItem(id: $id) {
      id
      description
      location
      status
      images
      developerNotes
      fixedDate
      createdAt
      updatedAt
      snagList {
        id
        property {
          id
          name
        }
      }
    }
  }
`;

// Home Pack Item Queries
export const getHomePackItems = /* GraphQL */ `
  query GetHomePackItems($propertyId: ID!) {
    homePackItems(propertyId: $propertyId) {
      id
      title
      category
      documentUrl
      expiryDate
      issuer
      createdAt
      updatedAt
      property {
        id
        name
      }
    }
  }
`;