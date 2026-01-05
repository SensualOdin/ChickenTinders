import { View, Text } from 'react-native';

type AvatarProps = {
  name: string;
  size?: 'small' | 'medium' | 'large';
};

export function Avatar({ name, size = 'medium' }: AvatarProps) {
  // Get initials from name (first letter of each word, max 2)
  const getInitials = (name: string) => {
    const words = name.trim().split(' ');
    if (words.length === 1) {
      return words[0].substring(0, 2).toUpperCase();
    }
    return (words[0][0] + words[words.length - 1][0]).toUpperCase();
  };

  const initials = getInitials(name);

  // Size classes
  const sizeClasses = {
    small: 'w-8 h-8 text-xs',
    medium: 'w-12 h-12 text-base',
    large: 'w-16 h-16 text-xl',
  };

  // Generate a consistent color based on name
  const getColor = (name: string) => {
    const colors = [
      'bg-red-500',
      'bg-orange-500',
      'bg-amber-500',
      'bg-yellow-500',
      'bg-lime-500',
      'bg-green-500',
      'bg-emerald-500',
      'bg-teal-500',
      'bg-cyan-500',
      'bg-sky-500',
      'bg-blue-500',
      'bg-indigo-500',
      'bg-violet-500',
      'bg-purple-500',
      'bg-fuchsia-500',
      'bg-pink-500',
    ];

    // Simple hash function
    let hash = 0;
    for (let i = 0; i < name.length; i++) {
      hash = name.charCodeAt(i) + ((hash << 5) - hash);
    }
    return colors[Math.abs(hash) % colors.length];
  };

  const colorClass = getColor(name);

  return (
    <View
      className={`${sizeClasses[size]} ${colorClass} rounded-full items-center justify-center`}
    >
      <Text className="text-white font-bold">{initials}</Text>
    </View>
  );
}
