#!/bin/bash

# SmartRun HR Control iOS Archive Script
# This script creates an archive for App Store submission

set -e  # Exit on any error

echo "📦 Creating iOS archive for SmartRun HR Control..."

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

# Create archive directory if it doesn't exist
mkdir -p ~/Desktop/SmartRunArchives

# Set archive path with timestamp
ARCHIVE_PATH=~/Desktop/SmartRunArchives/SmartRunHRControl_$(date +%Y%m%d_%H%M%S).xcarchive

# Create the archive
echo "🏗️  Creating archive..."
xcodebuild archive \
    -workspace App.xcworkspace \
    -scheme App \
    -configuration Release \
    -archivePath "$ARCHIVE_PATH" \
    -allowProvisioningUpdates

echo "✅ Archive created successfully at: $ARCHIVE_PATH"
echo "💡 Next steps:"
echo "   1. Open Xcode"
echo "   2. Go to Window > Organizer"
echo "   3. Select your archive and click 'Distribute App'"
echo "   4. Follow the App Store submission process"