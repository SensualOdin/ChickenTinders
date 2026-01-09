import { View, Text, Image, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '../../lib/utils';
import { Button } from '../ui/Button';

const headerVariants = cva(
  'w-full',
  {
    variants: {
      variant: {
        landing: 'bg-cream/95',
        app: 'bg-background',
        transparent: 'bg-transparent',
      },
      size: {
        sm: 'py-3',
        md: 'py-4',
        lg: 'py-5',
      },
    },
    defaultVariants: {
      variant: 'app',
      size: 'md',
    },
  }
);

export interface PageHeaderProps {
  title: string;
  subtitle?: string;
  emoji?: string;
  backButton?: {
    label?: string;
    href: string;
  };
  action?: React.ReactNode;
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  emoji,
  backButton,
  action,
  className,
}: PageHeaderProps) {
  return (
    <View className={cn('mb-8', className)}>
      {backButton && (
        <Button
          href={backButton.href}
          variant="ghost"
          size="sm"
          className="mb-4 self-start -ml-2"
        >
          ← {backButton.label || 'Back'}
        </Button>
      )}

      {emoji && <Text className="text-6xl mb-4">{emoji}</Text>}

      <View className="flex-row items-start justify-between">
        <View className="flex-1">
          <Text
            className="text-4xl font-bold text-primary mb-2"
            style={{ fontFamily: 'Playfair Display' }}
          >
            {title}
          </Text>
          {subtitle && (
            <Text className="text-textMuted text-base">
              {subtitle}
            </Text>
          )}
        </View>
        {action && <View className="ml-4">{action}</View>}
      </View>
    </View>
  );
}

export interface NavHeaderProps extends VariantProps<typeof headerVariants> {
  showLogo?: boolean;
  logoHref?: string;
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
  className?: string;
}

export function NavHeader({
  variant,
  size,
  showLogo = true,
  logoHref = '/',
  leftAction,
  rightAction,
  className,
}: NavHeaderProps) {
  const router = useRouter();

  return (
    <View className={cn(headerVariants({ variant, size }), className)}>
      <View className="max-w-app mx-auto w-full px-8">
        <View className="flex-row justify-between items-center">
          {/* Left Section */}
          <View className="flex-row items-center gap-4">
            {leftAction}
            {showLogo && (
              <Pressable
                onPress={() => router.push(logoHref)}
                className="flex-row items-center gap-3 active:scale-95 transition-all"
              >
                <Image
                  source={require('../../assets/images/icon.png')}
                  style={{ width: 44, height: 44 }}
                  resizeMode="contain"
                />
                <Text
                  className="text-xl font-semibold text-primary"
                  style={{ fontFamily: 'Fraunces' }}
                >
                  Chicken Tinders
                </Text>
              </Pressable>
            )}
          </View>

          {/* Right Section */}
          {rightAction && (
            <View className="flex-row gap-3">
              {rightAction}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
