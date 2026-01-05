import { useEffect } from 'react';
import { View } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

type LoadingSkeletonProps = {
  width?: string | number;
  height?: string | number;
  className?: string;
};

export function LoadingSkeleton({ width = '100%', height = 20, className = '' }: LoadingSkeletonProps) {
  const opacity = useSharedValue(0.3);

  useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 800 }),
        withTiming(0.3, { duration: 800 })
      ),
      -1,
      false
    );
  }, []);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
  }));

  return (
    <Animated.View
      style={[animatedStyle, { width, height }]}
      className={`bg-gray-200 rounded ${className}`}
    />
  );
}

export function RestaurantCardSkeleton() {
  return (
    <View className="w-full bg-white rounded-3xl overflow-hidden shadow-xl">
      {/* Image Skeleton */}
      <LoadingSkeleton width="100%" height={384} className="rounded-none" />

      {/* Content Skeleton */}
      <View className="p-6">
        {/* Name */}
        <LoadingSkeleton width="80%" height={32} className="mb-3" />

        {/* Cuisine & Price */}
        <View className="flex-row items-center gap-2 mb-3">
          <LoadingSkeleton width={100} height={20} />
          <LoadingSkeleton width={40} height={20} />
        </View>

        {/* Rating & Distance */}
        <View className="flex-row items-center gap-4 mb-4">
          <LoadingSkeleton width={60} height={20} />
          <LoadingSkeleton width={60} height={20} />
        </View>

        {/* Address */}
        <LoadingSkeleton width="90%" height={16} className="mb-6" />

        {/* Buttons */}
        <View className="flex-row justify-between gap-4">
          <LoadingSkeleton width="32%" height={64} className="rounded-xl" />
          <LoadingSkeleton width="32%" height={64} className="rounded-xl" />
          <LoadingSkeleton width="32%" height={64} className="rounded-xl" />
        </View>
      </View>
    </View>
  );
}

export function LobbyMemberSkeleton() {
  return (
    <View className="flex-row items-center gap-3 py-3">
      <LoadingSkeleton width={40} height={40} className="rounded-full" />
      <LoadingSkeleton width={120} height={20} />
    </View>
  );
}

export function ResultsCardSkeleton() {
  return (
    <View className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6">
      <LoadingSkeleton width="100%" height={256} className="rounded-none" />
      <View className="p-6">
        <LoadingSkeleton width="70%" height={28} className="mb-2" />
        <LoadingSkeleton width="50%" height={20} className="mb-4" />
        <LoadingSkeleton width="100%" height={16} className="mb-6" />
        <LoadingSkeleton width="100%" height={56} className="rounded-xl" />
      </View>
    </View>
  );
}
