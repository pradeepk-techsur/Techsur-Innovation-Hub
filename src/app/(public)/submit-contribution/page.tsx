import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { ContributionForm } from './ContributionForm';
import { Breadcrumb } from '@/components/Breadcrumb';

export default async function SubmitContributionPage() {
  const session = await getSession();
  if (!session) redirect('/login?returnTo=/submit-contribution');

  return (
    <main id="main-content" className="max-w-2xl mx-auto py-8 px-4">
      <Breadcrumb crumbs={[{ label: 'Home', href: '/' }, { label: 'Share Innovation Work' }]} />
      <h1 className="text-2xl font-bold">Share Existing Innovation Work</h1>
      <p className="text-gray-600 mt-2 mb-4">
        Do you have existing innovation work, a POC, a lessons-learned document, or a
        prototype that might benefit others? Share it here for curation consideration.
      </p>
      <p className="text-sm text-gray-500 mb-6">
        This is a separate flow from submitting a new opportunity. If you have a{' '}
        <a href="/submit-opportunity" className="text-blue-600 underline">mission problem to describe, use that form instead</a>.
      </p>

      {/* F7.4 — Non-endorsement statement upfront */}
      <div className="bg-amber-50 border border-amber-300 rounded p-4 mb-6" role="note" aria-label="Contribution notice">
        <p className="text-sm font-medium text-amber-800">
          Submitting existing work does not imply central endorsement. All contributions
          go through curation review before any publication. Your attribution and ownership
          information will be preserved throughout.
        </p>
      </div>

      <ContributionForm userInfo={{ name: session.name, email: session.email }} />
    </main>
  );
}
