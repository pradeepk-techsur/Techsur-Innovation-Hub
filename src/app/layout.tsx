import type { Metadata } from 'next';

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
      <body>{children}</body>
    </html>
  );
}
