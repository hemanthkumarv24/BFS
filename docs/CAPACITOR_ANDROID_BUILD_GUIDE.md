# Capacitor Android Build Guide - BFS App

This guide provides step-by-step instructions for building a signed Android AAB (Android App Bundle) for Play Store deployment.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Initial Setup](#initial-setup)
3. [Generate Signing Key](#generate-signing-key)
4. [Configure Signing in Android Studio](#configure-signing-in-android-studio)
5. [Build Signed AAB](#build-signed-aab)
6. [Test the AAB](#test-the-aab)
7. [Upload to Play Store](#upload-to-play-store)

---

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** or **yarn**
- **Android Studio** (latest version)
- **Java Development Kit (JDK)** 11 or higher
- **Capacitor CLI** (installed via npm)

### Environment Variables

Set up the following environment variables:

```bash
# Add to ~/.bashrc or ~/.zshrc
export ANDROID_HOME=$HOME/Android/Sdk
export PATH=$PATH:$ANDROID_HOME/platform-tools
export PATH=$PATH:$ANDROID_HOME/cmdline-tools/latest/bin
```

---

## Initial Setup

### 1. Build React App

First, build your React application:

```bash
npm run build
```

This creates an optimized production build in the `build` directory.

### 2. Add Android Platform

If you haven't added the Android platform yet:

```bash
npm run add:android
```

This creates an `android` folder in your project root.

### 3. Sync Capacitor

Sync your web assets with the Android project:

```bash
npm run sync:android
```

---

## Generate Signing Key

### Create a Keystore

You'll need a keystore file to sign your app. Generate it using the `keytool` command:

```bash
keytool -genkey -v -keystore my-release-key.keystore \
  -alias bfs-app-key \
  -keyalg RSA \
  -keysize 2048 \
  -validity 10000
```

**Fill in the prompts:**
- **Password**: Choose a strong password (remember this!)
- **First and last name**: Your organization name
- **Organizational unit**: Your department
- **Organization**: BubbleFlashServices
- **City/Locality**: Bengaluru
- **State/Province**: Karnataka
- **Country Code**: IN

**Important:** Store the keystore file (`my-release-key.keystore`) in a secure location. **Never commit it to version control!**

### Store Keystore Info Securely

Create a file to store your keystore information (don't commit this):

```
Keystore File: my-release-key.keystore
Keystore Password: [YOUR_PASSWORD]
Key Alias: bfs-app-key
Key Password: [YOUR_KEY_PASSWORD]
```

---

## Configure Signing in Android Studio

### Method 1: Using Android Studio UI

1. **Open Android Studio:**
   ```bash
   npm run open:android
   ```

2. **Navigate to Build → Generate Signed Bundle/APK**

3. **Select "Android App Bundle"** and click **Next**

4. **Configure Key Store:**
   - Click "Choose existing..." or "Create new..."
   - For existing: Select your `my-release-key.keystore` file
   - Enter the keystore password
   - Enter the key alias: `bfs-app-key`
   - Enter the key password
   - Check "Remember passwords"

5. **Select Build Variant:**
   - Choose `release`
   - Click **Finish**

### Method 2: Using gradle.properties (Recommended for CI/CD)

1. **Create a file:** `android/key.properties`

```properties
storePassword=your_keystore_password
keyPassword=your_key_password
keyAlias=bfs-app-key
storeFile=/path/to/my-release-key.keystore
```

**Important:** Add `key.properties` to `.gitignore`!

2. **Update:** `android/app/build.gradle`

Add this code before the `android` block:

```gradle
def keystoreProperties = new Properties()
def keystorePropertiesFile = rootProject.file('key.properties')
if (keystorePropertiesFile.exists()) {
    keystoreProperties.load(new FileInputStream(keystorePropertiesFile))
}

android {
    ...
    
    signingConfigs {
        release {
            keyAlias keystoreProperties['keyAlias']
            keyPassword keystoreProperties['keyPassword']
            storeFile keystoreProperties['storeFile'] ? file(keystoreProperties['storeFile']) : null
            storePassword keystoreProperties['storePassword']
        }
    }
    
    buildTypes {
        release {
            signingConfig signingConfigs.release
            minifyEnabled true
            shrinkResources true
            proguardFiles getDefaultProguardFile('proguard-android-optimize.txt'), 'proguard-rules.pro'
        }
    }
}
```

---

## Build Signed AAB

### Using Android Studio

1. **Open Android Studio:**
   ```bash
   npm run open:android
   ```

2. **Build → Generate Signed Bundle/APK**

3. **Select "Android App Bundle"**

4. **Choose your signing configuration**

5. **Build the AAB:**
   - The AAB will be generated in: `android/app/release/app-release.aab`

### Using Gradle Command Line

```bash
cd android
./gradlew bundleRelease
```

The signed AAB will be located at:
```
android/app/build/outputs/bundle/release/app-release.aab
```

---

## Additional Android Configuration

### Update App Icons

1. Place your app icons in the following directories:
   ```
   android/app/src/main/res/mipmap-hdpi/
   android/app/src/main/res/mipmap-mdpi/
   android/app/src/main/res/mipmap-xhdpi/
   android/app/src/main/res/mipmap-xxhdpi/
   android/app/src/main/res/mipmap-xxxhdpi/
   ```

2. Update icon names in `android/app/src/main/AndroidManifest.xml`:
   ```xml
   <application
       android:icon="@mipmap/ic_launcher"
       android:roundIcon="@mipmap/ic_launcher_round"
       ...>
   ```

### Configure Push Notifications

1. **Add Firebase to your project:**
   - Go to [Firebase Console](https://console.firebase.google.com/)
   - Create a new project or select existing
   - Add Android app
   - Download `google-services.json`
   - Place it in `android/app/`

2. **Update build.gradle files:**

   `android/build.gradle`:
   ```gradle
   buildscript {
       dependencies {
           classpath 'com.google.gms:google-services:4.3.15'
       }
   }
   ```

   `android/app/build.gradle`:
   ```gradle
   apply plugin: 'com.google.gms.google-services'
   
   dependencies {
       implementation 'com.google.firebase:firebase-messaging:23.1.2'
   }
   ```

### Configure Network Security

For HTTPS API calls, ensure network security is configured properly.

Create/Update: `android/app/src/main/res/xml/network_security_config.xml`

```xml
<?xml version="1.0" encoding="utf-8"?>
<network-security-config>
    <base-config cleartextTrafficPermitted="false">
        <trust-anchors>
            <certificates src="system" />
        </trust-anchors>
    </base-config>
    
    <!-- For development only - remove in production -->
    <domain-config cleartextTrafficPermitted="true">
        <domain includeSubdomains="true">localhost</domain>
        <domain includeSubdomains="true">10.0.2.2</domain>
    </domain-config>
</network-security-config>
```

Update `AndroidManifest.xml`:
```xml
<application
    android:networkSecurityConfig="@xml/network_security_config"
    ...>
```

---

## Test the AAB

### Using Internal Testing

1. **Upload to Google Play Console:**
   - Go to Play Console
   - Create an app
   - Navigate to Testing → Internal testing
   - Create a new release
   - Upload your AAB
   - Add testers

2. **Install on device:**
   - Testers receive an email with install link
   - Install and test thoroughly

### Using bundletool (Local Testing)

1. **Install bundletool:**
   ```bash
   # Download from GitHub
   wget https://github.com/google/bundletool/releases/latest/download/bundletool-all.jar
   ```

2. **Generate APKs from AAB:**
   ```bash
   java -jar bundletool-all.jar build-apks \
     --bundle=app-release.aab \
     --output=app-release.apks \
     --mode=universal
   ```

3. **Install on connected device:**
   ```bash
   java -jar bundletool-all.jar install-apks \
     --apks=app-release.apks
   ```

---

## Upload to Play Store

### Prepare for Release

1. **Version Management:**
   - Update version in `android/app/build.gradle`:
     ```gradle
     android {
         defaultConfig {
             versionCode 2  // Increment for each release
             versionName "1.1.0"  // User-facing version
         }
     }
     ```

2. **Test thoroughly:**
   - All features working
   - No crashes
   - Push notifications working
   - Network calls successful
   - Payment flow tested

### Upload Steps

1. **Go to Google Play Console:**
   - https://play.google.com/console

2. **Navigate to Release → Production**

3. **Create new release:**
   - Upload AAB
   - Fill in release notes
   - Add what's new
   - Review and rollout

4. **Submit for review:**
   - Google will review (typically 1-3 days)
   - Address any feedback
   - App goes live once approved

---

## Build Checklist

Before building for production:

- [ ] React app builds without errors
- [ ] All API endpoints use HTTPS
- [ ] JWT authentication working
- [ ] Push notifications configured
- [ ] App icons added for all densities
- [ ] Splash screen configured
- [ ] Network security config updated
- [ ] ProGuard rules updated if needed
- [ ] Version code and version name updated
- [ ] Signing configuration set up
- [ ] AAB generated successfully
- [ ] AAB tested on physical device
- [ ] All required permissions declared
- [ ] Privacy policy and terms of service ready
- [ ] Google Play listing prepared (descriptions, screenshots)

---

## Troubleshooting

### Build Fails

**Error: "Execution failed for task ':app:bundleReleaseResources'"**
- Solution: Clean and rebuild
  ```bash
  cd android
  ./gradlew clean
  ./gradlew bundleRelease
  ```

### Signing Issues

**Error: "keystore password was incorrect"**
- Solution: Double-check your keystore password
- Regenerate keystore if password is lost (note: you'll need to create a new Play Store listing)

### Capacitor Sync Issues

**Error: "Unable to sync"**
- Solution: Ensure build directory exists
  ```bash
  npm run build
  npm run sync:android
  ```

### Push Notifications Not Working

- Ensure `google-services.json` is in `android/app/`
- Verify Firebase project configuration
- Check app permissions in AndroidManifest.xml

---

## Security Best Practices

1. **Never commit:**
   - Keystore files
   - key.properties
   - google-services.json (for public repos)
   - API keys in code

2. **Use environment variables** for sensitive data

3. **Enable ProGuard** for code obfuscation

4. **Use HTTPS only** for API calls

5. **Implement certificate pinning** for critical API calls

6. **Store sensitive data** in Capacitor Preferences (encrypted on device)

---

## CI/CD Integration

For automated builds, consider using:

### GitHub Actions Example

```yaml
name: Build Android AAB

on:
  push:
    branches: [ main ]

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      
      - name: Set up Node.js
        uses: actions/setup-node@v2
        with:
          node-version: '16'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Build React app
        run: npm run build
      
      - name: Sync Capacitor
        run: npx cap sync android
      
      - name: Set up JDK
        uses: actions/setup-java@v2
        with:
          java-version: '11'
          distribution: 'adopt'
      
      - name: Build AAB
        run: |
          cd android
          ./gradlew bundleRelease
        env:
          KEYSTORE_PASSWORD: ${{ secrets.KEYSTORE_PASSWORD }}
          KEY_PASSWORD: ${{ secrets.KEY_PASSWORD }}
      
      - name: Upload AAB
        uses: actions/upload-artifact@v2
        with:
          name: app-release.aab
          path: android/app/build/outputs/bundle/release/app-release.aab
```

---

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Android Developer Guide](https://developer.android.com/studio/publish/app-signing)
- [Google Play Console](https://play.google.com/console)
- [Firebase Console](https://console.firebase.google.com/)

---

## Support

For issues specific to BFS app, contact the development team.

For Capacitor-related issues, visit:
- [Capacitor Forums](https://forum.ionicframework.com/c/capacitor/)
- [Capacitor GitHub](https://github.com/ionic-team/capacitor)
