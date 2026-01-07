import { View, Text, TextInput, TextInputProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { FontAwesome } from '@expo/vector-icons';
import { useState } from 'react';

const inputVariants = cva(
  'bg-white border-2 rounded-xl px-4 py-4 text-lg text-textDark transition-colors',
  {
    variants: {
      variant: {
        default: 'border-cream-dark focus:border-primary focus:ring-2 focus:ring-primary/20',
        error: 'border-error focus:border-error focus:ring-2 focus:ring-error/20',
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
  className?: string;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  size = 'lg',
  className,
  ...props
}: InputProps) {
  const [isFocused, setIsFocused] = useState(false);

  const variant = error ? 'error' : 'default';

  return (
    <View className="w-full">
      {label && (
        <Text className="text-sm font-semibold text-textDark mb-2">
          {label}
        </Text>
      )}

      <View className="relative">
        {leftIcon && (
          <View className="absolute left-4 top-1/2 -translate-y-1/2 z-10">
            <FontAwesome
              name={leftIcon}
              size={size === 'sm' ? 14 : size === 'md' ? 16 : 18}
              color="#6B4423"
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
          placeholderTextColor="#9CA3AF"
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
              color="#6B4423"
            />
          </View>
        )}
      </View>

      {error && (
        <Text className="text-xs text-error mt-1">
          {error}
        </Text>
      )}

      {helperText && !error && (
        <Text className="text-xs text-gray-500 mt-1">
          {helperText}
        </Text>
      )}
    </View>
  );
}
