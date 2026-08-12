import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'TSIO Innovation Hub',
  description: 'Judiciary Innovation & Research curated knowledge portal',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {/* WCAG 2.1 AA: Skip to main content for keyboard navigation */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:px-4 focus:py-2 focus:top-2 focus:left-2 focus:rounded-control"
          style={{
            backgroundColor: 'var(--color-blue-60)',
            color: '#ffffff',
            fontFamily: 'var(--font-ui)',
            fontWeight: 600,
          }}
        >
          Skip to main content
        </a>
        {children}
      </body>
    </html>
  );
}
