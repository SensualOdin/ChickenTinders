import { Pressable, Text, ActivityIndicator, View } from 'react-native';
import { useRouter } from 'expo-router';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { FontAwesome } from '@expo/vector-icons';

const buttonVariants = cva(
  'flex-row items-center justify-center active:scale-95 transition-transform',
  {
    variants: {
      variant: {
        primary: 'bg-primary active:bg-primary-dark',
        secondary: 'bg-secondary active:bg-secondary-dark',
        outline: 'border-2 border-primary bg-transparent',
        ghost: 'bg-transparent',
        danger: 'bg-error active:bg-error/80',
      },
      size: {
        sm: 'px-4 py-2 rounded-lg',
        md: 'px-6 py-3 rounded-xl',
        lg: 'px-8 py-4 rounded-full',
      },
      fullWidth: {
        true: 'w-full',
        false: '',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'lg',
      fullWidth: false,
    },
  }
);

const textVariants = cva('font-bold text-center', {
  variants: {
    variant: {
      primary: 'text-white',
      secondary: 'text-textDark',
      outline: 'text-primary',
      ghost: 'text-primary',
      danger: 'text-white',
    },
    size: {
      sm: 'text-sm',
      md: 'text-base',
      lg: 'text-lg',
    },
  },
  defaultVariants: {
    variant: 'primary',
    size: 'lg',
  },
});

export interface ButtonProps extends VariantProps<typeof buttonVariants> {
  children: string;
  onPress?: () => void;
  href?: string;
  disabled?: boolean;
  loading?: boolean;
  icon?: keyof typeof FontAwesome.glyphMap;
  iconPosition?: 'left' | 'right';
  accessibilityLabel?: string;
  className?: string;
}

export function Button({
  children,
  onPress,
  href,
  disabled = false,
  loading = false,
  icon,
  iconPosition = 'left',
  variant,
  size,
  fullWidth,
  accessibilityLabel,
  className,
}: ButtonProps) {
  const router = useRouter();

  const handlePress = () => {
    if (disabled || loading) return;

    if (href) {
      router.push(href);
    } else if (onPress) {
      onPress();
    }
  };

  const isDisabled = disabled || loading;

  const iconColor =
    variant === 'outline' || variant === 'ghost' ? '#A91D3A' :
    variant === 'secondary' ? '#2C0A0A' : '#FFFFFF';

  return (
    <Pressable
      onPress={handlePress}
      disabled={isDisabled}
      accessibilityLabel={accessibilityLabel || children}
      accessibilityRole="button"
      className={cn(
        buttonVariants({ variant, size, fullWidth }),
        isDisabled && 'opacity-50',
        className
      )}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} />
      ) : (
        <View className="flex-row items-center gap-2">
          {icon && iconPosition === 'left' && (
            <FontAwesome name={icon} size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} color={iconColor} />
          )}
          <Text className={cn(textVariants({ variant, size }))}>{children}</Text>
          {icon && iconPosition === 'right' && (
            <FontAwesome name={icon} size={size === 'sm' ? 14 : size === 'md' ? 16 : 18} color={iconColor} />
          )}
        </View>
      )}
    </Pressable>
  );
}
