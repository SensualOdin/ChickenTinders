import { View, Text, Pressable } from 'react-native';

type DietaryTagSelectorProps = {
  selectedTags: string[];
  onChange: (tags: string[]) => void;
};

const DIETARY_OPTIONS = [
  { id: 'vegan', label: 'Vegan', emoji: '🌱' },
  { id: 'vegetarian', label: 'Vegetarian', emoji: '🥗' },
  { id: 'gluten-free', label: 'Gluten-Free', emoji: '🌾' },
  { id: 'halal', label: 'Halal', emoji: '☪️' },
  { id: 'kosher', label: 'Kosher', emoji: '✡️' },
  { id: 'nut-free', label: 'Nut-Free', emoji: '🥜' },
];

export function DietaryTagSelector({ selectedTags, onChange }: DietaryTagSelectorProps) {
  const toggleTag = (tagId: string) => {
    if (selectedTags.includes(tagId)) {
      onChange(selectedTags.filter((t) => t !== tagId));
    } else {
      onChange([...selectedTags, tagId]);
    }
  };

  return (
    <View className="w-full">
      <Text className="text-sm font-semibold text-text-display mb-1 tracking-wide uppercase">
        Dietary Restrictions
      </Text>
      <Text className="text-sm text-text-muted mb-4 leading-relaxed">
        We'll only show restaurants that accommodate everyone
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {DIETARY_OPTIONS.map((option) => {
          const isSelected = selectedTags.includes(option.id);
          return (
            <Pressable
              key={option.id}
              onPress={() => toggleTag(option.id)}
              className={`px-4 py-3 rounded-2xl border active:scale-95 transition-all shadow-soft ${
                isSelected
                  ? 'bg-feedback-success border-feedback-success shadow-elevated'
                  : 'bg-surface-card border-brand-primary/20'
              }`}
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-base">{option.emoji}</Text>
                <Text
                  className={`text-sm font-medium tracking-wide ${
                    isSelected ? 'text-surface-card' : 'text-text-display'
                  }`}
                >
                  {option.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
