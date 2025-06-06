#!/bin/bash
set -e

# Copy our custom npmrc to prevent npm ci from running
cp .npmrc-ci ~/.npmrc

# Install dependencies with legacy-peer-deps
echo "Installing dependencies with legacy-peer-deps..."
npm install --legacy-peer-deps

# Build the Next.js application
echo "Building the Next.js application..."
npm run build

echo "Build completed successfully!"
