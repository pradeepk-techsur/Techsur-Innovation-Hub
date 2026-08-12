/**
 * /catalog — Server-rendered innovation catalog page.
 *
 * AUTH-01: Accessible to anonymous users — no authentication required.
 * F1.1: Browsable catalog of published innovation records.
 * F1.2–F1.5: Each card shows trust signals per CatalogCard component.
 */

import { getPublishedCatalog } from '@/lib/repositories/innovation-records.repository';
import { CatalogCard } from './CatalogCard';
import { Breadcrumb } from '@/components/Breadcrumb';

export const metadata = {
  title: 'Innovation Catalog | TSIO Innovation Hub',
  description:
    'Browse published Judiciary innovation work: proofs of concept, pilots, and validated patterns from I&R teams.',
};

// Force dynamic rendering — this page fetches from PostgreSQL at runtime and cannot be statically prerendered at build time
export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  const records = await getPublishedCatalog();

  return (
    <div
      id="main-content"
      tabIndex={-1}
      style={{ backgroundColor: 'var(--color-surface)', minHeight: '60vh' }}
    >
      {/* Page hero */}
      <div
        style={{
          backgroundColor: 'var(--color-blue-80)',
          padding: '40px 0 32px',
          marginBottom: '40px',
        }}
      >
        <div className="hub-container">
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Innovation Catalog' }]} light />
          <h1
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '2.5rem',
              lineHeight: 1.2,
              fontWeight: 700,
              letterSpacing: '-0.01em',
              color: '#ffffff',
              margin: '0 0 8px',
            }}
          >
            Innovation Catalog
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '1.0625rem',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.8)',
              margin: 0,
              maxWidth: '55ch',
            }}
          >
            Discover Judiciary innovation work — proofs of concept, pilots, validated patterns, and lessons learned.
          </p>
        </div>
      </div>

      {/* Catalog grid */}
      <div className="hub-container" style={{ paddingBottom: '80px' }}>
        {records.length === 0 ? (
          <div
            style={{
              backgroundColor: 'var(--color-card)',
              border: '1px solid var(--color-hairline)',
              borderRadius: 'var(--radius-card)',
              padding: '48px 40px',
              textAlign: 'center',
            }}
          >
            <p
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '1rem',
                color: 'var(--color-base)',
                margin: 0,
              }}
            >
              No published innovation records yet.
            </p>
          </div>
        ) : (
          <ul
            aria-label="Innovation records catalog"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
              gap: '24px',
              listStyle: 'none',
              margin: 0,
              padding: 0,
            }}
          >
            {records.map((record) => (
              <li key={record.id}>
                <CatalogCard record={record} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
