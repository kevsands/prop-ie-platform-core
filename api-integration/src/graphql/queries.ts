// src/graphql/queries.ts
export const listProperties = /* GraphQL */ `
  query ListProperties {
    listProperties {
      items {
        id
        name
      }
    }
  }
`;

// src/graphql/mutations.ts
export const createProperty = /* GraphQL */ `
  mutation CreateProperty($input: CreatePropertyInput!) {
    createProperty(input: $input) {
      id
      name
    }
  }
`;