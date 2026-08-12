'use server';

/**
 * Public route group layout — USWDS 3 derived design.
 *
 * Header: hub-blue-80 (#162e51) dark surface per spec.
 * Footer: light surface with submit links.
 * Auth state: Sign In / user name + Sign Out (IA-05).
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
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* ── Site Header ──────────────────────────────────────────────────── */}
      <header
        style={{
          backgroundColor: 'var(--color-blue-80)',  /* #162e51 — dark surface */
          borderBottom: '4px solid var(--color-blue-60)',
        }}
      >
        <div
          className="hub-container"
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '64px',
          }}
        >
          {/* Logo + primary nav */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '40px' }}>
            <Link
              href="/"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '1.0625rem',
                fontWeight: 700,
                color: '#ffffff',
                textDecoration: 'none',
                letterSpacing: '-0.01em',
                whiteSpace: 'nowrap',
              }}
            >
              TSIO Innovation Hub
            </Link>

            <nav aria-label="Main navigation">
              <ul
                style={{
                  display: 'flex',
                  gap: '8px',
                  listStyle: 'none',
                  margin: 0,
                  padding: 0,
                }}
              >
                {[
                  { href: '/catalog', label: 'Browse' },
                  { href: '/search',  label: 'Search' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.9375rem',
                        fontWeight: 500,
                        color: 'rgba(255,255,255,0.85)',
                        textDecoration: 'none',
                        padding: '8px 12px',
                        borderRadius: 'var(--radius-control)',
                        display: 'inline-block',
                        minHeight: '44px',
                        lineHeight: '28px',
                        transition: 'background 100ms',
                      }}
                      className="header-nav-link"
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Auth section (IA-05) */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {session ? (
              <>
                <span
                  style={{
                    fontFamily: 'var(--font-ui)',
                    fontSize: '0.875rem',
                    color: 'rgba(255,255,255,0.75)',
                  }}
                >
                  {session.name}
                </span>
                {(session.role === 'curator' || session.role === 'admin') && (
                  <Link
                    href="/curator"
                    style={{
                      fontFamily: 'var(--font-ui)',
                      fontSize: '0.875rem',
                      fontWeight: 500,
                      color: 'var(--color-blue-10)',
                      textDecoration: 'none',
                      padding: '8px 12px',
                      minHeight: '44px',
                      display: 'inline-flex',
                      alignItems: 'center',
                    }}
                  >
                    Curator ↗
                  </Link>
                )}
                <LogoutButton />
              </>
            ) : (
              <Link
                href="/login"
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  color: '#ffffff',
                  textDecoration: 'none',
                  border: '1.5px solid rgba(255,255,255,0.5)',
                  borderRadius: 'var(--radius-control)',
                  padding: '8px 16px',
                  minHeight: '44px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  transition: 'border-color 100ms, background 100ms',
                }}
              >
                Sign In
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* ── Main content ─────────────────────────────────────────────────── */}
      <main style={{ flex: 1 }}>
        {children}
      </main>

      {/* ── Site Footer ──────────────────────────────────────────────────── */}
      <footer
        style={{
          backgroundColor: 'var(--color-dark-surf)',
          borderTop: '4px solid var(--color-blue-60)',
          padding: '40px 0 24px',
          marginTop: 'auto',
        }}
      >
        <div className="hub-container">
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr 1fr',
              gap: '40px',
              marginBottom: '32px',
            }}
          >
            {/* Column 1 — Hub identity */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.9375rem',
                  fontWeight: 700,
                  color: '#ffffff',
                  margin: '0 0 8px',
                }}
              >
                TSIO Innovation Hub
              </p>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.875rem',
                  color: 'rgba(255,255,255,0.65)',
                  margin: 0,
                  maxWidth: '28ch',
                  lineHeight: 1.5,
                }}
              >
                Judiciary innovation work — discoverable, understandable, actionable.
              </p>
            </div>

            {/* Column 2 — Discover */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  margin: '0 0 12px',
                }}
              >
                Discover
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { href: '/catalog', label: 'Browse Catalog' },
                  { href: '/search',  label: 'Search Records' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.875rem',
                        color: 'rgba(255,255,255,0.75)',
                        textDecoration: 'none',
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Column 3 — Engage */}
            <div>
              <p
                style={{
                  fontFamily: 'var(--font-ui)',
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  color: 'rgba(255,255,255,0.5)',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  margin: '0 0 12px',
                }}
              >
                Engage
              </p>
              <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '8px' }}>
                {[
                  { href: '/submit-opportunity',  label: 'Submit an Opportunity' },
                  { href: '/submit-contribution', label: 'Share Innovation Work' },
                ].map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      style={{
                        fontFamily: 'var(--font-ui)',
                        fontSize: '0.875rem',
                        color: 'rgba(255,255,255,0.75)',
                        textDecoration: 'none',
                      }}
                    >
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Footer bottom bar */}
          <div
            style={{
              borderTop: '1px solid rgba(255,255,255,0.15)',
              paddingTop: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '12px',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.8125rem',
                color: 'rgba(255,255,255,0.5)',
                margin: 0,
              }}
            >
              Administrative Office of US Courts · TSIO Innovation &amp; Research
            </p>
            <p
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.75rem',
                color: 'rgba(255,255,255,0.35)',
                margin: 0,
              }}
            >
              USWDS 3 · WCAG 2.1 AA
            </p>
          </div>
        </div>
      </footer>

      {/* Inline style for header nav hover — needed since CSS modules not in use */}
      <style>{`
        .header-nav-link:hover {
          background-color: rgba(255,255,255,0.1) !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
