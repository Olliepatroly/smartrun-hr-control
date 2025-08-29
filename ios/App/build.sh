#!/bin/bash

# SmartRun HR Control iOS Build Script
# This script automates the iOS build process for the Capacitor app

set -e  # Exit on any error

echo "🚀 Starting iOS build process for SmartRun HR Control..."

# Check if we're in the project root
if [ ! -f "capacitor.config.ts" ]; then
    echo "❌ Error: Please run this script from the project root directory"
    exit 1
fi

# Install dependencies if node_modules doesn't exist
if [ ! -d "node_modules" ]; then
    echo "📦 Installing dependencies..."
    npm install
fi

# Build the web app
echo "🔨 Building web application..."
npm run build

# Sync Capacitor
echo "🔄 Syncing Capacitor..."
npx cap sync ios

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Error: Xcode is not installed. Please install Xcode from the App Store."
    exit 1
fi

# Navigate to iOS directory
cd ios/App

# Install CocoaPods dependencies
echo "🍫 Installing CocoaPods dependencies..."
if ! command -v pod &> /dev/null; then
    echo "❌ Error: CocoaPods is not installed. Please install it with: sudo gem install cocoapods"
    exit 1
fi

pod install

# Build the iOS app
echo "📱 Building iOS app..."
xcodebuild -workspace App.xcworkspace -scheme App -configuration Release -destination generic/platform=iOS build

echo "✅ iOS build completed successfully!"
echo "💡 To run on simulator or device, use: npx cap run ios"
echo "💡 To open in Xcode, use: npx cap open ios"