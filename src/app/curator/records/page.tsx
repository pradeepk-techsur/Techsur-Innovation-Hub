import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import Link from 'next/link';

interface RecordSummary {
  id: string;
  slug: string;
  title: string;
  publication_state: string;
  maturity: string | null;
  review_statuses: string[];
  updated_at: string;
  owner_steward: string;
}

interface RecordListResponse {
  data: RecordSummary[];
  meta: { page: number; page_size: number; total: number };
}

const STATE_LABELS: Record<string, string> = {
  draft: 'Draft',
  submitted_for_review: 'Submitted',
  published: 'Published',
  superseded: 'Superseded',
  archived: 'Archived',
  retired: 'Retired',
};

const STATE_COLORS: Record<string, string> = {
  draft: 'bg-gray-100 text-gray-700',
  submitted_for_review: 'bg-yellow-100 text-yellow-800',
  published: 'bg-green-100 text-green-800',
  superseded: 'bg-orange-100 text-orange-800',
  archived: 'bg-blue-100 text-blue-800',
  retired: 'bg-red-100 text-red-800',
};

const MATURITY_LABELS: Record<string, string> = {
  idea: 'Idea',
  evaluated_idea: 'Evaluated Idea',
  experiment_poc: 'Experiment/PoC',
  prototype_pilot: 'Prototype/Pilot',
  production_validated: 'Production Validated',
  archived_retired: 'Archived/Retired',
};

async function getRecords(state: string | null, page: number): Promise<RecordListResponse | null> {
  const params = new URLSearchParams({ page: String(page), page_size: '20' });
  if (state) params.set('state', state);
  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/v1/curator/records?${params}`,
      { cache: 'no-store' }
    );
    if (!res.ok) return null;
    return (await res.json()) as RecordListResponse;
  } catch {
    return null;
  }
}

export default async function CuratorRecordsPage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string; page?: string }>;
}) {
  const session = await getSession();
  if (!session) redirect('/login?returnTo=/curator/records');

  const sp = await searchParams;
  const currentState = sp.state ?? null;
  const currentPage = Math.max(1, Number(sp.page ?? 1));

  const result = await getRecords(currentState, currentPage);

  const allStates = ['draft', 'submitted_for_review', 'published', 'superseded', 'archived', 'retired'];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Innovation Records</h1>
        <Link
          href="/curator/records/new"
          className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-medium text-sm"
        >
          + New Record
        </Link>
      </div>

      {/* State filter buttons */}
      <div className="flex flex-wrap gap-2 mb-4">
        <Link
          href="/curator/records"
          className={`px-3 py-1 rounded-full text-sm font-medium border ${
            !currentState ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
          }`}
        >
          All
        </Link>
        {allStates.map(state => (
          <Link
            key={state}
            href={`/curator/records?state=${state}`}
            className={`px-3 py-1 rounded-full text-sm font-medium border ${
              currentState === state
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
            }`}
          >
            {STATE_LABELS[state]}
          </Link>
        ))}
      </div>

      {result ? (
        <>
          <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Title</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">State</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Maturity</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Owner</th>
                  <th className="px-4 py-3 text-left font-medium text-gray-700">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {result.data.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                      No records found
                      {currentState ? ` with state "${STATE_LABELS[currentState] ?? currentState}"` : ''}.
                    </td>
                  </tr>
                ) : (
                  result.data.map(record => (
                    <tr key={record.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <Link
                          href={`/curator/records/${record.id}`}
                          className="font-medium text-blue-700 hover:underline"
                        >
                          {record.title || <em className="text-gray-400">Untitled</em>}
                        </Link>
                        <div className="text-xs text-gray-400 font-mono mt-0.5">{record.slug}</div>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${
                            STATE_COLORS[record.publication_state] ?? 'bg-gray-100 text-gray-700'
                          }`}
                        >
                          {STATE_LABELS[record.publication_state] ?? record.publication_state}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {record.maturity ? MATURITY_LABELS[record.maturity] ?? record.maturity : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {record.owner_steward || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs">
                        {new Date(record.updated_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          {result.meta.total > result.meta.page_size && (
            <div className="mt-4 flex items-center gap-2 text-sm text-gray-600">
              <span>
                Showing {(currentPage - 1) * result.meta.page_size + 1}–
                {Math.min(currentPage * result.meta.page_size, result.meta.total)} of {result.meta.total}
              </span>
              {currentPage > 1 && (
                <Link
                  href={`/curator/records?${new URLSearchParams({ ...(currentState ? { state: currentState } : {}), page: String(currentPage - 1) })}`}
                  className="px-3 py-1 border rounded hover:bg-gray-50"
                >
                  ← Prev
                </Link>
              )}
              {currentPage * result.meta.page_size < result.meta.total && (
                <Link
                  href={`/curator/records?${new URLSearchParams({ ...(currentState ? { state: currentState } : {}), page: String(currentPage + 1) })}`}
                  className="px-3 py-1 border rounded hover:bg-gray-50"
                >
                  Next →
                </Link>
              )}
            </div>
          )}
        </>
      ) : (
        <p className="text-gray-500">Failed to load records.</p>
      )}
    </div>
  );
}
