/**
 * Performance monitoring utilities for Core Web Vitals
 * Tracks LCP (Largest Contentful Paint), FID (First Input Delay), and CLS (Cumulative Layout Shift)
 */

// Track if performance monitoring is available
const isSupported = typeof window !== 'undefined' && 'performance' in window;

/**
 * Core Web Vitals thresholds (Google's recommendations)
 * Good: <= threshold
 * Needs Improvement: threshold to poor threshold
 * Poor: > poor threshold
 */
export const THRESHOLDS = {
  LCP: { good: 2500, poor: 4000 }, // Largest Contentful Paint (ms)
  FID: { good: 100, poor: 300 }, // First Input Delay (ms)
  CLS: { good: 0.1, poor: 0.25 }, // Cumulative Layout Shift
  FCP: { good: 1800, poor: 3000 }, // First Contentful Paint (ms)
  TTFB: { good: 800, poor: 1800 }, // Time to First Byte (ms)
};

/**
 * Get rating based on value and thresholds
 */
function getRating(
  value: number,
  thresholds: { good: number; poor: number }
): 'good' | 'needs-improvement' | 'poor' {
  if (value <= thresholds.good) return 'good';
  if (value <= thresholds.poor) return 'needs-improvement';
  return 'poor';
}

/**
 * Measure Largest Contentful Paint (LCP)
 * LCP marks the time when the largest content element becomes visible
 * Target: < 2.5s (good), < 4s (needs improvement)
 */
export function measureLCP(callback: (value: number, rating: string) => void) {
  if (!isSupported) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const lastEntry = entries[entries.length - 1] as any;

      if (lastEntry) {
        const lcp = lastEntry.renderTime || lastEntry.loadTime;
        const rating = getRating(lcp, THRESHOLDS.LCP);
        callback(lcp, rating);
      }
    });

    observer.observe({ type: 'largest-contentful-paint', buffered: true });
  } catch (error) {
    console.warn('LCP measurement not supported:', error);
  }
}

/**
 * Measure First Input Delay (FID)
 * FID measures the time from when a user first interacts to when browser responds
 * Target: < 100ms (good), < 300ms (needs improvement)
 */
export function measureFID(callback: (value: number, rating: string) => void) {
  if (!isSupported) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();

      entries.forEach((entry: any) => {
        if (entry.processingStart && entry.startTime) {
          const fid = entry.processingStart - entry.startTime;
          const rating = getRating(fid, THRESHOLDS.FID);
          callback(fid, rating);
        }
      });
    });

    observer.observe({ type: 'first-input', buffered: true });
  } catch (error) {
    console.warn('FID measurement not supported:', error);
  }
}

/**
 * Measure Cumulative Layout Shift (CLS)
 * CLS measures visual stability - unexpected layout shifts
 * Target: < 0.1 (good), < 0.25 (needs improvement)
 */
export function measureCLS(callback: (value: number, rating: string) => void) {
  if (!isSupported) return;

  try {
    let clsValue = 0;
    let sessionValue = 0;
    let sessionEntries: any[] = [];

    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries() as any[];

      entries.forEach((entry) => {
        // Only count layout shifts without recent user input
        if (!entry.hadRecentInput) {
          const firstSessionEntry = sessionEntries[0];
          const lastSessionEntry = sessionEntries[sessionEntries.length - 1];

          // New session if gap > 1s or max 5s session
          if (
            sessionValue &&
            entry.startTime - lastSessionEntry.startTime < 1000 &&
            entry.startTime - firstSessionEntry.startTime < 5000
          ) {
            sessionValue += entry.value;
            sessionEntries.push(entry);
          } else {
            sessionValue = entry.value;
            sessionEntries = [entry];
          }

          // Update CLS if current session is larger
          if (sessionValue > clsValue) {
            clsValue = sessionValue;
            const rating = getRating(clsValue, THRESHOLDS.CLS);
            callback(clsValue, rating);
          }
        }
      });
    });

    observer.observe({ type: 'layout-shift', buffered: true });
  } catch (error) {
    console.warn('CLS measurement not supported:', error);
  }
}

/**
 * Measure First Contentful Paint (FCP)
 * FCP marks when first text or image is painted
 * Target: < 1.8s (good), < 3s (needs improvement)
 */
export function measureFCP(callback: (value: number, rating: string) => void) {
  if (!isSupported) return;

  try {
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      const fcpEntry = entries.find((entry) => entry.name === 'first-contentful-paint');

      if (fcpEntry) {
        const fcp = fcpEntry.startTime;
        const rating = getRating(fcp, THRESHOLDS.FCP);
        callback(fcp, rating);
      }
    });

    observer.observe({ type: 'paint', buffered: true });
  } catch (error) {
    console.warn('FCP measurement not supported:', error);
  }
}

/**
 * Measure Time to First Byte (TTFB)
 * TTFB measures time from navigation to first byte received
 * Target: < 800ms (good), < 1800ms (needs improvement)
 */
export function measureTTFB(): { value: number; rating: string } | null {
  if (!isSupported) return null;

  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as any;

    if (navigationEntry) {
      const ttfb = navigationEntry.responseStart - navigationEntry.requestStart;
      const rating = getRating(ttfb, THRESHOLDS.TTFB);
      return { value: ttfb, rating };
    }
  } catch (error) {
    console.warn('TTFB measurement not supported:', error);
  }

  return null;
}

/**
 * Get all navigation timing metrics
 */
export function getNavigationMetrics() {
  if (!isSupported) return null;

  try {
    const navigationEntry = performance.getEntriesByType('navigation')[0] as any;

    if (navigationEntry) {
      return {
        dns: navigationEntry.domainLookupEnd - navigationEntry.domainLookupStart,
        tcp: navigationEntry.connectEnd - navigationEntry.connectStart,
        ttfb: navigationEntry.responseStart - navigationEntry.requestStart,
        download: navigationEntry.responseEnd - navigationEntry.responseStart,
        domInteractive: navigationEntry.domInteractive,
        domComplete: navigationEntry.domComplete,
        loadComplete: navigationEntry.loadEventEnd,
      };
    }
  } catch (error) {
    console.warn('Navigation metrics not supported:', error);
  }

  return null;
}

/**
 * Initialize all Core Web Vitals monitoring
 * Automatically reports to Sentry if available
 */
export function initPerformanceMonitoring() {
  if (!isSupported || __DEV__) {
    console.log('Performance monitoring disabled in development');
    return;
  }

  console.log('Initializing Core Web Vitals monitoring...');

  // Measure LCP
  measureLCP((value, rating) => {
    console.log(`LCP: ${Math.round(value)}ms (${rating})`);

    // Report to analytics if available
    try {
      const { trackEvent } = require('../monitoring/analytics');
      trackEvent('core_web_vital', {
        metric: 'LCP',
        value: Math.round(value),
        rating,
      });
    } catch (error) {
      // Analytics not available
    }
  });

  // Measure FID
  measureFID((value, rating) => {
    console.log(`FID: ${Math.round(value)}ms (${rating})`);

    try {
      const { trackEvent } = require('../monitoring/analytics');
      trackEvent('core_web_vital', {
        metric: 'FID',
        value: Math.round(value),
        rating,
      });
    } catch (error) {
      // Analytics not available
    }
  });

  // Measure CLS
  measureCLS((value, rating) => {
    console.log(`CLS: ${value.toFixed(3)} (${rating})`);

    try {
      const { trackEvent } = require('../monitoring/analytics');
      trackEvent('core_web_vital', {
        metric: 'CLS',
        value: parseFloat(value.toFixed(3)),
        rating,
      });
    } catch (error) {
      // Analytics not available
    }
  });

  // Measure FCP
  measureFCP((value, rating) => {
    console.log(`FCP: ${Math.round(value)}ms (${rating})`);

    try {
      const { trackEvent } = require('../monitoring/analytics');
      trackEvent('core_web_vital', {
        metric: 'FCP',
        value: Math.round(value),
        rating,
      });
    } catch (error) {
      // Analytics not available
    }
  });

  // Measure TTFB
  const ttfb = measureTTFB();
  if (ttfb) {
    console.log(`TTFB: ${Math.round(ttfb.value)}ms (${ttfb.rating})`);

    try {
      const { trackEvent } = require('../monitoring/analytics');
      trackEvent('core_web_vital', {
        metric: 'TTFB',
        value: Math.round(ttfb.value),
        rating: ttfb.rating,
      });
    } catch (error) {
      // Analytics not available
    }
  }
}

/**
 * Mark a custom performance measurement
 */
export function mark(name: string) {
  if (isSupported) {
    try {
      performance.mark(name);
    } catch (error) {
      console.warn('Performance mark failed:', error);
    }
  }
}

/**
 * Measure time between two marks
 */
export function measure(name: string, startMark: string, endMark: string) {
  if (isSupported) {
    try {
      performance.measure(name, startMark, endMark);
      const measures = performance.getEntriesByName(name);
      return measures[measures.length - 1]?.duration || 0;
    } catch (error) {
      console.warn('Performance measure failed:', error);
      return 0;
    }
  }
  return 0;
}

/**
 * Clear all performance marks and measures
 */
export function clearPerformance() {
  if (isSupported) {
    try {
      performance.clearMarks();
      performance.clearMeasures();
    } catch (error) {
      console.warn('Performance clear failed:', error);
    }
  }
}
