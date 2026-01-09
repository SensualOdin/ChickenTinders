/**
 * Image optimization utilities for better performance
 */

/**
 * Generate srcset for responsive images
 * Helps browser choose optimal image size
 */
export function generateSrcSet(baseUrl: string, widths: number[]): string {
  return widths.map((width) => `${baseUrl}?w=${width} ${width}w`).join(', ');
}

/**
 * Generate sizes attribute for responsive images
 * Tells browser which image size to use at different viewport widths
 */
export function generateSizes(breakpoints: { maxWidth: string; imageWidth: string }[]): string {
  return breakpoints.map((bp) => `(max-width: ${bp.maxWidth}) ${bp.imageWidth}`).join(', ');
}

/**
 * Lazy load images using Intersection Observer
 * Only loads images when they're about to enter viewport
 */
export function lazyLoadImage(img: HTMLImageElement, src: string) {
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            img.src = src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        });
      },
      {
        rootMargin: '50px', // Start loading 50px before entering viewport
      }
    );

    observer.observe(img);
  } else {
    // Fallback for browsers without Intersection Observer
    img.src = src;
  }
}

/**
 * Preload critical images
 * Use for above-the-fold images
 */
export function preloadImage(src: string): Promise<void> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
}

/**
 * Get optimal image format based on browser support
 */
export function getOptimalImageFormat(): 'webp' | 'jpeg' {
  if (typeof window === 'undefined') return 'jpeg';

  // Check WebP support
  const canvas = document.createElement('canvas');
  canvas.width = 1;
  canvas.height = 1;

  return canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0 ? 'webp' : 'jpeg';
}

/**
 * Calculate appropriate image dimensions based on device pixel ratio
 */
export function getOptimalImageSize(
  baseWidth: number,
  baseHeight: number
): { width: number; height: number } {
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

  // Cap at 2x to avoid unnecessarily large images
  const multiplier = Math.min(dpr, 2);

  return {
    width: Math.round(baseWidth * multiplier),
    height: Math.round(baseHeight * multiplier),
  };
}

/**
 * Image optimization best practices
 */
export const IMAGE_OPTIMIZATION_TIPS = {
  // Use modern formats
  formats: ['WebP with JPEG fallback', 'AVIF for even better compression'],

  // Responsive images
  responsive: [
    'Use srcset and sizes attributes',
    'Provide multiple image sizes',
    'Let browser choose optimal size',
  ],

  // Lazy loading
  lazyLoading: ['Use loading="lazy" attribute', 'Implement Intersection Observer', 'Eager load above-the-fold images'],

  // Compression
  compression: [
    'JPEG: 80-85% quality for photos',
    'PNG: Use for transparency only',
    'WebP: 75-85% quality, smaller than JPEG',
  ],

  // Sizing
  sizing: [
    'Serve images at exact display size',
    'Account for device pixel ratio (max 2x)',
    'Dont serve images larger than needed',
  ],
};
