# BFS Documentation

This directory contains documentation for the BFS (Bubble Flash Services) Android application.

## 📚 Documentation Index

### Android Logo & Branding

#### [Android Logo Replacement Guide](./ANDROID_LOGO_REPLACEMENT_GUIDE.md) 📖
**Comprehensive documentation covering:**
- Complete list of all 30 files (26 image files + 4 configuration files) that need review/replacement
- Exact file paths and required dimensions for each icon
- Detailed explanation of Android icon types (launcher, round, adaptive, splash)
- Step-by-step replacement process
- Design guidelines and best practices
- Troubleshooting tips

**Who should read this**: Designers, developers, and anyone needing to understand the complete Android icon system.

#### [Android Logo Quick Reference](./ANDROID_LOGO_QUICK_REFERENCE.md) ⚡
**Quick reference guide with:**
- At-a-glance list of all file paths and sizes
- Fastest tool recommendation (Android Asset Studio)
- Quick steps for replacement
- Verification checklist

**Who should read this**: Developers who want to quickly replace the icons without detailed background.

---

### Android Development

#### [Android Studio Guide](./ANDROID_STUDIO_GUIDE.md)
Guide for setting up and working with Android Studio for the BFS app.

#### [Play Store Deployment](./PLAYSTORE_DEPLOY.md)
Instructions for deploying the app to Google Play Store.

---

## 🚀 Quick Start - Replace App Logo

**Current Issue**: App is showing default Android icon instead of BFS logo.

**Quick Fix**:
1. Read the [Quick Reference Guide](./ANDROID_LOGO_QUICK_REFERENCE.md)
2. Use [Android Asset Studio](https://romannurik.github.io/AndroidAssetStudio/) to generate icons from `public/logo.jpg`
3. Replace the 15 critical icon files in `android/app/src/main/res/mipmap-*/`
4. Run `npm run sync:android` and rebuild

**Need Details?** See the [Full Replacement Guide](./ANDROID_LOGO_REPLACEMENT_GUIDE.md)

---

## 📋 Document Updates

| Document | Last Updated | Version |
|----------|--------------|---------|
| Android Logo Replacement Guide | 2026-01-30 | 1.0 |
| Android Logo Quick Reference | 2026-01-30 | 1.0 |
| Android Studio Guide | - | - |
| Play Store Deploy | - | - |

---

## 🛠️ Contributing to Documentation

When updating documentation:
1. Keep the Quick Reference in sync with the Full Guide
2. Update the "Last Updated" date in documents
3. Update this index if adding new documents
4. Use clear headings and structure
5. Include examples where helpful

---

## 📞 Support

For issues or questions:
- Check the troubleshooting sections in each guide
- Review Android documentation: https://developer.android.com
- Check Capacitor docs: https://capacitorjs.com

---

**Repository**: [hemanthkumarv24/BFS](https://github.com/hemanthkumarv24/BFS)
