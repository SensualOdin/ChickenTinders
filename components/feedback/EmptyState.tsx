import { View, Text, Pressable } from 'react-native';

interface EmptyStateAction {
  label: string;
  onPress: () => void;
}

interface EmptyStateProps {
  icon: string;
  title: string;
  description: string;
  action?: EmptyStateAction;
  secondaryAction?: EmptyStateAction;
}

export function EmptyState({
  icon,
  title,
  description,
  action,
  secondaryAction,
}: EmptyStateProps) {
  return (
    <View className="flex-1 items-center justify-center px-4 py-12">
      {/* Icon */}
      <Text className="text-6xl mb-4">{icon}</Text>

      {/* Title */}
      <Text
        className="text-2xl font-bold text-textDark mb-2 text-center"
        style={{ fontFamily: 'Fraunces' }}
      >
        {title}
      </Text>

      {/* Description */}
      <Text className="text-base text-textMuted text-center mb-8 max-w-md">
        {description}
      </Text>

      {/* Actions */}
      {action && (
        <View className="gap-3 w-full max-w-xs">
          <Pressable
            onPress={action.onPress}
            className="bg-primary py-4 rounded-full items-center active:scale-95"
          >
            <Text className="text-white text-base font-bold">
              {action.label}
            </Text>
          </Pressable>

          {secondaryAction && (
            <Pressable
              onPress={secondaryAction.onPress}
              className="border-2 border-primary py-4 rounded-full items-center active:scale-95"
            >
              <Text className="text-primary text-base font-semibold">
                {secondaryAction.label}
              </Text>
            </Pressable>
          )}
        </View>
      )}
    </View>
  );
}
