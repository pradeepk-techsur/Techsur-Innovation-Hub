import { redirect } from 'next/navigation';
import { getSession } from '@/lib/auth/session';
import Link from 'next/link';

export default async function CuratorLayout({ children }: { children: React.ReactNode }) {
  const session = await getSession();

  // Server-side auth check — curator or admin required (AUTH-02, SEC-01)
  if (!session || (session.role !== 'curator' && session.role !== 'admin')) {
    redirect('/login?returnTo=/curator');
  }

  return (
    <div className="flex min-h-screen">
      {/* Curator sidebar nav */}
      <nav
        aria-label="Curator navigation"
        className="w-56 bg-gray-900 text-gray-100 flex flex-col p-4 shrink-0"
      >
        <div className="font-bold text-sm mb-6 text-gray-300">
          TSIO Innovation Hub
          <span className="block text-xs font-normal text-gray-500 mt-1">Curator</span>
        </div>
        <ul className="space-y-1 text-sm">
          <li><Link href="/curator" className="block px-3 py-2 rounded hover:bg-gray-700">Dashboard</Link></li>
          <li><Link href="/curator/records" className="block px-3 py-2 rounded hover:bg-gray-700">Records</Link></li>
          <li><Link href="/curator/records/new" className="block px-3 py-2 rounded hover:bg-gray-700">New Record</Link></li>
          <li className="border-t border-gray-700 mt-2 pt-2">
            <Link href="/curator/submissions/opportunity" className="block px-3 py-2 rounded hover:bg-gray-700">Opportunities</Link>
          </li>
          <li><Link href="/curator/submissions/contribution" className="block px-3 py-2 rounded hover:bg-gray-700">Contributions</Link></li>
          <li><Link href="/curator/engagement" className="block px-3 py-2 rounded hover:bg-gray-700">Engagement</Link></li>
          {session.role === 'admin' && (
            <>
              <li className="border-t border-gray-700 mt-2 pt-2">
                <Link href="/curator/settings" className="block px-3 py-2 rounded hover:bg-gray-700">Settings</Link>
              </li>
              <li><Link href="/curator/audit" className="block px-3 py-2 rounded hover:bg-gray-700">Audit Log</Link></li>
            </>
          )}
          <li className="border-t border-gray-700 mt-2 pt-2">
            <Link href="/curator/reference" className="block px-3 py-2 rounded hover:bg-gray-700">Content Model</Link>
          </li>
        </ul>
        <div className="mt-auto pt-4 border-t border-gray-700 text-xs text-gray-500">
          <p>{session.name}</p>
          <p>{session.role}</p>
        </div>
      </nav>
      <main id="main-content" className="flex-1 p-6 bg-gray-50">
        {children}
      </main>
    </div>
  );
}
