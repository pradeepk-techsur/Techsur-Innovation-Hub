/**
 * /records/[slug] — SSR Innovation Record Detail Page
 *
 * Displays an innovation record with executive and technical perspective toggle (F4.1–F4.4).
 *   F4.1 — Single record, two perspectives (ARIA tablist)
 *   F4.2 — Executive perspective: problem, outcome, maturity, ownership, next step
 *   F4.3 — Technical perspective: architecture, tools, security, limitations, reuse, artifacts
 *   F4.4 — Both perspectives draw from the same record object; TrustBanner shown in both
 *
 * Auth: AUTH-01 — anonymous access (no login required for Phase 1/2).
 * Security: Uses getRecordBySlug() which filters publication_state='published'.
 *   Draft records → notFound() → 404. No dangerouslySetInnerHTML — all values JSX-escaped.
 */

import { notFound } from 'next/navigation';
import { getRecordBySlug } from '@/lib/repositories/innovation-records.repository';
import { PerspectiveToggle } from './PerspectiveToggle';
import { SourceBasisBanner } from './SourceBasisBanner';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function RecordDetailPage({ params }: PageProps) {
  const { slug } = await params;
  const result = await getRecordBySlug(slug);
  if (!result) notFound();

  const { record, artifacts, next_actions } = result;

  return (
    <main id="main-content">
      <article aria-label={`Innovation record: ${record.title}`} className="max-w-4xl mx-auto px-4 py-8">
        <header className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">{record.title}</h1>
          {record.summary && (
            <p className="mt-2 text-lg text-gray-600">{record.summary}</p>
          )}
          {record.source_basis && (
            <SourceBasisBanner sourceBasis={record.source_basis} />
          )}
        </header>

        {/**
         * PerspectiveToggle replaces the nine flat RecordSection calls from plan 01-03.
         * Executive and Technical views are now audience-specific with TrustBanner in each.
         * All record data passes as props from the SSR page — PerspectiveToggle is 'use client'
         * for tab state only; no client-side data fetching occurs (F4.4).
         */}
        <PerspectiveToggle
          record={record}
          artifacts={artifacts}
          next_actions={next_actions}
        />
      </article>
    </main>
  );
}
