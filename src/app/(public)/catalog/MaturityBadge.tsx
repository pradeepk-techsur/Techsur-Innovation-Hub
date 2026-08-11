/**
 * MaturityBadge — Displays the maturity level of an innovation record.
 *
 * F1.3: Shows maturity value as a human-readable label.
 * F1.6: MUST be visually distinct from ReviewStatusBadge.
 *       Uses filled pill badges with level prefix (▲) to differentiate from
 *       outlined ReviewStatusBadge with checkmark prefix (✓).
 *       Different colors per maturity level (never confused with review status).
 *
 * SEC-11 context: Maturity is an independent axis from review status;
 *                 these badges communicate different trust signals.
 */

import type { MaturityValue } from '@/lib/db/types';

interface Props {
  maturity: MaturityValue;
}

const MATURITY_CONFIG: Record<
  MaturityValue,
  { label: string; className: string }
> = {
  idea: {
    label: 'Idea',
    className: 'bg-gray-100 text-gray-700 border border-gray-300',
  },
  evaluated_idea: {
    label: 'Evaluated Idea',
    className: 'bg-slate-100 text-slate-700 border border-slate-300',
  },
  experiment_poc: {
    label: 'Experiment / POC',
    className: 'bg-amber-100 text-amber-800 border border-amber-300',
  },
  prototype_pilot: {
    label: 'Prototype / Pilot',
    className: 'bg-blue-100 text-blue-800 border border-blue-300',
  },
  production_validated: {
    label: 'Production / Validated',
    className: 'bg-green-100 text-green-800 border border-green-300',
  },
  archived_retired: {
    label: 'Archived / Retired',
    className: 'bg-stone-100 text-stone-600 border border-stone-300',
  },
};

export function MaturityBadge({ maturity }: Props) {
  const config = MATURITY_CONFIG[maturity] ?? {
    label: maturity,
    className: 'bg-gray-100 text-gray-700 border border-gray-300',
  };

  return (
    // F1.6: filled pill with ▲ prefix distinguishes from ReviewStatusBadge's outlined + ✓ prefix
    <span
      aria-label={`Maturity: ${config.label}`}
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-semibold ${config.className}`}
    >
      <span aria-hidden="true">▲</span>
      {config.label}
    </span>
  );
}
