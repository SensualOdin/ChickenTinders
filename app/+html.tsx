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

        {/* Open Graph / Facebook */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://chickentinders.com/" />
        <meta property="og:title" content="ChickenTinders - Swipe Right on Dinner" />
        <meta property="og:description" content="No more group chat chaos. Swipe, match, eat." />
        <meta property="og:image" content="https://chickentinders.com/og-image.jpg" />

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
        <meta name="theme-color" content="#E53935" />

        {/* Disable pull-to-refresh */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />

        {/* Preconnect to improve performance */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />

        {/* Inter Font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap"
          rel="stylesheet"
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
  background-color: #FAFAFA;
}
@media (prefers-color-scheme: dark) {
  body {
    background-color: #1F1A1E;
  }
}
`;
