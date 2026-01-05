# Design Assets - ChickenTinders

This folder contains all design files, mockups, and documentation.

## 📁 Folder Structure

```
/design
  /logos              # Source logo files (SVG)
  /mockups            # UI mockups and screenshots
  /reference          # Original/archived files
  LOGO-GUIDE.md       # Complete logo usage guide
  generate-favicons.md # Instructions for PNG generation
  favicon-html.html   # HTML implementation code
```

## 🎨 Logos (`/logos`)

Production-ready logo files:

- **icon-square.svg** (2.5KB) - Use for PWA icons, app stores, social media
- **icon-only-optimized.svg** (2.0KB) - General purpose icon

**Usage:**
- Upload `icon-square.svg` to RealFaviconGenerator for PNG versions
- Use for any square icon needs (profile pics, app icons, etc.)

## 📱 Mockups (`/mockups`)

UI design mockups:

- **landing page.png** - Homepage design
- **create group page.png** - Group creation flow
- **lobby page.png** - Waiting room
- **swipe screen.png** - Card swiping interface
- **results page.png** - Match results

**Notes:**
- These are reference designs for implementation
- Maintain visual consistency with these mockups
- Color scheme and spacing defined in LOGO-GUIDE.md

## 📚 Reference (`/reference`)

Archived/original files:

- **logo.png** - Original logo PNG
- **svglogo-original.svg** - Original unoptimized logo (24KB)
- **icon-original.svg** - Original unoptimized icon (24KB)

**Note:** These are kept for reference but shouldn't be used in production (use optimized versions in `/logos` and `/public` instead)

## 📖 Documentation

- **LOGO-GUIDE.md** - Complete branding guide
  - Brand colors
  - Logo usage guidelines
  - Implementation examples
  - Testing checklist

- **generate-favicons.md** - Step-by-step PNG generation
  - 4 different methods
  - Required file sizes
  - Command-line examples

- **favicon-html.html** - Ready-to-use HTML
  - Copy-paste `<head>` tags
  - OG meta tags for social sharing
  - PWA configuration

## 🚀 Quick Start

1. **Need PNGs?** → See `generate-favicons.md`
2. **Implementing logos?** → See `LOGO-GUIDE.md`
3. **Adding to website?** → Copy from `favicon-html.html`
4. **Brand colors?** → See `LOGO-GUIDE.md` section "Brand Colors"

## 🎯 For Developers

When building the app:
1. Use logos from `/public` for production
2. Reference mockups in `/mockups` for UI design
3. Follow color scheme in `LOGO-GUIDE.md`
4. Test on actual devices (see testing checklist in guide)

---

**All assets are optimized and production-ready!** 🚀
