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
      <Text className="text-base font-semibold text-textDark mb-1">
        Dietary Restrictions
      </Text>
      <Text className="text-sm text-gray-500 mb-3">
        We'll only show restaurants that accommodate everyone
      </Text>
      <View className="flex-row flex-wrap gap-2">
        {DIETARY_OPTIONS.map((option) => {
          const isSelected = selectedTags.includes(option.id);
          return (
            <Pressable
              key={option.id}
              onPress={() => toggleTag(option.id)}
              className={`px-4 py-3 rounded-xl border-2 active:scale-95 transition-transform ${
                isSelected
                  ? 'bg-success border-success'
                  : 'bg-white border-gray-200'
              }`}
            >
              <View className="flex-row items-center gap-2">
                <Text className="text-base">{option.emoji}</Text>
                <Text
                  className={`text-sm font-medium ${
                    isSelected ? 'text-white' : 'text-gray-700'
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
