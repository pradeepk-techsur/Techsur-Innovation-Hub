/**
 * SearchPage — SSR search page at /search
 *
 * F2.1: User types mission-problem language and sees ranked results.
 * F2.3: Filter panel allows faceted filtering across 6 dimensions.
 * F2.4: Every result card preserves all trust signals.
 * F2.5: Problem-language queries work without formal project title knowledge.
 *
 * Reads initial state from URL params (q, maturity[], mission_areas[], …)
 * and fetches both search results and facets concurrently via the backend APIs.
 *
 * Deliberately calls the internal API via fetch (not the service directly) so
 * that facets/search always go through the same validation and response shape
 * that external callers see.
 */

import { Suspense } from 'react';
import { SearchForm } from './SearchForm';
import { FilterPanel } from './FilterPanel';
import { SearchResultCard } from './SearchResultCard';
import { ActiveFilters } from './ActiveFilters';

type SearchParamsShape = {
  q?: string;
  'maturity[]'?: string | string[];
  'mission_areas[]'?: string | string[];
  'technology_areas[]'?: string | string[];
  'review_statuses[]'?: string | string[];
  'contributing_offices[]'?: string | string[];
  reuse_potential?: string;
  page?: string;
};

interface SearchPageProps {
  searchParams: Promise<SearchParamsShape>;
}

function toArray(val: string | string[] | undefined): string[] {
  if (!val) return [];
  return Array.isArray(val) ? val : [val];
}

async function getSearchResults(params: SearchParamsShape) {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  const url = new URL('/api/v1/search', base);

  if (params.q) url.searchParams.set('q', params.q);
  toArray(params['maturity[]']).forEach(v => url.searchParams.append('maturity[]', v));
  toArray(params['mission_areas[]']).forEach(v => url.searchParams.append('mission_areas[]', v));
  toArray(params['technology_areas[]']).forEach(v => url.searchParams.append('technology_areas[]', v));
  toArray(params['review_statuses[]']).forEach(v => url.searchParams.append('review_statuses[]', v));
  toArray(params['contributing_offices[]']).forEach(v => url.searchParams.append('contributing_offices[]', v));
  if (params.reuse_potential) url.searchParams.set('reuse_potential', params.reuse_potential);
  if (params.page) url.searchParams.set('page', params.page);

  try {
    const res = await fetch(url.toString(), { cache: 'no-store' });
    if (!res.ok) return { data: [], meta: { total: 0, page: 1, page_size: 20, query: '', active_filters: {} } };
    return res.json();
  } catch {
    return { data: [], meta: { total: 0, page: 1, page_size: 20, query: '', active_filters: {} } };
  }
}

async function getFacets() {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000';
  try {
    const res = await fetch(`${base}/api/v1/search/facets`, { cache: 'no-store' });
    if (!res.ok) return null;
    const body = await res.json();
    return body.data ?? null;
  } catch {
    return null;
  }
}

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const params = await searchParams;
  const [searchResult, facets] = await Promise.all([
    getSearchResults(params),
    getFacets(),
  ]);

  const activeFilters = {
    maturity: toArray(params['maturity[]']),
    mission_areas: toArray(params['mission_areas[]']),
    technology_areas: toArray(params['technology_areas[]']),
    review_statuses: toArray(params['review_statuses[]']),
    contributing_offices: toArray(params['contributing_offices[]']),
    reuse_potential: params.reuse_potential,
  };

  const hasActiveFilters = Object.values(activeFilters).some(v =>
    Array.isArray(v) ? v.length > 0 : !!v
  );

  const records: Parameters<typeof SearchResultCard>[0]['record'][] = searchResult.data ?? [];
  const total: number = searchResult.meta?.total ?? 0;

  return (
    <main id="main-content" className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="mb-1 text-2xl font-bold text-gray-900">Search Innovation Records</h1>
      <p className="mb-6 text-sm text-gray-600">
        Find innovation work using mission-problem language — no need to know project names or locations.
      </p>

      {/* Search form — client component wrapped in Suspense (uses useSearchParams) */}
      <Suspense fallback={null}>
        <SearchForm initialQuery={params.q ?? ''} />
      </Suspense>

      <div className="mt-6 flex gap-6">
        {/* Filter panel — sidebar */}
        <aside aria-label="Search filters" className="w-60 shrink-0">
          {facets ? (
            <Suspense fallback={null}>
              <FilterPanel
                facets={facets}
                activeFilters={activeFilters}
                currentQuery={params.q}
              />
            </Suspense>
          ) : (
            <p className="text-xs text-gray-400">Filters unavailable</p>
          )}
        </aside>

        {/* Results area */}
        <div className="min-w-0 flex-1">
          {/* Active filter chips */}
          {hasActiveFilters && (
            <Suspense fallback={null}>
              <ActiveFilters activeFilters={activeFilters} currentQuery={params.q} />
            </Suspense>
          )}

          {/* Result count — ARIA live region (WCAG 2.1 AA — screen reader announcement) */}
          <div
            role="status"
            aria-live="polite"
            aria-atomic="true"
            className="mb-4 text-sm text-gray-600"
          >
            {params.q
              ? `${total} result${total !== 1 ? 's' : ''} for "${params.q}"`
              : `${total} published innovation record${total !== 1 ? 's' : ''}`}
          </div>

          {/* Results list */}
          {records.length > 0 ? (
            <ul aria-label="Search results" className="space-y-4">
              {records.map(record => (
                <li key={record.id}>
                  <SearchResultCard record={record} query={params.q} />
                </li>
              ))}
            </ul>
          ) : (
            <div role="status" className="py-12 text-center">
              <p className="text-gray-500">
                {params.q
                  ? `No innovation records found for "${params.q}". Try broader terms or remove some filters.`
                  : 'No published innovation records yet.'}
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
