import { View, Text } from 'react-native';
import { useState } from 'react';

type SliderProps = {
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
  label: string;
  suffix?: string;
};

export function Slider({ min, max, step = 1, value, onChange, label, suffix = '' }: SliderProps) {
  return (
    <View className="w-full">
      <View className="flex-row justify-between mb-2">
        <Text className="text-base font-semibold text-textDark">{label}</Text>
        <Text className="text-base font-bold text-primary">
          {value}{suffix}
        </Text>
      </View>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
      />
      <View className="flex-row justify-between mt-1">
        <Text className="text-xs text-gray-500">{min}{suffix}</Text>
        <Text className="text-xs text-gray-500">{max}{suffix}</Text>
      </View>
    </View>
  );
}
