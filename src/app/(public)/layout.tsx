/**
 * Public route group layout.
 * Provides navigation bar for the anonymous-accessible sections of the Hub.
 */

import Link from 'next/link';
import { getSession } from '@/lib/auth/session';
import { LogoutButton } from './LogoutButton';

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

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
                <Link
                  href="/search"
                  className="text-sm font-medium text-gray-600 hover:text-blue-700"
                >
                  Search
                </Link>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {session ? (
                <>
                  <span className="text-sm text-gray-600">{session.name}</span>
                  <LogoutButton />
                </>
              ) : (
                <Link
                  href="/login"
                  className="text-sm font-medium text-gray-600 hover:text-blue-700"
                >
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </nav>
      </header>
      {children}
    </>
  );
}
