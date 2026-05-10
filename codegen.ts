import type { CodegenConfig } from '@graphql-codegen/cli'

/**
 * Default: load schema from the API package in this monorepo (no running server).
 * Override with GRAPHQL_SCHEMA_URL (e.g. http://127.0.0.1:4000/graphql) to introspect a live server.
 */
const localSchema: string[] = [
  '../daxor-backend/apps/api/src/schema.graphql',
  '../daxor-backend/apps/api/src/modules/**/*.graphql',
]

const config: CodegenConfig = {
  schema: process.env.GRAPHQL_SCHEMA_URL
    ? [process.env.GRAPHQL_SCHEMA_URL]
    : localSchema,
  // Do not include generated outputs (graphql.ts, gql.ts) or codegen will see duplicate operation names.
  documents: [
    'gql/**/*.ts',
    'gql/**/*.tsx',
    '!gql/graphql.ts',
    '!gql/gql.ts',
  ],
  generates: {
    './gql/': {
      preset: 'client',
      plugins: [],
      presetConfig: {
        gqlTagName: 'gql',
      },
      config: {
        useTypeImports: true,
        enumsAsTypes: true,
      },
    },
    './gql/graphql.ts': {
      plugins: ['typescript', 'typescript-operations', 'typescript-react-apollo'],
      config: {
        withHooks: true,
        withComponent: false,
        withHOC: false,
        addDocBlocks: false,
        defaultScalarType: 'unknown',
        useTypeImports: false,
        skipTypename: false,
        enumsAsTypes: true,
      },
    },
  },
  ignoreNoDocuments: true,
}

export default config
