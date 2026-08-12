import { getRequestSession } from '@/lib/auth/middleware';
import { headers } from 'next/headers';

interface MaturityValue {
  value: string;
  label: string;
  description: string;
}

interface ReviewStatusValue {
  value: string;
  label: string;
  description: string;
}

interface PublicationGateField {
  field: string;
  requirement: string;
}

interface LifecycleState {
  state: string;
  description: string;
  allowedTransitionsTo: string[];
}

interface ContentModel {
  maturityValues: MaturityValue[];
  reviewStatusValues: ReviewStatusValue[];
  independenceRule: string;
  trustAxioms: string[];
  publicationGateFields: PublicationGateField[];
  lifecycleStates: LifecycleState[];
}

async function getContentModel(): Promise<ContentModel | null> {
  // SSR fetch via API — authenticates using the current request context
  try {
    const headersList = await headers();
    const cookie = headersList.get('cookie') ?? '';
    const res = await fetch(`${process.env.NEXTAUTH_URL ?? 'http://localhost:3000'}/api/v1/curator/reference`, {
      headers: { cookie },
      cache: 'no-store',
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.status === 'ok' ? (data.data as ContentModel) : null;
  } catch {
    return null;
  }
}

// F9.16 — content model reference page (SSR, curator-accessible)
export default async function ReferencePage() {
  const model = await getContentModel();

  if (!model) {
    return (
      <div className="text-gray-600 py-8 text-center">
        <p>Unable to load content model reference. Please refresh.</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Content Model Reference</h1>
        <p className="text-sm text-gray-600 mt-1">
          Authoritative definitions for maturity, review status, trust principles, and publication requirements.
        </p>
      </div>

      {/* Independence Rule — prominent callout */}
      <div className="mb-8 p-4 bg-amber-50 border border-amber-300 rounded-lg">
        <h2 className="text-sm font-semibold text-amber-900 mb-1 uppercase tracking-wide">
          Independence Rule
        </h2>
        <p className="text-amber-800 font-medium">{model.independenceRule}</p>
      </div>

      {/* Trust Axioms */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Trust Axioms</h2>
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <ul className="space-y-2">
            {model.trustAxioms.map((axiom, i) => (
              <li key={i} className="flex items-start gap-2 text-red-900">
                <span className="text-red-500 mt-0.5 shrink-0" aria-hidden>⚠</span>
                <span className="font-medium">{axiom}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Maturity Levels */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Maturity Levels
          <span className="ml-2 text-sm font-normal text-gray-500">({model.maturityValues.length} values)</span>
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700 w-48">Value</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 w-56">Label</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {model.maturityValues.map((m) => (
                <tr key={m.value}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{m.value}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{m.label}</td>
                  <td className="px-4 py-3 text-gray-600">{m.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Review Status Values */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Review Status Values
          <span className="ml-2 text-sm font-normal text-gray-500">({model.reviewStatusValues.length} values)</span>
        </h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700 w-48">Value</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 w-56">Label</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Description</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {model.reviewStatusValues.map((r) => (
                <tr key={r.value}>
                  <td className="px-4 py-3 font-mono text-xs text-gray-500">{r.value}</td>
                  <td className="px-4 py-3 font-medium text-gray-800">{r.label}</td>
                  <td className="px-4 py-3 text-gray-600">{r.description}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Publication Gate Requirements */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">
          Publication Gate Requirements
          <span className="ml-2 text-sm font-normal text-gray-500">
            ({model.publicationGateFields.length} fields required)
          </span>
        </h2>
        <p className="text-sm text-gray-600 mb-3">
          Records cannot be published unless all of the following fields meet requirements:
        </p>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700 w-1/3">#</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 w-1/3">Field</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Requirement</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {model.publicationGateFields.map((f, i) => (
                <tr key={f.field}>
                  <td className="px-4 py-3 text-gray-400 text-xs">{i + 1}</td>
                  <td className="px-4 py-3 font-mono text-xs text-gray-700">{f.field}</td>
                  <td className="px-4 py-3 text-gray-600">{f.requirement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* Lifecycle States */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Lifecycle States</h2>
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700 w-48">State</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Description</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Transitions To</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {model.lifecycleStates.map((ls) => (
                <tr key={ls.state}>
                  <td className="px-4 py-3 font-mono text-xs font-medium text-gray-700">{ls.state}</td>
                  <td className="px-4 py-3 text-gray-600">{ls.description}</td>
                  <td className="px-4 py-3 text-gray-500 text-xs">
                    {ls.allowedTransitionsTo.length > 0
                      ? ls.allowedTransitionsTo.join(', ')
                      : <em>Terminal state</em>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
