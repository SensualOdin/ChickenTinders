import { View, ViewProps } from 'react-native';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';

const stackVariants = cva(
  'flex',
  {
    variants: {
      direction: {
        column: 'flex-col',
        row: 'flex-row',
      },
      spacing: {
        none: 'gap-0',
        xs: 'gap-1',
        sm: 'gap-2',
        md: 'gap-3',
        lg: 'gap-4',
        xl: 'gap-6',
        '2xl': 'gap-8',
      },
      align: {
        start: 'items-start',
        center: 'items-center',
        end: 'items-end',
        stretch: 'items-stretch',
      },
      justify: {
        start: 'justify-start',
        center: 'justify-center',
        end: 'justify-end',
        between: 'justify-between',
        around: 'justify-around',
      },
    },
    defaultVariants: {
      direction: 'column',
      spacing: 'md',
      align: 'stretch',
      justify: 'start',
    },
  }
);

export interface StackProps extends ViewProps, VariantProps<typeof stackVariants> {
  className?: string;
  children?: React.ReactNode;
}

export function Stack({
  direction,
  spacing,
  align,
  justify,
  className,
  children,
  ...props
}: StackProps) {
  return (
    <View
      className={cn(stackVariants({ direction, spacing, align, justify }), className)}
      {...props}
    >
      {children}
    </View>
  );
}
