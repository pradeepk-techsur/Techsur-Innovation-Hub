/**
 * /catalog — Server-rendered innovation catalog page.
 *
 * AUTH-01: Accessible to anonymous users — no authentication required.
 * F1.1: Browsable catalog of published innovation records.
 * F1.2–F1.5: Each card shows trust signals per CatalogCard component.
 */

import { getPublishedCatalog } from '@/lib/repositories/innovation-records.repository';
import { CatalogCard } from './CatalogCard';
import { Breadcrumb } from '@/components/Breadcrumb';

export const metadata = {
  title: 'Innovation Catalog | TSIO Innovation Hub',
  description:
    'Browse published Judiciary innovation work: proofs of concept, pilots, and validated patterns from I&R teams.',
};

// Force dynamic rendering — this page fetches from PostgreSQL at runtime and cannot be statically prerendered at build time
export const dynamic = 'force-dynamic';

export default async function CatalogPage() {
  const records = await getPublishedCatalog();

  return (
    <main id="main-content" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Innovation Catalog' }]} />
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Innovation Catalog</h1>
        <p className="mt-1 text-sm text-gray-600">
          Discover innovation work from across the Judiciary.
        </p>
      </div>

      {records.length === 0 ? (
        <p className="text-gray-500">No published innovation records yet.</p>
      ) : (
        <ul
          aria-label="Innovation records catalog"
          className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 list-none p-0"
        >
          {records.map((record) => (
            <li key={record.id}>
              <CatalogCard record={record} />
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
