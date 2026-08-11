'use client';
/**
 * ActiveFilters — Renders one chip per active filter value.
 * Each chip has an × button to remove it from the URL params.
 * Removing a chip triggers a router.push with the updated URL.
 *
 * F2.3: Active filter chips display and can be individually removed.
 */

import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

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

interface ActiveFilterSet {
  maturity: string[];
  mission_areas: string[];
  technology_areas: string[];
  review_statuses: string[];
  contributing_offices: string[];
  reuse_potential?: string;
}

interface Chip {
  paramKey: string;
  value: string;
  label: string;
}

function buildChips(filters: ActiveFilterSet): Chip[] {
  const chips: Chip[] = [];

  filters.maturity.forEach(v =>
    chips.push({ paramKey: 'maturity[]', value: v, label: `Maturity: ${MATURITY_LABELS[v] ?? v}` })
  );
  filters.mission_areas.forEach(v =>
    chips.push({ paramKey: 'mission_areas[]', value: v, label: `Mission: ${v}` })
  );
  filters.technology_areas.forEach(v =>
    chips.push({ paramKey: 'technology_areas[]', value: v, label: `Technology: ${v}` })
  );
  filters.review_statuses.forEach(v =>
    chips.push({ paramKey: 'review_statuses[]', value: v, label: `Status: ${REVIEW_STATUS_LABELS[v] ?? v}` })
  );
  filters.contributing_offices.forEach(v =>
    chips.push({ paramKey: 'contributing_offices[]', value: v, label: `Office: ${v}` })
  );
  if (filters.reuse_potential) {
    chips.push({ paramKey: 'reuse_potential', value: filters.reuse_potential, label: `Reuse: ${filters.reuse_potential}` });
  }

  return chips;
}

interface Props {
  activeFilters: ActiveFilterSet;
  currentQuery?: string;
}

export function ActiveFilters({ activeFilters, currentQuery }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const removeFilter = useCallback(
    (chip: Chip) => {
      const params = new URLSearchParams(searchParams.toString());

      if (chip.paramKey === 'reuse_potential') {
        params.delete('reuse_potential');
      } else {
        const current = params.getAll(chip.paramKey);
        params.delete(chip.paramKey);
        current.filter(v => v !== chip.value).forEach(v => params.append(chip.paramKey, v));
      }
      params.delete('page');
      if (currentQuery) params.set('q', currentQuery);
      router.push(`/search?${params.toString()}`);
    },
    [router, searchParams, currentQuery]
  );

  const chips = buildChips(activeFilters);
  if (chips.length === 0) return null;

  return (
    <div aria-label="Active filters" className="mb-4 flex flex-wrap gap-2">
      <span className="text-xs font-medium text-gray-500 self-center">Filters:</span>
      {chips.map(chip => (
        <span
          key={`${chip.paramKey}:${chip.value}`}
          className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2.5 py-1 text-xs font-medium text-blue-800 ring-1 ring-inset ring-blue-200"
        >
          {chip.label}
          <button
            type="button"
            aria-label={`Remove filter: ${chip.label}`}
            onClick={() => removeFilter(chip)}
            className="ml-0.5 text-blue-600 hover:text-blue-900 focus:outline-none focus:ring-1 focus:ring-blue-500 rounded-full"
          >
            ×
          </button>
        </span>
      ))}
    </div>
  );
}
