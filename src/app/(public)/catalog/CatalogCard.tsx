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
      style={{
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'var(--color-card)',          /* #ffffff card surface */
        border: '1px solid var(--color-hairline)',     /* #dfe1e2 */
        borderRadius: 'var(--radius-card)',             /* 8px */
        padding: 'var(--space-4)',                      /* 24px */
        transition: 'border-color 120ms, box-shadow 120ms',
      }}
      className="hub-card-hover"
    >
      {/* F1.2: Card title (17px/1.3/600) as link + one-sentence summary */}
      <Link
        href={`/records/${record.slug}`}
        style={{ textDecoration: 'none' }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-ui)',
            fontSize: '1.0625rem',     /* 17px card title */
            lineHeight: 1.3,
            fontWeight: 600,
            color: 'var(--color-blue-60)',
            margin: '0 0 6px',
          }}
          className="card-title-hover"
        >
          {record.title}
        </h2>
      </Link>

      <p
        style={{
          fontFamily: 'var(--font-ui)',
          fontSize: '0.9375rem',        /* 15px — slightly smaller for card context */
          lineHeight: 1.5,
          color: 'var(--color-darker)',
          margin: '0 0 12px',
          display: '-webkit-box',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
          maxWidth: '100%',
        }}
      >
        {record.summary}
      </p>

      {/* F1.3: Trust signals — maturity (pill) + review status (square tag) */}
      <div
        aria-label="Trust signals"
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '6px',
          marginBottom: '12px',
        }}
      >
        {record.maturity && <MaturityBadge maturity={record.maturity} />}
        {record.review_statuses.map((rs) => (
          <ReviewStatusBadge key={rs} status={rs} />
        ))}
      </div>

      {/* F1.3: Technology areas + Contributing office — metadata style */}
      <div style={{ marginBottom: '8px' }}>
        {record.technology_areas.length > 0 && (
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.8125rem',
              color: 'var(--color-base)',
              margin: '0 0 2px',
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--color-darker)' }}>Tech: </span>
            {record.technology_areas.join(', ')}
          </p>
        )}
        {record.contributing_offices.length > 0 && (
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '0.8125rem',
              color: 'var(--color-base)',
              margin: 0,
            }}
          >
            <span style={{ fontWeight: 600, color: 'var(--color-darker)' }}>Office: </span>
            {record.contributing_offices.join(', ')}
          </p>
        )}
      </div>

      {/* F1.4: Engagement indicator tag */}
      {record.engagement_indicator !== 'none' && engagementLabel && (
        <div style={{ marginBottom: '8px' }}>
          <span
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              padding: '3px 10px',
              borderRadius: 'var(--radius-control)',
              backgroundColor: 'var(--color-blue-5)',
              color: 'var(--color-blue-70)',
              border: '1px solid var(--color-blue-10)',
              fontFamily: 'var(--font-ui)',
              fontSize: '0.8125rem',
              fontWeight: 500,
            }}
          >
            {engagementLabel}
          </span>
        </div>
      )}

      {/* F1.5: Last-reviewed date — Roboto Mono for metadata */}
      {record.last_reviewed_date && (
        <p
          style={{
            fontFamily: 'var(--font-mono)',
            fontSize: '0.75rem',
            color: 'var(--color-base)',
            margin: 'auto 0 0',   /* push to bottom of card */
            paddingTop: '8px',
          }}
        >
          Reviewed{' '}
          <time dateTime={record.last_reviewed_date}>
            {formatDate(record.last_reviewed_date)}
          </time>
        </p>
      )}

      <style>{`
        .hub-card-hover:hover {
          border-color: var(--color-light) !important;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08) !important;
        }
        .card-title-hover:hover {
          color: var(--color-blue-70) !important;
          text-decoration: underline !important;
        }
      `}</style>
    </article>
  );
}
