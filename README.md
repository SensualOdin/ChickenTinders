# 🍗 ChickenTinders

**Swipe Right on Dinner** - Group food decisions made easy.

No more group chat chaos. Swipe, match, eat.

---

## 📁 Project Structure

```
ChickenTinders/
├── public/                    # Production assets (publicly served)
│   ├── logo-full-optimized.svg
│   ├── favicon.svg
│   ├── site.webmanifest
│   └── README.md             # Instructions for PNG favicon generation
│
├── design/                    # Design files and documentation
│   ├── logos/                # Source logo files
│   │   ├── icon-square.svg
│   │   └── icon-only-optimized.svg
│   ├── mockups/              # UI design mockups (PNG)
│   │   ├── landing page.png
│   │   ├── create group page.png
│   │   ├── lobby page.png
│   │   ├── swipe screen.png
│   │   └── results page.png
│   ├── reference/            # Original/archived files
│   │   ├── logo.png
│   │   ├── svglogo-original.svg
│   │   └── icon-original.svg
│   ├── LOGO-GUIDE.md         # Complete branding guide ⭐
│   ├── generate-favicons.md  # PNG favicon instructions
│   ├── favicon-html.html     # HTML implementation code
│   └── README.md
│
└── The Plan.md               # Complete project specification ⭐

```

---

## 🚀 Quick Start

### For Developers:

1. **Read the plan**: See [The Plan.md](The%20Plan.md) for complete technical specification
2. **Check mockups**: See [design/mockups/](design/mockups/) for UI designs
3. **Implement logos**: Follow [design/LOGO-GUIDE.md](design/LOGO-GUIDE.md)
4. **Generate favicons**: Follow [design/generate-favicons.md](design/generate-favicons.md)

### For Designers:

1. **Brand colors**: See [design/LOGO-GUIDE.md](design/LOGO-GUIDE.md) → Brand Colors section
2. **Logo files**: See [design/logos/](design/logos/)
3. **Mockups**: See [design/mockups/](design/mockups/)

---

## 🎨 Brand Colors

```css
--primary: #E53935;        /* Red (CTAs, branding) */
--secondary: #FFA726;      /* Orange (accents) */
--success: #66BB6A;        /* Green (match found) */
--background: #FAFAFA;     /* Light gray */
```

See full color palette in [design/LOGO-GUIDE.md](design/LOGO-GUIDE.md)

---

## 📱 Tech Stack

- **Framework**: Expo (SDK 52+) - React Native Web
- **Router**: Expo Router
- **Styling**: NativeWind v4 (Tailwind CSS)
- **Backend**: Supabase (Postgres, Auth, Realtime)
- **Animations**: react-native-reanimated
- **Deployment**: Vercel

See complete stack in [The Plan.md](The%20Plan.md)

---

## 🎯 Key Features

1. **Zero Friction Onboarding** - No login required to join groups
2. **Real-time Sync** - See friends join the lobby instantly
3. **Smart Filtering** - Respects dietary restrictions automatically
4. **Tinder-Style Swiping** - Familiar, fun interface
5. **Instant Matching** - Know your dinner spot in seconds
6. **Shareable Links** - Simple URL sharing (chickentinders.com/lobby/CHKN22)

---

## 📖 Documentation

- 📋 **[The Plan.md](The%20Plan.md)** - Complete technical specification (MUST READ)
- 🎨 **[design/LOGO-GUIDE.md](design/LOGO-GUIDE.md)** - Branding guidelines
- 📱 **[design/mockups/](design/mockups/)** - UI mockups
- 🔧 **[design/generate-favicons.md](design/generate-favicons.md)** - Favicon setup

---

## ✅ Next Steps

### Phase 0: Setup ✅
- [x] Design mockups created
- [x] Logo optimized and production-ready
- [x] Project structure organized
- [ ] Generate PNG favicons (see [design/generate-favicons.md](design/generate-favicons.md))

### Phase 1: Project Skeleton
- [ ] Initialize Expo project
- [ ] Configure NativeWind
- [ ] Set up Expo Router
- [ ] Deploy "Hello World" to Vercel
- [ ] Add favicons to `/public`

See full implementation plan in [The Plan.md](The%20Plan.md) → Section 6

---

## 🛠️ Development Commands

```bash
# Initialize project (when ready)
npx create-expo-app --template blank-typescript

# Install dependencies
npm install

# Start development server
npx expo start

# Build for web
npx expo export:web

# Deploy to Vercel
vercel
```

---

## 📊 Project Status

- **Design**: ✅ Complete
- **Logos**: ✅ Optimized
- **Plan**: ✅ Documented
- **Development**: 🔲 Not started
- **Deployment**: 🔲 Not started

---

## 🔗 Resources

- **Favicon Generator**: https://realfavicongenerator.net/
- **Expo Docs**: https://docs.expo.dev/
- **Supabase Docs**: https://supabase.com/docs
- **NativeWind Docs**: https://www.nativewind.dev/

---

## 📝 Notes

- All assets are optimized for production
- File sizes reduced by 68% (24KB → 7.6KB)
- PWA-ready with manifest file
- SEO-ready with OG tags
- Mobile-first responsive design

---

**Ready to build something viral!** 🚀🍗

For questions or implementation details, refer to [The Plan.md](The%20Plan.md)
