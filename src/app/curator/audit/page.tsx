import { headers } from 'next/headers';

interface AuditEvent {
  audit_id: string;
  event_type: string;
  actor_name: string | null;
  event_data: Record<string, unknown> | null;
  target_type: string | null;
  target_title: string | null;
  occurred_at: string;
  notes: string | null;
}

async function getAuditEvents(page: number): Promise<{ data: AuditEvent[]; total: number } | null> {
  try {
    const headersList = await headers();
    const cookie = headersList.get('cookie') ?? '';
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/v1/curator/audit?page=${page}&page_size=50`,
      { cache: 'no-store', headers: { cookie } }
    );
    if (res.status === 403) return { data: [], total: -1 }; // admin-only signal
    if (!res.ok) return null;
    const json = await res.json();
    if (json.status !== 'ok') return null;
    return { data: json.data as AuditEvent[], total: json.meta.total as number };
  } catch {
    return null;
  }
}

// Format event_type to readable label
function formatEventType(type: string): string {
  return type.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

// F9.11 — global audit log page (admin-only — API enforces, not this page)
export default async function AuditLogPage() {
  const result = await getAuditEvents(1);

  if (!result) {
    return (
      <div className="text-red-600 py-8 text-center">
        <p>Unable to load audit log. Please refresh.</p>
      </div>
    );
  }

  // Admin-only: API returned 403 — curator should not see this page (layout guards role, but belt+suspenders)
  if (result.total === -1) {
    return (
      <div className="py-8 text-center">
        <p className="text-gray-600">Admin access required to view the global audit log.</p>
      </div>
    );
  }

  const events = result.data;

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Audit Log</h1>
        <p className="text-sm text-gray-600 mt-1">
          All material content, governance, lifecycle, and configuration changes — chronological, append-only.
          Showing {events.length} of {result.total} events (most recent first).
        </p>
      </div>

      {events.length === 0 ? (
        <p className="text-gray-500 text-sm py-8 text-center">No audit events recorded yet.</p>
      ) : (
        <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 font-medium text-gray-700 w-44">When</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 w-48">Event</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 w-36">Actor</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700">Target</th>
                <th className="text-left px-4 py-3 font-medium text-gray-700 w-24">Type</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {events.map((event) => (
                <tr key={event.audit_id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500 font-mono text-xs whitespace-nowrap">
                    {new Date(event.occurred_at).toLocaleString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </td>
                  <td className="px-4 py-3 text-gray-900">
                    <span className="font-medium">{formatEventType(event.event_type)}</span>
                  </td>
                  <td className="px-4 py-3 text-gray-700">{event.actor_name ?? '—'}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {event.target_title ?? '—'}
                    {event.notes && (
                      <span className="block text-xs text-gray-400 mt-0.5">{event.notes}</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-gray-500 text-xs">{event.target_type ?? '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
