// @ts-check

module.exports = {
  schema: './src/graphql/schema.graphql',
  src: './src',
  language: 'typescript',
  artifactDirectory: './src/__generated__',
  exclude: ['**/node_modules/**', '**/__mocks__/**', '**/__tests__/**', '**/__generated__/**'],
}; 