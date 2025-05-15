// @ts-check

/**
 * Relay compiler configuration
 * See: https://relay.dev/docs/getting-started/installation-and-setup/#set-up-relay-compiler
 */
module.exports = {
  src: './src',
  schema: './src/graphql/schema.graphql',
  language: 'typescript',
  artifactDirectory: './src/__generated__',
  exclude: ['**/node_modules/**', '**/__mocks__/**', '**/__tests__/**', '**/__generated__/**'],
  persistConfig: {
    file: './src/__generated__/persisted_queries.json',
    algorithm: 'MD5',
  },
  eagerEsModules: true,
  customScalars: {
    DateTime: 'string',
  },
  // Disable the strict naming conventions in Relay 14.x
  featureFlags: {
    enable_relay_operation_name_validation: false
  }
}; 