#!/usr/bin/env bash
set -euo pipefail

echo "🔧 Appflow iOS prebuild: ensuring Capacitor iOS platform is synced and CocoaPods workspace is generated"

# 1) Make sure Capacitor iOS is present and synced
#    (Appflow already installs node deps and builds web; we only sync native here)
if ! command -v npx >/dev/null 2>&1; then
  echo "❌ npx is not available."
  exit 1
fi

# Sync native iOS (tolerate copy/update differences between build stacks)
(npx cap copy ios || true)
(npx cap update ios || true)
npx cap sync ios

# 2) Generate .xcworkspace by installing CocoaPods
if [ -d "ios/App" ]; then
  pushd ios/App >/dev/null
else
  echo "❌ ios/App directory not found. Did Capacitor add the iOS platform?"
  exit 1
fi

if ! command -v pod >/dev/null 2>&1; then
  echo "❌ CocoaPods (pod) not found on the build agent."
  exit 1
fi

# If workspace already exists, we can skip. Otherwise, install pods to create it.
if [ -f "App.xcworkspace/contents.xcworkspacedata" ]; then
  echo "✅ App.xcworkspace already exists. Skipping pod install."
else
  echo "📦 Installing CocoaPods dependencies (this will create App.xcworkspace)..."
  pod install --repo-update
fi

popd >/dev/null

echo "✅ Prebuild complete: ios/App/App.xcworkspace is ready."
