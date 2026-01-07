# ChickenTinders: Quick Reference Guide
## Cheat Sheet for Implementation

**Version:** 2.1
**Last Updated:** January 2026

⚠️ **START HERE:** Complete Phase 0 (Foundation Setup) in IMPLEMENTATION_ROADMAP.md before using this guide!

**Phase 0 Prerequisites:**
- ✅ Install all dependencies (@expo-google-fonts, clsx, tailwind-merge, class-variance-authority)
- ✅ Create `lib/utils.ts` with `cn()` utility function
- ✅ Update `tailwind.config.js` with error and info colors
- ✅ Add font loading to `app/_layout.tsx`
- ✅ Verify fonts load correctly

This is your go-to quick reference while implementing improvements. Pin this!

---

## Color System (Use These, Not Hardcoded)

```tsx
// ✅ ALWAYS USE SEMANTIC COLORS
text-primary        // #A91D3A (burgundy)
text-secondary      // #FFB800 (gold)
text-accent         // #FF6B35 (coral)
text-success        // #4CAF50 (sage green)
text-error          // #EF4444 (red) ← NEW in Phase 0
text-info           // #3B82F6 (blue) ← NEW in Phase 0
text-textDark       // #2C0A0A (charcoal)
text-textMuted      // #6B4423 (brown)
bg-background       // #FFF5E1 (cream)
bg-surface          // #FFFFFF (white)
bg-cream-dark       // #F5EBE0 (darker cream)
border-cream-dark   // #F5EBE0

// ❌ NEVER USE HARDCODED COLORS
text-gray-600       // ❌ Use text-textMuted
text-gray-500       // ❌ Use text-textLight
border-gray-200     // ❌ Use border-cream-dark
bg-gray-300         // ❌ Use bg-surface + opacity-50
bg-blue-50          // ❌ Use bg-info/10
text-blue-800       // ❌ Use text-info
bg-red-50           // ❌ Use bg-error/10
text-red-600        // ❌ Use text-error
```

---

## cn() Utility Usage

**✅ Always use cn() for combining classes:**
```tsx
import { cn } from '../../lib/utils';

// Combine base classes with conditional classes
<View className={cn(
  "bg-surface rounded-2xl p-4",  // Base classes
  variant === 'elevated' && "shadow-elevated",  // Conditional
  isActive && "border-2 border-primary"  // Conditional
)} />

// With Tailwind-merge benefits (automatically resolves conflicts)
<View className={cn(
  "p-4",      // Original padding
  "p-6"       // Later padding OVERRIDES (not adds to)
)} />
// Result: Only p-6 is applied (Tailwind-merge removes p-4)
```

**Why cn()?**
- ✅ Merges Tailwind classes intelligently (prevents conflicts)
- ✅ Handles conditional classes cleanly
- ✅ Type-safe with clsx
- ✅ Standard pattern from shadcn/ui

---

## Button Quick Reference (CVA Pattern)

**✅ RECOMMENDED: Use CVA for buttons with variants**
```tsx
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Define variants with CVA
const buttonVariants = cva(
  'rounded-full shadow-elevated active:scale-95 transition-all flex-row items-center justify-center gap-2',
  {
    variants: {
      variant: {
        primary: 'bg-primary active:bg-primary-dark',
        secondary: 'bg-secondary active:bg-secondary-dark',
        outline: 'bg-surface border-2 border-primary active:bg-cream',
        ghost: 'bg-transparent active:bg-cream-dark',
        danger: 'bg-error active:bg-error-dark',
      },
      size: {
        sm: 'px-5 py-2.5',
        md: 'px-8 py-4',
        lg: 'px-10 py-5',
      },
      fullWidth: { true: 'w-full' },
    },
    defaultVariants: { variant: 'primary', size: 'md' },
  }
);

// Usage
<Button variant="primary" size="md" onPress={handleAction}>
  Create Group
</Button>

<Button variant="secondary" onPress={handleAction}>
  Join Group
</Button>

<Button variant="outline" onPress={handleAction}>
  Cancel
</Button>

<Button variant="ghost" onPress={handleAction}>
  Skip
</Button>

<Button variant="danger" onPress={handleDelete}>
  Delete
</Button>

// With loading
<Button loading={isLoading} onPress={handleAction}>
  Submit
</Button>

// With navigation
<Button href="/create">
  Create Group
</Button>

// With icons
<Button
  leftIcon={<FontAwesome name="plus" size={16} color="white" />}
  rightIcon={<Text>→</Text>}
>
  Button Text
</Button>

// Icon button
<IconButton
  icon={<FontAwesome name="chevron-left" size={16} color="#6B4423" />}
  onPress={() => router.back()}
  accessibilityLabel="Go back"
/>
```

**Basic Implementation (Alternative):**
```tsx
// Without CVA (simpler, but less type-safe)
<Button variant="primary" onPress={handleAction}>
  Create Group
</Button>
```

---

## Input Quick Reference

```tsx
// Basic input
<Input
  label="Display Name"
  placeholder="Enter your name"
  value={name}
  onChangeText={setName}
/>

// With helper text
<Input
  label="Email"
  placeholder="you@example.com"
  helperText="We'll never share your email"
  value={email}
  onChangeText={setEmail}
/>

// Error state
<Input
  label="Password"
  value={password}
  onChangeText={setPassword}
  errorText={errors.password}
  variant="error"
/>

// With icons
<Input
  label="Search"
  placeholder="Find restaurants..."
  leftIcon={<FontAwesome name="search" size={16} color="#6B4423" />}
  rightIcon={
    value && (
      <Pressable onPress={clearSearch}>
        <FontAwesome name="times-circle" size={16} />
      </Pressable>
    )
  }
/>

// Password with show/hide
<Input
  label="Password"
  placeholder="••••••••"
  secureTextEntry={!showPassword}
  rightIcon={
    <Pressable onPress={() => setShowPassword(!showPassword)}>
      <FontAwesome name={showPassword ? "eye-slash" : "eye"} size={16} />
    </Pressable>
  }
/>
```

---

## Card Quick Reference

```tsx
// Standard card
<Card padding="md">
  <Text className="text-lg font-bold text-textDark mb-3">
    Card Title
  </Text>
  <Text className="text-base text-textMuted">
    Card content
  </Text>
</Card>

// Elevated card (more shadow)
<Card padding="lg" variant="elevated">
  {/* Important content */}
</Card>

// Outlined card
<Card padding="md" variant="outlined">
  {/* Subtle content */}
</Card>

// Interactive card
<Card padding="md" onPress={handlePress} variant="elevated">
  {/* Clickable card */}
</Card>

// Info card (messages/tips)
<InfoCard type="info" title="Tip">
  <Text className="text-sm text-textDark">
    Helpful information here
  </Text>
</InfoCard>

// Success message
<InfoCard type="success" title="Success!">
  <Text className="text-sm">Account created</Text>
</InfoCard>

// Warning
<InfoCard type="warning" title="Warning">
  <Text className="text-sm">Limited spots available</Text>
</InfoCard>

// Error
<InfoCard type="error" title="Error">
  <Text className="text-sm">Connection failed</Text>
</InfoCard>
```

---

## Empty State Quick Reference

```tsx
<EmptyState
  icon="😕"
  title="No Results Found"
  description="We couldn't find what you're looking for. Try adjusting your search."
  action={{
    label: 'Try Again',
    onPress: handleRetry,
  }}
  secondaryAction={{
    label: 'Go Home',
    onPress: () => router.push('/'),
  }}
/>
```

**Common use cases:**
```tsx
// No restaurants
<EmptyState
  icon="😕"
  title="No Restaurants Found"
  description="Try widening your search radius or adjusting filters."
  action={{ label: 'Adjust Filters', onPress: goBack }}
/>

// No saved groups
<EmptyState
  icon="📂"
  title="No Saved Groups Yet"
  description="Save configurations to quickly start new sessions."
  action={{ label: 'Create First Group', onPress: navigate }}
/>

// Network error
<EmptyState
  icon="⚠️"
  title="Connection Error"
  description="Please check your internet connection."
  action={{ label: 'Retry', onPress: retry }}
/>
```

---

## Layout Quick Reference

```tsx
// Container (max-width wrapper)
<Container maxWidth="app" padding>
  {/* Content */}
</Container>

// Stack (vertical or horizontal)
<Stack gap="md" direction="vertical">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</Stack>

<Stack direction="horizontal" justify="between" align="center">
  <Text>Left</Text>
  <Button>Right</Button>
</Stack>
```

---

## Navigation Quick Reference

```tsx
// Back button (icon)
<BackButton variant="icon" label="Go back" />

// Back button (text)
<BackButton variant="text" label="Back to Home" />

// Header (landing)
<Header variant="landing" />

// Header (app)
<Header title="Page Title" />

// Header with custom actions
<Header
  leftAction={<BackButton />}
  rightAction={<Button variant="ghost">Save</Button>}
/>
```

---

## Loading States Quick Reference

```tsx
// Spinner
<ActivityIndicator size="large" color="#A91D3A" />

// Shimmer loading
<Shimmer width="75%" height={24} rounded="rounded" />

// Skeleton card
<RestaurantCardSkeleton />
<ResultsCardSkeleton />

// Button loading
<Button loading={isLoading} onPress={handleAction}>
  Submit
</Button>
```

---

## Animation Quick Reference

```tsx
// Entrance animations (Tailwind classes)
className="animate-fade-in"
className="animate-slide-up"
className="animate-scale-in"

// With delay
className="animate-slide-up"
style={{ animationDelay: '0.1s' }}

// Continuous animations
className="animate-float"      // Floating elements
className="animate-pulse"      // Loading indicators
className="animate-bounce"     // Celebration

// Confetti
<ConfettiCelebration />

// Shimmer
<Shimmer width="100%" height={48} />
```

---

## Typography Quick Reference

```tsx
// Hero title (Fraunces)
<Text
  className="text-6xl font-medium text-charcoal leading-tight"
  style={{ fontFamily: 'Fraunces' }}
>
  Swipe right on dinner
</Text>

// Section title (Fraunces)
<Text
  className="text-4xl font-medium text-charcoal mb-4"
  style={{ fontFamily: 'Fraunces' }}
>
  Section Title
</Text>

// Card title (Fraunces)
<Text
  className="text-2xl font-semibold text-textDark mb-2"
  style={{ fontFamily: 'Fraunces' }}
>
  Card Title
</Text>

// Body large
<Text className="text-xl text-textMuted leading-relaxed">
  Subtitle or callout text
</Text>

// Body (default)
<Text className="text-base text-textDark">
  Standard body text
</Text>

// Body small
<Text className="text-sm text-textMuted">
  Secondary information
</Text>

// Label (uppercase)
<Text className="text-xs font-semibold text-textDark uppercase tracking-wide">
  Form Label
</Text>
```

---

## Common Patterns

### Form Validation

```tsx
const [errors, setErrors] = useState<Record<string, string>>({});

const validate = () => {
  const newErrors: Record<string, string> = {};

  if (!email.trim()) {
    newErrors.email = 'Email is required';
  } else if (!/\S+@\S+\.\S+/.test(email)) {
    newErrors.email = 'Email is invalid';
  }

  if (!password) {
    newErrors.password = 'Password is required';
  } else if (password.length < 8) {
    newErrors.password = 'Password must be at least 8 characters';
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

const handleSubmit = async () => {
  if (!validate()) return;

  setLoading(true);
  try {
    await submitForm();
    toast.success('Success!');
  } catch (error) {
    toast.error('Failed to submit');
  } finally {
    setLoading(false);
  }
};

// Render
<Input
  label="Email"
  value={email}
  onChangeText={setEmail}
  errorText={errors.email}
  variant={errors.email ? 'error' : 'default'}
/>
```

### Async Actions with Loading

```tsx
const [loading, setLoading] = useState(false);

const handleAction = async () => {
  setLoading(true);
  try {
    await performAction();
    haptic.success();
    toast.success('Action completed!');
    router.push('/next');
  } catch (error) {
    haptic.error();
    toast.error('Failed to complete action');
    console.error(error);
  } finally {
    setLoading(false);
  }
};

// Render
<Button loading={loading} onPress={handleAction}>
  Submit
</Button>
```

### Real-time Subscription

```tsx
useEffect(() => {
  if (!id) return;

  const subscription = supabase
    .channel(`group-${id}`)
    .on('postgres_changes', {
      event: '*',
      schema: 'public',
      table: 'group_members',
      filter: `group_id=eq.${id}`,
    }, (payload) => {
      console.log('Member change:', payload);
      fetchMembers(); // Refresh members
    })
    .subscribe();

  return () => {
    subscription.unsubscribe();
  };
}, [id]);
```

### Error Boundary Wrapper

```tsx
import { ErrorBoundary } from '../components/feedback/ErrorBoundary';

export default function Page() {
  return (
    <ErrorBoundary>
      <YourContent />
    </ErrorBoundary>
  );
}

// Or with custom fallback
<ErrorBoundary
  fallback={(error, reset) => (
    <EmptyState
      icon="⚠️"
      title="Something Went Wrong"
      description={error.message}
      action={{ label: 'Try Again', onPress: reset }}
    />
  )}
>
  <CriticalComponent />
</ErrorBoundary>
```

---

## Accessibility Checklist

```tsx
// ✅ All interactive elements
<Pressable
  accessibilityRole="button"
  accessibilityLabel="Create a new group"
  accessibilityHint="Opens the group creation form"
>

// ✅ Images
<Image
  source={...}
  accessibilityLabel="Restaurant exterior with outdoor seating"
/>

// ✅ Decorative images (hide from screen readers)
<Image
  source={...}
  accessibilityLabel=""
  accessibilityRole="none"
/>

// ✅ Form inputs
<TextInput
  accessibilityLabel="Email address"
  accessibilityHint="Enter your email to create an account"
/>

// ✅ Loading states
<View accessibilityLabel="Loading restaurants" accessibilityRole="progressbar">
  <ActivityIndicator />
</View>

// ✅ Focus indicators (NEVER remove)
// ❌ style={{ outlineStyle: 'none' }}  // BAD!
// ✅ className="focus:border-primary focus:ring-2 ring-primary/20"  // GOOD!
```

---

## Common Mistakes to Avoid

### ❌ DON'T DO THIS

```tsx
// ❌ Hardcoded colors
<Text className="text-gray-600">Text</Text>
<View className="bg-blue-50">Content</View>
<Text style={{ color: '#4B5563' }}>Text</Text>

// ❌ Remove focus indicators
style={{ outlineStyle: 'none' }}

// ❌ Inconsistent button styles
<Pressable className="bg-secondary py-4 rounded-xl">
  <Text className="text-white text-lg">Button</Text>
</Pressable>

// ❌ Missing accessibility labels
<Pressable onPress={handlePress}>
  <FontAwesome name="close" size={20} />
</Pressable>

// ❌ Generic error messages
toast.error('Error');

// ❌ No loading states
<Pressable onPress={asyncAction}>
  <Text>Submit</Text>
</Pressable>
```

### ✅ DO THIS INSTEAD

```tsx
// ✅ Semantic colors
<Text className="text-textMuted">Text</Text>
<View className="bg-accent/10">Content</View>

// ✅ Keep focus indicators
// (Just use Tailwind focus classes, no inline styles)

// ✅ Component system
<Button variant="primary">Button</Button>

// ✅ Accessibility labels
<IconButton
  icon={<FontAwesome name="close" size={20} />}
  onPress={handlePress}
  accessibilityLabel="Close dialog"
/>

// ✅ Helpful error messages
toast.error('Failed to join group. Please check the code and try again.');

// ✅ Loading states
<Button loading={isLoading} onPress={asyncAction}>
  Submit
</Button>
```

---

## Performance Tips

```tsx
// ✅ Memoize expensive calculations
const sortedResults = useMemo(() => {
  return results.sort((a, b) => b.score - a.score);
}, [results]);

// ✅ Memoize callbacks
const handlePress = useCallback(() => {
  doSomething(value);
}, [value]);

// ✅ Memoize components
const ExpensiveComponent = memo(({ data }) => {
  return <ComplexUI data={data} />;
});

// ✅ Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

<Suspense fallback={<ActivityIndicator />}>
  {showHeavy && <HeavyComponent />}
</Suspense>

// ✅ Optimize images
import { Image } from 'expo-image';

<Image
  source={{ uri: url }}
  placeholder={blurhash}
  contentFit="cover"
  cachePolicy="memory-disk"
/>
```

---

## Testing Checklist

**Before committing:**
- [ ] No console errors
- [ ] All buttons work
- [ ] Forms validate correctly
- [ ] Loading states appear
- [ ] Error states display
- [ ] Focus indicators visible
- [ ] Keyboard navigation works
- [ ] Color contrast passes (4.5:1)
- [ ] No hardcoded colors
- [ ] Semantic colors used everywhere

**Before deploying:**
- [ ] Build succeeds
- [ ] Lighthouse score 90+
- [ ] Cross-browser tested
- [ ] Mobile responsive
- [ ] Real-time updates work
- [ ] Error boundaries catch errors
- [ ] Analytics tracking active
- [ ] SEO meta tags present

---

## File Structure Reference

```
components/
├── ui/
│   ├── Button.tsx           ✅ Create
│   ├── IconButton.tsx       ✅ Create
│   ├── Input.tsx            ✅ Create
│   ├── Card.tsx             ✅ Create
│   ├── InfoCard.tsx         ✅ Create
│   ├── Badge.tsx            ✅ Create
│   ├── Modal.tsx            ✅ Create
│   ├── Avatar.tsx           ✅ Already exists
│   ├── PriceTierSelector.tsx ✅ Already exists
│   └── DietaryTagSelector.tsx ✅ Already exists
├── feedback/
│   ├── EmptyState.tsx       ✅ Create
│   ├── ErrorBoundary.tsx    ✅ Create
│   └── LoadingSkeleton.tsx  ✅ Already exists (improve)
├── layout/
│   ├── Header.tsx           ✅ Create
│   ├── Container.tsx        ✅ Create
│   └── Stack.tsx            ✅ Create
├── navigation/
│   └── BackButton.tsx       ✅ Create
├── animations/
│   ├── ConfettiCelebration.tsx ✅ Already exists
│   └── Shimmer.tsx          ✅ Create
└── deck/
    ├── SwipeableCard.tsx    ✅ Already exists (keep as-is)
    └── RestaurantCard.tsx   ✅ Already exists
```

---

## Git Workflow

```bash
# Create feature branch
git checkout -b feature/component-system

# Make changes
git add components/ui/Button.tsx
git commit -m "Add Button component with all variants

- Primary, secondary, outline, ghost variants
- Loading state support
- Icon support (left/right)
- Accessible with ARIA labels
- Consistent with design system"

# Push and create PR
git push origin feature/component-system
```

**Commit message format:**
```
<action> <subject>

- Bullet point 1
- Bullet point 2
- Bullet point 3

🤖 Generated with [Claude Code](https://claude.com/claude-code)

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
```

---

## Need Help?

**Documentation:**
- [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md) - Complete design specification
- [COMPONENT_LIBRARY.md](COMPONENT_LIBRARY.md) - All components with examples
- [IMPLEMENTATION_ROADMAP.md](IMPLEMENTATION_ROADMAP.md) - Step-by-step guide
- [BEFORE_AFTER_GUIDE.md](BEFORE_AFTER_GUIDE.md) - Visual comparisons

**Quick Lookup:**
- Color not working? → Check DESIGN_SYSTEM.md § Color System
- Button variant? → Check COMPONENT_LIBRARY.md § Button Components
- Animation not smooth? → Check DESIGN_SYSTEM.md § Animation System
- Accessibility issue? → Check DESIGN_SYSTEM.md § Accessibility Standards

---

**End of Quick Reference Guide**

Keep this handy while implementing! Pin it in your editor or print it out.
