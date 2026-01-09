import { View, Text } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const infoCardVariants = cva(
  'rounded-xl p-4 border',
  {
    variants: {
      variant: {
        info: 'bg-blue-50 border-blue-200',
        success: 'bg-green-50 border-green-200',
        warning: 'bg-yellow-50 border-yellow-200',
        error: 'bg-red-50 border-red-200',
        primary: 'bg-accent/10 border-accent/30',
        secondary: 'bg-secondary/10 border-secondary/30',
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
        info: 'text-blue-900',
        success: 'text-green-900',
        warning: 'text-yellow-900',
        error: 'text-red-900',
        primary: 'text-accent-dark',
        secondary: 'text-textDark',
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
        info: 'text-blue-800',
        success: 'text-green-800',
        warning: 'text-yellow-800',
        error: 'text-red-800',
        primary: 'text-textDark',
        secondary: 'text-textDark',
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
