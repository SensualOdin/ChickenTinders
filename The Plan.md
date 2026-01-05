🍗 ChickenTinders – Web-First Master Specification (VIRAL & PROFESSIONAL EDITION)
Project Name: ChickenTinders (Web PWA) Type: Responsive Web App (Mobile-First Design) Stack: Expo (React Native Web), Supabase, TypeScript, Tailwind (NativeWind)

Role for AI: You are a Senior Frontend Engineer specializing in Expo for Web. Your goal is to build a high-performance Progressive Web App (PWA) that looks and feels like a native app on mobile browsers but runs in any browser. This app must be polished enough to go viral and professional enough to be taken seriously.

---

## 0. Design Phase (DO THIS FIRST!)
Before writing any code, complete these design tasks:

- [ ] Create Figma mockups for all 5 core screens (Landing, Create, Lobby, Swipe, Results)
- [ ] Test color contrast ratios (WCAG AA minimum for accessibility)
- [ ] Design the card layout (photo, restaurant name, cuisine type, distance, price indicator)
- [ ] Prototype the swipe animation and match celebration
- [ ] Design the "Match Found!" celebration moment with confetti
- [ ] Create loading state designs (skeletons, not spinners)
- [ ] Design error states with friendly messaging
- [ ] Create social share graphics (OG images for previews)

---

## 1. Technology Stack (Web-First)

**Framework:** Expo (SDK 52+)

**Platform:** Web (Output: Single Page Application)

**Router:** Expo Router (Crucial for URL sharing e.g., chickentinders.com/lobby/CHKN22)

**Styling:** NativeWind v4 (Tailwind CSS). Ensure responsive design (mobile-first)

**Backend:** Supabase (Postgres, Auth, Realtime)

**Gestures:** react-native-gesture-handler (Must verify web compatibility for swiping)

**Animations:** react-native-reanimated (High performance on web)

**Icons:** @expo/vector-icons (Feather/FontAwesome)

**Additional Dependencies:**
- **Toast Notifications:** sonner or react-hot-toast
- **Confetti:** canvas-confetti or react-confetti for match celebrations
- **Analytics:** PostHog or Plausible (privacy-friendly)
- **Image Optimization:** Automatic WebP conversion with JPG fallback

**Deployment Target:** Vercel (via npx expo export)

**Custom Domain:** chickentinders.com

---

## 2. Project Structure
Strictly adhere to this folder structure:

```
/app
  /_layout.tsx          # Root Provider (Supabase, QueryClient, Theme, Error Boundary)
  /index.tsx            # Landing Page (Hero, demo mode, "Create Group" CTA)
  /[...missing].tsx     # 404 Page (Friendly with "Create Group" CTA)
  /privacy.tsx          # Privacy Policy (Required for trust/legal)
  /terms.tsx            # Terms of Service (Required for trust/legal)
  /(auth)
    /login.tsx          # Auth Screen (if required later)
  /(group)
    /_layout.tsx        # Layout ensuring mobile-width container on desktop
    /create.tsx         # Setup: Zip, Radius, Price, Diet
    /lobby/[id].tsx     # URL: /lobby/CHKN22 (Waiting Room)
    /swipe/[id].tsx     # The Deck
    /results/[id].tsx   # Match List + Roulette + Social Sharing
/components
  /ui                   # Buttons, Inputs, Modals, LoadingSkeletons, ErrorStates
  /deck                 # Swipeable Card Component (Web compatible)
  /share                # "Copy Link" Component + Social Share Buttons
  /animations           # Confetti, Card Flip, Match Celebration
  /onboarding           # 3-Step Explainer Carousel
/lib
  /supabase.ts
  /api.ts               # Yelp API (Edge Function wrapper)
  /hooks                # Custom hooks (useGroup, useSwipe, useAnalytics)
  /analytics.ts         # Analytics wrapper (track events)
  /utils.ts             # Helper functions (vibrate, copy to clipboard, etc.)
/public
  /favicon.ico          # High-quality chicken icon
  /og-image.jpg         # 1200x630 social share preview image
  /logo.svg             # Playful chicken mascot with Tinder flame colors
  /sounds               # Optional: match.mp3, swipe.mp3 (keep files small)
```

---

## 3. Database Schema (Supabase)
Robust schema, fully compatible with Web:

**users:**
- `id` (uuid, PK)
- `display_name` (text)
- `dietary_tags` (text[])
- `created_at` (timestamp)

**groups:**
- `id` (text, PK, 6-char code)
- `zip_code` (text)
- `radius` (integer, miles)
- `price_tier` (integer, 1-4)
- `created_at` (timestamp)
- `expires_at` (timestamp) - Auto-expire after 24 hours
- `status` (enum: 'waiting', 'swiping', 'matched', 'expired')

**group_members:**
- `id` (uuid, PK)
- `group_id` (FK → groups.id)
- `user_id` (FK → users.id)
- `joined_at` (timestamp)

**swipes:**
- `id` (uuid, PK)
- `group_id` (FK → groups.id)
- `user_id` (FK → users.id)
- `restaurant_id` (text, from Yelp)
- `is_liked` (bool)
- `is_super_like` (bool)
- `swiped_at` (timestamp)

**matches:**
- `id` (uuid, PK)
- `group_id` (FK → groups.id)
- `restaurant_id` (text)
- `restaurant_data` (jsonb) - Cache full restaurant details
- `matched_at` (timestamp)
- `is_unanimous` (bool) - Track if everyone super-liked

**analytics_events:** (Optional for tracking)
- `id` (uuid, PK)
- `event_name` (text) - 'group_created', 'match_found', 'link_shared', etc.
- `properties` (jsonb)
- `created_at` (timestamp)

---

## 4. Web-Specific Features & Constraints

### 4.1 URL-Based Workflow (The "Viral" Mechanic)

**Route:** `/lobby/[id]`

**Logic:** When a user visits this URL:
1. Check if they have a "Guest ID" in `localStorage`
2. If not, prompt for a "Display Name" (No email/password required for Joiners to lower friction)
3. Auto-join the group `[id]`
4. Show real-time updates as other friends join

**Share Button:** In the Lobby, add a "Copy Invite Link" button that:
- Copies `window.location.href` to clipboard
- Shows toast notification: "Link copied! 🎉"
- Triggers haptic feedback (if supported)

**Social Meta Tags:** (Add to `_layout.tsx` head)
```html
<meta property="og:title" content="ChickenTinders - Group Food Decision Made Easy" />
<meta property="og:description" content="No more group chat chaos. Swipe, match, eat." />
<meta property="og:image" content="https://chickentinders.com/og-image.jpg" />
<meta property="og:url" content="https://chickentinders.com" />
<meta name="twitter:card" content="summary_large_image" />
```

### 4.2 The "Web" Swipe Deck

**Constraint:** Native swipe decks often break on mobile Safari (due to overscroll bounce)

**Solution:**
- Use `react-native-gesture-handler`
- **Crucial CSS:** Set `overscroll-behavior: none` on the body/root to prevent the whole page from bouncing when users swipe cards
- Add `touch-action: pan-y` to prevent zoom on double-tap
- Use `-webkit-overflow-scrolling: touch` for smooth scrolling

**Fallback:** If gestures fail, include visible "✗" (Dislike), "♥" (Like), and "⭐" (Super Like) buttons below the card

**Safari-Specific Fixes:**
- Test in Safari Private Mode (localStorage behaves differently)
- Use `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` for notched phones (iPhone X+)
- Disable elastic scrolling: `document.body.style.overflow = 'hidden'` on swipe screen

**Micro-Interactions:**
- Haptic feedback on swipe (use `navigator.vibrate(50)` if supported)
- Card tilt animation while dragging
- Smooth spring animation when card snaps back
- Special animation when someone super-likes (card flip + sparkle effect)

### 4.3 Location Services

**API:** Use `navigator.geolocation` (Standard Browser API) instead of Expo Location to reduce bundle size

**Permissions:** Browser will ask "Allow site to access your location?". Handle the "Deny" case gracefully:
- Show friendly message: "No problem! Just enter your zip code below"
- Prefill zip code input field
- Never block the user from continuing

### 4.4 Maps (External Only)

Do not embed a map. It is too heavy for a web MVP.

**Deep Links:**
- On the Result Card, the address should be an `<a>` tag
- `href="https://www.google.com/maps/search/?api=1&query={restaurant_name}+{address}"`
- Opens in new tab
- Style as a button: "Get Directions →"

---

## 5. Critical Logic

### 5.1 The "Dealbreaker" Logic (Edge Function)

When fetching restaurants, aggregate `dietary_tags` from all users in the lobby.

**Filter Yelp results strictly:**
- If "Vegan" is present in the group tags, only return Vegan-friendly spots
- If "Vegetarian" is present, filter accordingly
- If "Gluten-Free", "Halal", "Kosher" tags exist, respect them
- Edge Function should handle this filtering server-side to reduce client load

### 5.2 The Tie-Breaker (Roulette)

**Trigger:** If `matches.length > 1`

**UI:**
- CSS-based spinning wheel or a simple "Shuffling..." animation
- Show all matched restaurants briefly
- Animate through them (slot machine style)
- Slow down and land on the winner

**Outcome:**
- Randomly select one match
- Display a "Winner! 🎉" modal with confetti explosion
- Show runner-ups below: "Also great options if you change your mind"

### 5.3 Error Handling (CRITICAL)

**No matches found:**
- Show friendly message: "No matches yet 😅"
- Suggest: "Try widening your radius or price range?"
- Button: "Adjust Settings" (goes back to `/create`)

**One person doesn't swipe:**
- Show "Waiting on [Name]..." with their avatar
- Send gentle reminder notification (if push notifications enabled later)
- Timeout after 10 minutes: "Still waiting? Send them the link again!"

**Yelp API fails:**
- Show cached restaurants (if available)
- Graceful fallback: "Having trouble loading restaurants. Check your connection?"
- Retry button

**Group expired:**
- Auto-expire groups after 24 hours
- Show: "This group has expired. Create a new one?"
- Big "Create New Group" CTA

**Network offline:**
- Detect with `navigator.onLine`
- Show toast: "You're offline 🛜 Check your connection"
- Disable swipe actions until reconnected

---

## 6. Implementation Plan (Web-First)

### Phase 0: Design & Setup
**Goal:** Complete visual design and project foundation

- [ ] Create all Figma mockups
- [ ] Design logo and brand assets
- [ ] Create OG image for social sharing (1200x630px)
- [ ] Write copy for landing page, error states, success messages
- [ ] Set up chickentinders.com domain
- [ ] Set up Supabase project
- [ ] Get Yelp API key

### Phase 1: Project Skeleton & Deployment
**Goal:** Working build pipeline and base infrastructure

- [ ] Init Expo Web project (`npx create-expo-app --template blank-typescript`)
- [ ] Configure NativeWind v4
- [ ] Set up Expo Router with proper folder structure
- [ ] Add error boundaries to `_layout.tsx`
- [ ] Configure Web Vitals monitoring
- [ ] Set up environment variables (.env.local)
- [ ] **Deploy "Hello World" to Vercel immediately** to test build pipeline
- [ ] Configure custom domain (chickentinders.com)
- [ ] Add SSL certificate (Vercel handles this)
- [ ] Set up analytics (PostHog/Plausible)

**Production Checklist for Phase 1:**
- [ ] Favicon and OG tags added
- [ ] robots.txt and sitemap.xml
- [ ] Loading skeletons (not spinners)
- [ ] Performance: Lazy load images, <500ms initial page load
- [ ] Code splitting configured
- [ ] Image optimization (WebP with JPG fallback, 80% quality)

### Phase 1.5: Landing Page & Onboarding
**Goal:** First impressions that convert visitors

- [ ] Build hero section with animated demo
- [ ] Add 3-step explainer:
  1. "Create a group"
  2. "Share the link"
  3. "Swipe together, match instantly"
- [ ] Trust signals: "No app download. No sign-up. Just food."
- [ ] **Demo Mode:** Let visitors try swiping 3 fake restaurants before creating (no account needed)
- [ ] Add tagline: "Swipe Right on Dinner" or "Where Hungry Friends Match"
- [ ] Big, obvious "Create Group" CTA button
- [ ] Footer with Privacy Policy and Terms links

### Phase 2: The "Guest" Auth Flow
**Goal:** Frictionless user creation

- [ ] Build "Enter your Name" screen
- [ ] Generate anonymous user ID
- [ ] Save User ID/Name to AsyncStorage (wraps localStorage on web)
- [ ] Create the `groups` table and "Create Group" form
- [ ] Add dietary preference selection (Vegan, Vegetarian, Gluten-Free, etc.)
- [ ] Zip code input with validation
- [ ] Radius slider (1-25 miles)
- [ ] Price tier selector ($, $$, $$$, $$$$)
- [ ] Generate 6-character group code (e.g., CHKN22)

### Phase 3: The Lobby & Sharing
**Goal:** Social sharing that drives viral growth

- [ ] Create the `/lobby/[id]` dynamic route
- [ ] Implement Supabase Realtime to show names popping up in the lobby
- [ ] Show avatars/initials for each person who joins
- [ ] **"Share Link" button with celebratory feedback**
  - Copy to clipboard
  - Haptic feedback
  - Toast: "Link copied! Share it with your group 🎉"
- [ ] Show counter: "2 people joined" (updates in real-time)
- [ ] Countdown: "Swiping starts when 2+ people join"
- [ ] Show group settings (zip, radius, price, dietary restrictions)
- [ ] "Start Swiping" button (enabled when 2+ people joined)
- [ ] Growth mechanic: "12 groups created in your area this week"

### Phase 4: Swiping & API
**Goal:** Delightful swipe experience with no bugs

- [ ] Build Yelp Wrapper (via Supabase Edge Function to hide API Key)
- [ ] Implement dietary filter logic in Edge Function
- [ ] Build the Card Deck component
- [ ] **Test on actual mobile phone browser immediately** to check scroll locking
- [ ] Add swipe gestures (left = dislike, right = like, up = super like)
- [ ] Add fallback buttons (✗, ♥, ⭐)
- [ ] Implement card stack (show 2-3 cards deep for depth perception)
- [ ] Add animations:
  - Card tilt while dragging
  - Smooth exit animation
  - "NOPE" and "LIKE" stamps that appear during swipe
  - Special sparkle effect for super-likes
- [ ] Haptic feedback on swipe completion
- [ ] Optional sound effects (toggleable in settings)
- [ ] Progress indicator: "12 of 20 restaurants"
- [ ] Loading state while fetching more restaurants
- [ ] Real-time sync: Show when others in group have finished swiping

**Micro-Interactions Checklist:**
- [ ] Satisfying "pop" animation when card leaves screen
- [ ] Confetti explosion when match is found (detected in real-time)
- [ ] Entertaining loading messages: "Finding your soulmate... restaurant"

### Phase 5: Results & Social Sharing
**Goal:** Memorable conclusion that drives re-engagement

- [ ] Build the Match List screen
- [ ] Show match(es) with full details:
  - Restaurant name
  - Photo
  - Cuisine type
  - Rating (from Yelp)
  - Price tier
  - Distance
  - "Get Directions" button (Google Maps link)
- [ ] **If multiple matches:** Trigger Roulette animation
  - Slot machine style shuffle
  - Land on winner with confetti explosion
  - Show "Runner-ups" below
- [ ] **If unanimous super-like:** Show "UNANIMOUS! 🎉" with special animation
- [ ] **Social Share Button:**
  - "We matched at [Restaurant]! 🍗"
  - Pre-fills Instagram Story template (if possible via Web Share API)
  - Twitter share: "Just used @ChickenTinders to end our 2-hour food debate in 30 seconds"
  - WhatsApp share link
- [ ] Stats display: "You've matched 12 times with friends 🔥"
- [ ] Re-engagement CTA: "Have another group dinner planned? Create a new group"
- [ ] Show: "[Friend Name] has used your invite link 3 times this week"

**Google Maps External Links:**
- `href="https://www.google.com/maps/search/?api=1&query={restaurant_name}+{address}"`

### Phase 6: Polish & Delight
**Goal:** Professional finish that feels amazing

- [ ] Add loading skeletons to all screens (no spinners)
- [ ] Implement all error states with friendly copy
- [ ] Add accessibility labels (ARIA)
- [ ] Keyboard navigation support (for desktop users)
- [ ] Test all animations on low-end devices
- [ ] Add "Easter egg": 1% chance to show funny food meme between swipes
- [ ] Group photo feature (optional): Take selfie after match
- [ ] Optimize images (compress, use WebP)
- [ ] Test on Safari, Chrome, Firefox (mobile + desktop)
- [ ] Test with slow 3G network throttling

### Phase 7: Legal, SEO & Analytics
**Goal:** Trust, discoverability, and data-driven improvements

- [ ] Write Privacy Policy (use template, customize for data collected)
- [ ] Write Terms of Service (basic, covers liability)
- [ ] Add structured data (Schema.org markup for SEO)
- [ ] Submit sitemap to Google Search Console
- [ ] Set up conversion tracking (group created, match found, link shared)
- [ ] A/B test CTA copy on landing page
- [ ] Monitor Web Vitals and fix issues
- [ ] Set up error logging (Sentry or similar)

---

## 7. Design System (Professional Grade)

### Layout
- **Max-width:** 768px (md breakpoint)
- **Centering:** `mx-auto` to center on desktop (looks like a phone app even on laptop)
- **Padding:** 16px horizontal, consistent across all screens
- **Safe areas:** Use `env(safe-area-inset-top)` and `env(safe-area-inset-bottom)` for notched phones
- **Grid system:** 8px spacing grid (8, 16, 24, 32, 48, 64)

### Colors
**Primary Palette:**
- **Primary:** `#E53935` (Red) - CTAs, Super Likes, active states
- **Secondary:** `#FFA726` (Orange) - Accents, match badges, highlights
- **Success:** `#66BB6A` (Green) - Match found, success states
- **Background:** `#FAFAFA` (Light Gray) - Page background
- **Card:** `#FFFFFF` with subtle shadow `0 2px 8px rgba(0,0,0,0.1)`
- **Text Primary:** `#212121` (Almost black)
- **Text Secondary:** `#757575` (Gray)
- **Border:** `#E0E0E0` (Light gray)

**Gradient Accents:**
- Use for "MATCH!" text: `linear-gradient(135deg, #E53935 0%, #FFA726 100%)`
- Use for super-like button: `linear-gradient(135deg, #FFA726 0%, #FFEB3B 100%)`

### Typography
**Font Family:**
- **Headers:** Inter Bold (or SF Pro Display on iOS Safari)
- **Body:** Inter Regular
- **Fun/Playful Text:** Inter Extra Bold for "MATCH!" and celebration moments

**Font Sizes:**
- **Hero (h1):** 32px (mobile), 48px (desktop)
- **Page Title (h2):** 24px
- **Section Header (h3):** 20px
- **Body:** 16px
- **Small:** 14px
- **Tiny:** 12px

**Line Heights:**
- Headings: 1.2
- Body: 1.5

### Shadows
Use sparingly for depth:
- **sm:** `0 1px 2px rgba(0,0,0,0.05)` - Subtle buttons
- **md:** `0 2px 8px rgba(0,0,0,0.1)` - Cards at rest
- **lg:** `0 8px 24px rgba(0,0,0,0.15)` - Active card during swipe
- **xl:** `0 16px 48px rgba(0,0,0,0.2)` - Match modal

### Buttons
**Primary CTA:**
- Background: `#E53935`
- Text: White
- Padding: `16px 32px`
- Border radius: `12px`
- Font: Inter Bold, 16px
- Hover: Lighten 10%
- Active: Scale down to 0.98

**Secondary:**
- Background: White
- Border: 2px solid `#E53935`
- Text: `#E53935`
- Same padding/radius as primary

**Ghost:**
- Background: Transparent
- Text: `#757575`
- Hover: Background `#F5F5F5`

### Feedback & Notifications
**Toast Notifications:** Use `sonner` or `react-hot-toast`
- Position: Bottom center on mobile, top right on desktop
- Duration: 3 seconds
- Style: White background, subtle shadow, slide-in animation

**Success Toast:**
- Icon: ✅
- Text: Green `#66BB6A`

**Error Toast:**
- Icon: ⚠️
- Text: Red `#E53935`

**Info Toast:**
- Icon: ℹ️
- Text: Blue `#2196F3`

### Animations
**Timing Functions:**
- Standard: `cubic-bezier(0.4, 0.0, 0.2, 1)` - Material Design standard
- Spring: Use `react-native-reanimated` spring configs for card swipes
- Bounce: `cubic-bezier(0.68, -0.55, 0.265, 1.55)` for playful elements

**Durations:**
- Fast: 150ms (hover states)
- Normal: 300ms (page transitions)
- Slow: 500ms (celebrations, confetti)

---

## 8. Branding & Visual Identity

### Logo
**Design Requirements:**
- Playful chicken mascot with Tinder flame colors (red/orange gradient)
- Works at small sizes (favicon 32x32)
- SVG format for scalability
- Variants: Full logo (with text), icon-only (just chicken)

**Color Scheme:**
- Primary: Red (#E53935) like Tinder
- Accent: Orange/Yellow (#FFA726) for flame effect
- Keep it fun but not childish

### Tagline Options
- **Primary:** "Swipe Right on Dinner"
- **Secondary:** "Where Hungry Friends Match"
- **Tertiary:** "No More Food Debates"

### Favicon
- High-quality chicken icon
- 32x32, 64x64, 128x128, 256x256 sizes (PWA requirements)
- Recognizable at small size
- Use red/orange color scheme

### OG Image (Social Sharing Preview)
**Dimensions:** 1200x630px
**Contents:**
- Logo (large, centered)
- Tagline: "Swipe Right on Dinner"
- Visual: Phone mockup showing swipe interface
- Brand colors (red/orange gradient background)
- Clean, professional, eye-catching

**Why it matters:** This is what shows when someone shares your link on iMessage, WhatsApp, Twitter, etc. It's your first impression.

---

## 9. Growth Mechanics & Viral Loops

### Invite Incentives
**Lobby Screen:**
- Show real-time counter: "3 people joined!"
- Animated avatars/names popping in when friends join
- Countdown timer: "Swiping starts when 2+ people join"
- Celebrate when threshold is met: "Let's go! 🎉"

### Referral Loop
**After Successful Match:**
- Prompt: "Have another group dinner planned?"
- Big CTA: "Create a new group"
- Show stats: "[Friend Name] used your invite link 3 times this week 🔥"

### Network Effects
**Social Proof:**
- "142 groups created today"
- "12 groups in your zip code this week"
- Optional leaderboard: "Most decisive group" (fewest swipes to match)

### Social Sharing
**Built-in Share Buttons:**
- Instagram Story template (if Web Share API supports it)
- Twitter: "Just used @ChickenTinders to end our 2-hour food debate in 30 seconds 😂 [link]"
- WhatsApp: "Found our dinner spot in 30 seconds with ChickenTinders! 🍗 [link]"
- Generic: "Copy Link" with celebration feedback

### Surprise & Delight Features
**Unanimous Super-Like:**
- When everyone super-likes the same place
- Show "UNANIMOUS! 🎉" with extra-special animation
- Confetti explosion
- Badge: "Perfect Match"

**Easter Egg:**
- 1% chance to show a funny food meme between swipes
- "Pineapple on pizza? We don't judge... much. 🍕"
- Keep it light and on-brand

**Group Stats (Gamification):**
- "You've matched 12 times with friends"
- "Your group is 37% faster than average"
- "Most popular cuisine: Italian 🍝"

---

## 10. Performance & Web Vitals

### Target Metrics
**Core Web Vitals:**
- **First Contentful Paint (FCP):** <1s
- **Largest Contentful Paint (LCP):** <2.5s
- **Time to Interactive (TTI):** <3s
- **Cumulative Layout Shift (CLS):** <0.1
- **First Input Delay (FID):** <100ms

### Optimization Strategies
**Images:**
- Use WebP format with JPG fallback
- Compress at 80% quality
- Lazy load below-the-fold images
- Use `srcset` for responsive images
- Preload hero image on landing page

**Code Splitting:**
- Lazy load Results page (most users never see it if no match)
- Lazy load confetti library (only needed on match)
- Dynamic imports for heavy components

**Fonts:**
- Use `font-display: swap` to prevent invisible text
- Preload Inter font (only Regular and Bold weights)
- Subset fonts to Latin characters only

**JavaScript:**
- Minimize bundle size (target <200KB initial)
- Tree-shake unused dependencies
- Use Vercel's automatic code splitting

**Caching:**
- Cache Yelp API responses (1 hour)
- Service Worker for offline support (PWA)
- Cache static assets aggressively

---

## 11. Accessibility & Inclusivity

### WCAG AA Compliance
- [ ] Color contrast ratio ≥4.5:1 for normal text
- [ ] Color contrast ratio ≥3:1 for large text (18px+)
- [ ] All interactive elements keyboard accessible
- [ ] Focus indicators visible on all focusable elements
- [ ] ARIA labels on icon-only buttons
- [ ] Alt text on all images
- [ ] Semantic HTML (use proper heading hierarchy)

### Screen Reader Support
- [ ] Announce real-time updates (e.g., "Sarah joined the group")
- [ ] Announce swipe results (e.g., "Liked: Joe's Pizza")
- [ ] Match announcements (e.g., "Match found! Winner is Olive Garden")

### Inclusive Design
- [ ] Support for dietary restrictions (Vegan, Vegetarian, Gluten-Free, Halal, Kosher, Nut-Free)
- [ ] High contrast mode support
- [ ] Reduced motion mode (disable animations if user prefers)
- [ ] Large touch targets (minimum 44x44px)

---

## 12. Legal & Trust

### Privacy Policy
**Required Disclosures:**
- What data is collected (name, location, swipe preferences)
- How data is used (matching restaurants, analytics)
- Data retention (groups expire after 24 hours)
- Third-party services (Yelp, Vercel, Supabase)
- User rights (delete account, export data)
- Contact information

**Pro Tip:** Use a template from Termly or PrivacyPolicies.com, customize for ChickenTinders

### Terms of Service
**Key Sections:**
- User responsibilities (don't abuse the service)
- Prohibited uses (spam, harassment)
- Disclaimer of warranties (use at your own risk)
- Limitation of liability (not responsible for food choices)
- Termination rights (we can ban abusive users)

**Pro Tip:** Keep it simple and friendly. Avoid legalese.

### Trust Signals
**On Landing Page:**
- "🔒 Your data is private and secure"
- "🚫 No account required to join groups"
- "⚡ Groups expire after 24 hours"
- "👥 Used by 10,000+ hungry friends" (update as you grow)

---

## 13. Analytics & Measurement

### Key Metrics to Track
**Acquisition:**
- Unique visitors
- Traffic sources (organic, social, direct)
- Landing page conversion rate

**Activation:**
- Groups created
- Average time to first swipe
- Lobby join rate (visitors who click a link and actually join)

**Engagement:**
- Average swipes per user
- Session duration
- Swipe completion rate (users who finish the deck)

**Retention:**
- Users who create >1 group
- Share link click rate

**Referral:**
- Invite link shares
- Viral coefficient (how many friends does each user invite)

**Revenue:** (Future - if you monetize)
- Premium features adoption
- Conversion rate

### Event Tracking
**Critical Events:**
- `group_created` - Someone creates a group
- `lobby_joined` - Someone joins via invite link
- `swipe_completed` - User finishes swiping
- `match_found` - Group gets a match
- `link_shared` - User clicks "Copy Link"
- `social_share` - User shares to Instagram/Twitter
- `directions_clicked` - User clicks "Get Directions"
- `new_group_from_results` - User creates another group after matching

### A/B Testing Ideas
**Landing Page:**
- Test CTA copy: "Create Group" vs "Find Dinner Now" vs "Start Swiping"
- Test hero image: Phone mockup vs food photo vs people eating

**Lobby:**
- Test share button copy: "Copy Link" vs "Invite Friends" vs "Share Link"
- Test urgency messaging: "2+ people needed" vs "Get your friends in here!"

**Results:**
- Test re-engagement CTA placement (above fold vs below runner-ups)
- Test social share copy

---

## Final Notes for AI Agent

When implementing this specification:

1. **Mobile-first:** Every feature must work perfectly on mobile Safari before desktop Chrome
2. **Performance is a feature:** Prioritize speed. A fast, simple app beats a slow, complex one
3. **Accessibility is non-negotiable:** Every user should be able to use ChickenTinders
4. **Copy matters:** Use friendly, casual tone. Avoid corporate speak
5. **Test on real devices:** Simulators lie. Test on actual iPhone and Android phones
6. **Deploy early and often:** Every phase should result in a working, deployed site
7. **Analytics from day one:** You can't improve what you don't measure
8. **Fail gracefully:** Every error state should be handled with friendly messaging
9. **Viral mechanics are built-in, not bolted on:** Every screen should encourage sharing
10. **Professional doesn't mean boring:** Keep it fun, keep it polished

**The Goal:** ChickenTinders should feel so good to use that people want to share it with friends. The viral loop is: User creates group → Friends join (no friction) → Quick, satisfying match → "This was so easy!" → Create another group for next hangout → Repeat.

Build something people love. Good luck! 🍗