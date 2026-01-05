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
      <Text className="text-sm font-semibold text-textDark mb-3 tracking-wide uppercase">Price Range</Text>
      <View className="flex-row gap-3">
        {TIERS.map((tier) => (
          <Pressable
            key={tier.value}
            onPress={() => onChange(tier.value)}
            className={`flex-1 py-4 rounded-2xl border items-center active:scale-95 transition-all shadow-soft ${
              value === tier.value
                ? 'bg-primary border-primary shadow-elevated'
                : 'bg-surface border-accent-dark'
            }`}
          >
            <Text
              className={`text-2xl font-bold mb-1 ${
                value === tier.value ? 'text-surface' : 'text-secondary'
              }`}
            >
              {tier.label}
            </Text>
            <Text
              className={`text-xs tracking-wide ${
                value === tier.value ? 'text-surface opacity-90' : 'text-textMuted'
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
