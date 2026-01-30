# Android Logo Replacement Guide

## Overview
This guide documents all the image paths in the Android app where the BFS logo needs to be replaced. Currently, the app is using default Android launcher icons instead of the BFS logo.

## Current BFS Logo Files
The BFS logo is available in the following locations:
- `public/logo.jpg` - 638x700 pixels (JPEG)
- `public/logo.png` - 66x53 pixels (PNG, very small)

**Recommendation**: Use the `logo.jpg` file as the source for generating all required icon sizes.

---

## 1. App Launcher Icons (Required)

These icons appear on the device home screen, app drawer, and in system settings.

### Regular Launcher Icons (`ic_launcher.png`)
Located in: `android/app/src/main/res/mipmap-[density]/ic_launcher.png`

| Density | Path | Size Required | Current Size |
|---------|------|---------------|--------------|
| mdpi | `mipmap-mdpi/ic_launcher.png` | 48x48 px | ✓ 48x48 |
| hdpi | `mipmap-hdpi/ic_launcher.png` | 72x72 px | ✓ 72x72 |
| xhdpi | `mipmap-xhdpi/ic_launcher.png` | 96x96 px | ✓ 96x96 |
| xxhdpi | `mipmap-xxhdpi/ic_launcher.png` | 144x144 px | ✓ 144x144 |
| xxxhdpi | `mipmap-xxxhdpi/ic_launcher.png` | 192x192 px | ✓ 192x192 |

**Total files to replace: 5**

### Round Launcher Icons (`ic_launcher_round.png`)
Located in: `android/app/src/main/res/mipmap-[density]/ic_launcher_round.png`

These are used on devices that support circular icons (e.g., some Android launchers).

| Density | Path | Size Required | Current Size |
|---------|------|---------------|--------------|
| mdpi | `mipmap-mdpi/ic_launcher_round.png` | 48x48 px | ✓ 48x48 |
| hdpi | `mipmap-hdpi/ic_launcher_round.png` | 72x72 px | ✓ 72x72 |
| xhdpi | `mipmap-xhdpi/ic_launcher_round.png` | 96x96 px | ✓ 96x96 |
| xxhdpi | `mipmap-xxhdpi/ic_launcher_round.png` | 144x144 px | ✓ 144x144 |
| xxxhdpi | `mipmap-xxxhdpi/ic_launcher_round.png` | 192x192 px | ✓ 192x192 |

**Total files to replace: 5**

### Foreground Icons for Adaptive Icons (`ic_launcher_foreground.png`)
Located in: `android/app/src/main/res/mipmap-[density]/ic_launcher_foreground.png`

These are used in Adaptive Icons (Android 8.0+) and should contain the main logo with transparency.

| Density | Path | Size Required | Current Size |
|---------|------|---------------|--------------|
| mdpi | `mipmap-mdpi/ic_launcher_foreground.png` | 108x108 px | ✓ 108x108 |
| hdpi | `mipmap-hdpi/ic_launcher_foreground.png` | 162x162 px | ✓ 162x162 |
| xhdpi | `mipmap-xhdpi/ic_launcher_foreground.png` | 216x216 px | ✓ 216x216 |
| xxhdpi | `mipmap-xxhdpi/ic_launcher_foreground.png` | 324x324 px | ✓ 324x324 |
| xxxhdpi | `mipmap-xxxhdpi/ic_launcher_foreground.png` | 432x432 px | ✓ 432x432 |

**Total files to replace: 5**

**Note**: Foreground icons should have the logo centered with some padding (safe zone). The logo should be placed in the center 66% of the icon to ensure it's not clipped by the system mask.

---

## 2. Adaptive Icon Configuration Files

### Adaptive Icon XML (for API 26+)
Located in: `android/app/src/main/res/mipmap-anydpi-v26/`

These XML files define how the adaptive icon is composed:
- `ic_launcher.xml` - Defines the regular adaptive icon
- `ic_launcher_round.xml` - Defines the round adaptive icon

**Current configuration:**
```xml
<adaptive-icon xmlns:android="http://schemas.android.com/apk/res/android">
    <background android:drawable="@color/ic_launcher_background"/>
    <foreground android:drawable="@mipmap/ic_launcher_foreground"/>
</adaptive-icon>
```

**Files to review (may need color update): 2**

### Background Color Definition
Located in: `android/app/src/main/res/values/ic_launcher_background.xml`

This file defines the background color for the adaptive icon. Currently set to `#26A69A` (teal).

**Action**: Update the background color to match BFS branding if needed.

**Files to potentially update: 1**

### Drawable Background (Alternative)
Located in: `android/app/src/main/res/drawable/ic_launcher_background.xml`

This is a vector drawable with a grid pattern. May need to be simplified or replaced.

**Files to potentially update: 1**

---

## 3. Splash Screen Images (Optional but Recommended)

Splash screens are shown when the app is launching. While Capacitor handles splash screens, these legacy files exist.

### Portrait Splash Screens
Located in: `android/app/src/main/res/drawable-port-[density]/splash.png`

| Density | Path | Size Required | Current Size |
|---------|------|---------------|--------------|
| mdpi | `drawable-port-mdpi/splash.png` | 320x480 px | ✓ 320x480 |
| hdpi | `drawable-port-hdpi/splash.png` | 480x800 px | ✓ 480x800 |
| xhdpi | `drawable-port-xhdpi/splash.png` | 720x1280 px | ✓ 720x1280 |
| xxhdpi | `drawable-port-xxhdpi/splash.png` | 960x1600 px | ✓ 960x1600 |
| xxxhdpi | `drawable-port-xxxhdpi/splash.png` | 1280x1920 px | ✓ 1280x1920 |

**Total files to replace: 5**

### Landscape Splash Screens
Located in: `android/app/src/main/res/drawable-land-[density]/splash.png`

| Density | Path | Size Required | Current Size |
|---------|------|---------------|--------------|
| mdpi | `drawable-land-mdpi/splash.png` | 480x320 px | ✓ 480x320 |
| hdpi | `drawable-land-hdpi/splash.png` | 800x480 px | ✓ 800x480 |
| xhdpi | `drawable-land-xhdpi/splash.png` | 1280x720 px | ✓ 1280x720 |
| xxhdpi | `drawable-land-xxhdpi/splash.png` | 1600x960 px | ✓ 1600x960 |
| xxxhdpi | `drawable-land-xxxhdpi/splash.png` | 1920x1280 px | ✓ 1920x1280 |

**Total files to replace: 5**

### Default Splash Screen
Located in: `android/app/src/main/res/drawable/splash.png`

| Path | Size Required | Current Size |
|------|---------------|--------------|
| `drawable/splash.png` | 320x480 px | ✓ 320x480 |

**Total files to replace: 1**

---

## Summary of All Files to Replace

### Critical (Must Replace - App Icon)
1. **Launcher Icons**: 5 files (`ic_launcher.png` in each density)
2. **Round Launcher Icons**: 5 files (`ic_launcher_round.png` in each density)
3. **Foreground Icons**: 5 files (`ic_launcher_foreground.png` in each density)

**Total Critical Files: 15**

### Optional (Splash Screens)
4. **Portrait Splash Screens**: 5 files
5. **Landscape Splash Screens**: 5 files
6. **Default Splash Screen**: 1 file

**Total Optional Files: 11**

### Configuration Files to Review
7. **Adaptive Icon XMLs**: 2 files
8. **Background Color**: 1 file
9. **Background Drawable**: 1 file

**Total Configuration Files: 4**

---

## Recommended Tools for Generating Icon Sizes

### 1. **Android Asset Studio (Recommended - Free & Official)**
**URL**: https://romannurik.github.io/AndroidAssetStudio/

**Features**:
- Official tool from Android developers
- Generates all required icon densities automatically
- Supports adaptive icons with foreground and background
- Generates proper padding and safe zones
- Supports both regular and round icons
- Web-based, no installation required

**How to use**:
1. Visit the website
2. Select "Launcher Icon Generator" or "Image Asset Studio"
3. Upload your BFS logo (`logo.jpg`)
4. Configure padding, shape, and background color
5. Download the generated ZIP file containing all densities
6. Extract and replace the files in the respective directories

### 2. **Icon Kitchen (Free Alternative)**
**URL**: https://icon.kitchen/

**Features**:
- Modern UI
- Generates adaptive icons
- Supports multiple platforms (Android, iOS, Web)
- Automatic density generation
- Custom background colors

### 3. **Android Studio Image Asset Studio (Best for Developers)**
**Tool**: Built into Android Studio

**How to use**:
1. Open Android Studio
2. Right-click on `res` folder
3. Select `New > Image Asset`
4. Choose "Launcher Icons (Adaptive and Legacy)"
5. Upload your logo
6. Configure foreground, background, and shape
7. Preview and generate

**Advantages**:
- Most accurate for Android development
- Direct integration with project
- Previews on different devices
- Handles all configurations automatically

### 4. **ImageMagick (Command Line - For Advanced Users)**
**Tool**: Command-line image processing

**Example command to resize**:
```bash
# Install ImageMagick first
# For regular launcher icons
convert logo.jpg -resize 48x48 mipmap-mdpi/ic_launcher.png
convert logo.jpg -resize 72x72 mipmap-hdpi/ic_launcher.png
convert logo.jpg -resize 96x96 mipmap-xhdpi/ic_launcher.png
convert logo.jpg -resize 144x144 mipmap-xxhdpi/ic_launcher.png
convert logo.jpg -resize 192x192 mipmap-xxxhdpi/ic_launcher.png
```

### 5. **Capacitor Assets (For Capacitor Projects)**
**Package**: `@capacitor/assets`

**Installation**:
```bash
npm install -D @capacitor/assets
```

**Usage**:
```bash
# Create an assets folder with your logo
npx capacitor-assets generate --android
```

**Note**: Requires a specific folder structure with source images.

---

## Design Guidelines

### 1. **Launcher Icon Design**
- **Aspect Ratio**: Square (1:1)
- **Safe Zone**: Keep important content in the center 66% of the icon
- **Background**: Consider using a solid color or subtle gradient
- **File Format**: PNG with transparency (RGBA)
- **Content**: Logo should be clear and recognizable at small sizes

### 2. **Adaptive Icon Design (Android 8.0+)**
- **Foreground**: Main logo with transparency
- **Background**: Solid color or simple pattern
- **Safe Zone**: Logo should fit within a circular mask (center 66%)
- **Total Size**: 108dp x 108dp, but viewable area is ~66dp diameter circle

### 3. **Round Icon Design**
- **Shape**: Circular
- **Content**: Logo should be visible when cropped to circle
- **Padding**: Add adequate padding to prevent logo from touching edges

### 4. **Splash Screen Design**
- **Layout**: Center the logo with brand color background
- **Logo Size**: ~30-40% of screen height for portrait, ~30% for landscape
- **Background**: Use BFS brand color (#ffffff based on capacitor.config.json)
- **Format**: PNG or JPEG

---

## Step-by-Step Replacement Process

### Step 1: Prepare the Source Logo
1. Use `public/logo.jpg` (638x700 px) as the source
2. Ensure the logo has good contrast and is clearly visible
3. If needed, create a square version with padding

### Step 2: Generate Icons Using Android Asset Studio
1. Go to https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
2. Upload `logo.jpg`
3. Configure:
   - **Foreground**: Your logo
   - **Background**: Choose BFS brand color (or #26A69A if keeping current)
   - **Shape**: Generate all shapes
   - **Trim**: Yes
   - **Padding**: 10-20%
4. Click "Download ZIP"

### Step 3: Replace Icon Files
1. Extract the downloaded ZIP file
2. Copy files to the Android project:
   ```
   android/app/src/main/res/
   ├── mipmap-mdpi/
   ├── mipmap-hdpi/
   ├── mipmap-xhdpi/
   ├── mipmap-xxhdpi/
   └── mipmap-xxxhdpi/
   ```
3. Replace existing `ic_launcher.png`, `ic_launcher_round.png`, and `ic_launcher_foreground.png` files

### Step 4: Update Configuration (If Needed)
1. Update background color in `values/ic_launcher_background.xml` if needed
2. Verify adaptive icon XMLs in `mipmap-anydpi-v26/` are correct

### Step 5: Generate Splash Screens (Optional)
1. Use Android Asset Studio or create manually
2. Create images with BFS logo centered on brand color background
3. Generate for all densities and orientations
4. Replace files in `drawable-port-*` and `drawable-land-*` directories

### Step 6: Build and Test
1. Sync Capacitor: `npm run sync:android`
2. Clean and rebuild the Android project
3. Test on multiple Android versions (especially 8.0+ for adaptive icons)
4. Verify icon appears correctly on home screen, app drawer, and settings

---

## Troubleshooting

### Issue: Icon doesn't update after replacement
**Solution**: 
- Clear app data and cache
- Uninstall and reinstall the app
- Clean and rebuild the project

### Issue: Adaptive icon looks clipped
**Solution**:
- Ensure logo is in the center 66% of the foreground image
- Add more padding around the logo

### Issue: Icon looks pixelated
**Solution**:
- Use higher resolution source image
- Ensure proper anti-aliasing when resizing

### Issue: Round icon looks distorted
**Solution**:
- Design the logo to fit within a circular safe zone
- Add equal padding on all sides

---

## References

- [Android Launcher Icons Guide](https://developer.android.com/guide/practices/ui_guidelines/icon_design_launcher)
- [Adaptive Icons Guide](https://developer.android.com/guide/practices/ui_guidelines/icon_design_adaptive)
- [Material Design Icon Guidelines](https://material.io/design/iconography/product-icons.html)
- [Capacitor Assets Documentation](https://github.com/ionic-team/capacitor-assets)

---

## Checklist

- [ ] Download and prepare BFS logo source file
- [ ] Generate launcher icons using Android Asset Studio
- [ ] Replace all 15 critical icon files (ic_launcher.png, ic_launcher_round.png, ic_launcher_foreground.png)
- [ ] Update adaptive icon background color (if needed)
- [ ] Generate and replace splash screen images (optional)
- [ ] Test on Android device/emulator
- [ ] Verify icon appears correctly in all contexts (home screen, app drawer, settings)
- [ ] Verify adaptive icon works on Android 8.0+ devices
- [ ] Build release APK/AAB and verify icon

---

**Last Updated**: January 30, 2026
**Document Version**: 1.0
