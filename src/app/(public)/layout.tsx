/**
 * Public route group layout.
 * Provides navigation bar for the anonymous-accessible sections of the Hub.
 */

import Link from 'next/link';

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <header className="border-b border-gray-200 bg-white">
        <nav
          aria-label="Main navigation"
          className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
        >
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="text-lg font-bold text-gray-900 hover:text-blue-700"
              >
                TSIO Innovation Hub
              </Link>
              <div className="flex gap-6">
                <Link
                  href="/catalog"
                  className="text-sm font-medium text-gray-600 hover:text-blue-700"
                >
                  Browse
                </Link>
              </div>
            </div>
          </div>
        </nav>
      </header>
      {children}
    </>
  );
}
