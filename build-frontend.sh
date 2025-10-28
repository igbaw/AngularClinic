#!/bin/bash
set -e

cd WebApp/Frontend

echo "Installing dependencies..."
npm ci

echo "Building Angular app..."
npm run build

# Move files from browser subdirectory to root for Cloudflare Pages
if [ -d "dist/cloudflare/browser" ]; then
  echo "Flattening directory structure for Cloudflare Pages..."
  mv dist/cloudflare/browser/* dist/cloudflare/
  rmdir dist/cloudflare/browser
fi

echo "Build output: dist/cloudflare"