#!/bin/bash
# Continuous Integration Script for Superfood Studio

set -e # Exit immediately if a command exits with a non-zero status

echo "🚀 Starting CI checks for Superfood Studio"

# Step 1: Install dependencies
echo "📦 Installing dependencies..."
pnpm install

# Step 2: TypeScript type checking
echo "🔍 Running TypeScript type check..."
pnpm tsc --noEmit

# Step 3: Lint check
echo "🧹 Running linter..."
pnpm lint

# Step 4: Build the application
echo "🏗️ Building the application..."
pnpm build

# Step 5: Run API tests (if environment is configured)
if [ -n "$TEST_AUTH_TOKEN" ]; then
  echo "🧪 Running API tests..."
  pnpm test-api
else
  echo "⚠️ Skipping API tests: TEST_AUTH_TOKEN not set"
fi

# All checks passed
echo "✅ All checks passed!"
exit 0 