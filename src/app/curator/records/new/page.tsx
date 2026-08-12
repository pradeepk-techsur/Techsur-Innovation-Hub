'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function NewRecordPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [problemStatement, setProblemStatement] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) {
      setError('Title is required to create a record.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch('/api/v1/curator/records', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: title.trim(), problem_statement: problemStatement.trim() }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        setError(data.message ?? 'Failed to create record.');
        setSubmitting(false);
        return;
      }
      const data = await res.json();
      router.push(`/curator/records/${data.data.id}`);
    } catch {
      setError('Network error. Please try again.');
      setSubmitting(false);
    }
  }

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Create New Record</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
            Title
          </label>
          <input
            id="title"
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="Enter a working title for this innovation record"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            maxLength={200}
            disabled={submitting}
            autoFocus
          />
          <p className="text-xs text-gray-500 mt-1">
            The slug will be auto-generated from the title. All other fields can be completed in the record editor.
          </p>
        </div>
        <div>
          <label htmlFor="problem_statement" className="block text-sm font-medium text-gray-700 mb-1">
            Problem Statement <span className="text-gray-400 font-normal">(optional — can be completed in the editor)</span>
          </label>
          <textarea
            id="problem_statement"
            value={problemStatement}
            onChange={e => setProblemStatement(e.target.value)}
            placeholder="Describe the mission problem this innovation work addresses"
            className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            disabled={submitting}
          />
        </div>
        {error && (
          <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded px-3 py-2">
            {error}
          </p>
        )}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 font-medium disabled:opacity-50"
          >
            {submitting ? 'Creating…' : 'Create Record'}
          </button>
          <a
            href="/curator/records"
            className="px-4 py-2 bg-white text-gray-700 border border-gray-300 rounded hover:bg-gray-50 font-medium"
          >
            Cancel
          </a>
        </div>
      </form>
    </div>
  );
}
