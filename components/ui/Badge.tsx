import { View, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'items-center justify-center rounded-lg px-2 py-1',
  {
    variants: {
      variant: {
        default: 'bg-gray-100',
        primary: 'bg-primary',
        secondary: 'bg-secondary',
        success: 'bg-success',
        warning: 'bg-warning',
        error: 'bg-error',
        info: 'bg-blue-500',
        outline: 'bg-transparent border border-gray-300',
      },
      size: {
        sm: 'px-2 py-0.5',
        md: 'px-2 py-1',
        lg: 'px-3 py-1.5',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

const textVariants = cva(
  'font-semibold text-center',
  {
    variants: {
      variant: {
        default: 'text-gray-700',
        primary: 'text-white',
        secondary: 'text-white',
        success: 'text-white',
        warning: 'text-white',
        error: 'text-white',
        info: 'text-white',
        outline: 'text-gray-700',
      },
      size: {
        sm: 'text-xs',
        md: 'text-xs',
        lg: 'text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
);

export interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: string;
  icon?: string;
  className?: string;
}

export function Badge({
  children,
  icon,
  variant,
  size,
  className,
}: BadgeProps) {
  return (
    <View className={cn(badgeVariants({ variant, size }), className)}>
      <Text className={textVariants({ variant, size })}>
        {icon && `${icon} `}{children}
      </Text>
    </View>
  );
}
