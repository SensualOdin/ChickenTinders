# Public Assets - ChickenTinders

This folder contains all production-ready assets that will be served publicly.

## 📁 Current Files

- ✅ **logo-full-optimized.svg** - Full logo with text (website header)
- ✅ **favicon.svg** - Modern browser favicon
- ✅ **site.webmanifest** - PWA configuration

## 🔲 Missing Files (Generate These!)

You still need to generate PNG favicons. Use one of these methods:

### Quick Method (Recommended):
1. Go to https://realfavicongenerator.net/
2. Upload `/design/logos/icon-square.svg`
3. Download generated files
4. Place them here in `/public`

### Files You Need to Add:

```
/public
  ├─ favicon.ico              (multi-size: 16, 32, 48)
  ├─ apple-touch-icon.png     (180x180)
  ├─ android-chrome-192x192.png
  ├─ android-chrome-512x512.png
  ├─ favicon-16x16.png
  └─ favicon-32x32.png
```

## 📝 Notes

- All files in this folder will be publicly accessible
- Don't commit large files (>1MB)
- Optimize all images before adding
- See `/design/LOGO-GUIDE.md` for full instructions
