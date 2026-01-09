import { View, Text, ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const cardVariants = cva(
  'rounded-2xl',
  {
    variants: {
      variant: {
        default: 'bg-white shadow-sm',
        surface: 'bg-surface shadow-soft border border-accent/10',
        elevated: 'bg-white shadow-card',
        outline: 'bg-white border-2 border-gray-200',
        ghost: 'bg-transparent',
      },
      padding: {
        none: '',
        sm: 'p-3',
        md: 'p-4',
        lg: 'p-6',
        xl: 'p-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      padding: 'md',
    },
  }
);

export interface CardProps extends ViewProps, VariantProps<typeof cardVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function Card({
  variant,
  padding,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <View
      className={cn(cardVariants({ variant, padding }), className)}
      {...props}
    >
      {children}
    </View>
  );
}

// CardHeader component for consistent card headers
export interface CardHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  className?: string;
}

export function CardHeader({ title, subtitle, action, className }: CardHeaderProps) {
  return (
    <View className={cn('mb-3', action && 'flex-row items-start justify-between', className)}>
      <View className={action ? 'flex-1' : ''}>
        <Text className="text-lg font-bold text-textDark">
          {title}
        </Text>
        {subtitle && (
          <Text className="text-sm text-textMuted mt-1">
            {subtitle}
          </Text>
        )}
      </View>
      {action && <View>{action}</View>}
    </View>
  );
}

// CardContent component for consistent card body spacing
export interface CardContentProps {
  children?: React.ReactNode;
  className?: string;
}

export function CardContent({ children, className }: CardContentProps) {
  return (
    <View className={cn('gap-3', className)}>
      {children}
    </View>
  );
}
