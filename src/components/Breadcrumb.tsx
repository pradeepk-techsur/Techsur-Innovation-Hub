/**
 * Breadcrumb — IA-04. USWDS 3 breadcrumb pattern.
 * Uses CSS custom properties from globals.css.
 * ARIA: nav + ol with aria-current="page" on last item.
 */

import Link from 'next/link';

export interface Crumb {
  label: string;
  href?: string;
}

interface Props {
  crumbs: Crumb[];
  /** Light variant for use on dark backgrounds (hero sections) */
  light?: boolean;
}

export function Breadcrumb({ crumbs, light = false }: Props) {
  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" style={{ marginBottom: '16px' }}>
      <ol
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          gap: '4px',
          listStyle: 'none',
          margin: 0,
          padding: 0,
          fontFamily: 'var(--font-ui)',
          fontSize: '0.875rem',
        }}
      >
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={index} style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              {index > 0 && (
                <span
                  aria-hidden="true"
                  style={{ color: light ? 'rgba(255,255,255,0.4)' : 'var(--color-light)' }}
                >
                  /
                </span>
              )}
              {isLast || !crumb.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  style={{
                    color: light ? 'rgba(255,255,255,0.75)' : 'var(--color-base)',
                    fontWeight: isLast ? 500 : 400,
                  }}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  style={{
                    color: light ? 'rgba(255,255,255,0.65)' : 'var(--color-blue-60)',
                    textDecoration: 'none',
                  }}
                >
                  {crumb.label}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
