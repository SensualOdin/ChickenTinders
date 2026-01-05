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
      <View className="flex-row justify-between mb-3">
        <Text className="text-sm font-semibold text-textDark tracking-wide uppercase">{label}</Text>
        <View className="bg-secondary px-3 py-1 rounded-full">
          <Text className="text-sm font-bold text-surface">
            {value}{suffix}
          </Text>
        </View>
      </View>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
        className="w-full h-2 bg-accent rounded-full appearance-none cursor-pointer accent-primary"
        style={{
          background: `linear-gradient(to right, #D4A574 0%, #D4A574 ${((value - min) / (max - min)) * 100}%, #E8DCC4 ${((value - min) / (max - min)) * 100}%, #E8DCC4 100%)`
        }}
      />
      <View className="flex-row justify-between mt-2">
        <Text className="text-xs text-textLight">{min}{suffix}</Text>
        <Text className="text-xs text-textLight">{max}{suffix}</Text>
      </View>
    </View>
  );
}
