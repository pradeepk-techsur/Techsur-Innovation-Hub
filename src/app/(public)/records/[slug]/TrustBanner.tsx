/**
 * TrustBanner — prominent trust signal display for innovation record detail pages.
 *
 * Renders maturity badge, review status badge(s), last-reviewed date, and
 * the applicable disclaimer (when non-empty) in an accessible complementary landmark.
 *
 * Implements F3.5 (Maturity & Readiness trust signals) and SEC-11 (visual trust model).
 * Reuses MaturityBadge and ReviewStatusBadge from the catalog to maintain consistency.
 */

import { MaturityBadge } from '@/app/(public)/catalog/MaturityBadge';
import { ReviewStatusBadge } from '@/app/(public)/catalog/ReviewStatusBadge';
import type { MaturityValue } from '@/lib/db/types';

interface Props {
  maturity: MaturityValue | null;
  reviewStatuses: string[];
  lastReviewedDate: string | null;
  applicableDisclaimer: string;
}

/**
 * Converts a last_reviewed_date value to a display-safe string.
 * node-postgres returns DATE columns as JavaScript Date objects at runtime
 * even when TypeScript types them as string — guard against that here.
 */
function formatReviewDate(value: string | Date | null): string | null {
  if (!value) return null;
  if (value instanceof Date) {
    return value.toISOString().slice(0, 10); // YYYY-MM-DD
  }
  // If the string looks like an ISO datetime (from pg), extract just the date part
  if (typeof value === 'string' && value.length > 10 && value.includes('T')) {
    return value.slice(0, 10);
  }
  return value;
}

export function TrustBanner({ maturity, reviewStatuses, lastReviewedDate, applicableDisclaimer }: Props) {
  const displayDate = formatReviewDate(lastReviewedDate as string | Date | null);
  return (
    <aside
      aria-label="Trust and maturity information"
      role="complementary"
      style={{
        backgroundColor: 'var(--color-blue-5)',
        border: '1px solid var(--color-blue-10)',
        borderRadius: 'var(--radius-card)',
        padding: 'var(--space-3) var(--space-4)',
        marginTop: 'var(--space-3)',
      }}
    >
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
        {maturity && <MaturityBadge maturity={maturity} />}
        {reviewStatuses.map(rs => (
          <ReviewStatusBadge key={rs} status={rs} />
        ))}
        {displayDate && (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.8125rem',
              color: 'var(--color-base)',
            }}
          >
            Reviewed{' '}
            <time dateTime={displayDate}>{displayDate}</time>
          </span>
        )}
      </div>

      {/* Applicable disclaimer — trust model requires this when present */}
      {applicableDisclaimer && (
        <div
          role="note"
          aria-label="Trust disclaimer"
          style={{
            marginTop: 'var(--space-3)',
            backgroundColor: 'var(--color-warning-bg)',
            borderLeft: '4px solid var(--color-warning)',
            borderRadius: '0 var(--radius-control) var(--radius-control) 0',
            padding: 'var(--space-2) var(--space-3)',
            fontFamily: 'var(--font-ui)',
            fontSize: '0.875rem',
            color: 'var(--color-ink)',
            lineHeight: 1.5,
          }}
        >
          {applicableDisclaimer}
        </div>
      )}
    </aside>
  );
}
