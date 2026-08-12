/**
 * MaturityBadge — Pill-shaped maturity indicator.
 *
 * Spec (Color & Type Reference v0.1 — Maturity Scale):
 *   Idea         #454545 on #ffffff, border #a9aeb1  — outlined, no fill
 *   Evaluated    #005ea2 on #ffffff                   — outlined, no fill
 *   Experiment   #1b1b1b on #ffbe2e                   — filled yellow
 *   Pilot        #ffffff on #00687d                   — filled teal
 *   Validated    #ffffff on #4d8055                   — filled green
 *   Archived     #565c65 on #dfe1e2                   — filled neutral
 *
 * Shape: pill radius (9999px). Three signals: color, label, shape.
 * SEC-11: Visually distinct from ReviewStatusBadge (which is square-cornered + uppercase).
 */

import type { MaturityValue } from '@/lib/db/types';

interface Props {
  maturity: MaturityValue;
}

// Label prefix: circle icon prefix differentiates from review badge (uppercase tag)
const MATURITY_CONFIG: Record<MaturityValue, {
  label: string;
  bg: string;
  color: string;
  border: string;
  prefix: string;
}> = {
  idea: {
    label: 'Idea',
    bg: '#ffffff',
    color: '#454545',
    border: '#a9aeb1',
    prefix: '○',
  },
  evaluated_idea: {
    label: 'Evaluated',
    bg: '#ffffff',
    color: '#005ea2',
    border: '#005ea2',
    prefix: '○',
  },
  experiment_poc: {
    label: 'Experiment / POC',
    bg: '#ffbe2e',
    color: '#1b1b1b',
    border: '#ffbe2e',
    prefix: '◐',
  },
  prototype_pilot: {
    label: 'Prototype / Pilot',
    bg: '#00687d',
    color: '#ffffff',
    border: '#00687d',
    prefix: '◕',
  },
  production_validated: {
    label: 'Validated Pattern',
    bg: '#4d8055',
    color: '#ffffff',
    border: '#4d8055',
    prefix: '●',
  },
  archived_retired: {
    label: 'Archived',
    bg: '#dfe1e2',
    color: '#565c65',
    border: '#dfe1e2',
    prefix: '◌',
  },
};

export function MaturityBadge({ maturity }: Props) {
  const config = MATURITY_CONFIG[maturity];
  if (!config) return null;

  return (
    <span
      aria-label={`Maturity: ${config.label}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '4px',
        padding: '3px 10px',
        borderRadius: '9999px',
        fontFamily: 'var(--font-ui)',
        fontSize: '0.75rem',
        fontWeight: 600,
        lineHeight: 1.4,
        whiteSpace: 'nowrap',
        backgroundColor: config.bg,
        color: config.color,
        border: `1.5px solid ${config.border}`,
      }}
    >
      <span aria-hidden="true" style={{ fontSize: '0.625rem' }}>
        {config.prefix}
      </span>
      {config.label}
    </span>
  );
}
