import { getSession } from '@/lib/auth/session';
import { redirect, notFound } from 'next/navigation';
import { cookies } from 'next/headers';
import RecordEditor from './RecordEditor';

interface RecordPageProps {
  params: Promise<{ id: string }>;
}

async function getRecord(id: string) {
  try {
    const cookieHeader = (await cookies()).toString();
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000'}/api/v1/curator/records/${id}`,
      { cache: 'no-store', headers: { Cookie: cookieHeader } }
    );
    if (res.status === 404) return null;
    if (!res.ok) throw new Error(`Failed to fetch record: ${res.status}`);
    return (await res.json()).data;
  } catch {
    return null;
  }
}

export default async function RecordDetailPage({ params }: RecordPageProps) {
  const session = await getSession();
  if (!session) redirect('/login?returnTo=/curator/records');

  const { id } = await params;
  const record = await getRecord(id);

  if (!record) notFound();

  return (
    <div>
      <div className="mb-4">
        <a href="/curator/records" className="text-sm text-gray-500 hover:underline">
          ← Back to Records
        </a>
      </div>
      <RecordEditor record={record} />
    </div>
  );
}
