import { View } from 'react-native';
import { Shimmer } from '../animations/Shimmer';

type LoadingSkeletonProps = {
  width?: string | number;
  height?: string | number;
  rounded?: string;
};

export function LoadingSkeleton({ width = '100%', height = 20, rounded = 'rounded' }: LoadingSkeletonProps) {
  return <Shimmer width={width} height={typeof height === 'number' ? height : parseInt(height as string)} rounded={rounded} />;
}

export function RestaurantCardSkeleton() {
  return (
    <View className="w-full bg-white rounded-3xl overflow-hidden shadow-xl">
      {/* Image Skeleton */}
      <View className="mb-0">
        <LoadingSkeleton width="100%" height={384} rounded="rounded-none" />
      </View>

      {/* Content Skeleton */}
      <View className="p-6">
        {/* Name */}
        <View className="mb-3">
          <LoadingSkeleton width="80%" height={32} />
        </View>

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
        <View className="mb-6">
          <LoadingSkeleton width="90%" height={16} />
        </View>

        {/* Buttons */}
        <View className="flex-row justify-between gap-4">
          <LoadingSkeleton width="32%" height={64} rounded="rounded-xl" />
          <LoadingSkeleton width="32%" height={64} rounded="rounded-xl" />
          <LoadingSkeleton width="32%" height={64} rounded="rounded-xl" />
        </View>
      </View>
    </View>
  );
}

export function LobbyMemberSkeleton() {
  return (
    <View className="flex-row items-center gap-3 py-3">
      <LoadingSkeleton width={40} height={40} rounded="rounded-full" />
      <LoadingSkeleton width={120} height={20} />
    </View>
  );
}

export function ResultsCardSkeleton() {
  return (
    <View className="bg-white rounded-2xl overflow-hidden shadow-lg mb-6">
      <View className="mb-0">
        <LoadingSkeleton width="100%" height={256} rounded="rounded-none" />
      </View>
      <View className="p-6">
        <View className="mb-2">
          <LoadingSkeleton width="70%" height={28} />
        </View>
        <View className="mb-4">
          <LoadingSkeleton width="50%" height={20} />
        </View>
        <View className="mb-6">
          <LoadingSkeleton width="100%" height={16} />
        </View>
        <LoadingSkeleton width="100%" height={56} rounded="rounded-xl" />
      </View>
    </View>
  );
}
