import Link from 'next/link';

/**
 * Hub home page — dark-surface hero with CTA links to Browse and Search.
 * Typography and colors from Color & Type Reference v0.1.
 */
export default function Home() {
  return (
    <div style={{ backgroundColor: 'var(--color-surface)', minHeight: '80vh' }}>
      {/* Hero */}
      <div
        style={{
          backgroundColor: 'var(--color-blue-80)',
          padding: '80px 0 72px',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            padding: '0 24px',
          }}
        >
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.875rem',
              fontWeight: 600,
              letterSpacing: '0.1em',
              textTransform: 'uppercase',
              color: 'var(--color-blue-30)',
              margin: '0 0 16px',
            }}
          >
            TSIO Innovation &amp; Research
          </p>
          <h1
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '2.5rem',
              lineHeight: 1.2,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: '#ffffff',
              margin: '0 0 24px',
              maxWidth: '20ch',
            }}
          >
            Innovation Hub
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '1.125rem',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.8)',
              margin: '0 0 40px',
              maxWidth: '52ch',
            }}
          >
            A single, governed entry point where Judiciary stakeholders can discover
            innovation work, understand what was learned, and take informed next steps
            toward adoption.
          </p>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px' }}>
            <Link
              href="/catalog"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '44px',
                padding: '0 24px',
                backgroundColor: 'var(--color-blue-60)',
                color: '#ffffff',
                fontFamily: 'var(--font-ui)',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-control)',
                textDecoration: 'none',
                border: '2px solid var(--color-blue-60)',
                transition: 'background 120ms',
              }}
            >
              Browse Catalog →
            </Link>
            <Link
              href="/search"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                minHeight: '44px',
                padding: '0 24px',
                backgroundColor: 'transparent',
                color: '#ffffff',
                fontFamily: 'var(--font-ui)',
                fontSize: '1rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-control)',
                textDecoration: 'none',
                border: '2px solid rgba(255,255,255,0.5)',
                transition: 'border-color 120ms',
              }}
            >
              Search Records
            </Link>
          </div>
        </div>
      </div>

      {/* Why the Hub */}
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '64px 24px',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
          gap: '32px',
        }}
      >
        {[
          {
            title: 'Discover',
            body: 'Find relevant innovation work using mission-problem language — no need to know internal project names or folder locations.',
            href: '/catalog',
            cta: 'Browse catalog',
          },
          {
            title: 'Understand',
            body: 'Each record explains the problem, what was explored, what was learned, and how mature the work is — so you can assess relevance quickly.',
            href: '/search',
            cta: 'Search records',
          },
          {
            title: 'Engage',
            body: 'Request a demonstration, explore adoption, share related work, or contact I&R — directly from the record page.',
            href: '/submit-opportunity',
            cta: 'Submit an opportunity',
          },
        ].map(({ title, body, href, cta }) => (
          <div
            key={title}
            style={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--radius-card)',
              padding: '32px',
            }}
          >
            <h2
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '1.375rem',
                lineHeight: 1.3,
                fontWeight: 600,
                color: 'var(--color-ink)',
                margin: '0 0 12px',
              }}
            >
              {title}
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '1rem',
                lineHeight: 1.6,
                color: 'var(--color-darker)',
                margin: '0 0 20px',
              }}
            >
              {body}
            </p>
            <Link
              href={href}
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.9375rem',
                fontWeight: 600,
                color: 'var(--color-blue-60)',
                textDecoration: 'none',
              }}
            >
              {cta} →
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
