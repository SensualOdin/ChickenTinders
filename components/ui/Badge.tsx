import { View, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const badgeVariants = cva(
  'items-center justify-center rounded-lg px-2 py-1',
  {
    variants: {
      variant: {
        default: 'bg-neutral-gray200',
        primary: 'bg-brand-primary',
        secondary: 'bg-brand-secondary',
        success: 'bg-feedback-success',
        warning: 'bg-feedback-warning',
        error: 'bg-feedback-error',
        info: 'bg-brand-secondary',
        outline: 'bg-transparent border border-neutral-gray200',
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
        default: 'text-text-body',
        primary: 'text-white',
        secondary: 'text-white',
        success: 'text-white',
        warning: 'text-white',
        error: 'text-white',
        info: 'text-white',
        outline: 'text-text-body',
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
