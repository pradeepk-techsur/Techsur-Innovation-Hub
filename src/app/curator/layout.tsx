import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import Link from 'next/link';

export default async function CuratorLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // AUTH-02, SEC-01: Unauthenticated → login; wrong role → 403 page (not login)
  if (!session) {
    // No valid session → redirect to login (middleware may have already done this;
    // belt+suspenders for SSR paths that bypass middleware)
    redirect('/login?returnTo=/curator');
  }

  if (session.role !== 'curator' && session.role !== 'admin') {
    // AUTH-04: Do not redirect wrong-role users to /login — they ARE logged in
    // Redirect to top-level /unauthorized (outside /curator route tree — no redirect loop)
    redirect('/unauthorized');
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', fontFamily: 'var(--font-ui)' }}>
      {/* Curator sidebar — dark blue surface */}
      <nav
        aria-label="Curator navigation"
        style={{
          width: '224px',
          flexShrink: 0,
          backgroundColor: 'var(--color-dark-surf)',  /* #162e51 */
          borderRight: '1px solid rgba(255,255,255,0.1)',
          display: 'flex',
          flexDirection: 'column',
          padding: '24px 16px',
          position: 'sticky',
          top: 0,
          height: '100vh',
          overflowY: 'auto',
        }}
      >
        {/* Hub identity */}
        <div style={{ marginBottom: '32px' }}>
          <Link
            href="/"
            style={{
              display: 'block',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.9375rem',
              fontWeight: 700,
              color: '#ffffff',
              textDecoration: 'none',
              marginBottom: '4px',
            }}
          >
            TSIO Innovation Hub
          </Link>
          <span
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.75rem',
              fontWeight: 700,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: 'var(--color-blue-30)',
            }}
          >
            {session.role === 'admin' ? 'Admin' : 'Curator'}
          </span>
        </div>

        {/* Nav links */}
        <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {[
            { href: '/curator',                           label: 'Dashboard' },
            { href: '/curator/records',                   label: 'Records' },
            { href: '/curator/records/new',               label: 'New Record' },
          ].map(({ href, label }) => (
            <li key={href}>
              <Link href={href} style={{ display: 'block', padding: '9px 12px', borderRadius: 'var(--radius-control)', fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }} className="curator-nav-link">
                {label}
              </Link>
            </li>
          ))}

          <li style={{ borderTop: '1px solid rgba(255,255,255,0.12)', margin: '8px 0' }} />

          {[
            { href: '/curator/submissions/opportunity',  label: 'Opportunities' },
            { href: '/curator/submissions/contribution', label: 'Contributions' },
            { href: '/curator/engagement',               label: 'Engagement' },
          ].map(({ href, label }) => (
            <li key={href}>
              <Link href={href} style={{ display: 'block', padding: '9px 12px', borderRadius: 'var(--radius-control)', fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }} className="curator-nav-link">
                {label}
              </Link>
            </li>
          ))}

          {session.role === 'admin' && (
            <>
              <li style={{ borderTop: '1px solid rgba(255,255,255,0.12)', margin: '8px 0' }} />
              {[
                { href: '/curator/settings', label: 'Settings' },
                { href: '/curator/audit',    label: 'Audit Log' },
              ].map(({ href, label }) => (
                <li key={href}>
                  <Link href={href} style={{ display: 'block', padding: '9px 12px', borderRadius: 'var(--radius-control)', fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }} className="curator-nav-link">
                    {label}
                  </Link>
                </li>
              ))}
            </>
          )}

          <li style={{ borderTop: '1px solid rgba(255,255,255,0.12)', margin: '8px 0' }} />
          <li>
            <Link href="/curator/reference" style={{ display: 'block', padding: '9px 12px', borderRadius: 'var(--radius-control)', fontFamily: 'var(--font-ui)', fontSize: '0.9375rem', fontWeight: 500, color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }} className="curator-nav-link">
              Content Model
            </Link>
          </li>
        </ul>

        {/* User identity at bottom */}
        <div
          style={{
            marginTop: 'auto',
            paddingTop: '16px',
            borderTop: '1px solid rgba(255,255,255,0.12)',
          }}
        >
          <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', fontWeight: 600, color: '#ffffff', margin: '0 0 2px' }}>
            {session.name}
          </p>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', margin: 0 }}>
            {session.email}
          </p>
        </div>
      </nav>

      {/* Main content area */}
      <main
        id="main-content"
        style={{
          flex: 1,
          backgroundColor: 'var(--color-surface)',
          padding: '40px 48px',
          minWidth: 0,
        }}
      >
        {children}
      </main>

      <style>{`
        .curator-nav-link:hover {
          background-color: rgba(255,255,255,0.1) !important;
          color: #ffffff !important;
        }
      `}</style>
    </div>
  );
}
