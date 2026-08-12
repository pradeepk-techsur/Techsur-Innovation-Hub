import { getSession } from '@/lib/auth/session';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';

interface DashboardData {
  records: {
    draft: number;
    submitted_for_review: number;
    published: number;
    superseded: number;
    archived: number;
    retired: number;
  };
  pendingOpportunities: number;
  pendingContributions: number;
  unreadEngagement: number;
}

async function getDashboardData(): Promise<DashboardData | null> {
  try {
    const cookieHeader = (await headers()).get('cookie') ?? '';
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/v1/curator/dashboard`,
      { cache: 'no-store', headers: { Cookie: cookieHeader } }
    );
    if (!res.ok) return null;
    return (await res.json()).data as DashboardData;
  } catch {
    return null;
  }
}

export default async function CuratorDashboardPage() {
  const session = await getSession();
  if (!session) redirect('/login?returnTo=/curator');

  const data = await getDashboardData();

  const stateLabels: Record<string, string> = {
    draft: 'Draft',
    submitted_for_review: 'Submitted for Review',
    published: 'Published',
    superseded: 'Superseded',
    archived: 'Archived',
    retired: 'Retired',
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      {data ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
          {/* Record state summary */}
          <div className="col-span-1 lg:col-span-2 bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Innovation Records</h2>
            <table className="w-full text-sm">
              <tbody>
                {Object.entries(data.records).map(([state, count]) => (
                  <tr key={state} className="border-t border-gray-100">
                    <td className="py-1.5 text-gray-700">{stateLabels[state] ?? state}</td>
                    <td className="py-1.5 text-right font-mono font-medium text-gray-900">
                      {count}
                    </td>
                    <td className="py-1.5 pl-3">
                      <a
                        href={`/curator/records?state=${state}`}
                        className="text-blue-600 hover:underline text-xs"
                      >
                        View
                      </a>
                    </td>
                  </tr>
                ))}
                <tr className="border-t border-gray-300">
                  <td className="py-1.5 font-semibold text-gray-900">Total</td>
                  <td className="py-1.5 text-right font-mono font-bold text-gray-900">
                    {Object.values(data.records).reduce((a, b) => a + b, 0)}
                  </td>
                  <td />
                </tr>
              </tbody>
            </table>
          </div>

          {/* Pending submissions */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Pending Submissions</h2>
            <div className="space-y-2 text-sm">
              <a
                href="/curator/submissions/opportunity"
                className="flex justify-between items-center hover:underline text-gray-700"
              >
                <span>Opportunities</span>
                <span className="font-mono font-bold text-gray-900">{data.pendingOpportunities}</span>
              </a>
              <a
                href="/curator/submissions/contribution"
                className="flex justify-between items-center hover:underline text-gray-700"
              >
                <span>Contributions</span>
                <span className="font-mono font-bold text-gray-900">{data.pendingContributions}</span>
              </a>
            </div>
          </div>

          {/* Engagement */}
          <div className="bg-white rounded-lg border border-gray-200 p-4">
            <h2 className="font-semibold text-gray-900 mb-3">Engagement</h2>
            <a
              href="/curator/engagement"
              className="flex justify-between items-center text-sm hover:underline text-gray-700"
            >
              <span>Unread requests</span>
              <span className="font-mono font-bold text-gray-900">{data.unreadEngagement}</span>
            </a>
          </div>
        </div>
      ) : (
        <p className="text-gray-500">Dashboard data unavailable.</p>
      )}

      <div className="mt-8">
        <a
          href="/curator/records/new"
          className="inline-block px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-medium"
        >
          + New Record
        </a>
        <a
          href="/curator/records"
          className="inline-block ml-3 px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 font-medium"
        >
          View All Records
        </a>
      </div>
    </div>
  );
}
