# Dark Mode Foundation

This document outlines the dark mode foundation setup in ChickenTinders. **Note:** Dark mode is not fully implemented - this is just the foundational setup for future implementation.

## Configuration

Dark mode is enabled in `tailwind.config.js` using class-based mode:

```javascript
darkMode: 'class'
```

This means dark mode will be activated when a `dark` class is added to a parent element (typically `<html>` or root `<View>`).

## Color System

### Available Dark Mode Colors

The following colors have dark mode variants defined:

```javascript
// Background colors
background: {
  DEFAULT: '#FFF5E1', // Light cream
  dark: '#1A1A1A',    // Near black
}

// Surface colors (cards, modals, etc.)
surface: {
  DEFAULT: '#FFFFFF', // Pure white
  dark: '#2C2C2C',    // Dark gray
}

// Primary colors (already defined with dark variant)
primary: {
  DEFAULT: '#A91D3A', // ChickenTinders red
  dark: '#8B1538',    // Darker red
  light: '#C72C4A',   // Lighter red (better for dark backgrounds)
}
```

## Usage Pattern

When implementing dark mode in the future, use the following pattern:

```tsx
// Example: Card with dark mode support
<View className="bg-surface dark:bg-surface-dark">
  <Text className="text-textDark dark:text-gray-100">
    Content that adapts to dark mode
  </Text>
</View>

// Example: Background with dark mode
<View className="bg-background dark:bg-background-dark">
  {/* Page content */}
</View>

// Example: Primary colored element
<View className="bg-primary dark:bg-primary-light">
  <Text className="text-white">
    Button or accent element
  </Text>
</View>
```

## Implementation Checklist (Future)

When ready to implement dark mode, follow these steps:

- [ ] Create a `ThemeProvider` or `DarkModeContext`
- [ ] Add dark mode toggle UI component
- [ ] Store user preference in AsyncStorage
- [ ] Apply `dark` class to root View based on user preference
- [ ] Update all pages to use `dark:` variants
- [ ] Add dark mode variants for remaining semantic colors
- [ ] Test all components in both light and dark modes
- [ ] Update brand assets (logo, icons) for dark backgrounds
- [ ] Ensure WCAG contrast requirements in both modes

## Example Implementation (Future Reference)

```tsx
// contexts/ThemeContext.tsx
import { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const ThemeContext = createContext({
  isDark: false,
  toggleTheme: () => {},
});

export function ThemeProvider({ children }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Load saved preference
    AsyncStorage.getItem('theme').then((theme) => {
      setIsDark(theme === 'dark');
    });
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    AsyncStorage.setItem('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      <View className={isDark ? 'dark' : ''}>
        {children}
      </View>
    </ThemeContext.Provider>
  );
}
```

## Color Contrast Guidelines

When implementing dark mode colors, ensure:

- **Body text on dark background:** Minimum 4.5:1 contrast (WCAG AA)
- **Headings on dark background:** Minimum 3:1 contrast
- **Interactive elements:** Maintain same contrast ratios as light mode
- **Primary red (#C72C4A) on dark background:** Use lighter variant for better visibility

## Notes

- Dark mode is **NOT currently implemented** in the app
- This foundation allows for easy future implementation
- All existing pages use light mode colors
- The `dark:` Tailwind variants will be ignored until dark mode is activated
- Current implementation priority: Phase 3 polish (light mode only)
