/**
 * ReviewStatusBadge — Square-cornered, uppercase, indigo-family.
 *
 * Spec (Color & Type Reference v0.1 — Review Status — Indigo):
 *   Security Reviewed — bg #3d4076 / text #ffffff — solid, highest consequence
 *   All other statuses — bg #e5e4fa / text #2b2c5e — soft indigo
 *
 * Shape: 2px border-radius (square corners).
 * Uppercase + 0.06em letter-spacing.
 * SEC-11: Visually distinct from MaturityBadge (pill, non-uppercase).
 */

interface Props {
  status: string;
}

const REVIEW_LABELS: Record<string, string> = {
  submitted:               'Submitted',
  curated_for_completeness:'Curated',
  technically_reviewed:    'Technical Review',
  security_reviewed:       'Security Reviewed',
  policy_reviewed:         'Policy Reviewed',
  validated_for_reuse:     'Validated for Reuse',
  superseded:              'Superseded',
  retired:                 'Retired',
};

function isSecurity(status: string): boolean {
  return status === 'security_reviewed';
}

export function ReviewStatusBadge({ status }: Props) {
  const label = REVIEW_LABELS[status] ?? status.replace(/_/g, ' ');
  const security = isSecurity(status);

  return (
    <span
      aria-label={`Review status: ${label}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        padding: '2px 8px',
        borderRadius: '2px',   /* square corners per spec */
        fontFamily: 'var(--font-ui)',
        fontSize: '0.6875rem', /* 11px */
        fontWeight: 700,
        letterSpacing: '0.06em',
        textTransform: 'uppercase',
        whiteSpace: 'nowrap',
        backgroundColor: security ? '#3d4076' : '#e5e4fa',
        color:           security ? '#ffffff'  : '#2b2c5e',
      }}
    >
      {label}
    </span>
  );
}
