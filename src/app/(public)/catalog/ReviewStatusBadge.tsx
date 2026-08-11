/**
 * ReviewStatusBadge — Displays a single review status for an innovation record.
 *
 * F1.3: Shows review status as a human-readable label.
 * F1.6: MUST be visually distinct from MaturityBadge.
 *       Uses outlined/bordered badges with ✓ prefix (or 🛡 for security_reviewed)
 *       vs MaturityBadge's filled pill with ▲ prefix.
 * SEC-11: security_reviewed MUST be visually distinct from technically_reviewed —
 *         uses shield icon and purple color vs blue for technically_reviewed.
 */

interface Props {
  status: string;
}

const STATUS_CONFIG: Record<string, { label: string; className: string; icon: string }> = {
  submitted: {
    label: 'Submitted',
    className: 'border border-gray-400 text-gray-600 bg-transparent',
    icon: '✓',
  },
  curated_for_completeness: {
    label: 'Curated',
    className: 'border border-teal-500 text-teal-700 bg-transparent',
    icon: '✓',
  },
  technically_reviewed: {
    label: 'Technically Reviewed',
    className: 'border border-blue-500 text-blue-700 bg-transparent',
    icon: '✓',
  },
  // SEC-11: security_reviewed uses shield icon and purple color — visually distinct
  // from technically_reviewed (blue + checkmark) so they cannot be confused
  security_reviewed: {
    label: 'Security Reviewed',
    className: 'border border-purple-500 text-purple-700 bg-transparent',
    icon: '🛡',
  },
  policy_reviewed: {
    label: 'Policy Reviewed',
    className: 'border border-orange-500 text-orange-700 bg-transparent',
    icon: '✓',
  },
  validated_for_reuse: {
    label: 'Validated for Reuse',
    className: 'border border-green-600 text-green-700 bg-transparent',
    icon: '✓',
  },
  superseded: {
    label: 'Superseded',
    className: 'border border-gray-400 text-gray-500 bg-transparent',
    icon: '✓',
  },
  retired: {
    label: 'Retired',
    className: 'border border-stone-400 text-stone-500 bg-transparent',
    icon: '✓',
  },
};

export function ReviewStatusBadge({ status }: Props) {
  const config = STATUS_CONFIG[status] ?? {
    label: status,
    className: 'border border-gray-400 text-gray-600 bg-transparent',
    icon: '✓',
  };

  return (
    // F1.6: outlined badge with ✓/🛡 prefix distinguishes from MaturityBadge's filled pill + ▲ prefix
    <span
      aria-label={`Review status: ${config.label}`}
      className={`inline-flex items-center gap-1 rounded px-2.5 py-0.5 text-xs font-medium ${config.className}`}
    >
      <span aria-hidden="true">{config.icon}</span>
      {config.label}
    </span>
  );
}
