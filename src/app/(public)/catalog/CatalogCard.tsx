/**
 * CatalogCard — Innovation record card for the catalog listing.
 *
 * Implements F1.2–F1.5 display requirements:
 * F1.2: Title (as link to record detail) and one-sentence summary
 * F1.3: Technology areas, maturity badge, review status badge(s), contributing office
 * F1.4: Engagement indicator (when not 'none')
 * F1.5: Last-reviewed date
 * F1.6: MaturityBadge and ReviewStatusBadge are visually distinct (different shape/icon/color scheme)
 *
 * Threat T-01-02-04: No dangerouslySetInnerHTML — all string interpolations JSX-escaped.
 * Threat T-01-02-02: No artifact URLs in CatalogCardData — restricted artifact access is at record detail level.
 */

import Link from 'next/link';
import { MaturityBadge } from './MaturityBadge';
import { ReviewStatusBadge } from './ReviewStatusBadge';
import type { CatalogCardData } from '@/lib/db/types';

interface Props {
  record: CatalogCardData;
}

const ENGAGEMENT_LABELS: Record<string, string> = {
  demo_available: 'Demo Available',
  seeking_adoption_partner: 'Seeking Adoption Partner',
  technical_playbook_available: 'Technical Playbook Available',
  reference_pattern_available: 'Reference Pattern Available',
  monitoring_only: 'Monitoring Only',
  archived: 'Archived',
  none: '',
};

function formatDate(dateStr: string): string {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}

export function CatalogCard({ record }: Props) {
  const engagementLabel = ENGAGEMENT_LABELS[record.engagement_indicator] ?? '';

  return (
    <article
      aria-label={`Innovation record: ${record.title}`}
      className="flex flex-col border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
    >
      {/* F1.2: Title as link to record detail, and one-sentence summary */}
      <Link href={`/records/${record.slug}`} className="block group">
        <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-700 group-hover:underline leading-snug">
          {record.title}
        </h2>
      </Link>
      <p className="mt-1 text-sm text-gray-600 leading-snug line-clamp-2">
        {record.summary}
      </p>

      {/* F1.3: Maturity + review status badges (F1.6: visually distinct — MaturityBadge = filled ▲ pill; ReviewStatusBadge = outlined ✓ rounded) */}
      <div
        className="flex flex-wrap gap-1.5 mt-3"
        aria-label="Trust signals"
      >
        {record.maturity && (
          <MaturityBadge maturity={record.maturity} />
        )}
        {record.review_statuses.map((rs) => (
          <ReviewStatusBadge key={rs} status={rs} />
        ))}
      </div>

      {/* F1.3: Technology areas and Contributing office */}
      <div className="mt-2 space-y-0.5 text-xs text-gray-600">
        {record.technology_areas.length > 0 && (
          <p>
            <span className="font-medium text-gray-700">Technology:</span>{' '}
            {record.technology_areas.join(', ')}
          </p>
        )}
        {record.contributing_offices.length > 0 && (
          <p>
            <span className="font-medium text-gray-700">Contributing office:</span>{' '}
            {record.contributing_offices.join(', ')}
          </p>
        )}
      </div>

      {/* F1.4: Engagement indicator (hidden when 'none') */}
      {record.engagement_indicator !== 'none' && engagementLabel && (
        <p className="mt-2 text-xs font-semibold text-blue-700">
          {engagementLabel}
        </p>
      )}

      {/* F1.5: Last-reviewed date */}
      {record.last_reviewed_date && (
        <p className="mt-2 text-xs text-gray-500">
          Last reviewed:{' '}
          <time dateTime={record.last_reviewed_date}>
            {formatDate(record.last_reviewed_date)}
          </time>
        </p>
      )}
    </article>
  );
}
