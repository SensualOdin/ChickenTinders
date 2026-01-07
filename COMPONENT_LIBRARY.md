# ChickenTinders Component Library
## Complete Implementation Reference

**Version:** 2.0
**Last Updated:** January 2026

This document catalogs all existing components, their variants, usage patterns, and improvement specifications.

---

## Table of Contents

1. [Component Inventory](#component-inventory)
2. [Button Components](#button-components)
3. [Form Components](#form-components)
4. [Card Components](#card-components)
5. [Navigation Components](#navigation-components)
6. [Feedback Components](#feedback-components)
7. [Animation Components](#animation-components)
8. [Layout Components](#layout-components)
9. [Page-Level Components](#page-level-components)
10. [Proposed New Components](#proposed-new-components)

---

## Component Inventory

### Current Components (Existing)

```
✅ components/ui/Avatar.tsx
✅ components/ui/LoadingSkeleton.tsx (RestaurantCardSkeleton, ResultsCardSkeleton)
✅ components/ui/PriceTierSelector.tsx
✅ components/ui/DietaryTagSelector.tsx
✅ components/ui/Slider.tsx

✅ components/deck/SwipeableCard.tsx
✅ components/deck/RestaurantCard.tsx (embedded in SwipeableCard)

✅ components/animations/ConfettiCelebration.tsx

✅ components/PhoneDemo.tsx (landing page)

❌ components/ui/Button.tsx (MISSING - using inline Pressables)
❌ components/ui/Input.tsx (MISSING - using inline TextInputs)
❌ components/ui/Card.tsx (MISSING - using inline Views)
❌ components/ui/Badge.tsx (MISSING - using inline Views)
❌ components/layout/Container.tsx (MISSING)
❌ components/feedback/Toast.tsx (using react-hot-toast directly)
❌ components/feedback/EmptyState.tsx (MISSING)
❌ components/feedback/ErrorBoundary.tsx (MISSING)
```

### Component Status
- **Production Ready:** 8 components
- **Needs Refactor:** 5 components
- **Missing Critical:** 7 components

---

## Button Components

### Current Implementation (Inline)

#### Primary Button (Create Group)
**Location:** [app/index.tsx:81-85](app/index.tsx#L81-L85)
```tsx
<Link href="/create" asChild>
  <Pressable className="bg-primary px-8 py-4 rounded-full shadow-elevated active:scale-95 active:bg-primary-dark transition-all">
    <Text className="text-surface text-base font-semibold tracking-wide">
      Create a Group →
    </Text>
  </Pressable>
</Link>
```

**Issues:**
- ✅ Good: Consistent styling, clear action, arrow indicates direction
- ⚠️ Needs: Reusable component, loading state, disabled state
- ⚠️ Needs: Hover state for web
- ⚠️ Needs: Focus visible indicator

#### Secondary Button (Outline)
**Location:** [app/index.tsx:88-94](app/index.tsx#L88-L94)
```tsx
<Link href="/join" asChild>
  <Pressable className="bg-surface border-2 border-cream-dark px-8 py-4 rounded-full active:border-primary active:bg-cream transition-all">
    <Text className="text-primary text-base font-semibold tracking-wide">
      Join with Code
    </Text>
  </Pressable>
</Link>
```

**Issues:**
- ✅ Good: Clear hierarchy, good contrast
- ⚠️ Needs: Hover should show border-primary immediately
- ⚠️ Needs: Component variant system

#### Action Button (Join Page)
**Location:** [app/join.tsx:108-124](app/join.tsx#L108-L124)
```tsx
<Pressable
  onPress={handleJoinGroup}
  disabled={loading || !groupCode.trim()}
  className={`py-4 rounded-xl items-center ${
    loading || !groupCode.trim()
      ? 'bg-gray-300'
      : 'bg-secondary active:scale-95'
  }`}
>
  {loading ? (
    <ActivityIndicator color="white" />
  ) : (
    <Text className="text-white text-lg font-bold">
      Join Group
    </Text>
  )}
</Pressable>
```

**Issues:**
- ❌ **CRITICAL:** Uses `bg-secondary` (gold) instead of `bg-primary` (burgundy)
- ✅ Good: Has loading state, disabled state
- ⚠️ Needs: Consistent with other buttons (rounded-full, not rounded-xl)
- ⚠️ Needs: gray-300 should be semantic color

### Proposed Button Component

**File:** `components/ui/Button.tsx`

**⭐ RECOMMENDED: Using Class Variance Authority (CVA)**

This implementation uses CVA for cleaner variant management. Install first:
```bash
npm install class-variance-authority
```

```tsx
import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import { Link } from 'expo-router';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

// Define button variants with CVA
const buttonVariants = cva(
  // Base styles (always applied)
  'rounded-full shadow-elevated active:scale-95 transition-all flex-row items-center justify-center gap-2',
  {
    variants: {
      variant: {
        primary: 'bg-primary active:bg-primary-dark',
        secondary: 'bg-secondary active:bg-secondary-dark',
        outline: 'bg-surface border-2 border-primary active:bg-cream active:border-primary-dark',
        ghost: 'bg-transparent active:bg-cream-dark',
        danger: 'bg-error active:bg-error-dark',
      },
      size: {
        sm: 'px-5 py-2.5',
        md: 'px-8 py-4',
        lg: 'px-10 py-5',
      },
      fullWidth: {
        true: 'w-full',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'md',
    },
  }
);

const textVariants = cva('font-semibold tracking-wide', {
  variants: {
    variant: {
      primary: 'text-surface',
      secondary: 'text-charcoal',
      outline: 'text-primary',
      ghost: 'text-textDark',
      danger: 'text-surface',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'md',
  },
});

interface ButtonProps extends VariantProps<typeof buttonVariants> {
  // Content
  children: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  // Behavior
  onPress?: () => void | Promise<void>;
  href?: string;
  disabled?: boolean;
  loading?: boolean;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;

  // Custom class override
  className?: string;
}

export function Button({
  children,
  leftIcon,
  rightIcon,
  onPress,
  href,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth,
  accessibilityLabel,
  accessibilityHint,
  className,
}: ButtonProps) {
  const content = (
    <>
      {loading ? (
        <ActivityIndicator
          testID="button-loading-spinner"
          color={variant === 'outline' || variant === 'ghost' ? '#A91D3A' : '#FFFFFF'}
        />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          <Text className={cn(textVariants({ variant, size }))}>
            {children}
          </Text>
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
    </>
  );

  const pressableClassName = cn(
    buttonVariants({ variant, size, fullWidth }),
    (disabled || loading) && 'opacity-50',
    className
  );

  // If href provided, wrap in Link
  if (href && !disabled && !loading) {
    return (
      <Link href={href} asChild>
        <Pressable
          className={pressableClassName}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel || children}
          accessibilityHint={accessibilityHint}
        >
          {content}
        </Pressable>
      </Link>
    );
  }

  // Standard button
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={pressableClassName}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || children}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {content}
    </Pressable>
  );
}
```

**Benefits of CVA approach:**
- ✅ Type-safe variants
- ✅ Cleaner than nested ternaries
- ✅ Easy to add new variants
- ✅ Better autocomplete in IDE
- ✅ Industry standard (shadcn/ui pattern)

---

### Alternative: Without CVA (Basic Version)

If you prefer not to use CVA, here's the basic implementation:

```tsx
import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import { Link } from 'expo-router';
import { cn } from '../../lib/utils';

type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
type ButtonSize = 'sm' | 'md' | 'lg';

interface ButtonProps {
  // Content
  children: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;

  // Behavior
  onPress?: () => void | Promise<void>;
  href?: string; // For Link integration
  disabled?: boolean;
  loading?: boolean;

  // Style
  variant?: ButtonVariant;
  size?: ButtonSize;
  fullWidth?: boolean;

  // Accessibility
  accessibilityLabel?: string;
  accessibilityHint?: string;
}

export function Button({
  children,
  leftIcon,
  rightIcon,
  onPress,
  href,
  disabled = false,
  loading = false,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  accessibilityLabel,
  accessibilityHint,
}: ButtonProps) {
  // Variant styles
  const variantStyles = {
    primary: 'bg-primary active:bg-primary-dark',
    secondary: 'bg-secondary active:bg-secondary-dark',
    outline: 'bg-surface border-2 border-primary active:bg-cream active:border-primary-dark',
    ghost: 'bg-transparent active:bg-cream-dark',
    danger: 'bg-error active:bg-error-dark',
  };

  const textVariantStyles = {
    primary: 'text-surface',
    secondary: 'text-charcoal',
    outline: 'text-primary',
    ghost: 'text-textDark',
    danger: 'text-surface',
  };

  // Size styles
  const sizeStyles = {
    sm: 'px-5 py-2.5',
    md: 'px-8 py-4',
    lg: 'px-10 py-5',
  };

  const textSizeStyles = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  // Combined className
  const buttonClassName = `
    ${variantStyles[variant]}
    ${sizeStyles[size]}
    rounded-full
    shadow-elevated
    active:scale-95
    transition-all
    flex-row
    items-center
    justify-center
    gap-2
    ${fullWidth ? 'w-full' : ''}
    ${disabled || loading ? 'opacity-50' : ''}
  `.trim();

  const content = (
    <>
      {loading ? (
        <ActivityIndicator
          color={variant === 'outline' || variant === 'ghost' ? '#A91D3A' : '#FFFFFF'}
        />
      ) : (
        <>
          {leftIcon && <View>{leftIcon}</View>}
          <Text className={`${textVariantStyles[variant]} ${textSizeStyles[size]} font-semibold tracking-wide`}>
            {children}
          </Text>
          {rightIcon && <View>{rightIcon}</View>}
        </>
      )}
    </>
  );

  // If href provided, wrap in Link
  if (href && !disabled && !loading) {
    return (
      <Link href={href} asChild>
        <Pressable
          className={buttonClassName}
          accessibilityRole="button"
          accessibilityLabel={accessibilityLabel || children}
          accessibilityHint={accessibilityHint}
        >
          {content}
        </Pressable>
      </Link>
    );
  }

  // Standard button
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      className={buttonClassName}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || children}
      accessibilityHint={accessibilityHint}
      accessibilityState={{ disabled: disabled || loading }}
    >
      {content}
    </Pressable>
  );
}
```

### Usage Examples

```tsx
// Primary CTA
<Button href="/create" rightIcon={<Text>→</Text>}>
  Create a Group
</Button>

// Secondary outline
<Button href="/join" variant="outline">
  Join with Code
</Button>

// With loading state
<Button
  onPress={handleSubmit}
  loading={isSubmitting}
  disabled={!isValid}
>
  Submit
</Button>

// Ghost button
<Button variant="ghost" size="sm" onPress={() => router.push('/my-groups')}>
  My Groups
</Button>

// Full width
<Button fullWidth variant="primary">
  Get Started
</Button>
```

### Icon Button Component

**File:** `components/ui/IconButton.tsx`

```tsx
interface IconButtonProps {
  icon: React.ReactNode;
  onPress: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'primary' | 'ghost';
  accessibilityLabel: string;
}

export function IconButton({
  icon,
  onPress,
  size = 'md',
  variant = 'default',
  accessibilityLabel,
}: IconButtonProps) {
  const sizeStyles = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12',
  };

  const variantStyles = {
    default: 'bg-surface border border-gray-100',
    primary: 'bg-primary',
    ghost: 'bg-transparent',
  };

  return (
    <Pressable
      onPress={onPress}
      className={`
        ${sizeStyles[size]}
        ${variantStyles[variant]}
        rounded-full
        items-center
        justify-center
        active:scale-95
        shadow-soft
      `}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel}
    >
      {icon}
    </Pressable>
  );
}
```

**Usage:**
```tsx
// Back button
<IconButton
  icon={<FontAwesome name="chevron-left" size={16} color="#4B5563" />}
  onPress={() => router.back()}
  accessibilityLabel="Go back"
/>

// Close modal
<IconButton
  icon={<FontAwesome name="times" size={18} color="white" />}
  variant="primary"
  size="sm"
  onPress={handleClose}
  accessibilityLabel="Close dialog"
/>
```

---

## Form Components

### Current Implementation (Inline)

#### Text Input (Join Page)
**Location:** [app/join.tsx:90-104](app/join.tsx#L90-L104)
```tsx
<View className="mb-6">
  <Text className="text-sm font-semibold text-textDark mb-2">
    Group Code
  </Text>
  <TextInput
    value={groupCode}
    onChangeText={setGroupCode}
    placeholder="e.g., CHKN22"
    placeholderTextColor="#9CA3AF"
    autoCapitalize="characters"
    maxLength={6}
    className="bg-white border-2 border-gray-200 rounded-xl px-4 py-4 text-lg font-mono text-textDark focus:border-primary"
    style={{
      outlineStyle: 'none', // ❌ REMOVES FOCUS INDICATOR
    }}
  />
  <Text className="text-xs text-gray-500 mt-1">
    Ask your friend for the group code
  </Text>
</View>
```

**Issues:**
- ❌ **CRITICAL:** `outlineStyle: 'none'` removes focus indicator (accessibility violation)
- ❌ Uses hardcoded `gray-200`, `gray-500` instead of semantic colors
- ⚠️ Inconsistent rounded corners (`rounded-xl` vs `rounded-2xl` elsewhere)
- ✅ Good: Label, placeholder, helper text

### Proposed Input Component

**File:** `components/ui/Input.tsx`

```tsx
import { View, Text, TextInput, type TextInputProps } from 'react-native';
import { useState } from 'react';

interface InputProps extends Omit<TextInputProps, 'className'> {
  label?: string;
  helperText?: string;
  errorText?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  variant?: 'default' | 'error';
  containerClassName?: string;
}

export function Input({
  label,
  helperText,
  errorText,
  leftIcon,
  rightIcon,
  variant = 'default',
  containerClassName,
  ...textInputProps
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const hasError = !!errorText || variant === 'error';

  const borderColor = hasError
    ? 'border-error'
    : isFocused
    ? 'border-primary'
    : 'border-cream-dark';

  return (
    <View className={containerClassName}>
      {/* Label */}
      {label && (
        <Text className="text-sm font-semibold text-textDark mb-2 uppercase tracking-wide">
          {label}
        </Text>
      )}

      {/* Input Container */}
      <View className={`
        flex-row
        items-center
        bg-surface
        border-2
        ${borderColor}
        rounded-xl
        px-4
        ${isFocused ? 'ring-2 ring-primary/20' : ''}
      `}>
        {leftIcon && (
          <View className="mr-2">{leftIcon}</View>
        )}

        <TextInput
          {...textInputProps}
          onFocus={(e) => {
            setIsFocused(true);
            textInputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            textInputProps.onBlur?.(e);
          }}
          placeholderTextColor="#9B7653"
          className="flex-1 py-4 text-base text-textDark"
        />

        {rightIcon && (
          <View className="ml-2">{rightIcon}</View>
        )}
      </View>

      {/* Helper/Error Text */}
      {(helperText || errorText) && (
        <Text className={`text-xs mt-1 ${hasError ? 'text-error' : 'text-textMuted'}`}>
          {errorText || helperText}
        </Text>
      )}
    </View>
  );
}
```

**Usage:**
```tsx
// Basic input
<Input
  label="Display Name"
  placeholder="Enter your name"
  value={name}
  onChangeText={setName}
  helperText="This is how others will see you"
/>

// Error state
<Input
  label="Group Code"
  placeholder="CHKN22"
  value={code}
  onChangeText={setCode}
  variant="error"
  errorText="Invalid group code"
/>

// With icons
<Input
  label="Search"
  placeholder="Find restaurants..."
  leftIcon={<FontAwesome name="search" size={16} color="#6B4423" />}
  rightIcon={
    <Pressable onPress={clearSearch}>
      <FontAwesome name="times-circle" size={16} color="#9B7653" />
    </Pressable>
  }
/>
```

### Existing: PriceTierSelector.tsx ✅

**Location:** `components/ui/PriceTierSelector.tsx`

**Current State:** Production-ready

**Features:**
- Visual price tier selection ($, $$, $$$, $$$$)
- Active state highlighting
- Accessible labels
- Consistent styling

**Improvements Needed:**
```tsx
// Add keyboard navigation
const handleKeyPress = (key: string, tier: number) => {
  if (key === 'Enter' || key === ' ') {
    onSelect(tier);
  }
};

// Add focus visible
<Pressable
  className={`... ${isFocused ? 'ring-2 ring-primary' : ''}`}
  onFocus={() => setFocused(true)}
  onBlur={() => setFocused(false)}
/>
```

### Existing: DietaryTagSelector.tsx ✅

**Location:** `components/ui/DietaryTagSelector.tsx`

**Current State:** Production-ready

**Features:**
- Multi-select tags with emoji
- Visual selected state
- Wrapping layout

**Improvements Needed:**
```tsx
// Add "deselect all" option
<Pressable
  onPress={() => onTagsChange([])}
  className="px-3 py-1.5 rounded-full border-2 border-textMuted"
>
  <Text className="text-sm text-textMuted">Clear All</Text>
</Pressable>

// Add popular tags section
<View>
  <Text className="text-xs font-semibold text-textMuted mb-2">POPULAR</Text>
  {/* Popular tags */}
</View>
```

### Proposed: Select Component

**File:** `components/ui/Select.tsx`

```tsx
interface SelectProps {
  label?: string;
  value: string;
  options: Array<{ label: string; value: string }>;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function Select({ label, value, options, onChange, placeholder }: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(opt => opt.value === value);

  return (
    <View>
      {label && (
        <Text className="text-sm font-semibold text-textDark mb-2 uppercase tracking-wide">
          {label}
        </Text>
      )}

      <Pressable
        onPress={() => setIsOpen(!isOpen)}
        className="bg-surface border-2 border-cream-dark rounded-xl px-4 py-4 flex-row items-center justify-between"
      >
        <Text className={`text-base ${selectedOption ? 'text-textDark' : 'text-textMuted'}`}>
          {selectedOption?.label || placeholder || 'Select...'}
        </Text>
        <FontAwesome
          name={isOpen ? 'chevron-up' : 'chevron-down'}
          size={14}
          color="#6B4423"
        />
      </Pressable>

      {/* Dropdown menu */}
      {isOpen && (
        <View className="absolute top-full left-0 right-0 mt-2 bg-surface rounded-xl shadow-elevated z-50 max-h-60 overflow-scroll">
          {options.map((option) => (
            <Pressable
              key={option.value}
              onPress={() => {
                onChange(option.value);
                setIsOpen(false);
              }}
              className={`
                px-4 py-3 border-b border-cream-dark
                ${option.value === value ? 'bg-primary/10' : 'active:bg-cream'}
              `}
            >
              <Text className={`text-base ${option.value === value ? 'text-primary font-semibold' : 'text-textDark'}`}>
                {option.label}
              </Text>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
}
```

---

## Card Components

### Current Implementation (Inline)

#### Standard Card (How It Works)
**Location:** [app/index.tsx:158-174](app/index.tsx#L158-L174)
```tsx
<View className="bg-cream rounded-3xl p-10 items-center max-w-xs hover:transform hover:-translate-y-2 transition-all">
  <View className="w-12 h-12 bg-primary rounded-full items-center justify-center mb-6">
    <Text className="text-xl font-bold text-surface" style={{ fontFamily: 'Fraunces' }}>
      1
    </Text>
  </View>
  <Text className="text-5xl mb-6">👥</Text>
  <Text className="text-xl font-semibold text-charcoal mb-3 text-center" style={{ fontFamily: 'Fraunces' }}>
    Create Your Group
  </Text>
  <Text className="text-base text-textMuted text-center leading-relaxed">
    Start a session and share the code with your hungry friends...
  </Text>
</View>
```

**Issues:**
- ✅ Good: Excellent visual hierarchy, generous padding
- ⚠️ Needs: Extract to StepCard component
- ⚠️ Needs: Animation on scroll (IntersectionObserver)

#### Info Card (Join Page)
**Location:** [app/join.tsx:150-160](app/join.tsx#L150-L160)
```tsx
<View className="mt-8 bg-blue-50 border border-blue-200 rounded-xl p-4">
  <Text className="text-sm text-blue-900 font-semibold mb-2">
    💡 How it works
  </Text>
  <Text className="text-sm text-blue-800">
    1. Get the 6-character code from your friend{'\n'}
    2. Enter it above to join their group{'\n'}
    3. Enter your name in the lobby{'\n'}
    4. Start swiping when everyone's ready!
  </Text>
</View>
```

**Issues:**
- ❌ **CRITICAL:** Uses `blue-50`, `blue-200`, `blue-800`, `blue-900` (hardcoded, not semantic)
- ⚠️ Should use `accent` color system instead
- ⚠️ Icon should be dynamic based on type

### Proposed Card Component

**File:** `components/ui/Card.tsx`

```tsx
interface CardProps {
  children: React.ReactNode;
  variant?: 'default' | 'elevated' | 'outlined';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  rounded?: 'md' | 'lg' | 'xl' | '2xl' | '3xl';
  onPress?: () => void;
}

export function Card({
  children,
  variant = 'default',
  padding = 'md',
  rounded = '2xl',
  onPress,
}: CardProps) {
  const variantStyles = {
    default: 'bg-surface shadow-soft',
    elevated: 'bg-surface shadow-elevated',
    outlined: 'bg-surface border-2 border-cream-dark',
  };

  const paddingStyles = {
    none: '',
    sm: 'p-4',
    md: 'p-6',
    lg: 'p-8',
  };

  const roundedStyles = {
    md: 'rounded-xl',
    lg: 'rounded-xl',
    xl: 'rounded-2xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
  };

  const className = `
    ${variantStyles[variant]}
    ${paddingStyles[padding]}
    ${roundedStyles[rounded]}
    ${onPress ? 'active:scale-98' : ''}
  `;

  if (onPress) {
    return (
      <Pressable onPress={onPress} className={className}>
        {children}
      </Pressable>
    );
  }

  return <View className={className}>{children}</View>;
}
```

### Proposed InfoCard Component

**File:** `components/ui/InfoCard.tsx`

```tsx
type InfoCardType = 'info' | 'success' | 'warning' | 'error';

interface InfoCardProps {
  type?: InfoCardType;
  title?: string;
  children: React.ReactNode;
  icon?: string;
}

export function InfoCard({
  type = 'info',
  title,
  children,
  icon,
}: InfoCardProps) {
  const typeStyles = {
    info: {
      bg: 'bg-accent/10',
      border: 'border-accent',
      titleColor: 'text-accent-dark',
      textColor: 'text-textDark',
      defaultIcon: '💡',
    },
    success: {
      bg: 'bg-success/10',
      border: 'border-success',
      titleColor: 'text-success-dark',
      textColor: 'text-textDark',
      defaultIcon: '✅',
    },
    warning: {
      bg: 'bg-warning/10',
      border: 'border-warning',
      titleColor: 'text-warning-dark',
      textColor: 'text-textDark',
      defaultIcon: '⚠️',
    },
    error: {
      bg: 'bg-error/10',
      border: 'border-error',
      titleColor: 'text-error-dark',
      textColor: 'text-textDark',
      defaultIcon: '❌',
    },
  };

  const styles = typeStyles[type];

  return (
    <View className={`${styles.bg} border-2 ${styles.border} rounded-xl p-4`}>
      {title && (
        <Text className={`text-sm font-semibold ${styles.titleColor} mb-2`}>
          {icon || styles.defaultIcon} {title}
        </Text>
      )}
      <View className={`text-sm ${styles.textColor}`}>
        {children}
      </View>
    </View>
  );
}
```

**Usage:**
```tsx
// Info tip
<InfoCard type="info" title="How it works">
  <Text className="text-sm">
    1. Get the 6-character code{'\n'}
    2. Enter it above{'\n'}
    3. Start swiping!
  </Text>
</InfoCard>

// Success message
<InfoCard type="success" title="Account created!">
  <Text className="text-sm">
    Your account has been created successfully.
  </Text>
</InfoCard>

// Warning
<InfoCard type="warning" title="Limited availability">
  <Text className="text-sm">
    Only 2 spots left in this group.
  </Text>
</InfoCard>
```

### Existing: SwipeableCard.tsx ✅

**Location:** `components/deck/SwipeableCard.tsx`

**Current State:** Production-ready, excellent implementation

**Features:**
- Smooth pan gestures with react-native-reanimated
- Rotation on swipe
- Like/Dislike/SuperLike overlays
- Spring animations on release
- Haptic feedback integration

**No changes needed** - This is reference-quality code.

---

## Navigation Components

### Current Implementation

#### Header Navigation (Landing Page)
**Location:** [app/index.tsx:14-49](app/index.tsx#L14-L49)
```tsx
<View className="w-full max-w-app mx-auto">
  <View className="flex-row justify-between items-center px-8 pt-5 pb-3 bg-cream/95">
    <Pressable onPress={() => router.push('/')} className="flex-row items-center gap-3">
      <Image source={require('../assets/images/icon.png')} style={{ width: 44, height: 44 }} />
      <Text className="text-xl font-semibold text-primary" style={{ fontFamily: 'Fraunces' }}>
        Chicken Tinders
      </Text>
    </Pressable>

    <View className="flex-row gap-3">
      {!isGuest && user && (
        <Pressable onPress={() => router.push('/my-groups')} className="bg-transparent px-5 py-2.5 rounded-full">
          <Text className="text-sm font-semibold text-textDark tracking-wide">
            My Groups
          </Text>
        </Pressable>
      )}
      <Pressable onPress={() => router.push('/account')} className="bg-surface border-2 border-primary px-5 py-2.5 rounded-full">
        <Text className="text-sm font-semibold text-primary tracking-wide">
          {!isGuest && profile ? profile.display_name : 'Sign In'}
        </Text>
      </Pressable>
    </View>
  </View>
</View>
```

**Issues:**
- ✅ Good: Clean layout, conditional rendering
- ⚠️ Needs: Extract to Header component
- ⚠️ Needs: Mobile menu for responsive

#### Back Button Pattern
**Location:** Multiple files (join.tsx, account.tsx, etc.)
```tsx
<Pressable onPress={() => router.push('/')} className="mb-4">
  <Text className="text-primary text-base font-semibold">← Back to Home</Text>
</Pressable>
```

**Issues:**
- ⚠️ Inconsistent: Some use `router.back()`, some use `router.push('/')`
- ⚠️ Needs: Standardized BackButton component
- ⚠️ Needs: Icon button variant (currently text-based)

### Proposed Header Component

**File:** `components/layout/Header.tsx`

```tsx
interface HeaderProps {
  variant?: 'landing' | 'app';
  showLogo?: boolean;
  title?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}

export function Header({
  variant = 'app',
  showLogo = true,
  title,
  leftAction,
  rightAction,
}: HeaderProps) {
  const router = useRouter();
  const { user, profile, isGuest } = useAuth();

  if (variant === 'landing') {
    return (
      <View className="w-full max-w-app mx-auto">
        <View className="flex-row justify-between items-center px-8 pt-5 pb-3 bg-cream/95 backdrop-blur-sm">
          {/* Logo */}
          <Pressable
            onPress={() => router.push('/')}
            className="flex-row items-center gap-3 active:scale-95"
          >
            <Image
              source={require('../../assets/images/icon.png')}
              style={{ width: 44, height: 44 }}
              accessibilityLabel="ChickenTinders logo"
            />
            {showLogo && (
              <Text
                className="text-xl font-semibold text-primary"
                style={{ fontFamily: 'Fraunces' }}
              >
                Chicken Tinders
              </Text>
            )}
          </Pressable>

          {/* Right Actions */}
          <View className="flex-row gap-3">
            {!isGuest && user && (
              <Button variant="ghost" size="sm" href="/my-groups">
                My Groups
              </Button>
            )}
            <Button variant="outline" size="sm" href="/account">
              {!isGuest && profile ? profile.display_name : 'Sign In'}
            </Button>
          </View>
        </View>
      </View>
    );
  }

  // App header (with back button)
  return (
    <View className="bg-surface border-b border-cream-dark px-4 py-4">
      <View className="max-w-app mx-auto w-full flex-row items-center justify-between">
        {leftAction || (
          <IconButton
            icon={<FontAwesome name="chevron-left" size={16} color="#4B5563" />}
            onPress={() => router.back()}
            accessibilityLabel="Go back"
          />
        )}

        {title && (
          <Text className="text-lg font-semibold text-textDark">
            {title}
          </Text>
        )}

        {rightAction || <View style={{ width: 40 }} />}
      </View>
    </View>
  );
}
```

**Usage:**
```tsx
// Landing page header
<Header variant="landing" />

// App page with back button
<Header title="Create Group" />

// Custom actions
<Header
  leftAction={<IconButton icon={...} onPress={handleClose} />}
  rightAction={<Button variant="ghost">Save</Button>}
/>
```

---

## Feedback Components

### Current Implementation

#### Toast Messages (using react-hot-toast)
**Location:** Multiple files
```tsx
toast.success('🎉 Matches found!');
toast.error('Failed to join group');
toast('Coming soon!', { icon: '🚧' });
```

**Issues:**
- ✅ Good: Simple, works well
- ⚠️ Needs: Consistent styling to match brand
- ⚠️ Needs: Action buttons in toasts (Undo, Retry)

#### Loading States
**Location:** [components/ui/LoadingSkeleton.tsx](components/ui/LoadingSkeleton.tsx)

**Current:**
```tsx
export function RestaurantCardSkeleton() {
  return (
    <View className="bg-white rounded-2xl overflow-hidden shadow-card">
      <View className="w-full h-48 bg-gray-200 animate-pulse" />
      <View className="p-6">
        <View className="h-6 bg-gray-200 rounded w-3/4 mb-3 animate-pulse" />
        <View className="h-4 bg-gray-200 rounded w-1/2 animate-pulse" />
      </View>
    </View>
  );
}
```

**Issues:**
- ⚠️ Uses `gray-200` (hardcoded)
- ⚠️ Needs shimmer animation (not just pulse)
- ⚠️ Should match semantic colors

### Proposed EmptyState Component

**File:** `components/feedback/EmptyState.tsx`

```tsx
interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  secondaryAction?: {
    label: string;
    onPress: () => void;
  };
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-4 py-16">
      <Text className="text-6xl mb-4">{icon}</Text>

      <Text
        className="text-2xl font-bold text-textDark mb-2 text-center"
        style={{ fontFamily: 'Fraunces' }}
      >
        {title}
      </Text>

      <Text className="text-base text-textMuted text-center mb-8 max-w-sm leading-relaxed">
        {description}
      </Text>

      {action && (
        <Button onPress={action.onPress} variant="primary">
          {action.label}
        </Button>
      )}

      {secondaryAction && (
        <Button
          onPress={secondaryAction.onPress}
          variant="ghost"
          size="sm"
          className="mt-3"
        >
          {secondaryAction.label}
        </Button>
      )}
    </View>
  );
}
```

**Usage:**
```tsx
// No restaurants found
<EmptyState
  icon="😕"
  title="No Restaurants Found"
  description="We couldn't find any restaurants in your area. Try widening your search radius or adjusting your filters."
  action={{
    label: 'Adjust Filters',
    onPress: () => router.back(),
  }}
  secondaryAction={{
    label: 'Start Over',
    onPress: () => router.push('/'),
  }}
/>

// No saved groups yet
<EmptyState
  icon="📂"
  title="No Saved Groups Yet"
  description="Save your favorite group configurations to quickly start new sessions with the same preferences."
  action={{
    label: 'Create Your First Group',
    onPress: () => router.push('/my-groups/create'),
  }}
/>
```

### Proposed ErrorBoundary Component

**File:** `components/feedback/ErrorBoundary.tsx`

```tsx
import React from 'react';
import { View, Text, Pressable } from 'react-native';

interface ErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: (error: Error, reset: () => void) => React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('ErrorBoundary caught error:', error, errorInfo);
  }

  reset = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError && this.state.error) {
      if (this.props.fallback) {
        return this.props.fallback(this.state.error, this.reset);
      }

      return (
        <View className="flex-1 items-center justify-center px-4 bg-background">
          <Text className="text-6xl mb-4">⚠️</Text>
          <Text
            className="text-2xl font-bold text-textDark mb-2 text-center"
            style={{ fontFamily: 'Fraunces' }}
          >
            Something Went Wrong
          </Text>
          <Text className="text-base text-textMuted text-center mb-8 max-w-sm">
            We encountered an unexpected error. Please try again or contact support if the problem persists.
          </Text>
          <Pressable
            onPress={this.reset}
            className="bg-primary px-8 py-4 rounded-full active:scale-95"
          >
            <Text className="text-surface font-semibold">Try Again</Text>
          </Pressable>
        </View>
      );
    }

    return this.props.children;
  }
}
```

**Usage:**
```tsx
// Wrap app or specific routes
<ErrorBoundary>
  <YourApp />
</ErrorBoundary>

// Custom fallback
<ErrorBoundary
  fallback={(error, reset) => (
    <CustomErrorView error={error} onReset={reset} />
  )}
>
  <CriticalComponent />
</ErrorBoundary>
```

---

## Animation Components

### Existing: ConfettiCelebration.tsx ✅

**Location:** `components/animations/ConfettiCelebration.tsx`

**Current State:** Production-ready

**Features:**
- 30 confetti pieces
- Staggered delays
- Rotate + fall + fade animations
- Positioned absolutely

**Improvements:**
```tsx
// Add brand colors (burgundy + gold)
const CONFETTI_COLORS = [
  '#A91D3A', // burgundy
  '#FFB800', // gold
  '#FF6B35', // coral
  '#4CAF50', // sage
  '#FFF5E1', // cream
];

// Randomize shapes (circles, squares, triangles)
const shapes = ['●', '■', '▲'];
```

### Proposed: Sparkle Animation

**File:** `components/animations/Sparkle.tsx`

```tsx
interface SparkleProps {
  count?: number;
  duration?: number;
}

export function Sparkle({ count = 12, duration = 1000 }: SparkleProps) {
  return (
    <View className="absolute inset-0 pointer-events-none">
      {Array.from({ length: count }).map((_, i) => {
        const angle = (360 / count) * i;
        const delay = (duration / count) * i;

        return (
          <Animated.View
            key={i}
            className="absolute"
            style={{
              left: '50%',
              top: '50%',
              transform: [
                { translateX: -4 },
                { translateY: -4 },
              ],
            }}
          >
            <Animated.Text
              className="text-gold text-xs"
              style={{
                animationDelay: `${delay}ms`,
              }}
            >
              ✨
            </Animated.Text>
          </Animated.View>
        );
      })}
    </View>
  );
}
```

### Proposed: Shimmer Loading

**File:** `components/animations/Shimmer.tsx`

```tsx
export function Shimmer({ width, height }: { width: number | string; height: number }) {
  return (
    <View
      className="overflow-hidden bg-gray-100 rounded"
      style={{ width, height }}
    >
      <Animated.View
        className="h-full w-full bg-gradient-to-r from-transparent via-white/60 to-transparent"
        style={{
          animation: 'shimmer 2s infinite',
        }}
      />
    </View>
  );
}

// Add to tailwind.config.js
keyframes: {
  shimmer: {
    '0%': { transform: 'translateX(-100%)' },
    '100%': { transform: 'translateX(100%)' },
  },
}
```

**Usage:**
```tsx
// Loading skeleton with shimmer
<View className="bg-surface rounded-2xl p-6">
  <Shimmer width="75%" height={24} />
  <View className="h-3" />
  <Shimmer width="50%" height={16} />
</View>
```

---

## Layout Components

### Proposed: Container Component

**File:** `components/layout/Container.tsx`

```tsx
interface ContainerProps {
  children: React.ReactNode;
  maxWidth?: 'app' | 'prose' | 'full';
  padding?: boolean;
  className?: string;
}

export function Container({
  children,
  maxWidth = 'app',
  padding = true,
  className = '',
}: ContainerProps) {
  const maxWidthStyles = {
    app: 'max-w-app',
    prose: 'max-w-prose',
    full: 'w-full',
  };

  return (
    <View
      className={`
        ${maxWidthStyles[maxWidth]}
        mx-auto
        w-full
        ${padding ? 'px-4 md:px-8' : ''}
        ${className}
      `}
    >
      {children}
    </View>
  );
}
```

### Proposed: Stack Component

**File:** `components/layout/Stack.tsx`

```tsx
interface StackProps {
  children: React.ReactNode;
  gap?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  direction?: 'vertical' | 'horizontal';
  align?: 'start' | 'center' | 'end' | 'stretch';
  justify?: 'start' | 'center' | 'end' | 'between' | 'around';
}

export function Stack({
  children,
  gap = 'md',
  direction = 'vertical',
  align = 'stretch',
  justify = 'start',
}: StackProps) {
  const gapStyles = {
    xs: 'gap-1',
    sm: 'gap-2',
    md: 'gap-4',
    lg: 'gap-6',
    xl: 'gap-8',
  };

  const alignStyles = {
    start: 'items-start',
    center: 'items-center',
    end: 'items-end',
    stretch: 'items-stretch',
  };

  const justifyStyles = {
    start: 'justify-start',
    center: 'justify-center',
    end: 'justify-end',
    between: 'justify-between',
    around: 'justify-around',
  };

  return (
    <View
      className={`
        ${direction === 'vertical' ? 'flex-col' : 'flex-row'}
        ${gapStyles[gap]}
        ${alignStyles[align]}
        ${justifyStyles[justify]}
      `}
    >
      {children}
    </View>
  );
}
```

**Usage:**
```tsx
// Vertical stack with medium gap
<Stack gap="md">
  <Text>Item 1</Text>
  <Text>Item 2</Text>
  <Text>Item 3</Text>
</Stack>

// Horizontal row with space between
<Stack direction="horizontal" justify="between" align="center">
  <Text>Left</Text>
  <Button>Right</Button>
</Stack>
```

---

## Proposed New Components

### 1. Modal/Dialog Component

**File:** `components/ui/Modal.tsx`

**Purpose:** Consistent modals for confirmations, forms, alerts

**Features:**
- Overlay backdrop
- Slide-up animation
- Close on backdrop press (optional)
- Keyboard dismissal
- Focus trap

### 2. BottomSheet Component

**File:** `components/ui/BottomSheet.tsx`

**Purpose:** Mobile-friendly action sheets

**Features:**
- Drag to dismiss
- Snap points
- Backdrop overlay
- Native feel

### 3. ProgressIndicator Component

**File:** `components/feedback/ProgressIndicator.tsx`

**Purpose:** Show progress through multi-step flows

**Features:**
- Step indicators
- Current step highlight
- Completed step checkmarks
- Labels

### 4. Tooltip Component

**File:** `components/ui/Tooltip.tsx`

**Purpose:** Contextual help

**Features:**
- Positioned relative to trigger
- Arrow pointer
- Auto-dismiss after delay
- Accessible (focus/hover)

### 5. Badge Component

**File:** `components/ui/Badge.tsx`

**Purpose:** Status indicators, counts, labels

**Features:**
- Various colors (success, warning, error, neutral)
- Sizes (sm, md, lg)
- Dot variant
- Notification count

---

## Component Audit Summary

### Priority 1: Create Missing Core Components
1. ✅ Button.tsx (most used, highest impact)
2. ✅ Input.tsx (consistency + accessibility)
3. ✅ Card.tsx (DRY principle)
4. ✅ InfoCard.tsx (fixes hardcoded colors)
5. ✅ EmptyState.tsx (better UX)

### Priority 2: Refactor Existing Inline Components
1. Header (used on every page)
2. BackButton (standardize navigation)
3. LoadingSkeleton (add shimmer, semantic colors)

### Priority 3: New Components for Enhanced UX
1. Modal/Dialog
2. BottomSheet
3. ProgressIndicator
4. Tooltip
5. Badge

---

**End of Component Library Documentation**
