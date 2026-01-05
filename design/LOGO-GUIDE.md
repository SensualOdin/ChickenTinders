# ChickenTinders Logo & Favicon Guide

## 📁 File Inventory

### ✅ Production-Ready SVG Files

| File | Size | Dimensions | Usage |
|------|------|------------|-------|
| **logo-full-optimized.svg** | 7.6KB | 800x240 | Website header, landing page, email signatures |
| **icon-square.svg** | 2.5KB | 100x100 | PWA icons, app stores, social media profile pics |
| **favicon.svg** | 1.2KB | 32x32 | Modern browser favicons |
| **icon-only-optimized.svg** | 2.0KB | Variable | General purpose (from original design) |

### 🗑️ Old Files (Can Delete)

- `svglogo.svg` (24KB) - Replaced by logo-full-optimized.svg
- `icon.svg` (24KB) - Replaced by icon-square.svg
- `logo.png` - Can keep for reference

---

## 🚀 Quick Start: Generate PNG Favicons

### Recommended: Use RealFaviconGenerator

1. Go to https://realfavicongenerator.net/
2. Upload `icon-square.svg`
3. Download generated package
4. Place files in `/public` folder
5. Copy HTML from `favicon-html.html` to your `<head>`

**Result:** All favicon formats in 2 minutes!

---

## 📱 PWA Setup

1. **Copy files to public folder:**
   ```
   /public
     /favicon.svg
     /favicon.ico
     /apple-touch-icon.png
     /android-chrome-192x192.png
     /android-chrome-512x512.png
     /site.webmanifest
   ```

2. **Add HTML tags** (see `favicon-html.html`)

3. **Test PWA** on mobile:
   - iOS: Safari → Share → Add to Home Screen
   - Android: Chrome → Menu → Install app

---

## 🎨 Brand Colors

Use these exact colors for consistency:

```css
/* Primary Red (Tinder-inspired) */
--primary: #E53935;

/* Secondary Orange (Accent) */
--secondary: #FFA726;

/* Success Green (Match found) */
--success: #66BB6A;

/* Background Light Gray */
--background: #FAFAFA;

/* Dark Red (Gradients) */
--primary-dark: #C62828;

/* Yellow-Orange (Flame accent) */
--accent-flame: #FB9E1A;

/* Black (Eye, text) */
--text-dark: #1F1A1E;
```

---

## 📐 Logo Usage Guidelines

### Logo with Text (logo-full-optimized.svg)

**DO:**
- Use on white or light backgrounds
- Maintain aspect ratio (800:240 or 10:3)
- Keep clear space around logo (minimum 20px)
- Use for website header, emails, presentations

**DON'T:**
- Stretch or distort
- Use on busy/patterned backgrounds
- Place text too close to logo
- Use at sizes smaller than 200px wide

### Icon Only (icon-square.svg)

**DO:**
- Use for app icons, PWA, social media profiles
- Maintain square aspect ratio
- Use on solid backgrounds
- Scale to 192px, 512px for PWA

**DON'T:**
- Use below 32x32 pixels (use favicon.svg instead)
- Add drop shadows or effects
- Crop or rotate

---

## 🖥️ Implementation in Expo

### In your `app/_layout.tsx`:

```typescript
import Head from 'expo-router/head';

export default function RootLayout() {
  return (
    <>
      <Head>
        {/* Favicons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />

        {/* Manifest */}
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme Color */}
        <meta name="theme-color" content="#E53935" />

        {/* OG Image for social sharing */}
        <meta property="og:image" content="https://chickentinders.com/og-image.jpg" />
        <meta property="og:title" content="ChickenTinders - Swipe Right on Dinner" />
        <meta property="og:description" content="No more group chat chaos. Swipe, match, eat." />
      </Head>

      {/* Your app content */}
    </>
  );
}
```

---

## 🎯 Where to Use Each Logo

| Context | File | Size |
|---------|------|------|
| Website header | logo-full-optimized.svg | 240px height |
| Landing page hero | logo-full-optimized.svg | 300-400px wide |
| Browser tab | favicon.svg or favicon.ico | 16x16, 32x32 |
| iOS home screen | apple-touch-icon.png | 180x180 |
| Android home screen | android-chrome-512x512.png | 512x512 |
| PWA splash screen | android-chrome-512x512.png | 512x512 |
| Social media profile | icon-square.svg | 400x400 |
| Email signature | logo-full-optimized.svg | 200px wide |
| Presentation slides | logo-full-optimized.svg | 400-600px wide |

---

## ✅ Checklist: Ready for Production?

- [ ] Generated all PNG favicon sizes
- [ ] Placed files in `/public` folder
- [ ] Added HTML tags to `<head>`
- [ ] Created `site.webmanifest`
- [ ] Tested on Chrome (desktop + mobile)
- [ ] Tested on Safari (desktop + iOS)
- [ ] Tested "Add to Home Screen" on iOS
- [ ] Tested "Install app" on Android Chrome
- [ ] Created OG image (1200x630) for social sharing
- [ ] Tested social share preview (Facebook, Twitter, iMessage)

---

## 🔗 Useful Resources

- **Favicon Generator**: https://realfavicongenerator.net/
- **Favicon Checker**: https://realfavicongenerator.net/favicon_checker
- **PWA Builder**: https://www.pwabuilder.com/
- **OG Image Generator**: https://www.opengraph.xyz/

---

## 📊 File Size Summary

**Before Optimization:**
- svglogo.svg: 24KB ❌
- icon.svg: 24KB ❌

**After Optimization:**
- logo-full-optimized.svg: 7.6KB ✅ (68% smaller)
- icon-square.svg: 2.5KB ✅ (90% smaller)
- favicon.svg: 1.2KB ✅ (95% smaller)

**Total saved:** ~42KB per page load!

---

## 🎨 Next Steps

1. ✅ **Logo & favicons are ready!**
2. 🔲 Generate PNG favicons (2 minutes with RealFaviconGenerator)
3. 🔲 Create OG image (1200x630) for social sharing
4. 🔲 Implement in Expo app
5. 🔲 Test on all devices

---

## 🆘 Need Help?

All files are ready to use. If you need:
- **PNG favicons**: Use RealFaviconGenerator (see generate-favicons.md)
- **HTML implementation**: Copy from favicon-html.html
- **PWA setup**: Use site.webmanifest
- **Expo integration**: See implementation example above

**Your logos are professional, optimized, and viral-ready!** 🚀🍗
