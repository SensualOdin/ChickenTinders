import { View, Text, TextInput, TextInputProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { colors } from '../../lib/designTokens';
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect } from 'react';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

const inputVariants = cva(
  'bg-surface-card border-2 rounded-xl px-4 py-4 text-lg text-text-body transition-colors',
  {
    variants: {
      variant: {
        default: 'border-neutral-gray200 focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20',
        error: 'border-feedback-error focus:border-feedback-error focus:ring-2 focus:ring-feedback-error/20',
      },
      size: {
        sm: 'px-3 py-2 text-sm',
        md: 'px-4 py-3 text-base',
        lg: 'px-4 py-4 text-lg',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'lg',
    },
  }
);

export interface InputProps extends Omit<TextInputProps, 'className'> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: keyof typeof FontAwesome.glyphMap;
  rightIcon?: keyof typeof FontAwesome.glyphMap;
  size?: 'sm' | 'md' | 'lg';
  required?: boolean;
  className?: string;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  size = 'lg',
  required = false,
  className,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const borderScale = useSharedValue(1);
  const glowOpacity = useSharedValue(0);

  const variant = error ? 'error' : 'default';

  useEffect(() => {
    if (isFocused) {
      borderScale.value = withSpring(1.01, { damping: 15, stiffness: 150 });
      glowOpacity.value = withSpring(1, { damping: 15, stiffness: 150 });
    } else {
      borderScale.value = withSpring(1, { damping: 15, stiffness: 150 });
      glowOpacity.value = withSpring(0, { damping: 15, stiffness: 150 });
    }
  }, [isFocused]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    transform: [{ scale: borderScale.value }],
  }));

  const animatedGlowStyle = useAnimatedStyle(() => ({
    opacity: glowOpacity.value,
  }));

  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-semibold text-text-display mb-2">
          {label}{required && <Text className="text-feedback-error"> *</Text>}
        </Text>
      )}

      <Animated.View style={animatedContainerStyle} className="relative">
        {/* Focus glow effect */}
        <Animated.View
          style={animatedGlowStyle}
          className="absolute inset-0 -m-1 rounded-xl pointer-events-none"
          pointerEvents="none"
        >
          <View className="absolute inset-0 rounded-xl bg-brand-primary/10" />
        </Animated.View>

        {leftIcon && (
          <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <FontAwesome
              name={leftIcon}
              size={size === 'sm' ? 14 : size === 'md' ? 16 : 18}
              color={colors.text.muted}
            />
          </View>
        )}

        <TextInput
          {...props}
          onFocus={(e) => {
            setIsFocused(true);
            props.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            props.onBlur?.(e);
          }}
          placeholderTextColor={colors.text.muted}
          accessibilityLabel={props.accessibilityLabel || label}
          accessibilityRequired={required}
          accessibilityInvalid={!!error}
          className={cn(
            inputVariants({ variant, size }),
            leftIcon && 'pl-12',
            rightIcon && 'pr-12',
            className
          )}
        />

        {rightIcon && (
          <View className="absolute right-4 top-1/2 -translate-y-1/2 z-10">
            <FontAwesome
              name={rightIcon}
              size={size === 'sm' ? 14 : size === 'md' ? 16 : 18}
              color={colors.text.muted}
            />
          </View>
        )}
      </Animated.View>

      {error && (
        <Text
          className="text-xs text-feedback-error mt-1"
          accessibilityLiveRegion="polite"
          accessibilityRole="alert"
        >
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text className="text-xs text-text-muted mt-1">
          {helperText}
        </Text>
      )}
    </View>
  );
}
