# ChickenTinders Design System
## Complete UI/UX Specification

**Version:** 2.0
**Last Updated:** January 2026
**Status:** Production-Ready Specification

---

## Table of Contents

1. [Brand Foundation](#brand-foundation)
2. [Color System](#color-system)
3. [Typography](#typography)
4. [Spacing & Layout](#spacing--layout)
5. [Component Library](#component-library)
6. [Animation System](#animation-system)
7. [Interaction Patterns](#interaction-patterns)
8. [Accessibility Standards](#accessibility-standards)
9. [Responsive Breakpoints](#responsive-breakpoints)
10. [Implementation Guidelines](#implementation-guidelines)

---

## Brand Foundation

### Brand Personality
- **Warm & Inviting** - Like a favorite neighborhood restaurant
- **Playful but Trustworthy** - Fun without feeling juvenile
- **Food-First** - Colors, language, and imagery centered around dining
- **Social by Nature** - Emphasizes group experiences and shared decisions

### Design Principles
1. **Every element must justify its presence** - Luxury through restraint
2. **Intentionality over intensity** - Bold direction beats loud design
3. **Performance is user experience** - 60fps animations, fast load times
4. **Accessibility is non-negotiable** - 4.5:1 contrast, keyboard navigation
5. **Consistency builds trust** - Semantic colors, predictable interactions

### Voice & Tone
- **Conversational** - "Let's settle this" not "Optimize your decision-making"
- **Confident** - "No more 47 texts to decide on tacos" (specific, memorable)
- **Encouraging** - "You're doing great!" not "Please wait..."
- **Friendly** - Use contractions, emoji sparingly, real human language

---

## Color System

### Brand Colors

#### Primary Palette
```css
/* Burgundy (Primary Brand Color) */
--burgundy: #A91D3A;
--burgundy-dark: #8B1538;
--burgundy-light: #C72C4A;

/* Cream (Background & Warmth) */
--cream: #FFF5E1;
--cream-dark: #F5EBE0;

/* Gold (Secondary Accent) */
--gold: #FFB800;
--gold-dark: #E6A500;
--gold-light: #FFC933;

/* Coral (Warm Accent) */
--coral: #FF6B35;
--coral-dark: #E55A2B;
--coral-light: #FF8C5C;

/* Charcoal (Text & Dark Elements) */
--charcoal: #2C0A0A;
--charcoal-light: #4A4541;

/* Sage (Success & Positive Actions) */
--sage: #4CAF50;
--sage-dark: #388E3C;
```

#### Semantic Mapping
```css
/* Action Colors */
--primary: var(--burgundy);
--secondary: var(--gold);
--accent: var(--coral);
--success: var(--sage);
--warning: #FF8C42;
--error: #EF4444;
--info: #3B82F6;

/* Surface Colors */
--background: var(--cream);
--surface: #FFFFFF;
--surface-elevated: #FFFFFF;
--overlay: rgba(44, 10, 10, 0.7);

/* Text Colors */
--text-dark: var(--charcoal);
--text-muted: #6B4423;
--text-light: #9B7653;
--text-disabled: #C4B5A0;
--text-inverse: #FFFFFF;
```

#### Dark Mode (Future Implementation)
```css
/* Dark Mode Overrides */
[data-theme="dark"] {
  --background: #1A1A1A;
  --surface: #2C2C2C;
  --surface-elevated: #3A3A3A;
  --text-dark: #F5F5F5;
  --text-muted: #C4B5A0;
  --primary: #C72C4A; /* Lighter for dark backgrounds */
}
```

### Color Usage Guidelines

#### Primary (Burgundy)
**Use for:**
- Primary CTAs (Create Group, Start Swiping)
- Navigation active states
- Important badges/labels
- Progress indicators
- Brand logos/wordmarks

**Avoid:**
- Body text (use charcoal)
- Large background areas (too intense)
- Error states (use error color)

#### Secondary (Gold)
**Use for:**
- Secondary CTAs (Join with Code)
- Accent decorations
- Highlight badges (UNANIMOUS)
- Hover states on primary buttons
- Premium features

**Avoid:**
- Primary actions (confuses hierarchy)
- Text on white (insufficient contrast)
- Warning states (use warning color)

#### Accent (Coral)
**Use for:**
- Tertiary actions
- Interactive elements (links, chips)
- Decorative elements (emoji backgrounds)
- Loading states
- Info boxes

**Avoid:**
- Primary navigation
- Large text blocks
- Success confirmations

### Contrast Requirements
```
WCAG 2.1 AA Compliance:
✅ Burgundy (#A91D3A) on Cream (#FFF5E1): 7.8:1 (AAA)
✅ Charcoal (#2C0A0A) on Cream (#FFF5E1): 15.2:1 (AAA)
✅ Gold (#FFB800) on Charcoal (#2C0A0A): 8.1:1 (AAA)
⚠️ Gold (#FFB800) on Cream (#FFF5E1): 3.2:1 (Fails AA)
✅ Coral (#FF6B35) on Charcoal (#2C0A0A): 5.8:1 (AA)

Always test with WebAIM Contrast Checker: https://webaim.org/resources/contrastchecker/
```

---

## Typography

### Font Families

#### Display Font (Headings & Emphasis)
```css
font-family: 'Fraunces', Georgia, serif;
```
- **Usage:** Hero titles, section headings, card titles
- **Character:** Elegant serif, high contrast, distinctive
- **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold)
- **Features:** Optical sizing enabled, old-style numerals

#### Body Font (Content & UI)
```css
font-family: 'DM Sans', -apple-system, BlinkMacSystemFont, 'Segoe UI', system-ui, sans-serif;
```
- **Usage:** Body text, buttons, labels, forms
- **Character:** Clean, readable, geometric humanist
- **Weights:** 400 (Regular), 500 (Medium), 600 (SemiBold), 700 (Bold)

### Type Scale

#### Display (Fraunces)
```css
/* Hero Title (Landing Page) */
.hero-title {
  font-family: 'Fraunces';
  font-size: 72px;
  line-height: 1.1;
  font-weight: 500;
  letter-spacing: -0.02em;
}

/* Section Title */
.section-title {
  font-family: 'Fraunces';
  font-size: 48px;
  line-height: 1.2;
  font-weight: 500;
  letter-spacing: -0.01em;
}

/* Card Title */
.card-title {
  font-family: 'Fraunces';
  font-size: 32px;
  line-height: 1.3;
  font-weight: 500;
}

/* Subsection Title */
.subsection-title {
  font-family: 'Fraunces';
  font-size: 24px;
  line-height: 1.4;
  font-weight: 500;
}
```

#### Body (DM Sans)
```css
/* Large Body (Subtitles, Callouts) */
.body-large {
  font-size: 20px;
  line-height: 1.6;
  font-weight: 400;
  letter-spacing: -0.01em;
}

/* Body (Primary Content) */
.body {
  font-size: 16px;
  line-height: 1.5;
  font-weight: 400;
}

/* Body Small (Secondary Content) */
.body-small {
  font-size: 14px;
  line-height: 1.4;
  font-weight: 400;
}

/* Caption (Labels, Metadata) */
.caption {
  font-size: 12px;
  line-height: 1.3;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Tiny (Timestamp, Legal) */
.tiny {
  font-size: 10px;
  line-height: 1.2;
  font-weight: 400;
  letter-spacing: 0.02em;
}
```

### Typography Utilities

```css
/* Emphasis */
.italic { font-style: italic; } /* Use for emphasis words */
.semibold { font-weight: 600; }
.bold { font-weight: 700; }

/* Tracking (Letter Spacing) */
.tracking-tight { letter-spacing: -0.02em; }
.tracking-normal { letter-spacing: 0; }
.tracking-wide { letter-spacing: 0.05em; } /* UPPERCASE LABELS */
.tracking-wider { letter-spacing: 0.1em; } /* SECTION BADGES */

/* Line Clamping */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```

### Typography Best Practices

1. **Hierarchy is Visual, Not Just Semantic**
   - Use size, weight, AND color to establish hierarchy
   - Don't rely on size alone

2. **Line Length**
   - Body text: 60-75 characters (optimal)
   - Maximum: 90 characters
   - Use `max-w-prose` (65ch) for long-form content

3. **Line Height**
   - Display text (large): 1.1-1.2 (tighter)
   - Body text: 1.5 (comfortable reading)
   - UI elements: 1.3-1.4 (compact)

4. **Optical Alignment**
   - Fraunces has slight overhang on "S", "O", "C"
   - Add negative margin-left: -2px to visually align left edges

---

## Spacing & Layout

### Spacing Scale (4px Base Unit)

```css
/* Tailwind Spacing Tokens */
--spacing-0: 0px;
--spacing-1: 4px;    /* 0.25rem */
--spacing-2: 8px;    /* 0.5rem */
--spacing-3: 12px;   /* 0.75rem */
--spacing-4: 16px;   /* 1rem */
--spacing-5: 20px;   /* 1.25rem */
--spacing-6: 24px;   /* 1.5rem */
--spacing-8: 32px;   /* 2rem */
--spacing-10: 40px;  /* 2.5rem */
--spacing-12: 48px;  /* 3rem */
--spacing-16: 64px;  /* 4rem */
--spacing-20: 80px;  /* 5rem */
--spacing-24: 96px;  /* 6rem */
--spacing-32: 128px; /* 8rem */
```

### Layout Grid

```css
/* Max Width Container */
.max-w-app {
  max-width: 768px; /* Mobile-first, tablet-friendly */
  margin: 0 auto;
}

/* Standard Padding */
.container-padding {
  padding-left: 16px;  /* Mobile */
  padding-right: 16px;
}

@media (min-width: 640px) {
  .container-padding {
    padding-left: 32px; /* Tablet+ */
    padding-right: 32px;
  }
}
```

### Spacing Guidelines

#### Component Internal Spacing
```css
/* Button Padding */
--button-padding-sm: 8px 16px;
--button-padding-md: 12px 24px;
--button-padding-lg: 16px 32px;

/* Card Padding */
--card-padding-sm: 16px;
--card-padding-md: 24px;
--card-padding-lg: 32px;

/* Form Input Padding */
--input-padding: 16px;
```

#### Section Spacing
```css
/* Vertical Rhythm */
--section-gap-sm: 40px;  /* Between related sections */
--section-gap-md: 64px;  /* Between major sections */
--section-gap-lg: 96px;  /* Between page sections */
```

#### Component Spacing
```css
/* Stack (Vertical) */
--stack-gap-xs: 4px;   /* Tight lists */
--stack-gap-sm: 8px;   /* Form fields */
--stack-gap-md: 16px;  /* Card content */
--stack-gap-lg: 24px;  /* Section content */

/* Inline (Horizontal) */
--inline-gap-xs: 4px;  /* Tight chips */
--inline-gap-sm: 8px;  /* Button groups */
--inline-gap-md: 16px; /* Navigation items */
--inline-gap-lg: 24px; /* Spaced actions */
```

---

## Component Library

### Buttons

#### Primary Button
```tsx
<Pressable className="bg-primary px-8 py-4 rounded-full shadow-elevated active:scale-95">
  <Text className="text-surface text-base font-semibold tracking-wide">
    Create a Group →
  </Text>
</Pressable>
```

**Variants:**
- `bg-primary` - Main actions (burgundy)
- `bg-secondary` - Secondary actions (gold)
- `bg-success` - Positive actions (sage green)
- `bg-gray-200` - Neutral/cancel actions

**States:**
- Default: Full opacity, shadow-elevated
- Hover: `hover:bg-primary-dark` (web)
- Active: `active:scale-95` + `active:bg-primary-dark`
- Disabled: `bg-gray-300` + `opacity-50`
- Loading: Show `<ActivityIndicator />` in place of text

#### Secondary Button (Outline)
```tsx
<Pressable className="bg-surface border-2 border-primary px-8 py-4 rounded-full active:scale-95">
  <Text className="text-primary text-base font-semibold tracking-wide">
    Join with Code
  </Text>
</Pressable>
```

#### Ghost Button (Text Only)
```tsx
<Pressable className="px-5 py-2.5 rounded-full active:bg-cream-dark">
  <Text className="text-sm font-semibold text-textDark tracking-wide">
    My Groups
  </Text>
</Pressable>
```

#### Icon Button
```tsx
<Pressable className="w-10 h-10 bg-surface rounded-full items-center justify-center active:scale-95 shadow-soft">
  <FontAwesome name="chevron-left" size={16} color="#4B5563" />
</Pressable>
```

### Cards

#### Standard Card
```tsx
<View className="bg-surface rounded-2xl p-6 shadow-soft">
  <Text className="text-lg font-bold text-textDark mb-3">
    Card Title
  </Text>
  <Text className="text-base text-textMuted">
    Card content goes here
  </Text>
</View>
```

**Variants:**
- `rounded-2xl` (20px) - Standard cards
- `rounded-3xl` (24px) - Hero cards, featured content
- `shadow-soft` - Default elevation
- `shadow-elevated` - Interactive cards (hover/focus)

#### Image Card (Restaurant)
```tsx
<View className="bg-surface rounded-2xl overflow-hidden shadow-lg">
  <Image source={...} className="w-full h-48" resizeMode="cover" />
  <View className="p-5">
    <Text className="text-2xl font-bold text-textDark mb-2">
      Restaurant Name
    </Text>
    <Text className="text-base text-textMuted">
      Category • Price
    </Text>
  </View>
</View>
```

#### Info Card (Status/Message)
```tsx
<View className="bg-accent/10 border-2 border-accent rounded-xl p-4">
  <Text className="text-sm font-semibold text-accent-dark mb-2">
    💡 Tip
  </Text>
  <Text className="text-sm text-textDark">
    Helpful message content
  </Text>
</View>
```

### Forms

#### Text Input
```tsx
<View className="mb-6">
  <Text className="text-sm font-semibold text-textDark mb-2 uppercase tracking-wide">
    Label
  </Text>
  <TextInput
    placeholder="Placeholder text"
    placeholderTextColor="#9CA3AF"
    className="bg-surface border-2 border-cream-dark rounded-xl px-4 py-4 text-base text-textDark focus:border-primary"
  />
  <Text className="text-xs text-textMuted mt-1">
    Helper text
  </Text>
</View>
```

**States:**
- Default: `border-cream-dark`
- Focus: `border-primary` + `ring-2 ring-primary/20`
- Error: `border-error` + error message below
- Disabled: `bg-gray-100` + `opacity-50`

#### Select/Dropdown
```tsx
<View className="mb-6">
  <Text className="text-sm font-semibold text-textDark mb-2 uppercase tracking-wide">
    Select Option
  </Text>
  <View className="relative">
    <Pressable className="bg-surface border-2 border-cream-dark rounded-xl px-4 py-4 flex-row items-center justify-between">
      <Text className="text-base text-textDark">Selected value</Text>
      <FontAwesome name="chevron-down" size={14} color="#6B4423" />
    </Pressable>
  </View>
</View>
```

#### Checkbox
```tsx
<Pressable className="flex-row items-center gap-3 py-2">
  <View className="w-6 h-6 rounded-md border-2 border-primary items-center justify-center bg-primary">
    <FontAwesome name="check" size={14} color="white" />
  </View>
  <Text className="text-base text-textDark">
    Checkbox label
  </Text>
</Pressable>
```

#### Toggle Switch
```tsx
<View className="flex-row items-center justify-between">
  <Text className="text-base text-textDark">Toggle label</Text>
  <Pressable className="w-12 h-7 bg-primary rounded-full justify-center px-1">
    <View className="w-5 h-5 bg-surface rounded-full" style={{ alignSelf: 'flex-end' }} />
  </Pressable>
</View>
```

### Badges & Labels

#### Status Badge
```tsx
<View className="px-3 py-1 bg-success/20 rounded-full">
  <Text className="text-xs font-bold text-success uppercase tracking-wide">
    Active
  </Text>
</View>
```

**Variants:**
- Success: `bg-success/20 text-success`
- Warning: `bg-warning/20 text-warning`
- Error: `bg-error/20 text-error`
- Info: `bg-info/20 text-info`
- Neutral: `bg-gray-100 text-gray-700`

#### Premium Badge (UNANIMOUS)
```tsx
<View className="absolute top-4 right-4 bg-gold px-3 py-1 rounded-full z-10">
  <Text className="text-surface text-xs font-bold">⭐ UNANIMOUS</Text>
</View>
```

### Avatars

#### User Avatar (Deterministic Color)
```tsx
// From components/ui/Avatar.tsx
<View className="w-12 h-12 rounded-full items-center justify-center" style={{ backgroundColor: colorFromName(name) }}>
  <Text className="text-white text-lg font-bold">
    {initials}
  </Text>
</View>
```

**Sizes:**
- Small: `w-8 h-8` (32px)
- Medium: `w-12 h-12` (48px)
- Large: `w-16 h-16` (64px)
- XLarge: `w-24 h-24` (96px)

### Loading States

#### Skeleton Loader
```tsx
<View className="bg-gray-100 rounded-xl animate-pulse">
  {/* Content placeholder */}
</View>
```

#### Spinner
```tsx
<ActivityIndicator size="large" color="#A91D3A" />
```

#### Progress Bar
```tsx
<View className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
  <View
    className="h-full bg-primary rounded-full"
    style={{ width: `${progress}%` }}
  />
</View>
```

### Empty States

#### Standard Empty State
```tsx
<View className="flex-1 items-center justify-center px-4 py-16">
  <Text className="text-6xl mb-4">😕</Text>
  <Text className="text-2xl font-bold text-textDark mb-2 text-center" style={{ fontFamily: 'Fraunces' }}>
    No Results Found
  </Text>
  <Text className="text-base text-textMuted text-center mb-6 max-w-sm">
    Helpful message explaining what happened and what to do next.
  </Text>
  <Pressable className="bg-primary px-6 py-3 rounded-xl active:scale-95">
    <Text className="text-surface font-semibold">Primary Action</Text>
  </Pressable>
</View>
```

### Toasts & Notifications

#### Toast (using react-hot-toast)
```tsx
toast.success('Match found! 🎉');
toast.error('Failed to join group');
toast('Coming soon!', { icon: '🚧' });
```

**Custom Toast:**
```tsx
toast.custom((t) => (
  <View className={`${t.visible ? 'animate-enter' : 'animate-leave'} bg-surface rounded-xl shadow-elevated px-4 py-3`}>
    <Text className="text-base font-semibold text-textDark">
      Custom message
    </Text>
  </View>
));
```

---

## Animation System

### Timing Constants

```javascript
// Duration (milliseconds)
export const DURATION = {
  INSTANT: 0,
  FAST: 150,      // Micro-interactions (hover, focus)
  NORMAL: 300,    // Page transitions, modal open/close
  SLOW: 600,      // Celebrations, complex animations
  VERY_SLOW: 1000 // Confetti, special effects
};

// Easing Curves
export const EASING = {
  // General purpose (default)
  easeOutCubic: 'cubic-bezier(0.16, 1, 0.3, 1)',

  // Spring/bounce effects
  spring: 'cubic-bezier(0.34, 1.56, 0.64, 1)',

  // Smooth deceleration
  easeOut: 'cubic-bezier(0.33, 1, 0.68, 1)',

  // Linear (progress bars only)
  linear: 'linear',
};
```

### Animation Patterns

#### Entrance Animations
```css
/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}
.animate-fade-in {
  animation: fadeIn 1s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Slide Up */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(40px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
.animate-slide-up {
  animation: slideUp 1s cubic-bezier(0.16, 1, 0.3, 1);
}

/* Scale In */
@keyframes scaleIn {
  from {
    opacity: 0;
    transform: scale(0.95);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}
.animate-scale-in {
  animation: scaleIn 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
}
```

#### Continuous Animations
```css
/* Float (Decorative Elements) */
@keyframes float {
  0%, 100% {
    transform: translateY(0) rotate(0deg);
  }
  50% {
    transform: translateY(-20px) rotate(5deg);
  }
}
.animate-float {
  animation: float 6s ease-in-out infinite;
}

/* Pulse (Loading Indicators) */
@keyframes pulse {
  0%, 100% {
    opacity: 1;
    transform: scale(1);
  }
  50% {
    opacity: 0.6;
    transform: scale(1.2);
  }
}
.animate-pulse {
  animation: pulse 2s ease-in-out infinite;
}
```

#### Interaction Animations
```css
/* Button Press (Active State) */
.active\:scale-95:active {
  transform: scale(0.95);
  transition: transform 150ms cubic-bezier(0.16, 1, 0.3, 1);
}

/* Hover Lift (Cards) */
.hover\:lift:hover {
  transform: translateY(-4px);
  transition: transform 300ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

### Stagger Delays
```css
/* Use for sequential entrance animations */
.delay-100 { animation-delay: 0.1s; }
.delay-200 { animation-delay: 0.2s; }
.delay-300 { animation-delay: 0.3s; }
.delay-400 { animation-delay: 0.4s; }
```

---

## Interaction Patterns

### Button Interactions

**Default State → Hover → Active → Loading**

```tsx
// Normal button
<Pressable
  onPress={handleAction}
  disabled={loading}
  className={`
    px-8 py-4 rounded-full
    ${loading ? 'bg-gray-300' : 'bg-primary active:scale-95 active:bg-primary-dark'}
    transition-all duration-150
  `}
>
  {loading ? (
    <ActivityIndicator color="white" />
  ) : (
    <Text className="text-surface text-base font-semibold">
      Button Text
    </Text>
  )}
</Pressable>
```

### Swipe Gestures

**From SwipeableCard.tsx:**
```typescript
const gesture = Gesture.Pan()
  .onUpdate((event) => {
    translateX.value = event.translationX;
    translateY.value = event.translationY;
    rotation.value = event.translationX / 20; // Tilt effect
  })
  .onEnd((event) => {
    // Determine swipe direction
    if (Math.abs(event.translationX) > SWIPE_THRESHOLD) {
      // Like or Dislike
    } else if (event.translationY < -SUPER_LIKE_THRESHOLD) {
      // Super Like
    } else {
      // Return to center
    }
  });
```

### Haptic Feedback

```typescript
export const haptic = {
  light: () => {
    if (Platform.OS === 'ios') {
      const Haptic = require('expo-haptics');
      Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Light);
    }
  },

  success: () => {
    if (Platform.OS === 'ios') {
      const Haptic = require('expo-haptics');
      Haptic.notificationAsync(Haptic.NotificationFeedbackType.Success);
    }
  },

  superLike: () => {
    if (Platform.OS === 'ios') {
      const Haptic = require('expo-haptics');
      // Double tap pattern
      Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Heavy);
      setTimeout(() => {
        Haptic.impactAsync(Haptic.ImpactFeedbackStyle.Heavy);
      }, 100);
    }
  },
};
```

---

## Accessibility Standards

### WCAG 2.1 AA Compliance Checklist

#### Color Contrast
- [ ] All text has 4.5:1 contrast (normal text)
- [ ] All text has 3:1 contrast (large text 18px+)
- [ ] Interactive elements have 3:1 contrast with adjacent colors
- [ ] Focus indicators have 3:1 contrast

#### Keyboard Navigation
- [ ] All interactive elements are keyboard accessible
- [ ] Focus order is logical (follows visual layout)
- [ ] Focus indicators are visible (no `outline: none` without replacement)
- [ ] Keyboard shortcuts don't conflict with screen readers
- [ ] Skip navigation links for long pages

#### Screen Reader Support
- [ ] All images have alt text (decorative images: `alt=""`)
- [ ] Form inputs have associated labels
- [ ] ARIA labels for icon-only buttons
- [ ] Proper heading hierarchy (h1 → h2 → h3, no skipping)
- [ ] Landmark regions (nav, main, aside, footer)

#### Interactive Elements
```tsx
// Button with ARIA label
<Pressable
  onPress={handleAction}
  accessibilityLabel="Create a new dining group"
  accessibilityRole="button"
  accessibilityHint="Opens the group creation form"
>
  <Text>Create Group</Text>
</Pressable>

// Input with label
<View>
  <Text nativeID="input-label">Group Code</Text>
  <TextInput
    accessibilityLabelledBy="input-label"
    accessibilityHint="Enter the 6-character group code"
  />
</View>
```

---

## Responsive Breakpoints

```javascript
// Tailwind breakpoints (mobile-first)
export const BREAKPOINTS = {
  sm: 640,   // Small tablets
  md: 768,   // Tablets
  lg: 1024,  // Small laptops
  xl: 1280,  // Desktops
  '2xl': 1536 // Large desktops
};
```

### Responsive Patterns

```tsx
// Stack on mobile, side-by-side on tablet+
<View className="flex-col md:flex-row gap-4">
  <View className="flex-1">Left content</View>
  <View className="flex-1">Right content</View>
</View>

// Responsive padding
<View className="px-4 md:px-8 lg:px-12">
  {/* Content */}
</View>

// Responsive font sizes
<Text className="text-2xl md:text-3xl lg:text-4xl">
  Responsive heading
</Text>
```

---

## Implementation Guidelines

### File Organization

```
components/
├── ui/                      # Reusable UI components
│   ├── Avatar.tsx
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── LoadingSkeleton.tsx
├── deck/                    # Swipe-specific components
│   ├── SwipeableCard.tsx
│   └── RestaurantCard.tsx
├── animations/              # Animation components
│   ├── ConfettiCelebration.tsx
│   └── Sparkle.tsx
└── PhoneDemo.tsx           # Landing page demo
```

### Naming Conventions

**Components:**
```
PascalCase for component files and names
Examples: SwipeableCard.tsx, Avatar.tsx, PriceTierSelector.tsx
```

**Props:**
```typescript
// Prop interface naming
interface ButtonProps {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  onPress: () => void;
  children: React.ReactNode;
}
```

**Utilities:**
```
camelCase for utility functions
Examples: calculateMatch, getUserId, haptic.success()
```

### Component Structure Template

```tsx
import { View, Text, Pressable } from 'react-native';

interface ComponentProps {
  // Required props first
  title: string;
  onPress: () => void;

  // Optional props with defaults
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
}

export function Component({
  title,
  onPress,
  variant = 'primary',
  disabled = false,
}: ComponentProps) {
  // Hooks at top
  const [loading, setLoading] = useState(false);

  // Derived state
  const buttonColor = variant === 'primary' ? 'bg-primary' : 'bg-secondary';

  // Event handlers
  const handlePress = async () => {
    setLoading(true);
    await onPress();
    setLoading(false);
  };

  // Render
  return (
    <Pressable
      onPress={handlePress}
      disabled={disabled || loading}
      className={`${buttonColor} px-8 py-4 rounded-full`}
    >
      <Text className="text-surface font-semibold">
        {title}
      </Text>
    </Pressable>
  );
}
```

---

## Testing Guidelines

### Visual Regression Testing
```bash
# Test checklist for each component
- [ ] Desktop (1920x1080)
- [ ] Tablet (768x1024)
- [ ] Mobile (375x667)
- [ ] Mobile landscape
- [ ] Dark mode (if supported)
```

### Browser Testing
```
Priority browsers:
✅ Chrome (latest)
✅ Safari (iOS 15+)
✅ Edge (latest)
⚠️ Firefox (test but don't block)
```

### Accessibility Testing
```bash
# Tools
- Chrome DevTools Lighthouse
- axe DevTools extension
- Screen reader testing (VoiceOver, NVDA)
- Keyboard navigation manual testing
```

---

## Performance Targets

### Core Web Vitals
```
LCP (Largest Contentful Paint): < 2.5s
FID (First Input Delay): < 100ms
CLS (Cumulative Layout Shift): < 0.1
```

### Image Optimization
```
- Use WebP format (with PNG/JPG fallback)
- Lazy load below-the-fold images
- Responsive images with srcset
- Maximum file size: 200KB per image
```

### Animation Performance
```
- Use transform and opacity (GPU-accelerated)
- Avoid animating width, height, top, left
- Target 60fps (16.67ms per frame)
- Use will-change sparingly
```

---

**End of Design System Specification**

This document serves as the single source of truth for all UI/UX decisions. When implementing new features, always reference this document to ensure consistency across the application.
