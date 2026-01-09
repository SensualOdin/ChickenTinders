# Performance Optimization

**Date:** January 2026
**Status:** Optimized

## Overview

ChickenTinders is optimized for Core Web Vitals and fast page loads with automatic performance monitoring and best practices implementation.

## 🎯 Core Web Vitals

### Target Metrics (Google's Thresholds)

| Metric | Good | Needs Improvement | Poor | Current |
|--------|------|-------------------|------|---------|
| **LCP** (Largest Contentful Paint) | ≤ 2.5s | ≤ 4.0s | > 4.0s | TBD |
| **FID** (First Input Delay) | ≤ 100ms | ≤ 300ms | > 300ms | TBD |
| **CLS** (Cumulative Layout Shift) | ≤ 0.1 | ≤ 0.25 | > 0.25 | TBD |
| **FCP** (First Contentful Paint) | ≤ 1.8s | ≤ 3.0s | > 3.0s | TBD |
| **TTFB** (Time to First Byte) | ≤ 800ms | ≤ 1.8s | > 1.8s | TBD |

## 📊 Performance Monitoring

### Automatic Tracking

Performance monitoring is automatically initialized in [app/_layout.tsx](../app/_layout.tsx:31).

**Monitored Metrics:**
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- First Contentful Paint (FCP)
- Time to First Byte (TTFB)

**Analytics Integration:**
All Core Web Vitals are automatically reported to Posthog as `core_web_vital` events with:
- `metric`: Name of the metric (LCP, FID, CLS, etc.)
- `value`: Measured value
- `rating`: good | needs-improvement | poor

### Manual Measurements

Use performance utilities from [lib/utils/performance.ts](../lib/utils/performance.ts):

```typescript
import { mark, measure } from '@/lib/utils/performance';

// Mark start of operation
mark('operation-start');

// ... do work ...

// Mark end and measure
mark('operation-end');
const duration = measure('operation-duration', 'operation-start', 'operation-end');

console.log(`Operation took ${duration}ms`);
```

## ⚡ Optimization Strategies

### 1. Code Splitting & Lazy Loading

**Expo Router** automatically code-splits routes. Each page is a separate bundle loaded on demand.

**Benefits:**
- Smaller initial bundle size
- Faster initial page load
- Pages load as needed

**Best Practices:**
```typescript
// ✅ Good: Routes are automatically code-split
// app/swipe/[id].tsx, app/results/[id].tsx are separate bundles

// ✅ Good: Lazy load heavy components
const HeavyChart = React.lazy(() => import('./HeavyChart'));

// ✅ Good: Conditional imports
if (shouldLoadFeature) {
  const feature = await import('./feature');
  feature.init();
}
```

### 2. Image Optimization

Utilities available in [lib/utils/image-optimization.ts](../lib/utils/image-optimization.ts).

**Best Practices:**
```typescript
// Use WebP with JPEG fallback
<picture>
  <source srcSet="/image.webp" type="image/webp" />
  <img src="/image.jpg" alt="Description" />
</picture>

// Lazy load below-the-fold images
<img src="/image.jpg" loading="lazy" alt="Description" />

// Eager load above-the-fold images (default)
<img src="/hero.jpg" loading="eager" alt="Hero" />

// Responsive images
<img
  src="/image.jpg"
  srcSet="/image-400.jpg 400w, /image-800.jpg 800w, /image-1200.jpg 1200w"
  sizes="(max-width: 600px) 400px, (max-width: 900px) 800px, 1200px"
  alt="Responsive image"
/>
```

**Compression Guidelines:**
- **JPEG Photos:** 80-85% quality
- **PNG Graphics:** Use only for transparency
- **WebP:** 75-85% quality (20-30% smaller than JPEG)
- **AVIF:** 60-70% quality (50% smaller than JPEG, bleeding edge)

### 3. Font Loading

**Current Strategy:** Google Fonts with `font-display: swap`

Located in [app/+html.tsx](../app/+html.tsx:62-65):

```html
<link
  href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
  rel="stylesheet"
/>
```

**Benefits:**
- `display=swap`: Text renders immediately with fallback font
- No FOIT (Flash of Invisible Text)
- Prevents layout shift

**Font Optimization:**
- [x] Preconnect to fonts.googleapis.com and fonts.gstatic.com
- [x] Use font-display: swap
- [x] Load only needed font weights
- [ ] Consider self-hosting fonts for even faster loading

### 4. React Performance

**Implemented Optimizations:**

```typescript
// ✅ Memoize expensive components
const SwipeableCard = memo(SwipeableCardComponent, (prev, next) => {
  return prev.restaurant.id === next.restaurant.id && prev.isActive === next.isActive;
});

// ✅ Use useCallback for event handlers
const handleSwipe = useCallback(async (isLiked: boolean) => {
  // ... handler logic
}, [dependencies]);

// ✅ Use useMemo for expensive calculations
const unanimousMatches = useMemo(
  () => matches.filter((m) => m.is_unanimous),
  [matches]
);
```

**Locations:**
- [components/deck/SwipeableCard.tsx](../components/deck/SwipeableCard.tsx) - Memoized
- [app/swipe/[id].tsx](../app/swipe/[id].tsx) - useCallback for handlers
- [app/results/[id].tsx](../app/results/[id].tsx) - useMemo for filtering

### 5. Bundle Size Optimization

**Strategies:**
- Tree-shaking (automatic with Expo)
- Remove unused dependencies
- Use dynamic imports for large libraries
- Analyze bundle with webpack-bundle-analyzer

**Check Bundle Size:**
```bash
# Build for production
npm run build

# Analyze bundle (if webpack-bundle-analyzer installed)
npm run analyze
```

### 6. Network Optimization

**Implemented:**
- [x] Preconnect to critical domains (fonts.googleapis.com)
- [x] Compression (Gzip/Brotli handled by hosting)
- [x] Static site generation (Expo web output: static)

**Best Practices:**
```typescript
// ✅ Batch API requests
const [users, groups, restaurants] = await Promise.all([
  fetchUsers(),
  fetchGroups(),
  fetchRestaurants(),
]);

// ✅ Use Supabase Realtime for live updates (vs polling)
const channel = supabase.channel('lobby-presence');
```

### 7. Rendering Optimization

**Prevent Layout Shift (CLS):**
```css
/* ✅ Reserve space for images */
img {
  aspect-ratio: 16 / 9;
  width: 100%;
  height: auto;
}

/* ✅ Skeleton loaders for content */
.skeleton {
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  animation: shimmer 1.5s infinite;
}
```

**Reduce Reflows:**
- Use CSS transforms instead of layout properties
- Batch DOM reads and writes
- Use `will-change` for animated properties

## 🔍 Performance Auditing

### Lighthouse CI

Run Lighthouse audit:

```bash
# Install Lighthouse CLI
npm install -g @lhci/cli

# Build for production
npm run build

# Serve build
npx serve dist -p 3000

# Run Lighthouse
lhci autorun --collect.url=http://localhost:3000
```

**Target Scores:**
- Performance: ≥ 90
- Accessibility: ≥ 95
- Best Practices: ≥ 95
- SEO: ≥ 95

### WebPageTest

Run tests at [webpagetest.org](https://www.webpagetest.org/):

**Settings:**
- Location: Multiple (US, Europe, Asia)
- Connection: 4G LTE / Cable
- Repeat View: Yes
- Video: Yes

**Analyze:**
- Waterfall chart
- Content breakdown
- Opportunities

### Chrome DevTools

**Performance Panel:**
1. Open DevTools (F12)
2. Go to Performance tab
3. Click Record
4. Interact with app
5. Stop recording
6. Analyze flame chart

**Network Panel:**
1. Open DevTools (F12)
2. Go to Network tab
3. Reload page
4. Check:
   - Total requests
   - Total size
   - DOMContentLoaded time
   - Load time

**Lighthouse Panel:**
1. Open DevTools (F12)
2. Go to Lighthouse tab
3. Select categories
4. Click "Analyze page load"
5. Review report and opportunities

## 📈 Monitoring in Production

### Real User Monitoring (RUM)

Performance data is automatically collected from real users and sent to Posthog.

**View Metrics:**
1. Go to Posthog dashboard
2. Filter by event: `core_web_vital`
3. Group by `metric` property
4. Analyze distribution and percentiles

**Key Metrics to Track:**
- P75 (75th percentile) - Most important for Core Web Vitals
- P95 (95th percentile) - Worst-case scenarios
- Trend over time
- Breakdown by device/browser

### Sentry Performance

Sentry automatically tracks:
- Transaction duration
- Database query performance
- API call latency
- Error rates

**Configuration:** [lib/monitoring/sentry.ts](../lib/monitoring/sentry.ts)

**Sample Rate:** 20% of transactions (adjustable)

## 🚀 Deployment Optimizations

### Build Configuration

**Expo Web (Metro):**
```json
{
  "web": {
    "bundler": "metro",
    "output": "static"
  }
}
```

**Benefits:**
- Static site generation
- No server required
- Deploy to CDN
- Fast TTFB

### Hosting Best Practices

**Recommended Hosts:**
- **Vercel:** Automatic optimizations, edge network
- **Netlify:** CDN, continuous deployment
- **Cloudflare Pages:** Free, fast edge network

**Required Features:**
- HTTP/2 or HTTP/3
- Gzip/Brotli compression
- CDN (edge network)
- Automatic SSL
- Asset caching

### Caching Strategy

**Recommended Headers:**

```nginx
# HTML - No cache (always fresh)
location ~* \.html$ {
  add_header Cache-Control "no-cache, public, must-revalidate";
}

# CSS/JS - Cache with hash (immutable)
location ~* \.(css|js)$ {
  add_header Cache-Control "public, max-age=31536000, immutable";
}

# Images - Cache for 1 year
location ~* \.(jpg|jpeg|png|gif|webp|svg)$ {
  add_header Cache-Control "public, max-age=31536000";
}

# Fonts - Cache for 1 year
location ~* \.(woff|woff2|ttf|otf)$ {
  add_header Cache-Control "public, max-age=31536000";
}
```

## 🛠️ Performance Checklist

### Before Launch

- [ ] Run Lighthouse audit (Performance ≥ 90)
- [ ] Test on slow 3G connection
- [ ] Test on mobile devices (iOS & Android)
- [ ] Optimize all images (WebP, correct sizes)
- [ ] Enable text compression (Gzip/Brotli)
- [ ] Set up proper caching headers
- [ ] Minimize JavaScript bundle size
- [ ] Remove console.logs from production
- [ ] Enable Core Web Vitals tracking
- [ ] Test with React DevTools Profiler

### Post-Launch

- [ ] Monitor Core Web Vitals in Posthog
- [ ] Set up performance budgets
- [ ] Regular Lighthouse audits (weekly)
- [ ] Monitor bundle size changes
- [ ] Review Sentry performance data
- [ ] A/B test performance improvements

## 📚 Resources

### Tools

- [Lighthouse](https://developers.google.com/web/tools/lighthouse)
- [WebPageTest](https://www.webpagetest.org/)
- [Chrome DevTools](https://developer.chrome.com/docs/devtools/)
- [React DevTools Profiler](https://react.dev/learn/react-developer-tools)

### Documentation

- [Core Web Vitals](https://web.dev/vitals/)
- [Performance API](https://developer.mozilla.org/en-US/docs/Web/API/Performance_API)
- [React Performance Optimization](https://react.dev/learn/render-and-commit)
- [Expo Performance](https://docs.expo.dev/guides/performance/)

### Benchmarks

- [HTTP Archive](https://httparchive.org/)
- [Chrome UX Report](https://developers.google.com/web/tools/chrome-user-experience-report)

## 🎯 Performance Budget

Recommended budgets to maintain fast performance:

| Resource | Budget | Current | Status |
|----------|--------|---------|--------|
| **Total Page Weight** | < 1.5 MB | TBD | TBD |
| **JavaScript** | < 300 KB | TBD | TBD |
| **Images** | < 800 KB | TBD | TBD |
| **Fonts** | < 100 KB | TBD | TBD |
| **CSS** | < 50 KB | TBD | TBD |
| **Requests** | < 50 | TBD | TBD |
| **LCP** | < 2.5s | TBD | TBD |
| **FID** | < 100ms | TBD | TBD |
| **CLS** | < 0.1 | TBD | TBD |

**Update after first production deployment.**

## ✅ Implemented Optimizations

- [x] Core Web Vitals monitoring
- [x] Automatic performance tracking
- [x] React component memoization
- [x] useCallback for event handlers
- [x] useMemo for expensive calculations
- [x] Code splitting (automatic via Expo Router)
- [x] Font loading optimization (display=swap)
- [x] Preconnect to external domains
- [x] Static site generation
- [x] Error boundary for fault tolerance
- [x] Reduced motion support (CSS)
- [x] Performance utilities library
- [x] Image optimization helpers

## 🔄 Continuous Improvement

Performance is an ongoing effort. Regular audits and monitoring ensure the app stays fast.

**Monthly:**
- Review Core Web Vitals trends
- Run Lighthouse audit
- Check bundle size
- Review Sentry performance data

**Quarterly:**
- Deep performance audit
- Optimize slow pages
- Update dependencies
- Implement new optimizations

**Yearly:**
- Complete performance overhaul
- Benchmark against competitors
- Update performance budget
- Implement cutting-edge optimizations
