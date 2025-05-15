#!/usr/bin/env node

/**
 * Relay Compiler Script
 * 
 * This script runs the Relay compiler to generate the necessary files
 * for GraphQL queries, mutations, and fragments.
 * 
 * Usage: node scripts/relay-compiler.js
 */

const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

// Check if relay-compiler is installed
try {
  require.resolve('relay-compiler');
} catch (e) {
  console.error('Error: relay-compiler is not installed.');
  console.error('Please run: pnpm add --save-dev relay-compiler');
  process.exit(1);
}

// Configuration
const srcDir = path.resolve(__dirname, '../src');
const schemaPath = path.resolve(srcDir, 'graphql/schema.graphql');
const outputDir = path.resolve(srcDir, '__generated__');
const relayCompilerPath = path.resolve(__dirname, '../node_modules/.bin/relay-compiler');

// Use the config file rather than command line args
const configPath = path.resolve(__dirname, '../relay.config.js');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

console.log('🚀 Running Relay Compiler...');
console.log(`📂 Source directory: ${srcDir}`);
console.log(`📄 Schema: ${schemaPath}`);
console.log(`📦 Output directory: ${outputDir}`);
console.log(`📝 Config: ${configPath}`);

try {
  // Just run relay-compiler which will use the relay.config.js file
  const command = `${relayCompilerPath}`;
  
  console.log(`Executing command: ${command}`);
  
  execSync(
    command,
    { stdio: 'inherit' }
  );
  
  console.log('✅ Relay Compiler completed successfully!');
} catch (error) {
  console.error('❌ Relay Compiler failed:', error.message);
  process.exit(1);
} 