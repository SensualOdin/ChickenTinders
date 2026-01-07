# 🍗 ChickenTinders

**Swipe Right on Dinner** - Group food decisions made easy.

No more group chat chaos. Swipe, match, eat.

---

## 🚀 Quick Start

### New to the Project?
**Start here:** [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md) - Master guide to all documentation

### Ready to Implement?
**Start here:** [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) - Step-by-step upgrade plan

### Need Quick Reference?
**Pin this:** [QUICK_REFERENCE.md](QUICK_REFERENCE.md) - Cheat sheet for active development

---

## 📚 Complete Documentation

### Core Documentation (New!)
1. **[DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)** - Master index & quick start guide
2. **[DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)** - Complete UI/UX specification
3. **[COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md)** - All components with examples
4. **[IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)** - 5-phase implementation plan
5. **[BEFORE_AFTER_GUIDE.md](BEFORE_AFTER_GUIDE.md)** - Visual comparisons & migration checklist
6. **[QUICK_REFERENCE.md](QUICK_REFERENCE.md)** - Quick lookup while coding

### Setup & Configuration
- **[SUPABASE-SETUP.md](SUPABASE-SETUP.md)** - Database configuration
- **[AUTH-SETUP.md](AUTH-SETUP.md)** - Authentication setup
- **[DATABASE-SETUP-GUIDE.md](DATABASE-SETUP-GUIDE.md)** - Database schema
- **[REALTIME-SETUP.md](REALTIME-SETUP.md)** - Real-time configuration
- **[DEPLOYMENT.md](DEPLOYMENT.md)** - Deployment guide

### Feature Documentation
- **[SAVED-GROUPS-FEATURE.md](SAVED-GROUPS-FEATURE.md)** - Saved groups implementation
- **[MY-GROUPS-USER-GUIDE.md](MY-GROUPS-USER-GUIDE.md)** - User guide for My Groups
- **[STATUS.md](STATUS.md)** - Project status & phase completion
- **[PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md)** - Codebase organization

### Skills & Guidelines
- **[CLAUDE.md](CLAUDE.md)** - Claude Code custom skills

---

## 📱 Tech Stack

- **Framework**: Expo (SDK 52) - React Native Web
- **Router**: Expo Router (file-based routing)
- **Styling**: NativeWind v4 (Tailwind CSS)
- **Backend**: Supabase (PostgreSQL, Auth, Realtime)
- **Animations**: react-native-reanimated + react-native-gesture-handler
- **State**: React Context + Supabase real-time subscriptions
- **Deployment**: Vercel (web)

---

## 🎯 Key Features

### Current Features (MVP Complete)
✅ **Guest Mode** - No signup required to join groups
✅ **Real-time Sync** - Live member updates via Supabase Realtime
✅ **Tinder-Style Swiping** - Smooth gestures with haptic feedback
✅ **Smart Matching** - Unanimous + partial match detection
✅ **Dual Auth** - Guest + authenticated user support
✅ **Saved Groups** - Templates for recurring dining groups
✅ **Swipe Progress** - Real-time tracking with polling fallback
✅ **Match Celebration** - Confetti + animations

### Coming Soon
🔄 **Real Yelp API** - Replace mock data (Phase 4.1)
🔄 **Component System** - Reusable Button, Input, Card (Phase 2)
🔄 **Visual Polish** - Enhanced animations & interactions (Phase 3)
🔄 **Dark Mode** - Theme switching support (Phase 4)
🔄 **Advanced Matching** - Weighted scoring algorithm (Phase 4.5)

---

## 🎨 Design System

### Brand Colors
```css
--primary: #A91D3A;        /* Burgundy (main brand) */
--secondary: #FFB800;      /* Gold (secondary accent) */
--accent: #FF6B35;         /* Coral (warm accent) */
--success: #4CAF50;        /* Sage green (matches) */
--background: #FFF5E1;     /* Cream (warm background) */
--surface: #FFFFFF;        /* White (cards) */
--charcoal: #2C0A0A;       /* Dark text */
```

**Typography:**
- Display: Fraunces (serif) - Headings & emphasis
- Body: DM Sans (sans-serif) - Content & UI

**Full Design System:** See [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)

---

## 🛠️ Development

### Setup
```bash
# Clone repository
git clone <repo-url>
cd ChickenTinders

# Install dependencies
npm install

# Configure environment
cp .env.local.example .env.local
# Add your Supabase credentials

# Run database migrations
node setup-database.js

# Start development server
npx expo start
```

### Development Commands
```bash
# Start dev server (web)
npm run web

# Start dev server (all platforms)
npx expo start

# Build for web
npx expo export:web

# Type check
npx tsc --noEmit

# Deploy to Vercel
vercel
```

---

## 📊 Project Status

### Phase Completion
- ✅ **Phase 0**: Design & Planning (Complete)
- ✅ **Phase 1-3**: Core Features (Complete)
- ✅ **Phase 4-5**: Group Creation (Complete)
- ✅ **Phase 6**: Authentication (Complete)
- ✅ **Phase 7**: Real-time Progress (Complete)
- 🔄 **Phase 8**: Production Polish (In Progress)

**Current State:** MVP complete, ready for production upgrade

**Next Steps:** Follow [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) Phase 1

---

## 🎯 Implementation Phases

### Phase 0: Foundation Setup (30-60 minutes) ⚠️ REQUIRED FIRST
- Install dependencies (@expo-google-fonts, clsx, tailwind-merge, CVA)
- Create cn() utility function
- Update Tailwind config with error/info colors
- Add font loading to _layout.tsx
- Verify fonts and utilities work

### Phase 1: Critical Fixes (6-8 hours)
- Fix join page styling inconsistencies
- Remove accessibility violations
- Add empty states & error boundaries
- Standardize navigation

### Phase 2: Component System (12-15 hours)
- Create Button component (with CVA variants)
- Create Input, Card components
- Replace all inline implementations
- Build reusable component library
- Component unit testing

### Phase 3: Visual Polish (10-12 hours)
- Redesign authentication pages
- Enhance animations & micro-interactions
- Replace placeholder testimonials

### Phase 4: Advanced Features (15-20 hours)
- Integrate Yelp API (replace mock data)
- Accessibility audit & fixes
- Performance optimization
- Advanced matching algorithm

### Phase 5: Production Readiness (8-10 hours)
- Error monitoring (Sentry)
- Analytics (Posthog)
- SEO optimization
- Cross-browser testing
- Security audit

**Total Estimated Time:** 52-66 hours (2 weeks for solo dev, includes Phase 0 + testing)

**Full Roadmap:** See [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)

---

## 📁 Project Structure

```
ChickenTinders/
├── app/                       # Expo Router pages
│   ├── index.tsx             # Landing page
│   ├── create.tsx            # Create group flow
│   ├── join.tsx              # Join with code
│   ├── lobby/[id].tsx        # Group lobby
│   ├── swipe/[id].tsx        # Swipe interface
│   ├── results/[id].tsx      # Match results
│   ├── account.tsx           # Account management
│   ├── my-groups.tsx         # Saved groups
│   └── auth/                 # Auth pages
│
├── components/
│   ├── ui/                   # Reusable UI components
│   ├── deck/                 # Swipe card components
│   ├── animations/           # Animation components
│   └── PhoneDemo.tsx         # Landing page demo
│
├── lib/
│   ├── api/                  # External APIs (Yelp, Supabase)
│   ├── contexts/             # React contexts
│   ├── hooks/                # Custom hooks
│   └── utils/                # Utility functions
│
├── assets/                   # Images, fonts, icons
├── public/                   # Static assets
└── design/                   # Design files & mockups
```

**Full Structure:** See [PROJECT-STRUCTURE.md](PROJECT-STRUCTURE.md)

---

## 🔧 Database Schema

### Core Tables
- `users` - User profiles (guest + authenticated)
- `groups` - Group sessions
- `group_members` - Member relationships
- `swipes` - User swipe history
- `matches` - Detected matches
- `saved_groups` - User group templates

**Setup:** See [DATABASE-SETUP-GUIDE.md](DATABASE-SETUP-GUIDE.md)

**Migrations:** Run `node setup-database.js` or apply SQL files manually

---

## 🚢 Deployment

### Vercel (Web)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Deploy to production
vercel --prod
```

**Configuration:** See [DEPLOYMENT.md](DEPLOYMENT.md)

---

## 🎨 Brand Assets

### Logos
- `assets/images/icon.png` - App icon (1024x1024)
- `public/favicon.png` - Favicon
- Design files in `design/logos/`

### Colors
All colors are semantic and defined in `tailwind.config.js`
- Never use hardcoded colors (`gray-200`, `blue-50`, etc.)
- Always use semantic tokens (`textMuted`, `accent`, `primary`)

**Brand Guide:** See [DESIGN_SYSTEM.md § Color System](DESIGN_SYSTEM.md#color-system)

---

## 📈 Metrics & Monitoring

### Current
- ⚠️ Mock restaurant data (Phase 4.1 will add Yelp API)
- ⚠️ No error monitoring (Phase 5.1 will add Sentry)
- ⚠️ No analytics tracking (Phase 5.2 will add Posthog)

### Target (Post-Implementation)
- ✅ Lighthouse Score: 90+ (all categories)
- ✅ WCAG 2.1 AA compliant
- ✅ LCP < 2.5s
- ✅ FID < 100ms
- ✅ CLS < 0.1

---

## 🐛 Known Issues & Roadmap

### High Priority
1. **Complete Phase 0 first** - Install dependencies and setup foundation
2. Mock restaurant data needs Yelp API replacement
3. Join page styling inconsistent (gold button should be burgundy)
4. Focus indicators removed in some inputs (accessibility violation)
5. Hardcoded colors instead of semantic tokens

### Medium Priority
1. Auth pages need visual polish
2. Testimonials are placeholders
3. No dark mode support
4. Limited error recovery

**Full List:** See [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)

---

## 🤝 Contributing

### Before You Start
1. Read [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
2. Review [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) for style guidelines
3. Check [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) for current priorities

### Development Guidelines
- Use semantic colors (never hardcoded)
- Follow component patterns in [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md)
- Test accessibility (keyboard nav, screen reader)
- Keep [QUICK_REFERENCE.md](QUICK_REFERENCE.md) open while coding

### Commit Messages
```
<type>: <subject>

- Bullet point 1
- Bullet point 2

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## 📄 License

[Your License Here]

---

## 🔗 Links

- **Live Demo:** [Coming Soon]
- **Documentation:** [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
- **Design System:** [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
- **Component Library:** [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md)

---

## 💡 Quick Tips

- 🎨 **Choosing colors?** Always use semantic tokens from [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md)
- 🧩 **Creating components?** Check patterns in [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md)
- 🚀 **Starting implementation?** Follow [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md)
- ⚡ **Need quick reference?** Pin [QUICK_REFERENCE.md](QUICK_REFERENCE.md)
- ❓ **Lost?** Start with [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)

---

**Ready to build something amazing!** 🚀🍗

For complete implementation guidance, see [DOCUMENTATION_INDEX.md](DOCUMENTATION_INDEX.md)
