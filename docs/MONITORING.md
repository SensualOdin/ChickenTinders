# Monitoring & Analytics Setup

**Date:** January 2026
**Status:** Configured

## Overview

ChickenTinders uses two monitoring services:
- **Sentry**: Error tracking and performance monitoring
- **Posthog**: Product analytics and feature flags

## 🔧 Setup Instructions

### 1. Environment Variables

Copy `.env.example` to `.env` and fill in the values:

```bash
cp .env.example .env
```

Required variables:
```env
# Sentry (Optional but recommended for production)
EXPO_PUBLIC_SENTRY_DSN=https://your-sentry-dsn@sentry.io/project-id

# Posthog (Optional but recommended for analytics)
EXPO_PUBLIC_POSTHOG_API_KEY=phc_your_posthog_api_key
EXPO_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### 2. Sentry Setup

1. Create a Sentry account at [sentry.io](https://sentry.io)
2. Create a new React Native project
3. Copy your DSN from Project Settings → Client Keys
4. Add DSN to `.env` file

**Features:**
- Automatic error capture
- Performance monitoring (20% sampling)
- User context tracking
- Breadcrumb trail for debugging
- Source maps for stack traces

### 3. Posthog Setup

1. Create a Posthog account at [posthog.com](https://posthog.com)
2. Create a new project
3. Copy your API key from Project Settings
4. Add API key to `.env` file

**Features:**
- Event tracking
- User identification
- Screen view tracking
- Feature flags
- Session recording (web only)

## 📊 Usage

### Error Tracking (Sentry)

Errors are automatically captured by the ErrorBoundary. You can also manually capture errors:

```typescript
import { captureError, addBreadcrumb } from '@/lib/monitoring/sentry';

try {
  // Your code
} catch (error) {
  captureError(error, {
    context: 'additional_info',
    userId: 'user_123',
  });
}

// Add breadcrumb for debugging
addBreadcrumb('User clicked button', 'user-action', {
  buttonId: 'submit-form',
});
```

### User Context

Set user context after authentication:

```typescript
import { setSentryUser, clearSentryUser } from '@/lib/monitoring/sentry';

// On login
setSentryUser(user.id, user.email, user.display_name);

// On logout
clearSentryUser();
```

### Analytics (Posthog)

Use predefined event helpers:

```typescript
import { analytics } from '@/lib/monitoring/analytics';

// Authentication
analytics.signUp('email');
analytics.signIn('google');
analytics.signOut();

// Groups
analytics.groupCreated(groupId, memberCount);
analytics.groupJoined(groupId, joinCode);

// Swipes
analytics.restaurantLiked(restaurantId, restaurantName, isSuperLike);
analytics.restaurantDisliked(restaurantId, restaurantName);

// Matches
analytics.matchesFound(groupId, matchCount, unanimousCount);
analytics.matchShared(groupId, matchCount);
analytics.directionsOpened(restaurantId, restaurantName);
```

Or track custom events:

```typescript
import { trackEvent } from '@/lib/monitoring/analytics';

trackEvent('custom_event', {
  property1: 'value1',
  property2: 'value2',
});
```

### Screen Tracking

Track screen views:

```typescript
import { trackScreen } from '@/lib/monitoring/analytics';

useEffect(() => {
  trackScreen('Home Screen', {
    source: 'navigation',
  });
}, []);
```

### User Identification

Identify users after authentication:

```typescript
import { identifyUser, resetUser } from '@/lib/monitoring/analytics';

// On login
identifyUser(user.id, {
  email: user.email,
  display_name: user.display_name,
  created_at: user.created_at,
});

// On logout
resetUser();
```

### Feature Flags

Check if a feature is enabled:

```typescript
import { isFeatureEnabled } from '@/lib/monitoring/analytics';

const showNewFeature = await isFeatureEnabled('new-matching-algorithm');

if (showNewFeature) {
  // Show new feature
}
```

## 🎯 Predefined Events

### Authentication
- `sign_up` - User creates account (properties: method)
- `sign_in` - User logs in (properties: method)
- `sign_out` - User logs out

### Groups
- `group_created` - New group created (properties: group_id, member_count)
- `group_joined` - User joins group (properties: group_id, join_code)

### Swipes
- `restaurant_liked` - User likes restaurant (properties: restaurant_id, restaurant_name, is_super_like)
- `restaurant_disliked` - User dislikes restaurant (properties: restaurant_id, restaurant_name)

### Matches
- `matches_found` - Matches detected (properties: group_id, match_count, unanimous_count)
- `match_shared` - User shares results (properties: group_id, match_count)
- `directions_opened` - User opens directions (properties: restaurant_id, restaurant_name)

### Errors
- `error_occurred` - Non-fatal error (properties: error_type, error_message, context)

## 🚨 Error Filtering

Sentry automatically filters out:
- Development errors (when `__DEV__` is true)
- Network errors in development
- Cancelled/aborted requests
- User-cancelled operations

To filter additional errors, update `beforeSend` in [lib/monitoring/sentry.ts](../lib/monitoring/sentry.ts).

## 🔒 Privacy Considerations

### Data Collection

**Sentry collects:**
- Error messages and stack traces
- User ID (if set)
- Device information
- Performance metrics

**Posthog collects:**
- Event data (as defined by you)
- User properties (if set)
- Screen views
- Session data

### Disabling Monitoring

Both services are automatically disabled in development mode (`__DEV__`).

To disable in production, simply don't set the environment variables.

## 📈 Monitoring Dashboard

### Sentry Dashboard

View your errors at: `https://sentry.io/organizations/your-org/issues/`

Key metrics to monitor:
- Error rate
- Affected users
- Performance (transaction duration)
- Release health

### Posthog Dashboard

View your analytics at: `https://app.posthog.com/`

Key metrics to monitor:
- Daily active users (DAU)
- Event volume
- Conversion funnels
- Feature flag usage

## 🧪 Testing

### Test Sentry Error Capture

```typescript
import { captureError } from '@/lib/monitoring/sentry';

// Throw a test error
captureError(new Error('Test error from ChickenTinders'), {
  test: true,
  environment: 'development',
});
```

### Test Posthog Events

```typescript
import { trackEvent } from '@/lib/monitoring/analytics';

trackEvent('test_event', {
  test: true,
  timestamp: new Date().toISOString(),
});
```

## 📚 Resources

- [Sentry React Native Docs](https://docs.sentry.io/platforms/react-native/)
- [Posthog React Native Docs](https://posthog.com/docs/libraries/react-native)
- [WCAG 2.1 Guidelines](https://www.w3.org/WAI/WCAG21/quickref/)

## ✅ Integration Checklist

- [x] Install Sentry and Posthog packages
- [x] Create monitoring configuration files
- [x] Add ErrorBoundary to root layout
- [x] Initialize Sentry on app start
- [x] Initialize Posthog on app start
- [x] Create predefined analytics helpers
- [x] Document environment variables
- [ ] Add Sentry DSN to production environment
- [ ] Add Posthog API key to production environment
- [ ] Test error capture in production
- [ ] Test analytics events in production
- [ ] Set up Sentry alerts
- [ ] Create Posthog dashboards
