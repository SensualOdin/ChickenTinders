import { View } from 'react-native';

interface ShimmerProps {
  width?: number | string;
  height: number;
  rounded?: string;
}

export function Shimmer({
  width = '100%',
  height,
  rounded = 'rounded',
}: ShimmerProps) {
  const widthStyle = typeof width === 'number' ? `${width}px` : width;

  return (
    <View
      className={`overflow-hidden bg-cream-dark ${rounded} relative`}
      style={{
        width: widthStyle,
        height,
      }}
    >
      <View
        className="absolute inset-0 animate-shimmer"
        style={{
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
        }}
      />
    </View>
  );
}
