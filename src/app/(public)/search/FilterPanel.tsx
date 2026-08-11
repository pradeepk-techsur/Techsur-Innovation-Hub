'use client';
/**
 * FilterPanel — Faceted filter sidebar for the search page.
 *
 * F2.3: Provides checkboxes for all 6 filter dimensions.
 * Each checkbox updates URL params via router.push, which triggers the SSR page
 * to re-fetch with the new filters applied.
 * Accessible: <fieldset> + <legend> per group (WCAG 2.1 AA).
 */

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

interface FacetEntry {
  value: string;
  count: number;
}

interface FacetData {
  maturity: FacetEntry[];
  mission_areas: FacetEntry[];
  technology_areas: FacetEntry[];
  review_statuses: FacetEntry[];
  contributing_offices: FacetEntry[];
  reuse_potential: FacetEntry[];
}

const MATURITY_LABELS: Record<string, string> = {
  idea: 'Idea',
  evaluated_idea: 'Evaluated Idea',
  experiment_poc: 'Experiment / POC',
  prototype_pilot: 'Prototype / Pilot',
  production_validated: 'Production / Validated',
  archived_retired: 'Archived / Retired',
};

const REVIEW_STATUS_LABELS: Record<string, string> = {
  submitted: 'Submitted',
  curated_for_completeness: 'Curated',
  technically_reviewed: 'Technically Reviewed',
  security_reviewed: 'Security Reviewed',
  policy_reviewed: 'Policy Reviewed',
  validated_for_reuse: 'Validated for Reuse',
  superseded: 'Superseded',
  retired: 'Retired',
};

interface FilterPanelProps {
  facets: FacetData;
  activeFilters: Record<string, string | string[] | undefined>;
  currentQuery?: string;
}

export function FilterPanel({ facets, activeFilters, currentQuery }: FilterPanelProps) {
  return (
    <div className="space-y-6">
      <FilterGroup
        legend="Maturity"
        paramKey="maturity[]"
        entries={facets.maturity}
        active={(activeFilters.maturity as string[]) ?? []}
        labelMap={MATURITY_LABELS}
        currentQuery={currentQuery}
      />
      <FilterGroup
        legend="Mission Area"
        paramKey="mission_areas[]"
        entries={facets.mission_areas}
        active={(activeFilters.mission_areas as string[]) ?? []}
        currentQuery={currentQuery}
      />
      <FilterGroup
        legend="Technology Area"
        paramKey="technology_areas[]"
        entries={facets.technology_areas}
        active={(activeFilters.technology_areas as string[]) ?? []}
        currentQuery={currentQuery}
      />
      <FilterGroup
        legend="Review Status"
        paramKey="review_statuses[]"
        entries={facets.review_statuses}
        active={(activeFilters.review_statuses as string[]) ?? []}
        labelMap={REVIEW_STATUS_LABELS}
        currentQuery={currentQuery}
      />
      <FilterGroup
        legend="Contributing Office"
        paramKey="contributing_offices[]"
        entries={facets.contributing_offices}
        active={(activeFilters.contributing_offices as string[]) ?? []}
        currentQuery={currentQuery}
      />
    </div>
  );
}

interface FilterGroupProps {
  legend: string;
  paramKey: string;
  entries: FacetEntry[];
  active: string[];
  labelMap?: Record<string, string>;
  currentQuery?: string;
}

function FilterGroup({ legend, paramKey, entries, active, labelMap, currentQuery }: FilterGroupProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = useCallback(
    (value: string, checked: boolean) => {
      const params = new URLSearchParams(searchParams.toString());
      // Replace all existing values for this param key
      const current = params.getAll(paramKey);
      params.delete(paramKey);
      if (checked) {
        [...current, value].forEach(v => params.append(paramKey, v));
      } else {
        current.filter(v => v !== value).forEach(v => params.append(paramKey, v));
      }
      params.delete('page'); // reset to page 1 when filter changes
      if (currentQuery) {
        params.set('q', currentQuery);
      }
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams, paramKey, currentQuery]
  );

  if (entries.length === 0) return null;

  return (
    <fieldset>
      <legend className="mb-2 text-sm font-semibold text-gray-800">{legend}</legend>
      <ul className="space-y-1">
        {entries.map(entry => (
          <li key={entry.value}>
            <label className="flex cursor-pointer items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={active.includes(entry.value)}
                onChange={e => handleChange(entry.value, e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-700 focus:ring-blue-500"
              />
              <span className="flex-1">{labelMap?.[entry.value] ?? entry.value}</span>
              <span className="ml-auto text-xs text-gray-400">({entry.count})</span>
            </label>
          </li>
        ))}
      </ul>
    </fieldset>
  );
}
