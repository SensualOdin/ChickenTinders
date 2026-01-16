import { View, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const infoCardVariants = cva(
  'rounded-xl p-4 border',
  {
    variants: {
      variant: {
        info: 'bg-brand-secondary/10 border-brand-secondary/30',
        success: 'bg-feedback-success/10 border-feedback-success/30',
        warning: 'bg-feedback-warning/15 border-feedback-warning/40',
        error: 'bg-feedback-error/10 border-feedback-error/30',
        primary: 'bg-brand-primary/10 border-brand-primary/30',
        secondary: 'bg-brand-secondary/10 border-brand-secondary/30',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

const titleVariants = cva(
  'text-sm font-semibold mb-2',
  {
    variants: {
      variant: {
        info: 'text-brand-secondary',
        success: 'text-feedback-success',
        warning: 'text-feedback-warning',
        error: 'text-feedback-error',
        primary: 'text-brand-primary',
        secondary: 'text-text-display',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

const contentVariants = cva(
  'text-sm',
  {
    variants: {
      variant: {
        info: 'text-text-body',
        success: 'text-text-body',
        warning: 'text-text-body',
        error: 'text-text-body',
        primary: 'text-text-body',
        secondary: 'text-text-body',
      },
    },
    defaultVariants: {
      variant: 'info',
    },
  }
);

export interface InfoCardProps extends VariantProps<typeof infoCardVariants> {
  title?: string;
  emoji?: string;
  children: React.ReactNode | string;
  className?: string;
}

export function InfoCard({
  title,
  emoji,
  children,
  variant,
  className,
}: InfoCardProps) {
  return (
    <View className={cn(infoCardVariants({ variant }), className)}>
      {(title || emoji) && (
        <View className="flex-row items-center gap-2 mb-2">
          {emoji && <Text className="text-base">{emoji}</Text>}
          {title && (
            <Text className={titleVariants({ variant })}>
              {title}
            </Text>
          )}
        </View>
      )}
      {typeof children === 'string' ? (
        <Text className={contentVariants({ variant })}>
          {children}
        </Text>
      ) : (
        children
      )}
    </View>
  );
}
