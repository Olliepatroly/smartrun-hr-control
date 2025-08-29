#!/bin/bash

# SmartRun HR Control iOS Test Script
# This script runs tests for the iOS app

set -e  # Exit on any error

echo "🧪 Starting iOS test suite for SmartRun HR Control..."

# Check if we're in the iOS directory
if [ ! -f "App.xcodeproj/project.pbxproj" ]; then
    echo "❌ Error: Please run this script from the ios/App directory"
    exit 1
fi

# Check if Xcode is installed
if ! command -v xcodebuild &> /dev/null; then
    echo "❌ Error: Xcode is not installed. Please install Xcode from the App Store."
    exit 1
fi

# Run unit tests
echo "🔍 Running unit tests..."
xcodebuild test -workspace App.xcworkspace -scheme App -destination 'platform=iOS Simulator,name=iPhone 14'

# Run UI tests if they exist
echo "🖥️  Running UI tests..."
xcodebuild test -workspace App.xcworkspace -scheme App -destination 'platform=iOS Simulator,name=iPhone 14' -only-testing:AppUITests

echo "✅ All iOS tests completed successfully!"