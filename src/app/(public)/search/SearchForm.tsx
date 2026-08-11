'use client';
/**
 * SearchForm — Client component for the search query input.
 *
 * F2.1: Accepts problem-language queries; submits as GET to /search with q param.
 * Preserves active filter URL params on each submit (does not lose filters when
 * the user refines their query).
 * Resets to page 1 on each new search.
 * Accessible: <label> via sr-only, role="search" on the form, aria-label on input.
 */

import { useRouter, useSearchParams } from 'next/navigation';
import { FormEvent, useState } from 'react';

interface Props {
  initialQuery: string;
}

export function SearchForm({ initialQuery }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    if (query.trim()) {
      params.set('q', query.trim());
    } else {
      params.delete('q');
    }
    params.delete('page'); // reset to page 1 on new search
    router.push(`/search?${params.toString()}`);
  }

  return (
    <form role="search" onSubmit={handleSubmit} className="flex gap-2">
      <label htmlFor="search-input" className="sr-only">
        Search innovation records by problem or mission area
      </label>
      <input
        id="search-input"
        type="search"
        name="q"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Describe a mission problem or technology area..."
        aria-label="Search innovation records by problem or mission area"
        className="flex-1 rounded border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        autoComplete="off"
      />
      <button
        type="submit"
        className="rounded bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
      >
        Search
      </button>
    </form>
  );
}
