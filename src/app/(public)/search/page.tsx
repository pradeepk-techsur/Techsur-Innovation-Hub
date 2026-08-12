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
import { Breadcrumb } from '@/components/Breadcrumb';

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
    <div id="main-content" tabIndex={-1} style={{ backgroundColor: 'var(--color-surface)' }}>
      {/* Search hero */}
      <div style={{ backgroundColor: 'var(--color-blue-80)', padding: '40px 0 32px' }}>
        <div className="hub-container">
          <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Search' }]} light />
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
            Search Innovation Records
          </h1>
          <p
            style={{
              fontFamily: 'var(--font-ui)',
              fontSize: '1.0625rem',
              lineHeight: 1.6,
              color: 'rgba(255,255,255,0.75)',
              margin: '0 0 24px',
              maxWidth: '55ch',
            }}
          >
            Find innovation work using mission-problem language — no need to know project names or locations.
          </p>
          <Suspense fallback={null}>
            <SearchForm initialQuery={params.q ?? ''} />
          </Suspense>
        </div>
      </div>

      {/* Search results area */}
      <div className="hub-container" style={{ padding: '40px 24px 80px' }}>
        <div style={{ display: 'flex', gap: '40px' }}>
          {/* Filter panel */}
          <aside aria-label="Search filters" style={{ width: '240px', flexShrink: 0 }}>
            {facets ? (
              <Suspense fallback={null}>
                <FilterPanel
                  facets={facets}
                  activeFilters={activeFilters}
                  currentQuery={params.q}
                />
              </Suspense>
            ) : (
              <p style={{ fontFamily: 'var(--font-ui)', fontSize: '0.875rem', color: 'var(--color-base)' }}>
                Filters unavailable
              </p>
            )}
          </aside>

          {/* Results */}
          <div style={{ minWidth: 0, flex: 1 }}>
            {hasActiveFilters && (
              <Suspense fallback={null}>
                <ActiveFilters activeFilters={activeFilters} currentQuery={params.q} />
              </Suspense>
            )}

            {/* Result count — ARIA live region */}
            <div
              role="status"
              aria-live="polite"
              aria-atomic="true"
              style={{
                fontFamily: 'var(--font-ui)',
                fontSize: '0.875rem',
                color: 'var(--color-base)',
                marginBottom: '20px',
              }}
            >
              {params.q
                ? `${total} result${total !== 1 ? 's' : ''} for "${params.q}"`
                : `${total} published innovation record${total !== 1 ? 's' : ''}`}
            </div>

            {records.length > 0 ? (
              <ul aria-label="Search results" style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {records.map(record => (
                  <li key={record.id}>
                    <SearchResultCard record={record} query={params.q} />
                  </li>
                ))}
              </ul>
            ) : (
              <div
                role="status"
                style={{
                  backgroundColor: 'var(--color-card)',
                  border: '1px solid var(--color-hairline)',
                  borderRadius: 'var(--radius-card)',
                  padding: '48px 40px',
                  textAlign: 'center',
                }}
              >
                <p style={{ fontFamily: 'var(--font-ui)', fontSize: '1rem', color: 'var(--color-base)', margin: 0 }}>
                  {params.q
                    ? `No records found for "${params.q}". Try broader terms or remove some filters.`
                    : 'No published innovation records yet.'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
