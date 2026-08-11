import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { OpportunityForm } from './OpportunityForm';

export default async function SubmitOpportunityPage() {
  const session = await getSession();
  if (!session) redirect('/login?returnTo=/submit-opportunity');

  return (
    <main id="main-content" className="max-w-2xl mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold">Submit an Opportunity</h1>
      <p className="text-gray-600 mt-2 mb-6">
        Tell us about a mission problem or area of interest. We&apos;ll use this to
        understand where innovation could help — not to build a specific application.
      </p>

      {/* F6.4: Non-acceptance must be stated clearly and early */}
      <div
        className="bg-amber-50 border border-amber-300 rounded p-4 mb-6"
        role="note"
        aria-label="Submission notice"
      >
        <p className="text-sm font-medium text-amber-800">
          Submitting this form does not commit I&amp;R to any action or imply acceptance
          into the I&amp;R portfolio. Submissions enter a review process.
        </p>
      </div>

      <OpportunityForm userInfo={{ name: session.name, email: session.email, office: session.office }} />
    </main>
  );
}
