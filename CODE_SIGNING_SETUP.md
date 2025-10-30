# Code Signing Setup for GitHub Actions

This guide explains how to set up code signing for macOS builds on GitHub Actions, so your DMG files won't show the "damaged and can't be opened" error.

## Prerequisites

### 1. Apple Developer Account
- Cost: **$99/year**
- Sign up at: https://developer.apple.com/programs/enroll/

### 2. Certificates You Need
- **Developer ID Application Certificate** (for code signing)
- **Developer ID Installer Certificate** (optional, for pkg installers)

## Step 1: Create Certificates

### Using Xcode (Easiest)
1. Open **Xcode**
2. Go to **Xcode → Settings → Accounts**
3. Add your Apple ID
4. Select your team → **Manage Certificates**
5. Click **+** → **Developer ID Application**
6. Xcode will create and download the certificate

### Using Apple Developer Portal (Manual)
1. Go to https://developer.apple.com/account/resources/certificates/list
2. Click **+** to create a new certificate
3. Select **Developer ID Application**
4. Follow the instructions to create a Certificate Signing Request (CSR)
5. Upload the CSR and download your certificate

## Step 2: Export Certificate

1. Open **Keychain Access** (Applications → Utilities → Keychain Access)
2. Select **My Certificates** in the left sidebar
3. Find **Developer ID Application: Your Name**
4. Right-click → **Export "Developer ID Application: Your Name"**
5. Save as: `certificate.p12`
6. **Set a strong password** (you'll need this for GitHub Secrets)

## Step 3: Prepare Certificate for GitHub

Convert the certificate to base64:

```bash
# In Terminal, navigate to where you saved certificate.p12
base64 -i certificate.p12 -o certificate-base64.txt

# Display the content
cat certificate-base64.txt
```

Copy the entire base64 string (it will be very long).

## Step 4: Create App-Specific Password

For notarization, you need an app-specific password:

1. Go to https://appleid.apple.com
2. Sign in with your Apple ID
3. Go to **Security** → **App-Specific Passwords**
4. Click **Generate Password**
5. Label it: "BoxRFID Notarization"
6. **Save this password** - you'll need it for GitHub Secrets

## Step 5: Add Secrets to GitHub

1. Go to your GitHub repository
2. Click **Settings** → **Secrets and variables** → **Actions**
3. Click **New repository secret**
4. Add these secrets:

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `MACOS_CERTIFICATE` | (paste base64 string) | The base64-encoded .p12 certificate |
| `MACOS_CERTIFICATE_PASSWORD` | (your p12 password) | Password you set when exporting the certificate |
| `APPLE_ID` | your@email.com | Your Apple Developer email |
| `APPLE_APP_SPECIFIC_PASSWORD` | (app password) | The app-specific password from Step 4 |
| `APPLE_TEAM_ID` | ABC123XYZ | Your Team ID (see below) |

### Finding Your Team ID

**Method 1: Apple Developer Portal**
- Go to https://developer.apple.com/account
- Your Team ID is shown in the top right corner

**Method 2: Keychain Access**
- Open your certificate in Keychain Access
- Look for "Organizational Unit" - that's your Team ID

**Method 3: Terminal**
```bash
# List all your certificates and find the Team ID
security find-identity -v -p codesigning
```

## Step 6: Update package.json (Optional)

Add notarization settings to your `package.json`:

```json
{
  "build": {
    "mac": {
      "hardenedRuntime": true,
      "gatekeeperAssess": false,
      "entitlements": "build/entitlements.mac.plist",
      "entitlementsInherit": "build/entitlements.mac.plist",
      "notarize": {
        "teamId": "${APPLE_TEAM_ID}"
      }
    }
  }
}
```

## Step 7: Verify Setup

### Test Locally First

```bash
# Set environment variables
export CSC_LINK=/path/to/certificate.p12
export CSC_KEY_PASSWORD=your-password
export APPLE_ID=your@email.com
export APPLE_APP_SPECIFIC_PASSWORD=your-app-password
export APPLE_TEAM_ID=ABC123XYZ

# Build and sign
npm run build-mac
```

If this works locally, GitHub Actions should work too.

### Test on GitHub

1. Push your changes to GitHub
2. Create a new release (or trigger workflow manually)
3. Wait for the build to complete
4. Download the DMG from the release
5. Open it - it should work without quarantine issues!

## How It Works

When secrets are configured:

1. **Certificate Import**: GitHub Actions imports your certificate into a temporary keychain
2. **Code Signing**: electron-builder signs the app with your Developer ID
3. **Notarization**: The app is sent to Apple for notarization
4. **Stapling**: The notarization ticket is stapled to the app
5. **DMG Creation**: A signed, notarized DMG is created

When secrets are NOT configured:

- The workflow falls back to unsigned builds
- Users need to run the `fix-github-dmg.sh` script

## Costs & Considerations

### Paid Option (Code Signing)
- **Cost**: $99/year (Apple Developer Account)
- **Pros**: 
  - No "damaged app" errors
  - Professional appearance
  - Users can double-click to open
  - Better user experience
- **Cons**:
  - Annual cost
  - Setup complexity

### Free Option (Current Setup)
- **Cost**: $0
- **Pros**:
  - Free
  - Standard for open-source projects
  - Works fine with fix script
- **Cons**:
  - Users see "damaged" warning initially
  - Requires running fix script
  - Less polished experience

## Troubleshooting

### "No identity found" error
- Make sure your certificate is valid
- Check that it's a "Developer ID Application" certificate (not "Mac Development")
- Verify the base64 encoding is correct

### Notarization fails
- Check your app-specific password is correct
- Verify your Team ID matches your certificate
- Ensure your Apple ID has the Developer Program membership

### Build succeeds but app still shows "damaged"
- Notarization may have failed silently
- Check the build logs for notarization errors
- Try notarizing manually using `xcrun notarytool`

## Alternative: Skip Notarization

If you only want code signing (no notarization), remove the notarization config:

```json
{
  "build": {
    "mac": {
      "hardenedRuntime": true,
      "gatekeeperAssess": false
      // Remove notarize section
    }
  }
}
```

This will sign the app but not notarize it. Users might still see warnings, but the app will be easier to open than completely unsigned builds.

## Resources

- [Apple Code Signing Guide](https://developer.apple.com/support/code-signing/)
- [electron-builder Code Signing](https://www.electron.build/code-signing)
- [Notarization for macOS](https://developer.apple.com/documentation/security/notarizing_macos_software_before_distribution)
- [GitHub Actions Secrets](https://docs.github.com/en/actions/security-guides/encrypted-secrets)

## Summary

**Current Status**: Builds are unsigned (free option)  
**To Enable Signing**: Follow steps 1-6 above and add secrets to GitHub  
**Recommendation**: If this is a personal/open-source project, the free option is perfectly acceptable. Commercial projects should invest in code signing.
