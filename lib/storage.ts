import AsyncStorage from '@react-native-async-storage/async-storage';

const KEYS = {
  USER_ID: 'chickentinders_user_id',
  DISPLAY_NAME: 'chickentinders_display_name',
  DIETARY_TAGS: 'chickentinders_dietary_tags',
};

// Check if we're on the client side (not SSR)
const isClient = typeof window !== 'undefined';

// User ID
export async function getUserId(): Promise<string | null> {
  if (!isClient) return null;
  try {
    return await AsyncStorage.getItem(KEYS.USER_ID);
  } catch (error) {
    console.error('Error getting user ID:', error);
    return null;
  }
}

export async function setUserId(userId: string): Promise<void> {
  if (!isClient) return;
  try {
    await AsyncStorage.setItem(KEYS.USER_ID, userId);
  } catch (error) {
    console.error('Error setting user ID:', error);
  }
}

// Display Name
export async function getDisplayName(): Promise<string | null> {
  if (!isClient) return null;
  try {
    return await AsyncStorage.getItem(KEYS.DISPLAY_NAME);
  } catch (error) {
    console.error('Error getting display name:', error);
    return null;
  }
}

export async function setDisplayName(name: string): Promise<void> {
  if (!isClient) return;
  try {
    await AsyncStorage.setItem(KEYS.DISPLAY_NAME, name);
  } catch (error) {
    console.error('Error setting display name:', error);
  }
}

// Dietary Tags
export async function getDietaryTags(): Promise<string[]> {
  if (!isClient) return [];
  try {
    const tags = await AsyncStorage.getItem(KEYS.DIETARY_TAGS);
    return tags ? JSON.parse(tags) : [];
  } catch (error) {
    console.error('Error getting dietary tags:', error);
    return [];
  }
}

export async function setDietaryTags(tags: string[]): Promise<void> {
  if (!isClient) return;
  try {
    await AsyncStorage.setItem(KEYS.DIETARY_TAGS, JSON.stringify(tags));
  } catch (error) {
    console.error('Error setting dietary tags:', error);
  }
}

// Clear all data
export async function clearUserData(): Promise<void> {
  if (!isClient) return;
  try {
    await AsyncStorage.multiRemove([KEYS.USER_ID, KEYS.DISPLAY_NAME, KEYS.DIETARY_TAGS]);
  } catch (error) {
    console.error('Error clearing user data:', error);
  }
}
