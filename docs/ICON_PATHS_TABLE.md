# Android Icon Replacement - File Paths & Sizes Reference

## Copy-Paste Ready Table

### App Launcher Icons (Critical - 15 files)

| # | File Path | Dimensions | Icon Type |
|---|-----------|------------|-----------|
| 1 | `android/app/src/main/res/mipmap-mdpi/ic_launcher.png` | 48×48 px | Regular Launcher |
| 2 | `android/app/src/main/res/mipmap-hdpi/ic_launcher.png` | 72×72 px | Regular Launcher |
| 3 | `android/app/src/main/res/mipmap-xhdpi/ic_launcher.png` | 96×96 px | Regular Launcher |
| 4 | `android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png` | 144×144 px | Regular Launcher |
| 5 | `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png` | 192×192 px | Regular Launcher |
| 6 | `android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png` | 48×48 px | Round Launcher |
| 7 | `android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png` | 72×72 px | Round Launcher |
| 8 | `android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png` | 96×96 px | Round Launcher |
| 9 | `android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png` | 144×144 px | Round Launcher |
| 10 | `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png` | 192×192 px | Round Launcher |
| 11 | `android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png` | 108×108 px | Adaptive Foreground |
| 12 | `android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png` | 162×162 px | Adaptive Foreground |
| 13 | `android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png` | 216×216 px | Adaptive Foreground |
| 14 | `android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png` | 324×324 px | Adaptive Foreground |
| 15 | `android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png` | 432×432 px | Adaptive Foreground |

### Splash Screens - Portrait (Optional - 5 files)

| # | File Path | Dimensions | Orientation |
|---|-----------|------------|-------------|
| 16 | `android/app/src/main/res/drawable-port-mdpi/splash.png` | 320×480 px | Portrait |
| 17 | `android/app/src/main/res/drawable-port-hdpi/splash.png` | 480×800 px | Portrait |
| 18 | `android/app/src/main/res/drawable-port-xhdpi/splash.png` | 720×1280 px | Portrait |
| 19 | `android/app/src/main/res/drawable-port-xxhdpi/splash.png` | 960×1600 px | Portrait |
| 20 | `android/app/src/main/res/drawable-port-xxxhdpi/splash.png` | 1280×1920 px | Portrait |

### Splash Screens - Landscape (Optional - 5 files)

| # | File Path | Dimensions | Orientation |
|---|-----------|------------|-------------|
| 21 | `android/app/src/main/res/drawable-land-mdpi/splash.png` | 480×320 px | Landscape |
| 22 | `android/app/src/main/res/drawable-land-hdpi/splash.png` | 800×480 px | Landscape |
| 23 | `android/app/src/main/res/drawable-land-xhdpi/splash.png` | 1280×720 px | Landscape |
| 24 | `android/app/src/main/res/drawable-land-xxhdpi/splash.png` | 1600×960 px | Landscape |
| 25 | `android/app/src/main/res/drawable-land-xxxhdpi/splash.png` | 1920×1280 px | Landscape |

### Default Splash (Optional - 1 file)

| # | File Path | Dimensions | Type |
|---|-----------|------------|------|
| 26 | `android/app/src/main/res/drawable/splash.png` | 320×480 px | Default Splash |

---

## Density Reference

| Density Qualifier | Description | Scale Factor |
|-------------------|-------------|--------------|
| mdpi | Medium density | 1.0x (baseline) |
| hdpi | High density | 1.5x |
| xhdpi | Extra high density | 2.0x |
| xxhdpi | Extra extra high density | 3.0x |
| xxxhdpi | Extra extra extra high density | 4.0x |

---

## Source Logo

**Current BFS Logo Location**: `public/logo.jpg` (638×700 px)

---

## Recommended Tool

**Android Asset Studio**: https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html

This tool will generate all 15 launcher icon files automatically in the correct sizes.

---

## Quick Command to List All Files

```bash
# List all current launcher icons
find android/app/src/main/res -name "ic_launcher*.png" | sort

# List all splash screens
find android/app/src/main/res -name "splash.png" | sort
```

---

## Configuration Files

These may need to be reviewed/updated:

| File Path | Purpose | Current Value |
|-----------|---------|---------------|
| `android/app/src/main/res/values/ic_launcher_background.xml` | Background color | `#26A69A` (teal) |
| `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher.xml` | Adaptive icon config | Uses color background |
| `android/app/src/main/res/mipmap-anydpi-v26/ic_launcher_round.xml` | Adaptive round icon | Uses color background |
| `capacitor.config.json` | Splash screen config | `backgroundColor: #ffffff` |

---

## Testing Checklist

After replacing icons:

- [ ] Clean build (`./gradlew clean` or Build > Clean Project)
- [ ] Sync Capacitor (`npm run sync:android`)
- [ ] Rebuild app
- [ ] Uninstall old app from device/emulator
- [ ] Install and launch new build
- [ ] Verify icon on home screen
- [ ] Verify icon in app drawer
- [ ] Verify icon in Settings > Apps
- [ ] Test on Android 8.0+ for adaptive icons
- [ ] Test round icon (if device supports)
- [ ] Test splash screen (if updated)

---

**For complete documentation**: See [ANDROID_LOGO_REPLACEMENT_GUIDE.md](./ANDROID_LOGO_REPLACEMENT_GUIDE.md)
