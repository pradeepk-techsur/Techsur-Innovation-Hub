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
      className="bg-gray-50 border border-gray-200 rounded-lg p-4 mt-4"
      role="complementary"
    >
      <div className="flex flex-wrap gap-3 items-center">
        {maturity && <MaturityBadge maturity={maturity} />}
        {reviewStatuses.map(rs => (
          <ReviewStatusBadge key={rs} status={rs} />
        ))}
        {displayDate && (
          <span className="text-sm text-gray-600">
            Last reviewed: <time dateTime={displayDate}>{displayDate}</time>
          </span>
        )}
      </div>

      {/* Applicable disclaimer — required by trust model when present */}
      {applicableDisclaimer && (
        <div
          className="mt-3 text-sm text-amber-800 bg-amber-50 border border-amber-200 rounded p-3"
          role="note"
          aria-label="Trust disclaimer"
        >
          {applicableDisclaimer}
        </div>
      )}
    </aside>
  );
}
