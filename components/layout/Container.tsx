import { View, ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const containerVariants = cva(
  'mx-auto w-full',
  {
    variants: {
      size: {
        sm: 'max-w-sm',
        md: 'max-w-md',
        lg: 'max-w-lg',
        xl: 'max-w-xl',
        '2xl': 'max-w-2xl',
        app: 'max-w-app',
        full: 'max-w-full',
      },
      padding: {
        none: '',
        sm: 'px-4',
        md: 'px-6',
        lg: 'px-8',
      },
    },
    defaultVariants: {
      size: 'app',
      padding: 'md',
    },
  }
);

export interface ContainerProps extends ViewProps, VariantProps<typeof containerVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function Container({
  size,
  padding,
  className,
  children,
  ...props
}: ContainerProps) {
  return (
    <View
      className={cn(containerVariants({ size, padding }), className)}
      {...props}
    >
      {children}
    </View>
  );
}
