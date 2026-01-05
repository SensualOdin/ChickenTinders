import { View, Text, Pressable } from 'react-native';

type PriceTierSelectorProps = {
  value: number;
  onChange: (tier: number) => void;
};

const TIERS = [
  { value: 1, label: '$', description: 'Budget-friendly' },
  { value: 2, label: '$$', description: 'Moderate' },
  { value: 3, label: '$$$', description: 'Upscale' },
  { value: 4, label: '$$$$', description: 'Luxury' },
];

export function PriceTierSelector({ value, onChange }: PriceTierSelectorProps) {
  return (
    <View className="w-full">
      <Text className="text-base font-semibold text-textDark mb-3">Price Range</Text>
      <View className="flex-row gap-3">
        {TIERS.map((tier) => (
          <Pressable
            key={tier.value}
            onPress={() => onChange(tier.value)}
            className={`flex-1 py-4 rounded-xl border-2 items-center active:scale-95 transition-transform ${
              value === tier.value
                ? 'bg-primary border-primary'
                : 'bg-white border-gray-200'
            }`}
          >
            <Text
              className={`text-2xl font-bold mb-1 ${
                value === tier.value ? 'text-white' : 'text-primary'
              }`}
            >
              {tier.label}
            </Text>
            <Text
              className={`text-xs ${
                value === tier.value ? 'text-white' : 'text-gray-500'
              }`}
            >
              {tier.description}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
