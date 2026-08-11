/**
 * SearchResultCard — A single search result card preserving all trust signals.
 *
 * F2.4: Trust information (maturity, review statuses, contributing office, last reviewed)
 *       MUST be preserved in every search result — never stripped for density.
 * Links to the full innovation record at /records/[slug].
 */

import Link from 'next/link';
import { MaturityBadge } from '@/app/(public)/catalog/MaturityBadge';
import { ReviewStatusBadge } from '@/app/(public)/catalog/ReviewStatusBadge';
import type { CatalogCardData } from '@/lib/db/types';

interface Props {
  record: CatalogCardData & { reuse_potential?: string | null };
  query?: string;
}

export function SearchResultCard({ record, query: _query }: Props) {
  return (
    <article
      aria-label={`Search result: ${record.title}`}
      className="rounded-lg border border-gray-200 p-4 transition-shadow hover:shadow-md"
    >
      <Link href={`/records/${record.slug}`} className="group">
        <h2 className="text-base font-semibold text-gray-900 group-hover:text-blue-700 group-hover:underline">
          {record.title}
        </h2>
      </Link>

      {record.summary && (
        <p className="mt-1 text-sm text-gray-600">{record.summary}</p>
      )}

      {/* F2.4: Trust signals MUST be preserved in every search result */}
      <div className="mt-3 flex flex-wrap gap-2" aria-label="Trust signals">
        {record.maturity && <MaturityBadge maturity={record.maturity} />}
        {record.review_statuses?.map(rs => (
          <ReviewStatusBadge key={rs} status={rs} />
        ))}
      </div>

      <div className="mt-2 space-y-0.5 text-sm text-gray-600">
        {record.technology_areas && record.technology_areas.length > 0 && (
          <p>
            <span className="font-medium">Technology:</span>{' '}
            {record.technology_areas.join(', ')}
          </p>
        )}
        {record.mission_areas && record.mission_areas.length > 0 && (
          <p>
            <span className="font-medium">Mission area:</span>{' '}
            {record.mission_areas.join(', ')}
          </p>
        )}
        {record.contributing_offices && record.contributing_offices.length > 0 && (
          <p>
            <span className="font-medium">Contributing office:</span>{' '}
            {record.contributing_offices.join(', ')}
          </p>
        )}
      </div>

      {record.last_reviewed_date && (
        <p className="mt-2 text-xs text-gray-400">
          Last reviewed:{' '}
          <time dateTime={record.last_reviewed_date}>{record.last_reviewed_date}</time>
        </p>
      )}
    </article>
  );
}
