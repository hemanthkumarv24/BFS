# Android Logo Replacement - Quick Reference

## 📋 Quick Summary

**Total Files to Replace**: 26 files minimum (15 critical + 11 optional)

---

## 🎯 Critical Files (MUST REPLACE)

### App Launcher Icons (15 files)

#### 1. Regular Launcher Icons (5 files)
```
android/app/src/main/res/mipmap-mdpi/ic_launcher.png       → 48×48 px
android/app/src/main/res/mipmap-hdpi/ic_launcher.png       → 72×72 px
android/app/src/main/res/mipmap-xhdpi/ic_launcher.png      → 96×96 px
android/app/src/main/res/mipmap-xxhdpi/ic_launcher.png     → 144×144 px
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher.png    → 192×192 px
```

#### 2. Round Launcher Icons (5 files)
```
android/app/src/main/res/mipmap-mdpi/ic_launcher_round.png    → 48×48 px
android/app/src/main/res/mipmap-hdpi/ic_launcher_round.png    → 72×72 px
android/app/src/main/res/mipmap-xhdpi/ic_launcher_round.png   → 96×96 px
android/app/src/main/res/mipmap-xxhdpi/ic_launcher_round.png  → 144×144 px
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_round.png → 192×192 px
```

#### 3. Adaptive Icon Foregrounds (5 files)
```
android/app/src/main/res/mipmap-mdpi/ic_launcher_foreground.png    → 108×108 px
android/app/src/main/res/mipmap-hdpi/ic_launcher_foreground.png    → 162×162 px
android/app/src/main/res/mipmap-xhdpi/ic_launcher_foreground.png   → 216×216 px
android/app/src/main/res/mipmap-xxhdpi/ic_launcher_foreground.png  → 324×324 px
android/app/src/main/res/mipmap-xxxhdpi/ic_launcher_foreground.png → 432×432 px
```

---

## 🌄 Optional Splash Screens (11 files)

### Portrait Splash Screens (5 files)
```
android/app/src/main/res/drawable-port-mdpi/splash.png    → 320×480 px
android/app/src/main/res/drawable-port-hdpi/splash.png    → 480×800 px
android/app/src/main/res/drawable-port-xhdpi/splash.png   → 720×1280 px
android/app/src/main/res/drawable-port-xxhdpi/splash.png  → 960×1600 px
android/app/src/main/res/drawable-port-xxxhdpi/splash.png → 1280×1920 px
```

### Landscape Splash Screens (5 files)
```
android/app/src/main/res/drawable-land-mdpi/splash.png    → 480×320 px
android/app/src/main/res/drawable-land-hdpi/splash.png    → 800×480 px
android/app/src/main/res/drawable-land-xhdpi/splash.png   → 1280×720 px
android/app/src/main/res/drawable-land-xxhdpi/splash.png  → 1600×960 px
android/app/src/main/res/drawable-land-xxxhdpi/splash.png → 1920×1280 px
```

### Default Splash (1 file)
```
android/app/src/main/res/drawable/splash.png → 320×480 px
```

---

## 🔧 Recommended Tool

**Best Option**: [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/)
- ✅ Free & web-based
- ✅ Generates all densities automatically
- ✅ Official Android tool
- ✅ Supports adaptive icons
- ✅ No installation required

**Alternative**: Android Studio Image Asset Studio (built-in)

---

## 📏 Icon Design Guidelines

### Launcher Icons
- **Safe Zone**: Keep logo in center 66% of icon
- **Format**: PNG with transparency (RGBA)
- **Shape**: Square (1:1 aspect ratio)

### Adaptive Icons (Foreground)
- **Safe Zone**: Center 66% (to prevent clipping)
- **Size**: 108dp but viewable area is ~66dp diameter circle
- **Padding**: 15-20% recommended

### Splash Screens
- **Logo Size**: 30-40% of screen height
- **Background**: Use BFS brand color
- **Format**: PNG or JPEG

---

## 🚀 Quick Steps to Replace

1. **Prepare Source**: Use `public/logo.jpg` (638×700 px)

2. **Generate Icons**:
   - Go to https://romannurik.github.io/AndroidAssetStudio/icons-launcher.html
   - Upload logo
   - Set background color (current: #26A69A)
   - Add 15-20% padding
   - Download ZIP

3. **Replace Files**:
   - Extract ZIP
   - Copy to `android/app/src/main/res/`
   - Replace all `ic_launcher*.png` files

4. **Sync & Build**:
   ```bash
   npm run sync:android
   ```

5. **Test**: Uninstall app, rebuild, and reinstall to see changes

---

## 📂 Source Logo Location

Current BFS logos in repository:
- `public/logo.jpg` → 638×700 px (JPEG) ✅ **Use this as source**
- `public/logo.png` → 66×53 px (PNG) ⚠️ Too small

---

## 🎨 Current Configuration

**Adaptive Icon Background Color**: `#26A69A` (teal)
- File: `android/app/src/main/res/values/ic_launcher_background.xml`
- Update this if BFS brand color is different

**Splash Screen Background**: `#ffffff` (white)
- File: `capacitor.config.json`
- Configured in Capacitor

---

## ✅ Verification Checklist

- [ ] All 15 launcher icon files replaced
- [ ] Icons show BFS logo on home screen
- [ ] Round icons work correctly
- [ ] Adaptive icons work on Android 8.0+
- [ ] Logo is not clipped or distorted
- [ ] Icon is visible at all sizes
- [ ] Splash screens show BFS branding (if updated)

---

## 📖 Full Documentation

For detailed information, see: [ANDROID_LOGO_REPLACEMENT_GUIDE.md](./ANDROID_LOGO_REPLACEMENT_GUIDE.md)

---

**Need Help?** Check the troubleshooting section in the full guide.
