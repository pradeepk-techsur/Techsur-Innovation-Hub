/**
 * Breadcrumb — shared navigation context component (IA-04).
 *
 * Renders a breadcrumb trail on all non-home pages so users always know
 * where they are. Uses ARIA nav + ol with aria-current="page" on the last
 * crumb per WCAG 2.1 AA SC 2.4.8 (Location) and SC 2.4.4 (Link Purpose).
 */

import Link from 'next/link';

export interface Crumb {
  label: string;
  href?: string; // undefined for the current (last) crumb — no link rendered
}

interface Props {
  crumbs: Crumb[];
}

export function Breadcrumb({ crumbs }: Props) {
  if (crumbs.length === 0) return null;

  return (
    <nav aria-label="Breadcrumb" className="mb-4">
      <ol className="flex flex-wrap items-center gap-1 text-sm text-gray-500">
        {crumbs.map((crumb, index) => {
          const isLast = index === crumbs.length - 1;
          return (
            <li key={index} className="flex items-center gap-1">
              {index > 0 && (
                <span aria-hidden="true" className="text-gray-400 select-none">
                  /
                </span>
              )}
              {isLast || !crumb.href ? (
                <span
                  aria-current={isLast ? 'page' : undefined}
                  className={isLast ? 'font-medium text-gray-900' : 'text-gray-500'}
                >
                  {crumb.label}
                </span>
              ) : (
                <Link
                  href={crumb.href}
                  className="hover:underline hover:text-gray-700 transition-colors"
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
