import { Posthog } from 'posthog-react-native';

const POSTHOG_API_KEY = process.env.EXPO_PUBLIC_POSTHOG_API_KEY;
const POSTHOG_HOST = process.env.EXPO_PUBLIC_POSTHOG_HOST || 'https://app.posthog.com';

let posthog: Posthog | null = null;

export async function initAnalytics() {
  // Only initialize if API key is configured
  if (!POSTHOG_API_KEY) {
    console.warn('Posthog API key not configured. Analytics disabled.');
    return;
  }

  posthog = new Posthog(POSTHOG_API_KEY, {
    host: POSTHOG_HOST,
    // Disable in development to avoid noise
    disabled: __DEV__,
  });

  console.log('Analytics initialized');
}

// Track custom events
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (!posthog) {
    console.warn('Analytics not initialized');
    return;
  }

  posthog.capture(eventName, properties);
}

// Identify user
export function identifyUser(userId: string, properties?: Record<string, any>) {
  if (!posthog) {
    console.warn('Analytics not initialized');
    return;
  }

  posthog.identify(userId, properties);
}

// Reset user (on logout)
export function resetUser() {
  if (!posthog) {
    console.warn('Analytics not initialized');
    return;
  }

  posthog.reset();
}

// Track screen views
export function trackScreen(screenName: string, properties?: Record<string, any>) {
  trackEvent('$screen', {
    $screen_name: screenName,
    ...properties,
  });
}

// Feature flag support
export async function isFeatureEnabled(flagKey: string): Promise<boolean> {
  if (!posthog) {
    console.warn('Analytics not initialized');
    return false;
  }

  return posthog.isFeatureEnabled(flagKey);
}

// Predefined event tracking helpers
export const analytics = {
  // Authentication events
  signUp: (method: string) => trackEvent('sign_up', { method }),
  signIn: (method: string) => trackEvent('sign_in', { method }),
  signOut: () => trackEvent('sign_out'),

  // Group events
  groupCreated: (groupId: string, memberCount: number) =>
    trackEvent('group_created', { group_id: groupId, member_count: memberCount }),
  groupJoined: (groupId: string, joinCode: string) =>
    trackEvent('group_joined', { group_id: groupId, join_code: joinCode }),

  // Swipe events
  restaurantLiked: (restaurantId: string, restaurantName: string, isSuperLike: boolean) =>
    trackEvent('restaurant_liked', {
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
      is_super_like: isSuperLike,
    }),
  restaurantDisliked: (restaurantId: string, restaurantName: string) =>
    trackEvent('restaurant_disliked', {
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
    }),

  // Match events
  matchesFound: (groupId: string, matchCount: number, unanimousCount: number) =>
    trackEvent('matches_found', {
      group_id: groupId,
      match_count: matchCount,
      unanimous_count: unanimousCount,
    }),
  matchShared: (groupId: string, matchCount: number) =>
    trackEvent('match_shared', {
      group_id: groupId,
      match_count: matchCount,
    }),
  directionsOpened: (restaurantId: string, restaurantName: string) =>
    trackEvent('directions_opened', {
      restaurant_id: restaurantId,
      restaurant_name: restaurantName,
    }),

  // Error tracking (supplement to Sentry)
  errorOccurred: (errorType: string, errorMessage: string, context?: Record<string, any>) =>
    trackEvent('error_occurred', {
      error_type: errorType,
      error_message: errorMessage,
      ...context,
    }),
};
