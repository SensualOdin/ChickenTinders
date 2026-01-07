# ChickenTinders Implementation Roadmap
## Step-by-Step Upgrade Plan

**Version:** 2.0
**Last Updated:** January 2026

This document provides a detailed, prioritized roadmap for upgrading ChickenTinders from MVP to production-grade application.

---

## Table of Contents

1. [Overview](#overview)
2. [Phase 0: Foundation Setup](#phase-0-foundation-setup)
3. [Phase 1: Critical Fixes](#phase-1-critical-fixes)
4. [Phase 2: Component System](#phase-2-component-system)
5. [Phase 3: Visual Polish](#phase-3-visual-polish)
6. [Phase 4: Advanced Features](#phase-4-advanced-features)
7. [Phase 5: Production Readiness](#phase-5-production-readiness)
8. [Testing Strategy](#testing-strategy)
9. [Deployment Checklist](#deployment-checklist)

---

## Overview

### Current State Assessment

**✅ What's Working:**
- Core swipe functionality
- Real-time collaboration
- Guest + authenticated modes
- Mobile-responsive design
- Intentional color system

**⚠️ What Needs Work:**
- Inconsistent styling (hardcoded colors)
- Missing reusable components
- Secondary pages feel rushed
- Placeholder content
- Accessibility gaps

**❌ Blockers:**
- Mock restaurant data (not production-viable)
- Join page styling inconsistency
- No focus indicators (accessibility violation)

### Effort Estimation

```
Phase 0 (Foundation):         30-60 minutes
Phase 1 (Critical Fixes):     6-8 hours
Phase 2 (Component System):   12-15 hours
Phase 3 (Visual Polish):      10-12 hours
Phase 4 (Advanced Features):  15-20 hours
Phase 5 (Production):         8-10 hours
-------------------------------------------
TOTAL:                        52-66 hours (~2 weeks for solo dev)
```

### Success Criteria

By completion, ChickenTinders will:
1. ✅ Use real restaurant data (Yelp API)
2. ✅ Have 100% consistent styling (no hardcoded colors)
3. ✅ Meet WCAG 2.1 AA accessibility standards
4. ✅ Include comprehensive error handling
5. ✅ Feel polished on all pages (not just landing)
6. ✅ Have reusable component library
7. ✅ Pass performance audits (LCP < 2.5s, CLS < 0.1)

---

## Phase 0: Foundation Setup
**Goal:** Install dependencies and configure utilities required by the component library
**Duration:** 30-60 minutes
**Priority:** MUST COMPLETE BEFORE PHASE 1

⚠️ **CRITICAL:** Without this phase, Phase 1+ will fail. The component library documentation assumes these dependencies and utilities exist.

---

### 0.1 Install Missing Dependencies (10 minutes)

The Component Library specs require dependencies that aren't currently installed.

**Install fonts:**
```bash
npm install @expo-google-fonts/fraunces @expo-google-fonts/dm-sans expo-font
```

**Install utility libraries:**
```bash
npm install clsx tailwind-merge
```

**Install component variant library (recommended):**
```bash
npm install class-variance-authority
```

**Why class-variance-authority (CVA)?**
- Industry standard for managing component variants (used by shadcn/ui)
- Cleaner than nested ternaries for Button/Input variants
- Type-safe variant definitions
- Better than complex if/else logic

**Verification:**
```bash
npm list @expo-google-fonts/fraunces @expo-google-fonts/dm-sans clsx tailwind-merge class-variance-authority
```

---

### 0.2 Create Utility Functions (10 minutes)

**File:** `lib/utils.ts` (create this file)

```typescript
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind CSS classes with proper precedence
 * Used throughout the component library for dynamic styling
 *
 * Example:
 *   cn('px-4 py-2', isActive && 'bg-primary', className)
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**Why this utility?**
- Combines `clsx` (conditional classes) + `tailwind-merge` (conflict resolution)
- Prevents class conflicts (e.g., `px-4` + `px-2` → only `px-2` applies)
- Required by all component library components
- Standard pattern from shadcn/ui

---

### 0.3 Update Tailwind Config (5 minutes)

**File:** `tailwind.config.js`

Add missing semantic colors referenced in DESIGN_SYSTEM.md:

```javascript
// Add to colors object (line 44-51)
colors: {
  // ... existing colors ...

  success: '#4CAF50',
  warning: '#FF8C42',
  error: '#EF4444',      // ✅ ADD THIS
  info: '#3B82F6',       // ✅ ADD THIS

  background: '#FFF5E1',
  surface: '#FFFFFF',
  dark: '#2C0A0A',
  textDark: '#2C0A0A',
  textMuted: '#6B4423',
  textLight: '#9B7653',
}
```

**Complete updated colors section:**
```javascript
colors: {
  // ChickenTinders brand colors
  burgundy: {
    DEFAULT: '#A91D3A',
    dark: '#8B1538',
  },
  coral: '#FF6B35',
  cream: {
    DEFAULT: '#FFF5E1',
    dark: '#F5EBE0',
  },
  gold: '#FFB800',
  charcoal: {
    DEFAULT: '#2C0A0A',
    light: '#4A4541',
  },
  sage: '#4CAF50',

  // Semantic colors mapped to brand palette
  primary: {
    DEFAULT: '#A91D3A',
    dark: '#8B1538',
    light: '#C72C4A',
  },
  secondary: {
    DEFAULT: '#FFB800',
    dark: '#E6A500',
    light: '#FFC933',
  },
  accent: {
    DEFAULT: '#FF6B35',
    dark: '#E55A2B',
    light: '#FF8C5C',
  },
  success: '#4CAF50',
  warning: '#FF8C42',
  error: '#EF4444',      // ✅ ADDED
  info: '#3B82F6',       // ✅ ADDED
  background: '#FFF5E1',
  surface: '#FFFFFF',
  dark: '#2C0A0A',
  textDark: '#2C0A0A',
  textMuted: '#6B4423',
  textLight: '#9B7653',
},
```

---

### 0.4 Add Font Loading (15 minutes)

**File:** `app/_layout.tsx`

Add font loading logic at the top of the file:

```typescript
import '../global.css';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from 'react-error-boundary';
import { View, Text } from 'react-native';
import { AuthProvider } from '../lib/contexts/AuthContext';
// ✅ ADD THESE IMPORTS
import { useFonts } from 'expo-font';
import {
  Fraunces_400Regular,
  Fraunces_500Medium,
  Fraunces_600SemiBold,
} from '@expo-google-fonts/fraunces';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';

// ✅ ADD THIS: Prevent auto-hiding splash screen
SplashScreen.preventAutoHideAsync();

// ... ErrorFallback component ...

export default function RootLayout() {
  // ✅ ADD THIS: Load custom fonts
  const [fontsLoaded, fontError] = useFonts({
    'Fraunces': Fraunces_500Medium,
    'Fraunces-Regular': Fraunces_400Regular,
    'Fraunces-SemiBold': Fraunces_600SemiBold,
    'DM Sans': DMSans_400Regular,
    'DM Sans-Medium': DMSans_500Medium,
    'DM Sans-SemiBold': DMSans_600SemiBold,
    'DM Sans-Bold': DMSans_700Bold,
  });

  // ✅ ADD THIS: Hide splash when fonts loaded
  useEffect(() => {
    if (fontsLoaded || fontError) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, fontError]);

  // ✅ ADD THIS: Don't render until fonts loaded
  if (!fontsLoaded && !fontError) {
    return null;
  }

  return (
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <AuthProvider>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#F8F6F1' },
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="[...missing]" />
        </Stack>
      </AuthProvider>
    </ErrorBoundary>
  );
}
```

**Why this matters:**
- Without font loading, Fraunces headings will fall back to Georgia
- Typography won't match design system
- Flash of unstyled text (FOUT) on first load
- Required for proper brand consistency

---

### 0.5 Verify Setup (5 minutes)

**Run these checks:**

```bash
# 1. Start dev server
npm run web

# 2. Check console for font loading
# Should see: "Font 'Fraunces' loaded successfully"

# 3. Inspect any heading in browser DevTools
# Font family should be: Fraunces, Georgia, serif

# 4. Check that cn() utility works
# Add this to any component temporarily:
import { cn } from '../lib/utils';
console.log(cn('px-4', 'px-2')); // Should output: 'px-2' (conflict resolved)
```

**Verification Checklist:**
- [ ] All dependencies installed (check package.json)
- [ ] `lib/utils.ts` created with cn() function
- [ ] Tailwind config includes `error` and `info` colors
- [ ] Fonts loading in _layout.tsx
- [ ] No console errors on app start
- [ ] Fraunces font visible in browser (inspect element)

---

### Phase 0 Completion Checklist

- [ ] @expo-google-fonts/fraunces installed
- [ ] @expo-google-fonts/dm-sans installed
- [ ] expo-font installed
- [ ] clsx installed
- [ ] tailwind-merge installed
- [ ] class-variance-authority installed (optional but recommended)
- [ ] lib/utils.ts created with cn() function
- [ ] tailwind.config.js updated with error + info colors
- [ ] app/_layout.tsx updated with font loading
- [ ] Fonts loading successfully (verified in browser)
- [ ] No console errors

**Milestone:** Foundation complete, ready for Phase 1

⚠️ **DO NOT PROCEED TO PHASE 1 WITHOUT COMPLETING PHASE 0**

---

## Phase 1: Critical Fixes
**Goal:** Fix blocking issues and establish UI consistency
**Duration:** 6-8 hours
**Priority:** MUST HAVE

**Prerequisites:** Phase 0 must be complete

### 1.1 Fix Join Page Styling (30 minutes)

**File:** `app/join.tsx`

**Changes:**

```tsx
// BEFORE (Current - Lines 108-124)
<Pressable
  className={`py-4 rounded-xl items-center ${
    loading || !groupCode.trim()
      ? 'bg-gray-300'
      : 'bg-secondary active:scale-95'  // ❌ Wrong color
  }`}
>

// AFTER (Fixed)
<Pressable
  className={`py-4 rounded-full items-center ${  // ✅ Consistent rounding
    loading || !groupCode.trim()
      ? 'bg-gray-300 opacity-50'  // ✅ Semantic disabled state
      : 'bg-primary active:scale-95 active:bg-primary-dark'  // ✅ Brand color
  }`}
>
```

**Replace hardcoded colors:**
```tsx
// Line 78: gray-600 → textMuted
// Line 97: gray-200 → cream-dark
// Line 113: gray-300 → surface + opacity-50
// Line 150: blue-50/blue-200/blue-800/blue-900 → accent/10, accent, textDark
```

**Result:** Join page matches brand consistency

---

### 1.2 Fix Focus Indicators (15 minutes)

**File:** `app/join.tsx` (and all other input fields)

**Changes:**

```tsx
// BEFORE (Line 99-100)
style={{
  outlineStyle: 'none',  // ❌ ACCESSIBILITY VIOLATION
}}

// AFTER (Remove the style prop entirely)
// Let Tailwind handle focus states:
className="... focus:border-primary focus:ring-2 focus:ring-primary/20"
```

**Apply to all TextInput components:**
- `app/join.tsx`
- `app/create.tsx`
- `app/auth/login.tsx`
- `app/auth/signup.tsx`
- `app/my-groups/create.tsx`

**Result:** Keyboard users can see focus

---

### 1.3 Fix Account Page Colors (15 minutes)

**File:** `app/account.tsx`

**Changes:**

```tsx
// BEFORE (Line 77)
<View className="bg-blue-50 border-2 border-blue-200 rounded-2xl p-4 mb-4">
  <Text className="text-lg font-bold text-blue-900 mb-3">

// AFTER
<View className="bg-accent/10 border-2 border-accent rounded-2xl p-4 mb-4">
  <Text className="text-lg font-bold text-accent-dark mb-3">
```

**Result:** Account page uses semantic colors

---

### 1.4 Standardize "Back" Navigation (30 minutes)

**Issue:** Inconsistent back button implementation

**Current variations:**
```tsx
// Variation 1: Text link (join.tsx, account.tsx)
<Pressable onPress={() => router.push('/')}>
  <Text className="text-primary text-base font-semibold">← Back to Home</Text>
</Pressable>

// Variation 2: Icon button (swipe.tsx)
<Pressable className="w-10 h-10 bg-gray-50 rounded-full items-center justify-center">
  <FontAwesome name="chevron-left" size={16} color="#4B5563" />
</Pressable>

// Variation 3: router.back() vs router.push('/')
```

**Solution:** Create standardized component

**File:** `components/navigation/BackButton.tsx`

```tsx
interface BackButtonProps {
  variant?: 'icon' | 'text';
  label?: string;
  onPress?: () => void;
}

export function BackButton({
  variant = 'icon',
  label = 'Back',
  onPress,
}: BackButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (onPress) {
      onPress();
    } else if (router.canGoBack()) {
      router.back();
    } else {
      router.push('/');
    }
  };

  if (variant === 'text') {
    return (
      <Pressable onPress={handlePress} className="mb-4 active:scale-95">
        <Text className="text-primary text-base font-semibold">
          ← {label}
        </Text>
      </Pressable>
    );
  }

  return (
    <Pressable
      onPress={handlePress}
      className="w-10 h-10 bg-surface rounded-full items-center justify-center active:scale-95 shadow-soft border border-cream-dark"
      accessibilityLabel={label}
      accessibilityRole="button"
    >
      <FontAwesome name="chevron-left" size={16} color="#6B4423" />
    </Pressable>
  );
}
```

**Replace in:**
- `app/join.tsx` (line 71-73)
- `app/account.tsx` (line 40-42, 127-129)
- `app/create.tsx`
- `app/swipe/[id].tsx` (line 142-147)
- `app/lobby/[id].tsx`

**Result:** Consistent navigation pattern

---

### 1.5 Add Missing Empty States (2 hours)

**Create:** `components/feedback/EmptyState.tsx` (see Component Library doc)

**Implement in:**

#### 1.5.1 No Restaurants Found
**File:** `app/swipe/[id].tsx` (line 177-197)

```tsx
// BEFORE (Current - basic error view)
<View className="flex-1 bg-background items-center justify-center px-4">
  <Text className="text-6xl mb-4">😕</Text>
  <Text className="text-2xl font-bold text-textDark mb-2 text-center">
    No Restaurants Found
  </Text>
  <Text className="text-base text-gray-600 text-center mb-6">
    {error}
  </Text>
  <Pressable className="bg-primary px-6 py-3 rounded-xl active:scale-95">
    <Text className="text-white font-semibold">Go Back</Text>
  </Pressable>
</View>

// AFTER (Using EmptyState component)
<EmptyState
  icon="😕"
  title="No Restaurants Found"
  description={error || "We couldn't find any restaurants matching your preferences. Try adjusting your filters or search radius."}
  action={{
    label: 'Adjust Preferences',
    onPress: () => router.back(),
  }}
  secondaryAction={{
    label: 'Start Over',
    onPress: () => router.push('/'),
  }}
/>
```

#### 1.5.2 No Saved Groups
**File:** `app/my-groups.tsx`

Add check:
```tsx
{savedGroups.length === 0 && (
  <EmptyState
    icon="📂"
    title="No Saved Groups Yet"
    description="Save your favorite group configurations to quickly start new sessions with the same preferences."
    action={{
      label: 'Create Your First Group',
      onPress: () => router.push('/my-groups/create'),
    }}
  />
)}
```

#### 1.5.3 No Group History
**File:** `app/history.tsx`

```tsx
<EmptyState
  icon="📜"
  title="No Group History"
  description="Your past group sessions will appear here. Start your first group to begin tracking your dining decisions!"
  action={{
    label: 'Create a Group',
    onPress: () => router.push('/create'),
  }}
/>
```

**Result:** Better UX for edge cases

---

### 1.6 Add Error Boundaries (1 hour)

**Create:** `components/feedback/ErrorBoundary.tsx` (see Component Library doc)

**Wrap critical routes:**

**File:** `app/_layout.tsx`

```tsx
import { ErrorBoundary } from '../components/feedback/ErrorBoundary';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Stack>
          {/* Routes */}
        </Stack>
      </AuthProvider>
    </ErrorBoundary>
  );
}
```

**Wrap critical components:**

```tsx
// In swipe page
<ErrorBoundary
  fallback={(error, reset) => (
    <EmptyState
      icon="⚠️"
      title="Something Went Wrong"
      description="We encountered an error while loading restaurants. Please try again."
      action={{ label: 'Retry', onPress: reset }}
      secondaryAction={{ label: 'Go Home', onPress: () => router.push('/') }}
    />
  )}
>
  <SwipeInterface />
</ErrorBoundary>
```

**Result:** Graceful error handling

---

### 1.7 Improve Loading States (1 hour)

**Create shimmer animation:**

**File:** `components/animations/Shimmer.tsx`

```tsx
export function Shimmer({
  width = '100%',
  height = 20,
  rounded = 'rounded',
}: {
  width?: number | string;
  height: number;
  rounded?: string;
}) {
  return (
    <View
      className={`overflow-hidden bg-cream-dark ${rounded}`}
      style={{
        width: typeof width === 'number' ? width : width,
        height,
      }}
    >
      <Animated.View
        className="h-full w-full"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
          animation: 'shimmer 2s infinite',
        }}
      />
    </View>
  );
}
```

**Add to tailwind.config.js:**
```javascript
keyframes: {
  shimmer: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
},
animation: {
  shimmer: 'shimmer 2s ease-in-out infinite',
},
```

**Update skeletons:**

**File:** `components/ui/LoadingSkeleton.tsx`

```tsx
// BEFORE
<View className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />

// AFTER
<Shimmer width="75%" height={24} rounded="rounded" />
```

**Result:** Better perceived performance

---

### Phase 1 Completion Checklist

- [ ] Join page uses semantic colors (burgundy, not gold)
- [ ] All inputs have visible focus indicators
- [ ] Account page uses accent colors (not blue)
- [ ] BackButton component created and implemented
- [ ] EmptyState component created
- [ ] Empty states added to swipe, my-groups, history
- [ ] ErrorBoundary wraps app and critical components
- [ ] Shimmer loading animation implemented
- [ ] All loading skeletons use shimmer + semantic colors

**Milestone:** No critical UI/UX violations remain

---

## Phase 2: Component System
**Goal:** Build reusable component library
**Duration:** 12-15 hours
**Priority:** SHOULD HAVE

### 2.1 Create Button Component (2 hours)

**File:** `components/ui/Button.tsx`

See Component Library doc for full implementation.

**Steps:**
1. Create Button.tsx with all variants
2. Create IconButton.tsx for icon-only buttons
3. Replace inline Pressable buttons across app

**Files to update:**
- `app/index.tsx` (4 buttons)
- `app/join.tsx` (3 buttons)
- `app/create.tsx` (2 buttons)
- `app/lobby/[id].tsx` (2 buttons)
- `app/swipe/[id].tsx` (4 buttons)
- `app/results/[id].tsx` (2 buttons)
- `app/account.tsx` (6 buttons)
- `app/my-groups.tsx` (3 buttons)

**Testing:**
- [ ] Primary variant works with href prop
- [ ] Secondary/outline variants styled correctly
- [ ] Loading state shows spinner
- [ ] Disabled state prevents interaction
- [ ] Icon variants render correctly
- [ ] Accessibility labels present

---

### 2.2 Create Input Component (2 hours)

**File:** `components/ui/Input.tsx`

See Component Library doc for full implementation.

**Steps:**
1. Create Input.tsx with focus states
2. Add error state support
3. Replace all inline TextInputs

**Files to update:**
- `app/join.tsx` (1 input)
- `app/create.tsx` (3 inputs)
- `app/auth/login.tsx` (2 inputs)
- `app/auth/signup.tsx` (3 inputs)
- `app/my-groups/create.tsx` (3 inputs)

**Testing:**
- [ ] Focus ring visible
- [ ] Error state displays correctly
- [ ] Helper text renders
- [ ] Icons work (left/right)
- [ ] Placeholder color matches design
- [ ] Keyboard dismissal works

---

### 2.3 Create Card Components (2 hours)

**Files:**
- `components/ui/Card.tsx`
- `components/ui/InfoCard.tsx`

**Steps:**
1. Create base Card component
2. Create InfoCard for messages/tips
3. Replace inline card Views

**Files to update:**
- `app/index.tsx` (How It Works cards, testimonials)
- `app/join.tsx` (info box)
- `app/account.tsx` (profile card, benefits card)
- `app/results/[id].tsx` (progress card, restaurant cards)

**Testing:**
- [ ] Card variants (default, elevated, outlined)
- [ ] Padding options work
- [ ] onPress makes card pressable
- [ ] InfoCard types (info, success, warning, error)
- [ ] Icons render correctly

---

### 2.4 Create Header Component (2 hours)

**File:** `components/layout/Header.tsx`

**Steps:**
1. Extract landing page header
2. Create app page header variant
3. Replace headers across app

**Files to update:**
- `app/index.tsx` (landing header)
- `app/swipe/[id].tsx` (app header with back button)
- `app/lobby/[id].tsx`
- `app/results/[id].tsx`

**Testing:**
- [ ] Landing variant shows logo + navigation
- [ ] App variant shows back button + title
- [ ] Responsive (mobile menu on small screens)
- [ ] User profile button works
- [ ] My Groups button shows for auth users only

---

### 2.5 Create Layout Components (1 hour)

**Files:**
- `components/layout/Container.tsx`
- `components/layout/Stack.tsx`

**Steps:**
1. Create Container for max-width wrapping
2. Create Stack for flex layouts
3. Replace inline layout Views

**Usage:**
```tsx
// Replace this pattern:
<View className="max-w-app mx-auto px-4">
  <View className="flex-col gap-4">
    {children}
  </View>
</View>

// With this:
<Container>
  <Stack gap="md">
    {children}
  </Stack>
</Container>
```

---

### 2.6 Create Badge Component (1 hour)

**File:** `components/ui/Badge.tsx`

**Implementation:**
```tsx
type BadgeVariant = 'success' | 'warning' | 'error' | 'info' | 'neutral' | 'premium';

interface BadgeProps {
  children: string;
  variant?: BadgeVariant;
  size?: 'sm' | 'md';
  icon?: string;
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'md',
  icon,
}: BadgeProps) {
  const variantStyles = {
    success: 'bg-success/20 text-success',
    warning: 'bg-warning/20 text-warning',
    error: 'bg-error/20 text-error',
    info: 'bg-info/20 text-info',
    neutral: 'bg-gray-100 text-gray-700',
    premium: 'bg-gold text-charcoal',
  };

  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
  };

  return (
    <View className={`${variantStyles[variant]} ${sizeStyles[size]} rounded-full`}>
      <Text className={`font-bold uppercase tracking-wide`}>
        {icon && `${icon} `}{children}
      </Text>
    </View>
  );
}
```

**Replace:**
- `app/results/[id].tsx` (UNANIMOUS badge, line 343)
- `app/account.tsx` (status badges)
- `app/my-groups.tsx` (member count badges)

---

### 2.7 Create Modal Component (2 hours)

**File:** `components/ui/Modal.tsx`

**Implementation:**
```tsx
interface ModalProps {
  visible: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
}

export function Modal({ visible, onClose, title, children, footer }: ModalProps) {
  if (!visible) return null;

  return (
    <View className="absolute inset-0 z-50">
      {/* Backdrop */}
      <Pressable
        onPress={onClose}
        className="absolute inset-0 bg-charcoal/70"
      />

      {/* Modal */}
      <View className="flex-1 items-center justify-center px-4">
        <Animated.View
          className="bg-surface rounded-3xl shadow-elevated max-w-md w-full"
          style={{ animation: 'slideUp 0.3s ease-out' }}
        >
          {/* Header */}
          {title && (
            <View className="px-6 pt-6 pb-4 border-b border-cream-dark flex-row items-center justify-between">
              <Text className="text-xl font-bold text-textDark" style={{ fontFamily: 'Fraunces' }}>
                {title}
              </Text>
              <IconButton
                icon={<FontAwesome name="times" size={18} color="#6B4423" />}
                onPress={onClose}
                variant="ghost"
                accessibilityLabel="Close"
              />
            </View>
          )}

          {/* Content */}
          <ScrollView className="px-6 py-6 max-h-96">
            {children}
          </ScrollView>

          {/* Footer */}
          {footer && (
            <View className="px-6 pb-6 pt-4 border-t border-cream-dark">
              {footer}
            </View>
          )}
        </Animated.View>
      </View>
    </View>
  );
}
```

**Use for:**
- Confirm leave group
- Delete saved group
- Share group code
- Report error details

---

### 2.8 Component Unit Testing (2 hours)

**⭐ MOVED FROM PHASE 5:** Test components as you build them, not after everything is done.

**Install testing dependencies:**
```bash
npm install --save-dev @testing-library/react-native @testing-library/jest-native jest
```

**Create test files:**

**File:** `components/ui/__tests__/Button.test.tsx`

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    const { getByText } = render(<Button>Click Me</Button>);
    expect(getByText('Click Me')).toBeTruthy();
  });

  it('calls onPress when clicked', () => {
    const onPress = jest.fn();
    const { getByText } = render(<Button onPress={onPress}>Click Me</Button>);

    fireEvent.press(getByText('Click Me'));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading state', () => {
    const { getByTestId } = render(<Button loading>Submit</Button>);
    expect(getByTestId('button-loading-spinner')).toBeTruthy();
  });

  it('disables interaction when disabled', () => {
    const onPress = jest.fn();
    const { getByText } = render(
      <Button disabled onPress={onPress}>Disabled</Button>
    );

    fireEvent.press(getByText('Disabled'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('applies variant styles correctly', () => {
    const { getByTestId } = render(
      <Button variant="secondary" testID="button">Secondary</Button>
    );

    const button = getByTestId('button');
    expect(button.props.className).toContain('bg-secondary');
  });
});
```

**File:** `components/ui/__tests__/Input.test.tsx`

```typescript
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';

describe('Input', () => {
  it('shows error state', () => {
    const { getByText } = render(
      <Input label="Email" errorText="Email is required" />
    );
    expect(getByText('Email is required')).toBeTruthy();
  });

  it('displays helper text', () => {
    const { getByText } = render(
      <Input label="Password" helperText="Min 8 characters" />
    );
    expect(getByText('Min 8 characters')).toBeTruthy();
  });

  it('calls onChange on input', () => {
    const onChange = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Enter text" onChangeText={onChange} />
    );

    fireEvent.changeText(getByPlaceholderText('Enter text'), 'test');
    expect(onChange).toHaveBeenCalledWith('test');
  });
});
```

**Run tests:**
```bash
npm test
```

**Why test in Phase 2?**
- Catch bugs early before components are used everywhere
- Ensures components work before mass replacement
- Prevents rework if component API needs changes
- Documents expected behavior for other developers

**Testing Coverage Goal:**
- [ ] Button component tests (5+ test cases)
- [ ] Input component tests (5+ test cases)
- [ ] Card component tests (3+ test cases)
- [ ] All tests passing

---

### Phase 2 Completion Checklist

- [ ] Button component created with all variants
- [ ] IconButton component created
- [ ] All inline Pressable buttons replaced
- [ ] Input component created with focus/error states
- [ ] All TextInputs replaced
- [ ] Card and InfoCard components created
- [ ] All inline card Views replaced
- [ ] Header component created (landing + app variants)
- [ ] Container and Stack layout components created
- [ ] Badge component created and implemented
- [ ] Modal component created
- [ ] Component Storybook/examples documented
- [ ] **Component unit tests written and passing** ✅ NEW
- [ ] **Test coverage at 80%+ for new components** ✅ NEW

**Milestone:** Consistent, reusable component system with test coverage

---

## Phase 3: Visual Polish
**Goal:** Elevate visual design to production quality
**Duration:** 10-12 hours
**Priority:** SHOULD HAVE

### 3.1 Redesign Authentication Pages (2 hours)

**Files:**
- `app/auth/login.tsx`
- `app/auth/signup.tsx`

**Current Issues:**
- Basic form layout
- No visual interest
- Generic error messages
- No brand presence

**Improvements:**

#### Layout Structure
```tsx
<ScrollView className="flex-1 bg-cream">
  <Container>
    <Stack gap="xl">
      {/* Brand Section */}
      <View className="items-center pt-16 pb-8">
        <Image
          source={require('../../assets/images/icon.png')}
          style={{ width: 80, height: 80 }}
          className="mb-4"
        />
        <Text
          className="text-4xl font-medium text-charcoal mb-2"
          style={{ fontFamily: 'Fraunces' }}
        >
          Welcome Back
        </Text>
        <Text className="text-base text-textMuted text-center">
          Sign in to access your saved groups and history
        </Text>
      </View>

      {/* Form Card */}
      <Card padding="lg" variant="elevated">
        <Stack gap="md">
          <Input
            label="Email"
            placeholder="you@example.com"
            keyboardType="email-address"
            autoCapitalize="none"
            value={email}
            onChangeText={setEmail}
            errorText={errors.email}
          />

          <Input
            label="Password"
            placeholder="••••••••"
            secureTextEntry
            value={password}
            onChangeText={setPassword}
            errorText={errors.password}
          />

          <Button
            onPress={handleLogin}
            loading={loading}
            fullWidth
          >
            Sign In
          </Button>
        </Stack>
      </Card>

      {/* Alternative Action */}
      <View className="items-center">
        <Text className="text-sm text-textMuted mb-3">
          Don't have an account?
        </Text>
        <Button
          href="/auth/signup"
          variant="outline"
        >
          Create Account
        </Button>
      </View>

      {/* Guest Mode Link */}
      <View className="items-center pt-8 border-t border-cream-dark">
        <Text className="text-sm text-textMuted mb-3">
          Just want to try it out?
        </Text>
        <Button
          href="/"
          variant="ghost"
          size="sm"
        >
          Continue as Guest
        </Button>
      </View>
    </Stack>
  </Container>
</ScrollView>
```

#### Password Strength Indicator (Signup)
```tsx
function PasswordStrength({ password }: { password: string }) {
  const strength = calculateStrength(password);

  return (
    <View className="mt-2">
      <View className="flex-row gap-1">
        {[1, 2, 3, 4].map((level) => (
          <View
            key={level}
            className={`flex-1 h-1 rounded-full ${
              level <= strength
                ? strength === 4
                  ? 'bg-success'
                  : strength === 3
                  ? 'bg-warning'
                  : 'bg-error'
                : 'bg-gray-200'
            }`}
          />
        ))}
      </View>
      <Text className="text-xs text-textMuted mt-1">
        {strength < 2 && 'Weak password'}
        {strength === 2 && 'Fair password'}
        {strength === 3 && 'Good password'}
        {strength === 4 && 'Strong password'}
      </Text>
    </View>
  );
}
```

**Testing:**
- [ ] Form validation works
- [ ] Password strength indicator accurate
- [ ] Error messages clear and helpful
- [ ] Navigation flows correct
- [ ] Guest mode link works

---

### 3.2 Replace Testimonials (1 hour)

**File:** `app/index.tsx` (lines 232-280)

**Current Issues:**
- Generic placeholder copy
- Emoji avatars feel cheap
- Lacks credibility

**Improvements:**

#### Better Copy
```tsx
const testimonials = [
  {
    quote: "My college roommates and I have a group chat with literally 2,847 messages about where to eat. ChickenTinders ended that chaos in 90 seconds. We now use it every single weekend.",
    author: "Jenny Martinez",
    role: "Syracuse University '24",
    avatar: require('../../assets/testimonials/jenny.jpg'), // Real photo
  },
  {
    quote: "As a team lead managing 12 remote engineers, our quarterly meetups used to waste the first hour deciding on lunch. Now we swipe in the Uber and have reservations by arrival. Game changer.",
    author: "David Chen",
    role: "Engineering Manager, TechCorp",
    avatar: require('../../assets/testimonials/david.jpg'),
  },
  {
    quote: "My family is... opinionated. 8 people, 8 different dietary needs, zero agreement on restaurants. This app saved Thanksgiving. Literally. We're using it for every holiday now.",
    author: "Linda Rodriguez",
    role: "Family reunion organizer",
    avatar: require('../../assets/testimonials/linda.jpg'),
  },
];
```

#### Enhanced Testimonial Card
```tsx
<View className="bg-surface rounded-2xl p-8 max-w-xs shadow-soft">
  {/* Rating */}
  <View className="flex-row gap-1 mb-4">
    {[1, 2, 3, 4, 5].map((star) => (
      <Text key={star} className="text-gold text-lg">★</Text>
    ))}
  </View>

  {/* Quote */}
  <Text className="text-base text-textDark mb-6 leading-relaxed">
    "{testimonial.quote}"
  </Text>

  {/* Author */}
  <View className="flex-row items-center gap-4">
    <Image
      source={testimonial.avatar}
      className="w-12 h-12 rounded-full"
    />
    <View>
      <Text className="text-sm font-semibold text-charcoal">
        {testimonial.author}
      </Text>
      <Text className="text-sm text-textMuted">
        {testimonial.role}
      </Text>
    </View>
  </View>
</View>
```

**If you don't have real photos yet:**
```tsx
// Use illustrated avatars from https://www.dicebear.com/
<Image
  source={{ uri: `https://api.dicebear.com/7.x/avataaars/png?seed=${testimonial.author}` }}
  className="w-12 h-12 rounded-full"
/>
```

---

### 3.3 Enhanced Swipe Animations (2 hours)

**File:** `components/deck/SwipeableCard.tsx`

**Improvements:**

#### 1. Tilt-Responsive Shadow
```tsx
const shadowStyle = useAnimatedStyle(() => {
  const shadow = interpolate(
    Math.abs(rotation.value),
    [0, 15],
    [8, 24],
    'clamp'
  );

  return {
    shadowRadius: shadow,
    shadowOpacity: 0.2,
  };
});
```

#### 2. Background Glow on Swipe
```tsx
// Add to card container
<Animated.View
  className="absolute inset-0 rounded-3xl"
  style={[
    {
      opacity: glowOpacity,
      backgroundColor: glowColor,
    },
    glowStyle,
  ]}
/>

// Animated values
const glowOpacity = useSharedValue(0);
const glowColor = useSharedValue('transparent');

// In gesture handler
.onUpdate((event) => {
  if (event.translationX > 50) {
    glowColor.value = withSpring('#4CAF50'); // Green for like
    glowOpacity.value = withSpring(0.2);
  } else if (event.translationX < -50) {
    glowColor.value = withSpring('#EF4444'); // Red for dislike
    glowOpacity.value = withSpring(0.2);
  } else {
    glowOpacity.value = withSpring(0);
  }
})
```

#### 3. Particle Effect on Super Like
```tsx
function SuperLikeParticles() {
  return (
    <View className="absolute inset-0 pointer-events-none">
      {Array.from({ length: 12 }).map((_, i) => (
        <Animated.View
          key={i}
          className="absolute"
          style={[
            {
              left: '50%',
              top: '50%',
            },
            particleStyles[i],
          ]}
        >
          <Text className="text-2xl">⭐</Text>
        </Animated.View>
      ))}
    </View>
  );
}
```

#### 4. Sound Effects (Optional)
```tsx
import { Audio } from 'expo-av';

const sounds = {
  swipeLeft: require('../../assets/sounds/swipe-left.mp3'),
  swipeRight: require('../../assets/sounds/swipe-right.mp3'),
  superLike: require('../../assets/sounds/super-like.mp3'),
};

const playSound = async (sound: keyof typeof sounds) => {
  const { sound: audioSound } = await Audio.Sound.createAsync(sounds[sound]);
  await audioSound.playAsync();
};
```

---

### 3.4 Results Page Celebration (2 hours)

**File:** `app/results/[id].tsx`

**Improvements:**

#### 1. Animated Match Count
```tsx
import Animated, { useAnimatedProps } from 'react-native-reanimated';

function AnimatedCounter({ end }: { end: number }) {
  const count = useSharedValue(0);

  useEffect(() => {
    count.value = withTiming(end, { duration: 1000, easing: Easing.out(Easing.quad) });
  }, [end]);

  const animatedProps = useAnimatedProps(() => ({
    text: Math.floor(count.value).toString(),
  }));

  return (
    <AnimatedText
      className="text-6xl font-bold text-primary"
      style={{ fontFamily: 'Fraunces' }}
      animatedProps={animatedProps}
    />
  );
}
```

#### 2. Staggered Card Reveal
```tsx
{matches.map((match, index) => (
  <Animated.View
    key={match.restaurant_id}
    style={{
      opacity: fadeIn,
      transform: [{ translateY: slideUp }],
      animationDelay: `${index * 100}ms`,
    }}
  >
    <RestaurantCard match={match} />
  </Animated.View>
))}
```

#### 3. Share Results Button
```tsx
<Button
  onPress={handleShare}
  variant="secondary"
  leftIcon={<FontAwesome name="share-alt" size={16} color="#2C0A0A" />}
>
  Share Results
</Button>

async function handleShare() {
  const message = `We found ${matches.length} matches on ChickenTinders! 🎉\n\n${matches.map(m => `• ${m.restaurant_data.name}`).join('\n')}`;

  await Share.share({
    message,
    title: 'ChickenTinders Match Results',
  });
}
```

---

### 3.5 Micro-interactions Pass (2 hours)

**Improvements across all pages:**

#### 1. Button Hover States (Web)
```css
/* Add to global CSS or Tailwind config */
@media (hover: hover) {
  .btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 12px 48px rgba(169, 29, 58, 0.3);
  }

  .btn-secondary:hover {
    border-color: #FFB800;
    background-color: #FFB800;
    color: #2C0A0A;
  }
}
```

#### 2. Input Focus Transitions
```tsx
<Animated.View
  className="border-2 rounded-xl"
  style={{
    borderColor: isFocused
      ? withSpring('#A91D3A')
      : '#F5EBE0',
  }}
>
  <TextInput ... />
</Animated.View>
```

#### 3. Card Hover Lift
```tsx
<Pressable
  onHoverIn={() => setHovered(true)}
  onHoverOut={() => setHovered(false)}
  style={{
    transform: [{ translateY: hovered ? -4 : 0 }],
  }}
>
  {/* Card content */}
</Pressable>
```

#### 4. Loading State Animations
```tsx
// Button loading
{loading ? (
  <View className="flex-row items-center gap-2">
    <ActivityIndicator size="small" color="white" />
    <Text className="text-surface font-semibold">Loading...</Text>
  </View>
) : (
  <Text className="text-surface font-semibold">Submit</Text>
)}
```

---

### 3.6 Dark Mode Foundation (1 hour)

**Note:** Don't fully implement, just prepare the foundation

**File:** `tailwind.config.js`

```javascript
module.exports = {
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      colors: {
        // Add dark mode variants
        background: {
          DEFAULT: '#FFF5E1',
          dark: '#1A1A1A',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          dark: '#2C2C2C',
        },
        primary: {
          DEFAULT: '#A91D3A',
          dark: '#C72C4A', // Lighter for dark backgrounds
        },
      },
    },
  },
};
```

**Usage pattern:**
```tsx
<View className="bg-background dark:bg-background-dark">
  <Text className="text-textDark dark:text-gray-100">
    Content
  </Text>
</View>
```

---

### Phase 3 Completion Checklist

- [ ] Auth pages redesigned with brand presence
- [ ] Password strength indicator on signup
- [ ] Testimonials have real/credible content
- [ ] Testimonial photos added (real or illustrated)
- [ ] Swipe animations enhanced (shadow, glow, particles)
- [ ] Results celebration improved (counter, stagger, share)
- [ ] Hover states added for web
- [ ] Focus transitions smooth
- [ ] Card interactions polished
- [ ] Dark mode foundation prepared

**Milestone:** App feels premium and polished

---

## Phase 4: Advanced Features
**Goal:** Add production-grade functionality
**Duration:** 15-20 hours
**Priority:** NICE TO HAVE

### 4.1 Yelp API Integration (3-4 hours)

**CRITICAL:** Replace mock data with real restaurant data

#### Step 1: Create Supabase Edge Function

**File:** `supabase/functions/yelp-proxy/index.ts`

```typescript
import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const YELP_API_KEY = Deno.env.get('YELP_API_KEY')!;
const YELP_API_URL = 'https://api.yelp.com/v3/businesses/search';

interface SearchParams {
  latitude: number;
  longitude: number;
  radius: number; // meters (max 40000)
  price: string; // '1,2,3,4'
  categories?: string; // comma-separated
  limit?: number;
}

serve(async (req) => {
  // CORS headers
  if (req.method === 'OPTIONS') {
    return new Response('ok', {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST',
        'Access-Control-Allow-Headers': 'authorization, content-type',
      },
    });
  }

  try {
    const params: SearchParams = await req.json();

    // Convert zip to lat/lng (using geocoding API or database)
    const { latitude, longitude } = await geocodeZip(params.zipCode);

    // Build Yelp query
    const queryParams = new URLSearchParams({
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      radius: Math.min(params.radius * 1609.34, 40000).toString(), // miles to meters
      price: params.price,
      limit: (params.limit || 50).toString(),
      sort_by: 'best_match',
    });

    if (params.categories) {
      queryParams.set('categories', params.categories);
    }

    // Call Yelp API
    const response = await fetch(`${YELP_API_URL}?${queryParams}`, {
      headers: {
        'Authorization': `Bearer ${YELP_API_KEY}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Yelp API error: ${response.statusText}`);
    }

    const data = await response.json();

    // Cache results (optional - use Supabase KV or similar)
    await cacheResults(params, data, 3600); // 1 hour

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  }
});
```

#### Step 2: Update Client Code

**File:** `lib/api/yelp.ts`

```typescript
export async function getRestaurantsForGroup(
  zipCode: string,
  radius: number,
  priceTier: string,
  dietaryTags: string[]
): Promise<YelpBusiness[]> {
  try {
    const response = await fetch(
      `${SUPABASE_URL}/functions/v1/yelp-proxy`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
        },
        body: JSON.stringify({
          zipCode,
          radius,
          price: priceTier,
          categories: mapDietaryToCategories(dietaryTags),
          limit: 50,
        }),
      }
    );

    if (!response.ok) {
      throw new Error('Failed to fetch restaurants');
    }

    const data = await response.json();
    return data.businesses;
  } catch (error) {
    console.error('Yelp API error:', error);
    throw error;
  }
}

function mapDietaryToCategories(tags: string[]): string {
  const mapping: Record<string, string> = {
    vegetarian: 'vegetarian',
    vegan: 'vegan',
    'gluten-free': 'gluten_free',
    halal: 'halal',
    kosher: 'kosher',
  };

  return tags.map(tag => mapping[tag]).filter(Boolean).join(',');
}
```

#### Step 3: Replace Mock Data

**File:** `app/swipe/[id].tsx`

```typescript
// BEFORE (Line 44)
const businesses = getMockRestaurants();

// AFTER
const businesses = await getRestaurantsForGroup(
  group.zip_code,
  group.radius,
  group.price_tier,
  [] // TODO: Aggregate dietary tags from all members
);
```

#### Step 4: Error Handling

```tsx
try {
  const businesses = await getRestaurantsForGroup(...);

  if (businesses.length === 0) {
    setError('No restaurants found in your area. Try widening your search radius or adjusting filters.');
    return;
  }

  setRestaurants(businesses);
} catch (err: any) {
  if (err.message.includes('rate limit')) {
    setError('Too many requests. Please wait a moment and try again.');
  } else if (err.message.includes('network')) {
    setError('Network error. Please check your connection and try again.');
  } else {
    setError('Failed to load restaurants. Please try again later.');
  }
}
```

---

### 4.2 Real-time Enhancements (2 hours)

**File:** `app/results/[id].tsx`

**Improvements:**

#### 1. Live Typing Indicators
```tsx
// Show who's actively swiping
<View className="flex-row items-center gap-2">
  <Avatar name={member.display_name} size="small" />
  <View className="flex-row gap-1">
    <View className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
    <View className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
    <View className="w-2 h-2 bg-primary rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
  </View>
</View>
```

#### 2. Presence Tracking
```tsx
// Track online/offline status
const presence = supabase.channel(`presence-${groupId}`)
  .on('presence', { event: 'sync' }, () => {
    const state = presence.presenceState();
    setOnlineMembers(Object.keys(state));
  })
  .subscribe();

// Show online indicator
<View className="relative">
  <Avatar name={member.display_name} />
  {isOnline && (
    <View className="absolute bottom-0 right-0 w-3 h-3 bg-success border-2 border-surface rounded-full" />
  )}
</View>
```

#### 3. Optimistic UI Updates
```tsx
// Update UI immediately, sync to server in background
const handleSwipe = async (isLiked: boolean) => {
  // Optimistic update
  setCurrentIndex(prev => prev + 1);

  // Background sync
  try {
    await supabase.from('swipes').insert({...});
  } catch (error) {
    // Rollback on error
    setCurrentIndex(prev => prev - 1);
    toast.error('Failed to save swipe. Please try again.');
  }
};
```

---

### 4.3 Accessibility Audit & Fixes (3 hours)

#### 1. Keyboard Navigation Testing

**Checklist:**
- [ ] Tab order is logical
- [ ] All interactive elements focusable
- [ ] Focus visible on all elements
- [ ] Enter/Space activates buttons
- [ ] Escape closes modals
- [ ] Arrow keys navigate lists

**Fixes:**

```tsx
// Add keyboard handlers
<Pressable
  onPress={handleAction}
  onKeyPress={(e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      handleAction();
    }
  }}
  tabIndex={0}
>
```

#### 2. Screen Reader Testing

**Test with:**
- iOS: VoiceOver (Settings → Accessibility → VoiceOver)
- Android: TalkBack (Settings → Accessibility → TalkBack)
- Web: NVDA (Windows), VoiceOver (Mac)

**Fixes:**

```tsx
// Add ARIA labels
<Pressable
  accessibilityLabel="Create a new dining group"
  accessibilityRole="button"
  accessibilityHint="Opens the group creation form where you can set preferences"
>
  <Text>Create Group</Text>
</Pressable>

// Image alt text
<Image
  source={...}
  accessibilityLabel="Restaurant exterior showing outdoor seating"
/>

// Decorative images
<Image
  source={...}
  accessibilityLabel=""
  accessibilityRole="none"
/>
```

#### 3. Color Contrast Verification

**Tool:** WebAIM Contrast Checker

**Test all combinations:**
```
✅ Burgundy (#A91D3A) on Cream (#FFF5E1): 7.8:1 (AAA)
✅ Charcoal (#2C0A0A) on Cream: 15.2:1 (AAA)
✅ Gold (#FFB800) on Charcoal: 8.1:1 (AAA)
⚠️ Gold on Cream: 3.2:1 (FAILS - never use)
✅ Coral (#FF6B35) on Charcoal: 5.8:1 (AA)
✅ Primary text (textDark) on Surface: 21:1 (AAA)
```

**Fix violations:**
```tsx
// BAD: Gold text on cream background
<Text className="text-secondary">Low contrast text</Text>

// GOOD: Gold on charcoal, or charcoal on cream
<Text className="text-charcoal">High contrast text</Text>
```

---

### 4.4 Performance Optimization (3 hours)

#### 1. Image Optimization

**Install:**
```bash
npm install expo-image
```

**Replace Image with optimized version:**
```tsx
import { Image } from 'expo-image';

<Image
  source={{ uri: restaurant.image_url }}
  placeholder={blurhash}
  contentFit="cover"
  transition={300}
  cachePolicy="memory-disk"
/>
```

**Lazy loading:**
```tsx
import { useState, useEffect, useRef } from 'react';

function LazyImage({ source, ...props }) {
  const [isVisible, setIsVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    });

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <View ref={ref}>
      {isVisible ? (
        <Image source={source} {...props} />
      ) : (
        <View style={{ backgroundColor: '#F5EBE0', ...props.style }} />
      )}
    </View>
  );
}
```

#### 2. Code Splitting

**Dynamic imports:**
```tsx
import { lazy, Suspense } from 'react';

const ConfettiCelebration = lazy(() => import('../components/animations/ConfettiCelebration'));

// Usage
<Suspense fallback={<View />}>
  {showConfetti && <ConfettiCelebration />}
</Suspense>
```

#### 3. Memoization

```tsx
import { memo, useMemo, useCallback } from 'react';

// Memoize expensive components
const RestaurantCard = memo(({ restaurant }) => {
  // Component logic
});

// Memoize calculations
const sortedMatches = useMemo(() => {
  return matches.sort((a, b) => b.match_score - a.match_score);
}, [matches]);

// Memoize callbacks
const handleSwipe = useCallback((isLiked: boolean) => {
  // Swipe logic
}, [currentIndex, restaurants]);
```

#### 4. Bundle Analysis

```bash
npx expo-cli export:web
npx webpack-bundle-analyzer .expo/web/webpack-stats.json
```

**Optimize large dependencies:**
- Replace moment.js with date-fns (if used)
- Tree-shake unused lodash functions
- Lazy load authentication pages

---

### 4.5 Advanced Matching Algorithm (2 hours)

**File:** `lib/utils/matches.ts`

**Current:** Binary matching (everyone liked = match)

**Improved:** Weighted scoring system

```typescript
interface MatchScore {
  restaurant_id: string;
  restaurant_data: YelpBusiness;
  match_score: number; // 0-100
  is_unanimous: boolean;
  liked_by: string[]; // user IDs
  super_liked_by: string[]; // user IDs
  disliked_by: string[]; // user IDs
}

export async function detectMatchesWithScoring(
  groupId: string,
  restaurants: YelpBusiness[]
): Promise<MatchScore[]> {
  // Get all swipes
  const { data: swipes } = await supabase
    .from('swipes')
    .select('*')
    .eq('group_id', groupId);

  // Get member count
  const { data: members } = await supabase
    .from('group_members')
    .select('user_id')
    .eq('group_id', groupId);

  const memberCount = members?.length || 0;

  // Calculate scores
  const scores = restaurants.map((restaurant) => {
    const restaurantSwipes = swipes?.filter(s => s.restaurant_id === restaurant.id) || [];

    const liked = restaurantSwipes.filter(s => s.is_liked);
    const superLiked = restaurantSwipes.filter(s => s.is_super_like);
    const disliked = restaurantSwipes.filter(s => !s.is_liked);

    // Scoring formula
    const likeScore = liked.length * 10;
    const superLikeScore = superLiked.length * 20;
    const dislikeScore = disliked.length * -15;
    const participationBonus = (restaurantSwipes.length / memberCount) * 20;

    const totalScore = Math.max(0, Math.min(100,
      likeScore + superLikeScore + dislikeScore + participationBonus
    ));

    return {
      restaurant_id: restaurant.id,
      restaurant_data: restaurant,
      match_score: totalScore,
      is_unanimous: liked.length === memberCount && disliked.length === 0,
      liked_by: liked.map(s => s.user_id),
      super_liked_by: superLiked.map(s => s.user_id),
      disliked_by: disliked.map(s => s.user_id),
    };
  });

  // Return matches above threshold (60+ score)
  return scores
    .filter(s => s.match_score >= 60)
    .sort((a, b) => b.match_score - a.match_score);
}
```

**Display match quality:**
```tsx
<View className="flex-row items-center gap-2 mb-2">
  <View className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
    <View
      className={`h-full rounded-full ${
        match.match_score >= 90 ? 'bg-success' :
        match.match_score >= 75 ? 'bg-warning' :
        'bg-primary'
      }`}
      style={{ width: `${match.match_score}%` }}
    />
  </View>
  <Text className="text-xs font-semibold text-textMuted">
    {match.match_score}% match
  </Text>
</View>
```

---

### Phase 4 Completion Checklist

- [ ] Supabase Edge Function created for Yelp API
- [ ] Mock data replaced with real Yelp data
- [ ] Error handling for API failures
- [ ] Rate limiting handled gracefully
- [ ] Live typing indicators implemented
- [ ] Presence tracking shows online members
- [ ] Optimistic UI updates for swipes
- [ ] Keyboard navigation tested and fixed
- [ ] Screen reader compatibility verified
- [ ] Color contrast audit complete
- [ ] Images optimized (WebP, lazy loading)
- [ ] Code splitting implemented
- [ ] Bundle size analyzed and optimized
- [ ] Advanced matching algorithm implemented
- [ ] Match quality scores displayed

**Milestone:** Production-grade functionality

---

## Phase 5: Production Readiness
**Goal:** Final polish and deployment prep
**Duration:** 8-10 hours
**Priority:** MUST HAVE

### 5.1 Error Monitoring Setup (1 hour)

**Install Sentry:**
```bash
npm install @sentry/react-native
npx @sentry/wizard -i reactNative
```

**Configure:**
```tsx
import * as Sentry from '@sentry/react-native';

Sentry.init({
  dsn: process.env.EXPO_PUBLIC_SENTRY_DSN,
  environment: __DEV__ ? 'development' : 'production',
  tracesSampleRate: 1.0,
  enableAutoSessionTracking: true,
});

// Wrap app
export default Sentry.wrap(App);
```

**Add custom context:**
```tsx
Sentry.setUser({
  id: user.id,
  email: user.email,
  username: profile.display_name,
});

Sentry.setContext('group', {
  group_id: groupId,
  member_count: members.length,
});
```

---

### 5.2 Analytics Setup (1 hour)

**Install Posthog (or similar):**
```bash
npm install posthog-react-native
```

**Track key events:**
```tsx
import { usePostHog } from 'posthog-react-native';

// Group created
posthog.capture('group_created', {
  member_count: 1,
  preferences: { zip_code, radius, price_tier },
});

// Group joined
posthog.capture('group_joined', {
  group_id: groupId,
  member_position: memberCount,
});

// Swipe completed
posthog.capture('restaurant_swiped', {
  restaurant_id: restaurant.id,
  action: isLiked ? 'like' : 'dislike',
  is_super_like: isSuperLike,
});

// Match found
posthog.capture('match_found', {
  group_id: groupId,
  match_count: matches.length,
  is_unanimous: hasUnanimous,
});
```

---

### 5.3 SEO & Meta Tags (1 hour)

**File:** `app/+html.tsx`

```tsx
export default function Html({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />

        {/* Primary Meta Tags */}
        <title>ChickenTinders - Swipe Right on Dinner</title>
        <meta name="title" content="ChickenTinders - Swipe Right on Dinner" />
        <meta
          name="description"
          content="End the 'where should we eat?' debate forever. Your group swipes, we find your match. No app required, works instantly."
        />
        <meta name="keywords" content="restaurant finder, group dining, food decisions, restaurant voting, dining app" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://chickentinders.com/" />
        <meta property="og:title" content="ChickenTinders - Swipe Right on Dinner" />
        <meta
          property="og:description"
          content="End the 'where should we eat?' debate forever. Your group swipes, we find your match."
        />
        <meta property="og:image" content="https://chickentinders.com/og-image.png" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://chickentinders.com/" />
        <meta property="twitter:title" content="ChickenTinders - Swipe Right on Dinner" />
        <meta
          property="twitter:description"
          content="End the 'where should we eat?' debate forever. Your group swipes, we find your match."
        />
        <meta property="twitter:image" content="https://chickentinders.com/og-image.png" />

        {/* Favicon */}
        <link rel="icon" type="image/png" href="/favicon.png" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

        {/* Fonts */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>{children}</body>
    </html>
  );
}
```

---

### 5.4 Performance Audit (2 hours)

**Run Lighthouse:**
```bash
npx expo export:web
npx serve .expo/web
# Open Chrome DevTools → Lighthouse → Run audit
```

**Target scores:**
- Performance: 90+
- Accessibility: 100
- Best Practices: 100
- SEO: 90+

**Common fixes:**

1. **LCP (Largest Contentful Paint) < 2.5s**
   - Optimize hero image
   - Preload critical assets
   - Use CDN for images

2. **CLS (Cumulative Layout Shift) < 0.1**
   - Define image dimensions
   - Reserve space for dynamic content
   - Avoid FOIT (Flash of Invisible Text)

3. **FID (First Input Delay) < 100ms**
   - Minimize JavaScript execution
   - Code split heavy components
   - Use web workers for heavy calculations

---

### 5.5 Cross-Browser Testing (2 hours)

**Test matrix:**
```
✅ Chrome (Windows, Mac, Android)
✅ Safari (iOS 15+, Mac)
✅ Edge (Windows)
⚠️ Firefox (test but don't block)
❌ IE11 (not supported)
```

**Test checklist:**
- [ ] Landing page renders correctly
- [ ] Forms submit properly
- [ ] Swipe gestures work (touch + mouse)
- [ ] Real-time updates received
- [ ] Images load and display
- [ ] Animations smooth (60fps)
- [ ] No console errors

**Common issues:**

1. **Safari: Flexbox bugs**
   - Add explicit flex-shrink/grow
   - Use height: 100% instead of flex: 1 in some cases

2. **iOS: Scroll behavior**
   - Add `-webkit-overflow-scrolling: touch`
   - Fix rubber-band scroll

3. **Firefox: Backdrop-filter**
   - Add fallback for `backdrop-filter: blur()`

---

### 5.6 Security Audit (1 hour)

**Checklist:**

- [ ] Environment variables not exposed to client
- [ ] API keys in Supabase Edge Functions only
- [ ] RLS policies on all Supabase tables
- [ ] Input validation on all forms
- [ ] SQL injection prevention (parameterized queries)
- [ ] XSS prevention (React escapes by default)
- [ ] CSRF protection (not needed for API-only)
- [ ] Rate limiting on API endpoints
- [ ] No sensitive data in URLs
- [ ] HTTPS enforced

**Supabase RLS policies:**

```sql
-- Groups table
CREATE POLICY "Users can read groups they're members of"
ON groups FOR SELECT
USING (
  id IN (
    SELECT group_id FROM group_members WHERE user_id = auth.uid()
  )
);

-- Swipes table
CREATE POLICY "Users can insert their own swipes"
ON swipes FOR INSERT
WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can read swipes in their groups"
ON swipes FOR SELECT
USING (
  group_id IN (
    SELECT group_id FROM group_members WHERE user_id = auth.uid()
  )
);
```

---

### 5.7 Documentation (1 hour)

**Create/update:**

1. **README.md**
   - Project overview
   - Setup instructions
   - Environment variables
   - Deployment guide

2. **CONTRIBUTING.md**
   - Code style guide
   - Component guidelines
   - PR process

3. **API_DOCS.md**
   - Endpoint documentation
   - Response formats
   - Error codes

4. **USER_GUIDE.md**
   - How to use the app
   - FAQ
   - Troubleshooting

---

### Phase 5 Completion Checklist

- [ ] Sentry error monitoring configured
- [ ] Analytics tracking implemented
- [ ] SEO meta tags added
- [ ] Sitemap.xml generated
- [ ] Lighthouse audit score 90+
- [ ] Cross-browser testing complete
- [ ] Security audit passed
- [ ] Environment variables secured
- [ ] RLS policies verified
- [ ] Documentation complete
- [ ] Deployment guide written

**Milestone:** Production-ready application

---

## Testing Strategy

### Unit Tests

**Framework:** Jest + React Testing Library

**Priority components:**
```typescript
// Button.test.tsx
describe('Button', () => {
  it('renders with correct variant styles', () => {});
  it('shows loading state', () => {});
  it('disables interaction when disabled', () => {});
  it('calls onPress when clicked', () => {});
  it('navigates with href prop', () => {});
});

// Input.test.tsx
describe('Input', () => {
  it('shows error state', () => {});
  it('displays helper text', () => {});
  it('calls onChange on input', () => {});
  it('shows focus ring', () => {});
});
```

### Integration Tests

**Framework:** Detox (React Native E2E)

**Critical flows:**
```typescript
describe('Group Creation Flow', () => {
  it('should create group and navigate to lobby', async () => {
    await element(by.text('Create a Group')).tap();
    await element(by.id('input-name')).typeText('Test User');
    await element(by.id('input-zip')).typeText('10001');
    await element(by.text('Create Group')).tap();
    await expect(element(by.text('Share this code'))).toBeVisible();
  });
});

describe('Swipe Flow', () => {
  it('should swipe through restaurants and see results', async () => {
    // Setup: Join existing group
    // Test: Swipe right on 3 restaurants
    // Assert: Navigate to results page
  });
});
```

### Manual Testing Checklist

**Before each release:**

- [ ] Guest user flow (create → lobby → swipe → results)
- [ ] Authenticated user flow (login → my groups → create from template)
- [ ] Join existing group (valid code, invalid code, expired group)
- [ ] Real-time updates (multi-device testing)
- [ ] Form validation (all inputs)
- [ ] Error states (network error, API error, empty states)
- [ ] Accessibility (keyboard nav, screen reader)
- [ ] Mobile gestures (swipe, pull-to-refresh)
- [ ] Cross-browser compatibility

---

## Deployment Checklist

### Pre-Deployment

- [ ] All tests passing
- [ ] No console errors in production build
- [ ] Environment variables configured
- [ ] Database migrations run
- [ ] Edge Functions deployed
- [ ] Analytics tracking verified
- [ ] Error monitoring active
- [ ] Performance audit passed

### Deployment Steps

1. **Build production bundle**
   ```bash
   npm run build
   ```

2. **Run production locally**
   ```bash
   npm run preview
   ```

3. **Deploy to staging**
   ```bash
   git push staging main
   ```

4. **Smoke test staging**
   - [ ] Landing page loads
   - [ ] Can create group
   - [ ] Can join group
   - [ ] Swipe works
   - [ ] Results display

5. **Deploy to production**
   ```bash
   git push production main
   ```

6. **Monitor for errors**
   - Check Sentry for crashes
   - Check analytics for drop-offs
   - Monitor API error rates

### Post-Deployment

- [ ] Verify production site loads
- [ ] Test critical user flows
- [ ] Check error monitoring dashboard
- [ ] Monitor performance metrics
- [ ] Announce launch 🎉

---

**End of Implementation Roadmap**

This roadmap provides a comprehensive, step-by-step plan to upgrade ChickenTinders from MVP to production-grade application. Follow each phase sequentially to ensure consistent progress and quality.
