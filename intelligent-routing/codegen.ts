import type { CodegenConfig } from '@graphql-codegen/cli';

const config: CodegenConfig = {
  schema: 'src/lib/graphql/schemas/**/*.graphql',
  documents: ['src/graphql/**/*.ts', 'src/components/**/*.tsx'],
  ignoreNoDocuments: true, // for better experience with the watcher
  generates: {
    'src/types/generated/graphql/index.ts': {
      plugins: [
        'typescript',
        'typescript-operations',
        'typescript-react-apollo'
      ],
      config: {
        withHooks: true,
        withHOC: false,
        withComponent: false,
        skipTypename: false,
        declarationKind: 'interface',
        avoidOptionals: true,
        immutableTypes: true,
        namingConvention: {
          typeNames: 'pascal-case',
          enumValues: 'upper-case',
        },
        scalars: {
          DateTime: 'Date',
          JSON: 'Record<string, any>',
          Upload: 'File',
        },
      },
    },
    'src/types/generated/graphql/schema.graphql': {
      plugins: ['schema-ast'],
    },
    'src/types/generated/graphql/introspection.json': {
      plugins: ['introspection'],
      config: {
        minify: true,
      },
    },
  },
  hooks: {
    afterAllFileWrite: ['prettier --write'],
  },
};

export default config;