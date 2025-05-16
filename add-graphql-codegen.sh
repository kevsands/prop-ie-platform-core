#!/bin/bash

# Add GraphQL Code Generator dependencies
npm install --save-dev @graphql-codegen/cli @graphql-codegen/typescript @graphql-codegen/typescript-operations @graphql-codegen/typescript-react-apollo @graphql-codegen/schema-ast @graphql-codegen/introspection @graphql-codegen/near-operation-file-preset

# Add scripts to package.json
sed -i.bak '/"scripts": {/a \
    "generate:types": "graphql-codegen --config codegen.ts",\
    "generate:types:watch": "graphql-codegen --config codegen.ts --watch",\
' package.json

# Remove backup file
rm package.json.bak

# Add type generation to build process
sed -i.bak '/"build":/s/next build/npm run generate:types \&\& next build/' package.json
rm package.json.bak

echo "GraphQL code generator setup complete."
echo "Run 'npm run generate:types' to generate types from your GraphQL schema."