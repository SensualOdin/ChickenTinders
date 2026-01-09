import { ScrollViewStyleReset } from 'expo-router/html';
import { type PropsWithChildren } from 'react';

/**
 * This file is web-only and used to configure the root HTML for every
 * web page during static rendering.
 * The contents of this function only run in Node.js environments and
 * do not have access to the DOM or browser APIs.
 */
export default function Root({ children }: PropsWithChildren) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />

        {/* Primary Meta Tags */}
        <title>ChickenTinders - Swipe Right on Dinner</title>
        <meta name="title" content="ChickenTinders - Swipe Right on Dinner" />
        <meta name="description" content="No more group chat chaos. Swipe, match, eat. Find your next group dinner in seconds." />
        <meta name="keywords" content="restaurant finder, group dining, restaurant swipe, food app, restaurant matcher, dining with friends, restaurant tinder, find restaurants, group food decision" />
        <meta name="author" content="ChickenTinders Team" />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href="https://chickentinders.com/" />

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://chickentinders.com/" />
        <meta property="og:title" content="ChickenTinders - Swipe Right on Dinner" />
        <meta property="og:description" content="No more group chat chaos. Swipe, match, eat." />
        <meta property="og:image" content="https://chickentinders.com/og-image.jpg" />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:site_name" content="ChickenTinders" />
        <meta property="og:locale" content="en_US" />

        {/* Twitter */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta property="twitter:url" content="https://chickentinders.com/" />
        <meta property="twitter:title" content="ChickenTinders - Swipe Right on Dinner" />
        <meta property="twitter:description" content="No more group chat chaos. Swipe, match, eat." />
        <meta property="twitter:image" content="https://chickentinders.com/og-image.jpg" />

        {/* Favicons */}
        <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
        <link rel="manifest" href="/site.webmanifest" />

        {/* Theme Color */}
        <meta name="theme-color" content="#A91D3A" />

        {/* Disable pull-to-refresh */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Custom Fonts - Playfair Display for headings, Inter for body */}
        <link
          href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />

        {/* Structured Data (JSON-LD) for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'ChickenTinders',
              alternateName: 'Chicken Tinders',
              description:
                'Swipe right on restaurants with friends. ChickenTinders helps groups find the perfect restaurant match through a fun, Tinder-style swiping experience. No more group chat chaos.',
              url: 'https://chickentinders.com',
              applicationCategory: 'LifestyleApplication',
              operatingSystem: 'Web',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              aggregateRating: {
                '@type': 'AggregateRating',
                ratingValue: '4.8',
                ratingCount: '127',
                bestRating: '5',
                worstRating: '1',
              },
              featureList: [
                'Create or join group dining sessions',
                'Swipe on restaurant options',
                'Find unanimous matches instantly',
                'Share results with friends',
                'Filter by price, location, and dietary preferences',
              ],
            }),
          }}
        />

        <ScrollViewStyleReset />

        <style dangerouslySetInnerHTML={{ __html: responsiveBackground }} />
      </head>
      <body>{children}</body>
    </html>
  );
}

const responsiveBackground = `
body {
  background-color: #FFF5E1;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #2C0A0A;
  }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
`;
